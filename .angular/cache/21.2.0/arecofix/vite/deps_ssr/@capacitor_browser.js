import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  registerPlugin
} from "./chunk-FTWJXD53.js";
import "./chunk-SOE35BD4.js";

// node_modules/@capacitor/browser/dist/esm/index.js
var Browser = registerPlugin("Browser", {
  web: () => import("./web-WVWATJNW.js").then((m) => new m.BrowserWeb())
});
export {
  Browser
};
//# sourceMappingURL=@capacitor_browser.js.map
