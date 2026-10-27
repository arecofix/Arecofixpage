# Arquitectura Técnica — Creador de Landing Pages de Servicios (Opción C - Híbrido)

**Fecha:** 18 de Octubre de 2026  
**Autor:** Equipo de Arquitectura de Software & DBA Arecofix  
**Patrón:** Clean Architecture + Tactical DDD + Modular Blocks  

---

## 1. Diagrama de Componentes (Clean Architecture)

```mermaid
graph TB
    subgraph "Frontend Layer (Angular 21 Standalone + SSR)"
        AdminServices[AdminServicesPage<br/>/admin/services]
        ServiceEditor[ServiceEditorComponent<br/>/admin/services/:id/edit]
        BlocksEditor[BlocksEditorComponent<br/>Shared with Blog & Services]
        AdminLeads[AdminLeadsPage<br/>/admin/leads]
        PublicList[PublicServicesListComponent<br/>/servicios]
        PublicDetail[PublicServiceDetailComponent<br/>/servicios/:slug]
        BlockRenderer[BlockRendererComponent<br/>Shared Production SSR Renderer]
    end

    subgraph "Application Layer (Use Cases & Mappers)"
        SvcApp[ServicesApplicationService]
        CreateSvc[CreateServiceUseCase]
        PublishSvc[PublishServiceUseCase]
        UpsertBlocks[UpsertBlocksUseCase]
        CreateLead[CreateLeadUseCase]
        SvcMapper[ServiceMapper / JSON-LD]
    end

    subgraph "Domain Layer (Entities, VOs & Contracts)"
        ServiceEntity[Service Entity]
        BlockEntity[ServiceBlock Entity]
        LeadEntity[ServiceLead Entity]
        SlugVO[Slug Value Object]
        MoneyVO[Money Value Object]
        SeoVO[SeoMeta Value Object]
        ZodSchemas[Zod BlockSchemasByType]
        ISvcRepo[ServiceRepository]
        IBlockRepo[ServiceBlockRepository]
        ILeadRepo[ServiceLeadRepository]
    end

    subgraph "Infrastructure & Backend Layer"
        SupabaseSvcRepo[SupabaseServiceRepository]
        SupabaseBlockRepo[SupabaseServiceBlockRepository]
        SupabaseLeadRepo[SupabaseServiceLeadRepository]
        ExpressServer[Node Express SSR Server<br/>server.ts]
        ServicesRoutes[Services Express API<br/>server/routes/services.routes.ts]
        SitemapRoutes[Sitemap XML Routes<br/>server/routes/sitemap.routes.ts]
    end

    subgraph "Persistence Layer (PostgreSQL - Docker supabase-db)"
        DbServices[(public.services)]
        DbBlocks[(public.service_blocks)]
        DbFeatures[(public.service_features)]
        DbLeads[(public.service_leads)]
        DbRedirects[(public.slug_redirects)]
    end

    AdminServices --> SvcApp
    ServiceEditor --> SvcApp
    ServiceEditor --> BlocksEditor
    BlocksEditor --> BlockRenderer
    PublicList --> SvcApp
    PublicDetail --> SvcApp
    PublicDetail --> BlockRenderer
    AdminLeads --> SvcApp

    SvcApp --> CreateSvc
    SvcApp --> PublishSvc
    SvcApp --> UpsertBlocks
    SvcApp --> CreateLead

    CreateSvc --> ISvcRepo
    PublishSvc --> ISvcRepo
    PublishSvc --> IBlockRepo
    UpsertBlocks --> IBlockRepo
    CreateLead --> ILeadRepo

    SupabaseSvcRepo -.->|Implements| ISvcRepo
    SupabaseBlockRepo -.->|Implements| IBlockRepo
    SupabaseLeadRepo -.->|Implements| ILeadRepo

    ExpressServer --> ServicesRoutes
    ExpressServer --> SitemapRoutes

    ServicesRoutes --> DbServices
    ServicesRoutes --> DbBlocks
    ServicesRoutes --> DbLeads
    ServicesRoutes --> DbRedirects
    SupabaseSvcRepo --> DbServices
    SupabaseBlockRepo --> DbBlocks
    SupabaseLeadRepo --> DbLeads
```

