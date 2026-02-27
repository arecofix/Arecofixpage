import {
  CategoryRepository
} from "./chunk-MYSAJLFD.js";
import {
  BrandRepository
} from "./chunk-ZJZBKGOC.js";
import {
  AuthService
} from "./chunk-2WW63FQH.js";
import {
  ProductRepository
} from "./chunk-NOSGPON2.js";
import {
  Injectable,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-DPJFS6PI.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/shared/services/csv.service.ts
var CsvService = class _CsvService {
  constructor() {
  }
  async parse(file, parser) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result;
          if (!csv) {
            reject(new Error("Empty file"));
            return;
          }
          const lines = csv.split(/\r\n|\n/);
          const headers = lines[0].split(",").map((h) => h.trim());
          const data = [];
          let errorCount = 0;
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line)
              continue;
            const values = this.parseLine(line);
            if (values.length !== headers.length) {
              console.warn(`Skipping line ${i + 1}: Column count mismatch`);
              errorCount++;
              continue;
            }
            const item = parser(values, headers);
            if (item) {
              data.push(item);
            } else {
              errorCount++;
            }
          }
          resolve({ data, errors: errorCount });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
  exportToCsv(data, filename, headers) {
    if (!data.length)
      return;
    const csvContent = [
      headers.join(","),
      ...data.map((item) => {
        return headers.map((header) => {
          const value = item[header];
          const safeValue = value === void 0 || value === null ? "" : value;
          if (typeof safeValue === "string" && (safeValue.includes(",") || safeValue.includes('"') || safeValue.includes("\n"))) {
            return `"${safeValue.replace(/"/g, '""')}"`;
          }
          return safeValue;
        }).join(",");
      })
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  parseLine(line) {
    const values = [];
    let inQuotes = false;
    let currentValue = "";
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(currentValue);
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue);
    return values;
  }
  static \u0275fac = function CsvService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CsvService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CsvService, factory: _CsvService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CsvService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/shared/utils/string.utils.ts
var StringUtils = class {
  static slugify(text) {
    return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/&/g, "-and-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
  }
  static capitalize(text) {
    if (!text)
      return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
};

// src/app/admin/products/services/admin-product.service.ts
var AdminProductService = class _AdminProductService {
  productRepo = inject(ProductRepository);
  brandRepo = inject(BrandRepository);
  categoryRepo = inject(CategoryRepository);
  csvService = inject(CsvService);
  auth = inject(AuthService);
  async getProducts() {
    const user = this.auth.getCurrentUser();
    if (user) {
      const profile = await this.auth.getUserProfile(user.id);
      return firstValueFrom(this.productRepo.getAll(profile?.branch_id));
    }
    return firstValueFrom(this.productRepo.getAll());
  }
  async getProductsPaginated(params) {
    const enrichedParams = __spreadProps(__spreadValues({}, params), {
      include_inactive: params.include_inactive ?? true
    });
    return firstValueFrom(this.productRepo.findWithFilters(enrichedParams));
  }
  async getProduct(id) {
    return firstValueFrom(this.productRepo.getById(id));
  }
  async getBrands() {
    return firstValueFrom(this.brandRepo.getAll());
  }
  async getCategories() {
    return firstValueFrom(this.categoryRepo.getAll());
  }
  async createProduct(payload) {
    await firstValueFrom(this.productRepo.create(payload));
  }
  async updateProduct(id, payload) {
    await firstValueFrom(this.productRepo.update(id, payload));
  }
  async uploadImage(file) {
    return this.productRepo.uploadImage(file);
  }
  slugify(text) {
    return StringUtils.slugify(text);
  }
  async exportProductsToCSV() {
    const products = await this.getProducts();
    if (!products.length)
      return;
    const headers = [
      "id",
      "name",
      "slug",
      "description",
      "price",
      "stock",
      "category_id",
      "brand_id",
      "image_url",
      "is_active",
      "is_featured",
      "sku",
      "barcode"
    ];
    this.csvService.exportToCsv(products, "products_export", headers);
  }
  // ────────────────────────────────────────────────────────────────────────
  // SMART IMPORT
  // ────────────────────────────────────────────────────────────────────────
  /**
   * Intelligent CSV import that:
   * 1. Parses and validates the CSV
   * 2. Fetches all existing products (lean projection for speed)
   * 3. Classifies each CSV row as: UPDATE (price only) | RENAME+UPDATE | INSERT (new)
   * 4. Never overwrites images, descriptions, categories or other data on existing products
   */
  async importProductsFromCSV(file) {
    const parseResult = await this.csvService.parse(file, (values, headers) => {
      const raw = {};
      headers.forEach((h, i) => {
        let v = values[i]?.trim();
        if (v === "" || v === void 0) {
          raw[h] = null;
        } else if (["price", "stock", "min_stock_alert"].includes(h)) {
          raw[h] = Number(v);
        } else if (["is_active", "is_featured"].includes(h)) {
          raw[h] = v.toLowerCase() === "true";
        } else {
          raw[h] = v;
        }
      });
      const name = raw["name"]?.trim();
      const price = raw["price"];
      if (!name || price === null || price === void 0 || isNaN(Number(price))) {
        return null;
      }
      const id = raw["id"] && raw["id"] !== "new" && raw["id"] !== "" ? raw["id"] : void 0;
      return {
        id,
        name,
        price: Number(price),
        stock: raw["stock"] != null ? Number(raw["stock"]) : void 0,
        sku: raw["sku"] || void 0,
        barcode: raw["barcode"] || void 0,
        description: raw["description"] || void 0,
        category_id: raw["category_id"] || void 0,
        brand_id: raw["brand_id"] || void 0,
        image_url: raw["image_url"] || void 0,
        slug: raw["slug"] || void 0,
        is_active: raw["is_active"] != null ? Boolean(raw["is_active"]) : true,
        is_featured: raw["is_featured"] != null ? Boolean(raw["is_featured"]) : false
      };
    });
    const csvRows = parseResult.data;
    const skipped = parseResult.errors;
    if (csvRows.length === 0) {
      return { inserted: 0, priceUpdated: 0, renamed: 0, skipped, details: ["No se encontraron filas v\xE1lidas en el CSV."] };
    }
    const [existing, brands, categories] = await Promise.all([
      firstValueFrom(this.productRepo.getAllForImport()),
      this.getBrands(),
      this.getCategories()
    ]);
    const byId = /* @__PURE__ */ new Map();
    const bySku = /* @__PURE__ */ new Map();
    const byName = /* @__PURE__ */ new Map();
    const bySlug = /* @__PURE__ */ new Set();
    for (const p of existing) {
      byId.set(p.id, p);
      if (p.sku)
        bySku.set(p.sku.trim().toLowerCase(), p);
      byName.set(this._normaliseName(p.name), p);
      bySlug.add(p.slug);
    }
    const brandByName = /* @__PURE__ */ new Map();
    const brandById = /* @__PURE__ */ new Set();
    brands.forEach((b) => {
      brandByName.set(this._normaliseName(b.name), b.id);
      brandById.add(b.id);
    });
    const catByName = /* @__PURE__ */ new Map();
    const catById = /* @__PURE__ */ new Set();
    categories.forEach((c) => {
      catByName.set(this._normaliseName(c.name), c.id);
      catById.add(c.id);
    });
    const details = [];
    const brandNamesToCreate = /* @__PURE__ */ new Set();
    const catNamesToCreate = /* @__PURE__ */ new Set();
    for (const row of csvRows) {
      if (row.brand_id) {
        if (this._isUuid(row.brand_id)) {
          if (!brandById.has(row.brand_id)) {
          }
        } else {
          const normName = this._normaliseName(row.brand_id);
          if (!brandByName.has(normName)) {
            brandNamesToCreate.add(normName);
          }
        }
      }
      if (row.category_id) {
        if (this._isUuid(row.category_id)) {
          if (!catById.has(row.category_id)) {
          }
        } else {
          const normName = this._normaliseName(row.category_id);
          if (!catByName.has(normName)) {
            catNamesToCreate.add(normName);
          }
        }
      }
    }
    for (const normName of brandNamesToCreate) {
      try {
        const displayName = normName.charAt(0).toUpperCase() + normName.slice(1);
        const newBrand = await firstValueFrom(this.brandRepo.create({ name: displayName, slug: StringUtils.slugify(normName), is_active: true }));
        brandByName.set(normName, newBrand.id);
        brandById.add(newBrand.id);
        details.push(`\u2139\uFE0F Marca creada autom\xE1ticamente: ${displayName}`);
      } catch (e) {
        details.push(`\u26A0\uFE0F No se pudo crear la marca "${normName}": ${e.message ?? e}`);
      }
    }
    for (const normName of catNamesToCreate) {
      try {
        const displayName = normName.charAt(0).toUpperCase() + normName.slice(1);
        const newCat = await firstValueFrom(this.categoryRepo.create({ name: displayName, slug: StringUtils.slugify(normName), type: "product", is_active: true }));
        catByName.set(normName, newCat.id);
        catById.add(newCat.id);
        details.push(`\u2139\uFE0F Categor\xEDa creada autom\xE1ticamente: ${displayName}`);
      } catch (e) {
        details.push(`\u26A0\uFE0F No se pudo crear la categor\xEDa "${normName}": ${e.message ?? e}`);
      }
    }
    const priceUpdates = [];
    const toInsert = [];
    const usedSlugsInBatch = /* @__PURE__ */ new Set();
    for (const row of csvRows) {
      const found = this._findExisting(row, byId, bySku, byName);
      if (found) {
        const safePrice = Math.min(row.price, 9999999999e-2);
        const update = { id: found.id, price: safePrice };
        if (this._isGenericRepuesto(found.name) && row.name && !this._isGenericRepuesto(row.name)) {
          update.newName = row.name;
        }
        priceUpdates.push(update);
      } else {
        let brandId = void 0;
        if (row.brand_id) {
          if (this._isUuid(row.brand_id) && brandById.has(row.brand_id)) {
            brandId = row.brand_id;
          } else {
            const norm = this._isUuid(row.brand_id) ? void 0 : brandByName.get(this._normaliseName(row.brand_id));
            brandId = norm;
          }
        }
        let catId = void 0;
        if (row.category_id) {
          if (this._isUuid(row.category_id) && catById.has(row.category_id)) {
            catId = row.category_id;
          } else {
            const norm = this._isUuid(row.category_id) ? void 0 : catByName.get(this._normaliseName(row.category_id));
            catId = norm;
          }
        }
        let baseSlug = row.slug || StringUtils.slugify(row.name);
        let slug = baseSlug;
        let counter = 1;
        while (bySlug.has(slug) || usedSlugsInBatch.has(slug)) {
          slug = `${baseSlug}-${counter++}`;
        }
        usedSlugsInBatch.add(slug);
        toInsert.push({
          name: row.name,
          slug,
          price: Math.min(row.price, 9999999999e-2),
          stock: Math.min(row.stock ?? 1, 99999),
          sku: row.sku || void 0,
          barcode: row.barcode || void 0,
          description: row.description || "",
          category_id: catId || void 0,
          brand_id: brandId || void 0,
          image_url: row.image_url || void 0,
          is_active: row.is_active ?? true,
          is_featured: row.is_featured ?? false
        });
      }
    }
    let priceUpdated = 0;
    let renamed = 0;
    let inserted = 0;
    if (priceUpdates.length > 0) {
      try {
        const { updated, errors: updateErrors } = await firstValueFrom(this.productRepo.bulkUpdatePrices(priceUpdates));
        priceUpdated = priceUpdates.filter((u) => !u.newName).length;
        renamed = priceUpdates.filter((u) => !!u.newName).length;
        details.push(`\u2705 ${updated} productos actualizados (precio${renamed > 0 ? ` + ${renamed} renombrados` : ""}).`);
        if (updateErrors > 0) {
          details.push(`\u26A0\uFE0F ${updateErrors} actualizaciones fallaron.`);
        }
      } catch (e) {
        details.push(`\u26A0\uFE0F Error cr\xEDtico en actualizaci\xF3n de precios: ${e.message}`);
      }
    }
    if (toInsert.length > 0) {
      const INSERT_CHUNK = 100;
      for (let i = 0; i < toInsert.length; i += INSERT_CHUNK) {
        const chunk = toInsert.slice(i, i + INSERT_CHUNK);
        try {
          const upserted = await firstValueFrom(this.productRepo.upsertMany(chunk));
          inserted += (upserted || []).length;
        } catch (e) {
          console.error("Batch error:", e);
          let errorMsg = e.message;
          if (errorMsg.includes("products_brand_id_fkey")) {
            errorMsg = "Marca no encontrada (el ID o nombre no coincide)";
          } else if (errorMsg.includes("numeric field overflow")) {
            errorMsg = "N\xFAmero demasiado grande (precio o stock excede el l\xEDmite)";
          } else if (errorMsg.includes("duplicate key")) {
            errorMsg = "Nombre o SKU ya existe";
          }
          details.push(`\u26A0\uFE0F Error lote ${Math.floor(i / INSERT_CHUNK) + 1}: ${errorMsg}`);
        }
      }
      details.push(`\u{1F195} ${inserted} productos nuevos insertados.`);
    }
    if (skipped > 0) {
      details.push(`\u26D4 ${skipped} filas omitidas (datos inv\xE1lidos o mal formateados).`);
    }
    return { inserted, priceUpdated, renamed, skipped, details };
  }
  // ────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────
  /** Try to match a CSV row to an existing product by ID → SKU → Name */
  _findExisting(row, byId, bySku, byName) {
    if (row.id && byId.has(row.id))
      return byId.get(row.id);
    if (row.sku) {
      const skuMatch = bySku.get(row.sku.trim().toLowerCase());
      if (skuMatch)
        return skuMatch;
    }
    const normName = this._normaliseName(row.name);
    return byName.get(normName) ?? null;
  }
  /** Normalise a product name for comparison: lowercase, trim, collapse spaces */
  _normaliseName(name) {
    return (name || "").toLowerCase().trim().replace(/\s+/g, " ");
  }
  /**
   * Returns true if a product name is a generic "repuesto" marker.
   * Covers: "Repuesto", "repuesto", "Repuesto Generic", "Repuesto Samsung", etc.
   */
  _isGenericRepuesto(name) {
    const n = (name || "").trim().toLowerCase();
    return n === "repuesto" || n.startsWith("repuesto ") || n.endsWith(" repuesto");
  }
  _isUuid(text) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(text);
  }
  // ────────────────────────────────────────────────────────────────────────
  // Bulk operations (used by BulkEditModal)
  // ────────────────────────────────────────────────────────────────────────
  /** Build minimal clean payloads so only REAL DB columns reach Supabase */
  async bulkCustomUpdate(updates) {
    const products = updates.map((u) => __spreadValues({ id: u.id }, u.payload));
    await firstValueFrom(this.productRepo.updateMany(products));
  }
  async bulkDelete(ids) {
    await firstValueFrom(this.productRepo.bulkDelete(ids));
  }
  async bulkIncreasePrice(ids, percentage) {
    const response = await firstValueFrom(this.productRepo.findWithFilters({ ids }));
    const products = response.data;
    if (!products || products.length === 0)
      return;
    const updates = products.map((p) => ({
      id: p.id,
      price: Math.round(p.price * (1 + percentage / 100))
    }));
    await firstValueFrom(this.productRepo.updateMany(updates));
  }
  static \u0275fac = function AdminProductService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminProductService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminProductService, factory: _AdminProductService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminProductService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AdminProductService
};
//# sourceMappingURL=chunk-EJD3GE5R.js.map
