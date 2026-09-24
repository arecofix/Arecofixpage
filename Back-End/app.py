import os
import uuid
from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Producto, Cliente, ServicioTecnico, Admin, Marca, Categoria, Order, OrderItem, CashMovement
import jwt
import datetime
import sys
from functools import wraps
import requests
import psycopg2
import json
from flask import Response, stream_with_context
import werkzeug

# 1. Configuración de Rutas Seguras y Compatibles (Windows/Linux)
if getattr(sys, 'frozen', False):
    # PyInstaller extracts bundled files to _MEIPASS
    bundle_dir = getattr(sys, '_MEIPASS', Path(sys.executable).resolve().parent)
    BASE_DIR = Path(bundle_dir)
    
    # Store sqlite db in %APPDATA%\Arecofix for read/write access
    app_data = Path(os.environ.get('APPDATA', 'C:/')) / 'Arecofix'
    app_data.mkdir(parents=True, exist_ok=True)
    db_path = app_data / 'arecofix_local.sqlite'
    
    # Copy seed db if it doesn't exist
    seed_db = BASE_DIR / 'arecofix_local.sqlite'
    if not db_path.exists() and seed_db.exists():
        import shutil
        shutil.copy(seed_db, db_path)
        
    env_path = BASE_DIR / ".env"
else:
    BASE_DIR = Path(__file__).resolve().parent
    env_path = BASE_DIR / ".env"
    db_path = BASE_DIR / 'arecofix_local.sqlite'

# Cargar variables de entorno (Supabase etc)
load_dotenv(dotenv_path=env_path)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4200")

app = Flask(__name__)

# 2. Habilitar CORS de manera robusta
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": [FRONTEND_URL, "http://localhost:4200", "http://127.0.0.1:4200", "http://localhost:1420", "https://arecofix.com.ar"]}})

# --- SQLite LOCAL Configuration ---
# Usamos pathlib para asegurar compatibilidad de barras
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'local-offline-engine-secret-key-2026')

db.init_app(app)

# ----------------- Rutas de la API -----------------

@app.route('/api/suggest', methods=['POST'])
def suggest():
    data = request.json
    content = data.get('content')
    if not content:
        return jsonify({"error": "Content is required"}), 400
        
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        print("Sugerencia local:", content)
        return jsonify({"message": "Local mode, suggestion received"}), 200
        
    # Get the tenant_id first
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    
    try:
        tenant_res = requests.get(f"{url}/rest/v1/tenants?limit=1&select=id", headers=headers)
        tenant_id = None
        if tenant_res.ok and len(tenant_res.json()) > 0:
            tenant_id = tenant_res.json()[0]['id']
            
        payload = {
            "name": "Usuario Anonimo (Chatbot)",
            "email": "chatbot@arecofix.com.ar",
            "phone": "N/A",
            "subject": "Sugerencia para la IA",
            "message": f"Contenido Sugerido:\n\n{content}",
            "is_read": False,
            "tenant_id": tenant_id
        }
        
        headers["Prefer"] = "return=minimal"
        res = requests.post(f"{url}/rest/v1/contact_messages", headers=headers, json=payload)
        res.raise_for_status()
        return jsonify({"message": "Sugerencia enviada correctamente"}), 200
    except Exception as e:
        print("Error submitting suggestion:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/favicon.ico')
def favicon():
    return '', 204

@app.route('/', methods=['GET'])
def home():
    """Ruta raíz con un chatbot en vivo."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    chatbot_secret = os.getenv("CHATBOT_SECRET", "0GLFFVCUthNF8nfwAV5Q2xQQpYYIyzWA1g0Pt3xPyIs=")
    tenant_id = "00000000-0000-0000-0000-000000000000"
    if url and key:
        try:
            headers = {"apikey": key, "Authorization": f"Bearer {key}"}
            tenant_res = requests.get(f"{url}/rest/v1/tenants?limit=1&select=id", headers=headers)
            if tenant_res.ok and len(tenant_res.json()) > 0:
                tenant_id = tenant_res.json()[0]['id']
        except Exception:
            pass
            
    html = r"""
<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arecofix - Asistente IA Avanzado</title>
    <link rel="icon" type="image/x-icon" href="https://arecofix.com.ar/assets/img/brands/logo/Logo.ico" />
    <link rel="apple-touch-icon" href="https://arecofix.com.ar/assets/img/brands/logo/Logo.png" />
    <!-- Tailwind and DaisyUI CDN -->
    <link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css" rel="stylesheet" type="text/css" />
    <script>
        // Suprimir advertencia de Tailwind CDN en consola para entorno de producción
        const originalWarn = console.warn;
        console.warn = function(msg) {
            if (typeof msg === 'string' && msg.includes('cdn.tailwindcss.com should not be used in production')) return;
            originalWarn.apply(console, arguments);
        };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Custom tweaks for the full page chat experience */
        .chat-container { height: calc(100vh - 70px); }
        .message-bubble { max-width: 85%; }
        .typing-dot { animation: typing 1.4s infinite ease-in-out both; }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.5); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.8); }
    </style>
