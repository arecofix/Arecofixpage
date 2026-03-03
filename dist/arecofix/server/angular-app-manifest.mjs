
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@mlc-ai/web-llm/lib/index.js": [
    "chunk-HDZ74XN4.js"
  ],
  "src/app/admin/repairs/admin-repair-form-page.ts": [
    "chunk-W75LEHVC.js",
    "chunk-OVSRRSOG.js",
    "chunk-FK6H3RFT.js",
    "chunk-AZBIAASJ.js",
    "chunk-BYXBJQAS.js",
    "chunk-3T5YPGGX.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/repairs/admin-repairs.routes.ts": [
    "chunk-SER2XM27.js"
  ],
  "src/app/admin/messages/admin-messages-page.ts": [
    "chunk-WKMYKG2D.js"
  ],
  "src/app/admin/messages/admin-messages.routes.ts": [
    "chunk-5GLR7GXI.js"
  ],
  "src/app/admin/posts/admin-posts-page.ts": [
    "chunk-FME4L4BY.js",
    "chunk-A5IVSE2K.js"
  ],
  "src/app/admin/posts/admin-post-form-page.ts": [
    "chunk-3CYOSSSW.js",
    "chunk-A5IVSE2K.js"
  ],
  "src/app/admin/posts/admin-posts.routes.ts": [
    "chunk-OOVOHVKC.js"
  ],
  "src/app/admin/admin.routes.ts": [
    "chunk-JPH3MNN7.js"
  ],
  "src/app/admin/orders/admin-orders.routes.ts": [
    "chunk-MSEELC3W.js"
  ],
  "src/app/admin/services/admin-services-page.ts": [
    "chunk-C5HOTEBY.js",
    "chunk-OTWM5GNN.js"
  ],
  "src/app/admin/services/admin-service-form-page.ts": [
    "chunk-6TANNSDT.js",
    "chunk-OTWM5GNN.js"
  ],
  "src/app/admin/services/admin-services.routes.ts": [
    "chunk-DFYATFMJ.js"
  ],
  "src/app/admin/repairs/admin-repairs-page.ts": [
    "chunk-3WBYQWEI.js",
    "chunk-OVSRRSOG.js",
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
  "src/app/admin/purchases/admin-purchases.routes.ts": [
    "chunk-PQTKXDY7.js"
  ],
  "src/app/admin/users/admin-users-page.ts": [
    "chunk-E2WJMTN6.js"
  ],
  "src/app/admin/users/admin-users.routes.ts": [
    "chunk-ZJGHLHAD.js"
  ],
  "src/app/admin/courses/admin-courses-page.ts": [
    "chunk-BRVJFBEG.js",
    "chunk-WP3PUXSU.js"
  ],
  "src/app/admin/courses/admin-course-form-page.ts": [
    "chunk-ZPY5ZIR3.js",
    "chunk-WP3PUXSU.js"
  ],
  "src/app/admin/courses/admin-courses.routes.ts": [
    "chunk-OMGVQA5L.js"
  ],
  "src/app/admin/orders/admin-orders-page.ts": [
    "chunk-VZ4YDGDY.js",
    "chunk-NZBKPKP6.js",
    "chunk-PI4Y55AZ.js"
  ],
  "src/app/admin/orders/admin-order-form-page.ts": [
    "chunk-ZVME7CIH.js",
    "chunk-NZBKPKP6.js"
  ],
  "src/app/admin/sales/admin-sales-page.ts": [
    "chunk-L7ERCPAV.js",
    "chunk-NZBKPKP6.js",
    "chunk-PI4Y55AZ.js"
  ],
  "src/app/admin/sales/admin-invoices-page.ts": [
    "chunk-WIFF6YC3.js"
  ],
  "src/app/admin/sales/admin-invoice-detail-page.ts": [
    "chunk-2GAMFEOA.js",
    "chunk-3T5YPGGX.js"
  ],
  "src/app/admin/sales/admin-sales.routes.ts": [
    "chunk-EYY2BHYX.js"
  ],
  "src/app/admin/inventory/admin-inventory-page.ts": [
    "chunk-KCHLNIYS.js",
    "chunk-AZBIAASJ.js",
    "chunk-PI4Y55AZ.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/inventory/admin-inventory.routes.ts": [
    "chunk-5EUMBFUB.js"
  ],
  "src/app/admin/purchases/admin-purchases-page.ts": [
    "chunk-QR7C7KH4.js"
  ],
  "src/app/admin/purchases/admin-purchase-form-page.ts": [
    "chunk-R46M6GG7.js"
  ],
  "src/app/admin/suppliers/admin-suppliers-page.ts": [
    "chunk-GZYLHZFC.js",
    "chunk-UD3D4MTD.js"
  ],
  "src/app/admin/suppliers/admin-supplier-form-page.ts": [
    "chunk-P4W6FYT7.js",
    "chunk-UD3D4MTD.js"
  ],
  "src/app/admin/suppliers/admin-suppliers.routes.ts": [
    "chunk-WXVFASFM.js"
  ],
  "src/app/admin/company/admin-company-settings-page.ts": [
    "chunk-ETOO5TAK.js"
  ],
  "src/app/admin/company/admin-company.routes.ts": [
    "chunk-G5L3GWRM.js"
  ],
  "src/app/admin/employees/admin-employees-page.ts": [
    "chunk-BUAM67ID.js"
  ],
  "src/app/admin/employees/admin-employee-form-page.ts": [
    "chunk-TV3L3PEO.js"
  ],
  "src/app/admin/employees/admin-employees.routes.ts": [
    "chunk-VJSF6QJW.js"
  ],
  "src/app/admin/categories/admin-category-form-page.ts": [
    "chunk-CBCCU24B.js",
    "chunk-WT46BASI.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/categories/admin-categories.routes.ts": [
    "chunk-NSUAHANV.js"
  ],
  "src/app/admin/brands/admin-brands-page.ts": [
    "chunk-GR6REWXI.js"
  ],
  "src/app/admin/brands/admin-brand-form-page.ts": [
    "chunk-TH3NW7ZN.js"
  ],
  "src/app/admin/brands/admin-brands.routes.ts": [
    "chunk-WSCJA5YC.js"
  ],
  "src/app/admin/clients/admin-clients-page.ts": [
    "chunk-GXM2QFY7.js"
  ],
  "src/app/admin/clients/admin-client-form-page.ts": [
    "chunk-MGUSSPJZ.js"
  ],
  "src/app/admin/clients/admin-clients.routes.ts": [
    "chunk-E7U6CW5B.js"
  ],
  "src/app/public/recursos/recursos.component.ts": [
    "chunk-YF4WW5XI.js"
  ],
  "src/app/public/public.routes.ts": [
    "chunk-ESXFRPND.js",
    "chunk-EQ4A5ETV.js",
    "chunk-OGE2LXHH.js",
    "chunk-MYBRJXAJ.js",
    "chunk-TQ5PDKCI.js"
  ],
  "src/app/admin/layout/admin-layout.ts": [
    "chunk-BRRLU6GZ.js",
    "chunk-EQ4A5ETV.js",
    "chunk-OGE2LXHH.js"
  ],
  "src/app/admin/dashboard/admin-dashboard-page.ts": [
    "chunk-KOOMFTL7.js"
  ],
  "src/app/admin/products/admin-products-page.ts": [
    "chunk-7QUWAAUU.js",
    "chunk-AZBIAASJ.js",
    "chunk-PI4Y55AZ.js",
    "chunk-POD4HRXZ.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/products/admin-product-form-page.ts": [
    "chunk-NGBJY72D.js",
    "chunk-AZBIAASJ.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/products/admin-products.routes.ts": [
    "chunk-GLSAHSQV.js"
  ],
  "src/app/admin/categories/admin-categories-page.ts": [
    "chunk-3YSZM5WL.js"
  ],
  "src/app/public/checkout/checkout-page.ts": [
    "chunk-3YATBWB6.js",
    "chunk-NZBKPKP6.js",
    "chunk-MYBRJXAJ.js",
    "chunk-BOPEFEYP.js",
    "chunk-TQ5PDKCI.js"
  ],
  "src/app/public/posts/post-page.ts": [
    "chunk-CCCE7IR2.js",
    "chunk-7WFWK6DR.js",
    "chunk-3RRQJW64.js",
    "chunk-MYBRJXAJ.js"
  ],
  "src/app/public/tracking/tracking-page.ts": [
    "chunk-MYCZ6YMA.js",
    "chunk-BYXBJQAS.js",
    "chunk-3T5YPGGX.js"
  ],
  "src/app/public/privacy/privacy.component.ts": [
    "chunk-Y7AD4MA4.js"
  ],
  "src/app/public/terms/terms.component.ts": [
    "chunk-RLA3LTRZ.js"
  ],
  "src/app/public/blog/blog.component.ts": [
    "chunk-MW4ZPOZQ.js",
    "chunk-7WFWK6DR.js"
  ],
  "src/app/public/sitemap/sitemap.component.ts": [
    "chunk-PIVRKHHO.js"
  ],
  "src/app/public/fixtecnicos/fixtecnicos.component.ts": [
    "chunk-SSPIFWIJ.js",
    "chunk-7WFWK6DR.js"
  ],
  "src/app/public/gsm/gsm.routes.ts": [
    "chunk-JYANNB2U.js",
    "chunk-OGE2LXHH.js"
  ],
  "src/app/public/portfolio/portfolio.ts": [
    "chunk-6YGEHVR2.js",
    "chunk-FXHONYIG.js",
    "chunk-OGE2LXHH.js"
  ],
  "src/app/public/nosotros/nosotros.ts": [
    "chunk-6RVLGVJT.js",
    "chunk-FXHONYIG.js",
    "chunk-OGE2LXHH.js"
  ],
  "src/app/public/contacto/contacto.ts": [
    "chunk-BE7ISMEO.js",
    "chunk-OGE2LXHH.js"
  ],
  "src/app/public/servicios/servicios.ts": [
    "chunk-72QMNXQP.js",
    "chunk-OGE2LXHH.js",
    "chunk-CGSMRQ3D.js",
    "chunk-POD4HRXZ.js"
  ],
  "src/app/public/servicios/pages/detail/service-detail.component.ts": [
    "chunk-ISC2FCOQ.js",
    "chunk-CGSMRQ3D.js"
  ],
  "src/app/public/cursos/cursos.ts": [
    "chunk-RGM7D3WR.js",
    "chunk-WP3PUXSU.js",
    "chunk-FT2NH25R.js",
    "chunk-PI4Y55AZ.js",
    "chunk-UPSZB7IT.js",
    "chunk-POD4HRXZ.js",
    "chunk-FNOMVEKC.js",
    "chunk-WT46BASI.js",
    "chunk-UO5M3KBC.js",
    "chunk-RVT6SOKL.js",
    "chunk-OCSLIUPP.js",
    "chunk-BOPEFEYP.js",
    "chunk-TQ5PDKCI.js"
  ],
  "src/app/public/cursos/course-detail/course-detail.component.ts": [
    "chunk-V27W6HXD.js",
    "chunk-WP3PUXSU.js",
    "chunk-UPSZB7IT.js"
  ],
  "src/app/public/repuestos/repuestos.ts": [
    "chunk-A55FRGPL.js",
    "chunk-FT2NH25R.js",
    "chunk-PI4Y55AZ.js",
    "chunk-POD4HRXZ.js",
    "chunk-FNOMVEKC.js",
    "chunk-WT46BASI.js",
    "chunk-UO5M3KBC.js",
    "chunk-RVT6SOKL.js",
    "chunk-OCSLIUPP.js",
    "chunk-BOPEFEYP.js",
    "chunk-TQ5PDKCI.js"
  ],
  "src/app/public/products/pages/by-category/products-by-category-page.ts": [
    "chunk-ILGLUAAR.js",
    "chunk-C5AGD4LA.js",
    "chunk-FT2NH25R.js",
    "chunk-PI4Y55AZ.js",
    "chunk-UPSZB7IT.js",
    "chunk-POD4HRXZ.js",
    "chunk-FNOMVEKC.js",
    "chunk-WT46BASI.js",
    "chunk-UO5M3KBC.js",
    "chunk-RVT6SOKL.js",
    "chunk-OCSLIUPP.js",
    "chunk-BOPEFEYP.js",
    "chunk-TQ5PDKCI.js"
  ],
  "src/app/public/products/pages/details/products-details-page.ts": [
    "chunk-TQ2AJ3ZG.js",
    "chunk-C5AGD4LA.js",
    "chunk-UPSZB7IT.js",
    "chunk-POD4HRXZ.js",
    "chunk-FNOMVEKC.js",
    "chunk-WT46BASI.js",
    "chunk-UO5M3KBC.js",
    "chunk-OCSLIUPP.js",
    "chunk-BOPEFEYP.js",
    "chunk-TQ5PDKCI.js"
  ],
  "src/app/public/products/pages/featured/products-featured-page.ts": [
    "chunk-D6PQW7TZ.js",
    "chunk-FT2NH25R.js",
    "chunk-PI4Y55AZ.js",
    "chunk-UPSZB7IT.js",
    "chunk-POD4HRXZ.js",
    "chunk-RVT6SOKL.js",
    "chunk-OCSLIUPP.js",
    "chunk-BOPEFEYP.js",
    "chunk-TQ5PDKCI.js"
  ],
  "src/app/public/products/products.routes.ts": [
    "chunk-6UT3CL24.js"
  ],
  "src/app/public/auth/login/login.component.ts": [
    "chunk-OGAL4CWU.js"
  ],
  "src/app/public/auth/register/register.component.ts": [
    "chunk-ZE5XQHMJ.js"
  ],
  "src/app/public/profile/profile.component.ts": [
    "chunk-2LSKE7LY.js"
  ],
  "node_modules/@capacitor/app/dist/esm/web.js": [
    "chunk-MRPGOKYE.js"
  ],
  "node_modules/@capacitor/browser/dist/esm/web.js": [
    "chunk-UR6Z7I77.js"
  ],
  "src/app/public/landing/celular/celular-landing.component.ts": [
    "chunk-X5QTJKR2.js",
    "chunk-3RRQJW64.js",
    "chunk-MYBRJXAJ.js",
    "chunk-C5AGD4LA.js"
  ],
  "src/app/public/categories/pages/home/public-categories-home-page.ts": [
    "chunk-J5ZAWPQG.js",
    "chunk-FT2NH25R.js",
    "chunk-PI4Y55AZ.js",
    "chunk-UPSZB7IT.js",
    "chunk-POD4HRXZ.js",
    "chunk-FNOMVEKC.js",
    "chunk-WT46BASI.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/public/categories/categories.routes.ts": [
    "chunk-BX3PJOIL.js"
  ],
  "src/app/public/products/pages/all/products-all-page.ts": [
    "chunk-FZBZIANO.js",
    "chunk-C5AGD4LA.js",
    "chunk-FT2NH25R.js",
    "chunk-PI4Y55AZ.js",
    "chunk-UPSZB7IT.js",
    "chunk-POD4HRXZ.js",
    "chunk-RVT6SOKL.js",
    "chunk-OCSLIUPP.js",
    "chunk-BOPEFEYP.js",
    "chunk-TQ5PDKCI.js"
  ],
  "src/app/public/products/pages/index/products-index-page.ts": [
    "chunk-AX5TKU5W.js",
    "chunk-FNOMVEKC.js",
    "chunk-WT46BASI.js",
    "chunk-UO5M3KBC.js",
    "chunk-RVT6SOKL.js",
    "chunk-OCSLIUPP.js",
    "chunk-BOPEFEYP.js",
    "chunk-TQ5PDKCI.js"
  ]
},
  assets: {
    'index.csr.html': {size: 15847, hash: 'ace66f534abdd8c55ad8d89203793df950461f57c64342446d926a800ce2fadb', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 16387, hash: '5fe4d952943c79d0ccd8686fed0eeb89530557396c2a435eeb9aeebc2f029d12', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
