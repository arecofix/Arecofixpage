-- ==============================================================
-- 1. ACTUALIZACIÓN DEL MODELO DE CLIENTES (PROFILES)
-- ==============================================================

-- Asegurar que las columnas existan y permitan nulos.
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dni VARCHAR(50) NULL,
ADD COLUMN IF NOT EXISTS address TEXT NULL;

-- El campo email en auth.users tiene su propia validación. 
-- En perfiles lo permitimos nulo para cuando no hay email.
ALTER TABLE public.profiles 
ALTER COLUMN email DROP NOT NULL;

-- Actualizamos el RPC de creación de clientes para manejar nulos de forma segura.
DROP FUNCTION IF EXISTS public.create_client(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, UUID);

CREATE OR REPLACE FUNCTION public.create_client(
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_address TEXT,
    p_dni TEXT,
    p_tenant_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_profile_id UUID;
    v_role TEXT := 'user';
BEGIN
    v_profile_id := gen_random_uuid();

    INSERT INTO public.profiles (
        id, 
        first_name, 
        last_name, 
        email, 
        phone, 
        address, 
        dni, 
        role, 
        tenant_id, 
        created_at, 
        updated_at
    )
    VALUES (
        v_profile_id, 
        p_first_name, 
        p_last_name, 
        p_email, 
        p_phone, 
        p_address, 
        p_dni, 
        v_role, 
        p_tenant_id, 
        NOW(), 
        NOW()
    );

    RETURN (
        SELECT row_to_json(p)
        FROM public.profiles p
        WHERE id = v_profile_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================
-- 2. AUTOMATIZACIÓN DE STOCK EN BUSCADOR DE REPUESTOS (TRIGGER)
-- ==============================================================

-- Trigger Function para mantenimiento de Stock en tiempo real sobre public.products
-- Opera cuando se insertan, eliminan o modifican repuestos en repair_parts_used.
CREATE OR REPLACE FUNCTION public.sync_repair_parts_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- CASO INSERT: Se agrega repuesto, descontar stock.
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.products 
        SET stock = GREATEST(COALESCE(stock, 0) - NEW.quantity, 0),
            updated_at = NOW()
        WHERE id = NEW.product_id;
        RETURN NEW;
    END IF;

    -- CASO DELETE: Se quita repuesto de reparación, DEVOLVER stock.
    IF (TG_OP = 'DELETE') THEN
        UPDATE public.products 
        SET stock = COALESCE(stock, 0) + OLD.quantity,
            updated_at = NOW()
        WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;

    -- CASO UPDATE: Cambia la cantidad (ej. de 1 pasa a 2). Ajustar delta.
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.product_id != NEW.product_id) THEN
            UPDATE public.products SET stock = COALESCE(stock, 0) + OLD.quantity WHERE id = OLD.product_id;
            UPDATE public.products SET stock = GREATEST(COALESCE(stock, 0) - NEW.quantity, 0) WHERE id = NEW.product_id;
        ELSE
            UPDATE public.products 
            SET stock = GREATEST(COALESCE(stock, 0) - (NEW.quantity - OLD.quantity), 0),
                updated_at = NOW()
            WHERE id = NEW.product_id;
        END IF;
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear el Trigger (borramos previo si existe)
DROP TRIGGER IF EXISTS trg_sync_repair_parts_stock ON public.repair_parts_used;
CREATE TRIGGER trg_sync_repair_parts_stock
AFTER INSERT OR UPDATE OR DELETE ON public.repair_parts_used
FOR EACH ROW EXECUTE FUNCTION public.sync_repair_parts_stock();


-- ==============================================================
-- 3. CÁLCULO DE DASHBOARD DE TALLER (NUEVAS MÉTRICAS)
-- ==============================================================

DROP FUNCTION IF EXISTS public.get_repair_financial_stats(UUID, TEXT);

CREATE OR REPLACE FUNCTION public.get_repair_financial_stats(
    p_tenant_id UUID,
    p_date_range TEXT
)
RETURNS JSON AS $$
DECLARE
    start_date TIMESTAMP WITH TIME ZONE;
    end_date TIMESTAMP WITH TIME ZONE;
    
    -- Variables principales
    v_total_facturado NUMERIC := 0;
    v_costo_repuestos NUMERIC := 0;
    v_ganancia_neta NUMERIC := 0;
    v_margen_porcentaje NUMERIC := 0;
    v_ticket_promedio NUMERIC := 0;
    v_total_reparaciones INT := 0;
    v_reparaciones_vidrio INT := 0;
    v_ingreso_extra_vidrio NUMERIC := 0;
    
    -- Nuevas variables (7 métricas)
    v_equipos_recibidos INT := 0;
    v_equipos_entregados INT := 0;
    v_garantias_efectivas INT := 0;
    v_equipos_espera INT := 0;
    v_devoluciones_cantidad INT := 0;
    v_devoluciones_monto NUMERIC := 0;
    v_venta_total_global NUMERIC := 0;
    v_orders_amount NUMERIC := 0;
    
    v_monthly_data JSON;
BEGIN
    -- 1. Rango de Fechas
    IF p_date_range = 'this_month' THEN
        start_date := date_trunc('month', now());
        end_date := start_date + interval '1 month';
    ELSIF p_date_range = 'last_month' THEN
        start_date := date_trunc('month', now()) - interval '1 month';
        end_date := date_trunc('month', now());
    ELSE
        start_date := '1970-01-01'::TIMESTAMP WITH TIME ZONE;
        end_date := '2100-01-01'::TIMESTAMP WITH TIME ZONE;
    END IF;

    -- 2. Calcular Totales Base (Facturación y Costos)
    SELECT 
        COALESCE(SUM(rpu.unit_price_at_time * rpu.quantity), 0),
        COALESCE(SUM(rpu.cost_at_time * rpu.quantity), 0)
    INTO v_total_facturado, v_costo_repuestos
    FROM public.repair_parts_used rpu
    JOIN public.repairs r ON r.id = rpu.repair_id
    WHERE r.tenant_id = p_tenant_id 
      AND r.current_status_id NOT IN (7)
      AND r.created_at >= start_date AND r.created_at < end_date;
      
    SELECT COUNT(id), COALESCE(SUM(technical_labor_cost), 0), COUNT(id) FILTER (WHERE upsell_vidrio = true)
    INTO v_total_reparaciones, v_ganancia_neta, v_reparaciones_vidrio
    FROM public.repairs
    WHERE tenant_id = p_tenant_id 
      AND current_status_id NOT IN (7)
      AND created_at >= start_date AND created_at < end_date;

    v_total_facturado := v_total_facturado + v_ganancia_neta;
    v_ganancia_neta := v_total_facturado - v_costo_repuestos;

    -- 3. Métricas Nuevas (Equipos Recibidos, Entregados, Espera, Devoluciones, Garantías)
    SELECT 
        COUNT(id), 
        COUNT(id) FILTER (WHERE current_status_id = 6)
    INTO v_equipos_recibidos, v_equipos_entregados
    FROM public.repairs 
    WHERE tenant_id = p_tenant_id
      AND created_at >= start_date AND created_at < end_date;
      
    SELECT COUNT(id) INTO v_equipos_espera
    FROM public.repairs 
    WHERE tenant_id = p_tenant_id AND current_status_id IN (1, 2);

    SELECT COUNT(id), COALESCE(SUM(deposit_amount), 0)
    INTO v_devoluciones_cantidad, v_devoluciones_monto
    FROM public.repairs 
    WHERE tenant_id = p_tenant_id AND current_status_id = 7
      AND created_at >= start_date AND created_at < end_date;
      
    SELECT COUNT(id) INTO v_garantias_efectivas
    FROM public.repairs
    WHERE tenant_id = p_tenant_id AND current_status_id NOT IN (7) 
      AND (issue_description ILIKE '%garantia%' OR issue_description ILIKE '%garantía%')
      AND created_at >= start_date AND created_at < end_date;

    SELECT COALESCE(SUM(total_amount), 0) INTO v_orders_amount
    FROM public.orders 
    WHERE tenant_id = p_tenant_id AND status = 'completed'
      AND created_at >= start_date AND created_at < end_date;
      
    v_venta_total_global := v_total_facturado + v_orders_amount;
    v_ingreso_extra_vidrio := v_reparaciones_vidrio * 5000;

    IF v_total_facturado > 0 THEN
        v_margen_porcentaje := (v_ganancia_neta / v_total_facturado) * 100;
        v_ticket_promedio := v_total_facturado / v_total_reparaciones;
    END IF;

    -- Monthly Series (Genera meses en histórico)
    SELECT json_agg(months)
    INTO v_monthly_data
    FROM (
        SELECT 
            TO_CHAR(r.created_at, 'YYYY-MM') AS mes,
            COALESCE(SUM(r.final_cost), 0) AS ingreso,
            COALESCE(SUM((SELECT COALESCE(SUM(cost_at_time * quantity), 0) FROM public.repair_parts_used rpu WHERE rpu.repair_id = r.id)), 0) AS costo,
            COALESCE(SUM(r.final_cost), 0) - COALESCE(SUM((SELECT COALESCE(SUM(cost_at_time * quantity), 0) FROM public.repair_parts_used rpu WHERE rpu.repair_id = r.id)), 0) AS ganancia
        FROM public.repairs r
        WHERE r.tenant_id = p_tenant_id AND r.current_status_id NOT IN (7)
          AND r.created_at >= start_date AND r.created_at < end_date
        GROUP BY TO_CHAR(r.created_at, 'YYYY-MM')
        ORDER BY TO_CHAR(r.created_at, 'YYYY-MM') ASC
    ) months;

    IF v_monthly_data IS NULL THEN
        v_monthly_data := '[]'::JSON;
    END IF;

    RETURN json_build_object(
        'total_facturado', v_total_facturado,
        'costo_repuestos', v_costo_repuestos,
        'ganancia_neta', v_ganancia_neta,
        'margen_porcentaje', COALESCE(v_margen_porcentaje, 0),
        'ticket_promedio', COALESCE(v_ticket_promedio, 0),
        'total_reparaciones', v_total_reparaciones,
        'reparaciones_vidrio', v_reparaciones_vidrio,
        'ingreso_extra_vidrio', v_ingreso_extra_vidrio,
        'equipos_recibidos', v_equipos_recibidos,
        'equipos_entregados', v_equipos_entregados,
        'garantias_efectivas', v_garantias_efectivas,
        'equipos_espera', v_equipos_espera,
        'devoluciones_cantidad', v_devoluciones_cantidad,
        'devoluciones_monto', v_devoluciones_monto,
        'venta_total_global', v_venta_total_global,
        'monthly_data', v_monthly_data
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
