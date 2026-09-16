import pytest
from pydantic import ValidationError
from ai_enrichment_worker import ProductEnrichment

def test_pydantic_schema_ean_validation():
    # Debe pasar
    valid_product = ProductEnrichment(
        title_meli="Pin De Carga Samsung A52s",
        description="Pin de carga original para Samsung A52s. Soluciona problemas de...",
        brand="Samsung",
        model="A52s",
        condition="new",
        ean="NA"
    )
    assert valid_product.ean == "NA"
    
    valid_product_with_ean = ProductEnrichment(
        title_meli="Pin De Carga Samsung A52s",
        description="Pin de carga",
        brand="Samsung",
        model="A52s",
        condition="new",
        ean="1234567890123"
    )
    assert valid_product_with_ean.ean == "1234567890123"

    # Debe fallar (hallucinacion parcial, longitud menor a 8 no es un EAN valido)
    with pytest.raises(ValidationError):
        ProductEnrichment(
            title_meli="Pin De Carga Samsung A52s",
            description="Pin de carga",
            brand="Samsung",
            model="A52s",
            condition="new",
            ean="12345"
        )

def test_pydantic_schema_title_length():
    # Titulo mayor a 60 caracteres debe fallar para cumplir con mercadolibre
    long_title = "Pin De Carga Samsung A52s " + "a" * 40
    with pytest.raises(ValidationError):
        ProductEnrichment(
            title_meli=long_title,
            description="Pin de carga",
            brand="Samsung",
            model="A52s",
            condition="new",
            ean="NA"
        )
