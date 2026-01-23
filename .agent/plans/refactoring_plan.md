# Comprehensive Refactoring Plan

## 1. Audit Findings

### 1.1. Architecture Violations

- **Core vs Services**: Conflicting directory structure. `src/app/services` exists alongside `src/app/core/services`. Services should be consolidated.
- **Component Logic Leakage**: `CelularLandingComponent` contains direct Supabase database calls (`supabase.from('contact_messages')`) instead of using a service layer.
- **Bypassing Service Layer**: `ContactService` exists and has a `createMessage` method, but `CelularLandingComponent` ignores it and re-implements the logic.

### 1.2. Code Quality & Type Safety

- **"Any" Types**: `OrderService` uses `.from('table' as any)` extensively, bypassing TypeScript safety.
- **Missing Data Models**: Lack of strict interfaces for Database Responses vs Domain Entities.
- **Hardcoded Values**:
  - URL strings and table names hardcoded scattered across services.
  - Email addresses (`'lp-celular@arecofix.com'`) hardcoded in components.
- **Spaghetti Logic**: `OrderService` contains repetitive object mapping code inside `getOrders` and `getOrderById`.
- **Bad UX Practices**: `alert()` is used for user feedback.

## 2. Refactoring Steps

### Phase 1: Logic Consolidation (High Priority)

1.  **Refactor `CelularLandingComponent`**:
    - Inject `ContactService`.
    - Replace direct Supabase calls with `ContactService.createMessage()`.
    - Replace `window.alert()` with a Toast notification service (if available) or a cleaner UI feedback mechanism.
    - Remove hardcoded email/subject strings and pass them as arguments or config.

### Phase 2: Domain Layer & Type Safety (Order Module)

2.  **Create Domain & DB Models**:
    - Define `OrderEntity` and `OrderItemEntity` (Domain).
    - Define `DbOrder` and `DbOrderItem` (Database properties, snake_case).
3.  **Implement clean `OrderService`**:
    - Remove `as any` casts.
    - Create a `OrderMapper` to centralize `DB -> Domain` transformation.
    - Ensure robust error handling using `LoggerService`.

### Phase 3: Global Cleanup (Performance & Standards)

4.  **Directory Structure**:
    - Gradually migrate root `services/*` to `core/services/*` or `features/*/services`.
5.  **Hardcoding**:
    - Move strict strings to `src/app/core/constants` or `environment` files.

## 3. Execution Standard

All changes will follow **Clean Architecture**:

- **Entities**: Pure TS interfaces/classes.
- **Use Cases/Services**: Business logic.
- **Repositories/Adapters**: Data access (Supabase).
- **Presentation**: Components (UI only).
