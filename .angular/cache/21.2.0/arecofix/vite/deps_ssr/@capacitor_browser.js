import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  registerPlugin
} from "./chunk-PUCS3D5Y.js";
import "./chunk-SOE35BD4.js";

// node_modules/@capacitor/browser/dist/esm/index.js
var Browser = registerPlugin("Browser", {
  web: () => import("./web-DTZXP4CB.js").then((m) => new m.BrowserWeb())
});
export {
  Browser
};
//# sourceMappingURL=@capacitor_browser.js.map
