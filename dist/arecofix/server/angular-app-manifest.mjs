
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/admin/messages/admin-messages-page.ts": [
    "chunk-OW47CBWA.js"
  ],
  "src/app/admin/messages/admin-messages.routes.ts": [
    "chunk-PFOFQPDL.js"
  ],
  "src/app/admin/posts/admin-posts-page.ts": [
    "chunk-A6TKQIDI.js",
    "chunk-IIAGRJKX.js"
  ],
  "src/app/admin/posts/admin-post-form-page.ts": [
    "chunk-ZUOMI2TJ.js",
    "chunk-IIAGRJKX.js"
  ],
  "src/app/admin/posts/admin-posts.routes.ts": [
    "chunk-2C4GHVRC.js"
  ],
  "src/app/admin/admin.routes.ts": [
    "chunk-V5LL5D6F.js"
  ],
  "node_modules/@mlc-ai/web-llm/lib/index.js": [
    "chunk-HDZ74XN4.js"
  ],
  "src/app/admin/services/admin-service-form-page.ts": [
    "chunk-RGGUDL2Z.js"
  ],
  "src/app/admin/services/admin-services.routes.ts": [
    "chunk-5M5ZVDDS.js"
  ],
  "src/app/admin/repairs/admin-repairs-page.ts": [
    "chunk-CW4ZJXPP.js",
    "chunk-SGBFKLCY.js",
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
    "chunk-ISWV5LOM.js",
    "chunk-SGBFKLCY.js",
    "chunk-FK6H3RFT.js",
    "chunk-WOPAPDZY.js",
    "chunk-BYXBJQAS.js",
    "chunk-Y4XUJW5R.js"
  ],
  "src/app/admin/repairs/admin-repairs.routes.ts": [
    "chunk-R5DG3QYY.js"
  ],
  "src/app/admin/users/admin-users.routes.ts": [
    "chunk-TGGUOF5K.js"
  ],
  "src/app/admin/courses/admin-courses-page.ts": [
    "chunk-VCUUCWVN.js",
    "chunk-MKNNU3GC.js"
  ],
  "src/app/admin/courses/admin-course-form-page.ts": [
    "chunk-MNWOJYNK.js",
    "chunk-MKNNU3GC.js"
  ],
  "src/app/admin/courses/admin-courses.routes.ts": [
    "chunk-CGYIRZGD.js"
  ],
  "src/app/admin/orders/admin-orders-page.ts": [
    "chunk-73CVULDF.js",
    "chunk-47B4IAFB.js",
    "chunk-A7HSRCHR.js"
  ],
  "src/app/admin/orders/admin-order-form-page.ts": [
    "chunk-J6C3X636.js",
    "chunk-47B4IAFB.js"
  ],
  "src/app/admin/orders/admin-orders.routes.ts": [
    "chunk-5JYUH75B.js"
  ],
  "src/app/admin/services/admin-services-page.ts": [
    "chunk-OQ645LMC.js"
  ],
  "src/app/admin/sales/admin-invoice-detail-page.ts": [
    "chunk-W5XJ6WLD.js",
    "chunk-Y4XUJW5R.js"
  ],
  "src/app/admin/sales/admin-sales.routes.ts": [
    "chunk-LVXCIDGY.js"
  ],
  "src/app/admin/inventory/admin-inventory-page.ts": [
    "chunk-SXUKPFLW.js",
    "chunk-WOPAPDZY.js",
    "chunk-A7HSRCHR.js"
  ],
  "src/app/admin/inventory/admin-inventory.routes.ts": [
    "chunk-6DKXH7S5.js"
  ],
  "src/app/admin/purchases/admin-purchases-page.ts": [
    "chunk-ZRHDHOUB.js"
  ],
  "src/app/admin/purchases/admin-purchase-form-page.ts": [
    "chunk-QS6M7XHS.js"
  ],
  "src/app/admin/purchases/admin-purchases.routes.ts": [
    "chunk-HN35QYIU.js"
  ],
  "src/app/admin/users/admin-users-page.ts": [
    "chunk-L5EDQBG2.js"
  ],
  "src/app/admin/suppliers/admin-suppliers.routes.ts": [
    "chunk-QNFASXKC.js"
  ],
  "src/app/admin/company/admin-company-settings-page.ts": [
    "chunk-7JXYM5ZS.js"
  ],
  "src/app/admin/company/admin-company.routes.ts": [
    "chunk-CSETJYGD.js"
  ],
  "src/app/admin/employees/admin-employees-page.ts": [
    "chunk-4AKOEVHO.js"
  ],
  "src/app/admin/employees/admin-employee-form-page.ts": [
    "chunk-GEKDQB2S.js"
  ],
  "src/app/admin/employees/admin-employees.routes.ts": [
    "chunk-EC34S7OL.js"
  ],
  "src/app/admin/sales/admin-sales-page.ts": [
    "chunk-IYAGSGSO.js",
    "chunk-47B4IAFB.js",
    "chunk-A7HSRCHR.js"
  ],
  "src/app/admin/sales/admin-invoices-page.ts": [
    "chunk-ALA6K2XV.js"
  ],
  "src/app/admin/brands/admin-brands-page.ts": [
    "chunk-DKQFOKYB.js"
  ],
  "src/app/admin/brands/admin-brand-form-page.ts": [
    "chunk-VF4HRC2F.js"
  ],
  "src/app/admin/brands/admin-brands.routes.ts": [
    "chunk-LNA3U5HR.js"
  ],
  "src/app/admin/clients/admin-clients-page.ts": [
    "chunk-DEH3FCFY.js"
  ],
  "src/app/admin/clients/admin-client-form-page.ts": [
    "chunk-3SOL4TP4.js"
  ],
  "src/app/admin/clients/admin-clients.routes.ts": [
    "chunk-R3R3O3TL.js"
  ],
  "src/app/admin/suppliers/admin-suppliers-page.ts": [
    "chunk-KCN647PK.js"
  ],
  "src/app/admin/suppliers/admin-supplier-form-page.ts": [
    "chunk-3RB4ZY3Q.js"
  ],
  "src/app/admin/layout/admin-layout.ts": [
    "chunk-2FGTZB4B.js",
    "chunk-VOOZUXUF.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/admin/dashboard/admin-dashboard-page.ts": [
    "chunk-JL4RTU2J.js"
  ],
  "src/app/admin/products/admin-products-page.ts": [
    "chunk-XXNS6PGH.js",
    "chunk-WOPAPDZY.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js"
  ],
  "src/app/admin/products/admin-product-form-page.ts": [
    "chunk-LNXUTGU5.js",
    "chunk-WOPAPDZY.js"
  ],
  "src/app/admin/products/admin-products.routes.ts": [
    "chunk-NLQD7IKB.js"
  ],
  "src/app/admin/categories/admin-categories-page.ts": [
    "chunk-7QZZFEEJ.js"
  ],
  "src/app/admin/categories/admin-category-form-page.ts": [
    "chunk-CGQJVP2U.js"
  ],
  "src/app/admin/categories/admin-categories.routes.ts": [
    "chunk-HJWWHDNC.js"
  ],
  "src/app/public/tracking/tracking-page.ts": [
    "chunk-EPZC3EYF.js",
    "chunk-BYXBJQAS.js",
    "chunk-Y4XUJW5R.js"
  ],
  "src/app/public/privacy/privacy.component.ts": [
    "chunk-N6XIZE4Z.js"
  ],
  "src/app/public/terms/terms.component.ts": [
    "chunk-V4CRIFIS.js"
  ],
  "src/app/public/blog/blog.component.ts": [
    "chunk-EWSIZFTG.js",
    "chunk-LODWTL4C.js"
  ],
  "src/app/public/sitemap/sitemap.component.ts": [
    "chunk-6TNGPROE.js"
  ],
  "src/app/public/fixtecnicos/fixtecnicos.component.ts": [
    "chunk-CZBVQBLR.js",
    "chunk-LODWTL4C.js"
  ],
  "src/app/public/recursos/recursos.component.ts": [
    "chunk-3J62LWMO.js"
  ],
  "src/app/public/public.routes.ts": [
    "chunk-ZHVQAC4R.js",
    "chunk-VOOZUXUF.js",
    "chunk-RDFP3WJA.js",
    "chunk-2ELDMZW6.js",
    "chunk-PRQL4UDU.js"
  ],
  "src/app/public/nosotros/nosotros.ts": [
    "chunk-CTEZIJYU.js",
    "chunk-I7HI3DV5.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/contacto/contacto.ts": [
    "chunk-WWBTMQYY.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/servicios/servicios.ts": [
    "chunk-JKV65RZ2.js",
    "chunk-CGSMRQ3D.js",
    "chunk-RDFP3WJA.js",
    "chunk-TQNQ43CE.js"
  ],
  "src/app/public/servicios/pages/detail/service-detail.component.ts": [
    "chunk-MJOR34AS.js",
    "chunk-CGSMRQ3D.js"
  ],
  "src/app/public/cursos/cursos.ts": [
    "chunk-EIK4SUGH.js",
    "chunk-MKNNU3GC.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-GU7PLYZF.js",
    "chunk-3INXY5XS.js",
    "chunk-H5V5RJSQ.js",
    "chunk-JPSDBRD2.js",
    "chunk-PRQL4UDU.js"
  ],
  "src/app/public/cursos/course-detail/course-detail.component.ts": [
    "chunk-Y7HC6IVN.js",
    "chunk-MKNNU3GC.js",
    "chunk-73O2YB7T.js"
  ],
  "src/app/public/checkout/checkout-page.ts": [
    "chunk-4C6C7LNS.js",
    "chunk-47B4IAFB.js",
    "chunk-2ELDMZW6.js",
    "chunk-JPSDBRD2.js",
    "chunk-PRQL4UDU.js"
  ],
  "src/app/public/posts/post-page.ts": [
    "chunk-IJIAREYV.js",
    "chunk-LODWTL4C.js",
    "chunk-J6FX76BR.js",
    "chunk-2ELDMZW6.js"
  ],
  "src/app/public/products/pages/details/products-details-page.ts": [
    "chunk-G5V6QHS7.js",
    "chunk-URRL2FHW.js",
    "chunk-73O2YB7T.js",
    "chunk-TQNQ43CE.js",
    "chunk-GU7PLYZF.js",
    "chunk-H5V5RJSQ.js",
    "chunk-JPSDBRD2.js",
    "chunk-PRQL4UDU.js"
  ],
  "src/app/public/products/pages/featured/products-featured-page.ts": [
    "chunk-T4LSTWEE.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-3INXY5XS.js",
    "chunk-H5V5RJSQ.js",
    "chunk-JPSDBRD2.js",
    "chunk-PRQL4UDU.js"
  ],
  "src/app/public/products/products.routes.ts": [
    "chunk-K6LUKNYY.js"
  ],
  "src/app/public/auth/login/login.component.ts": [
    "chunk-E2VAS66J.js"
  ],
  "src/app/public/auth/register/register.component.ts": [
    "chunk-PK7SKHEJ.js"
  ],
  "src/app/public/profile/profile.component.ts": [
    "chunk-RKGDJLBW.js"
  ],
  "src/app/public/gsm/gsm.routes.ts": [
    "chunk-INN6DO67.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/portfolio/portfolio.ts": [
    "chunk-UAEMW3XP.js",
    "chunk-I7HI3DV5.js",
    "chunk-RDFP3WJA.js"
  ],
  "src/app/public/landing/celular/celular-landing.component.ts": [
    "chunk-BI46F34I.js",
    "chunk-J6FX76BR.js",
    "chunk-2ELDMZW6.js",
    "chunk-URRL2FHW.js"
  ],
  "src/app/public/categories/pages/home/public-categories-home-page.ts": [
    "chunk-N2EH5H6W.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-GU7PLYZF.js"
  ],
  "src/app/public/categories/categories.routes.ts": [
    "chunk-BGPQYNSY.js"
  ],
  "src/app/public/products/pages/all/products-all-page.ts": [
    "chunk-3Z5OFKXV.js",
    "chunk-URRL2FHW.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-3INXY5XS.js",
    "chunk-H5V5RJSQ.js",
    "chunk-JPSDBRD2.js",
    "chunk-PRQL4UDU.js"
  ],
  "src/app/public/products/pages/index/products-index-page.ts": [
    "chunk-7Y23L3HI.js",
    "chunk-GU7PLYZF.js",
    "chunk-3INXY5XS.js",
    "chunk-H5V5RJSQ.js",
    "chunk-JPSDBRD2.js",
    "chunk-PRQL4UDU.js"
  ],
  "src/app/public/repuestos/repuestos.ts": [
    "chunk-2GMSRJNJ.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-GU7PLYZF.js",
    "chunk-3INXY5XS.js",
    "chunk-H5V5RJSQ.js",
    "chunk-JPSDBRD2.js",
    "chunk-PRQL4UDU.js"
  ],
  "src/app/public/products/pages/by-category/products-by-category-page.ts": [
    "chunk-3I3FJFBI.js",
    "chunk-URRL2FHW.js",
    "chunk-73O2YB7T.js",
    "chunk-FM4TEIY7.js",
    "chunk-A7HSRCHR.js",
    "chunk-TQNQ43CE.js",
    "chunk-GU7PLYZF.js",
    "chunk-3INXY5XS.js",
    "chunk-H5V5RJSQ.js",
    "chunk-JPSDBRD2.js",
    "chunk-PRQL4UDU.js"
  ]
},
  assets: {
    'index.csr.html': {size: 38479, hash: 'a3153e9d21c1ac9712d25a68d2db1438c0adb9b31090d1d6aae73552640db279', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 16387, hash: 'dc46ebad5671bab3aea4b55e0769bd59351684fb5541019bf2d72f7f96e366a1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-2UUSZTYU.css': {size: 425887, hash: 'APWqGbZGJ7c', text: () => import('./assets-chunks/styles-2UUSZTYU_css.mjs').then(m => m.default)}
  },
};