---

## 2. Diagrama de Secuencia: Flujo Integral de Vida del Servicio

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Super Admin
    participant AdminUI as ServiceEditorComponent
    participant BlocksUI as BlocksEditorComponent
    participant AppSvc as ServicesApplicationService
    participant Backend as Express API / Supabase
    participant DB as PostgreSQL
    actor Visitor as Visitante Web / Google Bot
    participant PublicUI as PublicServiceDetail (/servicios/:slug)

    Admin->>AdminUI: Completa Datos Base (Nombre, Slug, Precios, SEO)
    Admin->>BlocksUI: Agrega Bloques (Hero, Features, Contact, FAQ)
    BlocksUI->>AppSvc: upsertBlocks (validado con Zod)
    AppSvc->>DB: Guarda service_blocks
    Admin->>AdminUI: Click "Publicar"
    AdminUI->>AppSvc: publishService(id)
    AppSvc->>DB: UPDATE services SET is_published = TRUE
    DB-->>AdminUI: Badge "Publicado"

    Note over Visitor, PublicUI: Navegación Pública e Indexación
    Visitor->>PublicUI: GET /servicios/auditoria-de-sitios-web
    PublicUI->>Backend: GET /api/public/services/:slug
    Backend->>DB: SELECT service + blocks + features
    DB-->>Backend: Datos de landing
    Backend-->>PublicUI: Payload con Schema.org JSON-LD
    PublicUI-->>Visitor: HTML SSR renderizado con BlockRenderer

    Note over Visitor, DB: Captura de Lead
    Visitor->>PublicUI: Completa formulario de contacto (#contacto)
    PublicUI->>Backend: POST /api/public/leads (Name, Phone, Msg, Honeypot)
    Backend->>Backend: Verifica Honeypot + Rate Limit (5/hora) + Hash SHA-256 IP
    Backend->>DB: INSERT INTO service_leads
    DB-->>PublicUI: 201 Created
    PublicUI-->>Visitor: Mensaje de éxito "¡Consulta enviada!"
```

---

## 3. Modelo Entidad-Relación (ERD)

```mermaid
erDiagram
    tenants ||--o{ services : "owns"
    tenants ||--o{ service_categories : "owns"
    tenants ||--o{ service_leads : "receives"
    tenants ||--o{ slug_redirects : "maintains"

    services ||--o{ service_features : "has"
    services ||--o{ service_blocks : "configured by"
    services ||--o{ service_leads : "generates"
    blog_posts ||--o{ service_blocks : "configured by"

    services {
        uuid id PK
        uuid tenant_id FK
        uuid category_id FK
        varchar name
        varchar slug UK
        varchar icon
        varchar short_description
        text long_description
        numeric base_price
        char price_currency
        int duration_minutes
        boolean is_quotable
        boolean is_bookable
        boolean is_published
        varchar template_slug
        text hero_image_url
        varchar seo_title
        varchar seo_description
        text canonical_url
        text og_image_url
        timestamptz published_at
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    service_blocks {
        uuid id PK
        varchar owner_type "service | post"
        uuid owner_id "FK polymorphic"
        varchar block_type "hero, features, cta, faq, etc."
        jsonb content "Validated by Zod"
        int order_index
        boolean is_enabled
        timestamptz created_at
        timestamptz updated_at
    }

    service_features {
        uuid id PK
        uuid service_id FK
        varchar label
        varchar icon
        int order_index
        timestamptz created_at
    }

    service_leads {
        uuid id PK
        uuid tenant_id FK
        uuid service_id FK
        varchar name
        varchar email
        varchar phone
        text message
        varchar source
        varchar utm_source
        varchar utm_medium
        varchar utm_campaign
        varchar status "new, contacted, quoted, won, lost"
        varchar ip_hash
        text user_agent
        timestamptz created_at
        timestamptz contacted_at
    }

    slug_redirects {
        uuid id PK
        uuid tenant_id FK
        varchar entity_type "service | post"
        uuid entity_id
        varchar old_slug
        varchar new_slug
        timestamptz created_at
    }
```
