import os
import time
import threading
import requests
import logging
from typing import Optional, Literal
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic import BaseModel, Field, field_validator
from openai import OpenAI
from duckduckgo_search import DDGS
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, InputMediaPhoto

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

# Cargar entorno
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing SUPABASE_URL or SUPABASE_KEY")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
bot = telebot.TeleBot(TELEGRAM_BOT_TOKEN) if TELEGRAM_BOT_TOKEN else None


class ProductEnrichment(BaseModel):
    title_meli: str = Field(description="Título optimizado para Mercado Libre, máximo 60 caracteres.")
    description: str = Field(description="Descripción de 3 párrafos orientada a la venta, detallando posibles fallas.")
    brand: str = Field(description="La marca extraída (ej. Samsung, Relife). Si no se sabe, pon 'Generico'.")
    model: str = Field(description="El modelo exacto compatible.")
    condition: Literal["new", "used"] = Field(default="new", description="Condición, por defecto 'new'.")
    ean: str = Field(default="NA", description="Código Universal (EAN/UPC). MUST be 'NA' si no estás 100% seguro.")

    @field_validator('ean')
    def validate_ean(cls, v):
        if v.upper() != 'NA' and len(v) < 8:
            raise ValueError("EAN must be 'NA' or a valid length barcode. AI is hallucinating.")
        return v
    
    @field_validator('title_meli')
    def validate_title(cls, v):
        if len(v) > 60:
            raise ValueError("Title exceeds 60 characters limit.")
        return v


def enrich_with_ai(raw_name: str, max_retries: int = 3) -> Optional[ProductEnrichment]:
    if not ai_client:
        return None
    system_prompt = """Eres experto en e-commerce de repuestos. 
    ZONA DE PELIGRO: NUNCA inventes EAN ni compatibilidades cruzadas dudosas. Sé conservador."""
    for attempt in range(max_retries):
        try:
            response = ai_client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Producto crudo: {raw_name}"}
                ],
                response_format=ProductEnrichment,
                temperature=0.2
            )
            return response.choices[0].message.parsed
        except Exception as e:
            logger.warning(f"Intento {attempt + 1} fallido por validación recursiva o error: {e}")
            if attempt == max_retries - 1:
                return None
            time.sleep(2)


def search_images(query: str, num_images: int = 3) -> list[str]:
    try:
        results = DDGS().images(keywords=query, region="wt-wt", safesearch="off", size="Medium", max_results=num_images)
        return [r["image"] for r in results] if results else []
    except Exception as e:
        logger.error(f"Error buscando imagen para '{query}': {e}")
        return []


def upload_image_to_supabase(product_id: str, image_bytes: bytes) -> Optional[str]:
    file_path = f"enriched/{product_id}.jpg"
    try:
        try:
            supabase.storage.create_bucket("product_images", options={"public": True})
        except Exception:
            pass
        supabase.storage.from_("product_images").upload(file=image_bytes, path=file_path, file_options={"content-type": "image/jpeg", "upsert": "true"})
        return supabase.storage.from_("product_images").get_public_url(file_path)
    except Exception as e:
        logger.error(f"Error subiendo imagen: {e}")
        return None


def process_pending_products():
    try:
        res = supabase.table("products").select("id, name").is_("description", "null").limit(5).execute()
        products = res.data
    except Exception as e:
        logger.error(f"Error DB: {e}")
        return

    for p in products:
        product_id = p["id"]
        raw_name = p["name"]
        
        enrichment = enrich_with_ai(raw_name)
        if not enrichment:
            supabase.table("products").update({"description": "ENRICHMENT_FAILED"}).eq("id", product_id).execute()
            continue
            
        image_urls = search_images(f"{enrichment.brand} {enrichment.model} repuesto", num_images=3)
        
        state = {
            "status": "pending_telegram_approval",
            "enrichment": enrichment.model_dump(),
            "images": image_urls
        }
        supabase.table("products").update({
            "description": "PENDING_APPROVAL", 
            "media_metadata": state
        }).eq("id", product_id).execute()
        
        if bot and TELEGRAM_CHAT_ID:
            try:
                # 1. Enviar grupo de fotos
                if image_urls:
                    media_group = [InputMediaPhoto(url, caption=f"Opción {i+1}") for i, url in enumerate(image_urls)]
                    bot.send_media_group(TELEGRAM_CHAT_ID, media_group)
                
                # 2. Enviar botones
                markup = InlineKeyboardMarkup()
                for idx, url in enumerate(image_urls):
                    markup.add(InlineKeyboardButton(f"Opción {idx+1}", callback_data=f"img:{product_id}:{idx}"))
                markup.add(InlineKeyboardButton("Ninguna foto", callback_data=f"img:{product_id}:none"))
                
                text = f"📦 *{enrichment.title_meli}*\nMarca: {enrichment.brand} | Modelo: {enrichment.model}\nSelecciona una foto:"
                bot.send_message(TELEGRAM_CHAT_ID, text, reply_markup=markup, parse_mode="Markdown")
            except Exception as e:
                logger.error(f"Error enviando a Telegram: {e}")


@bot.callback_query_handler(func=lambda call: call.data.startswith('img:')) if bot else None
def handle_image_selection(call):
    parts = call.data.split(':')
    product_id, action = parts[1], parts[2]
    
    bot.edit_message_text("Procesando y guardando...", chat_id=call.message.chat.id, message_id=call.message.message_id)
    
    res = supabase.table("products").select("media_metadata").eq("id", product_id).execute()
    if not res.data:
        return
        
    metadata = res.data[0].get("media_metadata", {})
    enrichment = metadata.get("enrichment")
    if not enrichment:
        bot.edit_message_text("Error: Datos no encontrados.", chat_id=call.message.chat.id, message_id=call.message.message_id)
        return
        
    image_url_supabase = None
    if action != "none":
        idx = int(action)
        original_url = metadata["images"][idx]
        try:
            image_bytes = requests.get(original_url, timeout=10).content
            image_url_supabase = upload_image_to_supabase(product_id, image_bytes)
        except Exception as e:
            logger.error(f"Error descargando imagen aprobada: {e}")
            
    update_payload = {
        "name": enrichment["title_meli"],
        "description": enrichment["description"],
        "meta_title": enrichment["brand"],
        "meta_description": enrichment["model"],
        "barcode": enrichment["ean"] if enrichment["ean"] != 'NA' else None,
        "media_metadata": {} # clear pending state
    }
    
    if image_url_supabase:
        update_payload["image_url"] = image_url_supabase
        update_payload["og_image"] = image_url_supabase
        
    supabase.table("products").update(update_payload).eq("id", product_id).execute()
    bot.edit_message_text(f"✅ ¡Producto Publicado!\n{enrichment['title_meli']}", chat_id=call.message.chat.id, message_id=call.message.message_id)


def start_telegram_bot():
    logger.info("Iniciando Telegram Bot Listener...")
    while True:
        try:
            bot.polling(none_stop=True, timeout=60)
        except Exception as e:
            logger.error(f"Error en Telegram polling: {e}")
            time.sleep(5)


def main():
    logger.info("AI Catalog Worker (Telegram Edition) iniciado.")
    
    if bot:
        t = threading.Thread(target=start_telegram_bot, daemon=True)
        t.start()
    else:
        logger.warning("TELEGRAM_BOT_TOKEN no configurado. Se saltará la fase de aprobación.")

    while True:
        try:
            process_pending_products()
        except Exception as e:
            logger.error(f"Error crítico: {e}")
        time.sleep(15)

if __name__ == "__main__":
    main()
