
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/admin/posts/admin-post-form-page.ts": [
    "chunk-LRLOAM57.js",
    "chunk-GJ3SMEOO.js"
  ],
  "src/app/admin/posts/admin-posts.routes.ts": [
    "chunk-DJRZWIE4.js"
  ],
  "src/app/admin/admin.routes.ts": [
    "chunk-UAUTDR7N.js",
    "chunk-JPGTOB4G.js"
  ],
  "node_modules/@mlc-ai/web-llm/lib/index.js": [
    "chunk-HDZ74XN4.js"
  ],
  "src/app/admin/services/admin-service-form-page.ts": [
    "chunk-G4RXJARY.js"
  ],
  "src/app/admin/services/admin-services.routes.ts": [
    "chunk-AVC5UKPA.js"
  ],
  "src/app/admin/repairs/admin-repairs-page.ts": [
    "chunk-PXWNYL43.js",
    "chunk-3NKZQYEZ.js",
    "chunk-BYXBJQAS.js"
  ],
  "src/app/admin/repairs/admin-repair-form-page.ts": [
    "chunk-PVS3ZT5K.js",
    "chunk-3NKZQYEZ.js",
    "chunk-BYXBJQAS.js",
    "chunk-OZBOF2C2.js"
  ],
  "src/app/admin/repairs/admin-repairs.routes.ts": [
    "chunk-Z3BPMGA5.js"
  ],
  "src/app/admin/messages/admin-messages-page.ts": [
    "chunk-RN2IWANC.js"
  ],
  "src/app/admin/messages/admin-messages.routes.ts": [
    "chunk-6HMQLI57.js"
  ],
  "src/app/admin/posts/admin-posts-page.ts": [
    "chunk-37WXZF5N.js",
    "chunk-GJ3SMEOO.js"
  ],
  "src/app/admin/users/admin-users.routes.ts": [
    "chunk-ESLZGHR4.js"
  ],
  "src/app/admin/courses/admin-courses-page.ts": [
    "chunk-O2NI2TYO.js",
    "chunk-6K7KDCKR.js"
  ],
  "src/app/admin/courses/admin-course-form-page.ts": [
    "chunk-Q3A54LNR.js",
    "chunk-6K7KDCKR.js"
  ],
  "src/app/admin/courses/admin-courses.routes.ts": [
    "chunk-AAWTILH2.js"
  ],
  "src/app/admin/orders/admin-orders-page.ts": [
    "chunk-MCHKRDV3.js",
    "chunk-MMX2KHFQ.js",
    "chunk-A7HSRCHR.js"
  ],
  "src/app/admin/orders/admin-order-form-page.ts": [
    "chunk-XIZG2VWU.js",
    "chunk-MMX2KHFQ.js"
  ],
  "src/app/admin/orders/admin-orders.routes.ts": [
    "chunk-VZIZORXB.js"
  ],
  "src/app/admin/services/admin-services-page.ts": [
    "chunk-SXSDDNI4.js"
  ],
  "src/app/admin/sales/admin-invoice-detail-page.ts": [
    "chunk-ZA2OIZG7.js",
    "chunk-OZBOF2C2.js"
  ],
  "src/app/admin/sales/admin-sales.routes.ts": [
    "chunk-L6IQXQHR.js"
  ],
  "src/app/admin/inventory/admin-inventory-page.ts": [
    "chunk-JANTVCDE.js",
    "chunk-FWCUDVXA.js",
    "chunk-A7HSRCHR.js"
  ],
  "src/app/admin/inventory/admin-inventory.routes.ts": [
    "chunk-E4KPUEKU.js"
  ],
  "src/app/admin/purchases/admin-purchases-page.ts": [
    "chunk-AWLCJUHU.js"
  ],
  "src/app/admin/purchases/admin-purchase-form-page.ts": [
    "chunk-HU2SQAID.js"
  ],
  "src/app/admin/purchases/admin-purchases.routes.ts": [
    "chunk-X4MD2RIC.js"
  ],
  "src/app/admin/users/admin-users-page.ts": [
    "chunk-XV3EQ6A2.js",
    "chunk-JPGTOB4G.js"
  ],
  "src/app/admin/suppliers/admin-suppliers.routes.ts": [
    "chunk-EN6735C6.js"
  ],
  "src/app/admin/company/admin-company-settings-page.ts": [
    "chunk-N635WSKW.js"
  ],
  "src/app/admin/company/admin-company.routes.ts": [
    "chunk-QMIGU2T7.js"
  ],
  "src/app/admin/employees/admin-employees-page.ts": [
    "chunk-SZAAVCL3.js"
  ],
  "src/app/admin/employees/admin-employee-form-page.ts": [
    "chunk-WD5P57GD.js"
  ],
  "src/app/admin/employees/admin-employees.routes.ts": [
    "chunk-R5SEGXWV.js"
  ],
  "src/app/admin/sales/admin-sales-page.ts": [
    "chunk-RHDPAKHI.js",
    "chunk-MMX2KHFQ.js",
    "chunk-A7HSRCHR.js"
  ],
  "src/app/admin/sales/admin-invoices-page.ts": [
    "chunk-QKMFW2EF.js"
  ],
  "src/app/admin/brands/admin-brands-page.ts": [
    "chunk-EPNDTQ7J.js"
  ],
  "src/app/admin/brands/admin-brand-form-page.ts": [
    "chunk-K2F4HLMD.js"
  ],
  "src/app/admin/brands/admin-brands.routes.ts": [
    "chunk-2TV2B6SO.js"
  ],
  "src/app/admin/clients/admin-clients-page.ts": [
    "chunk-UWOGSTQ2.js"
  ],
  "src/app/admin/clients/admin-client-form-page.ts": [
    "chunk-CF4IH3J6.js"
  ],
  "src/app/admin/clients/admin-clients.routes.ts": [
    "chunk-STGPIDWQ.js"
  ],
  "src/app/admin/suppliers/admin-suppliers-page.ts": [
    "chunk-SLLANVZJ.js"
  ],
  "src/app/admin/suppliers/admin-supplier-form-page.ts": [
    "chunk-NNOQKFF4.js"
  ],
  "src/app/admin/layout/admin-layout.ts": [
    "chunk-UK2JQPAV.js",
    "chunk-VOOZUXUF.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/admin/dashboard/admin-dashboard-page.ts": [
    "chunk-26N57HHU.js"
  ],
  "src/app/admin/products/admin-products-page.ts": [
    "chunk-NLSHXQIC.js",
    "chunk-FWCUDVXA.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js"
  ],
  "src/app/admin/products/admin-product-form-page.ts": [
    "chunk-TZYR7SPB.js",
    "chunk-FWCUDVXA.js"
  ],
  "src/app/admin/products/admin-products.routes.ts": [
    "chunk-K6GSYFUO.js"
  ],
  "src/app/admin/categories/admin-categories-page.ts": [
    "chunk-3G4TCH5T.js"
  ],
  "src/app/admin/categories/admin-category-form-page.ts": [
    "chunk-YOGEN3US.js"
  ],
  "src/app/admin/categories/admin-categories.routes.ts": [
    "chunk-3CZ7SHIC.js"
  ],
  "src/app/public/tracking/tracking-page.ts": [
    "chunk-BNZB7GL2.js",
    "chunk-BYXBJQAS.js",
    "chunk-OZBOF2C2.js"
  ],
  "src/app/public/privacy/privacy.component.ts": [
    "chunk-N6XIZE4Z.js"
  ],
  "src/app/public/terms/terms.component.ts": [
    "chunk-V4CRIFIS.js"
  ],
  "src/app/public/blog/blog.component.ts": [
    "chunk-HWOLY5YF.js",
    "chunk-HIHLR6XW.js"
  ],
  "src/app/public/sitemap/sitemap.component.ts": [
    "chunk-6TNGPROE.js"
  ],
  "src/app/public/fixtecnicos/fixtecnicos.component.ts": [
    "chunk-ZYWLTMJ6.js",
    "chunk-HIHLR6XW.js"
  ],
  "src/app/public/recursos/recursos.component.ts": [
    "chunk-3J62LWMO.js"
  ],
  "src/app/public/public.routes.ts": [
    "chunk-AQZGWDNU.js",
    "chunk-VOOZUXUF.js",
    "chunk-RDFP3WJA.js",
    "chunk-Q2UPI2GR.js",
    "chunk-CXYSHB3E.js"
  ],
  "src/app/public/nosotros/nosotros.ts": [
    "chunk-QJT4YAH4.js",
    "chunk-I7HI3DV5.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/contacto/contacto.ts": [
    "chunk-Z2XVYCLA.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/servicios/servicios.ts": [
    "chunk-UE6PQTAH.js",
    "chunk-CGSMRQ3D.js",
    "chunk-RDFP3WJA.js",
    "chunk-TQNQ43CE.js"
  ],
  "src/app/public/servicios/pages/detail/service-detail.component.ts": [
    "chunk-RBZAYB3J.js",
    "chunk-CGSMRQ3D.js"
  ],
  "src/app/public/cursos/cursos.ts": [
    "chunk-3UBTITB4.js",
    "chunk-6K7KDCKR.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-PRFOZZK3.js",
    "chunk-X644DCMX.js",
    "chunk-E7GUTJFB.js",
    "chunk-4ZE4CKKD.js",
    "chunk-CXYSHB3E.js"
  ],
  "src/app/public/cursos/course-detail/course-detail.component.ts": [
    "chunk-7DG74TDB.js",
    "chunk-6K7KDCKR.js",
    "chunk-73O2YB7T.js"
  ],
  "src/app/public/checkout/checkout-page.ts": [
    "chunk-Y64OLP5O.js",
    "chunk-MMX2KHFQ.js",
    "chunk-Q2UPI2GR.js",
    "chunk-4ZE4CKKD.js",
    "chunk-CXYSHB3E.js"
  ],
  "src/app/public/posts/post-page.ts": [
    "chunk-TCEBRHIA.js",
    "chunk-HIHLR6XW.js",
    "chunk-3J3NC43I.js",
    "chunk-Q2UPI2GR.js"
  ],
  "src/app/public/products/pages/details/products-details-page.ts": [
    "chunk-HHVGWRSK.js",
    "chunk-URRL2FHW.js",
    "chunk-73O2YB7T.js",
    "chunk-TQNQ43CE.js",
    "chunk-PRFOZZK3.js",
    "chunk-E7GUTJFB.js",
    "chunk-4ZE4CKKD.js",
    "chunk-CXYSHB3E.js"
  ],
  "src/app/public/products/pages/featured/products-featured-page.ts": [
    "chunk-LQMUGADD.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-X644DCMX.js",
    "chunk-E7GUTJFB.js",
    "chunk-4ZE4CKKD.js",
    "chunk-CXYSHB3E.js"
  ],
  "src/app/public/products/products.routes.ts": [
    "chunk-D2FYYBUP.js"
  ],
  "src/app/public/auth/login/login.component.ts": [
    "chunk-O5RB34MP.js"
  ],
  "src/app/public/auth/register/register.component.ts": [
    "chunk-BGRMZ5IT.js"
  ],
  "src/app/public/profile/profile.component.ts": [
    "chunk-GOA3QQZ2.js"
  ],
  "src/app/public/gsm/gsm.routes.ts": [
    "chunk-NTNBVAIM.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/portfolio/portfolio.ts": [
    "chunk-XPPCXIHG.js",
    "chunk-I7HI3DV5.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/landing/celular/celular-landing.component.ts": [
    "chunk-WFAZHPCI.js",
    "chunk-3J3NC43I.js",
    "chunk-Q2UPI2GR.js",
    "chunk-URRL2FHW.js"
  ],
  "src/app/public/categories/pages/home/public-categories-home-page.ts": [
    "chunk-GAC6NADM.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-PRFOZZK3.js"
  ],
  "src/app/public/categories/categories.routes.ts": [
    "chunk-PAROK3NI.js"
  ],
  "src/app/public/products/pages/all/products-all-page.ts": [
    "chunk-FCXC5VWG.js",
    "chunk-URRL2FHW.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-X644DCMX.js",
    "chunk-E7GUTJFB.js",
    "chunk-4ZE4CKKD.js",
    "chunk-CXYSHB3E.js"
  ],
  "src/app/public/products/pages/index/products-index-page.ts": [
    "chunk-CNFIL3EM.js",
    "chunk-PRFOZZK3.js",
    "chunk-X644DCMX.js",
    "chunk-E7GUTJFB.js",
    "chunk-4ZE4CKKD.js",
    "chunk-CXYSHB3E.js"
  ],
  "src/app/public/repuestos/repuestos.ts": [
    "chunk-MVCGNRN7.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-PRFOZZK3.js",
    "chunk-X644DCMX.js",
    "chunk-E7GUTJFB.js",
    "chunk-4ZE4CKKD.js",
    "chunk-CXYSHB3E.js"
  ],
  "src/app/public/products/pages/by-category/products-by-category-page.ts": [
    "chunk-4KAMXEIR.js",
    "chunk-URRL2FHW.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-PRFOZZK3.js",
    "chunk-X644DCMX.js",
    "chunk-E7GUTJFB.js",
    "chunk-4ZE4CKKD.js",
    "chunk-CXYSHB3E.js"
  ]
},
  assets: {
    'index.csr.html': {size: 38320, hash: '2dd09af2a41acb67fd98586590a9babbfde38ef0a6f2f05de1281b253434a2b7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 16251, hash: 'ee11b0c5d3eac943344404559d497d825137039f8f1d47e3d9af2af0bcdc614c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-5437QE27.css': {size: 423242, hash: 'LsjKmEu+YJ0', text: () => import('./assets-chunks/styles-5437QE27_css.mjs').then(m => m.default)}
  },
};
