
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/admin/messages/admin-messages-page.ts": [
    "chunk-UKG5EG7I.js"
  ],
  "src/app/admin/messages/admin-messages.routes.ts": [
    "chunk-M43J634N.js"
  ],
  "src/app/admin/posts/admin-posts-page.ts": [
    "chunk-SR6Z6UEU.js",
    "chunk-4HWHWJWJ.js"
  ],
  "src/app/admin/posts/admin-post-form-page.ts": [
    "chunk-HUGC7BZJ.js",
    "chunk-4HWHWJWJ.js"
  ],
  "src/app/admin/posts/admin-posts.routes.ts": [
    "chunk-LVVYCTSG.js"
  ],
  "src/app/admin/admin.routes.ts": [
    "chunk-BSAGTTLA.js"
  ],
  "node_modules/@mlc-ai/web-llm/lib/index.js": [
    "chunk-HDZ74XN4.js"
  ],
  "src/app/admin/services/admin-service-form-page.ts": [
    "chunk-2YH4FGGM.js"
  ],
  "src/app/admin/services/admin-services.routes.ts": [
    "chunk-73XIW6JG.js"
  ],
  "src/app/admin/repairs/admin-repairs-page.ts": [
    "chunk-XUPVNO3C.js",
    "chunk-JZSLHTBV.js",
    "chunk-BYXBJQAS.js"
  ],
  "node_modules/html2canvas/dist/html2canvas.js": [
    "chunk-Z27M7K2C.js"
  ],
  "node_modules/dompurify/dist/purify.es.mjs": [
    "chunk-LFZHQARY.js"
  ],
  "node_modules/canvg/lib/index.es.js": [
    "chunk-4O5FIFOP.js",
    "chunk-FK6H3RFT.js"
  ],
  "src/app/admin/repairs/admin-repair-form-page.ts": [
    "chunk-BOZD2YS4.js",
    "chunk-JZSLHTBV.js",
    "chunk-FK6H3RFT.js",
    "chunk-G7KUVB2S.js",
    "chunk-BYXBJQAS.js",
    "chunk-C6H7EQ4I.js"
  ],
  "src/app/admin/repairs/admin-repairs.routes.ts": [
    "chunk-XLS6GWHO.js"
  ],
  "src/app/admin/users/admin-users.routes.ts": [
    "chunk-NUB5JGAR.js"
  ],
  "src/app/admin/courses/admin-courses-page.ts": [
    "chunk-DCETICV2.js",
    "chunk-KA3NKT4E.js"
  ],
  "src/app/admin/courses/admin-course-form-page.ts": [
    "chunk-FIDCHFXK.js",
    "chunk-KA3NKT4E.js"
  ],
  "src/app/admin/courses/admin-courses.routes.ts": [
    "chunk-3MMUXWCK.js"
  ],
  "src/app/admin/orders/admin-orders-page.ts": [
    "chunk-DTM5DTM4.js",
    "chunk-U7GCOFF5.js",
    "chunk-A7HSRCHR.js"
  ],
  "src/app/admin/orders/admin-order-form-page.ts": [
    "chunk-CNP6UW5K.js",
    "chunk-U7GCOFF5.js"
  ],
  "src/app/admin/orders/admin-orders.routes.ts": [
    "chunk-EJZJ4LAY.js"
  ],
  "src/app/admin/services/admin-services-page.ts": [
    "chunk-TCXU3KSA.js"
  ],
  "src/app/admin/sales/admin-invoice-detail-page.ts": [
    "chunk-M64QKRYO.js",
    "chunk-C6H7EQ4I.js"
  ],
  "src/app/admin/sales/admin-sales.routes.ts": [
    "chunk-7DY6PVEP.js"
  ],
  "src/app/admin/inventory/admin-inventory-page.ts": [
    "chunk-GWNOW4UW.js",
    "chunk-G7KUVB2S.js",
    "chunk-A7HSRCHR.js"
  ],
  "src/app/admin/inventory/admin-inventory.routes.ts": [
    "chunk-3FME6SET.js"
  ],
  "src/app/admin/purchases/admin-purchases-page.ts": [
    "chunk-ANPBLIBF.js"
  ],
  "src/app/admin/purchases/admin-purchase-form-page.ts": [
    "chunk-IOTKUIQX.js"
  ],
  "src/app/admin/purchases/admin-purchases.routes.ts": [
    "chunk-LHYGADGD.js"
  ],
  "src/app/admin/users/admin-users-page.ts": [
    "chunk-P3Q27Y2Q.js"
  ],
  "src/app/admin/suppliers/admin-suppliers.routes.ts": [
    "chunk-FZUWEJO2.js"
  ],
  "src/app/admin/company/admin-company-settings-page.ts": [
    "chunk-XQU5NNDR.js"
  ],
  "src/app/admin/company/admin-company.routes.ts": [
    "chunk-ML6FKG4I.js"
  ],
  "src/app/admin/employees/admin-employees-page.ts": [
    "chunk-3DBGOYJ4.js"
  ],
  "src/app/admin/employees/admin-employee-form-page.ts": [
    "chunk-JPWKOKJR.js"
  ],
  "src/app/admin/employees/admin-employees.routes.ts": [
    "chunk-OSBFBKZC.js"
  ],
  "src/app/admin/sales/admin-sales-page.ts": [
    "chunk-OMCASY2B.js",
    "chunk-U7GCOFF5.js",
    "chunk-A7HSRCHR.js"
  ],
  "src/app/admin/sales/admin-invoices-page.ts": [
    "chunk-D75B5RLN.js"
  ],
  "src/app/admin/brands/admin-brands-page.ts": [
    "chunk-JATKHAC4.js"
  ],
  "src/app/admin/brands/admin-brand-form-page.ts": [
    "chunk-3WFCE6GJ.js"
  ],
  "src/app/admin/brands/admin-brands.routes.ts": [
    "chunk-X3Y5VQFX.js"
  ],
  "src/app/admin/clients/admin-clients-page.ts": [
    "chunk-DOEUSFS4.js"
  ],
  "src/app/admin/clients/admin-client-form-page.ts": [
    "chunk-TMJGNNV4.js"
  ],
  "src/app/admin/clients/admin-clients.routes.ts": [
    "chunk-HBJ5QNVH.js"
  ],
  "src/app/admin/suppliers/admin-suppliers-page.ts": [
    "chunk-XXRBOFFC.js"
  ],
  "src/app/admin/suppliers/admin-supplier-form-page.ts": [
    "chunk-DWRSZ4CJ.js"
  ],
  "src/app/admin/layout/admin-layout.ts": [
    "chunk-SFCEDL7Z.js",
    "chunk-VOOZUXUF.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/admin/dashboard/admin-dashboard-page.ts": [
    "chunk-ZWP5LZEX.js"
  ],
  "src/app/admin/products/admin-products-page.ts": [
    "chunk-3HUNM3AQ.js",
    "chunk-G7KUVB2S.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js"
  ],
  "src/app/admin/products/admin-product-form-page.ts": [
    "chunk-OX62JV33.js",
    "chunk-G7KUVB2S.js"
  ],
  "src/app/admin/products/admin-products.routes.ts": [
    "chunk-KON3C7EB.js"
  ],
  "src/app/admin/categories/admin-categories-page.ts": [
    "chunk-2A362PU4.js"
  ],
  "src/app/admin/categories/admin-category-form-page.ts": [
    "chunk-AT6I6WN6.js"
  ],
  "src/app/admin/categories/admin-categories.routes.ts": [
    "chunk-2TAI5CTN.js"
  ],
  "src/app/public/tracking/tracking-page.ts": [
    "chunk-6BHOU5CR.js",
    "chunk-BYXBJQAS.js",
    "chunk-C6H7EQ4I.js"
  ],
  "src/app/public/privacy/privacy.component.ts": [
    "chunk-N6XIZE4Z.js"
  ],
  "src/app/public/terms/terms.component.ts": [
    "chunk-V4CRIFIS.js"
  ],
  "src/app/public/blog/blog.component.ts": [
    "chunk-6KN3NELO.js",
    "chunk-CQ4V37A5.js"
  ],
  "src/app/public/sitemap/sitemap.component.ts": [
    "chunk-6TNGPROE.js"
  ],
  "src/app/public/fixtecnicos/fixtecnicos.component.ts": [
    "chunk-CH2475R2.js",
    "chunk-CQ4V37A5.js"
  ],
  "src/app/public/recursos/recursos.component.ts": [
    "chunk-3J62LWMO.js"
  ],
  "src/app/public/public.routes.ts": [
    "chunk-67SMZATA.js",
    "chunk-VOOZUXUF.js",
    "chunk-RDFP3WJA.js",
    "chunk-RT3FHDCP.js",
    "chunk-GJ2Q6YQS.js"
  ],
  "src/app/public/nosotros/nosotros.ts": [
    "chunk-X54WFBRA.js",
    "chunk-I7HI3DV5.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/contacto/contacto.ts": [
    "chunk-B2OYUPPK.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/servicios/servicios.ts": [
    "chunk-LTURTSY4.js",
    "chunk-CGSMRQ3D.js",
    "chunk-RDFP3WJA.js",
    "chunk-TQNQ43CE.js"
  ],
  "src/app/public/servicios/pages/detail/service-detail.component.ts": [
    "chunk-PZI7MIG2.js",
    "chunk-CGSMRQ3D.js"
  ],
  "src/app/public/cursos/cursos.ts": [
    "chunk-MSUXCW7X.js",
    "chunk-KA3NKT4E.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-GJQET5ZV.js",
    "chunk-ENDPDBLI.js",
    "chunk-6GFA7D5Y.js",
    "chunk-FVQCBJKK.js",
    "chunk-GJ2Q6YQS.js"
  ],
  "src/app/public/cursos/course-detail/course-detail.component.ts": [
    "chunk-7MPJM73K.js",
    "chunk-KA3NKT4E.js",
    "chunk-73O2YB7T.js"
  ],
  "src/app/public/checkout/checkout-page.ts": [
    "chunk-JDS72T4K.js",
    "chunk-U7GCOFF5.js",
    "chunk-RT3FHDCP.js",
    "chunk-FVQCBJKK.js",
    "chunk-GJ2Q6YQS.js"
  ],
  "src/app/public/posts/post-page.ts": [
    "chunk-JAWG3ZM6.js",
    "chunk-CQ4V37A5.js",
    "chunk-W4TB3PF7.js",
    "chunk-RT3FHDCP.js"
  ],
  "src/app/public/products/pages/details/products-details-page.ts": [
    "chunk-7FNUSUBX.js",
    "chunk-URRL2FHW.js",
    "chunk-73O2YB7T.js",
    "chunk-TQNQ43CE.js",
    "chunk-GJQET5ZV.js",
    "chunk-6GFA7D5Y.js",
    "chunk-FVQCBJKK.js",
    "chunk-GJ2Q6YQS.js"
  ],
  "src/app/public/products/pages/featured/products-featured-page.ts": [
    "chunk-F3EETK3Q.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-ENDPDBLI.js",
    "chunk-6GFA7D5Y.js",
    "chunk-FVQCBJKK.js",
    "chunk-GJ2Q6YQS.js"
  ],
  "src/app/public/products/products.routes.ts": [
    "chunk-CGHR3YQK.js"
  ],
  "src/app/public/auth/login/login.component.ts": [
    "chunk-L7XUIVWY.js"
  ],
  "src/app/public/auth/register/register.component.ts": [
    "chunk-YUTSPGBY.js"
  ],
  "src/app/public/profile/profile.component.ts": [
    "chunk-A5AZI4AP.js"
  ],
  "src/app/public/gsm/gsm.routes.ts": [
    "chunk-WEWDHFJ7.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/portfolio/portfolio.ts": [
    "chunk-PHWMQQLM.js",
    "chunk-I7HI3DV5.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/landing/celular/celular-landing.component.ts": [
    "chunk-7S333RRH.js",
    "chunk-W4TB3PF7.js",
    "chunk-RT3FHDCP.js",
    "chunk-URRL2FHW.js"
  ],
  "src/app/public/categories/pages/home/public-categories-home-page.ts": [
    "chunk-VWAMD3NA.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-GJQET5ZV.js"
  ],
  "src/app/public/categories/categories.routes.ts": [
    "chunk-5BEX2WPO.js"
  ],
  "src/app/public/products/pages/all/products-all-page.ts": [
    "chunk-EF3AASKS.js",
    "chunk-URRL2FHW.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-ENDPDBLI.js",
    "chunk-6GFA7D5Y.js",
    "chunk-FVQCBJKK.js",
    "chunk-GJ2Q6YQS.js"
  ],
  "src/app/public/products/pages/index/products-index-page.ts": [
    "chunk-2KAM6CB7.js",
    "chunk-GJQET5ZV.js",
    "chunk-ENDPDBLI.js",
    "chunk-6GFA7D5Y.js",
    "chunk-FVQCBJKK.js",
    "chunk-GJ2Q6YQS.js"
  ],
  "src/app/public/repuestos/repuestos.ts": [
    "chunk-FKQQAZD4.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-GJQET5ZV.js",
    "chunk-ENDPDBLI.js",
    "chunk-6GFA7D5Y.js",
    "chunk-FVQCBJKK.js",
    "chunk-GJ2Q6YQS.js"
  ],
  "src/app/public/products/pages/by-category/products-by-category-page.ts": [
    "chunk-MGK5MVWD.js",
    "chunk-URRL2FHW.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-GJQET5ZV.js",
    "chunk-ENDPDBLI.js",
    "chunk-6GFA7D5Y.js",
    "chunk-FVQCBJKK.js",
    "chunk-GJ2Q6YQS.js"
  ]
},
  assets: {
    'index.csr.html': {size: 15847, hash: '7bf4edb2a2995e1359715a1ea768638c34910d9293add42188c5d92c28b3af5c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 16387, hash: 'd912d505c1c9c596d4487348f9f23a9ad98e8a7c4cda44fb6fffd31d3a24012e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
