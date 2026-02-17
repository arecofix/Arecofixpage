import "./chunk-GOMI4DH3.js";

// src/app/public/products/products.routes.ts
var productsRoutes = [
  {
    path: "",
    // /productos -> All Products
    loadComponent: () => import("./chunk-2HEND3SJ.js").then((m) => m.ProductsAllPage)
  },
  {
    path: "inicio",
    // /productos/inicio -> Old Index (optional)
    loadComponent: () => import("./chunk-M2WXNGYC.js").then((m) => m.ProductsIndexPage)
  },
  {
    title: "Repuestos",
    matcher: (segments) => {
      if (segments.length === 2 && segments[0].path === "categoria" && segments[1].path.toLowerCase() === "repuestos") {
        return { consumed: segments };
      }
      return null;
    },
    loadComponent: () => import("./chunk-IQ2GZIML.js").then((m) => m.RepuestosComponent)
  },
  // Redirect /productos/categoria/cursos to /cursos
  {
    path: "categoria/cursos",
    redirectTo: "/academy",
    pathMatch: "full"
  },
  {
    title: "Productos por Categor\xEDa",
    path: "categoria/:categorySlug",
    loadComponent: () => import("./chunk-FCN6F7OT.js")
  },
  {
    title: "Detalle de Producto",
    path: "detalle/:productSlug",
    loadComponent: () => import("./chunk-VTQPIVAZ.js")
  },
  {
    title: "Productos Destacados",
    path: "destacados",
    // featured -> destacados
    loadComponent: () => import("./chunk-HA5DVK34.js")
  }
];
var products_routes_default = productsRoutes;
export {
  products_routes_default as default,
  productsRoutes
};
//# sourceMappingURL=chunk-SHNN7GMP.js.map
