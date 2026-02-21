import {
  CategoryRepository
} from "./chunk-XUAOU2YN.js";
import {
  BrandRepository
} from "./chunk-ZJZBKGOC.js";
import {
  AuthService
} from "./chunk-65AYZUFN.js";
import {
  ProductRepository
} from "./chunk-GR2FBAX3.js";
import {
  Injectable,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-4O7IFJFV.js";
import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

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
  // Needed for storage and bulk ops not yet in repo
  auth = inject(AuthService);
  supabase = this.auth.getSupabaseClient();
  async getProducts() {
    return firstValueFrom(this.productRepo.getAll());
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
    const filePath = `products/${Date.now()}-${file.name}`;
    const { data, error } = await this.supabase.storage.from("public-assets").upload(filePath, file);
    if (error)
      throw error;
    const { data: publicUrl } = this.supabase.storage.from("public-assets").getPublicUrl(data.path);
    return publicUrl.publicUrl;
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
  async importProductsFromCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csv = e.target?.result;
          if (!csv)
            throw new Error("Empty file");
          const result = await this.csvService.parse(file, (values, headers) => {
            const product = {};
            headers.forEach((header, index) => {
              let value = values[index]?.trim();
              if (value === "" || value === void 0) {
                product[header] = null;
              } else if (header === "price" || header === "stock" || header === "min_stock_alert") {
                product[header] = Number(value);
              } else if (header === "is_active" || header === "is_featured") {
                product[header] = value.toLowerCase() === "true";
              } else {
                product[header] = value;
              }
            });
            if (!product["id"] || product["id"] === "new") {
              delete product["id"];
            }
            if (product["name"] && (product["price"] === void 0 || product["price"] >= 0)) {
              return product;
            }
            return null;
          });
          const productsToUpsert = result.data;
          if (productsToUpsert.length > 0) {
            try {
              const upserted = await firstValueFrom(this.productRepo.upsertMany(productsToUpsert));
              resolve({ success: upserted.length, errors: result.errors });
            } catch (e2) {
              reject(e2);
            }
          } else {
            resolve({ success: 0, errors: result.errors });
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
  async bulkUpdate(ids, payload) {
    const updates = ids.map((id) => __spreadValues({ id }, payload));
    await firstValueFrom(this.productRepo.updateMany(updates));
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
//# sourceMappingURL=chunk-QQCFQ26X.js.map
