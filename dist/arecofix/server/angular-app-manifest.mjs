
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/admin/posts/admin-posts-page.ts": [
    "chunk-VY47PL5P.js",
    "chunk-57NM5YMO.js"
  ],
  "src/app/admin/posts/admin-post-form-page.ts": [
    "chunk-SSMM4H7C.js",
    "chunk-57NM5YMO.js"
  ],
  "src/app/admin/posts/admin-posts.routes.ts": [
    "chunk-RVHO577Z.js"
  ],
  "src/app/admin/admin.routes.ts": [
    "chunk-LE5SIIWS.js"
  ],
  "node_modules/@mlc-ai/web-llm/lib/index.js": [
    "chunk-FPVF356G.js"
  ],
  "src/app/admin/services/admin-services-page.ts": [
    "chunk-77YTB725.js"
  ],
  "src/app/admin/services/admin-service-form-page.ts": [
    "chunk-VMAUS37J.js"
  ],
  "src/app/admin/services/admin-services.routes.ts": [
    "chunk-D6KKK5ON.js"
  ],
  "src/app/admin/repairs/admin-repairs-page.ts": [
    "chunk-6EOBWX4T.js"
  ],
  "src/app/admin/repairs/admin-repair-form-page.ts": [
    "chunk-RIKR7D7A.js"
  ],
  "src/app/admin/repairs/admin-repairs.routes.ts": [
    "chunk-LCLEXD3N.js"
  ],
  "src/app/admin/messages/admin-messages-page.ts": [
    "chunk-PYRV456X.js"
  ],
  "src/app/admin/messages/admin-messages.routes.ts": [
    "chunk-SGED2HAM.js"
  ],
  "src/app/admin/users/admin-users-page.ts": [
    "chunk-Y7MKXRHB.js"
  ],
  "src/app/admin/users/admin-users.routes.ts": [
    "chunk-BLDDTLMI.js"
  ],
  "src/app/admin/courses/admin-courses-page.ts": [
    "chunk-JJDBS7ZJ.js",
    "chunk-5VFUHKWL.js"
  ],
  "src/app/admin/courses/admin-course-form-page.ts": [
    "chunk-D75YUV37.js",
    "chunk-5VFUHKWL.js"
  ],
  "src/app/admin/courses/admin-courses.routes.ts": [
    "chunk-5SIYZAQS.js"
  ],
  "src/app/admin/orders/admin-orders-page.ts": [
    "chunk-2PTATEFN.js",
    "chunk-SRX3Z2MI.js",
    "chunk-GYOQXUPI.js"
  ],
  "src/app/admin/orders/admin-order-form-page.ts": [
    "chunk-RPFNHSUO.js",
    "chunk-SRX3Z2MI.js"
  ],
  "src/app/admin/orders/admin-orders.routes.ts": [
    "chunk-CCA7IMON.js"
  ],
  "src/app/admin/sales/admin-invoices-page.ts": [
    "chunk-VW5POM5W.js"
  ],
  "src/app/admin/sales/admin-invoice-detail-page.ts": [
    "chunk-NXQU4IZ2.js"
  ],
  "src/app/admin/sales/admin-sales.routes.ts": [
    "chunk-CMYTOPO4.js"
  ],
  "src/app/admin/inventory/admin-inventory-page.ts": [
    "chunk-YCTSXQZG.js",
    "chunk-QSJYFSE3.js",
    "chunk-GYOQXUPI.js"
  ],
  "src/app/admin/inventory/admin-inventory.routes.ts": [
    "chunk-PMMB6I6Z.js"
  ],
  "src/app/admin/purchases/admin-purchases-page.ts": [
    "chunk-YIRM5TKF.js"
  ],
  "src/app/admin/purchases/admin-purchase-form-page.ts": [
    "chunk-SVE24CQO.js"
  ],
  "src/app/admin/purchases/admin-purchases.routes.ts": [
    "chunk-NYIWZ4BI.js"
  ],
  "src/app/admin/suppliers/admin-supplier-form-page.ts": [
    "chunk-5NI4STWO.js"
  ],
  "src/app/admin/suppliers/admin-suppliers.routes.ts": [
    "chunk-JMPVHWKS.js"
  ],
  "src/app/admin/company/admin-company-settings-page.ts": [
    "chunk-M6RVQ5ZG.js"
  ],
  "src/app/admin/company/admin-company.routes.ts": [
    "chunk-EZYTKPYC.js"
  ],
  "src/app/admin/employees/admin-employees-page.ts": [
    "chunk-AXLFLSI4.js"
  ],
  "src/app/admin/employees/admin-employee-form-page.ts": [
    "chunk-GDN5ULPD.js"
  ],
  "src/app/admin/employees/admin-employees.routes.ts": [
    "chunk-WK7LBYC6.js"
  ],
  "src/app/admin/sales/admin-sales-page.ts": [
    "chunk-DXQJPXD6.js",
    "chunk-GYOQXUPI.js"
  ],
  "src/app/admin/categories/admin-categories.routes.ts": [
    "chunk-GMKTNWMT.js"
  ],
  "src/app/admin/brands/admin-brands-page.ts": [
    "chunk-D5TWTAPI.js"
  ],
  "src/app/admin/brands/admin-brand-form-page.ts": [
    "chunk-VBS75JY2.js"
  ],
  "src/app/admin/brands/admin-brands.routes.ts": [
    "chunk-UJBMKKDS.js"
  ],
  "src/app/admin/clients/admin-clients-page.ts": [
    "chunk-YAZD5JRA.js"
  ],
  "src/app/admin/clients/admin-client-form-page.ts": [
    "chunk-KPYOZQ6A.js"
  ],
  "src/app/admin/clients/admin-clients.routes.ts": [
    "chunk-ILFZN7YN.js"
  ],
  "src/app/admin/suppliers/admin-suppliers-page.ts": [
    "chunk-2RLKJNS4.js"
  ],
  "src/app/admin/layout/admin-layout.ts": [
    "chunk-O5L6HDS6.js",
    "chunk-2UKWOBXV.js",
    "chunk-LCIGUAWT.js"
  ],
  "node_modules/posthog-js/dist/module.js": [
    "chunk-FNJ6CKK6.js"
  ],
  "src/app/admin/dashboard/admin-dashboard-page.ts": [
    "chunk-5VJDMNOI.js"
  ],
  "src/app/admin/products/admin-products-page.ts": [
    "chunk-WKIX4P6S.js",
    "chunk-QSJYFSE3.js",
    "chunk-GYOQXUPI.js"
  ],
  "src/app/admin/products/admin-product-form-page.ts": [
    "chunk-S5NFTFKI.js",
    "chunk-QSJYFSE3.js"
  ],
  "src/app/admin/products/admin-products.routes.ts": [
    "chunk-NOPR2ATW.js"
  ],
  "src/app/admin/categories/admin-categories-page.ts": [
    "chunk-5Q3JFV6E.js"
  ],
  "src/app/admin/categories/admin-category-form-page.ts": [
    "chunk-ROFZWRAV.js"
  ],
  "src/app/public/tracking/tracking-page.ts": [
    "chunk-EATTQSPI.js"
  ],
  "src/app/public/privacy/privacy.component.ts": [
    "chunk-WIQMIXGU.js"
  ],
  "src/app/public/terms/terms.component.ts": [
    "chunk-QJUWMX4G.js"
  ],
  "src/app/public/blog/blog.component.ts": [
    "chunk-IXEAT6FD.js",
    "chunk-5NGPAG4N.js"
  ],
  "src/app/public/sitemap/sitemap.component.ts": [
    "chunk-7OOTYZYS.js"
  ],
  "src/app/public/fixtecnicos/fixtecnicos.component.ts": [
    "chunk-JIIKFXZU.js",
    "chunk-5NGPAG4N.js"
  ],
  "src/app/public/recursos/recursos.component.ts": [
    "chunk-WMTZNGXQ.js"
  ],
  "src/app/public/public.routes.ts": [
    "chunk-A4DII3HW.js",
    "chunk-2UKWOBXV.js",
    "chunk-LCIGUAWT.js",
    "chunk-NRL5PHBS.js"
  ],
  "src/app/public/nosotros/nosotros.ts": [
    "chunk-FRGWHSK6.js",
    "chunk-IYGS2QNE.js",
    "chunk-LCIGUAWT.js"
  ],
  "src/app/public/contacto/contacto.ts": [
    "chunk-IUZV5UNH.js",
    "chunk-LCIGUAWT.js"
  ],
  "src/app/public/servicios/servicios.ts": [
    "chunk-TWYFK4AS.js",
    "chunk-CGSMRQ3D.js",
    "chunk-LCIGUAWT.js",
    "chunk-AZCK5UGA.js"
  ],
  "src/app/public/servicios/pages/detail/service-detail.component.ts": [
    "chunk-QR2XCXFP.js",
    "chunk-CGSMRQ3D.js"
  ],
  "src/app/public/cursos/cursos.ts": [
    "chunk-IH24GDYZ.js",
    "chunk-5VFUHKWL.js",
    "chunk-Z6RW46OR.js",
    "chunk-WSUS7GCB.js",
    "chunk-GYOQXUPI.js",
    "chunk-AZCK5UGA.js",
    "chunk-LJL7ANOU.js",
    "chunk-TW7KWWYV.js",
    "chunk-DRKJXLYO.js",
    "chunk-W6OHXZLO.js",
    "chunk-NRL5PHBS.js"
  ],
  "src/app/public/cursos/course-detail/course-detail.component.ts": [
    "chunk-QOQGHQPB.js",
    "chunk-5VFUHKWL.js",
    "chunk-Z6RW46OR.js"
  ],
  "src/app/public/checkout/checkout-page.ts": [
    "chunk-E42DFTC2.js",
    "chunk-SRX3Z2MI.js",
    "chunk-ZND23DV6.js",
    "chunk-W6OHXZLO.js",
    "chunk-NRL5PHBS.js"
  ],
  "src/app/public/posts/post-page.ts": [
    "chunk-D4PEI3WZ.js",
    "chunk-5NGPAG4N.js",
    "chunk-5CHL6OE7.js"
  ],
  "src/app/public/products/pages/details/products-details-page.ts": [
    "chunk-5AGE7WJS.js",
    "chunk-PUX2C3NO.js",
    "chunk-Z6RW46OR.js",
    "chunk-AZCK5UGA.js",
    "chunk-LJL7ANOU.js",
    "chunk-DRKJXLYO.js",
    "chunk-W6OHXZLO.js",
    "chunk-NRL5PHBS.js"
  ],
  "src/app/public/products/pages/featured/products-featured-page.ts": [
    "chunk-5PAR5HCT.js",
    "chunk-Z6RW46OR.js",
    "chunk-WSUS7GCB.js",
    "chunk-GYOQXUPI.js",
    "chunk-AZCK5UGA.js",
    "chunk-TW7KWWYV.js",
    "chunk-DRKJXLYO.js",
    "chunk-W6OHXZLO.js",
    "chunk-NRL5PHBS.js"
  ],
  "src/app/public/products/products.routes.ts": [
    "chunk-2T4QRJJD.js"
  ],
  "src/app/public/auth/login/login.component.ts": [
    "chunk-77NNMSMX.js"
  ],
  "src/app/public/auth/register/register.component.ts": [
    "chunk-QLMLTGIU.js"
  ],
  "src/app/public/profile/profile.component.ts": [
    "chunk-IMCHNZPG.js"
  ],
  "src/app/public/gsm/gsm.routes.ts": [
    "chunk-3ULMLGIB.js",
    "chunk-LCIGUAWT.js"
  ],
  "src/app/public/portfolio/portfolio.ts": [
    "chunk-3FJ4V3U2.js",
    "chunk-IYGS2QNE.js",
    "chunk-LCIGUAWT.js"
  ],
  "src/app/public/landing/celular/celular-landing.component.ts": [
    "chunk-GCJN5LGR.js",
    "chunk-ZND23DV6.js",
    "chunk-5CHL6OE7.js",
    "chunk-PUX2C3NO.js"
  ],
  "src/app/public/categories/pages/home/public-categories-home-page.ts": [
    "chunk-ZXB2W2FS.js",
    "chunk-Z6RW46OR.js",
    "chunk-WSUS7GCB.js",
    "chunk-GYOQXUPI.js",
    "chunk-AZCK5UGA.js",
    "chunk-LJL7ANOU.js"
  ],
  "src/app/public/categories/categories.routes.ts": [
    "chunk-LM3GB2I4.js"
  ],
  "src/app/public/products/pages/all/products-all-page.ts": [
    "chunk-GWNSEXVM.js",
    "chunk-PUX2C3NO.js",
    "chunk-Z6RW46OR.js",
    "chunk-WSUS7GCB.js",
    "chunk-GYOQXUPI.js",
    "chunk-AZCK5UGA.js",
    "chunk-TW7KWWYV.js",
    "chunk-DRKJXLYO.js",
    "chunk-W6OHXZLO.js",
    "chunk-NRL5PHBS.js"
  ],
  "src/app/public/products/pages/index/products-index-page.ts": [
    "chunk-FKFY5WAJ.js",
    "chunk-LJL7ANOU.js",
    "chunk-TW7KWWYV.js",
    "chunk-DRKJXLYO.js",
    "chunk-W6OHXZLO.js",
    "chunk-NRL5PHBS.js"
  ],
  "src/app/public/repuestos/repuestos.ts": [
    "chunk-NS5EDIVC.js",
    "chunk-WSUS7GCB.js",
    "chunk-GYOQXUPI.js",
    "chunk-AZCK5UGA.js",
    "chunk-LJL7ANOU.js",
    "chunk-TW7KWWYV.js",
    "chunk-DRKJXLYO.js",
    "chunk-W6OHXZLO.js",
    "chunk-NRL5PHBS.js"
  ],
  "src/app/public/products/pages/by-category/products-by-category-page.ts": [
    "chunk-6R6FS5TH.js",
    "chunk-PUX2C3NO.js",
    "chunk-Z6RW46OR.js",
    "chunk-WSUS7GCB.js",
    "chunk-GYOQXUPI.js",
    "chunk-AZCK5UGA.js",
    "chunk-LJL7ANOU.js",
    "chunk-TW7KWWYV.js",
    "chunk-DRKJXLYO.js",
    "chunk-W6OHXZLO.js",
    "chunk-NRL5PHBS.js"
  ]
},
  assets: {
    'index.csr.html': {size: 38654, hash: '0c0122ea3fbbb75171fdf67d984e221fc6e81fc9852360ce87b59a6b73d2e540', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 10381, hash: 'b37372f780a7915a1325fb411381bc7c615f6f1293677ca3c56d662c18296918', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ZUDUQ4C7.css': {size: 408852, hash: 'm5ru9AIj77w', text: () => import('./assets-chunks/styles-ZUDUQ4C7_css.mjs').then(m => m.default)}
  },
};
