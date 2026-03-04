
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
    "chunk-JGIGH6F7.js",
    "chunk-Z7TFGVVR.js",
    "chunk-FK6H3RFT.js",
    "chunk-FFJADOOJ.js",
    "chunk-BYXBJQAS.js",
    "chunk-GJZCDN4Z.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/repairs/admin-repairs.routes.ts": [
    "chunk-O2LSQUF6.js"
  ],
  "src/app/admin/messages/admin-messages-page.ts": [
    "chunk-LPENDBTZ.js"
  ],
  "src/app/admin/messages/admin-messages.routes.ts": [
    "chunk-O5XOUTWJ.js"
  ],
  "src/app/admin/posts/admin-posts-page.ts": [
    "chunk-NFCUIIMX.js",
    "chunk-OMSJGRCM.js"
  ],
  "src/app/admin/posts/admin-post-form-page.ts": [
    "chunk-BJ7PT7I5.js",
    "chunk-OMSJGRCM.js"
  ],
  "src/app/admin/posts/admin-posts.routes.ts": [
    "chunk-HJTQODSW.js"
  ],
  "src/app/admin/admin.routes.ts": [
    "chunk-KHP6VQQI.js"
  ],
  "src/app/admin/orders/admin-orders.routes.ts": [
    "chunk-ONI3EZC7.js"
  ],
  "src/app/admin/services/admin-services-page.ts": [
    "chunk-XEVMOGYX.js",
    "chunk-M2KW7HXL.js"
  ],
  "src/app/admin/services/admin-service-form-page.ts": [
    "chunk-7FKS5MPF.js",
    "chunk-M2KW7HXL.js"
  ],
  "src/app/admin/services/admin-services.routes.ts": [
    "chunk-CFWMHHQ5.js"
  ],
  "src/app/admin/repairs/admin-repairs-page.ts": [
    "chunk-KTJ3377T.js",
    "chunk-Z7TFGVVR.js",
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
    "chunk-AESEFVEJ.js"
  ],
  "src/app/admin/users/admin-users-page.ts": [
    "chunk-CDUTIQW3.js"
  ],
  "src/app/admin/users/admin-users.routes.ts": [
    "chunk-4JDADQLZ.js"
  ],
  "src/app/admin/courses/admin-courses-page.ts": [
    "chunk-IBVEQKGK.js",
    "chunk-OPARA6AW.js"
  ],
  "src/app/admin/courses/admin-course-form-page.ts": [
    "chunk-MD5A54VO.js",
    "chunk-OPARA6AW.js"
  ],
  "src/app/admin/courses/admin-courses.routes.ts": [
    "chunk-LEK4WTDS.js"
  ],
  "src/app/admin/orders/admin-orders-page.ts": [
    "chunk-FVUAKS43.js",
    "chunk-DXIN7MBS.js",
    "chunk-5PGEAUNS.js"
  ],
  "src/app/admin/orders/admin-order-form-page.ts": [
    "chunk-ZXVS5ZGX.js",
    "chunk-DXIN7MBS.js"
  ],
  "src/app/admin/sales/admin-sales-page.ts": [
    "chunk-N2TM3ADL.js",
    "chunk-DXIN7MBS.js",
    "chunk-5PGEAUNS.js"
  ],
  "src/app/admin/sales/admin-invoices-page.ts": [
    "chunk-HVAKJSWB.js"
  ],
  "src/app/admin/sales/admin-invoice-detail-page.ts": [
    "chunk-7W7NT6FT.js",
    "chunk-GJZCDN4Z.js"
  ],
  "src/app/admin/sales/admin-sales.routes.ts": [
    "chunk-YRNW6VS3.js"
  ],
  "src/app/admin/inventory/admin-inventory-page.ts": [
    "chunk-MLSQ2LTN.js",
    "chunk-FFJADOOJ.js",
    "chunk-5PGEAUNS.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/inventory/admin-inventory.routes.ts": [
    "chunk-WYFDCX4Z.js"
  ],
  "src/app/admin/purchases/admin-purchases-page.ts": [
    "chunk-ENNJHC6G.js"
  ],
  "src/app/admin/purchases/admin-purchase-form-page.ts": [
    "chunk-VKGCLG7Y.js"
  ],
  "src/app/admin/suppliers/admin-suppliers-page.ts": [
    "chunk-AFITY3RK.js",
    "chunk-SKRT3TDB.js"
  ],
  "src/app/admin/suppliers/admin-supplier-form-page.ts": [
    "chunk-NKEBQS3O.js",
    "chunk-SKRT3TDB.js"
  ],
  "src/app/admin/suppliers/admin-suppliers.routes.ts": [
    "chunk-H5BYA7O4.js"
  ],
  "src/app/admin/company/admin-company-settings-page.ts": [
    "chunk-I4TKZDE4.js"
  ],
  "src/app/admin/company/admin-company.routes.ts": [
    "chunk-S4GFLQS4.js"
  ],
  "src/app/admin/employees/admin-employees-page.ts": [
    "chunk-YEQVUARD.js",
    "chunk-SUCHWEDN.js"
  ],
  "src/app/admin/employees/admin-employee-form-page.ts": [
    "chunk-HI36MV7N.js",
    "chunk-SUCHWEDN.js"
  ],
  "src/app/admin/employees/admin-employees.routes.ts": [
    "chunk-WC2GEAC3.js"
  ],
  "src/app/admin/categories/admin-category-form-page.ts": [
    "chunk-VS6E5IW7.js",
    "chunk-RNOQAGUH.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/categories/admin-categories.routes.ts": [
    "chunk-RAEHJOWD.js"
  ],
  "src/app/admin/brands/admin-brands-page.ts": [
    "chunk-XEE3OJJW.js"
  ],
  "src/app/admin/brands/admin-brand-form-page.ts": [
    "chunk-6VV5QQH5.js"
  ],
  "src/app/admin/brands/admin-brands.routes.ts": [
    "chunk-SD4V3TWD.js"
  ],
  "src/app/admin/clients/admin-clients-page.ts": [
    "chunk-JDVP3EK6.js",
    "chunk-YGBYQCDS.js"
  ],
  "src/app/admin/clients/admin-client-form-page.ts": [
    "chunk-QIQ5I3SH.js",
    "chunk-YGBYQCDS.js"
  ],
  "src/app/admin/clients/admin-clients.routes.ts": [
    "chunk-X5STBP5X.js"
  ],
  "src/app/public/recursos/recursos.component.ts": [
    "chunk-UDVHCF4X.js"
  ],
  "src/app/public/public.routes.ts": [
    "chunk-EWPGK3CU.js",
    "chunk-VR6YF7BF.js",
    "chunk-7GHTXQFS.js",
    "chunk-3VQYCOOY.js",
    "chunk-WHP27RC7.js"
  ],
  "src/app/admin/layout/admin-layout.ts": [
    "chunk-X4HQ4NVQ.js",
    "chunk-VR6YF7BF.js",
    "chunk-7GHTXQFS.js"
  ],
  "src/app/admin/dashboard/admin-dashboard-page.ts": [
    "chunk-BUSHMQQS.js"
  ],
  "src/app/admin/products/admin-products-page.ts": [
    "chunk-N2767KY2.js",
    "chunk-FFJADOOJ.js",
    "chunk-5PGEAUNS.js",
    "chunk-Z65OLUMD.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/products/admin-product-form-page.ts": [
    "chunk-RXEBGWN6.js",
    "chunk-FFJADOOJ.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/admin/products/admin-products.routes.ts": [
    "chunk-AKA46OEE.js"
  ],
  "src/app/admin/categories/admin-categories-page.ts": [
    "chunk-XTUJFABB.js"
  ],
  "src/app/public/checkout/checkout-page.ts": [
    "chunk-PQ6IQP3L.js",
    "chunk-DXIN7MBS.js",
    "chunk-3VQYCOOY.js",
    "chunk-NYRUIA2D.js",
    "chunk-WHP27RC7.js"
  ],
  "src/app/public/posts/post-page.ts": [
    "chunk-3RBHFQJL.js",
    "chunk-UNA36PJE.js",
    "chunk-JT46EKHM.js",
    "chunk-3VQYCOOY.js"
  ],
  "src/app/public/tracking/tracking-page.ts": [
    "chunk-3CBSHG6B.js",
    "chunk-BYXBJQAS.js",
    "chunk-GJZCDN4Z.js"
  ],
  "src/app/public/privacy/privacy.component.ts": [
    "chunk-ZM5ZVIUS.js"
  ],
  "src/app/public/terms/terms.component.ts": [
    "chunk-K3A2NRFU.js"
  ],
  "src/app/public/blog/blog.component.ts": [
    "chunk-VXI75STM.js",
    "chunk-UNA36PJE.js"
  ],
  "src/app/public/sitemap/sitemap.component.ts": [
    "chunk-ULKACGME.js"
  ],
  "src/app/public/fixtecnicos/fixtecnicos.component.ts": [
    "chunk-6BB46CJS.js",
    "chunk-UNA36PJE.js"
  ],
  "src/app/public/gsm/gsm.routes.ts": [
    "chunk-6EXFXNTL.js",
    "chunk-7GHTXQFS.js"
  ],
  "src/app/public/portfolio/portfolio.ts": [
    "chunk-2SDREWHD.js",
    "chunk-LDYPYJV2.js",
    "chunk-7GHTXQFS.js"
  ],
  "src/app/public/nosotros/nosotros.ts": [
    "chunk-XQYDSLUP.js",
    "chunk-LDYPYJV2.js",
    "chunk-7GHTXQFS.js"
  ],
  "src/app/public/contacto/contacto.ts": [
    "chunk-HHDDDWJG.js",
    "chunk-7GHTXQFS.js"
  ],
  "src/app/public/servicios/servicios.ts": [
    "chunk-7N56BY5D.js",
    "chunk-7GHTXQFS.js",
    "chunk-CGSMRQ3D.js",
    "chunk-Z65OLUMD.js"
  ],
  "src/app/public/servicios/pages/detail/service-detail.component.ts": [
    "chunk-AFHFZQJL.js",
    "chunk-CGSMRQ3D.js"
  ],
  "src/app/public/cursos/cursos.ts": [
    "chunk-ZB6OSKXE.js",
    "chunk-OPARA6AW.js",
    "chunk-H4ZXTOJ3.js",
    "chunk-5PGEAUNS.js",
    "chunk-7LJP2IXN.js",
    "chunk-Z65OLUMD.js",
    "chunk-FNOMVEKC.js",
    "chunk-RNOQAGUH.js",
    "chunk-UO5M3KBC.js",
    "chunk-L54EPJR7.js",
    "chunk-U6MVJU4R.js",
    "chunk-NYRUIA2D.js",
    "chunk-WHP27RC7.js"
  ],
  "src/app/public/cursos/course-detail/course-detail.component.ts": [
    "chunk-Z2K2OGHF.js",
    "chunk-OPARA6AW.js",
    "chunk-7LJP2IXN.js"
  ],
  "src/app/public/repuestos/repuestos.ts": [
    "chunk-H7F4YMDV.js",
    "chunk-H4ZXTOJ3.js",
    "chunk-5PGEAUNS.js",
    "chunk-Z65OLUMD.js",
    "chunk-FNOMVEKC.js",
    "chunk-RNOQAGUH.js",
    "chunk-UO5M3KBC.js",
    "chunk-L54EPJR7.js",
    "chunk-U6MVJU4R.js",
    "chunk-NYRUIA2D.js",
    "chunk-WHP27RC7.js"
  ],
  "src/app/public/products/pages/by-category/products-by-category-page.ts": [
    "chunk-QPGRFUED.js",
    "chunk-O6Y3CK3A.js",
    "chunk-H4ZXTOJ3.js",
    "chunk-5PGEAUNS.js",
    "chunk-7LJP2IXN.js",
    "chunk-Z65OLUMD.js",
    "chunk-FNOMVEKC.js",
    "chunk-RNOQAGUH.js",
    "chunk-UO5M3KBC.js",
    "chunk-L54EPJR7.js",
    "chunk-U6MVJU4R.js",
    "chunk-NYRUIA2D.js",
    "chunk-WHP27RC7.js"
  ],
  "src/app/public/products/pages/details/products-details-page.ts": [
    "chunk-KYFKRGAI.js",
    "chunk-O6Y3CK3A.js",
    "chunk-7LJP2IXN.js",
    "chunk-Z65OLUMD.js",
    "chunk-FNOMVEKC.js",
    "chunk-RNOQAGUH.js",
    "chunk-UO5M3KBC.js",
    "chunk-U6MVJU4R.js",
    "chunk-NYRUIA2D.js",
    "chunk-WHP27RC7.js"
  ],
  "src/app/public/products/pages/featured/products-featured-page.ts": [
    "chunk-XTUMHD2Q.js",
    "chunk-H4ZXTOJ3.js",
    "chunk-5PGEAUNS.js",
    "chunk-7LJP2IXN.js",
    "chunk-Z65OLUMD.js",
    "chunk-L54EPJR7.js",
    "chunk-U6MVJU4R.js",
    "chunk-NYRUIA2D.js",
    "chunk-WHP27RC7.js"
  ],
  "src/app/public/products/products.routes.ts": [
    "chunk-66GPUAQE.js"
  ],
  "src/app/public/auth/login/login.component.ts": [
    "chunk-WC3YOZIQ.js"
  ],
  "src/app/public/auth/register/register.component.ts": [
    "chunk-V4Q4YVWX.js"
  ],
  "src/app/public/profile/profile.component.ts": [
    "chunk-5PRX4RKC.js"
  ],
  "node_modules/@capacitor/app/dist/esm/web.js": [
    "chunk-MRPGOKYE.js"
  ],
  "node_modules/@capacitor/browser/dist/esm/web.js": [
    "chunk-UR6Z7I77.js"
  ],
  "src/app/public/landing/celular/celular-landing.component.ts": [
    "chunk-OVLNX7NC.js",
    "chunk-JT46EKHM.js",
    "chunk-3VQYCOOY.js",
    "chunk-O6Y3CK3A.js"
  ],
  "src/app/public/categories/pages/home/public-categories-home-page.ts": [
    "chunk-VC23AUKA.js",
    "chunk-H4ZXTOJ3.js",
    "chunk-5PGEAUNS.js",
    "chunk-7LJP2IXN.js",
    "chunk-Z65OLUMD.js",
    "chunk-FNOMVEKC.js",
    "chunk-RNOQAGUH.js",
    "chunk-UO5M3KBC.js"
  ],
  "src/app/public/categories/categories.routes.ts": [
    "chunk-W6ODLJLC.js"
  ],
  "src/app/public/products/pages/all/products-all-page.ts": [
    "chunk-3ETHJX2W.js",
    "chunk-O6Y3CK3A.js",
    "chunk-H4ZXTOJ3.js",
    "chunk-5PGEAUNS.js",
    "chunk-7LJP2IXN.js",
    "chunk-Z65OLUMD.js",
    "chunk-L54EPJR7.js",
    "chunk-U6MVJU4R.js",
    "chunk-NYRUIA2D.js",
    "chunk-WHP27RC7.js"
  ],
  "src/app/public/products/pages/index/products-index-page.ts": [
    "chunk-PU67T3KK.js",
    "chunk-FNOMVEKC.js",
    "chunk-RNOQAGUH.js",
    "chunk-UO5M3KBC.js",
    "chunk-L54EPJR7.js",
    "chunk-U6MVJU4R.js",
    "chunk-NYRUIA2D.js",
    "chunk-WHP27RC7.js"
  ]
},
  assets: {
    'index.csr.html': {size: 15847, hash: '0356937cc1a1ce18a7634217e3027f1c0fef18fec32989fa07d9f4001e77b53d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 16387, hash: '77bd3bd8e9297cf77e9fd05d437a4c90e526cce8eb4771d93759260671704e56', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
