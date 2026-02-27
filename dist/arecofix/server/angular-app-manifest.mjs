
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@mlc-ai/web-llm/lib/index.js": [
    "chunk-EZP7SFDH.js"
  ],
  "src/app/admin/repairs/admin-repair-form-page.ts": [
    "chunk-AXF75SOL.js",
    "chunk-2DAVW2HS.js",
    "chunk-7YWLATDR.js",
    "chunk-EJD3GE5R.js",
    "chunk-U4PZDU6F.js",
    "chunk-CQ2W4MXD.js"
  ],
  "src/app/admin/repairs/admin-repairs.routes.ts": [
    "chunk-Z22KUITM.js"
  ],
  "src/app/admin/messages/admin-messages-page.ts": [
    "chunk-DPPEV7VN.js"
  ],
  "src/app/admin/messages/admin-messages.routes.ts": [
    "chunk-BKKHZY4Z.js"
  ],
  "src/app/admin/posts/admin-posts-page.ts": [
    "chunk-6NMFP64Z.js",
    "chunk-IUQCZAY5.js"
  ],
  "src/app/admin/posts/admin-post-form-page.ts": [
    "chunk-5LI2J2DG.js",
    "chunk-IUQCZAY5.js"
  ],
  "src/app/admin/posts/admin-posts.routes.ts": [
    "chunk-JCHD6AIY.js"
  ],
  "src/app/admin/admin.routes.ts": [
    "chunk-26L7WYZN.js"
  ],
  "src/app/admin/orders/admin-orders.routes.ts": [
    "chunk-IXNYTB4U.js"
  ],
  "src/app/admin/services/admin-services-page.ts": [
    "chunk-ONKNQEX3.js"
  ],
  "src/app/admin/services/admin-service-form-page.ts": [
    "chunk-C7TPPEYT.js"
  ],
  "src/app/admin/services/admin-services.routes.ts": [
    "chunk-3SKUTR4Z.js"
  ],
  "src/app/admin/repairs/admin-repairs-page.ts": [
    "chunk-7KM5Z3RT.js",
    "chunk-2DAVW2HS.js",
    "chunk-U4PZDU6F.js"
  ],
  "node_modules/html2canvas/dist/html2canvas.js": [
    "chunk-WROLUZ4V.js"
  ],
  "node_modules/dompurify/dist/purify.es.mjs": [
    "chunk-YGLZNEXW.js"
  ],
  "node_modules/canvg/lib/index.es.js": [
    "chunk-4SVVXQG2.js",
    "chunk-7YWLATDR.js"
  ],
  "src/app/admin/purchases/admin-purchases.routes.ts": [
    "chunk-2U53JNL5.js"
  ],
  "src/app/admin/users/admin-users-page.ts": [
    "chunk-5VLELYLA.js"
  ],
  "src/app/admin/users/admin-users.routes.ts": [
    "chunk-UM42WHUY.js"
  ],
  "src/app/admin/courses/admin-courses-page.ts": [
    "chunk-RV72LVCK.js",
    "chunk-SPT7TP4Q.js"
  ],
  "src/app/admin/courses/admin-course-form-page.ts": [
    "chunk-Z2QUC5OV.js",
    "chunk-SPT7TP4Q.js"
  ],
  "src/app/admin/courses/admin-courses.routes.ts": [
    "chunk-EKTIOQAS.js"
  ],
  "src/app/admin/orders/admin-orders-page.ts": [
    "chunk-3CWIRIB3.js",
    "chunk-DAUE7PPW.js",
    "chunk-W43WNFKI.js"
  ],
  "src/app/admin/orders/admin-order-form-page.ts": [
    "chunk-CJV7NYLO.js",
    "chunk-DAUE7PPW.js"
  ],
  "src/app/admin/sales/admin-sales-page.ts": [
    "chunk-WF63PZ2T.js",
    "chunk-DAUE7PPW.js",
    "chunk-W43WNFKI.js"
  ],
  "src/app/admin/sales/admin-invoices-page.ts": [
    "chunk-O4HZZGDD.js"
  ],
  "src/app/admin/sales/admin-invoice-detail-page.ts": [
    "chunk-LBA5ND7X.js",
    "chunk-CQ2W4MXD.js"
  ],
  "src/app/admin/sales/admin-sales.routes.ts": [
    "chunk-3BWLKJAN.js"
  ],
  "src/app/admin/inventory/admin-inventory-page.ts": [
    "chunk-NKQJB4UY.js",
    "chunk-EJD3GE5R.js",
    "chunk-W43WNFKI.js"
  ],
  "src/app/admin/inventory/admin-inventory.routes.ts": [
    "chunk-OUKUHMZT.js"
  ],
  "src/app/admin/purchases/admin-purchases-page.ts": [
    "chunk-UEVYHIG5.js"
  ],
  "src/app/admin/purchases/admin-purchase-form-page.ts": [
    "chunk-JDQJSZ7T.js"
  ],
  "src/app/admin/suppliers/admin-suppliers-page.ts": [
    "chunk-WQNLMXJV.js"
  ],
  "src/app/admin/suppliers/admin-supplier-form-page.ts": [
    "chunk-GX7CCEU3.js"
  ],
  "src/app/admin/suppliers/admin-suppliers.routes.ts": [
    "chunk-ZQ3VTRJZ.js"
  ],
  "src/app/admin/company/admin-company-settings-page.ts": [
    "chunk-73DV43UW.js"
  ],
  "src/app/admin/company/admin-company.routes.ts": [
    "chunk-VBCHBUZG.js"
  ],
  "src/app/admin/employees/admin-employees-page.ts": [
    "chunk-H5OOSZYL.js"
  ],
  "src/app/admin/employees/admin-employee-form-page.ts": [
    "chunk-ACWO3A7H.js"
  ],
  "src/app/admin/employees/admin-employees.routes.ts": [
    "chunk-F4FF3WTZ.js"
  ],
  "src/app/admin/categories/admin-category-form-page.ts": [
    "chunk-ZRFZSBVX.js"
  ],
  "src/app/admin/categories/admin-categories.routes.ts": [
    "chunk-NYWSOUQE.js"
  ],
  "src/app/admin/brands/admin-brands-page.ts": [
    "chunk-DHZAFXMD.js"
  ],
  "src/app/admin/brands/admin-brand-form-page.ts": [
    "chunk-FYT4YWWV.js"
  ],
  "src/app/admin/brands/admin-brands.routes.ts": [
    "chunk-QFMP7JJB.js"
  ],
  "src/app/admin/clients/admin-clients-page.ts": [
    "chunk-WPUGHKY7.js"
  ],
  "src/app/admin/clients/admin-client-form-page.ts": [
    "chunk-VROIPWCJ.js"
  ],
  "src/app/admin/clients/admin-clients.routes.ts": [
    "chunk-Q643C3DZ.js"
  ],
  "src/app/public/recursos/recursos.component.ts": [
    "chunk-DC55JY54.js"
  ],
  "src/app/public/public.routes.ts": [
    "chunk-XZMVHVHV.js",
    "chunk-GUMHHYLY.js",
    "chunk-EECV4RMG.js",
    "chunk-VRGTTU5P.js",
    "chunk-E27AYZUW.js"
  ],
  "src/app/admin/layout/admin-layout.ts": [
    "chunk-FX2ZAXQL.js",
    "chunk-GUMHHYLY.js",
    "chunk-EECV4RMG.js"
  ],
  "src/app/admin/dashboard/admin-dashboard-page.ts": [
    "chunk-C2BDW7ZJ.js"
  ],
  "src/app/admin/products/admin-products-page.ts": [
    "chunk-GTW7GILK.js",
    "chunk-EJD3GE5R.js",
    "chunk-W43WNFKI.js",
    "chunk-OXRRQGKG.js"
  ],
  "src/app/admin/products/admin-product-form-page.ts": [
    "chunk-ZRUIJBCK.js",
    "chunk-EJD3GE5R.js"
  ],
  "src/app/admin/products/admin-products.routes.ts": [
    "chunk-UALDFV77.js"
  ],
  "src/app/admin/categories/admin-categories-page.ts": [
    "chunk-AADGVLTP.js"
  ],
  "src/app/public/checkout/checkout-page.ts": [
    "chunk-UB6TL37B.js",
    "chunk-DAUE7PPW.js",
    "chunk-VRGTTU5P.js",
    "chunk-2X54MGFE.js",
    "chunk-E27AYZUW.js"
  ],
  "src/app/public/posts/post-page.ts": [
    "chunk-HCCE7NWX.js",
    "chunk-66B2ZSJN.js",
    "chunk-SQOKMBJC.js",
    "chunk-VRGTTU5P.js"
  ],
  "src/app/public/tracking/tracking-page.ts": [
    "chunk-3CDWH3CH.js",
    "chunk-U4PZDU6F.js",
    "chunk-CQ2W4MXD.js"
  ],
  "src/app/public/privacy/privacy.component.ts": [
    "chunk-QDL7OU27.js"
  ],
  "src/app/public/terms/terms.component.ts": [
    "chunk-L2PA5AFH.js"
  ],
  "src/app/public/blog/blog.component.ts": [
    "chunk-NEFPQKNH.js",
    "chunk-66B2ZSJN.js"
  ],
  "src/app/public/sitemap/sitemap.component.ts": [
    "chunk-CFHRLNYQ.js"
  ],
  "src/app/public/fixtecnicos/fixtecnicos.component.ts": [
    "chunk-K4F4QCIX.js",
    "chunk-66B2ZSJN.js"
  ],
  "src/app/public/gsm/gsm.routes.ts": [
    "chunk-MMSSM36N.js",
    "chunk-EECV4RMG.js"
  ],
  "src/app/public/portfolio/portfolio.ts": [
    "chunk-IY4UYDES.js",
    "chunk-YLYUX466.js",
    "chunk-EECV4RMG.js"
  ],
  "src/app/public/nosotros/nosotros.ts": [
    "chunk-YFK74NJX.js",
    "chunk-YLYUX466.js",
    "chunk-EECV4RMG.js"
  ],
  "src/app/public/contacto/contacto.ts": [
    "chunk-QASGDSB5.js",
    "chunk-EECV4RMG.js"
  ],
  "src/app/public/servicios/servicios.ts": [
    "chunk-HOU6RLF3.js",
    "chunk-EECV4RMG.js",
    "chunk-CV6KBVFM.js",
    "chunk-OXRRQGKG.js"
  ],
  "src/app/public/servicios/pages/detail/service-detail.component.ts": [
    "chunk-574SQ5LU.js",
    "chunk-CV6KBVFM.js"
  ],
  "src/app/public/cursos/cursos.ts": [
    "chunk-A2YHU36Q.js",
    "chunk-SPT7TP4Q.js",
    "chunk-TSFVBXON.js",
    "chunk-W43WNFKI.js",
    "chunk-MB7OW326.js",
    "chunk-OXRRQGKG.js",
    "chunk-J7ZKSYPH.js",
    "chunk-PAHDEXUL.js",
    "chunk-XYL2VWIS.js",
    "chunk-2X54MGFE.js",
    "chunk-E27AYZUW.js"
  ],
  "src/app/public/cursos/course-detail/course-detail.component.ts": [
    "chunk-UGPFGRDG.js",
    "chunk-SPT7TP4Q.js",
    "chunk-MB7OW326.js"
  ],
  "src/app/public/repuestos/repuestos.ts": [
    "chunk-TXMYKTSF.js",
    "chunk-TSFVBXON.js",
    "chunk-W43WNFKI.js",
    "chunk-OXRRQGKG.js",
    "chunk-J7ZKSYPH.js",
    "chunk-PAHDEXUL.js",
    "chunk-XYL2VWIS.js",
    "chunk-2X54MGFE.js",
    "chunk-E27AYZUW.js"
  ],
  "src/app/public/products/pages/by-category/products-by-category-page.ts": [
    "chunk-IQJF5OBN.js",
    "chunk-LIQI56ZA.js",
    "chunk-TSFVBXON.js",
    "chunk-W43WNFKI.js",
    "chunk-MB7OW326.js",
    "chunk-OXRRQGKG.js",
    "chunk-J7ZKSYPH.js",
    "chunk-PAHDEXUL.js",
    "chunk-XYL2VWIS.js",
    "chunk-2X54MGFE.js",
    "chunk-E27AYZUW.js"
  ],
  "src/app/public/products/pages/details/products-details-page.ts": [
    "chunk-KVS7FPYD.js",
    "chunk-LIQI56ZA.js",
    "chunk-MB7OW326.js",
    "chunk-OXRRQGKG.js",
    "chunk-J7ZKSYPH.js",
    "chunk-XYL2VWIS.js",
    "chunk-2X54MGFE.js",
    "chunk-E27AYZUW.js"
  ],
  "src/app/public/products/pages/featured/products-featured-page.ts": [
    "chunk-HLFQJU4X.js",
    "chunk-TSFVBXON.js",
    "chunk-W43WNFKI.js",
    "chunk-MB7OW326.js",
    "chunk-OXRRQGKG.js",
    "chunk-PAHDEXUL.js",
    "chunk-XYL2VWIS.js",
    "chunk-2X54MGFE.js",
    "chunk-E27AYZUW.js"
  ],
  "src/app/public/products/products.routes.ts": [
    "chunk-7WAA6YND.js"
  ],
  "src/app/public/auth/login/login.component.ts": [
    "chunk-YLANOIAG.js"
  ],
  "src/app/public/auth/register/register.component.ts": [
    "chunk-LIU3WFN4.js"
  ],
  "src/app/public/profile/profile.component.ts": [
    "chunk-WUDLO4MG.js"
  ],
  "node_modules/@capacitor/app/dist/esm/web.js": [
    "chunk-LG7YINS7.js"
  ],
  "node_modules/@capacitor/browser/dist/esm/web.js": [
    "chunk-PETRFRYC.js"
  ],
  "src/app/public/landing/celular/celular-landing.component.ts": [
    "chunk-6SRRXU64.js",
    "chunk-SQOKMBJC.js",
    "chunk-VRGTTU5P.js",
    "chunk-LIQI56ZA.js"
  ],
  "src/app/public/categories/pages/home/public-categories-home-page.ts": [
    "chunk-VI2NEDYI.js",
    "chunk-TSFVBXON.js",
    "chunk-W43WNFKI.js",
    "chunk-MB7OW326.js",
    "chunk-OXRRQGKG.js",
    "chunk-J7ZKSYPH.js"
  ],
  "src/app/public/categories/categories.routes.ts": [
    "chunk-NCKA7BG2.js"
  ],
  "src/app/public/products/pages/all/products-all-page.ts": [
    "chunk-SAPNKFNE.js",
    "chunk-LIQI56ZA.js",
    "chunk-TSFVBXON.js",
    "chunk-W43WNFKI.js",
    "chunk-MB7OW326.js",
    "chunk-OXRRQGKG.js",
    "chunk-PAHDEXUL.js",
    "chunk-XYL2VWIS.js",
    "chunk-2X54MGFE.js",
    "chunk-E27AYZUW.js"
  ],
  "src/app/public/products/pages/index/products-index-page.ts": [
    "chunk-S4GEAWGH.js",
    "chunk-J7ZKSYPH.js",
    "chunk-PAHDEXUL.js",
    "chunk-XYL2VWIS.js",
    "chunk-2X54MGFE.js",
    "chunk-E27AYZUW.js"
  ]
},
  assets: {
    'index.csr.html': {size: 8470, hash: 'ab7f7617b1e024e6328f673c10e1c2c394851ccdd7a822f190208b42d24179cb', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 9010, hash: 'a55124da9db38818f213a5a0f5ad25f40f6f2d229c3490b90b8135911b9106e1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
