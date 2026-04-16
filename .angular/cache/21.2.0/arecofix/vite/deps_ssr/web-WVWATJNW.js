import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  WebPlugin
} from "./chunk-FTWJXD53.js";
import "./chunk-SOE35BD4.js";

// node_modules/@capacitor/browser/dist/esm/web.js
var BrowserWeb = class extends WebPlugin {
  constructor() {
    super();
    this._lastWindow = null;
  }
  async open(options) {
    this._lastWindow = window.open(options.url, options.windowName || "_blank");
  }
  async close() {
    return new Promise((resolve, reject) => {
      if (this._lastWindow != null) {
        this._lastWindow.close();
        this._lastWindow = null;
        resolve();
      } else {
        reject("No active window to close!");
      }
    });
  }
};
var Browser = new BrowserWeb();
export {
  Browser,
  BrowserWeb
};
//# sourceMappingURL=web-WVWATJNW.js.map
