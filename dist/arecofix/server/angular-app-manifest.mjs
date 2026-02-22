
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/admin/posts/admin-post-form-page.ts": [
    "chunk-J54U5LXL.js",
    "chunk-SLBUHKP7.js"
  ],
  "src/app/admin/posts/admin-posts.routes.ts": [
    "chunk-HBBYVTZY.js"
  ],
  "src/app/admin/admin.routes.ts": [
    "chunk-G5XW2UGG.js"
  ],
  "node_modules/@mlc-ai/web-llm/lib/index.js": [
    "chunk-EZP7SFDH.js"
  ],
  "src/app/admin/services/admin-service-form-page.ts": [
    "chunk-INMDQWMO.js"
  ],
  "src/app/admin/services/admin-services.routes.ts": [
    "chunk-IXARLACF.js"
  ],
  "src/app/admin/repairs/admin-repairs-page.ts": [
    "chunk-ZK6OE5IM.js"
  ],
  "src/app/admin/repairs/admin-repair-form-page.ts": [
    "chunk-624YZTZZ.js"
  ],
  "src/app/admin/repairs/admin-repairs.routes.ts": [
    "chunk-73OXLY6J.js"
  ],
  "src/app/admin/messages/admin-messages-page.ts": [
    "chunk-A2YOTSOQ.js"
  ],
  "src/app/admin/messages/admin-messages.routes.ts": [
    "chunk-35CW6PWX.js"
  ],
  "src/app/admin/posts/admin-posts-page.ts": [
    "chunk-TPP6NATR.js",
    "chunk-SLBUHKP7.js"
  ],
  "src/app/admin/users/admin-users.routes.ts": [
    "chunk-B7MQFXFG.js"
  ],
  "src/app/admin/courses/admin-courses-page.ts": [
    "chunk-HG5F557G.js",
    "chunk-IM5JBWIC.js"
  ],
  "src/app/admin/courses/admin-course-form-page.ts": [
    "chunk-RIW5QKMM.js",
    "chunk-IM5JBWIC.js"
  ],
  "src/app/admin/courses/admin-courses.routes.ts": [
    "chunk-2IUEKYYW.js"
  ],
  "src/app/admin/orders/admin-orders-page.ts": [
    "chunk-3SVRYUT7.js",
    "chunk-ADXXCNGC.js",
    "chunk-XC4YBHWE.js"
  ],
  "src/app/admin/orders/admin-order-form-page.ts": [
    "chunk-ZEH4GTEQ.js",
    "chunk-ADXXCNGC.js"
  ],
  "src/app/admin/orders/admin-orders.routes.ts": [
    "chunk-CAH75XJF.js"
  ],
  "src/app/admin/services/admin-services-page.ts": [
    "chunk-7RT4WD5O.js"
  ],
  "src/app/admin/sales/admin-invoice-detail-page.ts": [
    "chunk-WF4A666W.js"
  ],
  "src/app/admin/sales/admin-sales.routes.ts": [
    "chunk-BS3BNJ7D.js"
  ],
  "src/app/admin/inventory/admin-inventory-page.ts": [
    "chunk-NVUP5RZ5.js",
    "chunk-EGTPF2PG.js",
    "chunk-XC4YBHWE.js"
  ],
  "src/app/admin/inventory/admin-inventory.routes.ts": [
    "chunk-2DRLBEWT.js"
  ],
  "src/app/admin/purchases/admin-purchases-page.ts": [
    "chunk-UM67IETU.js"
  ],
  "src/app/admin/purchases/admin-purchase-form-page.ts": [
    "chunk-HFVCRI4O.js"
  ],
  "src/app/admin/purchases/admin-purchases.routes.ts": [
    "chunk-KN2N7HQM.js"
  ],
  "src/app/admin/users/admin-users-page.ts": [
    "chunk-R7J2J6NS.js"
  ],
  "src/app/admin/suppliers/admin-suppliers.routes.ts": [
    "chunk-VUJ7C7OR.js"
  ],
  "src/app/admin/company/admin-company-settings-page.ts": [
    "chunk-3DJBRPOL.js"
  ],
  "src/app/admin/company/admin-company.routes.ts": [
    "chunk-33QYOQ2F.js"
  ],
  "src/app/admin/employees/admin-employees-page.ts": [
    "chunk-SXKGCMZT.js"
  ],
  "src/app/admin/employees/admin-employee-form-page.ts": [
    "chunk-F6TAT6CQ.js"
  ],
  "src/app/admin/employees/admin-employees.routes.ts": [
    "chunk-HQDEGFGF.js"
  ],
  "src/app/admin/sales/admin-sales-page.ts": [
    "chunk-TPFYDBP2.js",
    "chunk-XC4YBHWE.js"
  ],
  "src/app/admin/sales/admin-invoices-page.ts": [
    "chunk-3TAX7UAD.js"
  ],
  "src/app/admin/brands/admin-brands-page.ts": [
    "chunk-KOWTGZSG.js"
  ],
  "src/app/admin/brands/admin-brand-form-page.ts": [
    "chunk-MTYTQTWP.js"
  ],
  "src/app/admin/brands/admin-brands.routes.ts": [
    "chunk-NH7XINLX.js"
  ],
  "src/app/admin/clients/admin-clients-page.ts": [
    "chunk-IO3KOMUY.js"
  ],
  "src/app/admin/clients/admin-client-form-page.ts": [
    "chunk-PHAK67IV.js"
  ],
  "src/app/admin/clients/admin-clients.routes.ts": [
    "chunk-RSQSZQEY.js"
  ],
  "src/app/admin/suppliers/admin-suppliers-page.ts": [
    "chunk-QZXVZ76A.js"
  ],
  "src/app/admin/suppliers/admin-supplier-form-page.ts": [
    "chunk-BFKBVTQE.js"
  ],
  "src/app/admin/layout/admin-layout.ts": [
    "chunk-YXIKI4SV.js",
    "chunk-LWNU6K6I.js",
    "chunk-VZWXZZPO.js"
  ],
  "src/app/admin/dashboard/admin-dashboard-page.ts": [
    "chunk-LOXJXSV5.js"
  ],
  "src/app/admin/products/admin-products-page.ts": [
    "chunk-WQIZYPHV.js",
    "chunk-EGTPF2PG.js",
    "chunk-XC4YBHWE.js"
  ],
  "src/app/admin/products/admin-product-form-page.ts": [
    "chunk-PSFFA2YH.js",
    "chunk-EGTPF2PG.js"
  ],
  "src/app/admin/products/admin-products.routes.ts": [
    "chunk-IKENKG7Z.js"
  ],
  "src/app/admin/categories/admin-categories-page.ts": [
    "chunk-DPPOMBLY.js"
  ],
  "src/app/admin/categories/admin-category-form-page.ts": [
    "chunk-FFKBUIRY.js"
  ],
  "src/app/admin/categories/admin-categories.routes.ts": [
    "chunk-KP26X35O.js"
  ],
  "src/app/public/tracking/tracking-page.ts": [
    "chunk-VV3WURQY.js"
  ],
  "src/app/public/privacy/privacy.component.ts": [
    "chunk-ZBF23GC5.js"
  ],
  "src/app/public/terms/terms.component.ts": [
    "chunk-YRYEOYZU.js"
  ],
  "src/app/public/blog/blog.component.ts": [
    "chunk-EXSJH5VG.js",
    "chunk-72GWRHOW.js"
  ],
  "src/app/public/sitemap/sitemap.component.ts": [
    "chunk-BZCOUZJD.js"
  ],
  "src/app/public/fixtecnicos/fixtecnicos.component.ts": [
    "chunk-MZTAXKGV.js",
    "chunk-72GWRHOW.js"
  ],
  "src/app/public/recursos/recursos.component.ts": [
    "chunk-L7BHAFOI.js"
  ],
  "src/app/public/public.routes.ts": [
    "chunk-RFTZ2GJN.js",
    "chunk-LWNU6K6I.js",
    "chunk-VZWXZZPO.js",
    "chunk-DXW7TK6G.js"
  ],
  "src/app/public/nosotros/nosotros.ts": [
    "chunk-PTWVQ4SW.js",
    "chunk-3N33EHOS.js",
    "chunk-VZWXZZPO.js"
  ],
  "src/app/public/contacto/contacto.ts": [
    "chunk-63LTD5AC.js",
    "chunk-VZWXZZPO.js"
  ],
  "src/app/public/servicios/servicios.ts": [
    "chunk-TFTQPLZX.js",
    "chunk-CV6KBVFM.js",
    "chunk-VZWXZZPO.js",
    "chunk-JG6OOG6M.js"
  ],
  "src/app/public/servicios/pages/detail/service-detail.component.ts": [
    "chunk-AYZFIZRP.js",
    "chunk-CV6KBVFM.js"
  ],
  "src/app/public/cursos/cursos.ts": [
    "chunk-LYISS5DJ.js",
    "chunk-IM5JBWIC.js",
    "chunk-U724RIM4.js",
    "chunk-DX6QYMZL.js",
    "chunk-XC4YBHWE.js",
    "chunk-JG6OOG6M.js",
    "chunk-PUJEUZQG.js",
    "chunk-L2FF2B3K.js",
    "chunk-E5ZPMRHA.js",
    "chunk-BG33NLGT.js",
    "chunk-DXW7TK6G.js"
  ],
  "src/app/public/cursos/course-detail/course-detail.component.ts": [
    "chunk-USDQC6KG.js",
    "chunk-IM5JBWIC.js",
    "chunk-U724RIM4.js"
  ],
  "src/app/public/checkout/checkout-page.ts": [
    "chunk-BLNAGLSY.js",
    "chunk-ADXXCNGC.js",
    "chunk-P653H4KR.js",
    "chunk-BG33NLGT.js",
    "chunk-DXW7TK6G.js"
  ],
  "src/app/public/posts/post-page.ts": [
    "chunk-B2IUR6NM.js",
    "chunk-72GWRHOW.js",
    "chunk-HX3ACXD7.js"
  ],
  "src/app/public/products/pages/details/products-details-page.ts": [
    "chunk-TW5GBNRR.js",
    "chunk-TAB7UVPS.js",
    "chunk-U724RIM4.js",
    "chunk-JG6OOG6M.js",
    "chunk-PUJEUZQG.js",
    "chunk-E5ZPMRHA.js",
    "chunk-BG33NLGT.js",
    "chunk-DXW7TK6G.js"
  ],
  "src/app/public/products/pages/featured/products-featured-page.ts": [
    "chunk-V4B74CRN.js",
    "chunk-U724RIM4.js",
    "chunk-DX6QYMZL.js",
    "chunk-XC4YBHWE.js",
    "chunk-JG6OOG6M.js",
    "chunk-L2FF2B3K.js",
    "chunk-E5ZPMRHA.js",
    "chunk-BG33NLGT.js",
    "chunk-DXW7TK6G.js"
  ],
  "src/app/public/products/products.routes.ts": [
    "chunk-H3JMAOU3.js"
  ],
  "src/app/public/auth/login/login.component.ts": [
    "chunk-SS3XBLYN.js"
  ],
  "src/app/public/auth/register/register.component.ts": [
    "chunk-DVFD3LZS.js"
  ],
  "src/app/public/profile/profile.component.ts": [
    "chunk-2TDMGOZ2.js"
  ],
  "src/app/public/gsm/gsm.routes.ts": [
    "chunk-Y5MEC4LJ.js",
    "chunk-VZWXZZPO.js"
  ],
  "src/app/public/portfolio/portfolio.ts": [
    "chunk-VZERY2NG.js",
    "chunk-3N33EHOS.js",
    "chunk-VZWXZZPO.js"
  ],
  "src/app/public/landing/celular/celular-landing.component.ts": [
    "chunk-AZXIKX52.js",
    "chunk-P653H4KR.js",
    "chunk-HX3ACXD7.js",
    "chunk-TAB7UVPS.js"
  ],
  "src/app/public/categories/pages/home/public-categories-home-page.ts": [
    "chunk-QTGUPRL7.js",
    "chunk-U724RIM4.js",
    "chunk-DX6QYMZL.js",
    "chunk-XC4YBHWE.js",
    "chunk-JG6OOG6M.js",
    "chunk-PUJEUZQG.js"
  ],
  "src/app/public/categories/categories.routes.ts": [
    "chunk-NAAR4LOP.js"
  ],
  "src/app/public/products/pages/all/products-all-page.ts": [
    "chunk-D6PASCF3.js",
    "chunk-TAB7UVPS.js",
    "chunk-U724RIM4.js",
    "chunk-DX6QYMZL.js",
    "chunk-XC4YBHWE.js",
    "chunk-JG6OOG6M.js",
    "chunk-L2FF2B3K.js",
    "chunk-E5ZPMRHA.js",
    "chunk-BG33NLGT.js",
    "chunk-DXW7TK6G.js"
  ],
  "src/app/public/products/pages/index/products-index-page.ts": [
    "chunk-S4CTPJZL.js",
    "chunk-PUJEUZQG.js",
    "chunk-L2FF2B3K.js",
    "chunk-E5ZPMRHA.js",
    "chunk-BG33NLGT.js",
    "chunk-DXW7TK6G.js"
  ],
  "src/app/public/repuestos/repuestos.ts": [
    "chunk-6TVZNXP5.js",
    "chunk-DX6QYMZL.js",
    "chunk-XC4YBHWE.js",
    "chunk-JG6OOG6M.js",
    "chunk-PUJEUZQG.js",
    "chunk-L2FF2B3K.js",
    "chunk-E5ZPMRHA.js",
    "chunk-BG33NLGT.js",
    "chunk-DXW7TK6G.js"
  ],
  "src/app/public/products/pages/by-category/products-by-category-page.ts": [
    "chunk-AYMMMW7U.js",
    "chunk-TAB7UVPS.js",
    "chunk-U724RIM4.js",
    "chunk-DX6QYMZL.js",
    "chunk-XC4YBHWE.js",
    "chunk-JG6OOG6M.js",
    "chunk-PUJEUZQG.js",
    "chunk-L2FF2B3K.js",
    "chunk-E5ZPMRHA.js",
    "chunk-BG33NLGT.js",
    "chunk-DXW7TK6G.js"
  ]
},
  assets: {
    'index.csr.html': {size: 8778, hash: 'b0a082992e82040c7c2a132d9621a3c60f5311118a2c18609161be2703b04195', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 9318, hash: 'bc9c6079433346329c5a0181ae15dc03615a9ab85a11bf78f73f3bf0b50920f3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
