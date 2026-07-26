import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PreferencesService } from '@app/shared/services/preferences.service';

export const TRANSLATIONS = {
  es: {
    common: {
      search: 'Buscar...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      actions: 'Acciones',
      loading: 'Cargando...',
      noResults: 'No se encontraron resultados.'
    },
    products: {
      title: 'Gestión de Productos',
      subtitle: 'Administrá el catálogo de repuestos y accesorios.',
      newProduct: 'Nuevo Producto',
      searchPlaceholder: 'Buscar producto...',
      actions: {
        import: 'Importar',
        review: 'Revisión',
        advancedTools: 'Herramientas Avanzadas',
        tools: 'Herramientas',
        exportCsv: 'Exportar a CSV',
        xmlFeed: 'Catálogo XML/Feed',
        validatingFeed: 'Validando Feed...',
        integrationAudit: 'Auditoría de Integración',
        automationUrls: 'URLs de Automatización'
      },
      filters: {
        category: 'Categoría:',
        allCategories: 'Todas las Categorías',
        sortBy: 'Ordenar:',
        azName: 'A-Z Nombre',
        priceLowHigh: 'Precio: Bajo a Alto',
        priceHighLow: 'Precio: Alto a Bajo',
        stockLowHigh: 'Stock: Bajo a Alto',
        stockHighLow: 'Stock: Alto a Bajo'
      },
      selection: {
        selected: 'seleccionados'
      },
      table: {
        product: 'Producto',
        skuBrand: 'SKU / Marca',
        price: 'Precio',
        stock: 'Stock',
        status: 'Estado',
        actions: 'Acciones',
        global: 'Global',
        local: 'Local',
        brandId: 'Marca ID:',
        generic: 'Genérico',
        outOfStock: 'Agotado',
        active: 'Activo',
        draft: 'Borrador'
      },
      mobile: {
        selectAll: 'Seleccionar Todo en página',
        editDetails: 'Editar Detalle',
        noProducts: 'No se encontraron productos.'
      },
      bulkActions: {
        deleteSelected: 'Eliminar Seleccionados',
        editPrices: 'Editar Precios'
      },
      exportRss: 'Exportar RSS Feed (Google Shopping)',
      exportRssDesc: 'Enlace RSS/XML homologado para subir tus productos o repuestos automáticamente a Google Shopping.'
    },
    repairs: {
      title: 'Taller y Servicio Técnico',
      assistant: 'Asistente Experto',
      offlineSync: 'Órdenes Guardadas Sin Internet',
      syncNow: 'Sincronizar',
      retry: 'Reintentar',
      subtitle: 'Gestioná las reparaciones y el estado de los equipos.',
      dashboard: {
        title: 'Inteligencia Financiera',
        subtitle: 'Análisis de rentabilidad real',
        financialSummary: 'Resumen Financiero',
        financialDesc: 'Ingresos brutos, costos reales y ganancia neta',
        storeRevenue: 'Ingresos Tienda',
        workshopSales: 'Ventas Taller',
        profit: 'GANANCIA',
        estProfit: 'Ganancia Estimada',
        devicesFixed: 'Equipos Fix.',
        pendingAppr: 'Pend. Aprobación',
        recordExpense: 'Registrar Gasto/Ingreso',
        grossRevenue: 'Ingresos Brutos',
        grossRevDesc: 'Ventas + Reparaciones cobradas',
        realCosts: 'Costos Reales',
        realCostsDesc: 'Repuestos usados + Costo productos',
        netProfit: 'Ganancia Neta',
        workshop50: '50% Taller:',
        tech50: '50% Técnico:',
        histGrossRev: 'Total Ingr. Brutos Histórico',
        histCosts: 'Total Costos Histórico',
        histTotalProfit: 'Ganancia Total Histórica',
        month: 'Mes',
        store: 'Tienda',
        branchMgmt: 'Gestión de Sucursales',
        activeBranches: 'sucursales activas',
        revEvolution: 'Evolución de Ingresos',
        starProd: 'Prod. Estrella',
        salesByCat: 'Ventas por Categoría',
        shortcuts: 'Accesos Directos',
        sysHealth: 'Sistema & Salud',
        inLab: 'En Laboratorio',
        viewDashboard: 'Ver Dashboard',
        superAdmin: 'Super Admin',
        subtitleSuper: 'Gestión central de todas las sucursales',
        subtitleRegular: 'Resumen general del negocio y rendimiento financiero.',
        newSale: 'Nueva Venta',
        newRepair: 'Ingreso a Taller',
        workshop: 'Taller'
      },
      newRepair: 'Nueva Orden',
      searchPlaceholder: 'Buscar por cliente, teléfono o código de seguimiento...',
      table: {
        code: 'Código',
        ticket: 'Ticket / Tracking',
        clientInfo: 'Cliente Info',
        deviceIssue: 'Equipo & Falla',
        labStatus: 'Estado del Taller',
        costs: 'Costos',
        lab: 'Lab',
        deposit: 'Seña:',
        noPhone: 'Sin tel.',
        customer: 'Cliente',
        device: 'Equipo',
        status: 'Estado',
        date: 'Ingreso',
        price: 'Presupuesto',
        actions: 'Acciones'
      },
      filters: {
        all: 'Todos',
        options: {
          all: '📁 Ver Todos los Equipos',
          smartphone: '📱 Celulares',
          pc: '💻 PC / Desktop',
          notebook: '💻 Notebooks',
          console: '🎮 Consolas',
          tablet: '📱 Tablets'
        },
        pending: 'Pendientes',
        inProgress: 'En Progreso',
        finished: 'Terminados',
        delivered: 'Entregados'
      },
      loading: {
        syncing: 'Sincronizando órdenes de taller...',
        loading: 'Cargando...',
        loadingMore: 'Cargando más registros...'
      },
      emptyState: {
        title: 'Taller Despejado',
        subtitle: 'No hay reparaciones que coincidan con los filtros actuales en el laboratorio.',
        clearSearch: 'Limpiar Búsqueda'
      },
      mobile: {
        loadMore: 'Cargar Más',
        estimate: 'Presupuesto'
      }
    },
    crm: {
      title: 'Gestión de Personas y Clientes',
      subtitle: 'Clientes unificados, usuarios registrados, personal y proveedores.',
      exportCsv: 'Exportar CSV',
      newClient: 'Nuevo Cliente',
      newEmployee: 'Nuevo Empleado',
      newSupplier: 'Nuevo Proveedor',
      msgTo: 'Msj a',
      tracking: 'Tracking',
      tabs: {
        clients: 'Clientes',
        users: 'Usuarios',
        staff: 'Staff',
        suppliers: 'Proveedores'
      },
      clients: {
        searchPlaceholder: 'Buscar por nombre, email, teléfono o DNI...',
        clientsFound: 'clientes encontrados',
        page: 'Página',
        of: 'de',
        emptySearch: 'No se encontraron clientes con esa búsqueda.',
        emptyState: 'No hay clientes registrados.',
        dni: 'DNI:',
        sourceSystem: 'Sistema',
        sourceWorkshop: 'Taller',
        contactWhatsapp: 'Contactar por WhatsApp',
        table: {
          client: 'Cliente',
          contact: 'Contacto',
          location: 'Ubicación',
          source: 'Fuente',
          repairs: 'Reparac.',
          actions: 'Acciones'
        }
      },
      users: {
        table: {
          user: 'Usuario',
          role: 'Rol',
          branch: 'Sucursal Asignada',
          registration: 'Registro'
        },
        loading: 'Cargando usuarios...',
        emptyState: 'No hay usuarios registrados.',
        roles: {
          user: 'Cliente',
          staff: 'Staff',
          admin: 'Administrador'
        }
      },
      staff: {
        table: {
          employee: 'Empleado',
          role: 'Cargo / Rol',
          contact: 'Contacto',
          status: 'Estado',
          actions: 'Acciones'
        },
        loading: 'Cargando staff...',
        emptyState: 'No hay empleados registrados.',
        addFirst: 'Agregar primer empleado'
      },
      suppliers: {
        table: {
          name: 'Nombre',
          type: 'Rubro / Tipo',
          contact: 'Contacto',
          status: 'Estado',
          actions: 'Acciones'
        },
        loading: 'Cargando proveedores...',
        emptyState: 'No hay proveedores registrados.',
        addFirst: 'Agregar primer proveedor',
        noPhone: 'Sin teléfono'
      }
    },
    config: {
      title: 'Configuración General',
      subtitle: 'Administra la información de tu empresa, impuestos y branding.',
      companyInfo: 'Información de la Empresa',
      security: 'Seguridad de la Cuenta',
      branches: 'Gestión de Sucursales',
      form: {
        name: 'Nombre de la Empresa',
        owner: 'Titular',
        email: 'Email',
        phone: 'Teléfono',
        address: 'Dirección',
        location: 'Ubicación',
        taxConfig: 'Configuración Fiscal',
        taxPercentage: 'Porcentaje Impuesto (%)',
        taxName: 'Nombre del Impuesto',
        rucName: 'Nombre de Identificación',
        currency: 'Moneda Base',
        usdRate: 'Cotización Dólar (Hoy)',
        usdHelp: 'Este valor se usará para convertir precios de productos en USD al vender en ARS o calcular reparaciones.',
        branding: 'Branding',
        logo: 'Logo de la Empresa',
        save: 'Guardar Configuración'
      },
      securityForm: {
        help: 'Actualiza la contraseña de tu cuenta de administrador o empleado. Por razones de seguridad, asegúrate de utilizar una contraseña fuerte.',
        newPassword: 'Nueva Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        changePassword: 'Cambiar Contraseña'
      },
      branchesForm: {
        help: 'Administra las ubicaciones físicas de tu negocio. Estas podrán ser asignadas a reparaciones o inventario.',
        table: {
          name: 'Nombre / Enlace',
          address: 'Dirección / Slug',
          markup: 'Recargo (%)',
          status: 'Estado',
          actions: 'Acciones'
        },
        active: 'Activa',
        inactive: 'Inactiva',
        manage: 'Administrar',
        empty: 'No hay sucursales registradas.',
        addTitle: 'Agregar Nueva Sucursal',
        name: 'Nombre Sucursal',
        slug: 'Slug (URL)',
        markup: 'Recargo Global (%)',
        address: 'Dirección (Opcional)',
        isActive: 'Sucursal Activa',
        addBtn: 'Agregar Sucursal',
        editTitle: 'Editar Sucursal',
        markupHelp: 'Este porcentaje se sumará al precio de costo de los productos en esta sucursal.',
        cancel: 'Cancelar',
        saveChanges: 'Guardar Cambios'
      }
    },
    sales: {
      title: 'Punto de Venta',
      fastBilling: 'Facturación rápida',
      history: 'Historial',
      loadingCatalog: 'Cargando catálogo...',
      noResults: 'Sin resultados.',
      ticketDetail: 'Detalle de Ticket',
      itemsInCart: 'Items en carrito:',
      emptyCartBtn: 'Vaciar',
      cartEmpty: 'El ticket de venta está vacío.',
      subtotal: 'Subtotal',
      discount: 'Descuento',
      method: 'Método',
      cash: 'Efectivo',
      transfer: 'Transfer.',
      card: 'Tarjeta',
      totalSale: 'Total Venta',
      billing: 'Facturando...',
      issueTicket: 'Emitir Ticket'
    },
    invoices: {
      title: 'Facturación',
      subtitle: 'Historial de ventas y comprobantes',
      createManual: 'Crear Factura Manual',
      loadingHistory: 'Cargando historial...',
      noInvoices: 'Sin Facturación Registrada',
      noInvoicesDesc: 'No hay facturas emitidas. Podés crear una manualmente o completar una venta.',
      createFirst: 'Crear Primera Factura',
      issueDate: 'Fecha Emisión',
      receipt: 'Comprobante',
      origin: 'Origen',
      customer: 'Cliente / Receptor',
      totalBilled: 'Total Facturado',
      manual: 'Manual',
      order: 'Pedido',
      repair: 'Reparación',
      sale: 'Venta',
      finalConsumer: 'Consumidor Final',
      loadMore: 'Cargar más comprobantes',
      endOfHistory: 'Fin del historial de facturación',
      manualInvoiceTitle: 'Factura Manual',
      manualInvoiceDesc: 'Comprobante interno sin restricción de stock',
      type: 'Tipo',
      invoiceB: 'Factura B',
      invoiceA: 'Factura A',
      invoiceC: 'Factura C',
      internalTicket: 'Ticket Interno',
      emailOptional: 'Email (opcional)',
      items: 'Ítems',
      addItem: 'Agregar Ítem',
      exempt: 'Exento',
      tax105: '10.5%',
      tax21: '21%',
      internalNotes: 'Notas internas',
      subtotalNoTax: 'Subtotal (sin IVA)',
      tax: 'IVA',
      totalToBill: 'Total a Facturar',
      generating: 'Generando...',
      generateInvoice: 'Generar Factura'
    },
    invoiceDetail: {
      title: 'Detalle de Comprobante',
      printPdf: 'Imprimir / PDF',
      posTicket: 'Ticket POS',
      searching: 'Buscando Registro...',
      invoiceLabel: 'FACTURA',
      draftLabel: 'BORRADOR',
      billTo: 'Facturar A:',
      cuit: 'CUIT:',
      dniCuit: 'DNI/CUIT:',
      issueDateLabel: 'Fecha de Emisión',
      saleCondition: 'Condición de Venta',
      cashCondition: 'Contado',
      description: 'Descripción',
      qty: 'Cant.',
      unitPrice: 'Precio Unit.',
      terms: 'Términos y Condiciones',
      termsText: 'Gracias por su compra. Los cambios se aceptarán dentro de los 30 días con el comprobante y el producto en su empaque original.',
      taxes0: 'Impuestos (0%)',
      total: 'TOTAL',
      notValidFiscal: 'Documento no válido como factura fiscal oficial si no contiene CAE.',
      poweredBy: 'Powered by SaaS Elite',
      client: 'Cliente:',
      detail: 'DETALLE',
      thanks: '¡Gracias por su preferencia!'
    },
    finance: {
      cashMovements: {
        title: 'Movimientos de Caja',
        subtitle: 'Control de ingresos, egresos y conciliación.',
        newMovement: 'Nuevo Movimiento',
        allTypes: 'Todos los tipos',
        income: 'Ingreso',
        expense: 'Egreso',
        date: 'FECHA',
        concept: 'CONCEPTO',
        method: 'MÉTODO',
        type: 'TIPO',
        amount: 'MONTO',
        noMovements: 'No hay movimientos registrados en esta fecha'
      },
      dashboard: {
        title: 'Gestión Contable',
        subtitle: 'Resumen financiero y situación patrimonial.',
        monthlyIncome: 'Ingresos del Mes',
        monthlyExpense: 'Egresos del Mes',
        balance: 'Balance'
      }
    }
  },
  en: {
    common: {
      search: 'Search...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      actions: 'Actions',
      loading: 'Loading...',
      noResults: 'No results found.'
    },
    products: {
      title: 'Product Management',
      subtitle: 'Manage the parts and accessories catalog.',
      newProduct: 'New Product',
      searchPlaceholder: 'Search product...',
      actions: {
        import: 'Import',
        review: 'Review',
        advancedTools: 'Advanced Tools',
        tools: 'Tools',
        exportCsv: 'Export to CSV',
        xmlFeed: 'XML/Feed Catalog',
        validatingFeed: 'Validating Feed...',
        integrationAudit: 'Integration Audit',
        automationUrls: 'Automation URLs'
      },
      filters: {
        category: 'Category:',
        allCategories: 'All Categories',
        sortBy: 'Sort by:',
        azName: 'A-Z Name',
        priceLowHigh: 'Price: Low to High',
        priceHighLow: 'Price: High to Low',
        stockLowHigh: 'Stock: Low to High',
        stockHighLow: 'Stock: High to Low'
      },
      selection: {
        selected: 'selected'
      },
      table: {
        product: 'Product',
        skuBrand: 'SKU / Brand',
        price: 'Price',
        stock: 'Stock',
        status: 'Status',
        actions: 'Actions',
        global: 'Global',
        local: 'Local',
        brandId: 'Brand ID:',
        generic: 'Generic',
        outOfStock: 'Out of Stock',
        active: 'Active',
        draft: 'Draft'
      },
      mobile: {
        selectAll: 'Select all on page',
        editDetails: 'Edit Details',
        noProducts: 'No products found.'
      },
      bulkActions: {
        deleteSelected: 'Delete Selected',
        editPrices: 'Edit Prices'
      },
      exportRss: 'Export RSS Feed (Google Shopping)',
      exportRssDesc: 'Approved RSS/XML link to automatically upload your products or parts to Google Shopping.'
    },
    repairs: {
      title: 'Workshop & Tech Service',
      assistant: 'Expert Assistant',
      offlineSync: 'Offline Saved Orders',
      syncNow: 'Sync Now',
      retry: 'Retry',
      subtitle: 'Manage repairs and device status.',
      dashboard: {
        title: 'Financial Intelligence',
        subtitle: 'Real profitability analysis',
        financialSummary: 'Financial Summary',
        financialDesc: 'Gross revenue, real costs, and net profit',
        storeRevenue: 'Store Revenue',
        workshopSales: 'Workshop Sales',
        profit: 'PROFIT',
        estProfit: 'Estimated Profit',
        devicesFixed: 'Devices Fixed',
        pendingAppr: 'Pending Appr.',
        recordExpense: 'Record Expense/Income',
        grossRevenue: 'Gross Revenue',
        grossRevDesc: 'Sales + Collected repairs',
        realCosts: 'Real Costs',
        realCostsDesc: 'Used parts + Product costs',
        netProfit: 'Net Profit',
        workshop50: '50% Workshop:',
        tech50: '50% Tech:',
        histGrossRev: 'Total Historical Gross Rev',
        histCosts: 'Total Historical Costs',
        histTotalProfit: 'Total Historical Profit',
        month: 'Month',
        store: 'Store',
        branchMgmt: 'Branch Management',
        activeBranches: 'active branches',
        revEvolution: 'Revenue Evolution',
        starProd: 'Star Products',
        salesByCat: 'Sales by Category',
        shortcuts: 'Shortcuts',
        sysHealth: 'System & Health',
        inLab: 'In Laboratory',
        viewDashboard: 'View Dashboard',
        superAdmin: 'Super Admin',
        subtitleSuper: 'Central management of all branches',
        subtitleRegular: 'General business summary and financial performance.',
        newSale: 'New Sale',
        newRepair: 'New Repair',
        workshop: 'Workshop'
      },
      newRepair: 'New Order',
      searchPlaceholder: 'Search by customer, phone, or tracking code...',
      table: {
        code: 'Code',
        ticket: 'Ticket / Tracking',
        clientInfo: 'Client Info',
        deviceIssue: 'Device & Issue',
        labStatus: 'Workshop Status',
        costs: 'Costs',
        lab: 'Lab',
        deposit: 'Deposit:',
        noPhone: 'No phone',
        customer: 'Customer',
        device: 'Device',
        status: 'Status',
        date: 'Received',
        price: 'Estimate',
        actions: 'Actions'
      },
      filters: {
        all: 'All',
        options: {
          all: '📁 View All Devices',
          smartphone: '📱 Smartphones',
          pc: '💻 PC / Desktop',
          notebook: '💻 Notebooks',
          console: '🎮 Consoles',
          tablet: '📱 Tablets'
        },
        pending: 'Pending',
        inProgress: 'In Progress',
        finished: 'Finished',
        delivered: 'Delivered'
      },
      loading: {
        syncing: 'Syncing workshop orders...',
        loading: 'Loading...',
        loadingMore: 'Loading more records...'
      },
      emptyState: {
        title: 'Clear Workshop',
        subtitle: 'No repairs match the current filters in the laboratory.',
        clearSearch: 'Clear Search'
      },
      mobile: {
        loadMore: 'Load More',
        estimate: 'Estimate'
      }
    },
    crm: {
      title: 'People and Customer Management',
      subtitle: 'Unified customers, registered users, staff, and suppliers.',
      exportCsv: 'Export CSV',
      newClient: 'New Customer',
      newEmployee: 'New Employee',
      newSupplier: 'New Supplier',
      msgTo: 'Msg to',
      tracking: 'Tracking',
      tabs: {
        clients: 'Customers',
        users: 'Users',
        staff: 'Staff',
        suppliers: 'Suppliers'
      },
      clients: {
        searchPlaceholder: 'Search by name, email, phone, or ID...',
        clientsFound: 'customers found',
        page: 'Page',
        of: 'of',
        emptySearch: 'No customers found with that search.',
        emptyState: 'No customers registered.',
        dni: 'ID:',
        sourceSystem: 'System',
        sourceWorkshop: 'Workshop',
        contactWhatsapp: 'Contact via WhatsApp',
        table: {
          client: 'Customer',
          contact: 'Contact',
          location: 'Location',
          source: 'Source',
          repairs: 'Repairs',
          actions: 'Actions'
        }
      },
      users: {
        table: {
          user: 'User',
          role: 'Role',
          branch: 'Assigned Branch',
          registration: 'Registration'
        },
        loading: 'Loading users...',
        emptyState: 'No registered users.',
        roles: {
          user: 'Customer',
          staff: 'Staff',
          admin: 'Administrator'
        }
      },
      staff: {
        table: {
          employee: 'Employee',
          role: 'Position / Role',
          contact: 'Contact',
          status: 'Status',
          actions: 'Actions'
        },
        loading: 'Loading staff...',
        emptyState: 'No registered employees.',
        addFirst: 'Add first employee'
      },
      suppliers: {
        table: {
          name: 'Name',
          type: 'Category / Type',
          contact: 'Contact',
          status: 'Status',
          actions: 'Actions'
        },
        loading: 'Loading suppliers...',
        emptyState: 'No registered suppliers.',
        addFirst: 'Add first supplier',
        noPhone: 'No phone'
      }
    },
    config: {
      title: 'General Settings',
      subtitle: 'Manage your company information, taxes, and branding.',
      companyInfo: 'Company Information',
      security: 'Account Security',
      branches: 'Branch Management',
      form: {
        name: 'Company Name',
        owner: 'Owner',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        location: 'Location',
        taxConfig: 'Tax Configuration',
        taxPercentage: 'Tax Percentage (%)',
        taxName: 'Tax Name',
        rucName: 'ID Name',
        currency: 'Base Currency',
        usdRate: 'USD Rate (Today)',
        usdHelp: 'This value will be used to convert USD product prices when selling in ARS or calculating repairs.',
        branding: 'Branding',
        logo: 'Company Logo',
        save: 'Save Configuration'
      },
      securityForm: {
        help: 'Update your administrator or employee account password. For security reasons, make sure to use a strong password.',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        changePassword: 'Change Password'
      },
      branchesForm: {
        help: 'Manage the physical locations of your business. These can be assigned to repairs or inventory.',
        table: {
          name: 'Name / Link',
          address: 'Address / Slug',
          markup: 'Markup (%)',
          status: 'Status',
          actions: 'Actions'
        },
        active: 'Active',
        inactive: 'Inactive',
        manage: 'Manage',
        empty: 'No registered branches.',
        addTitle: 'Add New Branch',
        name: 'Branch Name',
        slug: 'Slug (URL)',
        markup: 'Global Markup (%)',
        address: 'Address (Optional)',
        isActive: 'Active Branch',
        addBtn: 'Add Branch',
        editTitle: 'Edit Branch',
        markupHelp: 'This percentage will be added to the cost price of products in this branch.',
        cancel: 'Cancel',
        saveChanges: 'Save Changes'
      }
    },
    sales: {
      title: 'Point of Sale',
      fastBilling: 'Fast billing',
      history: 'History',
      loadingCatalog: 'Loading catalog...',
      noResults: 'No results.',
      ticketDetail: 'Ticket Detail',
      itemsInCart: 'Items in cart:',
      emptyCartBtn: 'Empty',
      cartEmpty: 'The sales ticket is empty.',
      subtotal: 'Subtotal',
      discount: 'Discount',
      method: 'Method',
      cash: 'Cash',
      transfer: 'Transfer',
      card: 'Card',
      totalSale: 'Total Sale',
      billing: 'Billing...',
      issueTicket: 'Issue Ticket'
    },
    invoices: {
      title: 'Invoicing',
      subtitle: 'Sales and receipts history',
      createManual: 'Create Manual Invoice',
      loadingHistory: 'Loading history...',
      noInvoices: 'No Billing Registered',
      noInvoicesDesc: 'There are no issued invoices. You can create one manually or complete a sale.',
      createFirst: 'Create First Invoice',
      issueDate: 'Issue Date',
      receipt: 'Receipt',
      origin: 'Origin',
      customer: 'Customer / Receiver',
      totalBilled: 'Total Billed',
      manual: 'Manual',
      order: 'Order',
      repair: 'Repair',
      sale: 'Sale',
      finalConsumer: 'Final Consumer',
      loadMore: 'Load more receipts',
      endOfHistory: 'End of billing history',
      manualInvoiceTitle: 'Manual Invoice',
      manualInvoiceDesc: 'Internal receipt without stock restriction',
      type: 'Type',
      invoiceB: 'Invoice B',
      invoiceA: 'Invoice A',
      invoiceC: 'Invoice C',
      internalTicket: 'Internal Ticket',
      emailOptional: 'Email (optional)',
      items: 'Items',
      addItem: 'Add Item',
      exempt: 'Exempt',
      tax105: '10.5%',
      tax21: '21%',
      internalNotes: 'Internal notes',
      subtotalNoTax: 'Subtotal (w/o tax)',
      tax: 'Tax',
      totalToBill: 'Total to Bill',
      generating: 'Generating...',
      generateInvoice: 'Generate Invoice'
    },
    invoiceDetail: {
      title: 'Receipt Detail',
      printPdf: 'Print / PDF',
      posTicket: 'POS Ticket',
      searching: 'Searching Record...',
      invoiceLabel: 'INVOICE',
      draftLabel: 'DRAFT',
      billTo: 'Bill To:',
      cuit: 'Tax ID:',
      dniCuit: 'ID/Tax ID:',
      issueDateLabel: 'Issue Date',
      saleCondition: 'Sale Condition',
      cashCondition: 'Cash',
      description: 'Description',
      qty: 'Qty',
      unitPrice: 'Unit Price',
      terms: 'Terms and Conditions',
      termsText: 'Thank you for your purchase. Returns are accepted within 30 days with receipt and original packaging.',
      taxes0: 'Taxes (0%)',
      total: 'TOTAL',
      notValidFiscal: 'Document not valid as official fiscal invoice if it does not contain CAE.',
      poweredBy: 'Powered by SaaS Elite',
      client: 'Customer:',
      detail: 'DETAIL',
      thanks: 'Thank you for your preference!'
    },
    finance: {
      cashMovements: {
        title: 'Cash Movements',
        subtitle: 'Control of income, expenses, and reconciliation.',
        newMovement: 'New Movement',
        allTypes: 'All types',
        income: 'Income',
        expense: 'Expense',
        date: 'DATE',
        concept: 'CONCEPT',
        method: 'METHOD',
        type: 'TYPE',
        amount: 'AMOUNT',
        noMovements: 'No movements recorded on this date'
      },
      dashboard: {
        title: 'Accounting Management',
        subtitle: 'Financial summary and equity situation.',
        monthlyIncome: 'Monthly Income',
        monthlyExpense: 'Monthly Expenses',
        balance: 'Balance'
      }
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private preferencesService = inject(PreferencesService);
  
  private currentLang = toSignal(this.preferencesService.language$, { initialValue: 'es' });

  public t = computed(() => {
    const lang = this.currentLang() as 'es' | 'en';
    return TRANSLATIONS[lang] || TRANSLATIONS.es;
  });
}