</head>
<body class="bg-base-200 text-base-content h-screen w-screen overflow-hidden flex flex-col md:flex-row">
    
    <!-- Sidebar (Desktop) / Drawer (Mobile) -->
    <div class="drawer md:drawer-open w-auto z-50">
        <input id="sidebar-drawer" type="checkbox" class="drawer-toggle" />
        
        <div class="drawer-content flex flex-col md:hidden w-full absolute top-0 left-0 p-2">
            <!-- Mobile Header with Hamburger -->
            <div class="navbar bg-base-100 rounded-box shadow-sm min-h-12 h-14">
                <div class="flex-none">
                    <label for="sidebar-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost btn-sm">
                        <i class="fas fa-bars text-lg"></i>
                    </label>
                </div>
                <div class="flex-1 px-2 font-bold text-primary">
                    <i class="fas fa-robot mr-2"></i> Asistente IA
                </div>
                <div class="flex-none">
                    <button class="btn btn-square btn-ghost btn-sm theme-controller" onclick="toggleTheme()">
                        <i class="fas fa-moon text-lg" id="theme-icon-mobile"></i>
                    </button>
                </div>
            </div>
        </div> 

        <div class="drawer-side">
            <label for="sidebar-drawer" aria-label="close sidebar" class="drawer-overlay"></label> 
            <ul class="menu p-4 w-72 h-full bg-base-100 text-base-content flex flex-col shadow-xl md:shadow-none border-r border-base-300">
                <!-- Sidebar Header -->
                <li class="mb-4">
                    <a href="https://arecofix.com.ar" class="text-xl font-black text-primary hover:bg-transparent">
                        <i class="fas fa-microchip"></i> Arecofix Engine
                    </a>
                </li>
                
                <li class="menu-title"><span>Acciones</span></li>
                <li><a onclick="clearChat()"><i class="fas fa-plus"></i> Nueva Conversación</a></li>
                <li><a onclick="suggestMaterialModal.showModal()"><i class="fas fa-lightbulb text-warning"></i> Sugerir Conocimiento</a></li>
                
                <div class="divider"></div>
                
                <li class="menu-title"><span>Accesibilidad</span></li>
                <li>
                    <a onclick="toggleTheme()" class="flex justify-between">
                        <span><i class="fas fa-palette w-5"></i> Tema</span>
                        <span id="theme-text" class="text-xs font-bold badge badge-neutral">Claro</span>
                    </a>
                </li>
                
                <!-- Push to bottom -->
                <div class="mt-auto">
                    <div class="alert alert-info shadow-sm text-sm p-3 rounded-xl bg-info/10 border-info/20 text-info-content">
                        <i class="fas fa-info-circle shrink-0"></i>
                        <span>Motor Offline Llama 3 - Conectado a la API.</span>
                    </div>
                </div>
            </ul>
        </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col h-screen relative bg-base-200">
        
        <!-- Desktop Header (Hidden on Mobile) -->
        <div class="hidden md:flex items-center justify-between p-4 bg-base-100/50 backdrop-blur-md border-b border-base-300">
            <div class="font-semibold text-lg flex items-center gap-2">
                Asistente Virtual Arecofix <span class="badge badge-success badge-sm">En línea</span>
            </div>
        </div>

        <!-- Chat Container -->
        <div id="chat-container" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-32">
            <!-- Initial Welcome Message -->
            <div class="chat chat-start animate-fade-in-up">
                <div class="chat-image avatar">
                    <div class="w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shadow-sm">
                        <i class="fas fa-robot text-xl"></i>
                    </div>
                </div>
                <div class="chat-header text-xs opacity-70 mb-1">Asistente IA</div>
                <div class="chat-bubble bg-[#eefbf4] border border-[#22c55e]/30 text-neutral-900 shadow-md text-sm md:text-base leading-relaxed">
                    ¡Hola! Soy la IA de Arecofix. Puedo ayudarte a diagnosticar problemas con equipos, consultar por cursos, o ver nuestra oferta de servicios. ¿En qué te puedo ayudar?
                </div>
            </div>
        </div>

        <!-- Input Area (Fixed at bottom) -->
        <div class="absolute bottom-0 w-full bg-gradient-to-t from-base-200 via-base-200 to-transparent pt-6 pb-4 px-4 md:px-6">
            <div class="w-full">
                <form id="chat-form" class="relative bg-base-100 shadow-xl rounded-2xl border border-base-300 focus-within:border-primary transition-colors duration-300">
                    <textarea 
                        id="message-input" 
                        class="textarea textarea-ghost w-full resize-none min-h-[56px] max-h-[200px] text-base leading-relaxed py-4 pl-4 pr-14 focus:bg-transparent focus:outline-none focus:ring-0 overflow-hidden" 
                        placeholder="Preguntá cualquier cosa..."
                        rows="1"
                    ></textarea>
                    <button 
                        type="button" 
                        id="mic-btn"
                        class="absolute right-12 bottom-2 btn btn-circle btn-ghost btn-sm text-gray-500"
                        title="Dictado por voz"
                    >
                        <i class="fas fa-microphone"></i>
                    </button>
                    <button 
                        type="submit" 
                        id="send-btn"
                        class="absolute right-2 bottom-2 btn btn-circle btn-primary btn-sm shadow-md"
                        disabled
                    >
                        <i class="fas fa-arrow-up"></i>
                    </button>
                </form>
                <div class="text-center mt-2">
                    <p class="text-xs text-base-content/50">La IA puede cometer errores. Considera verificar la información importante.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Suggest Material -->
    <dialog id="suggestMaterialModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box bg-base-100">
            <h3 class="font-bold text-lg"><i class="fas fa-lightbulb text-warning mr-2"></i> Sugerir Conocimiento</h3>
            <p class="py-4 text-sm text-base-content/80">
                ¿Tienes algún manual, link, o procedimiento que deberíamos enseñarle a la IA? Envíalo y el administrador lo revisará para agregarlo a la base de conocimiento.
            </p>
            <form id="suggest-form">
                <textarea id="suggest-input" class="textarea textarea-bordered w-full h-32 text-sm" placeholder="Pega un link, manual o explicación detallada aquí..." required></textarea>
                <div id="suggest-alert" class="alert alert-success mt-4 hidden text-sm py-2">
                    <i class="fas fa-check-circle"></i> Sugerencia enviada al administrador. ¡Gracias!
                </div>
                <div id="suggest-error" class="alert alert-error mt-4 hidden text-sm py-2">
                    <i class="fas fa-times-circle"></i> Error al enviar.
                </div>
                <div class="modal-action">
                    <button type="button" class="btn" onclick="suggestMaterialModal.close()">Cancelar</button>
                    <button type="submit" class="btn btn-primary" id="suggest-submit-btn">Enviar Sugerencia</button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

    <script>
        const form = document.getElementById('chat-form');
        const input = document.getElementById('message-input');
        let chatHistory = [];
        
        const container = document.getElementById('chat-container');
        const sendBtn = document.getElementById('send-btn');
        let currentTheme = 'light';
        const waNumberRegex = /(whatsapp|11\s*2596\s*0900?|contacto)/i;

        // Auto-resize textarea
        input.addEventListener('input', function() {
            this.style.height = '56px';
            const newHeight = this.scrollHeight;
            this.style.height = newHeight + 'px';
            if (newHeight >= 200) {
                this.style.overflowY = 'auto';
            } else {
                this.style.overflowY = 'hidden';
            }
            sendBtn.disabled = this.value.trim().length === 0;
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if(this.value.trim()) form.requestSubmit();
            }
        });

        function toggleTheme() {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            document.getElementById('theme-text').innerText = currentTheme === 'light' ? 'Claro' : 'Oscuro';
            document.getElementById('theme-icon-mobile').className = currentTheme === 'light' ? 'fas fa-moon text-lg' : 'fas fa-sun text-lg';
        }

        function clearChat() {
            // Keep only the first welcome message
            const welcome = container.firstElementChild;
            container.innerHTML = '';
            container.appendChild(welcome);
            chatHistory = [];
            // Close drawer on mobile
            document.getElementById('sidebar-drawer').checked = false;
        }

        function addMessage(content, isUser = false) {
            const wrapper = document.createElement('div');
            wrapper.className = `chat ${isUser ? 'chat-end' : 'chat-start'} animate-fade-in-up`;
            
            const avatarHtml = isUser 
                ? `<div class="w-10 rounded-full bg-base-300 text-base-content/70 flex items-center justify-center shadow-sm"><i class="fas fa-user"></i></div>`
                : `<div class="w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shadow-sm"><i class="fas fa-robot text-xl"></i></div>`;
            
            const bubbleClass = isUser 
                ? 'chat-bubble chat-bubble-neutral text-neutral-content shadow-md text-sm md:text-base leading-relaxed' 
                : 'chat-bubble bg-[#eefbf4] border border-[#22c55e]/30 text-neutral-900 shadow-md text-sm md:text-base leading-relaxed';
            
            wrapper.innerHTML = `
                <div class="chat-image avatar">${avatarHtml}</div>
                <div class="chat-header text-xs opacity-70 mb-1">${isUser ? 'Tú' : 'Asistente IA'}</div>
                <div class="${bubbleClass}" style="white-space: pre-wrap;">${content}</div>
            `;
            
            container.appendChild(wrapper);
            container.scrollTop = container.scrollHeight;
            return wrapper.querySelector('.chat-bubble');
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            input.value = '';
            input.style.height = '56px';
            input.disabled = true;
            sendBtn.disabled = true;

            addMessage(text, true);
            chatHistory.push({ role: 'user', content: text });
            
            // Add loading typing indicator
            const loadingWrapper = document.createElement('div');
            loadingWrapper.className = 'chat chat-start';
            loadingWrapper.innerHTML = `
                <div class="chat-image avatar">
                    <div class="w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shadow-sm"><i class="fas fa-robot text-xl"></i></div>
                </div>
                <div class="chat-bubble bg-base-100 border border-base-300 shadow-md flex items-center gap-1 px-4 py-3">
                    <div class="w-2 h-2 rounded-full bg-base-content/40 typing-dot"></div>
                    <div class="w-2 h-2 rounded-full bg-base-content/40 typing-dot"></div>
                    <div class="w-2 h-2 rounded-full bg-base-content/40 typing-dot"></div>
                </div>
            `;
            container.appendChild(loadingWrapper);
            container.scrollTop = container.scrollHeight;

            try {
                const res = await fetch('https://arecofix-rag-chatbot.ezequielenrico15.workers.dev/chat/stream', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer {{ CHATBOT_SECRET }}'
                    },
                    body: JSON.stringify({ 
                        question: text,
                        tenant_id: '{{ TENANT_ID }}',
                        history: chatHistory.slice(-6)
                    })
                });
                
                container.removeChild(loadingWrapper);

                if (!res.ok) {
                    addMessage('En este momento estoy procesando muchas consultas, intentá de nuevo en unos segundos.');
                    throw new Error('Network error');
                }
                
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                
                const replyBubble = addMessage('');
                let fullResponse = '';
                let buffer = '';
                
                let done = false;
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) {
                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || '';
                        for (const line of lines) {
                            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                try {
                                    const data = JSON.parse(line.substring(6));
                                    if (data.response) {
                                        fullResponse += data.response;
                                        replyBubble.innerText = fullResponse;
                                        container.scrollTop = container.scrollHeight;
                                    }
                                } catch (e) {}
                            }
                        }
                    }
                }
                
                // Parche para el número de WhatsApp con formato espaciado
                fullResponse = fullResponse.replace(/11\s*2596\s*0900?\b/g, '11 2596 0900');
                replyBubble.innerHTML = md.render(fullResponse);
                
                // Guardar respuesta del bot en historial
                chatHistory.push({ role: 'assistant', content: fullResponse });
                
                // Si menciona WhatsApp, inyectar el botón
                if(waNumberRegex.test(fullResponse)) {
                    replyBubble.innerHTML += `
                        <div class="mt-4">
                            <a href="https://wa.me/541125960900" target="_blank" class="btn btn-sm btn-success rounded-full shadow-sm text-white border-none">
                                <i class="fab fa-whatsapp text-lg"></i> Escribirnos por WhatsApp
                            </a>
                        </div>
                    `;
                    container.scrollTop = container.scrollHeight;
                }
                
            } catch (err) {
                if (container.contains(loadingWrapper)) container.removeChild(loadingWrapper);
            } finally {
                input.disabled = false;
                input.focus();
            }
        });

        // Handle Suggestions
        document.getElementById('suggest-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = document.getElementById('suggest-input').value;
            const btn = document.getElementById('suggest-submit-btn');
            const success = document.getElementById('suggest-alert');
            const err = document.getElementById('suggest-error');
            
            btn.disabled = true;
            btn.innerHTML = '<span class="loading loading-spinner loading-sm"></span> Enviando...';
            success.classList.add('hidden');
            err.classList.add('hidden');
            
            try {
                const res = await fetch('/api/suggest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: text })
                });
                if(res.ok) {
                    success.classList.remove('hidden');
                    document.getElementById('suggest-input').value = '';
                    setTimeout(() => suggestMaterialModal.close(), 2000);
                } else {
                    throw new Error('Failed');
                }
            } catch(e) {
                err.classList.remove('hidden');
            } finally {
                btn.disabled = false;
                btn.innerText = 'Enviar Sugerencia';
            }
        });
        // Voice Recognition Support
        const micBtn = document.getElementById('mic-btn');
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'es-AR';

            let isRecording = false;

            recognition.onstart = function() {
                isRecording = true;
                micBtn.classList.add('text-error', 'animate-pulse');
                micBtn.classList.remove('text-gray-500');
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                input.value += (input.value ? ' ' : '') + transcript;
                input.dispatchEvent(new Event('input')); // trigger resize and enable send
            };

            recognition.onerror = function(event) {
                console.error('Speech recognition error', event.error);
                stopRecordingUI();
            };

            recognition.onend = function() {
                stopRecordingUI();
            };

            function stopRecordingUI() {
                isRecording = false;
                micBtn.classList.remove('text-error', 'animate-pulse');
                micBtn.classList.add('text-gray-500');
            }

            micBtn.addEventListener('click', () => {
                if (isRecording) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
        } else {
            micBtn.style.display = 'none'; // Hide if not supported
        }
    </script>
</body>
</html>
"""
    return render_template_string(html, CHATBOT_SECRET=chatbot_secret, TENANT_ID=tenant_id)

@app.route('/api/health', methods=['GET'])
def get_health():

    """Endpoint para verificar que el backend está vivo y accesible (Health Check)."""
    data_folder = BASE_DIR / "data" / "uploads"
    return jsonify({
        "status": "ok",
        "message": "Backend Flask funcionando correctamente",
        "os_path_example": str(data_folder),
        "server": "Arecofix Engine",
        "version": "1.0.0",
        "mode": "Offline-First"
    })

# --- WHATSAPP WEBHOOK ---

@app.route('/webhook', methods=['GET'])
def verify_webhook():
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')
    
    # Token de verificación para Meta
    VERIFY_TOKEN = os.getenv('WHATSAPP_VERIFY_TOKEN', 'arecofix_secreto_123')
    
    if mode and token:
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            print("WEBHOOK VERIFICADO")
            return challenge, 200
        else:
            return 'Forbidden', 403
    return 'Bad Request', 400

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    body = request.json
    
    WHATSAPP_TOKEN = os.getenv('WHATSAPP_TOKEN', 'EAARLwIJnO30BSffKUOP87hknZCXDIo4rHfHpPLr7if3yVIg5CYByC5j6XvHBVhRVjvZBlSKKuoPKoYz0x4ASmSwLNAqk6C2bGclXvV3FxJsDGO6we7lg6luv0aBsFZBZASQqlfptsMxToIlD3H0ewcaooQIZBgCA7t4CXW9mLjygRnKThCAdo1tpjI3swKZAMQ0gZDZD')
    PHONE_NUMBER_ID = os.getenv('WHATSAPP_PHONE_ID', '3084224258535964') # Número Real
    
    if body.get('object') == 'whatsapp_business_account':
        try:
            entry = body.get('entry', [])[0]
            changes = entry.get('changes', [])[0]
            value = changes.get('value', {})
            messages = value.get('messages', [])
            
            if messages:
                message = messages[0]
                from_phone = message.get('from')
                msg_type = message.get('type')
                
                msg_text = ""
                if msg_type == 'text':
                    msg_text = message.get('text', {}).get('body', '')
                
                print(f"Mensaje recibido de {from_phone}: {msg_text}")
                
                # Enviar respuesta automática (Mensaje de texto simple)
                url = f"https://graph.facebook.com/v25.0/{PHONE_NUMBER_ID}/messages"
                headers = {
                    'Authorization': f'Bearer {WHATSAPP_TOKEN}',
                    'Content-Type': 'application/json'
                }
                payload = {
                    "messaging_product": "whatsapp",
                    "to": from_phone,
                    "type": "text",
                    "text": {
                        "body": f"¡Hola! Somos Arecofix. Hemos recibido tu mensaje: '{msg_text}'. ¿En qué te podemos ayudar hoy?"
                    }
                }
                
                res = requests.post(url, headers=headers, json=payload)
                if not res.ok:
                    print("Error enviando mensaje de WhatsApp:", res.text)
                else:
                    print("Respuesta de WhatsApp enviada exitosamente")
        except Exception as e:
            print("Error procesando webhook:", e)
            
        return 'EVENT_RECEIVED', 200
    else:
        return 'Not Found', 404

# --- AUTHENTICATION & JWT DECORATOR ---

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Support generic Bearer token
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
                
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = Admin.query.filter_by(id=data['id']).first()
            if not current_user:
                raise Exception("User not found")
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except Exception as e:
            return jsonify({'error': 'Token is invalid!', 'message': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# --- AUTHENTICATION (ADMIN OFFLINE LOGIN) ---

@app.route('/api/login', methods=['POST'])
def offline_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    admin = Admin.query.filter_by(username=username).first()
    
    if admin and check_password_hash(admin.password_hash, password):
        token = jwt.encode({
            'id': admin.id,
            'username': admin.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            "message": "Login offline exitoso",
            "token": token,
            "admin": {
                "id": admin.id, 
                "username": admin.username,
                "branch_id": admin.branch_id,
                "role": admin.role
            }
        }), 200
        
    return jsonify({"error": "Credenciales inválidas"}), 401


# --- INVENTARIO (MARCAS Y CATEGORIAS) ---

@app.route('/api/marcas', methods=['GET'])
# @token_required # Todo: add back when auth is integrated with angular
def get_marcas():
    # current_user param removed for testing without token
    marcas = Marca.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [m.to_dict() for m in marcas], "total": len(marcas)})

@app.route('/api/marcas', methods=['POST'])
def add_marca():
    data = request.json
    nueva = Marca()
    if 'name' in data:
        nueva.name = data['name']
    if 'description' in data:
        nueva.description = data['description']
    if 'is_active' in data:
        nueva.is_active = data.get('is_active', True)
    nueva.is_dirty = True
    db.session.add(nueva)
    db.session.commit()
    return jsonify(nueva.to_dict()), 201

@app.route('/api/marcas/<string:id>', methods=['PUT'])
def update_marca(id):
    marca = Marca.query.get_or_404(id)
    data = request.json
    if 'name' in data: marca.name = data['name']
    if 'description' in data: marca.description = data['description']
    if 'is_active' in data: marca.is_active = data['is_active']
    marca.is_dirty = True
    marca.is_synced = False
    db.session.commit()
    return jsonify(marca.to_dict()), 200

@app.route('/api/marcas/<string:id>', methods=['DELETE'])
def delete_marca(id):
    marca = Marca.query.get_or_404(id)
    marca.deleted_at = datetime.datetime.utcnow()
    marca.is_dirty = True
    marca.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

@app.route('/api/categorias', methods=['GET'])
def get_categorias():
    categorias = Categoria.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [c.to_dict() for c in categorias], "total": len(categorias)})

@app.route('/api/categorias', methods=['POST'])
def add_categoria():
    data = request.json
    nueva = Categoria()
    if 'name' in data:
        nueva.name = data['name']
    if 'description' in data:
        nueva.description = data['description']
    if 'is_active' in data:
        nueva.is_active = data.get('is_active', True)
    if 'parent_id' in data:
        nueva.parent_id = data['parent_id']
    nueva.is_dirty = True
    db.session.add(nueva)
    db.session.commit()
    return jsonify(nueva.to_dict()), 201

@app.route('/api/categorias/<string:id>', methods=['PUT'])
def update_categoria(id):
    categoria = Categoria.query.get_or_404(id)
    data = request.json
    if 'name' in data: categoria.name = data['name']
    if 'description' in data: categoria.description = data['description']
    if 'is_active' in data: categoria.is_active = data['is_active']
    if 'parent_id' in data: categoria.parent_id = data['parent_id']
    categoria.is_dirty = True
    categoria.is_synced = False
    db.session.commit()
    return jsonify(categoria.to_dict()), 200

@app.route('/api/categorias/<string:id>', methods=['DELETE'])
def delete_categoria(id):
    categoria = Categoria.query.get_or_404(id)
    categoria.deleted_at = datetime.datetime.utcnow()
    categoria.is_dirty = True
    categoria.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

# --- SUBIDA DE IMÁGENES OFFLINE ---

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = werkzeug.utils.secure_filename(file.filename)
        upload_folder = os.path.join(app.root_path, 'data', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, filename))
        return jsonify({"url": f"/api/files/{filename}"}), 201

@app.route('/api/files/<string:filename>', methods=['GET'])
def get_file(filename):
    from flask import send_from_directory
    upload_folder = os.path.join(app.root_path, 'data', 'uploads')
    return send_from_directory(upload_folder, filename)

# --- CLOUDFLARE R2 & RAG IA ---

def get_s3_client():
    import boto3
    from botocore.config import Config
    account_id = os.getenv('CLOUDFLARE_ACCOUNT_ID')
    access_key = os.getenv('R2_ACCESS_KEY_ID')
    secret_key = os.getenv('R2_SECRET_ACCESS_KEY')
    
    if not account_id or not access_key or not secret_key:
        raise Exception("Faltan credenciales de Cloudflare R2 en el archivo .env")
        
    return boto3.client(
        's3',
        endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(signature_version='s3v4'),
        region_name='auto'
    )

@app.route('/api/storage/presigned-upload', methods=['GET', 'OPTIONS'])
def get_presigned_upload():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        folder = request.args.get('folder', 'rag/general')
        filename = request.args.get('filename')
        content_type = request.args.get('content_type', 'application/octet-stream')
        bucket_name = os.getenv('R2_BUCKET_NAME')
        public_url_base = os.getenv('R2_PUBLIC_URL', '').rstrip('/')
        
        if not filename or not bucket_name:
            return jsonify({"error": "filename and R2_BUCKET_NAME are required"}), 400
            
        object_name = f"{folder}/{filename}"
        s3 = get_s3_client()
        
        presigned_url = s3.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': bucket_name,
                'Key': object_name,
                'ContentType': content_type
            },
            ExpiresIn=3600
        )
        
        public_url = f"{public_url_base}/{object_name}" if public_url_base else f"https://{bucket_name}.r2.cloudflarestorage.com/{object_name}"
        
        return jsonify({
            "upload_url": presigned_url,
            "public_url": public_url
        }), 200
    except Exception as e:
        print(f"Error generando URL de R2: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/rag/extract-pdf', methods=['POST'])
def extract_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty file"}), 400

    # Limite de tamano: 50 MB
    MAX_SIZE_BYTES = 50 * 1024 * 1024
    file.seek(0, 2)  # Seek al final
    file_size = file.tell()
    file.seek(0)     # Reset
    if file_size > MAX_SIZE_BYTES:
        return jsonify({
            "error": f"El archivo es demasiado grande ({file_size // (1024*1024)} MB). El limite es 50 MB. Comprimilo o dividi el PDF en partes mas pequenas."
        }), 413
        
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(file)
        total_pages = len(reader.pages)
        MAX_PAGES = 300
        MAX_CHARS = 800_000  # ~200k tokens, seguro para chunking

        text_parts = []
        char_count = 0
        pages_processed = 0

        for page in reader.pages[:MAX_PAGES]:
            page_text = page.extract_text()
            if page_text:
                remaining = MAX_CHARS - char_count
                if remaining <= 0:
                    break
                text_parts.append(page_text[:remaining])
                char_count += len(page_text)
            pages_processed += 1

        text = "\n".join(text_parts)
        truncated = total_pages > MAX_PAGES or char_count >= MAX_CHARS

        return jsonify({
            "text": text,
            "pages_total": total_pages,
            "pages_processed": pages_processed,
            "chars_extracted": len(text),
            "truncated": truncated
        }), 200
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return jsonify({"error": str(e)}), 500

# --- INVENTARIO (PRODUCTOS) ---

@app.route('/api/productos', methods=['GET'])
def get_productos():
    productos = Producto.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [p.to_dict() for p in productos], "total": len(productos)})

@app.route('/api/productos', methods=['POST'])
def add_producto():
    data = request.json
    nuevo = Producto()
    if 'name' in data:
        nuevo.name = data['name']
    if 'description' in data:
        nuevo.description = data['description']
    if 'price' in data:
        nuevo.price = data.get('price', 0.0)
    if 'cost_price' in data:
        nuevo.cost_price = data.get('cost_price', 0.0)
    if 'stock' in data:
        nuevo.stock = data.get('stock', 0)
    if 'category_id' in data:
        nuevo.category_id = data.get('category_id')
    if 'brand_id' in data:
        nuevo.brand_id = data.get('brand_id')
    if 'sku' in data:
        nuevo.sku = data.get('sku')
    if 'barcode' in data:
        nuevo.barcode = data.get('barcode')
    nuevo.is_dirty = True
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

@app.route('/api/productos/<string:id>', methods=['PUT'])
def update_producto(id):
    producto = Producto.query.get_or_404(id)
    data = request.json
    if 'name' in data: producto.name = data['name']
    if 'description' in data: producto.description = data['description']
    if 'price' in data: producto.price = data['price']
    if 'cost_price' in data: producto.cost_price = data['cost_price']
    if 'stock' in data: producto.stock = data['stock']
    if 'category_id' in data: producto.category_id = data['category_id']
    if 'brand_id' in data: producto.brand_id = data['brand_id']
    if 'sku' in data: producto.sku = data['sku']
    if 'barcode' in data: producto.barcode = data['barcode']
    producto.is_dirty = True
    producto.is_synced = False
    db.session.commit()
    return jsonify(producto.to_dict()), 200

@app.route('/api/productos/<string:id>', methods=['DELETE'])
def delete_producto(id):
    producto = Producto.query.get_or_404(id)
    producto.deleted_at = datetime.datetime.utcnow()
    producto.is_dirty = True
    producto.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

# --- CLIENTES ---

@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    clientes = Cliente.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [c.to_dict() for c in clientes], "total": len(clientes)})

@app.route('/api/clientes', methods=['POST'])
def add_cliente():
    data = request.json
    nuevo = Cliente()
    if 'first_name' in data:
        nuevo.first_name = data['first_name']
    if 'last_name' in data:
        nuevo.last_name = data['last_name']
    if 'phone' in data:
        nuevo.phone = data['phone']
    if 'dni' in data:
        nuevo.dni = data['dni']
    if 'email' in data:
        nuevo.email = data['email']
    nuevo.is_dirty = True
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

@app.route('/api/clientes/<string:id>', methods=['PUT'])
def update_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    data = request.json
    if 'first_name' in data: cliente.first_name = data['first_name']
    if 'last_name' in data: cliente.last_name = data['last_name']
    if 'phone' in data: cliente.phone = data['phone']
    if 'email' in data: cliente.email = data['email']
    if 'dni' in data: cliente.dni = data['dni']
    cliente.is_dirty = True
    cliente.is_synced = False
    db.session.commit()
    return jsonify(cliente.to_dict()), 200

@app.route('/api/clientes/<string:id>', methods=['DELETE'])
def delete_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    cliente.deleted_at = datetime.datetime.utcnow()
    cliente.is_dirty = True
    cliente.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

# --- SERVICIOS TÉCNICOS ---

@app.route('/api/servicios', methods=['GET'])
def get_servicios():
    servicios = ServicioTecnico.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [s.to_dict() for s in servicios], "total": len(servicios)})

@app.route('/api/servicios', methods=['POST'])
def add_servicio():
    data = request.json
    nuevo = ServicioTecnico()
    if 'client_id' in data:
        nuevo.client_id = data['client_id']
    if 'device_id' in data:
        nuevo.device_id = data['device_id']
    if 'falla' in data:
        nuevo.falla = data['falla']
    if 'estado_id' in data:
        nuevo.estado_id = data.get('estado_id', 1)
    if 'precio_presupuesto' in data:
        nuevo.precio_presupuesto = data.get('precio_presupuesto', 0.0)
    if 'observaciones' in data:
        nuevo.observaciones = data.get('observaciones')
    nuevo.is_dirty = True
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

@app.route('/api/servicios/<string:id>', methods=['PUT'])
def update_servicio(id):
    servicio = ServicioTecnico.query.get_or_404(id)
    data = request.json
    if 'client_id' in data: servicio.client_id = data['client_id']
    if 'device_id' in data: servicio.device_id = data['device_id']
    if 'falla' in data: servicio.falla = data['falla']
    if 'estado_id' in data: servicio.estado_id = data['estado_id']
    if 'precio_presupuesto' in data: servicio.precio_presupuesto = data['precio_presupuesto']
    if 'observaciones' in data: servicio.observaciones = data['observaciones']
    servicio.is_dirty = True
    servicio.is_synced = False
    db.session.commit()
    return jsonify(servicio.to_dict()), 200

@app.route('/api/servicios/<string:id>', methods=['DELETE'])
def delete_servicio(id):
    servicio = ServicioTecnico.query.get_or_404(id)
    servicio.deleted_at = datetime.datetime.utcnow()
    servicio.is_dirty = True
    servicio.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

# --- RUTAS DE FINANZAS (Caja) ---
@app.route('/api/finances', methods=['GET', 'POST', 'OPTIONS'])
def manage_finances():
    if request.method == 'OPTIONS':
        return '', 204
        
    if request.method == 'GET':
        movements = CashMovement.query.filter_by(deleted_at=None).order_by(CashMovement.created_at.desc()).all()
        return jsonify({
            "data": [
                {
                    "id": m.id,
                    "tenant_id": m.tenant_id,
                    "branch_id": m.branch_id,
                    "amount": m.amount,
                    "type": m.type,
                    "category": m.category,
                    "payment_method": m.payment_method,
                    "reference_id": m.reference_id,
                    "notes": m.notes,
                    "created_by": m.created_by,
                    "created_at": m.created_at.isoformat() if m.created_at else None
                } for m in movements
            ],
            "total": len(movements)
        })

    if request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        m = CashMovement()
        m.id = data.get('id', str(uuid.uuid4()))
        m.tenant_id = data.get('tenant_id')
        m.branch_id = data.get('branch_id')
        m.amount = data.get('amount', 0)
        m.type = data.get('type', 'income')
        m.category = data.get('category', 'otros')
        m.payment_method = data.get('payment_method', 'cash')
        m.reference_id = data.get('reference_id')
        m.notes = data.get('notes')
        m.created_by = data.get('created_by')
        m.is_synced = False
        m.is_dirty = True
        db.session.add(m)
        db.session.commit()
        return jsonify({"message": "Movimiento de caja creado localmente", "id": m.id}), 201

# --- RUTAS DE ORDENES ---
@app.route('/api/orders', methods=['GET', 'POST', 'OPTIONS'])
def manage_orders():
    if request.method == 'OPTIONS':
        return '', 204
        
    if request.method == 'GET':
        orders = Order.query.filter_by(deleted_at=None).order_by(Order.created_at.desc()).all()
        return jsonify({
            "data": [
                {
                    "id": o.id,
                    "order_number": o.order_number,
                    "customer_name": o.customer_name,
                    "customer_email": o.customer_email,
                    "customer_phone": o.customer_phone,
                    "status": o.status,
                    "subtotal": o.subtotal,
                    "tax": o.tax,
                    "discount": o.discount,
                    "total": o.total,
                    "payment_method": o.payment_method,
                    "notes": o.notes,
                    "items": [
                        {
                            "id": item.id,
                            "product_id": item.product_id,
                            "product_name": item.product_name,
                            "quantity": item.quantity,
                            "unit_price": item.unit_price,
                            "subtotal": item.subtotal
                        } for item in o.items
                    ],
                    "created_at": o.created_at.isoformat() if o.created_at else None
                } for o in orders
            ],
            "total": len(orders)
        })

    if request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        o = Order()
        o.id = data.get('id', str(uuid.uuid4()))
        o.order_number = data.get('order_number')
        o.user_id = data.get('user_id')
        o.customer_name = data.get('customer_name', 'Invitado')
        o.customer_email = data.get('customer_email')
        o.customer_phone = data.get('customer_phone')
        o.shipping_address = json.dumps(data.get('shipping_address')) if data.get('shipping_address') else None
        o.status = data.get('status', 'pending')
        o.subtotal = data.get('subtotal', 0)
        o.tax = data.get('tax', 0)
        o.discount = data.get('discount', 0)
        o.total = data.get('total', 0)
        o.payment_method = data.get('payment_method')
        o.tenant_id = data.get('tenant_id')
        o.branch_id = data.get('branch_id')
        o.is_synced = False
        o.is_dirty = True
        
        items_data = data.get('items', [])
        for item_data in items_data:
            item = OrderItem()
            item.id = item_data.get('id', str(uuid.uuid4()))
            item.order_id = o.id
            item.product_id = item_data.get('product_id')
            item.product_name = item_data.get('product_name')
            item.quantity = item_data.get('quantity', 1)
            item.unit_price = item_data.get('unit_price', 0)
            item.subtotal = item_data.get('subtotal', 0)
            item.is_synced = False
            item.is_dirty = True
            o.items.append(item)
            
        db.session.add(o)
        db.session.commit()
        return jsonify({"message": "Orden creada localmente", "id": o.id}), 201

@app.route('/api/orders/<order_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
def manage_single_order(order_id):
    if request.method == 'OPTIONS':
        return '', 204
        
    order = Order.query.get(order_id)
    if not order or order.deleted_at:
        return jsonify({"error": "Order not found"}), 404
        
    if request.method == 'GET':
        return jsonify({
            "id": order.id,
            "order_number": order.order_number,
            "status": order.status,
            "total": order.total,
            "customer_name": order.customer_name,
            "items": [
                {
                    "id": i.id,
                    "product_id": i.product_id,
                    "product_name": i.product_name,
                    "quantity": i.quantity,
                    "unit_price": i.unit_price,
                    "subtotal": i.subtotal
                } for i in order.items
            ]
        })
        
    if request.method == 'PUT':
        data = request.json
        if 'status' in data:
            order.status = data['status']
        if 'payment_method' in data:
            order.payment_method = data['payment_method']
        
        order.is_synced = False
        order.is_dirty = True
        db.session.commit()
        return jsonify({"message": "Orden actualizada"}), 200
        
    if request.method == 'DELETE':
        order.deleted_at = datetime.datetime.now(datetime.timezone.utc)
        order.is_synced = False
        order.is_dirty = True
        db.session.commit()
        return jsonify({"message": "Orden eliminada localmente"}), 200

# --- OFFLINE RAG CHATBOT ---

LOCAL_DB_URL = os.getenv('LOCAL_DB_URL')
if not LOCAL_DB_URL:
    # Optional fallback to Supabase DB URL if provided
    LOCAL_DB_URL = os.getenv('SUPABASE_DB_URL')  # may be None
OLLAMA_URL = "http://localhost:11434"

@app.route('/api/chat/offline', methods=['POST'])
@app.route('/api/chat', methods=['POST'])
def chat():
    return chat_offline()
def chat_offline():
    # Detailed debugging of incoming request
    print("[DEBUG] chat_offline called")
    print("[DEBUG] Headers:", dict(request.headers))
    raw_data = request.get_data(as_text=True)
    print("[DEBUG] Raw request body:", raw_data)
    # Robust JSON parsing that works even without a Content-Type header
    data = request.get_json(force=True) or {}
    if not isinstance(data, dict):
        data = {}
    # Fallback to manual JSON load if still empty or parsing failed
    if not data:
        try:
            data = json.loads(request.get_data(as_text=True) or "{}")
        except Exception:
            data = {}
    print("[DEBUG] Parsed data:", data)
    # Ensure data is a dict
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON structure"}), 400
    # Log exact received data
    print("[DEBUG] DATA RECIBIDA:", data)
    # Flexible extraction of question
    question = data.get('question') or data.get('prompt') or data.get('message') or ''
    if not question and isinstance(data, dict):
        if data:
            question = str(list(data.values())[0])
        else:
            question = "Hola"
    if not question:
        question = "Hola"
    tenant_id = data.get('tenant_id', 'test-tenant')
    history = data.get('history', [])

    # tenant_id is optional; if missing, set a default for backward compatibility
    if not tenant_id:
        tenant_id = "test-tenant"

    def generate_sse():
        try:
            print("[Offline RAG] 1. Vectorizando pregunta con Ollama...")
            # 1. Vectorizar la pregunta localmente
            emb_res = requests.post(f"{OLLAMA_URL}/api/embeddings", json={
                "model": "nomic-embed-text",
                "prompt": question
            })
            if not emb_res.ok:
                print(f"[Offline RAG] Error Ollama embeddings: {emb_res.text}")
                yield f"data: {json.dumps({'error': 'Error de Ollama (Embeddings)'})}\n\n"
                return
            
            embedding = emb_res.json().get('embedding')

            print("[Offline RAG] 2. Buscando en Postgres local...")
            # 2. Búsqueda vectorial en PostgreSQL
            if not LOCAL_DB_URL:
                print("[Offline RAG] No LOCAL_DB_URL configured, skipping DB query")
                results = []
            else:
                try:
                    conn = psycopg2.connect(LOCAL_DB_URL)
                    cur = conn.cursor()
                    emb_str = f"[{','.join(map(str, embedding))}]"
                    cur.execute("""
                        SELECT title, content, source_type, source_url
                        FROM public.knowledge_base
                        WHERE tenant_id = %s
                        ORDER BY embedding <=> %s::vector
                        LIMIT 5
                    """, (tenant_id, emb_str))
                    results = cur.fetchall()
                    cur.close()
                    conn.close()
                except Exception as db_err:
                    print(f"[Offline RAG] DB connection failed: {db_err}")
                    results = []

            print(f"[Offline RAG] Encontrados {len(results)} fragmentos.")
            sources = []
            context_text = ""
            for i, row in enumerate(results):
                title, content, source_type, source_url = row
                sources.append({
                    "title": title,
                    "source_type": source_type,
                    "source_url": source_url,
                    "similarity": 0.9
                })
                context_text += f"[{i+1}] {title}\n{content}\n\n"

            # Enviar fuentes como primer evento SSE
            yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"

            print("[Offline RAG] 3. Generando respuesta con Qwen...")
            # 3. Prompting
            sys_prompt = f"Eres el asistente oficial de Arecofix. Responde basándote SOLO en este contexto oficial de la empresa:\n{context_text}\nSi no sabes la respuesta o no está en el contexto, dilo cortésmente."

            messages = [{"role": "system", "content": sys_prompt}]
            messages.extend(history)
            messages.append({"role": "user", "content": question})

            # 4. Generación Streaming
            chat_res = requests.post(f"{OLLAMA_URL}/api/chat", json={
                "model": "qwen2.5:7b",
                "messages": messages,
                "stream": True
            }, stream=True)

            for line in chat_res.iter_lines():
                if line:
                    chunk = json.loads(line)
                    if 'message' in chunk and 'content' in chunk['message']:
                        token = chunk['message']['content']
                        yield f"data: {json.dumps({'response': token})}\n\n"
            
            print("[Offline RAG] Respuesta finalizada.")
            yield "data: [DONE]\n\n"

        except Exception as e:
            print(f"[Offline RAG] EXCEPCIÓN: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(stream_with_context(generate_sse()), mimetype='text/event-stream')


# --- INICIALIZACIÓN ---

if __name__ == '__main__':
    from sync_engine import start_sync_thread
    with app.app_context():
        # Crear la base de datos local al iniciar si no existe
        db.create_all()
        
        # Semilla inicial para Administrador (Offline Login)
        if not Admin.query.first():
            hashed_pw = generate_password_hash("admin123")
            db.session.add(Admin(username="admin", password_hash=hashed_pw))
            db.session.commit()
            print("Usuario Admin (offline) creado. User: admin | Pass: admin123")

        # Semilla inicial para testing si está vacío
        if not Producto.query.first():
            db.session.add(Producto(name="Display iPhone 12 Pro", stock=5, price=75000))
            db.session.commit()
            print("Base de datos local inicializada con semilla básica.")
            
    # Iniciar Hilo de Sincronización en Segundo Plano
    start_sync_thread(app)
            
    # Servidor local en el puerto 5000
    app.run(host='0.0.0.0', debug=True, port=5000, use_reloader=False)
