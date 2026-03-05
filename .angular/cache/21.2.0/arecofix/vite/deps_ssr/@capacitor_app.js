import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  registerPlugin
} from "./chunk-PUCS3D5Y.js";
import "./chunk-SOE35BD4.js";

// node_modules/@capacitor/app/dist/esm/index.js
var App = registerPlugin("App", {
  web: () => import("./web-K5EFGXJD.js").then((m) => new m.AppWeb())
});
export {
  App
};
//# sourceMappingURL=@capacitor_app.js.map
