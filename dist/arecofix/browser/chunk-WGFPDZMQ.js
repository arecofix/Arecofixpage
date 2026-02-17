import {
  BehaviorSubject,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  NgZone,
  Optional,
  Output,
  distinctUntilChanged,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject
} from "./chunk-K7T46PVE.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/posthog-js/dist/module.js
var t = "undefined" != typeof window ? window : void 0;
var i = "undefined" != typeof globalThis ? globalThis : t;
"undefined" == typeof self && (i.self = i), "undefined" == typeof File && (i.File = function() {
});
var e = Array.prototype;
var r = e.forEach;
var s = e.indexOf;
var n = null == i ? void 0 : i.navigator;
var o = null == i ? void 0 : i.document;
var a = null == i ? void 0 : i.location;
var l = null == i ? void 0 : i.fetch;
var u = null != i && i.XMLHttpRequest && "withCredentials" in new i.XMLHttpRequest() ? i.XMLHttpRequest : void 0;
var h = null == i ? void 0 : i.AbortController;
var d = null == n ? void 0 : n.userAgent;
var v = null != t ? t : {};
var c = { DEBUG: false, LIB_VERSION: "1.333.0" };
function f(t2, i2, e2, r2, s2, n2, o2) {
  try {
    var a2 = t2[n2](o2), l2 = a2.value;
  } catch (t3) {
    return void e2(t3);
  }
  a2.done ? i2(l2) : Promise.resolve(l2).then(r2, s2);
}
function p(t2) {
  return function() {
    var i2 = this, e2 = arguments;
    return new Promise((function(r2, s2) {
      var n2 = t2.apply(i2, e2);
      function o2(t3) {
        f(n2, r2, s2, o2, a2, "next", t3);
      }
      function a2(t3) {
        f(n2, r2, s2, o2, a2, "throw", t3);
      }
      o2(void 0);
    }));
  };
}
function g() {
  return g = Object.assign ? Object.assign.bind() : function(t2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var e2 = arguments[i2];
      for (var r2 in e2) ({}).hasOwnProperty.call(e2, r2) && (t2[r2] = e2[r2]);
    }
    return t2;
  }, g.apply(null, arguments);
}
function _(t2, i2) {
  if (null == t2) return {};
  var e2 = {};
  for (var r2 in t2) if ({}.hasOwnProperty.call(t2, r2)) {
    if (-1 !== i2.indexOf(r2)) continue;
    e2[r2] = t2[r2];
  }
  return e2;
}
var m = ["amazonbot", "amazonproductbot", "app.hypefactors.com", "applebot", "archive.org_bot", "awariobot", "backlinksextendedbot", "baiduspider", "bingbot", "bingpreview", "chrome-lighthouse", "dataforseobot", "deepscan", "duckduckbot", "facebookexternal", "facebookcatalog", "http://yandex.com/bots", "hubspot", "ia_archiver", "leikibot", "linkedinbot", "meta-externalagent", "mj12bot", "msnbot", "nessus", "petalbot", "pinterest", "prerender", "rogerbot", "screaming frog", "sebot-wa", "sitebulb", "slackbot", "slurp", "trendictionbot", "turnitin", "twitterbot", "vercel-screenshot", "vercelbot", "yahoo! slurp", "yandexbot", "zoombot", "bot.htm", "bot.php", "(bot;", "bot/", "crawler", "ahrefsbot", "ahrefssiteaudit", "semrushbot", "siteauditbot", "splitsignalbot", "gptbot", "oai-searchbot", "chatgpt-user", "perplexitybot", "better uptime bot", "sentryuptimebot", "uptimerobot", "headlesschrome", "cypress", "google-hoteladsverifier", "adsbot-google", "apis-google", "duplexweb-google", "feedfetcher-google", "google favicon", "google web preview", "google-read-aloud", "googlebot", "googleother", "google-cloudvertexbot", "googleweblight", "mediapartners-google", "storebot-google", "google-inspectiontool", "bytespider"];
var y = function(t2, i2) {
  if (void 0 === i2 && (i2 = []), !t2) return false;
  var e2 = t2.toLowerCase();
  return m.concat(i2).some(((t3) => {
    var i3 = t3.toLowerCase();
    return -1 !== e2.indexOf(i3);
  }));
};
var b = ["$snapshot", "$pageview", "$pageleave", "$set", "survey dismissed", "survey sent", "survey shown", "$identify", "$groupidentify", "$create_alias", "$$client_ingestion_warning", "$web_experiment_applied", "$feature_enrollment_update", "$feature_flag_called"];
function w(t2, i2) {
  return -1 !== t2.indexOf(i2);
}
var x = function(t2) {
  return t2.trim();
};
var E = function(t2) {
  return t2.replace(/^\$/, "");
};
var S = Array.isArray;
var k = Object.prototype;
var P = k.hasOwnProperty;
var T = k.toString;
var I = S || function(t2) {
  return "[object Array]" === T.call(t2);
};
var C = (t2) => "function" == typeof t2;
var R = (t2) => t2 === Object(t2) && !I(t2);
var F = (t2) => {
  if (R(t2)) {
    for (var i2 in t2) if (P.call(t2, i2)) return false;
    return true;
  }
  return false;
};
var M = (t2) => void 0 === t2;
var O = (t2) => "[object String]" == T.call(t2);
var A = (t2) => O(t2) && 0 === t2.trim().length;
var D = (t2) => null === t2;
var j = (t2) => M(t2) || D(t2);
var L = (t2) => "[object Number]" == T.call(t2) && t2 == t2;
var N = (t2) => L(t2) && t2 > 0;
var U = (t2) => "[object Boolean]" === T.call(t2);
var z = (t2) => t2 instanceof FormData;
var H = (t2) => w(b, t2);
function B(t2) {
  return null === t2 || "object" != typeof t2;
}
function q(t2, i2) {
  return Object.prototype.toString.call(t2) === "[object " + i2 + "]";
}
function W(t2) {
  return !M(Event) && (function(t3, i2) {
    try {
      return t3 instanceof i2;
    } catch (t4) {
      return false;
    }
  })(t2, Event);
}
var G = [true, "true", 1, "1", "yes"];
var V = (t2) => w(G, t2);
var J = [false, "false", 0, "0", "no"];
function K(t2, i2, e2, r2, s2) {
  return i2 > e2 && (r2.warn("min cannot be greater than max."), i2 = e2), L(t2) ? t2 > e2 ? (r2.warn(" cannot be  greater than max: " + e2 + ". Using max value instead."), e2) : t2 < i2 ? (r2.warn(" cannot be less than min: " + i2 + ". Using min value instead."), i2) : t2 : (r2.warn(" must be a number. using max or fallback. max: " + e2 + ", fallback: " + s2), K(s2 || e2, i2, e2, r2));
}
var Y = class {
  constructor(t2) {
    this.t = {}, this.i = t2.i, this.o = K(t2.bucketSize, 0, 100, t2.h), this.m = K(t2.refillRate, 0, this.o, t2.h), this.$ = K(t2.refillInterval, 0, 864e5, t2.h);
  }
  S(t2, i2) {
    var e2 = i2 - t2.lastAccess, r2 = Math.floor(e2 / this.$);
    if (r2 > 0) {
      var s2 = r2 * this.m;
      t2.tokens = Math.min(t2.tokens + s2, this.o), t2.lastAccess = t2.lastAccess + r2 * this.$;
    }
  }
  consumeRateLimit(t2) {
    var i2, e2 = Date.now(), r2 = String(t2), s2 = this.t[r2];
    return s2 ? this.S(s2, e2) : (s2 = { tokens: this.o, lastAccess: e2 }, this.t[r2] = s2), 0 === s2.tokens || (s2.tokens--, 0 === s2.tokens && (null == (i2 = this.i) || i2.call(this, t2)), 0 === s2.tokens);
  }
  stop() {
    this.t = {};
  }
};
var X = "Mobile";
var Q = "iOS";
var Z = "Android";
var tt = "Tablet";
var it = Z + " " + tt;
var et = "iPad";
var rt = "Apple";
var st = rt + " Watch";
var nt = "Safari";
var ot = "BlackBerry";
var at = "Samsung";
var lt = at + "Browser";
var ut = at + " Internet";
var ht = "Chrome";
var dt = ht + " OS";
var vt = ht + " " + Q;
var ct = "Internet Explorer";
var ft = ct + " " + X;
var pt = "Opera";
var gt = pt + " Mini";
var _t = "Edge";
var mt = "Microsoft " + _t;
var yt = "Firefox";
var bt = yt + " " + Q;
var wt = "Nintendo";
var xt = "PlayStation";
var Et = "Xbox";
var $t = Z + " " + X;
var St = X + " " + nt;
var kt = "Windows";
var Pt = kt + " Phone";
var Tt = "Nokia";
var It = "Ouya";
var Ct = "Generic";
var Rt = Ct + " " + X.toLowerCase();
var Ft = Ct + " " + tt.toLowerCase();
var Mt = "Konqueror";
var Ot = "(\\d+(\\.\\d+)?)";
var At = new RegExp("Version/" + Ot);
var Dt = new RegExp(Et, "i");
var jt = new RegExp(xt + " \\w+", "i");
var Lt = new RegExp(wt + " \\w+", "i");
var Nt = new RegExp(ot + "|PlayBook|BB10", "i");
var Ut = { "NT3.51": "NT 3.11", "NT4.0": "NT 4.0", "5.0": "2000", 5.1: "XP", 5.2: "XP", "6.0": "Vista", 6.1: "7", 6.2: "8", 6.3: "8.1", 6.4: "10", "10.0": "10" };
var zt;
var Ht;
var Bt;
var qt = (t2, i2) => i2 && w(i2, rt) || (function(t3) {
  return w(t3, nt) && !w(t3, ht) && !w(t3, Z);
})(t2);
var Wt = function(t2, i2) {
  return i2 = i2 || "", w(t2, " OPR/") && w(t2, "Mini") ? gt : w(t2, " OPR/") ? pt : Nt.test(t2) ? ot : w(t2, "IE" + X) || w(t2, "WPDesktop") ? ft : w(t2, lt) ? ut : w(t2, _t) || w(t2, "Edg/") ? mt : w(t2, "FBIOS") ? "Facebook " + X : w(t2, "UCWEB") || w(t2, "UCBrowser") ? "UC Browser" : w(t2, "CriOS") ? vt : w(t2, "CrMo") || w(t2, ht) ? ht : w(t2, Z) && w(t2, nt) ? $t : w(t2, "FxiOS") ? bt : w(t2.toLowerCase(), Mt.toLowerCase()) ? Mt : qt(t2, i2) ? w(t2, X) ? St : nt : w(t2, yt) ? yt : w(t2, "MSIE") || w(t2, "Trident/") ? ct : w(t2, "Gecko") ? yt : "";
};
var Gt = { [ft]: [new RegExp("rv:" + Ot)], [mt]: [new RegExp(_t + "?\\/" + Ot)], [ht]: [new RegExp("(" + ht + "|CrMo)\\/" + Ot)], [vt]: [new RegExp("CriOS\\/" + Ot)], "UC Browser": [new RegExp("(UCBrowser|UCWEB)\\/" + Ot)], [nt]: [At], [St]: [At], [pt]: [new RegExp("(Opera|OPR)\\/" + Ot)], [yt]: [new RegExp(yt + "\\/" + Ot)], [bt]: [new RegExp("FxiOS\\/" + Ot)], [Mt]: [new RegExp("Konqueror[:/]?" + Ot, "i")], [ot]: [new RegExp(ot + " " + Ot), At], [$t]: [new RegExp("android\\s" + Ot, "i")], [ut]: [new RegExp(lt + "\\/" + Ot)], [ct]: [new RegExp("(rv:|MSIE )" + Ot)], Mozilla: [new RegExp("rv:" + Ot)] };
var Vt = function(t2, i2) {
  var e2 = Wt(t2, i2), r2 = Gt[e2];
  if (M(r2)) return null;
  for (var s2 = 0; s2 < r2.length; s2++) {
    var n2 = r2[s2], o2 = t2.match(n2);
    if (o2) return parseFloat(o2[o2.length - 2]);
  }
  return null;
};
var Jt = [[new RegExp(Et + "; " + Et + " (.*?)[);]", "i"), (t2) => [Et, t2 && t2[1] || ""]], [new RegExp(wt, "i"), [wt, ""]], [new RegExp(xt, "i"), [xt, ""]], [Nt, [ot, ""]], [new RegExp(kt, "i"), (t2, i2) => {
  if (/Phone/.test(i2) || /WPDesktop/.test(i2)) return [Pt, ""];
  if (new RegExp(X).test(i2) && !/IEMobile\b/.test(i2)) return [kt + " " + X, ""];
  var e2 = /Windows NT ([0-9.]+)/i.exec(i2);
  if (e2 && e2[1]) {
    var r2 = e2[1], s2 = Ut[r2] || "";
    return /arm/i.test(i2) && (s2 = "RT"), [kt, s2];
  }
  return [kt, ""];
}], [/((iPhone|iPad|iPod).*?OS (\d+)_(\d+)_?(\d+)?|iPhone)/, (t2) => {
  if (t2 && t2[3]) {
    var i2 = [t2[3], t2[4], t2[5] || "0"];
    return [Q, i2.join(".")];
  }
  return [Q, ""];
}], [/(watch.*\/(\d+\.\d+\.\d+)|watch os,(\d+\.\d+),)/i, (t2) => {
  var i2 = "";
  return t2 && t2.length >= 3 && (i2 = M(t2[2]) ? t2[3] : t2[2]), ["watchOS", i2];
}], [new RegExp("(" + Z + " (\\d+)\\.(\\d+)\\.?(\\d+)?|" + Z + ")", "i"), (t2) => {
  if (t2 && t2[2]) {
    var i2 = [t2[2], t2[3], t2[4] || "0"];
    return [Z, i2.join(".")];
  }
  return [Z, ""];
}], [/Mac OS X (\d+)[_.](\d+)[_.]?(\d+)?/i, (t2) => {
  var i2 = ["Mac OS X", ""];
  if (t2 && t2[1]) {
    var e2 = [t2[1], t2[2], t2[3] || "0"];
    i2[1] = e2.join(".");
  }
  return i2;
}], [/Mac/i, ["Mac OS X", ""]], [/CrOS/, [dt, ""]], [/Linux|debian/i, ["Linux", ""]]];
var Kt = function(t2) {
  return Lt.test(t2) ? wt : jt.test(t2) ? xt : Dt.test(t2) ? Et : new RegExp(It, "i").test(t2) ? It : new RegExp("(" + Pt + "|WPDesktop)", "i").test(t2) ? Pt : /iPad/.test(t2) ? et : /iPod/.test(t2) ? "iPod Touch" : /iPhone/.test(t2) ? "iPhone" : /(watch)(?: ?os[,/]|\d,\d\/)[\d.]+/i.test(t2) ? st : Nt.test(t2) ? ot : /(kobo)\s(ereader|touch)/i.test(t2) ? "Kobo" : new RegExp(Tt, "i").test(t2) ? Tt : /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i.test(t2) || /(kf[a-z]+)( bui|\)).+silk\//i.test(t2) ? "Kindle Fire" : /(Android|ZTE)/i.test(t2) ? new RegExp(X).test(t2) && !/(9138B|TB782B|Nexus [97]|pixel c|HUAWEISHT|BTV|noble nook|smart ultra 6)/i.test(t2) || /pixel[\daxl ]{1,6}/i.test(t2) && !/pixel c/i.test(t2) || /(huaweimed-al00|tah-|APA|SM-G92|i980|zte|U304AA)/i.test(t2) || /lmy47v/i.test(t2) && !/QTAQZ3/i.test(t2) ? Z : it : new RegExp("(pda|" + X + ")", "i").test(t2) ? Rt : new RegExp(tt, "i").test(t2) && !new RegExp(tt + " pc", "i").test(t2) ? Ft : "";
};
var Yt = (t2) => t2 instanceof Error;
function Xt(t2) {
  var i2 = globalThis._posthogChunkIds;
  if (i2) {
    var e2 = Object.keys(i2);
    return Bt && e2.length === Ht || (Ht = e2.length, Bt = e2.reduce(((e3, r2) => {
      zt || (zt = {});
      var s2 = zt[r2];
      if (s2) e3[s2[0]] = s2[1];
      else for (var n2 = t2(r2), o2 = n2.length - 1; o2 >= 0; o2--) {
        var a2 = n2[o2], l2 = null == a2 ? void 0 : a2.filename, u2 = i2[r2];
        if (l2 && u2) {
          e3[l2] = u2, zt[r2] = [l2, u2];
          break;
        }
      }
      return e3;
    }), {})), Bt;
  }
}
var Qt = class {
  constructor(t2, i2, e2) {
    void 0 === e2 && (e2 = []), this.coercers = t2, this.stackParser = i2, this.modifiers = e2;
  }
  buildFromUnknown(t2, i2) {
    void 0 === i2 && (i2 = {});
    var e2 = i2 && i2.mechanism || { handled: true, type: "generic" }, r2 = this.buildCoercingContext(e2, i2, 0).apply(t2), s2 = this.buildParsingContext(), n2 = this.parseStacktrace(r2, s2);
    return { $exception_list: this.convertToExceptionList(n2, e2), $exception_level: "error" };
  }
  modifyFrames(t2) {
    var i2 = this;
    return p((function* () {
      for (var e2 of t2) e2.stacktrace && e2.stacktrace.frames && I(e2.stacktrace.frames) && (e2.stacktrace.frames = yield i2.applyModifiers(e2.stacktrace.frames));
      return t2;
    }))();
  }
  coerceFallback(t2) {
    var i2;
    return { type: "Error", value: "Unknown error", stack: null == (i2 = t2.syntheticException) ? void 0 : i2.stack, synthetic: true };
  }
  parseStacktrace(t2, i2) {
    var e2, r2;
    return null != t2.cause && (e2 = this.parseStacktrace(t2.cause, i2)), "" != t2.stack && null != t2.stack && (r2 = this.applyChunkIds(this.stackParser(t2.stack, t2.synthetic ? 1 : 0), i2.chunkIdMap)), g({}, t2, { cause: e2, stack: r2 });
  }
  applyChunkIds(t2, i2) {
    return t2.map(((t3) => (t3.filename && i2 && (t3.chunk_id = i2[t3.filename]), t3)));
  }
  applyCoercers(t2, i2) {
    for (var e2 of this.coercers) if (e2.match(t2)) return e2.coerce(t2, i2);
    return this.coerceFallback(i2);
  }
  applyModifiers(t2) {
    var i2 = this;
    return p((function* () {
      var e2 = t2;
      for (var r2 of i2.modifiers) e2 = yield r2(e2);
      return e2;
    }))();
  }
  convertToExceptionList(t2, i2) {
    var e2, r2, s2, n2 = { type: t2.type, value: t2.value, mechanism: { type: null !== (e2 = i2.type) && void 0 !== e2 ? e2 : "generic", handled: null === (r2 = i2.handled) || void 0 === r2 || r2, synthetic: null !== (s2 = t2.synthetic) && void 0 !== s2 && s2 } };
    t2.stack && (n2.stacktrace = { type: "raw", frames: t2.stack });
    var o2 = [n2];
    return null != t2.cause && o2.push(...this.convertToExceptionList(t2.cause, g({}, i2, { handled: true }))), o2;
  }
  buildParsingContext() {
    return { chunkIdMap: Xt(this.stackParser) };
  }
  buildCoercingContext(t2, i2, e2) {
    void 0 === e2 && (e2 = 0);
    var r2 = (e3, r3) => {
      if (r3 <= 4) {
        var s2 = this.buildCoercingContext(t2, i2, r3);
        return this.applyCoercers(e3, s2);
      }
    };
    return g({}, i2, { syntheticException: 0 == e2 ? i2.syntheticException : void 0, mechanism: t2, apply: (t3) => r2(t3, e2), next: (t3) => r2(t3, e2 + 1) });
  }
};
var Zt = "?";
function ti(t2, i2, e2, r2, s2) {
  var n2 = { platform: t2, filename: i2, function: "<anonymous>" === e2 ? Zt : e2, in_app: true };
  return M(r2) || (n2.lineno = r2), M(s2) || (n2.colno = s2), n2;
}
var ii = (t2, i2) => {
  var e2 = -1 !== t2.indexOf("safari-extension"), r2 = -1 !== t2.indexOf("safari-web-extension");
  return e2 || r2 ? [-1 !== t2.indexOf("@") ? t2.split("@")[0] : Zt, e2 ? "safari-extension:" + i2 : "safari-web-extension:" + i2] : [t2, i2];
};
var ei = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
var ri = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var si = /\((\S*)(?::(\d+))(?::(\d+))\)/;
var ni = (t2, i2) => {
  var e2 = ei.exec(t2);
  if (e2) {
    var [, r2, s2, n2] = e2;
    return ti(i2, r2, Zt, +s2, +n2);
  }
  var o2 = ri.exec(t2);
  if (o2) {
    if (o2[2] && 0 === o2[2].indexOf("eval")) {
      var a2 = si.exec(o2[2]);
      a2 && (o2[2] = a2[1], o2[3] = a2[2], o2[4] = a2[3]);
    }
    var [l2, u2] = ii(o2[1] || Zt, o2[2]);
    return ti(i2, u2, l2, o2[3] ? +o2[3] : void 0, o2[4] ? +o2[4] : void 0);
  }
};
var oi = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
var ai = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
var li = (t2, i2) => {
  var e2 = oi.exec(t2);
  if (e2) {
    if (e2[3] && e2[3].indexOf(" > eval") > -1) {
      var r2 = ai.exec(e2[3]);
      r2 && (e2[1] = e2[1] || "eval", e2[3] = r2[1], e2[4] = r2[2], e2[5] = "");
    }
    var s2 = e2[3], n2 = e2[1] || Zt;
    return [n2, s2] = ii(n2, s2), ti(i2, s2, n2, e2[4] ? +e2[4] : void 0, e2[5] ? +e2[5] : void 0);
  }
};
var ui = /\(error: (.*)\)/;
var hi = 50;
function di() {
  return (function(t2) {
    for (var i2 = arguments.length, e2 = new Array(i2 > 1 ? i2 - 1 : 0), r2 = 1; r2 < i2; r2++) e2[r2 - 1] = arguments[r2];
    return function(i3, r3) {
      void 0 === r3 && (r3 = 0);
      for (var s2 = [], n2 = i3.split("\n"), o2 = r3; o2 < n2.length; o2++) {
        var a2 = n2[o2];
        if (!(a2.length > 1024)) {
          var l2 = ui.test(a2) ? a2.replace(ui, "$1") : a2;
          if (!l2.match(/\S*Error: /)) {
            for (var u2 of e2) {
              var h3 = u2(l2, t2);
              if (h3) {
                s2.push(h3);
                break;
              }
            }
            if (s2.length >= hi) break;
          }
        }
      }
      return (function(t3) {
        if (!t3.length) return [];
        var i4 = Array.from(t3);
        return i4.reverse(), i4.slice(0, hi).map(((t4) => {
          return g({}, t4, { filename: t4.filename || (e3 = i4, e3[e3.length - 1] || {}).filename, function: t4.function || Zt });
          var e3;
        }));
      })(s2);
    };
  })("web:javascript", ni, li);
}
var vi = class {
  match(t2) {
    return this.isDOMException(t2) || this.isDOMError(t2);
  }
  coerce(t2, i2) {
    var e2 = O(t2.stack);
    return { type: this.getType(t2), value: this.getValue(t2), stack: e2 ? t2.stack : void 0, cause: t2.cause ? i2.next(t2.cause) : void 0, synthetic: false };
  }
  getType(t2) {
    return this.isDOMError(t2) ? "DOMError" : "DOMException";
  }
  getValue(t2) {
    var i2 = t2.name || (this.isDOMError(t2) ? "DOMError" : "DOMException");
    return t2.message ? i2 + ": " + t2.message : i2;
  }
  isDOMException(t2) {
    return q(t2, "DOMException");
  }
  isDOMError(t2) {
    return q(t2, "DOMError");
  }
};
var ci = class {
  match(t2) {
    return ((t3) => t3 instanceof Error)(t2);
  }
  coerce(t2, i2) {
    return { type: this.getType(t2), value: this.getMessage(t2, i2), stack: this.getStack(t2), cause: t2.cause ? i2.next(t2.cause) : void 0, synthetic: false };
  }
  getType(t2) {
    return t2.name || t2.constructor.name;
  }
  getMessage(t2, i2) {
    var e2 = t2.message;
    return e2.error && "string" == typeof e2.error.message ? String(e2.error.message) : String(e2);
  }
  getStack(t2) {
    return t2.stacktrace || t2.stack || void 0;
  }
};
var fi = class {
  constructor() {
  }
  match(t2) {
    return q(t2, "ErrorEvent") && null != t2.error;
  }
  coerce(t2, i2) {
    var e2, r2 = i2.apply(t2.error);
    return r2 || { type: "ErrorEvent", value: t2.message, stack: null == (e2 = i2.syntheticException) ? void 0 : e2.stack, synthetic: true };
  }
};
var pi = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
var gi = class {
  match(t2) {
    return "string" == typeof t2;
  }
  coerce(t2, i2) {
    var e2, [r2, s2] = this.getInfos(t2);
    return { type: null != r2 ? r2 : "Error", value: null != s2 ? s2 : t2, stack: null == (e2 = i2.syntheticException) ? void 0 : e2.stack, synthetic: true };
  }
  getInfos(t2) {
    var i2 = "Error", e2 = t2, r2 = t2.match(pi);
    return r2 && (i2 = r2[1], e2 = r2[2]), [i2, e2];
  }
};
var _i = ["fatal", "error", "warning", "log", "info", "debug"];
function mi(t2, i2) {
  void 0 === i2 && (i2 = 40);
  var e2 = Object.keys(t2);
  if (e2.sort(), !e2.length) return "[object has no keys]";
  for (var r2 = e2.length; r2 > 0; r2--) {
    var s2 = e2.slice(0, r2).join(", ");
    if (!(s2.length > i2)) return r2 === e2.length || s2.length <= i2 ? s2 : s2.slice(0, i2) + "...";
  }
  return "";
}
var yi = class {
  match(t2) {
    return "object" == typeof t2 && null !== t2;
  }
  coerce(t2, i2) {
    var e2, r2 = this.getErrorPropertyFromObject(t2);
    return r2 ? i2.apply(r2) : { type: this.getType(t2), value: this.getValue(t2), stack: null == (e2 = i2.syntheticException) ? void 0 : e2.stack, level: this.isSeverityLevel(t2.level) ? t2.level : "error", synthetic: true };
  }
  getType(t2) {
    return W(t2) ? t2.constructor.name : "Error";
  }
  getValue(t2) {
    if ("name" in t2 && "string" == typeof t2.name) {
      var i2 = "'" + t2.name + "' captured as exception";
      return "message" in t2 && "string" == typeof t2.message && (i2 += " with message: '" + t2.message + "'"), i2;
    }
    if ("message" in t2 && "string" == typeof t2.message) return t2.message;
    var e2 = this.getObjectClassName(t2);
    return (e2 && "Object" !== e2 ? "'" + e2 + "'" : "Object") + " captured as exception with keys: " + mi(t2);
  }
  isSeverityLevel(t2) {
    return O(t2) && !A(t2) && _i.indexOf(t2) >= 0;
  }
  getErrorPropertyFromObject(t2) {
    for (var i2 in t2) if (Object.prototype.hasOwnProperty.call(t2, i2)) {
      var e2 = t2[i2];
      if (Yt(e2)) return e2;
    }
  }
  getObjectClassName(t2) {
    try {
      var i2 = Object.getPrototypeOf(t2);
      return i2 ? i2.constructor.name : void 0;
    } catch (t3) {
      return;
    }
  }
};
var bi = class {
  match(t2) {
    return W(t2);
  }
  coerce(t2, i2) {
    var e2, r2 = t2.constructor.name;
    return { type: r2, value: r2 + " captured as exception with keys: " + mi(t2), stack: null == (e2 = i2.syntheticException) ? void 0 : e2.stack, synthetic: true };
  }
};
var wi = class {
  match(t2) {
    return B(t2);
  }
  coerce(t2, i2) {
    var e2;
    return { type: "Error", value: "Primitive value captured as exception: " + String(t2), stack: null == (e2 = i2.syntheticException) ? void 0 : e2.stack, synthetic: true };
  }
};
var xi = class {
  match(t2) {
    return q(t2, "PromiseRejectionEvent");
  }
  coerce(t2, i2) {
    var e2, r2 = this.getUnhandledRejectionReason(t2);
    return B(r2) ? { type: "UnhandledRejection", value: "Non-Error promise rejection captured with value: " + String(r2), stack: null == (e2 = i2.syntheticException) ? void 0 : e2.stack, synthetic: true } : i2.apply(r2);
  }
  getUnhandledRejectionReason(t2) {
    if (B(t2)) return t2;
    try {
      if ("reason" in t2) return t2.reason;
      if ("detail" in t2 && "reason" in t2.detail) return t2.detail.reason;
    } catch (t3) {
    }
    return t2;
  }
};
var Ei = function(i2, e2) {
  var { debugEnabled: r2 } = void 0 === e2 ? {} : e2, s2 = { k: function(e3) {
    if (t && (c.DEBUG || v.POSTHOG_DEBUG || r2) && !M(t.console) && t.console) {
      for (var s3 = ("__rrweb_original__" in t.console[e3]) ? t.console[e3].__rrweb_original__ : t.console[e3], n2 = arguments.length, o2 = new Array(n2 > 1 ? n2 - 1 : 0), a2 = 1; a2 < n2; a2++) o2[a2 - 1] = arguments[a2];
      s3(i2, ...o2);
    }
  }, info: function() {
    for (var t2 = arguments.length, i3 = new Array(t2), e3 = 0; e3 < t2; e3++) i3[e3] = arguments[e3];
    s2.k("log", ...i3);
  }, warn: function() {
    for (var t2 = arguments.length, i3 = new Array(t2), e3 = 0; e3 < t2; e3++) i3[e3] = arguments[e3];
    s2.k("warn", ...i3);
  }, error: function() {
    for (var t2 = arguments.length, i3 = new Array(t2), e3 = 0; e3 < t2; e3++) i3[e3] = arguments[e3];
    s2.k("error", ...i3);
  }, critical: function() {
    for (var t2 = arguments.length, e3 = new Array(t2), r3 = 0; r3 < t2; r3++) e3[r3] = arguments[r3];
    console.error(i2, ...e3);
  }, uninitializedWarning: (t2) => {
    s2.error("You must initialize PostHog before calling " + t2);
  }, createLogger: (t2, e3) => Ei(i2 + " " + t2, e3) };
  return s2;
};
var $i = Ei("[PostHog.js]");
var Si = $i.createLogger;
var ki = Si("[ExternalScriptsLoader]");
var Pi = (t2, i2, e2) => {
  if (t2.config.disable_external_dependency_loading) return ki.warn(i2 + " was requested but loading of external scripts is disabled."), e2("Loading of external scripts is disabled");
  var r2 = null == o ? void 0 : o.querySelectorAll("script");
  if (r2) {
    for (var s2, n2 = function() {
      if (r2[a2].src === i2) {
        var t3 = r2[a2];
        return t3.__posthog_loading_callback_fired ? { v: e2() } : (t3.addEventListener("load", ((i3) => {
          t3.__posthog_loading_callback_fired = true, e2(void 0, i3);
        })), t3.onerror = (t4) => e2(t4), { v: void 0 });
      }
    }, a2 = 0; a2 < r2.length; a2++) if (s2 = n2()) return s2.v;
  }
  var l2 = () => {
    if (!o) return e2("document not found");
    var r3 = o.createElement("script");
    if (r3.type = "text/javascript", r3.crossOrigin = "anonymous", r3.src = i2, r3.onload = (t3) => {
      r3.__posthog_loading_callback_fired = true, e2(void 0, t3);
    }, r3.onerror = (t3) => e2(t3), t2.config.prepare_external_dependency_script && (r3 = t2.config.prepare_external_dependency_script(r3)), !r3) return e2("prepare_external_dependency_script returned null");
    var s3, n3 = o.querySelectorAll("body > script");
    n3.length > 0 ? null == (s3 = n3[0].parentNode) || s3.insertBefore(r3, n3[0]) : o.body.appendChild(r3);
  };
  null != o && o.body ? l2() : null == o || o.addEventListener("DOMContentLoaded", l2);
};
v.__PosthogExtensions__ = v.__PosthogExtensions__ || {}, v.__PosthogExtensions__.loadExternalDependency = (t2, i2, e2) => {
  var r2 = "/static/" + i2 + ".js?v=" + t2.version;
  if ("remote-config" === i2 && (r2 = "/array/" + t2.config.token + "/config.js"), "toolbar" === i2) {
    var s2 = 3e5;
    r2 = r2 + "&t=" + Math.floor(Date.now() / s2) * s2;
  }
  var n2 = t2.requestRouter.endpointFor("assets", r2);
  Pi(t2, n2, e2);
}, v.__PosthogExtensions__.loadSiteApp = (t2, i2, e2) => {
  var r2 = t2.requestRouter.endpointFor("api", i2);
  Pi(t2, r2, e2);
};
var Ti = {};
function Ii(t2, i2, e2) {
  if (I(t2)) {
    if (r && t2.forEach === r) t2.forEach(i2, e2);
    else if ("length" in t2 && t2.length === +t2.length) {
      for (var s2 = 0, n2 = t2.length; s2 < n2; s2++) if (s2 in t2 && i2.call(e2, t2[s2], s2) === Ti) return;
    }
  }
}
function Ci(t2, i2, e2) {
  if (!j(t2)) {
    if (I(t2)) return Ii(t2, i2, e2);
    if (z(t2)) {
      for (var r2 of t2.entries()) if (i2.call(e2, r2[1], r2[0]) === Ti) return;
    } else for (var s2 in t2) if (P.call(t2, s2) && i2.call(e2, t2[s2], s2) === Ti) return;
  }
}
var Ri = function(t2) {
  for (var i2 = arguments.length, e2 = new Array(i2 > 1 ? i2 - 1 : 0), r2 = 1; r2 < i2; r2++) e2[r2 - 1] = arguments[r2];
  return Ii(e2, (function(i3) {
    for (var e3 in i3) void 0 !== i3[e3] && (t2[e3] = i3[e3]);
  })), t2;
};
var Fi = function(t2) {
  for (var i2 = arguments.length, e2 = new Array(i2 > 1 ? i2 - 1 : 0), r2 = 1; r2 < i2; r2++) e2[r2 - 1] = arguments[r2];
  return Ii(e2, (function(i3) {
    Ii(i3, (function(i4) {
      t2.push(i4);
    }));
  })), t2;
};
function Mi(t2) {
  for (var i2 = Object.keys(t2), e2 = i2.length, r2 = new Array(e2); e2--; ) r2[e2] = [i2[e2], t2[i2[e2]]];
  return r2;
}
var Oi = function(t2) {
  try {
    return t2();
  } catch (t3) {
    return;
  }
};
var Ai = function(t2) {
  return function() {
    try {
      for (var i2 = arguments.length, e2 = new Array(i2), r2 = 0; r2 < i2; r2++) e2[r2] = arguments[r2];
      return t2.apply(this, e2);
    } catch (t3) {
      $i.critical("Implementation error. Please turn on debug mode and open a ticket on https://app.posthog.com/home#panel=support%3Asupport%3A."), $i.critical(t3);
    }
  };
};
var Di = function(t2) {
  var i2 = {};
  return Ci(t2, (function(t3, e2) {
    (O(t3) && t3.length > 0 || L(t3)) && (i2[e2] = t3);
  })), i2;
};
function ji(t2, i2) {
  return e2 = t2, r2 = (t3) => O(t3) && !D(i2) ? t3.slice(0, i2) : t3, s2 = /* @__PURE__ */ new Set(), (function t3(i3, e3) {
    return i3 !== Object(i3) ? r2 ? r2(i3, e3) : i3 : s2.has(i3) ? void 0 : (s2.add(i3), I(i3) ? (n2 = [], Ii(i3, ((i4) => {
      n2.push(t3(i4));
    }))) : (n2 = {}, Ci(i3, ((i4, e4) => {
      s2.has(i4) || (n2[e4] = t3(i4, e4));
    }))), n2);
    var n2;
  })(e2);
  var e2, r2, s2;
}
var Li = ["herokuapp.com", "vercel.app", "netlify.app"];
function Ni(t2) {
  var i2 = null == t2 ? void 0 : t2.hostname;
  if (!O(i2)) return false;
  var e2 = i2.split(".").slice(-2).join(".");
  for (var r2 of Li) if (e2 === r2) return false;
  return true;
}
function Ui(t2, i2) {
  for (var e2 = 0; e2 < t2.length; e2++) if (i2(t2[e2])) return t2[e2];
}
function zi(t2, i2, e2, r2) {
  var { capture: s2 = false, passive: n2 = true } = null != r2 ? r2 : {};
  null == t2 || t2.addEventListener(i2, e2, { capture: s2, passive: n2 });
}
var Hi = "$people_distinct_id";
var Bi = "__alias";
var qi = "__timers";
var Wi = "$autocapture_disabled_server_side";
var Gi = "$heatmaps_enabled_server_side";
var Vi = "$exception_capture_enabled_server_side";
var Ji = "$error_tracking_suppression_rules";
var Ki = "$error_tracking_capture_extension_exceptions";
var Yi = "$web_vitals_enabled_server_side";
var Xi = "$dead_clicks_enabled_server_side";
var Qi = "$product_tours_enabled_server_side";
var Zi = "$web_vitals_allowed_metrics";
var te = "$session_recording_remote_config";
var ie = "$sesid";
var ee = "$session_is_sampled";
var re = "$enabled_feature_flags";
var se = "$early_access_features";
var ne = "$feature_flag_details";
var oe = "$stored_person_properties";
var ae = "$stored_group_properties";
var le = "$surveys";
var ue = "$flag_call_reported";
var he = "$user_state";
var de = "$client_session_props";
var ve = "$capture_rate_limit";
var ce = "$initial_campaign_params";
var fe = "$initial_referrer_info";
var pe = "$initial_person_info";
var ge = "$epp";
var _e = "__POSTHOG_TOOLBAR__";
var me = "$posthog_cookieless";
var ye = [Hi, Bi, "__cmpns", qi, "$session_recording_enabled_server_side", Gi, ie, re, Ji, he, se, ne, ae, oe, le, ue, de, ve, ce, fe, ge, pe, "$conversations_widget_session_id", "$conversations_ticket_id", "$conversations_widget_state", "$conversations_user_traits"];
function be(t2) {
  return t2 instanceof Element && (t2.id === _e || !(null == t2.closest || !t2.closest(".toolbar-global-fade-container")));
}
function we(t2) {
  return !!t2 && 1 === t2.nodeType;
}
function xe(t2, i2) {
  return !!t2 && !!t2.tagName && t2.tagName.toLowerCase() === i2.toLowerCase();
}
function Ee(t2) {
  return !!t2 && 3 === t2.nodeType;
}
function $e(t2) {
  return !!t2 && 11 === t2.nodeType;
}
function Se(t2) {
  return t2 ? x(t2).split(/\s+/) : [];
}
function ke(i2) {
  var e2 = null == t ? void 0 : t.location.href;
  return !!(e2 && i2 && i2.some(((t2) => e2.match(t2))));
}
function Pe(t2) {
  var i2 = "";
  switch (typeof t2.className) {
    case "string":
      i2 = t2.className;
      break;
    case "object":
      i2 = (t2.className && "baseVal" in t2.className ? t2.className.baseVal : null) || t2.getAttribute("class") || "";
      break;
    default:
      i2 = "";
  }
  return Se(i2);
}
function Te(t2) {
  return j(t2) ? null : x(t2).split(/(\s+)/).filter(((t3) => Ke(t3))).join("").replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255);
}
function Ie(t2) {
  var i2 = "";
  return ze(t2) && !He(t2) && t2.childNodes && t2.childNodes.length && Ci(t2.childNodes, (function(t3) {
    var e2;
    Ee(t3) && t3.textContent && (i2 += null !== (e2 = Te(t3.textContent)) && void 0 !== e2 ? e2 : "");
  })), x(i2);
}
function Ce(t2) {
  return M(t2.target) ? t2.srcElement || null : null != (i2 = t2.target) && i2.shadowRoot ? t2.composedPath()[0] || null : t2.target || null;
  var i2;
}
var Re = ["a", "button", "form", "input", "select", "textarea", "label"];
function Fe(t2, i2) {
  if (M(i2)) return true;
  var e2, r2 = function(t3) {
    if (i2.some(((i3) => t3.matches(i3)))) return { v: true };
  };
  for (var s2 of t2) if (e2 = r2(s2)) return e2.v;
  return false;
}
function Me(t2) {
  var i2 = t2.parentNode;
  return !(!i2 || !we(i2)) && i2;
}
var Oe = ["next", "previous", "prev", ">", "<"];
var Ae = 10;
var De = [".ph-no-rageclick", ".ph-no-capture"];
function je(i2, e2) {
  if (!t || Le(i2)) return false;
  var r2, s2, n2;
  U(e2) ? (r2 = !!e2 && De, s2 = void 0) : (r2 = null !== (n2 = null == e2 ? void 0 : e2.css_selector_ignorelist) && void 0 !== n2 ? n2 : De, s2 = null == e2 ? void 0 : e2.content_ignorelist);
  if (false === r2) return false;
  var { targetElementList: o2 } = Ne(i2, false);
  return !(function(t2, i3) {
    if (false === t2 || M(t2)) return false;
    var e3;
    if (true === t2) e3 = Oe;
    else {
      if (!I(t2)) return false;
      if (t2.length > Ae) return $i.error("[PostHog] content_ignorelist array cannot exceed " + Ae + " items. Use css_selector_ignorelist for more complex matching."), false;
      e3 = t2.map(((t3) => t3.toLowerCase()));
    }
    return i3.some(((t3) => {
      var { safeText: i4, ariaLabel: r3 } = t3;
      return e3.some(((t4) => i4.includes(t4) || r3.includes(t4)));
    }));
  })(s2, o2.map(((t2) => {
    var i3;
    return { safeText: Ie(t2).toLowerCase(), ariaLabel: (null == (i3 = t2.getAttribute("aria-label")) ? void 0 : i3.toLowerCase().trim()) || "" };
  }))) && !Fe(o2, r2);
}
var Le = (t2) => !t2 || xe(t2, "html") || !we(t2);
var Ne = (i2, e2) => {
  if (!t || Le(i2)) return { parentIsUsefulElement: false, targetElementList: [] };
  for (var r2 = false, s2 = [i2], n2 = i2; n2.parentNode && !xe(n2, "body"); ) if ($e(n2.parentNode)) s2.push(n2.parentNode.host), n2 = n2.parentNode.host;
  else {
    var o2 = Me(n2);
    if (!o2) break;
    if (e2 || Re.indexOf(o2.tagName.toLowerCase()) > -1) r2 = true;
    else {
      var a2 = t.getComputedStyle(o2);
      a2 && "pointer" === a2.getPropertyValue("cursor") && (r2 = true);
    }
    s2.push(o2), n2 = o2;
  }
  return { parentIsUsefulElement: r2, targetElementList: s2 };
};
function Ue(i2, e2, r2, s2, n2) {
  var o2, a2, l2, u2;
  if (void 0 === r2 && (r2 = void 0), !t || Le(i2)) return false;
  if (null != (o2 = r2) && o2.url_allowlist && !ke(r2.url_allowlist)) return false;
  if (null != (a2 = r2) && a2.url_ignorelist && ke(r2.url_ignorelist)) return false;
  if (null != (l2 = r2) && l2.dom_event_allowlist) {
    var h3 = r2.dom_event_allowlist;
    if (h3 && !h3.some(((t2) => e2.type === t2))) return false;
  }
  var { parentIsUsefulElement: d2, targetElementList: v2 } = Ne(i2, s2);
  if (!(function(t2, i3) {
    var e3 = null == i3 ? void 0 : i3.element_allowlist;
    if (M(e3)) return true;
    var r3, s3 = function(t3) {
      if (e3.some(((i4) => t3.tagName.toLowerCase() === i4))) return { v: true };
    };
    for (var n3 of t2) if (r3 = s3(n3)) return r3.v;
    return false;
  })(v2, r2)) return false;
  if (!Fe(v2, null == (u2 = r2) ? void 0 : u2.css_selector_allowlist)) return false;
  var c2 = t.getComputedStyle(i2);
  if (c2 && "pointer" === c2.getPropertyValue("cursor") && "click" === e2.type) return true;
  var f2 = i2.tagName.toLowerCase();
  switch (f2) {
    case "html":
      return false;
    case "form":
      return (n2 || ["submit"]).indexOf(e2.type) >= 0;
    case "input":
    case "select":
    case "textarea":
      return (n2 || ["change", "click"]).indexOf(e2.type) >= 0;
    default:
      return d2 ? (n2 || ["click"]).indexOf(e2.type) >= 0 : (n2 || ["click"]).indexOf(e2.type) >= 0 && (Re.indexOf(f2) > -1 || "true" === i2.getAttribute("contenteditable"));
  }
}
function ze(t2) {
  for (var i2 = t2; i2.parentNode && !xe(i2, "body"); i2 = i2.parentNode) {
    var e2 = Pe(i2);
    if (w(e2, "ph-sensitive") || w(e2, "ph-no-capture")) return false;
  }
  if (w(Pe(t2), "ph-include")) return true;
  var r2 = t2.type || "";
  if (O(r2)) switch (r2.toLowerCase()) {
    case "hidden":
    case "password":
      return false;
  }
  var s2 = t2.name || t2.id || "";
  if (O(s2)) {
    if (/^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i.test(s2.replace(/[^a-zA-Z0-9]/g, ""))) return false;
  }
  return true;
}
function He(t2) {
  return !!(xe(t2, "input") && !["button", "checkbox", "submit", "reset"].includes(t2.type) || xe(t2, "select") || xe(t2, "textarea") || "true" === t2.getAttribute("contenteditable"));
}
var Be = "(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11})";
var qe = new RegExp("^(?:" + Be + ")$");
var We = new RegExp(Be);
var Ge = "\\d{3}-?\\d{2}-?\\d{4}";
var Ve = new RegExp("^(" + Ge + ")$");
var Je = new RegExp("(" + Ge + ")");
function Ke(t2, i2) {
  if (void 0 === i2 && (i2 = true), j(t2)) return false;
  if (O(t2)) {
    if (t2 = x(t2), (i2 ? qe : We).test((t2 || "").replace(/[- ]/g, ""))) return false;
    if ((i2 ? Ve : Je).test(t2)) return false;
  }
  return true;
}
function Ye(t2) {
  var i2 = Ie(t2);
  return Ke(i2 = (i2 + " " + Xe(t2)).trim()) ? i2 : "";
}
function Xe(t2) {
  var i2 = "";
  return t2 && t2.childNodes && t2.childNodes.length && Ci(t2.childNodes, (function(t3) {
    var e2;
    if (t3 && "span" === (null == (e2 = t3.tagName) ? void 0 : e2.toLowerCase())) try {
      var r2 = Ie(t3);
      i2 = (i2 + " " + r2).trim(), t3.childNodes && t3.childNodes.length && (i2 = (i2 + " " + Xe(t3)).trim());
    } catch (t4) {
      $i.error("[AutoCapture]", t4);
    }
  })), i2;
}
function Qe(t2) {
  return (function(t3) {
    var i2 = t3.map(((t4) => {
      var i3, e2, r2 = "";
      if (t4.tag_name && (r2 += t4.tag_name), t4.attr_class) for (var s2 of (t4.attr_class.sort(), t4.attr_class)) r2 += "." + s2.replace(/"/g, "");
      var n2 = g({}, t4.text ? { text: t4.text } : {}, { "nth-child": null !== (i3 = t4.nth_child) && void 0 !== i3 ? i3 : 0, "nth-of-type": null !== (e2 = t4.nth_of_type) && void 0 !== e2 ? e2 : 0 }, t4.href ? { href: t4.href } : {}, t4.attr_id ? { attr_id: t4.attr_id } : {}, t4.attributes), o2 = {};
      return Mi(n2).sort(((t5, i4) => {
        var [e3] = t5, [r3] = i4;
        return e3.localeCompare(r3);
      })).forEach(((t5) => {
        var [i4, e3] = t5;
        return o2[Ze(i4.toString())] = Ze(e3.toString());
      })), r2 += ":", r2 += Mi(o2).map(((t5) => {
        var [i4, e3] = t5;
        return i4 + '="' + e3 + '"';
      })).join("");
    }));
    return i2.join(";");
  })((function(t3) {
    return t3.map(((t4) => {
      var i2, e2, r2 = { text: null == (i2 = t4.$el_text) ? void 0 : i2.slice(0, 400), tag_name: t4.tag_name, href: null == (e2 = t4.attr__href) ? void 0 : e2.slice(0, 2048), attr_class: tr(t4), attr_id: t4.attr__id, nth_child: t4.nth_child, nth_of_type: t4.nth_of_type, attributes: {} };
      return Mi(t4).filter(((t5) => {
        var [i3] = t5;
        return 0 === i3.indexOf("attr__");
      })).forEach(((t5) => {
        var [i3, e3] = t5;
        return r2.attributes[i3] = e3;
      })), r2;
    }));
  })(t2));
}
function Ze(t2) {
  return t2.replace(/"|\\"/g, '\\"');
}
function tr(t2) {
  var i2 = t2.attr__class;
  return i2 ? I(i2) ? i2 : Se(i2) : void 0;
}
var ir = class {
  constructor(t2) {
    this.disabled = false === t2;
    var i2 = R(t2) ? t2 : {};
    this.thresholdPx = i2.threshold_px || 30, this.timeoutMs = i2.timeout_ms || 1e3, this.clickCount = i2.click_count || 3, this.clicks = [];
  }
  isRageClick(t2, i2, e2) {
    if (this.disabled) return false;
    var r2 = this.clicks[this.clicks.length - 1];
    if (r2 && Math.abs(t2 - r2.x) + Math.abs(i2 - r2.y) < this.thresholdPx && e2 - r2.timestamp < this.timeoutMs) {
      if (this.clicks.push({ x: t2, y: i2, timestamp: e2 }), this.clicks.length === this.clickCount) return true;
    } else this.clicks = [{ x: t2, y: i2, timestamp: e2 }];
    return false;
  }
};
var er = (t2) => {
  var i2 = null == o ? void 0 : o.createElement("a");
  return M(i2) ? null : (i2.href = t2, i2);
};
var rr = function(t2, i2) {
  var e2, r2;
  void 0 === i2 && (i2 = "&");
  var s2 = [];
  return Ci(t2, (function(t3, i3) {
    M(t3) || M(i3) || "undefined" === i3 || (e2 = encodeURIComponent(((t4) => t4 instanceof File)(t3) ? t3.name : t3.toString()), r2 = encodeURIComponent(i3), s2[s2.length] = r2 + "=" + e2);
  })), s2.join(i2);
};
var sr = function(t2, i2) {
  for (var e2, r2 = ((t2.split("#")[0] || "").split(/\?(.*)/)[1] || "").replace(/^\?+/g, "").split("&"), s2 = 0; s2 < r2.length; s2++) {
    var n2 = r2[s2].split("=");
    if (n2[0] === i2) {
      e2 = n2;
      break;
    }
  }
  if (!I(e2) || e2.length < 2) return "";
  var o2 = e2[1];
  try {
    o2 = decodeURIComponent(o2);
  } catch (t3) {
    $i.error("Skipping decoding for malformed query param: " + o2);
  }
  return o2.replace(/\+/g, " ");
};
var nr = function(t2, i2, e2) {
  if (!t2 || !i2 || !i2.length) return t2;
  for (var r2 = t2.split("#"), s2 = r2[0] || "", n2 = r2[1], o2 = s2.split("?"), a2 = o2[1], l2 = o2[0], u2 = (a2 || "").split("&"), h3 = [], d2 = 0; d2 < u2.length; d2++) {
    var v2 = u2[d2].split("=");
    I(v2) && (i2.includes(v2[0]) ? h3.push(v2[0] + "=" + e2) : h3.push(u2[d2]));
  }
  var c2 = l2;
  return null != a2 && (c2 += "?" + h3.join("&")), null != n2 && (c2 += "#" + n2), c2;
};
var or = function(t2, i2) {
  var e2 = t2.match(new RegExp(i2 + "=([^&]*)"));
  return e2 ? e2[1] : null;
};
var ar = "$copy_autocapture";
var lr = Si("[AutoCapture]");
function ur(t2, i2) {
  return i2.length > t2 ? i2.slice(0, t2) + "..." : i2;
}
function hr(t2) {
  if (t2.previousElementSibling) return t2.previousElementSibling;
  var i2 = t2;
  do {
    i2 = i2.previousSibling;
  } while (i2 && !we(i2));
  return i2;
}
function dr(t2, i2, e2, r2) {
  var s2 = t2.tagName.toLowerCase(), n2 = { tag_name: s2 };
  Re.indexOf(s2) > -1 && !e2 && ("a" === s2.toLowerCase() || "button" === s2.toLowerCase() ? n2.$el_text = ur(1024, Ye(t2)) : n2.$el_text = ur(1024, Ie(t2)));
  var o2 = Pe(t2);
  o2.length > 0 && (n2.classes = o2.filter((function(t3) {
    return "" !== t3;
  }))), Ci(t2.attributes, (function(e3) {
    var s3;
    if ((!He(t2) || -1 !== ["name", "id", "class", "aria-label"].indexOf(e3.name)) && ((null == r2 || !r2.includes(e3.name)) && !i2 && Ke(e3.value) && (s3 = e3.name, !O(s3) || "_ngcontent" !== s3.substring(0, 10) && "_nghost" !== s3.substring(0, 7)))) {
      var o3 = e3.value;
      "class" === e3.name && (o3 = Se(o3).join(" ")), n2["attr__" + e3.name] = ur(1024, o3);
    }
  }));
  for (var a2 = 1, l2 = 1, u2 = t2; u2 = hr(u2); ) a2++, u2.tagName === t2.tagName && l2++;
  return n2.nth_child = a2, n2.nth_of_type = l2, n2;
}
function vr(i2, e2) {
  for (var r2, s2, { e: n2, maskAllElementAttributes: o2, maskAllText: a2, elementAttributeIgnoreList: l2, elementsChainAsString: u2 } = e2, h3 = [i2], d2 = i2; d2.parentNode && !xe(d2, "body"); ) $e(d2.parentNode) ? (h3.push(d2.parentNode.host), d2 = d2.parentNode.host) : (h3.push(d2.parentNode), d2 = d2.parentNode);
  var v2, c2 = [], f2 = {}, p2 = false, g2 = false;
  if (Ci(h3, ((t2) => {
    var i3 = ze(t2);
    "a" === t2.tagName.toLowerCase() && (p2 = t2.getAttribute("href"), p2 = i3 && p2 && Ke(p2) && p2), w(Pe(t2), "ph-no-capture") && (g2 = true), c2.push(dr(t2, o2, a2, l2));
    var e3 = (function(t3) {
      if (!ze(t3)) return {};
      var i4 = {};
      return Ci(t3.attributes, (function(t4) {
        if (t4.name && 0 === t4.name.indexOf("data-ph-capture-attribute")) {
          var e4 = t4.name.replace("data-ph-capture-attribute-", ""), r3 = t4.value;
          e4 && r3 && Ke(r3) && (i4[e4] = r3);
        }
      })), i4;
    })(t2);
    Ri(f2, e3);
  })), g2) return { props: {}, explicitNoCapture: g2 };
  if (a2 || ("a" === i2.tagName.toLowerCase() || "button" === i2.tagName.toLowerCase() ? c2[0].$el_text = Ye(i2) : c2[0].$el_text = Ie(i2)), p2) {
    var _2, m2;
    c2[0].attr__href = p2;
    var y2 = null == (_2 = er(p2)) ? void 0 : _2.host, b2 = null == t || null == (m2 = t.location) ? void 0 : m2.host;
    y2 && b2 && y2 !== b2 && (v2 = p2);
  }
  return { props: Ri({ $event_type: n2.type, $ce_version: 1 }, u2 ? {} : { $elements: c2 }, { $elements_chain: Qe(c2) }, null != (r2 = c2[0]) && r2.$el_text ? { $el_text: null == (s2 = c2[0]) ? void 0 : s2.$el_text } : {}, v2 && "click" === n2.type ? { $external_click_url: v2 } : {}, f2) };
}
var cr = class {
  constructor(t2) {
    this.P = false, this.T = null, this.I = false, this.instance = t2, this.rageclicks = new ir(t2.config.rageclick), this.C = null;
  }
  get R() {
    var t2, i2, e2 = R(this.instance.config.autocapture) ? this.instance.config.autocapture : {};
    return e2.url_allowlist = null == (t2 = e2.url_allowlist) ? void 0 : t2.map(((t3) => new RegExp(t3))), e2.url_ignorelist = null == (i2 = e2.url_ignorelist) ? void 0 : i2.map(((t3) => new RegExp(t3))), e2;
  }
  F() {
    if (this.isBrowserSupported()) {
      if (t && o) {
        var i2 = (i3) => {
          i3 = i3 || (null == t ? void 0 : t.event);
          try {
            this.M(i3);
          } catch (t2) {
            lr.error("Failed to capture event", t2);
          }
        };
        if (zi(o, "submit", i2, { capture: true }), zi(o, "change", i2, { capture: true }), zi(o, "click", i2, { capture: true }), this.R.capture_copied_text) {
          var e2 = (i3) => {
            i3 = i3 || (null == t ? void 0 : t.event), this.M(i3, ar);
          };
          zi(o, "copy", e2, { capture: true }), zi(o, "cut", e2, { capture: true });
        }
      }
    } else lr.info("Disabling Automatic Event Collection because this browser is not supported");
  }
  startIfEnabled() {
    this.isEnabled && !this.P && (this.F(), this.P = true);
  }
  onRemoteConfig(t2) {
    t2.elementsChainAsString && (this.I = t2.elementsChainAsString), this.instance.persistence && this.instance.persistence.register({ [Wi]: !!t2.autocapture_opt_out }), this.T = !!t2.autocapture_opt_out, this.startIfEnabled();
  }
  setElementSelectors(t2) {
    this.C = t2;
  }
  getElementSelectors(t2) {
    var i2, e2 = [];
    return null == (i2 = this.C) || i2.forEach(((i3) => {
      var r2 = null == o ? void 0 : o.querySelectorAll(i3);
      null == r2 || r2.forEach(((r3) => {
        t2 === r3 && e2.push(i3);
      }));
    })), e2;
  }
  get isEnabled() {
    var t2, i2, e2 = null == (t2 = this.instance.persistence) ? void 0 : t2.props[Wi], r2 = this.T;
    if (D(r2) && !U(e2) && !this.instance.O()) return false;
    var s2 = null !== (i2 = this.T) && void 0 !== i2 ? i2 : !!e2;
    return !!this.instance.config.autocapture && !s2;
  }
  M(i2, e2) {
    if (void 0 === e2 && (e2 = "$autocapture"), this.isEnabled) {
      var r2, s2 = Ce(i2);
      if (Ee(s2) && (s2 = s2.parentNode || null), "$autocapture" === e2 && "click" === i2.type && i2 instanceof MouseEvent) this.instance.config.rageclick && null != (r2 = this.rageclicks) && r2.isRageClick(i2.clientX, i2.clientY, i2.timeStamp || (/* @__PURE__ */ new Date()).getTime()) && je(s2, this.instance.config.rageclick) && this.M(i2, "$rageclick");
      var n2 = e2 === ar;
      if (s2 && Ue(s2, i2, this.R, n2, n2 ? ["copy", "cut"] : void 0)) {
        var { props: o2, explicitNoCapture: a2 } = vr(s2, { e: i2, maskAllElementAttributes: this.instance.config.mask_all_element_attributes, maskAllText: this.instance.config.mask_all_text, elementAttributeIgnoreList: this.R.element_attribute_ignorelist, elementsChainAsString: this.I });
        if (a2) return false;
        var l2 = this.getElementSelectors(s2);
        if (l2 && l2.length > 0 && (o2.$element_selectors = l2), e2 === ar) {
          var u2, h3 = Te(null == t || null == (u2 = t.getSelection()) ? void 0 : u2.toString()), d2 = i2.type || "clipboard";
          if (!h3) return false;
          o2.$selected_content = h3, o2.$copy_type = d2;
        }
        return this.instance.capture(e2, o2), true;
      }
    }
  }
  isBrowserSupported() {
    return C(null == o ? void 0 : o.querySelectorAll);
  }
};
Math.trunc || (Math.trunc = function(t2) {
  return t2 < 0 ? Math.ceil(t2) : Math.floor(t2);
}), Number.isInteger || (Number.isInteger = function(t2) {
  return L(t2) && isFinite(t2) && Math.floor(t2) === t2;
});
var fr = "0123456789abcdef";
var pr = class _pr {
  constructor(t2) {
    if (this.bytes = t2, 16 !== t2.length) throw new TypeError("not 128-bit length");
  }
  static fromFieldsV7(t2, i2, e2, r2) {
    if (!Number.isInteger(t2) || !Number.isInteger(i2) || !Number.isInteger(e2) || !Number.isInteger(r2) || t2 < 0 || i2 < 0 || e2 < 0 || r2 < 0 || t2 > 281474976710655 || i2 > 4095 || e2 > 1073741823 || r2 > 4294967295) throw new RangeError("invalid field value");
    var s2 = new Uint8Array(16);
    return s2[0] = t2 / Math.pow(2, 40), s2[1] = t2 / Math.pow(2, 32), s2[2] = t2 / Math.pow(2, 24), s2[3] = t2 / Math.pow(2, 16), s2[4] = t2 / Math.pow(2, 8), s2[5] = t2, s2[6] = 112 | i2 >>> 8, s2[7] = i2, s2[8] = 128 | e2 >>> 24, s2[9] = e2 >>> 16, s2[10] = e2 >>> 8, s2[11] = e2, s2[12] = r2 >>> 24, s2[13] = r2 >>> 16, s2[14] = r2 >>> 8, s2[15] = r2, new _pr(s2);
  }
  toString() {
    for (var t2 = "", i2 = 0; i2 < this.bytes.length; i2++) t2 = t2 + fr.charAt(this.bytes[i2] >>> 4) + fr.charAt(15 & this.bytes[i2]), 3 !== i2 && 5 !== i2 && 7 !== i2 && 9 !== i2 || (t2 += "-");
    if (36 !== t2.length) throw new Error("Invalid UUIDv7 was generated");
    return t2;
  }
  clone() {
    return new _pr(this.bytes.slice(0));
  }
  equals(t2) {
    return 0 === this.compareTo(t2);
  }
  compareTo(t2) {
    for (var i2 = 0; i2 < 16; i2++) {
      var e2 = this.bytes[i2] - t2.bytes[i2];
      if (0 !== e2) return Math.sign(e2);
    }
    return 0;
  }
};
var gr = class {
  constructor() {
    this.A = 0, this.D = 0, this.j = new yr();
  }
  generate() {
    var t2 = this.generateOrAbort();
    if (M(t2)) {
      this.A = 0;
      var i2 = this.generateOrAbort();
      if (M(i2)) throw new Error("Could not generate UUID after timestamp reset");
      return i2;
    }
    return t2;
  }
  generateOrAbort() {
    var t2 = Date.now();
    if (t2 > this.A) this.A = t2, this.L();
    else {
      if (!(t2 + 1e4 > this.A)) return;
      this.D++, this.D > 4398046511103 && (this.A++, this.L());
    }
    return pr.fromFieldsV7(this.A, Math.trunc(this.D / Math.pow(2, 30)), this.D & Math.pow(2, 30) - 1, this.j.nextUint32());
  }
  L() {
    this.D = 1024 * this.j.nextUint32() + (1023 & this.j.nextUint32());
  }
};
var _r;
var mr = (t2) => {
  if ("undefined" != typeof UUIDV7_DENY_WEAK_RNG && UUIDV7_DENY_WEAK_RNG) throw new Error("no cryptographically strong RNG available");
  for (var i2 = 0; i2 < t2.length; i2++) t2[i2] = 65536 * Math.trunc(65536 * Math.random()) + Math.trunc(65536 * Math.random());
  return t2;
};
t && !M(t.crypto) && crypto.getRandomValues && (mr = (t2) => crypto.getRandomValues(t2));
var yr = class {
  constructor() {
    this.N = new Uint32Array(8), this.U = 1 / 0;
  }
  nextUint32() {
    return this.U >= this.N.length && (mr(this.N), this.U = 0), this.N[this.U++];
  }
};
var br = () => wr().toString();
var wr = () => (_r || (_r = new gr())).generate();
var xr = "";
var Er = /[a-z0-9][a-z0-9-]+\.[a-z]{2,}$/i;
function $r(t2, i2) {
  if (i2) {
    var e2 = (function(t3, i3) {
      if (void 0 === i3 && (i3 = o), xr) return xr;
      if (!i3) return "";
      if (["localhost", "127.0.0.1"].includes(t3)) return "";
      for (var e3 = t3.split("."), r3 = Math.min(e3.length, 8), s2 = "dmn_chk_" + br(); !xr && r3--; ) {
        var n2 = e3.slice(r3).join("."), a2 = s2 + "=1;domain=." + n2 + ";path=/";
        i3.cookie = a2 + ";max-age=3", i3.cookie.includes(s2) && (i3.cookie = a2 + ";max-age=0", xr = n2);
      }
      return xr;
    })(t2);
    if (!e2) {
      var r2 = ((t3) => {
        var i3 = t3.match(Er);
        return i3 ? i3[0] : "";
      })(t2);
      r2 !== e2 && $i.info("Warning: cookie subdomain discovery mismatch", r2, e2), e2 = r2;
    }
    return e2 ? "; domain=." + e2 : "";
  }
  return "";
}
var Sr = { H: () => !!o, B: function(t2) {
  $i.error("cookieStore error: " + t2);
}, q: function(t2) {
  if (o) {
    try {
      for (var i2 = t2 + "=", e2 = o.cookie.split(";").filter(((t3) => t3.length)), r2 = 0; r2 < e2.length; r2++) {
        for (var s2 = e2[r2]; " " == s2.charAt(0); ) s2 = s2.substring(1, s2.length);
        if (0 === s2.indexOf(i2)) return decodeURIComponent(s2.substring(i2.length, s2.length));
      }
    } catch (t3) {
    }
    return null;
  }
}, W: function(t2) {
  var i2;
  try {
    i2 = JSON.parse(Sr.q(t2)) || {};
  } catch (t3) {
  }
  return i2;
}, G: function(t2, i2, e2, r2, s2) {
  if (o) try {
    var n2 = "", a2 = "", l2 = $r(o.location.hostname, r2);
    if (e2) {
      var u2 = /* @__PURE__ */ new Date();
      u2.setTime(u2.getTime() + 24 * e2 * 60 * 60 * 1e3), n2 = "; expires=" + u2.toUTCString();
    }
    s2 && (a2 = "; secure");
    var h3 = t2 + "=" + encodeURIComponent(JSON.stringify(i2)) + n2 + "; SameSite=Lax; path=/" + l2 + a2;
    return h3.length > 3686.4 && $i.warn("cookieStore warning: large cookie, len=" + h3.length), o.cookie = h3, h3;
  } catch (t3) {
    return;
  }
}, V: function(t2, i2) {
  if (null != o && o.cookie) try {
    Sr.G(t2, "", -1, i2);
  } catch (t3) {
    return;
  }
} };
var kr = null;
var Pr = { H: function() {
  if (!D(kr)) return kr;
  var i2 = true;
  if (M(t)) i2 = false;
  else try {
    var e2 = "__mplssupport__";
    Pr.G(e2, "xyz"), '"xyz"' !== Pr.q(e2) && (i2 = false), Pr.V(e2);
  } catch (t2) {
    i2 = false;
  }
  return i2 || $i.error("localStorage unsupported; falling back to cookie store"), kr = i2, i2;
}, B: function(t2) {
  $i.error("localStorage error: " + t2);
}, q: function(i2) {
  try {
    return null == t ? void 0 : t.localStorage.getItem(i2);
  } catch (t2) {
    Pr.B(t2);
  }
  return null;
}, W: function(t2) {
  try {
    return JSON.parse(Pr.q(t2)) || {};
  } catch (t3) {
  }
  return null;
}, G: function(i2, e2) {
  try {
    null == t || t.localStorage.setItem(i2, JSON.stringify(e2));
  } catch (t2) {
    Pr.B(t2);
  }
}, V: function(i2) {
  try {
    null == t || t.localStorage.removeItem(i2);
  } catch (t2) {
    Pr.B(t2);
  }
} };
var Tr = ["$device_id", "distinct_id", ie, ee, ge, pe];
var Ir = {};
var Cr = { H: function() {
  return true;
}, B: function(t2) {
  $i.error("memoryStorage error: " + t2);
}, q: function(t2) {
  return Ir[t2] || null;
}, W: function(t2) {
  return Ir[t2] || null;
}, G: function(t2, i2) {
  Ir[t2] = i2;
}, V: function(t2) {
  delete Ir[t2];
} };
var Rr = null;
var Fr = { H: function() {
  if (!D(Rr)) return Rr;
  if (Rr = true, M(t)) Rr = false;
  else try {
    var i2 = "__support__";
    Fr.G(i2, "xyz"), '"xyz"' !== Fr.q(i2) && (Rr = false), Fr.V(i2);
  } catch (t2) {
    Rr = false;
  }
  return Rr;
}, B: function(t2) {
  $i.error("sessionStorage error: ", t2);
}, q: function(i2) {
  try {
    return null == t ? void 0 : t.sessionStorage.getItem(i2);
  } catch (t2) {
    Fr.B(t2);
  }
  return null;
}, W: function(t2) {
  try {
    return JSON.parse(Fr.q(t2)) || null;
  } catch (t3) {
  }
  return null;
}, G: function(i2, e2) {
  try {
    null == t || t.sessionStorage.setItem(i2, JSON.stringify(e2));
  } catch (t2) {
    Fr.B(t2);
  }
}, V: function(i2) {
  try {
    null == t || t.sessionStorage.removeItem(i2);
  } catch (t2) {
    Fr.B(t2);
  }
} };
var Mr = (function(t2) {
  return t2[t2.PENDING = -1] = "PENDING", t2[t2.DENIED = 0] = "DENIED", t2[t2.GRANTED = 1] = "GRANTED", t2;
})({});
var Or = class {
  constructor(t2) {
    this._instance = t2;
  }
  get R() {
    return this._instance.config;
  }
  get consent() {
    return this.J() ? Mr.DENIED : this.K;
  }
  isOptedOut() {
    return "always" === this.R.cookieless_mode || (this.consent === Mr.DENIED || this.consent === Mr.PENDING && (this.R.opt_out_capturing_by_default || "on_reject" === this.R.cookieless_mode));
  }
  isOptedIn() {
    return !this.isOptedOut();
  }
  isExplicitlyOptedOut() {
    return this.consent === Mr.DENIED;
  }
  optInOut(t2) {
    this.Y.G(this.X, t2 ? 1 : 0, this.R.cookie_expiration, this.R.cross_subdomain_cookie, this.R.secure_cookie);
  }
  reset() {
    this.Y.V(this.X, this.R.cross_subdomain_cookie);
  }
  get X() {
    var { token: t2, opt_out_capturing_cookie_prefix: i2, consent_persistence_name: e2 } = this._instance.config;
    return e2 || (i2 ? i2 + t2 : "__ph_opt_in_out_" + t2);
  }
  get K() {
    var t2 = this.Y.q(this.X);
    return V(t2) ? Mr.GRANTED : w(J, t2) ? Mr.DENIED : Mr.PENDING;
  }
  get Y() {
    if (!this.Z) {
      var t2 = this.R.opt_out_capturing_persistence_type;
      this.Z = "localStorage" === t2 ? Pr : Sr;
      var i2 = "localStorage" === t2 ? Sr : Pr;
      i2.q(this.X) && (this.Z.q(this.X) || this.optInOut(V(i2.q(this.X))), i2.V(this.X, this.R.cross_subdomain_cookie));
    }
    return this.Z;
  }
  J() {
    return !!this.R.respect_dnt && !!Ui([null == n ? void 0 : n.doNotTrack, null == n ? void 0 : n.msDoNotTrack, v.doNotTrack], ((t2) => V(t2)));
  }
};
var Ar = Si("[Dead Clicks]");
var Dr = () => true;
var jr = (t2) => {
  var i2, e2 = !(null == (i2 = t2.instance.persistence) || !i2.get_property(Xi)), r2 = t2.instance.config.capture_dead_clicks;
  return U(r2) ? r2 : !!R(r2) || e2;
};
var Lr = class {
  get lazyLoadedDeadClicksAutocapture() {
    return this.tt;
  }
  constructor(t2, i2, e2) {
    this.instance = t2, this.isEnabled = i2, this.onCapture = e2, this.startIfEnabled();
  }
  onRemoteConfig(t2) {
    this.instance.persistence && this.instance.persistence.register({ [Xi]: null == t2 ? void 0 : t2.captureDeadClicks }), this.startIfEnabled();
  }
  startIfEnabled() {
    this.isEnabled(this) && this.it((() => {
      this.et();
    }));
  }
  it(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.initDeadClicksAutocapture && t2(), null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this.instance, "dead-clicks-autocapture", ((i3) => {
      i3 ? Ar.error("failed to load script", i3) : t2();
    }));
  }
  et() {
    var t2;
    if (o) {
      if (!this.tt && null != (t2 = v.__PosthogExtensions__) && t2.initDeadClicksAutocapture) {
        var i2 = R(this.instance.config.capture_dead_clicks) ? this.instance.config.capture_dead_clicks : {};
        i2.__onCapture = this.onCapture, this.tt = v.__PosthogExtensions__.initDeadClicksAutocapture(this.instance, i2), this.tt.start(o), Ar.info("starting...");
      }
    } else Ar.error("`document` not found. Cannot start.");
  }
  stop() {
    this.tt && (this.tt.stop(), this.tt = void 0, Ar.info("stopping..."));
  }
};
var Nr = Si("[ExceptionAutocapture]");
var Ur = class {
  constructor(i2) {
    var e2, r2, s2;
    this.rt = () => {
      var i3;
      if (t && this.isEnabled && null != (i3 = v.__PosthogExtensions__) && i3.errorWrappingFunctions) {
        var e3 = v.__PosthogExtensions__.errorWrappingFunctions.wrapOnError, r3 = v.__PosthogExtensions__.errorWrappingFunctions.wrapUnhandledRejection, s3 = v.__PosthogExtensions__.errorWrappingFunctions.wrapConsoleError;
        try {
          !this.st && this.R.capture_unhandled_errors && (this.st = e3(this.captureException.bind(this))), !this.nt && this.R.capture_unhandled_rejections && (this.nt = r3(this.captureException.bind(this))), !this.ot && this.R.capture_console_errors && (this.ot = s3(this.captureException.bind(this)));
        } catch (t2) {
          Nr.error("failed to start", t2), this.ut();
        }
      }
    }, this._instance = i2, this.ht = !(null == (e2 = this._instance.persistence) || !e2.props[Vi]), this.dt = new Y({ refillRate: null !== (r2 = this._instance.config.error_tracking.__exceptionRateLimiterRefillRate) && void 0 !== r2 ? r2 : 1, bucketSize: null !== (s2 = this._instance.config.error_tracking.__exceptionRateLimiterBucketSize) && void 0 !== s2 ? s2 : 10, refillInterval: 1e4, h: Nr }), this.R = this.vt(), this.startIfEnabledOrStop();
  }
  vt() {
    var t2 = this._instance.config.capture_exceptions, i2 = { capture_unhandled_errors: false, capture_unhandled_rejections: false, capture_console_errors: false };
    return R(t2) ? i2 = g({}, i2, t2) : (M(t2) ? this.ht : t2) && (i2 = g({}, i2, { capture_unhandled_errors: true, capture_unhandled_rejections: true })), i2;
  }
  get isEnabled() {
    return this.R.capture_console_errors || this.R.capture_unhandled_errors || this.R.capture_unhandled_rejections;
  }
  startIfEnabledOrStop() {
    this.isEnabled ? (Nr.info("enabled"), this.ut(), this.it(this.rt)) : this.ut();
  }
  it(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.errorWrappingFunctions && t2(), null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, "exception-autocapture", ((i3) => {
      if (i3) return Nr.error("failed to load script", i3);
      t2();
    }));
  }
  ut() {
    var t2, i2, e2;
    null == (t2 = this.st) || t2.call(this), this.st = void 0, null == (i2 = this.nt) || i2.call(this), this.nt = void 0, null == (e2 = this.ot) || e2.call(this), this.ot = void 0;
  }
  onRemoteConfig(t2) {
    var i2 = t2.autocaptureExceptions;
    this.ht = !!i2 || false, this._instance.persistence && this._instance.persistence.register({ [Vi]: this.ht }), this.R = this.vt(), this.startIfEnabledOrStop();
  }
  onConfigChange() {
    this.R = this.vt();
  }
  captureException(t2) {
    var i2, e2, r2 = null !== (i2 = null == t2 || null == (e2 = t2.$exception_list) || null == (e2 = e2[0]) ? void 0 : e2.type) && void 0 !== i2 ? i2 : "Exception";
    this.dt.consumeRateLimit(r2) ? Nr.info("Skipping exception capture because of client rate limiting.", { exception: r2 }) : this._instance.exceptions.sendExceptionEvent(t2);
  }
};
function zr(t2, i2, e2) {
  try {
    if (!(i2 in t2)) return () => {
    };
    var r2 = t2[i2], s2 = e2(r2);
    return C(s2) && (s2.prototype = s2.prototype || {}, Object.defineProperties(s2, { __posthog_wrapped__: { enumerable: false, value: true } })), t2[i2] = s2, () => {
      t2[i2] = r2;
    };
  } catch (t3) {
    return () => {
    };
  }
}
var Hr = class {
  constructor(i2) {
    var e2;
    this._instance = i2, this.ct = (null == t || null == (e2 = t.location) ? void 0 : e2.pathname) || "";
  }
  get isEnabled() {
    return "history_change" === this._instance.config.capture_pageview;
  }
  startIfEnabled() {
    this.isEnabled && ($i.info("History API monitoring enabled, starting..."), this.monitorHistoryChanges());
  }
  stop() {
    this.ft && this.ft(), this.ft = void 0, $i.info("History API monitoring stopped");
  }
  monitorHistoryChanges() {
    var i2, e2;
    if (t && t.history) {
      var r2 = this;
      null != (i2 = t.history.pushState) && i2.__posthog_wrapped__ || zr(t.history, "pushState", ((t2) => function(i3, e3, s2) {
        t2.call(this, i3, e3, s2), r2._t("pushState");
      })), null != (e2 = t.history.replaceState) && e2.__posthog_wrapped__ || zr(t.history, "replaceState", ((t2) => function(i3, e3, s2) {
        t2.call(this, i3, e3, s2), r2._t("replaceState");
      })), this.yt();
    }
  }
  _t(i2) {
    try {
      var e2, r2 = null == t || null == (e2 = t.location) ? void 0 : e2.pathname;
      if (!r2) return;
      r2 !== this.ct && this.isEnabled && this._instance.capture("$pageview", { navigation_type: i2 }), this.ct = r2;
    } catch (t2) {
      $i.error("Error capturing " + i2 + " pageview", t2);
    }
  }
  yt() {
    if (!this.ft) {
      var i2 = () => {
        this._t("popstate");
      };
      zi(t, "popstate", i2), this.ft = () => {
        t && t.removeEventListener("popstate", i2);
      };
    }
  }
};
var Br = Si("[SegmentIntegration]");
function qr(t2, i2) {
  var e2 = t2.config.segment;
  if (!e2) return i2();
  !(function(t3, i3) {
    var e3 = t3.config.segment;
    if (!e3) return i3();
    var r2 = (e4) => {
      var r3 = () => e4.anonymousId() || br();
      t3.config.get_device_id = r3, e4.id() && (t3.register({ distinct_id: e4.id(), $device_id: r3() }), t3.persistence.set_property(he, "identified")), i3();
    }, s2 = e3.user();
    "then" in s2 && C(s2.then) ? s2.then(r2) : r2(s2);
  })(t2, (() => {
    e2.register(((t3) => {
      Promise && Promise.resolve || Br.warn("This browser does not have Promise support, and can not use the segment integration");
      var i3 = (i4, e3) => {
        if (!e3) return i4;
        i4.event.userId || i4.event.anonymousId === t3.get_distinct_id() || (Br.info("No userId set, resetting PostHog"), t3.reset()), i4.event.userId && i4.event.userId !== t3.get_distinct_id() && (Br.info("UserId set, identifying with PostHog"), t3.identify(i4.event.userId));
        var r2 = t3.calculateEventProperties(e3, i4.event.properties);
        return i4.event.properties = Object.assign({}, r2, i4.event.properties), i4;
      };
      return { name: "PostHog JS", type: "enrichment", version: "1.0.0", isLoaded: () => true, load: () => Promise.resolve(), track: (t4) => i3(t4, t4.event.event), page: (t4) => i3(t4, "$pageview"), identify: (t4) => i3(t4, "$identify"), screen: (t4) => i3(t4, "$screen") };
    })(t2)).then((() => {
      i2();
    }));
  }));
}
var Wr = "posthog-js";
function Gr(t2, i2) {
  var { organization: e2, projectId: r2, prefix: s2, severityAllowList: n2 = ["error"], sendExceptionsToPostHog: o2 = true } = void 0 === i2 ? {} : i2;
  return (i3) => {
    var a2, l2, u2, h3, d2;
    if (!("*" === n2 || n2.includes(i3.level)) || !t2.__loaded) return i3;
    i3.tags || (i3.tags = {});
    var v2 = t2.requestRouter.endpointFor("ui", "/project/" + t2.config.token + "/person/" + t2.get_distinct_id());
    i3.tags["PostHog Person URL"] = v2, t2.sessionRecordingStarted() && (i3.tags["PostHog Recording URL"] = t2.get_session_replay_url({ withTimestamp: true }));
    var c2 = (null == (a2 = i3.exception) ? void 0 : a2.values) || [], f2 = c2.map(((t3) => g({}, t3, { stacktrace: t3.stacktrace ? g({}, t3.stacktrace, { type: "raw", frames: (t3.stacktrace.frames || []).map(((t4) => g({}, t4, { platform: "web:javascript" }))) }) : void 0 }))), p2 = { $exception_message: (null == (l2 = c2[0]) ? void 0 : l2.value) || i3.message, $exception_type: null == (u2 = c2[0]) ? void 0 : u2.type, $exception_level: i3.level, $exception_list: f2, $sentry_event_id: i3.event_id, $sentry_exception: i3.exception, $sentry_exception_message: (null == (h3 = c2[0]) ? void 0 : h3.value) || i3.message, $sentry_exception_type: null == (d2 = c2[0]) ? void 0 : d2.type, $sentry_tags: i3.tags };
    return e2 && r2 && (p2.$sentry_url = (s2 || "https://sentry.io/organizations/") + e2 + "/issues/?project=" + r2 + "&query=" + i3.event_id), o2 && t2.exceptions.sendExceptionEvent(p2), i3;
  };
}
var Vr = class {
  constructor(t2, i2, e2, r2, s2, n2) {
    this.name = Wr, this.setupOnce = function(o2) {
      o2(Gr(t2, { organization: i2, projectId: e2, prefix: r2, severityAllowList: s2, sendExceptionsToPostHog: null == n2 || n2 }));
    };
  }
};
var Jr = null != t && t.location ? or(t.location.hash, "__posthog") || or(location.hash, "state") : null;
var Kr = "_postHogToolbarParams";
var Yr = Si("[Toolbar]");
var Xr = (function(t2) {
  return t2[t2.UNINITIALIZED = 0] = "UNINITIALIZED", t2[t2.LOADING = 1] = "LOADING", t2[t2.LOADED = 2] = "LOADED", t2;
})(Xr || {});
var Qr = class {
  constructor(t2) {
    this.instance = t2;
  }
  bt(t2) {
    v.ph_toolbar_state = t2;
  }
  wt() {
    var t2;
    return null !== (t2 = v.ph_toolbar_state) && void 0 !== t2 ? t2 : Xr.UNINITIALIZED;
  }
  maybeLoadToolbar(i2, e2, r2) {
    if (void 0 === i2 && (i2 = void 0), void 0 === e2 && (e2 = void 0), void 0 === r2 && (r2 = void 0), !t || !o) return false;
    i2 = null != i2 ? i2 : t.location, r2 = null != r2 ? r2 : t.history;
    try {
      if (!e2) {
        try {
          t.localStorage.setItem("test", "test"), t.localStorage.removeItem("test");
        } catch (t2) {
          return false;
        }
        e2 = null == t ? void 0 : t.localStorage;
      }
      var s2, n2 = Jr || or(i2.hash, "__posthog") || or(i2.hash, "state"), a2 = n2 ? Oi((() => JSON.parse(atob(decodeURIComponent(n2))))) || Oi((() => JSON.parse(decodeURIComponent(n2)))) : null;
      return a2 && "ph_authorize" === a2.action ? ((s2 = a2).source = "url", s2 && Object.keys(s2).length > 0 && (a2.desiredHash ? i2.hash = a2.desiredHash : r2 ? r2.replaceState(r2.state, "", i2.pathname + i2.search) : i2.hash = "")) : ((s2 = JSON.parse(e2.getItem(Kr) || "{}")).source = "localstorage", delete s2.userIntent), !(!s2.token || this.instance.config.token !== s2.token) && (this.loadToolbar(s2), true);
    } catch (t2) {
      return false;
    }
  }
  xt(t2) {
    var i2 = v.ph_load_toolbar || v.ph_load_editor;
    !j(i2) && C(i2) ? i2(t2, this.instance) : Yr.warn("No toolbar load function found");
  }
  loadToolbar(i2) {
    var e2 = !(null == o || !o.getElementById(_e));
    if (!t || e2) return false;
    var r2 = "custom" === this.instance.requestRouter.region && this.instance.config.advanced_disable_toolbar_metrics, s2 = g({ token: this.instance.config.token }, i2, { apiURL: this.instance.requestRouter.endpointFor("ui") }, r2 ? { instrument: false } : {});
    if (t.localStorage.setItem(Kr, JSON.stringify(g({}, s2, { source: void 0 }))), this.wt() === Xr.LOADED) this.xt(s2);
    else if (this.wt() === Xr.UNINITIALIZED) {
      var n2;
      this.bt(Xr.LOADING), null == (n2 = v.__PosthogExtensions__) || null == n2.loadExternalDependency || n2.loadExternalDependency(this.instance, "toolbar", ((t2) => {
        if (t2) return Yr.error("[Toolbar] Failed to load", t2), void this.bt(Xr.UNINITIALIZED);
        this.bt(Xr.LOADED), this.xt(s2);
      })), zi(t, "turbolinks:load", (() => {
        this.bt(Xr.UNINITIALIZED), this.loadToolbar(s2);
      }));
    }
    return true;
  }
  Et(t2) {
    return this.loadToolbar(t2);
  }
  maybeLoadEditor(t2, i2, e2) {
    return void 0 === t2 && (t2 = void 0), void 0 === i2 && (i2 = void 0), void 0 === e2 && (e2 = void 0), this.maybeLoadToolbar(t2, i2, e2);
  }
};
var Zr = Si("[TracingHeaders]");
var ts = class {
  constructor(t2) {
    this.$t = void 0, this.St = void 0, this.rt = () => {
      var t3, i2;
      M(this.$t) && (null == (t3 = v.__PosthogExtensions__) || null == (t3 = t3.tracingHeadersPatchFns) || t3._patchXHR(this._instance.config.__add_tracing_headers || [], this._instance.get_distinct_id(), this._instance.sessionManager));
      M(this.St) && (null == (i2 = v.__PosthogExtensions__) || null == (i2 = i2.tracingHeadersPatchFns) || i2._patchFetch(this._instance.config.__add_tracing_headers || [], this._instance.get_distinct_id(), this._instance.sessionManager));
    }, this._instance = t2;
  }
  it(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.tracingHeadersPatchFns && t2(), null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, "tracing-headers", ((i3) => {
      if (i3) return Zr.error("failed to load script", i3);
      t2();
    }));
  }
  startIfEnabledOrStop() {
    var t2, i2;
    this._instance.config.__add_tracing_headers ? this.it(this.rt) : (null == (t2 = this.$t) || t2.call(this), null == (i2 = this.St) || i2.call(this), this.$t = void 0, this.St = void 0);
  }
};
var is = "https?://(.*)";
var es = ["gclid", "gclsrc", "dclid", "gbraid", "wbraid", "fbclid", "msclkid", "twclid", "li_fat_id", "igshid", "ttclid", "rdt_cid", "epik", "qclid", "sccid", "irclid", "_kx"];
var rs = Fi(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source", "mc_cid"], es);
var ss = "<masked>";
var ns = ["li_fat_id"];
function os(t2, i2, e2) {
  if (!o) return {};
  var r2, s2 = i2 ? Fi([], es, e2 || []) : [], n2 = as(nr(o.URL, s2, ss), t2), a2 = (r2 = {}, Ci(ns, (function(t3) {
    var i3 = Sr.q(t3);
    r2[t3] = i3 || null;
  })), r2);
  return Ri(a2, n2);
}
function as(t2, i2) {
  var e2 = rs.concat(i2 || []), r2 = {};
  return Ci(e2, (function(i3) {
    var e3 = sr(t2, i3);
    r2[i3] = e3 || null;
  })), r2;
}
function ls(t2) {
  var i2 = (function(t3) {
    return t3 ? 0 === t3.search(is + "google.([^/?]*)") ? "google" : 0 === t3.search(is + "bing.com") ? "bing" : 0 === t3.search(is + "yahoo.com") ? "yahoo" : 0 === t3.search(is + "duckduckgo.com") ? "duckduckgo" : null : null;
  })(t2), e2 = "yahoo" != i2 ? "q" : "p", r2 = {};
  if (!D(i2)) {
    r2.$search_engine = i2;
    var s2 = o ? sr(o.referrer, e2) : "";
    s2.length && (r2.ph_keyword = s2);
  }
  return r2;
}
function us() {
  return navigator.language || navigator.userLanguage;
}
function hs() {
  return (null == o ? void 0 : o.referrer) || "$direct";
}
function ds(t2, i2) {
  var e2 = t2 ? Fi([], es, i2 || []) : [], r2 = null == a ? void 0 : a.href.substring(0, 1e3);
  return { r: hs().substring(0, 1e3), u: r2 ? nr(r2, e2, ss) : void 0 };
}
function vs(t2) {
  var i2, { r: e2, u: r2 } = t2, s2 = { $referrer: e2, $referring_domain: null == e2 ? void 0 : "$direct" == e2 ? "$direct" : null == (i2 = er(e2)) ? void 0 : i2.host };
  if (r2) {
    s2.$current_url = r2;
    var n2 = er(r2);
    s2.$host = null == n2 ? void 0 : n2.host, s2.$pathname = null == n2 ? void 0 : n2.pathname;
    var o2 = as(r2);
    Ri(s2, o2);
  }
  if (e2) {
    var a2 = ls(e2);
    Ri(s2, a2);
  }
  return s2;
}
function cs() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (t2) {
    return;
  }
}
function fs() {
  try {
    return (/* @__PURE__ */ new Date()).getTimezoneOffset();
  } catch (t2) {
    return;
  }
}
function ps(i2, e2) {
  if (!d) return {};
  var r2, s2, n2, o2 = i2 ? Fi([], es, e2 || []) : [], [l2, u2] = (function(t2) {
    for (var i3 = 0; i3 < Jt.length; i3++) {
      var [e3, r3] = Jt[i3], s3 = e3.exec(t2), n3 = s3 && (C(r3) ? r3(s3, t2) : r3);
      if (n3) return n3;
    }
    return ["", ""];
  })(d);
  return Ri(Di({ $os: l2, $os_version: u2, $browser: Wt(d, navigator.vendor), $device: Kt(d), $device_type: (s2 = d, n2 = Kt(s2), n2 === et || n2 === it || "Kobo" === n2 || "Kindle Fire" === n2 || n2 === Ft ? tt : n2 === wt || n2 === Et || n2 === xt || n2 === It ? "Console" : n2 === st ? "Wearable" : n2 ? X : "Desktop"), $timezone: cs(), $timezone_offset: fs() }), { $current_url: nr(null == a ? void 0 : a.href, o2, ss), $host: null == a ? void 0 : a.host, $pathname: null == a ? void 0 : a.pathname, $raw_user_agent: d.length > 1e3 ? d.substring(0, 997) + "..." : d, $browser_version: Vt(d, navigator.vendor), $browser_language: us(), $browser_language_prefix: (r2 = us(), "string" == typeof r2 ? r2.split("-")[0] : void 0), $screen_height: null == t ? void 0 : t.screen.height, $screen_width: null == t ? void 0 : t.screen.width, $viewport_height: null == t ? void 0 : t.innerHeight, $viewport_width: null == t ? void 0 : t.innerWidth, $lib: "web", $lib_version: c.LIB_VERSION, $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10), $time: Date.now() / 1e3 });
}
var gs = Si("[Web Vitals]");
var _s = 9e5;
var ms = class {
  constructor(t2) {
    var i2;
    this.kt = false, this.P = false, this.N = { url: void 0, metrics: [], firstMetricTimestamp: void 0 }, this.Pt = () => {
      clearTimeout(this.Tt), 0 !== this.N.metrics.length && (this._instance.capture("$web_vitals", this.N.metrics.reduce(((t3, i3) => g({}, t3, { ["$web_vitals_" + i3.name + "_event"]: g({}, i3), ["$web_vitals_" + i3.name + "_value"]: i3.value })), {})), this.N = { url: void 0, metrics: [], firstMetricTimestamp: void 0 });
    }, this.It = (t3) => {
      var i3, e2 = null == (i3 = this._instance.sessionManager) ? void 0 : i3.checkAndGetSessionAndWindowId(true);
      if (M(e2)) gs.error("Could not read session ID. Dropping metrics!");
      else {
        this.N = this.N || { url: void 0, metrics: [], firstMetricTimestamp: void 0 };
        var r2 = this.Ct();
        if (!M(r2)) if (j(null == t3 ? void 0 : t3.name) || j(null == t3 ? void 0 : t3.value)) gs.error("Invalid metric received", t3);
        else if (this.Rt && t3.value >= this.Rt) gs.error("Ignoring metric with value >= " + this.Rt, t3);
        else this.N.url !== r2 && (this.Pt(), this.Tt = setTimeout(this.Pt, this.flushToCaptureTimeoutMs)), M(this.N.url) && (this.N.url = r2), this.N.firstMetricTimestamp = M(this.N.firstMetricTimestamp) ? Date.now() : this.N.firstMetricTimestamp, t3.attribution && t3.attribution.interactionTargetElement && (t3.attribution.interactionTargetElement = void 0), this.N.metrics.push(g({}, t3, { $current_url: r2, $session_id: e2.sessionId, $window_id: e2.windowId, timestamp: Date.now() })), this.N.metrics.length === this.allowedMetrics.length && this.Pt();
      }
    }, this.rt = () => {
      var t3, i3, e2, r2, s2 = v.__PosthogExtensions__;
      M(s2) || M(s2.postHogWebVitalsCallbacks) || ({ onLCP: t3, onCLS: i3, onFCP: e2, onINP: r2 } = s2.postHogWebVitalsCallbacks), t3 && i3 && e2 && r2 ? (this.allowedMetrics.indexOf("LCP") > -1 && t3(this.It.bind(this)), this.allowedMetrics.indexOf("CLS") > -1 && i3(this.It.bind(this)), this.allowedMetrics.indexOf("FCP") > -1 && e2(this.It.bind(this)), this.allowedMetrics.indexOf("INP") > -1 && r2(this.It.bind(this)), this.P = true) : gs.error("web vitals callbacks not loaded - not starting");
    }, this._instance = t2, this.kt = !(null == (i2 = this._instance.persistence) || !i2.props[Yi]), this.startIfEnabled();
  }
  get allowedMetrics() {
    var t2, i2, e2 = R(this._instance.config.capture_performance) ? null == (t2 = this._instance.config.capture_performance) ? void 0 : t2.web_vitals_allowed_metrics : void 0;
    return M(e2) ? (null == (i2 = this._instance.persistence) ? void 0 : i2.props[Zi]) || ["CLS", "FCP", "INP", "LCP"] : e2;
  }
  get flushToCaptureTimeoutMs() {
    return (R(this._instance.config.capture_performance) ? this._instance.config.capture_performance.web_vitals_delayed_flush_ms : void 0) || 5e3;
  }
  get Rt() {
    var t2 = R(this._instance.config.capture_performance) && L(this._instance.config.capture_performance.__web_vitals_max_value) ? this._instance.config.capture_performance.__web_vitals_max_value : _s;
    return 0 < t2 && t2 <= 6e4 ? _s : t2;
  }
  get isEnabled() {
    var t2 = null == a ? void 0 : a.protocol;
    if ("http:" !== t2 && "https:" !== t2) return gs.info("Web Vitals are disabled on non-http/https protocols"), false;
    var i2 = R(this._instance.config.capture_performance) ? this._instance.config.capture_performance.web_vitals : U(this._instance.config.capture_performance) ? this._instance.config.capture_performance : void 0;
    return U(i2) ? i2 : this.kt;
  }
  startIfEnabled() {
    this.isEnabled && !this.P && (gs.info("enabled, starting..."), this.it(this.rt));
  }
  onRemoteConfig(t2) {
    var i2 = R(t2.capturePerformance) && !!t2.capturePerformance.web_vitals, e2 = R(t2.capturePerformance) ? t2.capturePerformance.web_vitals_allowed_metrics : void 0;
    this._instance.persistence && (this._instance.persistence.register({ [Yi]: i2 }), this._instance.persistence.register({ [Zi]: e2 })), this.kt = i2, this.startIfEnabled();
  }
  it(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.postHogWebVitalsCallbacks && t2(), null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, "web-vitals", ((i3) => {
      i3 ? gs.error("failed to load script", i3) : t2();
    }));
  }
  Ct() {
    var i2 = t ? t.location.href : void 0;
    if (i2) {
      var e2 = this._instance.config.mask_personal_data_properties, r2 = this._instance.config.custom_personal_data_properties, s2 = e2 ? Fi([], es, r2 || []) : [];
      return nr(i2, s2, ss);
    }
    gs.error("Could not determine current URL");
  }
};
var ys = Si("[Heatmaps]");
function bs(t2) {
  return R(t2) && "clientX" in t2 && "clientY" in t2 && L(t2.clientX) && L(t2.clientY);
}
var ws = class {
  constructor(t2) {
    var i2;
    this.kt = false, this.P = false, this.Ft = null, this.instance = t2, this.kt = !(null == (i2 = this.instance.persistence) || !i2.props[Gi]), this.rageclicks = new ir(t2.config.rageclick);
  }
  get flushIntervalMilliseconds() {
    var t2 = 5e3;
    return R(this.instance.config.capture_heatmaps) && this.instance.config.capture_heatmaps.flush_interval_milliseconds && (t2 = this.instance.config.capture_heatmaps.flush_interval_milliseconds), t2;
  }
  get isEnabled() {
    return M(this.instance.config.capture_heatmaps) ? M(this.instance.config.enable_heatmaps) ? this.kt : this.instance.config.enable_heatmaps : false !== this.instance.config.capture_heatmaps;
  }
  startIfEnabled() {
    if (this.isEnabled) {
      if (this.P) return;
      ys.info("starting..."), this.Mt(), this.Ot();
    } else {
      var t2;
      clearInterval(null !== (t2 = this.Ft) && void 0 !== t2 ? t2 : void 0), this.At(), this.getAndClearBuffer();
    }
  }
  onRemoteConfig(t2) {
    var i2 = !!t2.heatmaps;
    this.instance.persistence && this.instance.persistence.register({ [Gi]: i2 }), this.kt = i2, this.startIfEnabled();
  }
  getAndClearBuffer() {
    var t2 = this.N;
    return this.N = void 0, t2;
  }
  Dt(t2) {
    this.jt(t2.originalEvent, "deadclick");
  }
  Ot() {
    this.Ft && clearInterval(this.Ft), this.Ft = (function(t2) {
      return "visible" === (null == t2 ? void 0 : t2.visibilityState);
    })(o) ? setInterval(this.Lt.bind(this), this.flushIntervalMilliseconds) : null;
  }
  Mt() {
    t && o && (this.Nt = this.Lt.bind(this), zi(t, "beforeunload", this.Nt), this.Ut = (i2) => this.jt(i2 || (null == t ? void 0 : t.event)), zi(o, "click", this.Ut, { capture: true }), this.zt = (i2) => this.Ht(i2 || (null == t ? void 0 : t.event)), zi(o, "mousemove", this.zt, { capture: true }), this.Bt = new Lr(this.instance, Dr, this.Dt.bind(this)), this.Bt.startIfEnabled(), this.qt = this.Ot.bind(this), zi(o, "visibilitychange", this.qt), this.P = true);
  }
  At() {
    var i2;
    t && o && (this.Nt && t.removeEventListener("beforeunload", this.Nt), this.Ut && o.removeEventListener("click", this.Ut, { capture: true }), this.zt && o.removeEventListener("mousemove", this.zt, { capture: true }), this.qt && o.removeEventListener("visibilitychange", this.qt), clearTimeout(this.Wt), null == (i2 = this.Bt) || i2.stop(), this.P = false);
  }
  Gt(i2, e2) {
    var r2 = this.instance.scrollManager.scrollY(), s2 = this.instance.scrollManager.scrollX(), n2 = this.instance.scrollManager.scrollElement(), o2 = (function(i3, e3, r3) {
      for (var s3 = i3; s3 && we(s3) && !xe(s3, "body"); ) {
        if (s3 === r3) return false;
        if (w(e3, null == t ? void 0 : t.getComputedStyle(s3).position)) return true;
        s3 = Me(s3);
      }
      return false;
    })(Ce(i2), ["fixed", "sticky"], n2);
    return { x: i2.clientX + (o2 ? 0 : s2), y: i2.clientY + (o2 ? 0 : r2), target_fixed: o2, type: e2 };
  }
  jt(t2, i2) {
    var e2;
    if (void 0 === i2 && (i2 = "click"), !be(t2.target) && bs(t2)) {
      var r2 = this.Gt(t2, i2);
      null != (e2 = this.rageclicks) && e2.isRageClick(t2.clientX, t2.clientY, (/* @__PURE__ */ new Date()).getTime()) && this.Vt(g({}, r2, { type: "rageclick" })), this.Vt(r2);
    }
  }
  Ht(t2) {
    !be(t2.target) && bs(t2) && (clearTimeout(this.Wt), this.Wt = setTimeout((() => {
      this.Vt(this.Gt(t2, "mousemove"));
    }), 500));
  }
  Vt(i2) {
    if (t) {
      var e2 = t.location.href, r2 = this.instance.config.mask_personal_data_properties, s2 = this.instance.config.custom_personal_data_properties, n2 = r2 ? Fi([], es, s2 || []) : [], o2 = nr(e2, n2, ss);
      this.N = this.N || {}, this.N[o2] || (this.N[o2] = []), this.N[o2].push(i2);
    }
  }
  Lt() {
    this.N && !F(this.N) && this.instance.capture("$$heatmap", { $heatmap_data: this.getAndClearBuffer() });
  }
};
var xs = class {
  constructor(t2) {
    this.Jt = (t3, i2, e2) => {
      e2 && (e2.noSessionId || e2.activityTimeout || e2.sessionPastMaximumLength) && ($i.info("[PageViewManager] Session rotated, clearing pageview state", { sessionId: t3, changeReason: e2 }), this.Kt = void 0, this._instance.scrollManager.resetContext());
    }, this._instance = t2, this.Yt();
  }
  Yt() {
    var t2;
    this.Xt = null == (t2 = this._instance.sessionManager) ? void 0 : t2.onSessionId(this.Jt);
  }
  destroy() {
    var t2;
    null == (t2 = this.Xt) || t2.call(this), this.Xt = void 0;
  }
  doPageView(i2, e2) {
    var r2, s2 = this.Qt(i2, e2);
    return this.Kt = { pathname: null !== (r2 = null == t ? void 0 : t.location.pathname) && void 0 !== r2 ? r2 : "", pageViewId: e2, timestamp: i2 }, this._instance.scrollManager.resetContext(), s2;
  }
  doPageLeave(t2) {
    var i2;
    return this.Qt(t2, null == (i2 = this.Kt) ? void 0 : i2.pageViewId);
  }
  doEvent() {
    var t2;
    return { $pageview_id: null == (t2 = this.Kt) ? void 0 : t2.pageViewId };
  }
  Qt(t2, i2) {
    var e2 = this.Kt;
    if (!e2) return { $pageview_id: i2 };
    var r2 = { $pageview_id: i2, $prev_pageview_id: e2.pageViewId }, s2 = this._instance.scrollManager.getContext();
    if (s2 && !this._instance.config.disable_scroll_properties) {
      var { maxScrollHeight: n2, lastScrollY: o2, maxScrollY: a2, maxContentHeight: l2, lastContentY: u2, maxContentY: h3 } = s2;
      if (!(M(n2) || M(o2) || M(a2) || M(l2) || M(u2) || M(h3))) {
        n2 = Math.ceil(n2), o2 = Math.ceil(o2), a2 = Math.ceil(a2), l2 = Math.ceil(l2), u2 = Math.ceil(u2), h3 = Math.ceil(h3);
        var d2 = n2 <= 1 ? 1 : K(o2 / n2, 0, 1, $i), v2 = n2 <= 1 ? 1 : K(a2 / n2, 0, 1, $i), c2 = l2 <= 1 ? 1 : K(u2 / l2, 0, 1, $i), f2 = l2 <= 1 ? 1 : K(h3 / l2, 0, 1, $i);
        r2 = Ri(r2, { $prev_pageview_last_scroll: o2, $prev_pageview_last_scroll_percentage: d2, $prev_pageview_max_scroll: a2, $prev_pageview_max_scroll_percentage: v2, $prev_pageview_last_content: u2, $prev_pageview_last_content_percentage: c2, $prev_pageview_max_content: h3, $prev_pageview_max_content_percentage: f2 });
      }
    }
    return e2.pathname && (r2.$prev_pageview_pathname = e2.pathname), e2.timestamp && (r2.$prev_pageview_duration = (t2.getTime() - e2.timestamp.getTime()) / 1e3), r2;
  }
};
var $s = (function(t2) {
  return t2.GZipJS = "gzip-js", t2.Base64 = "base64", t2;
})({});
var Ss = Uint8Array;
var ks = Uint16Array;
var Ps = Uint32Array;
var Ts = new Ss([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]);
var Is = new Ss([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]);
var Cs = new Ss([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var Rs = function(t2, i2) {
  for (var e2 = new ks(31), r2 = 0; r2 < 31; ++r2) e2[r2] = i2 += 1 << t2[r2 - 1];
  var s2 = new Ps(e2[30]);
  for (r2 = 1; r2 < 30; ++r2) for (var n2 = e2[r2]; n2 < e2[r2 + 1]; ++n2) s2[n2] = n2 - e2[r2] << 5 | r2;
  return [e2, s2];
};
var Fs = Rs(Ts, 2);
var Ms = Fs[0];
var Os = Fs[1];
Ms[28] = 258, Os[258] = 28;
for (As = Rs(Is, 0)[1], Ds = new ks(32768), js = 0; js < 32768; ++js) {
  Ls = (43690 & js) >>> 1 | (21845 & js) << 1;
  Ls = (61680 & (Ls = (52428 & Ls) >>> 2 | (13107 & Ls) << 2)) >>> 4 | (3855 & Ls) << 4, Ds[js] = ((65280 & Ls) >>> 8 | (255 & Ls) << 8) >>> 1;
}
var Ls;
var As;
var Ds;
var js;
var Ns = function(t2, i2, e2) {
  for (var r2 = t2.length, s2 = 0, n2 = new ks(i2); s2 < r2; ++s2) ++n2[t2[s2] - 1];
  var o2, a2 = new ks(i2);
  for (s2 = 0; s2 < i2; ++s2) a2[s2] = a2[s2 - 1] + n2[s2 - 1] << 1;
  if (e2) {
    o2 = new ks(1 << i2);
    var l2 = 15 - i2;
    for (s2 = 0; s2 < r2; ++s2) if (t2[s2]) for (var u2 = s2 << 4 | t2[s2], h3 = i2 - t2[s2], d2 = a2[t2[s2] - 1]++ << h3, v2 = d2 | (1 << h3) - 1; d2 <= v2; ++d2) o2[Ds[d2] >>> l2] = u2;
  } else for (o2 = new ks(r2), s2 = 0; s2 < r2; ++s2) o2[s2] = Ds[a2[t2[s2] - 1]++] >>> 15 - t2[s2];
  return o2;
};
var Us = new Ss(288);
for (js = 0; js < 144; ++js) Us[js] = 8;
for (js = 144; js < 256; ++js) Us[js] = 9;
for (js = 256; js < 280; ++js) Us[js] = 7;
for (js = 280; js < 288; ++js) Us[js] = 8;
var zs = new Ss(32);
for (js = 0; js < 32; ++js) zs[js] = 5;
var Hs = Ns(Us, 9, 0);
var Bs = Ns(zs, 5, 0);
var qs = function(t2) {
  return (t2 / 8 >> 0) + (7 & t2 && 1);
};
var Ws = function(t2, i2, e2) {
  (null == e2 || e2 > t2.length) && (e2 = t2.length);
  var r2 = new (t2 instanceof ks ? ks : t2 instanceof Ps ? Ps : Ss)(e2 - i2);
  return r2.set(t2.subarray(i2, e2)), r2;
};
var Gs = function(t2, i2, e2) {
  e2 <<= 7 & i2;
  var r2 = i2 / 8 >> 0;
  t2[r2] |= e2, t2[r2 + 1] |= e2 >>> 8;
};
var Vs = function(t2, i2, e2) {
  e2 <<= 7 & i2;
  var r2 = i2 / 8 >> 0;
  t2[r2] |= e2, t2[r2 + 1] |= e2 >>> 8, t2[r2 + 2] |= e2 >>> 16;
};
var Js = function(t2, i2) {
  for (var e2 = [], r2 = 0; r2 < t2.length; ++r2) t2[r2] && e2.push({ s: r2, f: t2[r2] });
  var s2 = e2.length, n2 = e2.slice();
  if (!s2) return [new Ss(0), 0];
  if (1 == s2) {
    var o2 = new Ss(e2[0].s + 1);
    return o2[e2[0].s] = 1, [o2, 1];
  }
  e2.sort((function(t3, i3) {
    return t3.f - i3.f;
  })), e2.push({ s: -1, f: 25001 });
  var a2 = e2[0], l2 = e2[1], u2 = 0, h3 = 1, d2 = 2;
  for (e2[0] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 }; h3 != s2 - 1; ) a2 = e2[e2[u2].f < e2[d2].f ? u2++ : d2++], l2 = e2[u2 != h3 && e2[u2].f < e2[d2].f ? u2++ : d2++], e2[h3++] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 };
  var v2 = n2[0].s;
  for (r2 = 1; r2 < s2; ++r2) n2[r2].s > v2 && (v2 = n2[r2].s);
  var c2 = new ks(v2 + 1), f2 = Ks(e2[h3 - 1], c2, 0);
  if (f2 > i2) {
    r2 = 0;
    var p2 = 0, g2 = f2 - i2, _2 = 1 << g2;
    for (n2.sort((function(t3, i3) {
      return c2[i3.s] - c2[t3.s] || t3.f - i3.f;
    })); r2 < s2; ++r2) {
      var m2 = n2[r2].s;
      if (!(c2[m2] > i2)) break;
      p2 += _2 - (1 << f2 - c2[m2]), c2[m2] = i2;
    }
    for (p2 >>>= g2; p2 > 0; ) {
      var y2 = n2[r2].s;
      c2[y2] < i2 ? p2 -= 1 << i2 - c2[y2]++ - 1 : ++r2;
    }
    for (; r2 >= 0 && p2; --r2) {
      var b2 = n2[r2].s;
      c2[b2] == i2 && (--c2[b2], ++p2);
    }
    f2 = i2;
  }
  return [new Ss(c2), f2];
};
var Ks = function(t2, i2, e2) {
  return -1 == t2.s ? Math.max(Ks(t2.l, i2, e2 + 1), Ks(t2.r, i2, e2 + 1)) : i2[t2.s] = e2;
};
var Ys = function(t2) {
  for (var i2 = t2.length; i2 && !t2[--i2]; ) ;
  for (var e2 = new ks(++i2), r2 = 0, s2 = t2[0], n2 = 1, o2 = function(t3) {
    e2[r2++] = t3;
  }, a2 = 1; a2 <= i2; ++a2) if (t2[a2] == s2 && a2 != i2) ++n2;
  else {
    if (!s2 && n2 > 2) {
      for (; n2 > 138; n2 -= 138) o2(32754);
      n2 > 2 && (o2(n2 > 10 ? n2 - 11 << 5 | 28690 : n2 - 3 << 5 | 12305), n2 = 0);
    } else if (n2 > 3) {
      for (o2(s2), --n2; n2 > 6; n2 -= 6) o2(8304);
      n2 > 2 && (o2(n2 - 3 << 5 | 8208), n2 = 0);
    }
    for (; n2--; ) o2(s2);
    n2 = 1, s2 = t2[a2];
  }
  return [e2.subarray(0, r2), i2];
};
var Xs = function(t2, i2) {
  for (var e2 = 0, r2 = 0; r2 < i2.length; ++r2) e2 += t2[r2] * i2[r2];
  return e2;
};
var Qs = function(t2, i2, e2) {
  var r2 = e2.length, s2 = qs(i2 + 2);
  t2[s2] = 255 & r2, t2[s2 + 1] = r2 >>> 8, t2[s2 + 2] = 255 ^ t2[s2], t2[s2 + 3] = 255 ^ t2[s2 + 1];
  for (var n2 = 0; n2 < r2; ++n2) t2[s2 + n2 + 4] = e2[n2];
  return 8 * (s2 + 4 + r2);
};
var Zs = function(t2, i2, e2, r2, s2, n2, o2, a2, l2, u2, h3) {
  Gs(i2, h3++, e2), ++s2[256];
  for (var d2 = Js(s2, 15), v2 = d2[0], c2 = d2[1], f2 = Js(n2, 15), p2 = f2[0], g2 = f2[1], _2 = Ys(v2), m2 = _2[0], y2 = _2[1], b2 = Ys(p2), w2 = b2[0], x2 = b2[1], E2 = new ks(19), S2 = 0; S2 < m2.length; ++S2) E2[31 & m2[S2]]++;
  for (S2 = 0; S2 < w2.length; ++S2) E2[31 & w2[S2]]++;
  for (var k2 = Js(E2, 7), P2 = k2[0], T2 = k2[1], I2 = 19; I2 > 4 && !P2[Cs[I2 - 1]]; --I2) ;
  var C2, R2, F2, M2, O2 = u2 + 5 << 3, A2 = Xs(s2, Us) + Xs(n2, zs) + o2, D2 = Xs(s2, v2) + Xs(n2, p2) + o2 + 14 + 3 * I2 + Xs(E2, P2) + (2 * E2[16] + 3 * E2[17] + 7 * E2[18]);
  if (O2 <= A2 && O2 <= D2) return Qs(i2, h3, t2.subarray(l2, l2 + u2));
  if (Gs(i2, h3, 1 + (D2 < A2)), h3 += 2, D2 < A2) {
    C2 = Ns(v2, c2, 0), R2 = v2, F2 = Ns(p2, g2, 0), M2 = p2;
    var j2 = Ns(P2, T2, 0);
    Gs(i2, h3, y2 - 257), Gs(i2, h3 + 5, x2 - 1), Gs(i2, h3 + 10, I2 - 4), h3 += 14;
    for (S2 = 0; S2 < I2; ++S2) Gs(i2, h3 + 3 * S2, P2[Cs[S2]]);
    h3 += 3 * I2;
    for (var L2 = [m2, w2], N2 = 0; N2 < 2; ++N2) {
      var U2 = L2[N2];
      for (S2 = 0; S2 < U2.length; ++S2) {
        var z2 = 31 & U2[S2];
        Gs(i2, h3, j2[z2]), h3 += P2[z2], z2 > 15 && (Gs(i2, h3, U2[S2] >>> 5 & 127), h3 += U2[S2] >>> 12);
      }
    }
  } else C2 = Hs, R2 = Us, F2 = Bs, M2 = zs;
  for (S2 = 0; S2 < a2; ++S2) if (r2[S2] > 255) {
    z2 = r2[S2] >>> 18 & 31;
    Vs(i2, h3, C2[z2 + 257]), h3 += R2[z2 + 257], z2 > 7 && (Gs(i2, h3, r2[S2] >>> 23 & 31), h3 += Ts[z2]);
    var H2 = 31 & r2[S2];
    Vs(i2, h3, F2[H2]), h3 += M2[H2], H2 > 3 && (Vs(i2, h3, r2[S2] >>> 5 & 8191), h3 += Is[H2]);
  } else Vs(i2, h3, C2[r2[S2]]), h3 += R2[r2[S2]];
  return Vs(i2, h3, C2[256]), h3 + R2[256];
};
var tn = new Ps([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var en = (function() {
  for (var t2 = new Ps(256), i2 = 0; i2 < 256; ++i2) {
    for (var e2 = i2, r2 = 9; --r2; ) e2 = (1 & e2 && 3988292384) ^ e2 >>> 1;
    t2[i2] = e2;
  }
  return t2;
})();
var rn = function(t2, i2, e2, r2, s2) {
  return (function(t3, i3, e3, r3, s3, n2) {
    var o2 = t3.length, a2 = new Ss(r3 + o2 + 5 * (1 + Math.floor(o2 / 7e3)) + s3), l2 = a2.subarray(r3, a2.length - s3), u2 = 0;
    if (!i3 || o2 < 8) for (var h3 = 0; h3 <= o2; h3 += 65535) {
      var d2 = h3 + 65535;
      d2 < o2 ? u2 = Qs(l2, u2, t3.subarray(h3, d2)) : (l2[h3] = n2, u2 = Qs(l2, u2, t3.subarray(h3, o2)));
    }
    else {
      for (var v2 = tn[i3 - 1], c2 = v2 >>> 13, f2 = 8191 & v2, p2 = (1 << e3) - 1, g2 = new ks(32768), _2 = new ks(p2 + 1), m2 = Math.ceil(e3 / 3), y2 = 2 * m2, b2 = function(i4) {
        return (t3[i4] ^ t3[i4 + 1] << m2 ^ t3[i4 + 2] << y2) & p2;
      }, w2 = new Ps(25e3), x2 = new ks(288), E2 = new ks(32), S2 = 0, k2 = 0, P2 = (h3 = 0, 0), T2 = 0, I2 = 0; h3 < o2; ++h3) {
        var C2 = b2(h3), R2 = 32767 & h3, F2 = _2[C2];
        if (g2[R2] = F2, _2[C2] = R2, T2 <= h3) {
          var M2 = o2 - h3;
          if ((S2 > 7e3 || P2 > 24576) && M2 > 423) {
            u2 = Zs(t3, l2, 0, w2, x2, E2, k2, P2, I2, h3 - I2, u2), P2 = S2 = k2 = 0, I2 = h3;
            for (var O2 = 0; O2 < 286; ++O2) x2[O2] = 0;
            for (O2 = 0; O2 < 30; ++O2) E2[O2] = 0;
          }
          var A2 = 2, D2 = 0, j2 = f2, L2 = R2 - F2 & 32767;
          if (M2 > 2 && C2 == b2(h3 - L2)) for (var N2 = Math.min(c2, M2) - 1, U2 = Math.min(32767, h3), z2 = Math.min(258, M2); L2 <= U2 && --j2 && R2 != F2; ) {
            if (t3[h3 + A2] == t3[h3 + A2 - L2]) {
              for (var H2 = 0; H2 < z2 && t3[h3 + H2] == t3[h3 + H2 - L2]; ++H2) ;
              if (H2 > A2) {
                if (A2 = H2, D2 = L2, H2 > N2) break;
                var B2 = Math.min(L2, H2 - 2), q2 = 0;
                for (O2 = 0; O2 < B2; ++O2) {
                  var W2 = h3 - L2 + O2 + 32768 & 32767, G2 = W2 - g2[W2] + 32768 & 32767;
                  G2 > q2 && (q2 = G2, F2 = W2);
                }
              }
            }
            L2 += (R2 = F2) - (F2 = g2[R2]) + 32768 & 32767;
          }
          if (D2) {
            w2[P2++] = 268435456 | Os[A2] << 18 | As[D2];
            var V2 = 31 & Os[A2], J2 = 31 & As[D2];
            k2 += Ts[V2] + Is[J2], ++x2[257 + V2], ++E2[J2], T2 = h3 + A2, ++S2;
          } else w2[P2++] = t3[h3], ++x2[t3[h3]];
        }
      }
      u2 = Zs(t3, l2, n2, w2, x2, E2, k2, P2, I2, h3 - I2, u2);
    }
    return Ws(a2, 0, r3 + qs(u2) + s3);
  })(t2, null == i2.level ? 6 : i2.level, null == i2.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(t2.length)))) : 12 + i2.mem, e2, r2, true);
};
var sn = function(t2, i2, e2) {
  for (; e2; ++i2) t2[i2] = e2, e2 >>>= 8;
};
function nn(t2, i2) {
  void 0 === i2 && (i2 = {});
  var e2 = /* @__PURE__ */ (function() {
    var t3 = 4294967295;
    return { p: function(i3) {
      for (var e3 = t3, r3 = 0; r3 < i3.length; ++r3) e3 = en[255 & e3 ^ i3[r3]] ^ e3 >>> 8;
      t3 = e3;
    }, d: function() {
      return 4294967295 ^ t3;
    } };
  })(), r2 = t2.length;
  e2.p(t2);
  var s2, n2 = rn(t2, i2, 10 + ((s2 = i2).filename && s2.filename.length + 1 || 0), 8), o2 = n2.length;
  return (function(t3, i3) {
    var e3 = i3.filename;
    if (t3[0] = 31, t3[1] = 139, t3[2] = 8, t3[8] = i3.level < 2 ? 4 : 9 == i3.level ? 2 : 0, t3[9] = 3, 0 != i3.mtime && sn(t3, 4, Math.floor(new Date(i3.mtime || Date.now()) / 1e3)), e3) {
      t3[3] = 8;
      for (var r3 = 0; r3 <= e3.length; ++r3) t3[r3 + 10] = e3.charCodeAt(r3);
    }
  })(n2, i2), sn(n2, o2 - 8, e2.d()), sn(n2, o2 - 4, r2), n2;
}
var on = function(t2) {
  var i2, e2, r2, s2, n2 = "";
  for (i2 = e2 = 0, r2 = (t2 = (t2 + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")).length, s2 = 0; s2 < r2; s2++) {
    var o2 = t2.charCodeAt(s2), a2 = null;
    o2 < 128 ? e2++ : a2 = o2 > 127 && o2 < 2048 ? String.fromCharCode(o2 >> 6 | 192, 63 & o2 | 128) : String.fromCharCode(o2 >> 12 | 224, o2 >> 6 & 63 | 128, 63 & o2 | 128), D(a2) || (e2 > i2 && (n2 += t2.substring(i2, e2)), n2 += a2, i2 = e2 = s2 + 1);
  }
  return e2 > i2 && (n2 += t2.substring(i2, t2.length)), n2;
};
var an = !!u || !!l;
var ln = "text/plain";
var un = function(t2, i2, e2) {
  var r2;
  void 0 === e2 && (e2 = true);
  var [s2, n2] = t2.split("?"), o2 = g({}, i2), a2 = null !== (r2 = null == n2 ? void 0 : n2.split("&").map(((t3) => {
    var i3, [r3, s3] = t3.split("="), n3 = e2 && null !== (i3 = o2[r3]) && void 0 !== i3 ? i3 : s3;
    return delete o2[r3], r3 + "=" + n3;
  }))) && void 0 !== r2 ? r2 : [], l2 = rr(o2);
  return l2 && a2.push(l2), s2 + "?" + a2.join("&");
};
var hn = (t2, i2) => JSON.stringify(t2, ((t3, i3) => "bigint" == typeof i3 ? i3.toString() : i3), i2);
var dn = (t2) => {
  var { data: i2, compression: e2 } = t2;
  if (i2) {
    if (e2 === $s.GZipJS) {
      var r2 = nn((function(t3, i3) {
        var e3 = t3.length;
        if ("undefined" != typeof TextEncoder) return new TextEncoder().encode(t3);
        for (var r3 = new Ss(t3.length + (t3.length >>> 1)), s3 = 0, n3 = function(t4) {
          r3[s3++] = t4;
        }, o3 = 0; o3 < e3; ++o3) {
          if (s3 + 5 > r3.length) {
            var a3 = new Ss(s3 + 8 + (e3 - o3 << 1));
            a3.set(r3), r3 = a3;
          }
          var l2 = t3.charCodeAt(o3);
          l2 < 128 || i3 ? n3(l2) : l2 < 2048 ? (n3(192 | l2 >>> 6), n3(128 | 63 & l2)) : l2 > 55295 && l2 < 57344 ? (n3(240 | (l2 = 65536 + (1047552 & l2) | 1023 & t3.charCodeAt(++o3)) >>> 18), n3(128 | l2 >>> 12 & 63), n3(128 | l2 >>> 6 & 63), n3(128 | 63 & l2)) : (n3(224 | l2 >>> 12), n3(128 | l2 >>> 6 & 63), n3(128 | 63 & l2));
        }
        return Ws(r3, 0, s3);
      })(hn(i2)), { mtime: 0 }), s2 = new Blob([r2], { type: ln });
      return { contentType: ln, body: s2, estimatedSize: s2.size };
    }
    if (e2 === $s.Base64) {
      var n2 = (function(t3) {
        var i3, e3, r3, s3, n3, o3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", a3 = 0, l2 = 0, u2 = "", h3 = [];
        if (!t3) return t3;
        t3 = on(t3);
        do {
          i3 = (n3 = t3.charCodeAt(a3++) << 16 | t3.charCodeAt(a3++) << 8 | t3.charCodeAt(a3++)) >> 18 & 63, e3 = n3 >> 12 & 63, r3 = n3 >> 6 & 63, s3 = 63 & n3, h3[l2++] = o3.charAt(i3) + o3.charAt(e3) + o3.charAt(r3) + o3.charAt(s3);
        } while (a3 < t3.length);
        switch (u2 = h3.join(""), t3.length % 3) {
          case 1:
            u2 = u2.slice(0, -2) + "==";
            break;
          case 2:
            u2 = u2.slice(0, -1) + "=";
        }
        return u2;
      })(hn(i2)), o2 = ((t3) => "data=" + encodeURIComponent("string" == typeof t3 ? t3 : hn(t3)))(n2);
      return { contentType: "application/x-www-form-urlencoded", body: o2, estimatedSize: new Blob([o2]).size };
    }
    var a2 = hn(i2);
    return { contentType: "application/json", body: a2, estimatedSize: new Blob([a2]).size };
  }
};
var vn = [];
l && vn.push({ transport: "fetch", method: (t2) => {
  var i2, e2, { contentType: r2, body: s2, estimatedSize: n2 } = null !== (i2 = dn(t2)) && void 0 !== i2 ? i2 : {}, o2 = new Headers();
  Ci(t2.headers, (function(t3, i3) {
    o2.append(i3, t3);
  })), r2 && o2.append("Content-Type", r2);
  var a2 = t2.url, u2 = null;
  if (h) {
    var d2 = new h();
    u2 = { signal: d2.signal, timeout: setTimeout((() => d2.abort()), t2.timeout) };
  }
  l(a2, g({ method: (null == t2 ? void 0 : t2.method) || "GET", headers: o2, keepalive: "POST" === t2.method && (n2 || 0) < 52428.8, body: s2, signal: null == (e2 = u2) ? void 0 : e2.signal }, t2.fetchOptions)).then(((i3) => i3.text().then(((e3) => {
    var r3 = { statusCode: i3.status, text: e3 };
    if (200 === i3.status) try {
      r3.json = JSON.parse(e3);
    } catch (t3) {
      $i.error(t3);
    }
    null == t2.callback || t2.callback(r3);
  })))).catch(((i3) => {
    $i.error(i3), null == t2.callback || t2.callback({ statusCode: 0, text: i3 });
  })).finally((() => u2 ? clearTimeout(u2.timeout) : null));
} }), u && vn.push({ transport: "XHR", method: (t2) => {
  var i2, e2 = new u();
  e2.open(t2.method || "GET", t2.url, true);
  var { contentType: r2, body: s2 } = null !== (i2 = dn(t2)) && void 0 !== i2 ? i2 : {};
  Ci(t2.headers, (function(t3, i3) {
    e2.setRequestHeader(i3, t3);
  })), r2 && e2.setRequestHeader("Content-Type", r2), t2.timeout && (e2.timeout = t2.timeout), t2.disableXHRCredentials || (e2.withCredentials = true), e2.onreadystatechange = () => {
    if (4 === e2.readyState) {
      var i3 = { statusCode: e2.status, text: e2.responseText };
      if (200 === e2.status) try {
        i3.json = JSON.parse(e2.responseText);
      } catch (t3) {
      }
      null == t2.callback || t2.callback(i3);
    }
  }, e2.send(s2);
} }), null != n && n.sendBeacon && vn.push({ transport: "sendBeacon", method: (t2) => {
  var i2 = un(t2.url, { beacon: "1" });
  try {
    var e2, { contentType: r2, body: s2 } = null !== (e2 = dn(t2)) && void 0 !== e2 ? e2 : {}, o2 = "string" == typeof s2 ? new Blob([s2], { type: r2 }) : s2;
    n.sendBeacon(i2, o2);
  } catch (t3) {
  }
} });
var cn = function(t2, i2) {
  if (!(function(t3) {
    try {
      new RegExp(t3);
    } catch (t4) {
      return false;
    }
    return true;
  })(i2)) return false;
  try {
    return new RegExp(i2).test(t2);
  } catch (t3) {
    return false;
  }
};
function fn(t2, i2, e2) {
  return hn({ distinct_id: t2, userPropertiesToSet: i2, userPropertiesToSetOnce: e2 });
}
var pn = { exact: (t2, i2) => i2.some(((i3) => t2.some(((t3) => i3 === t3)))), is_not: (t2, i2) => i2.every(((i3) => t2.every(((t3) => i3 !== t3)))), regex: (t2, i2) => i2.some(((i3) => t2.some(((t3) => cn(i3, t3))))), not_regex: (t2, i2) => i2.every(((i3) => t2.every(((t3) => !cn(i3, t3))))), icontains: (t2, i2) => i2.map(gn).some(((i3) => t2.map(gn).some(((t3) => i3.includes(t3))))), not_icontains: (t2, i2) => i2.map(gn).every(((i3) => t2.map(gn).every(((t3) => !i3.includes(t3))))), gt: (t2, i2) => i2.some(((i3) => {
  var e2 = parseFloat(i3);
  return !isNaN(e2) && t2.some(((t3) => e2 > parseFloat(t3)));
})), lt: (t2, i2) => i2.some(((i3) => {
  var e2 = parseFloat(i3);
  return !isNaN(e2) && t2.some(((t3) => e2 < parseFloat(t3)));
})) };
var gn = (t2) => t2.toLowerCase();
function _n(t2, i2) {
  return !t2 || Object.entries(t2).every(((t3) => {
    var [e2, r2] = t3, s2 = null == i2 ? void 0 : i2[e2];
    if (M(s2) || D(s2)) return false;
    var n2 = [String(s2)], o2 = pn[r2.operator];
    return !!o2 && o2(r2.values, n2);
  }));
}
var mn = Si("[Error tracking]");
var yn = class {
  constructor(t2) {
    var i2, e2;
    this.Zt = [], this.ti = new Qt([new vi(), new xi(), new fi(), new ci(), new bi(), new yi(), new gi(), new wi()], di()), this._instance = t2, this.Zt = null !== (i2 = null == (e2 = this._instance.persistence) ? void 0 : e2.get_property(Ji)) && void 0 !== i2 ? i2 : [];
  }
  onRemoteConfig(t2) {
    var i2, e2, r2, s2 = null !== (i2 = null == (e2 = t2.errorTracking) ? void 0 : e2.suppressionRules) && void 0 !== i2 ? i2 : [], n2 = null == (r2 = t2.errorTracking) ? void 0 : r2.captureExtensionExceptions;
    this.Zt = s2, this._instance.persistence && this._instance.persistence.register({ [Ji]: this.Zt, [Ki]: n2 });
  }
  get ii() {
    var t2, i2 = !!this._instance.get_property(Ki), e2 = this._instance.config.error_tracking.captureExtensionExceptions;
    return null !== (t2 = null != e2 ? e2 : i2) && void 0 !== t2 && t2;
  }
  buildProperties(t2, i2) {
    return this.ti.buildFromUnknown(t2, { syntheticException: null == i2 ? void 0 : i2.syntheticException, mechanism: { handled: null == i2 ? void 0 : i2.handled } });
  }
  sendExceptionEvent(t2) {
    var i2 = t2.$exception_list;
    if (this.ei(i2)) {
      if (this.ri(i2)) return void mn.info("Skipping exception capture because a suppression rule matched");
      if (!this.ii && this.si(i2)) return void mn.info("Skipping exception capture because it was thrown by an extension");
      if (!this._instance.config.error_tracking.__capturePostHogExceptions && this.ni(i2)) return void mn.info("Skipping exception capture because it was thrown by the PostHog SDK");
    }
    return this._instance.capture("$exception", t2, { _noTruncate: true, _batchKey: "exceptionEvent" });
  }
  ri(t2) {
    if (0 === t2.length) return false;
    var i2 = t2.reduce(((t3, i3) => {
      var { type: e2, value: r2 } = i3;
      return O(e2) && e2.length > 0 && t3.$exception_types.push(e2), O(r2) && r2.length > 0 && t3.$exception_values.push(r2), t3;
    }), { $exception_types: [], $exception_values: [] });
    return this.Zt.some(((t3) => {
      var e2 = t3.values.map(((t4) => {
        var e3, r2 = pn[t4.operator], s2 = I(t4.value) ? t4.value : [t4.value], n2 = null !== (e3 = i2[t4.key]) && void 0 !== e3 ? e3 : [];
        return s2.length > 0 && r2(s2, n2);
      }));
      return "OR" === t3.type ? e2.some(Boolean) : e2.every(Boolean);
    }));
  }
  si(t2) {
    return t2.flatMap(((t3) => {
      var i2, e2;
      return null !== (i2 = null == (e2 = t3.stacktrace) ? void 0 : e2.frames) && void 0 !== i2 ? i2 : [];
    })).some(((t3) => t3.filename && t3.filename.startsWith("chrome-extension://")));
  }
  ni(t2) {
    if (t2.length > 0) {
      var i2, e2, r2, s2, n2 = null !== (i2 = null == (e2 = t2[0].stacktrace) ? void 0 : e2.frames) && void 0 !== i2 ? i2 : [], o2 = n2[n2.length - 1];
      return null !== (r2 = null == o2 || null == (s2 = o2.filename) ? void 0 : s2.includes("posthog.com/static")) && void 0 !== r2 && r2;
    }
    return false;
  }
  ei(t2) {
    return !j(t2) && I(t2);
  }
};
var bn = Si("[FeatureFlags]");
var wn = Si("[FeatureFlags]", { debugEnabled: true });
var xn = "$active_feature_flags";
var En = "$override_feature_flags";
var $n = "$feature_flag_payloads";
var Sn = "$override_feature_flag_payloads";
var kn = "$feature_flag_request_id";
var Pn = "$feature_flag_evaluated_at";
var Tn = (t2) => {
  var i2 = {};
  for (var [e2, r2] of Mi(t2 || {})) r2 && (i2[e2] = r2);
  return i2;
};
var In = (t2) => {
  var i2 = t2.flags;
  return i2 ? (t2.featureFlags = Object.fromEntries(Object.keys(i2).map(((t3) => {
    var e2;
    return [t3, null !== (e2 = i2[t3].variant) && void 0 !== e2 ? e2 : i2[t3].enabled];
  }))), t2.featureFlagPayloads = Object.fromEntries(Object.keys(i2).filter(((t3) => i2[t3].enabled)).filter(((t3) => {
    var e2;
    return null == (e2 = i2[t3].metadata) ? void 0 : e2.payload;
  })).map(((t3) => {
    var e2;
    return [t3, null == (e2 = i2[t3].metadata) ? void 0 : e2.payload];
  })))) : bn.warn("Using an older version of the feature flags endpoint. Please upgrade your PostHog server to the latest version"), t2;
};
var Cn = (function(t2) {
  return t2.FeatureFlags = "feature_flags", t2.Recordings = "recordings", t2;
})({});
var Rn = class {
  constructor(t2) {
    this.oi = false, this.ai = false, this.li = false, this.ui = false, this.hi = false, this.di = false, this.vi = false, this.ci = false, this._instance = t2, this.featureFlagEventHandlers = [];
  }
  fi() {
    var t2, i2 = null !== (t2 = this._instance.config.evaluation_contexts) && void 0 !== t2 ? t2 : this._instance.config.evaluation_environments;
    return !this._instance.config.evaluation_environments || this._instance.config.evaluation_contexts || this.ci || (bn.warn("evaluation_environments is deprecated. Use evaluation_contexts instead. evaluation_environments will be removed in a future version."), this.ci = true), null != i2 && i2.length ? i2.filter(((t3) => {
      var i3 = t3 && "string" == typeof t3 && t3.trim().length > 0;
      return i3 || bn.error("Invalid evaluation context found:", t3, "Expected non-empty string"), i3;
    })) : [];
  }
  pi() {
    return this.fi().length > 0;
  }
  flags() {
    if (this._instance.config.__preview_remote_config) this.di = true;
    else {
      var t2 = !this.gi && (this._instance.config.advanced_disable_feature_flags || this._instance.config.advanced_disable_feature_flags_on_first_load);
      this.mi({ disableFlags: t2 });
    }
  }
  get hasLoadedFlags() {
    return this.ai;
  }
  getFlags() {
    return Object.keys(this.getFlagVariants());
  }
  getFlagsWithDetails() {
    var t2 = this._instance.get_property(ne), i2 = this._instance.get_property(En), e2 = this._instance.get_property(Sn);
    if (!e2 && !i2) return t2 || {};
    var r2 = Ri({}, t2 || {}), s2 = [.../* @__PURE__ */ new Set([...Object.keys(e2 || {}), ...Object.keys(i2 || {})])];
    for (var n2 of s2) {
      var o2, a2, l2 = r2[n2], u2 = null == i2 ? void 0 : i2[n2], h3 = M(u2) ? null !== (o2 = null == l2 ? void 0 : l2.enabled) && void 0 !== o2 && o2 : !!u2, d2 = M(u2) ? l2.variant : "string" == typeof u2 ? u2 : void 0, v2 = null == e2 ? void 0 : e2[n2], c2 = g({}, l2, { enabled: h3, variant: h3 ? null != d2 ? d2 : null == l2 ? void 0 : l2.variant : void 0 });
      if (h3 !== (null == l2 ? void 0 : l2.enabled) && (c2.original_enabled = null == l2 ? void 0 : l2.enabled), d2 !== (null == l2 ? void 0 : l2.variant) && (c2.original_variant = null == l2 ? void 0 : l2.variant), v2) c2.metadata = g({}, null == l2 ? void 0 : l2.metadata, { payload: v2, original_payload: null == l2 || null == (a2 = l2.metadata) ? void 0 : a2.payload });
      r2[n2] = c2;
    }
    return this.oi || (bn.warn(" Overriding feature flag details!", { flagDetails: t2, overriddenPayloads: e2, finalDetails: r2 }), this.oi = true), r2;
  }
  getFlagVariants() {
    var t2 = this._instance.get_property(re), i2 = this._instance.get_property(En);
    if (!i2) return t2 || {};
    for (var e2 = Ri({}, t2), r2 = Object.keys(i2), s2 = 0; s2 < r2.length; s2++) e2[r2[s2]] = i2[r2[s2]];
    return this.oi || (bn.warn(" Overriding feature flags!", { enabledFlags: t2, overriddenFlags: i2, finalFlags: e2 }), this.oi = true), e2;
  }
  getFlagPayloads() {
    var t2 = this._instance.get_property($n), i2 = this._instance.get_property(Sn);
    if (!i2) return t2 || {};
    for (var e2 = Ri({}, t2 || {}), r2 = Object.keys(i2), s2 = 0; s2 < r2.length; s2++) e2[r2[s2]] = i2[r2[s2]];
    return this.oi || (bn.warn(" Overriding feature flag payloads!", { flagPayloads: t2, overriddenPayloads: i2, finalPayloads: e2 }), this.oi = true), e2;
  }
  reloadFeatureFlags() {
    this.ui || this._instance.config.advanced_disable_feature_flags || this.gi || (this.gi = setTimeout((() => {
      this.mi();
    }), 5));
  }
  yi() {
    clearTimeout(this.gi), this.gi = void 0;
  }
  ensureFlagsLoaded() {
    this.ai || this.li || this.gi || this.reloadFeatureFlags();
  }
  setAnonymousDistinctId(t2) {
    this.$anon_distinct_id = t2;
  }
  setReloadingPaused(t2) {
    this.ui = t2;
  }
  mi(t2) {
    var i2;
    if (this.yi(), !this._instance.O()) if (this.li) this.hi = true;
    else {
      var e2 = this._instance.config.token, r2 = this._instance.get_property("$device_id"), s2 = { token: e2, distinct_id: this._instance.get_distinct_id(), groups: this._instance.getGroups(), $anon_distinct_id: this.$anon_distinct_id, person_properties: g({}, (null == (i2 = this._instance.persistence) ? void 0 : i2.get_initial_props()) || {}, this._instance.get_property(oe) || {}), group_properties: this._instance.get_property(ae) };
      D(r2) || M(r2) || (s2.$device_id = r2), (null != t2 && t2.disableFlags || this._instance.config.advanced_disable_feature_flags) && (s2.disable_flags = true), this.pi() && (s2.evaluation_contexts = this.fi());
      var n2 = this._instance.config.__preview_remote_config, o2 = n2 ? "/flags/?v=2" : "/flags/?v=2&config=true", a2 = this._instance.config.advanced_only_evaluate_survey_feature_flags ? "&only_evaluate_survey_feature_flags=true" : "", l2 = this._instance.requestRouter.endpointFor("flags", o2 + a2);
      n2 && (s2.timezone = cs()), this.li = true, this._instance._send_request({ method: "POST", url: l2, data: s2, compression: this._instance.config.disable_compression ? void 0 : $s.Base64, timeout: this._instance.config.feature_flag_request_timeout_ms, callback: (t3) => {
        var i3, e3, r3 = true;
        (200 === t3.statusCode && (this.hi || (this.$anon_distinct_id = void 0), r3 = false), this.li = false, this.di) || (this.di = true, this._instance.bi(null !== (e3 = t3.json) && void 0 !== e3 ? e3 : {}));
        if (!s2.disable_flags || this.hi) if (this.vi = !r3, t3.json && null != (i3 = t3.json.quotaLimited) && i3.includes(Cn.FeatureFlags)) bn.warn("You have hit your feature flags quota limit, and will not be able to load feature flags until the quota is reset.  Please visit https://posthog.com/docs/billing/limits-alerts to learn more.");
        else {
          var n3;
          if (!s2.disable_flags) this.receivedFeatureFlags(null !== (n3 = t3.json) && void 0 !== n3 ? n3 : {}, r3);
          this.hi && (this.hi = false, this.mi());
        }
      } });
    }
  }
  getFeatureFlag(t2, i2) {
    if (void 0 === i2 && (i2 = {}), this.ai || this.getFlags() && this.getFlags().length > 0) {
      var e2 = this.getFlagVariants()[t2], r2 = "" + e2, s2 = this._instance.get_property(kn) || void 0, n2 = this._instance.get_property(Pn) || void 0, o2 = this._instance.get_property(ue) || {};
      if ((i2.send_event || !("send_event" in i2)) && (!(t2 in o2) || !o2[t2].includes(r2))) {
        var a2, l2, u2, h3, d2, v2, c2, f2, p2;
        I(o2[t2]) ? o2[t2].push(r2) : o2[t2] = [r2], null == (a2 = this._instance.persistence) || a2.register({ [ue]: o2 });
        var g2 = this.getFeatureFlagDetails(t2), _2 = { $feature_flag: t2, $feature_flag_response: e2, $feature_flag_payload: this.getFeatureFlagPayload(t2) || null, $feature_flag_request_id: s2, $feature_flag_evaluated_at: n2, $feature_flag_bootstrapped_response: (null == (l2 = this._instance.config.bootstrap) || null == (l2 = l2.featureFlags) ? void 0 : l2[t2]) || null, $feature_flag_bootstrapped_payload: (null == (u2 = this._instance.config.bootstrap) || null == (u2 = u2.featureFlagPayloads) ? void 0 : u2[t2]) || null, $used_bootstrap_value: !this.vi };
        M(null == g2 || null == (h3 = g2.metadata) ? void 0 : h3.version) || (_2.$feature_flag_version = g2.metadata.version);
        var m2, y2 = null !== (d2 = null == g2 || null == (v2 = g2.reason) ? void 0 : v2.description) && void 0 !== d2 ? d2 : null == g2 || null == (c2 = g2.reason) ? void 0 : c2.code;
        if (y2 && (_2.$feature_flag_reason = y2), null != g2 && null != (f2 = g2.metadata) && f2.id && (_2.$feature_flag_id = g2.metadata.id), M(null == g2 ? void 0 : g2.original_variant) && M(null == g2 ? void 0 : g2.original_enabled) || (_2.$feature_flag_original_response = M(g2.original_variant) ? g2.original_enabled : g2.original_variant), null != g2 && null != (p2 = g2.metadata) && p2.original_payload) _2.$feature_flag_original_payload = null == g2 || null == (m2 = g2.metadata) ? void 0 : m2.original_payload;
        this._instance.capture("$feature_flag_called", _2);
      }
      return e2;
    }
    bn.warn('getFeatureFlag for key "' + t2 + `" failed. Feature flags didn't load in time.`);
  }
  getFeatureFlagDetails(t2) {
    return this.getFlagsWithDetails()[t2];
  }
  getFeatureFlagPayload(t2) {
    return this.getFlagPayloads()[t2];
  }
  getRemoteConfigPayload(t2, i2) {
    var e2 = this._instance.config.token, r2 = { distinct_id: this._instance.get_distinct_id(), token: e2 };
    this.pi() && (r2.evaluation_contexts = this.fi()), this._instance._send_request({ method: "POST", url: this._instance.requestRouter.endpointFor("flags", "/flags/?v=2&config=true"), data: r2, compression: this._instance.config.disable_compression ? void 0 : $s.Base64, timeout: this._instance.config.feature_flag_request_timeout_ms, callback: (e3) => {
      var r3, s2 = null == (r3 = e3.json) ? void 0 : r3.featureFlagPayloads;
      i2((null == s2 ? void 0 : s2[t2]) || void 0);
    } });
  }
  isFeatureEnabled(t2, i2) {
    if (void 0 === i2 && (i2 = {}), this.ai || this.getFlags() && this.getFlags().length > 0) {
      var e2 = this.getFeatureFlag(t2, i2);
      return M(e2) ? void 0 : !!e2;
    }
    bn.warn('isFeatureEnabled for key "' + t2 + `" failed. Feature flags didn't load in time.`);
  }
  addFeatureFlagsHandler(t2) {
    this.featureFlagEventHandlers.push(t2);
  }
  removeFeatureFlagsHandler(t2) {
    this.featureFlagEventHandlers = this.featureFlagEventHandlers.filter(((i2) => i2 !== t2));
  }
  receivedFeatureFlags(t2, i2) {
    if (this._instance.persistence) {
      this.ai = true;
      var e2 = this.getFlagVariants(), r2 = this.getFlagPayloads(), s2 = this.getFlagsWithDetails();
      !(function(t3, i3, e3, r3, s3) {
        void 0 === e3 && (e3 = {}), void 0 === r3 && (r3 = {}), void 0 === s3 && (s3 = {});
        var n2 = In(t3), o2 = n2.flags, a2 = n2.featureFlags, l2 = n2.featureFlagPayloads;
        if (a2) {
          var u2 = t3.requestId, h3 = t3.evaluatedAt;
          if (I(a2)) {
            bn.warn("v1 of the feature flags endpoint is deprecated. Please use the latest version.");
            var d2 = {};
            if (a2) for (var v2 = 0; v2 < a2.length; v2++) d2[a2[v2]] = true;
            i3 && i3.register({ [xn]: a2, [re]: d2 });
          } else {
            var c2 = a2, f2 = l2, p2 = o2;
            t3.errorsWhileComputingFlags && (c2 = g({}, e3, c2), f2 = g({}, r3, f2), p2 = g({}, s3, p2)), i3 && i3.register(g({ [xn]: Object.keys(Tn(c2)), [re]: c2 || {}, [$n]: f2 || {}, [ne]: p2 || {} }, u2 ? { [kn]: u2 } : {}, h3 ? { [Pn]: h3 } : {}));
          }
        }
      })(t2, this._instance.persistence, e2, r2, s2), this.wi(i2);
    }
  }
  override(t2, i2) {
    void 0 === i2 && (i2 = false), bn.warn("override is deprecated. Please use overrideFeatureFlags instead."), this.overrideFeatureFlags({ flags: t2, suppressWarning: i2 });
  }
  overrideFeatureFlags(t2) {
    if (!this._instance.__loaded || !this._instance.persistence) return bn.uninitializedWarning("posthog.featureFlags.overrideFeatureFlags");
    if (false === t2) return this._instance.persistence.unregister(En), this._instance.persistence.unregister(Sn), this.wi(), wn.info("All overrides cleared");
    if (t2 && "object" == typeof t2 && ("flags" in t2 || "payloads" in t2)) {
      var i2, e2 = t2;
      if (this.oi = Boolean(null !== (i2 = e2.suppressWarning) && void 0 !== i2 && i2), "flags" in e2) {
        if (false === e2.flags) this._instance.persistence.unregister(En), wn.info("Flag overrides cleared");
        else if (e2.flags) {
          if (I(e2.flags)) {
            for (var r2 = {}, s2 = 0; s2 < e2.flags.length; s2++) r2[e2.flags[s2]] = true;
            this._instance.persistence.register({ [En]: r2 });
          } else this._instance.persistence.register({ [En]: e2.flags });
          wn.info("Flag overrides set", { flags: e2.flags });
        }
      }
      return "payloads" in e2 && (false === e2.payloads ? (this._instance.persistence.unregister(Sn), wn.info("Payload overrides cleared")) : e2.payloads && (this._instance.persistence.register({ [Sn]: e2.payloads }), wn.info("Payload overrides set", { payloads: e2.payloads }))), void this.wi();
    }
    this.wi();
  }
  onFeatureFlags(t2) {
    if (this.addFeatureFlagsHandler(t2), this.ai) {
      var { flags: i2, flagVariants: e2 } = this.xi();
      t2(i2, e2);
    }
    return () => this.removeFeatureFlagsHandler(t2);
  }
  updateEarlyAccessFeatureEnrollment(t2, i2, e2) {
    var r2, s2 = (this._instance.get_property(se) || []).find(((i3) => i3.flagKey === t2)), n2 = { ["$feature_enrollment/" + t2]: i2 }, o2 = { $feature_flag: t2, $feature_enrollment: i2, $set: n2 };
    s2 && (o2.$early_access_feature_name = s2.name), e2 && (o2.$feature_enrollment_stage = e2), this._instance.capture("$feature_enrollment_update", o2), this.setPersonPropertiesForFlags(n2, false);
    var a2 = g({}, this.getFlagVariants(), { [t2]: i2 });
    null == (r2 = this._instance.persistence) || r2.register({ [xn]: Object.keys(Tn(a2)), [re]: a2 }), this.wi();
  }
  getEarlyAccessFeatures(t2, i2, e2) {
    void 0 === i2 && (i2 = false);
    var r2 = this._instance.get_property(se), s2 = e2 ? "&" + e2.map(((t3) => "stage=" + t3)).join("&") : "";
    if (r2 && !i2) return t2(r2);
    this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/early_access_features/?token=" + this._instance.config.token + s2), method: "GET", callback: (i3) => {
      var e3, r3;
      if (i3.json) {
        var s3 = i3.json.earlyAccessFeatures;
        return null == (e3 = this._instance.persistence) || e3.unregister(se), null == (r3 = this._instance.persistence) || r3.register({ [se]: s3 }), t2(s3);
      }
    } });
  }
  xi() {
    var t2 = this.getFlags(), i2 = this.getFlagVariants();
    return { flags: t2.filter(((t3) => i2[t3])), flagVariants: Object.keys(i2).filter(((t3) => i2[t3])).reduce(((t3, e2) => (t3[e2] = i2[e2], t3)), {}) };
  }
  wi(t2) {
    var { flags: i2, flagVariants: e2 } = this.xi();
    this.featureFlagEventHandlers.forEach(((r2) => r2(i2, e2, { errorsLoading: t2 })));
  }
  setPersonPropertiesForFlags(t2, i2) {
    void 0 === i2 && (i2 = true);
    var e2 = this._instance.get_property(oe) || {};
    this._instance.register({ [oe]: g({}, e2, t2) }), i2 && this._instance.reloadFeatureFlags();
  }
  resetPersonPropertiesForFlags() {
    this._instance.unregister(oe);
  }
  setGroupPropertiesForFlags(t2, i2) {
    void 0 === i2 && (i2 = true);
    var e2 = this._instance.get_property(ae) || {};
    0 !== Object.keys(e2).length && Object.keys(e2).forEach(((i3) => {
      e2[i3] = g({}, e2[i3], t2[i3]), delete t2[i3];
    })), this._instance.register({ [ae]: g({}, e2, t2) }), i2 && this._instance.reloadFeatureFlags();
  }
  resetGroupPropertiesForFlags(t2) {
    if (t2) {
      var i2 = this._instance.get_property(ae) || {};
      this._instance.register({ [ae]: g({}, i2, { [t2]: {} }) });
    } else this._instance.unregister(ae);
  }
  reset() {
    this.ai = false, this.li = false, this.ui = false, this.hi = false, this.di = false, this.vi = false, this.$anon_distinct_id = void 0, this.yi(), this.oi = false;
  }
};
var Fn = ["cookie", "localstorage", "localstorage+cookie", "sessionstorage", "memory"];
var Mn = class {
  constructor(t2, i2) {
    this.R = t2, this.props = {}, this.Ei = false, this.$i = ((t3) => {
      var i3 = "";
      return t3.token && (i3 = t3.token.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")), t3.persistence_name ? "ph_" + t3.persistence_name : "ph_" + i3 + "_posthog";
    })(t2), this.Y = this.Si(t2), this.load(), t2.debug && $i.info("Persistence loaded", t2.persistence, g({}, this.props)), this.update_config(t2, t2, i2), this.save();
  }
  isDisabled() {
    return !!this.ki;
  }
  Si(i2) {
    -1 === Fn.indexOf(i2.persistence.toLowerCase()) && ($i.critical("Unknown persistence type " + i2.persistence + "; falling back to localStorage+cookie"), i2.persistence = "localStorage+cookie");
    var e2 = (function(i3) {
      void 0 === i3 && (i3 = []);
      var e3 = [...Tr, ...i3];
      return g({}, Pr, { W: function(t2) {
        try {
          var i4 = {};
          try {
            i4 = Sr.W(t2) || {};
          } catch (t3) {
          }
          var e4 = Ri(i4, JSON.parse(Pr.q(t2) || "{}"));
          return Pr.G(t2, e4), e4;
        } catch (t3) {
        }
        return null;
      }, G: function(t2, i4, r3, s2, n2, o2) {
        try {
          Pr.G(t2, i4, void 0, void 0, o2);
          var a2 = {};
          e3.forEach(((t3) => {
            i4[t3] && (a2[t3] = i4[t3]);
          })), Object.keys(a2).length && Sr.G(t2, a2, r3, s2, n2, o2);
        } catch (t3) {
          Pr.B(t3);
        }
      }, V: function(i4, e4) {
        try {
          null == t || t.localStorage.removeItem(i4), Sr.V(i4, e4);
        } catch (t2) {
          Pr.B(t2);
        }
      } });
    })(i2.cookie_persisted_properties || []), r2 = i2.persistence.toLowerCase();
    return "localstorage" === r2 && Pr.H() ? Pr : "localstorage+cookie" === r2 && e2.H() ? e2 : "sessionstorage" === r2 && Fr.H() ? Fr : "memory" === r2 ? Cr : "cookie" === r2 ? Sr : e2.H() ? e2 : Sr;
  }
  properties() {
    var t2 = {};
    return Ci(this.props, (function(i2, e2) {
      if (e2 === re && R(i2)) for (var r2 = Object.keys(i2), n2 = 0; n2 < r2.length; n2++) t2["$feature/" + r2[n2]] = i2[r2[n2]];
      else a2 = e2, l2 = false, (D(o2 = ye) ? l2 : s && o2.indexOf === s ? -1 != o2.indexOf(a2) : (Ci(o2, (function(t3) {
        if (l2 || (l2 = t3 === a2)) return Ti;
      })), l2)) || (t2[e2] = i2);
      var o2, a2, l2;
    })), t2;
  }
  load() {
    if (!this.ki) {
      var t2 = this.Y.W(this.$i);
      t2 && (this.props = Ri({}, t2));
    }
  }
  save() {
    this.ki || this.Y.G(this.$i, this.props, this.Pi, this.Ti, this.Ii, this.R.debug);
  }
  remove() {
    this.Y.V(this.$i, false), this.Y.V(this.$i, true);
  }
  clear() {
    this.remove(), this.props = {};
  }
  register_once(t2, i2, e2) {
    if (R(t2)) {
      M(i2) && (i2 = "None"), this.Pi = M(e2) ? this.Ci : e2;
      var r2 = false;
      if (Ci(t2, ((t3, e3) => {
        this.props.hasOwnProperty(e3) && this.props[e3] !== i2 || (this.props[e3] = t3, r2 = true);
      })), r2) return this.save(), true;
    }
    return false;
  }
  register(t2, i2) {
    if (R(t2)) {
      this.Pi = M(i2) ? this.Ci : i2;
      var e2 = false;
      if (Ci(t2, ((i3, r2) => {
        t2.hasOwnProperty(r2) && this.props[r2] !== i3 && (this.props[r2] = i3, e2 = true);
      })), e2) return this.save(), true;
    }
    return false;
  }
  unregister(t2) {
    t2 in this.props && (delete this.props[t2], this.save());
  }
  update_campaign_params() {
    if (!this.Ei) {
      var t2 = os(this.R.custom_campaign_params, this.R.mask_personal_data_properties, this.R.custom_personal_data_properties);
      F(Di(t2)) || this.register(t2), this.Ei = true;
    }
  }
  update_search_keyword() {
    var t2;
    this.register((t2 = null == o ? void 0 : o.referrer) ? ls(t2) : {});
  }
  update_referrer_info() {
    var t2;
    this.register_once({ $referrer: hs(), $referring_domain: null != o && o.referrer && (null == (t2 = er(o.referrer)) ? void 0 : t2.host) || "$direct" }, void 0);
  }
  set_initial_person_info() {
    this.props[ce] || this.props[fe] || this.register_once({ [pe]: ds(this.R.mask_personal_data_properties, this.R.custom_personal_data_properties) }, void 0);
  }
  get_initial_props() {
    var t2 = {};
    Ci([fe, ce], ((i3) => {
      var e3 = this.props[i3];
      e3 && Ci(e3, (function(i4, e4) {
        t2["$initial_" + E(e4)] = i4;
      }));
    }));
    var i2, e2, r2 = this.props[pe];
    if (r2) {
      var s2 = (i2 = vs(r2), e2 = {}, Ci(i2, (function(t3, i3) {
        e2["$initial_" + E(i3)] = t3;
      })), e2);
      Ri(t2, s2);
    }
    return t2;
  }
  safe_merge(t2) {
    return Ci(this.props, (function(i2, e2) {
      e2 in t2 || (t2[e2] = i2);
    })), t2;
  }
  update_config(t2, i2, e2) {
    if (this.Ci = this.Pi = t2.cookie_expiration, this.set_disabled(t2.disable_persistence || !!e2), this.set_cross_subdomain(t2.cross_subdomain_cookie), this.set_secure(t2.secure_cookie), t2.persistence !== i2.persistence || !((t3, i3) => {
      if (t3.length !== i3.length) return false;
      var e3 = [...t3].sort(), r3 = [...i3].sort();
      return e3.every(((t4, i4) => t4 === r3[i4]));
    })(t2.cookie_persisted_properties || [], i2.cookie_persisted_properties || [])) {
      var r2 = this.Si(t2), s2 = this.props;
      this.clear(), this.Y = r2, this.props = s2, this.save();
    }
  }
  set_disabled(t2) {
    this.ki = t2, this.ki ? this.remove() : this.save();
  }
  set_cross_subdomain(t2) {
    t2 !== this.Ti && (this.Ti = t2, this.remove(), this.save());
  }
  set_secure(t2) {
    t2 !== this.Ii && (this.Ii = t2, this.remove(), this.save());
  }
  set_event_timer(t2, i2) {
    var e2 = this.props[qi] || {};
    e2[t2] = i2, this.props[qi] = e2, this.save();
  }
  remove_event_timer(t2) {
    var i2 = (this.props[qi] || {})[t2];
    return M(i2) || (delete this.props[qi][t2], this.save()), i2;
  }
  get_property(t2) {
    return this.props[t2];
  }
  set_property(t2, i2) {
    this.props[t2] = i2, this.save();
  }
};
var On = Si("[Product Tours]");
var An = "ph_product_tours";
var Dn = class {
  constructor(t2) {
    this.Ri = null, this.Fi = null, this._instance = t2;
  }
  onRemoteConfig(t2) {
    this._instance.persistence && this._instance.persistence.register({ [Qi]: !(null == t2 || !t2.productTours) }), this.loadIfEnabled();
  }
  loadIfEnabled() {
    var t2, i2;
    this.Ri || ((t2 = this._instance).config.disable_product_tours || null == (i2 = t2.persistence) || !i2.get_property(Qi)) || this.it((() => this.Mi()));
  }
  it(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.generateProductTours ? t2() : null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, "product-tours", ((i3) => {
      i3 ? On.error("Could not load product tours script", i3) : t2();
    }));
  }
  Mi() {
    var t2;
    !this.Ri && null != (t2 = v.__PosthogExtensions__) && t2.generateProductTours && (this.Ri = v.__PosthogExtensions__.generateProductTours(this._instance, true));
  }
  getProductTours(t2, i2) {
    if (void 0 === i2 && (i2 = false), !I(this.Fi) || i2) {
      var e2 = this._instance.persistence;
      if (e2) {
        var r2 = e2.props[An];
        if (I(r2) && !i2) return this.Fi = r2, void t2(r2, { isLoaded: true });
      }
      this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/product_tours/?token=" + this._instance.config.token), method: "GET", callback: (i3) => {
        var r3 = i3.statusCode;
        if (200 !== r3 || !i3.json) {
          var s2 = "Product Tours API could not be loaded, status: " + r3;
          return On.error(s2), void t2([], { isLoaded: false, error: s2 });
        }
        var n2 = I(i3.json.product_tours) ? i3.json.product_tours : [];
        this.Fi = n2, e2 && e2.register({ [An]: n2 }), t2(n2, { isLoaded: true });
      } });
    } else t2(this.Fi, { isLoaded: true });
  }
  getActiveProductTours(t2) {
    j(this.Ri) ? t2([], { isLoaded: false, error: "Product tours not loaded" }) : this.Ri.getActiveProductTours(t2);
  }
  showProductTour(t2) {
    var i2;
    null == (i2 = this.Ri) || i2.showTourById(t2);
  }
  previewTour(t2) {
    this.Ri ? this.Ri.previewTour(t2) : this.it((() => {
      var i2;
      this.Mi(), null == (i2 = this.Ri) || i2.previewTour(t2);
    }));
  }
  dismissProductTour() {
    var t2;
    null == (t2 = this.Ri) || t2.dismissTour("user_clicked_skip");
  }
  nextStep() {
    var t2;
    null == (t2 = this.Ri) || t2.nextStep();
  }
  previousStep() {
    var t2;
    null == (t2 = this.Ri) || t2.previousStep();
  }
  clearCache() {
    var t2;
    this.Fi = null, null == (t2 = this._instance.persistence) || t2.unregister(An);
  }
  resetTour(t2) {
    var i2;
    null == (i2 = this.Ri) || i2.resetTour(t2);
  }
  resetAllTours() {
    var t2;
    null == (t2 = this.Ri) || t2.resetAllTours();
  }
  cancelPendingTour(t2) {
    var i2;
    null == (i2 = this.Ri) || i2.cancelPendingTour(t2);
  }
};
var jn = (function(t2) {
  return t2.Activation = "events", t2.Cancellation = "cancelEvents", t2;
})({});
var Ln = (function(t2) {
  return t2.Button = "button", t2.Tab = "tab", t2.Selector = "selector", t2;
})({});
var Nn = (function(t2) {
  return t2.TopLeft = "top_left", t2.TopRight = "top_right", t2.TopCenter = "top_center", t2.MiddleLeft = "middle_left", t2.MiddleRight = "middle_right", t2.MiddleCenter = "middle_center", t2.Left = "left", t2.Center = "center", t2.Right = "right", t2.NextToTrigger = "next_to_trigger", t2;
})({});
var Un = (function(t2) {
  return t2.Top = "top", t2.Left = "left", t2.Right = "right", t2.Bottom = "bottom", t2;
})({});
var zn = (function(t2) {
  return t2.Popover = "popover", t2.API = "api", t2.Widget = "widget", t2.ExternalSurvey = "external_survey", t2;
})({});
var Hn = (function(t2) {
  return t2.Open = "open", t2.MultipleChoice = "multiple_choice", t2.SingleChoice = "single_choice", t2.Rating = "rating", t2.Link = "link", t2;
})({});
var Bn = (function(t2) {
  return t2.NextQuestion = "next_question", t2.End = "end", t2.ResponseBased = "response_based", t2.SpecificQuestion = "specific_question", t2;
})({});
var qn = (function(t2) {
  return t2.Once = "once", t2.Recurring = "recurring", t2.Always = "always", t2;
})({});
var Wn = (function(t2) {
  return t2.SHOWN = "survey shown", t2.DISMISSED = "survey dismissed", t2.SENT = "survey sent", t2.ABANDONED = "survey abandoned", t2;
})({});
var Gn = (function(t2) {
  return t2.SURVEY_ID = "$survey_id", t2.SURVEY_NAME = "$survey_name", t2.SURVEY_RESPONSE = "$survey_response", t2.SURVEY_ITERATION = "$survey_iteration", t2.SURVEY_ITERATION_START_DATE = "$survey_iteration_start_date", t2.SURVEY_PARTIALLY_COMPLETED = "$survey_partially_completed", t2.SURVEY_SUBMISSION_ID = "$survey_submission_id", t2.SURVEY_QUESTIONS = "$survey_questions", t2.SURVEY_COMPLETED = "$survey_completed", t2.PRODUCT_TOUR_ID = "$product_tour_id", t2.SURVEY_LAST_SEEN_DATE = "$survey_last_seen_date", t2;
})({});
var Vn = (function(t2) {
  return t2.Popover = "popover", t2.Inline = "inline", t2;
})({});
var Jn = Si("[Surveys]");
var Kn = "seenSurvey_";
var Yn = (t2, i2) => {
  var e2 = "$survey_" + i2 + "/" + t2.id;
  return t2.current_iteration && t2.current_iteration > 0 && (e2 = "$survey_" + i2 + "/" + t2.id + "/" + t2.current_iteration), e2;
};
var Xn = (t2) => ((t3, i2) => {
  var e2 = "" + t3 + i2.id;
  return i2.current_iteration && i2.current_iteration > 0 && (e2 = "" + t3 + i2.id + "_" + i2.current_iteration), e2;
})(Kn, t2);
var Qn = [zn.Popover, zn.Widget, zn.API];
var Zn = { ignoreConditions: false, ignoreDelay: false, displayType: Vn.Popover };
var to = class {
  constructor() {
    this.Oi = {}, this.Oi = {};
  }
  on(t2, i2) {
    return this.Oi[t2] || (this.Oi[t2] = []), this.Oi[t2].push(i2), () => {
      this.Oi[t2] = this.Oi[t2].filter(((t3) => t3 !== i2));
    };
  }
  emit(t2, i2) {
    for (var e2 of this.Oi[t2] || []) e2(i2);
    for (var r2 of this.Oi["*"] || []) r2(t2, i2);
  }
};
function io(t2, i2, e2) {
  if (j(t2)) return false;
  switch (e2) {
    case "exact":
      return t2 === i2;
    case "contains":
      var r2 = i2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/_/g, ".").replace(/%/g, ".*");
      return new RegExp(r2, "i").test(t2);
    case "regex":
      try {
        return new RegExp(i2).test(t2);
      } catch (t3) {
        return false;
      }
    default:
      return false;
  }
}
var eo = class {
  constructor(t2) {
    this.Ai = new to(), this.Di = (t3, i2) => this.ji(t3, i2) && this.Li(t3, i2) && this.Ni(t3, i2) && this.Ui(t3, i2), this.ji = (t3, i2) => null == i2 || !i2.event || (null == t3 ? void 0 : t3.event) === (null == i2 ? void 0 : i2.event), this._instance = t2, this.zi = /* @__PURE__ */ new Set(), this.Hi = /* @__PURE__ */ new Set();
  }
  init() {
    var t2;
    if (!M(null == (t2 = this._instance) ? void 0 : t2.Bi)) {
      var i2;
      null == (i2 = this._instance) || i2.Bi(((t3, i3) => {
        this.on(t3, i3);
      }));
    }
  }
  register(t2) {
    var i2, e2;
    if (!M(null == (i2 = this._instance) ? void 0 : i2.Bi) && (t2.forEach(((t3) => {
      var i3, e3;
      null == (i3 = this.Hi) || i3.add(t3), null == (e3 = t3.steps) || e3.forEach(((t4) => {
        var i4;
        null == (i4 = this.zi) || i4.add((null == t4 ? void 0 : t4.event) || "");
      }));
    })), null != (e2 = this._instance) && e2.autocapture)) {
      var r2, s2 = /* @__PURE__ */ new Set();
      t2.forEach(((t3) => {
        var i3;
        null == (i3 = t3.steps) || i3.forEach(((t4) => {
          null != t4 && t4.selector && s2.add(null == t4 ? void 0 : t4.selector);
        }));
      })), null == (r2 = this._instance) || r2.autocapture.setElementSelectors(s2);
    }
  }
  on(t2, i2) {
    var e2;
    null != i2 && 0 != t2.length && (this.zi.has(t2) || this.zi.has(null == i2 ? void 0 : i2.event)) && this.Hi && (null == (e2 = this.Hi) ? void 0 : e2.size) > 0 && this.Hi.forEach(((t3) => {
      this.qi(i2, t3) && this.Ai.emit("actionCaptured", t3.name);
    }));
  }
  Wi(t2) {
    this.onAction("actionCaptured", ((i2) => t2(i2)));
  }
  qi(t2, i2) {
    if (null == (null == i2 ? void 0 : i2.steps)) return false;
    for (var e2 of i2.steps) if (this.Di(t2, e2)) return true;
    return false;
  }
  onAction(t2, i2) {
    return this.Ai.on(t2, i2);
  }
  Li(t2, i2) {
    if (null != i2 && i2.url) {
      var e2, r2 = null == t2 || null == (e2 = t2.properties) ? void 0 : e2.$current_url;
      if (!r2 || "string" != typeof r2) return false;
      if (!io(r2, i2.url, i2.url_matching || "contains")) return false;
    }
    return true;
  }
  Ni(t2, i2) {
    return !!this.Gi(t2, i2) && (!!this.Vi(t2, i2) && !!this.Ji(t2, i2));
  }
  Gi(t2, i2) {
    var e2;
    if (null == i2 || !i2.href) return true;
    var r2 = this.Ki(t2);
    if (r2.length > 0) return r2.some(((t3) => io(t3.href, i2.href, i2.href_matching || "exact")));
    var s2, n2 = (null == t2 || null == (e2 = t2.properties) ? void 0 : e2.$elements_chain) || "";
    return !!n2 && io((s2 = n2.match(/(?::|")href="(.*?)"/)) ? s2[1] : "", i2.href, i2.href_matching || "exact");
  }
  Vi(t2, i2) {
    var e2;
    if (null == i2 || !i2.text) return true;
    var r2 = this.Ki(t2);
    if (r2.length > 0) return r2.some(((t3) => io(t3.text, i2.text, i2.text_matching || "exact") || io(t3.$el_text, i2.text, i2.text_matching || "exact")));
    var s2, n2, o2, a2 = (null == t2 || null == (e2 = t2.properties) ? void 0 : e2.$elements_chain) || "";
    return !!a2 && (s2 = (function(t3) {
      for (var i3, e3 = [], r3 = /(?::|")text="(.*?)"/g; !j(i3 = r3.exec(t3)); ) e3.includes(i3[1]) || e3.push(i3[1]);
      return e3;
    })(a2), n2 = i2.text, o2 = i2.text_matching || "exact", s2.some(((t3) => io(t3, n2, o2))));
  }
  Ji(t2, i2) {
    var e2, r2;
    if (null == i2 || !i2.selector) return true;
    var s2 = null == t2 || null == (e2 = t2.properties) ? void 0 : e2.$element_selectors;
    if (null != s2 && s2.includes(i2.selector)) return true;
    var n2 = (null == t2 || null == (r2 = t2.properties) ? void 0 : r2.$elements_chain) || "";
    if (i2.selector_regex && n2) try {
      return new RegExp(i2.selector_regex).test(n2);
    } catch (t3) {
      return false;
    }
    return false;
  }
  Ki(t2) {
    var i2;
    return null == (null == t2 || null == (i2 = t2.properties) ? void 0 : i2.$elements) ? [] : null == t2 ? void 0 : t2.properties.$elements;
  }
  Ui(t2, i2) {
    return null == i2 || !i2.properties || 0 === i2.properties.length || _n(i2.properties.reduce(((t3, i3) => {
      var e2 = I(i3.value) ? i3.value.map(String) : null != i3.value ? [String(i3.value)] : [];
      return t3[i3.key] = { values: e2, operator: i3.operator || "exact" }, t3;
    }), {}), null == t2 ? void 0 : t2.properties);
  }
};
var ro = class {
  constructor(t2) {
    this._instance = t2, this.Yi = /* @__PURE__ */ new Map(), this.Xi = /* @__PURE__ */ new Map(), this.Qi = /* @__PURE__ */ new Map();
  }
  Zi(t2, i2) {
    return !!t2 && _n(t2.propertyFilters, null == i2 ? void 0 : i2.properties);
  }
  te(t2, i2) {
    var e2 = /* @__PURE__ */ new Map();
    return t2.forEach(((t3) => {
      var r2;
      null == (r2 = t3.conditions) || null == (r2 = r2[i2]) || null == (r2 = r2.values) || r2.forEach(((i3) => {
        if (null != i3 && i3.name) {
          var r3 = e2.get(i3.name) || [];
          r3.push(t3.id), e2.set(i3.name, r3);
        }
      }));
    })), e2;
  }
  ie(t2, i2, e2) {
    var r2 = (e2 === jn.Activation ? this.Yi : this.Xi).get(t2), s2 = [];
    return this.ee(((t3) => {
      s2 = t3.filter(((t4) => null == r2 ? void 0 : r2.includes(t4.id)));
    })), s2.filter(((r3) => {
      var s3, n2 = null == (s3 = r3.conditions) || null == (s3 = s3[e2]) || null == (s3 = s3.values) ? void 0 : s3.find(((i3) => i3.name === t2));
      return this.Zi(n2, i2);
    }));
  }
  register(t2) {
    var i2;
    M(null == (i2 = this._instance) ? void 0 : i2.Bi) || (this.re(t2), this.se(t2));
  }
  se(t2) {
    var i2 = t2.filter(((t3) => {
      var i3, e2;
      return (null == (i3 = t3.conditions) ? void 0 : i3.actions) && (null == (e2 = t3.conditions) || null == (e2 = e2.actions) || null == (e2 = e2.values) ? void 0 : e2.length) > 0;
    }));
    if (0 !== i2.length) {
      if (null == this.ne) {
        this.ne = new eo(this._instance), this.ne.init();
        this.ne.Wi(((t3) => {
          this.onAction(t3);
        }));
      }
      i2.forEach(((t3) => {
        var i3, e2, r2, s2, n2;
        t3.conditions && null != (i3 = t3.conditions) && i3.actions && null != (e2 = t3.conditions) && null != (e2 = e2.actions) && e2.values && (null == (r2 = t3.conditions) || null == (r2 = r2.actions) || null == (r2 = r2.values) ? void 0 : r2.length) > 0 && (null == (s2 = this.ne) || s2.register(t3.conditions.actions.values), null == (n2 = t3.conditions) || null == (n2 = n2.actions) || null == (n2 = n2.values) || n2.forEach(((i4) => {
          if (i4 && i4.name) {
            var e3 = this.Qi.get(i4.name);
            e3 && e3.push(t3.id), this.Qi.set(i4.name, e3 || [t3.id]);
          }
        })));
      }));
    }
  }
  re(t2) {
    var i2, e2 = t2.filter(((t3) => {
      var i3, e3;
      return (null == (i3 = t3.conditions) ? void 0 : i3.events) && (null == (e3 = t3.conditions) || null == (e3 = e3.events) || null == (e3 = e3.values) ? void 0 : e3.length) > 0;
    })), r2 = t2.filter(((t3) => {
      var i3, e3;
      return (null == (i3 = t3.conditions) ? void 0 : i3.cancelEvents) && (null == (e3 = t3.conditions) || null == (e3 = e3.cancelEvents) || null == (e3 = e3.values) ? void 0 : e3.length) > 0;
    }));
    if (0 !== e2.length || 0 !== r2.length) {
      null == (i2 = this._instance) || i2.Bi(((t3, i3) => {
        this.onEvent(t3, i3);
      })), this.Yi = this.te(t2, jn.Activation), this.Xi = this.te(t2, jn.Cancellation);
    }
  }
  onEvent(t2, i2) {
    var e2, r2 = this.oe(), s2 = this.ae(), n2 = this.le(), o2 = (null == (e2 = this._instance) || null == (e2 = e2.persistence) ? void 0 : e2.props[s2]) || [];
    if (n2 === t2 && i2 && o2.length > 0) {
      var a2, l2;
      r2.info("event matched, removing item from activated items", { event: t2, eventPayload: i2, existingActivatedItems: o2 });
      var u2 = (null == i2 || null == (a2 = i2.properties) ? void 0 : a2.$survey_id) || (null == i2 || null == (l2 = i2.properties) ? void 0 : l2.$product_tour_id);
      if (u2) {
        var h3 = o2.indexOf(u2);
        h3 >= 0 && (o2.splice(h3, 1), this.ue(o2));
      }
    } else {
      if (this.Xi.has(t2)) {
        var d2 = this.ie(t2, i2, jn.Cancellation);
        d2.length > 0 && (r2.info("cancel event matched, cancelling items", { event: t2, itemsToCancel: d2.map(((t3) => t3.id)) }), d2.forEach(((t3) => {
          var i3 = o2.indexOf(t3.id);
          i3 >= 0 && o2.splice(i3, 1), this.he(t3.id);
        })), this.ue(o2));
      }
      if (this.Yi.has(t2)) {
        r2.info("event name matched", { event: t2, eventPayload: i2, items: this.Yi.get(t2) });
        var v2 = this.ie(t2, i2, jn.Activation);
        this.ue(o2.concat(v2.map(((t3) => t3.id)) || []));
      }
    }
  }
  onAction(t2) {
    var i2, e2 = this.ae(), r2 = (null == (i2 = this._instance) || null == (i2 = i2.persistence) ? void 0 : i2.props[e2]) || [];
    this.Qi.has(t2) && this.ue(r2.concat(this.Qi.get(t2) || []));
  }
  ue(t2) {
    var i2, e2 = this.oe(), r2 = this.ae(), s2 = [...new Set(t2)].filter(((t3) => !this.de(t3)));
    e2.info("updating activated items", { activatedItems: s2 }), null == (i2 = this._instance) || null == (i2 = i2.persistence) || i2.register({ [r2]: s2 });
  }
  getActivatedIds() {
    var t2, i2 = this.ae(), e2 = null == (t2 = this._instance) || null == (t2 = t2.persistence) ? void 0 : t2.props[i2];
    return e2 || [];
  }
  getEventToItemsMap() {
    return this.Yi;
  }
  ve() {
    return this.ne;
  }
};
var so = class extends ro {
  constructor(t2) {
    super(t2);
  }
  ae() {
    return "$surveys_activated";
  }
  le() {
    return Wn.SHOWN;
  }
  ee(t2) {
    var i2;
    null == (i2 = this._instance) || i2.getSurveys(t2);
  }
  he(t2) {
    var i2;
    null == (i2 = this._instance) || i2.cancelPendingSurvey(t2);
  }
  oe() {
    return Jn;
  }
  de() {
    return false;
  }
  getSurveys() {
    return this.getActivatedIds();
  }
  getEventToSurveys() {
    return this.getEventToItemsMap();
  }
};
var no = class {
  constructor(t2) {
    this.ce = void 0, this._surveyManager = null, this.fe = false, this.pe = [], this.ge = null, this._instance = t2, this._surveyEventReceiver = null;
  }
  onRemoteConfig(t2) {
    if (!this._instance.config.disable_surveys) {
      var i2 = t2.surveys;
      if (j(i2)) return Jn.warn("Flags not loaded yet. Not loading surveys.");
      var e2 = I(i2);
      this.ce = e2 ? i2.length > 0 : i2, Jn.info("flags response received, isSurveysEnabled: " + this.ce), this.loadIfEnabled();
    }
  }
  reset() {
    localStorage.removeItem("lastSeenSurveyDate");
    for (var t2 = [], i2 = 0; i2 < localStorage.length; i2++) {
      var e2 = localStorage.key(i2);
      (null != e2 && e2.startsWith(Kn) || null != e2 && e2.startsWith("inProgressSurvey_")) && t2.push(e2);
    }
    t2.forEach(((t3) => localStorage.removeItem(t3)));
  }
  loadIfEnabled() {
    if (!this._surveyManager) if (this.fe) Jn.info("Already initializing surveys, skipping...");
    else if (this._instance.config.disable_surveys) Jn.info("Disabled. Not loading surveys.");
    else if (this._instance.config.cookieless_mode && this._instance.consent.isOptedOut()) Jn.info("Not loading surveys in cookieless mode without consent.");
    else {
      var t2 = null == v ? void 0 : v.__PosthogExtensions__;
      if (t2) {
        if (!M(this.ce) || this._instance.config.advanced_enable_surveys) {
          var i2 = this.ce || this._instance.config.advanced_enable_surveys;
          this.fe = true;
          try {
            var e2 = t2.generateSurveys;
            if (e2) return void this._e(e2, i2);
            var r2 = t2.loadExternalDependency;
            if (!r2) return void this.me("PostHog loadExternalDependency extension not found.");
            r2(this._instance, "surveys", ((e3) => {
              e3 || !t2.generateSurveys ? this.me("Could not load surveys script", e3) : this._e(t2.generateSurveys, i2);
            }));
          } catch (t3) {
            throw this.me("Error initializing surveys", t3), t3;
          } finally {
            this.fe = false;
          }
        }
      } else Jn.error("PostHog Extensions not found.");
    }
  }
  _e(t2, i2) {
    this._surveyManager = t2(this._instance, i2), this._surveyEventReceiver = new so(this._instance), Jn.info("Surveys loaded successfully"), this.ye({ isLoaded: true });
  }
  me(t2, i2) {
    Jn.error(t2, i2), this.ye({ isLoaded: false, error: t2 });
  }
  onSurveysLoaded(t2) {
    return this.pe.push(t2), this._surveyManager && this.ye({ isLoaded: true }), () => {
      this.pe = this.pe.filter(((i2) => i2 !== t2));
    };
  }
  getSurveys(t2, i2) {
    if (void 0 === i2 && (i2 = false), this._instance.config.disable_surveys) return Jn.info("Disabled. Not loading surveys."), t2([]);
    var e2, r2 = this._instance.get_property(le);
    if (r2 && !i2) return t2(r2, { isLoaded: true });
    "undefined" != typeof Promise && this.ge ? this.ge.then(((i3) => {
      var { surveys: e3, context: r3 } = i3;
      return t2(e3, r3);
    })) : ("undefined" != typeof Promise && (this.ge = new Promise(((t3) => {
      e2 = t3;
    }))), this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/surveys/?token=" + this._instance.config.token), method: "GET", timeout: this._instance.config.surveys_request_timeout_ms, callback: (i3) => {
      var r3;
      this.ge = null;
      var s2 = i3.statusCode;
      if (200 !== s2 || !i3.json) {
        var n2 = "Surveys API could not be loaded, status: " + s2;
        Jn.error(n2);
        var o2 = { isLoaded: false, error: n2 };
        return t2([], o2), void (null == e2 || e2({ surveys: [], context: o2 }));
      }
      var a2, l2 = i3.json.surveys || [], u2 = l2.filter(((t3) => (function(t4) {
        return !(!t4.start_date || t4.end_date);
      })(t3) && ((function(t4) {
        var i4;
        return !(null == (i4 = t4.conditions) || null == (i4 = i4.events) || null == (i4 = i4.values) || !i4.length);
      })(t3) || (function(t4) {
        var i4;
        return !(null == (i4 = t4.conditions) || null == (i4 = i4.actions) || null == (i4 = i4.values) || !i4.length);
      })(t3))));
      u2.length > 0 && (null == (a2 = this._surveyEventReceiver) || a2.register(u2));
      null == (r3 = this._instance.persistence) || r3.register({ [le]: l2 });
      var h3 = { isLoaded: true };
      t2(l2, h3), null == e2 || e2({ surveys: l2, context: h3 });
    } }));
  }
  ye(t2) {
    for (var i2 of this.pe) try {
      if (!t2.isLoaded) return i2([], t2);
      this.getSurveys(i2);
    } catch (t3) {
      Jn.error("Error in survey callback", t3);
    }
  }
  getActiveMatchingSurveys(t2, i2) {
    if (void 0 === i2 && (i2 = false), !j(this._surveyManager)) return this._surveyManager.getActiveMatchingSurveys(t2, i2);
    Jn.warn("init was not called");
  }
  be(t2) {
    var i2 = null;
    return this.getSurveys(((e2) => {
      var r2;
      i2 = null !== (r2 = e2.find(((i3) => i3.id === t2))) && void 0 !== r2 ? r2 : null;
    })), i2;
  }
  we(t2) {
    if (j(this._surveyManager)) return { eligible: false, reason: "SDK is not enabled or survey functionality is not yet loaded" };
    var i2 = "string" == typeof t2 ? this.be(t2) : t2;
    return i2 ? this._surveyManager.checkSurveyEligibility(i2) : { eligible: false, reason: "Survey not found" };
  }
  canRenderSurvey(t2) {
    if (j(this._surveyManager)) return Jn.warn("init was not called"), { visible: false, disabledReason: "SDK is not enabled or survey functionality is not yet loaded" };
    var i2 = this.we(t2);
    return { visible: i2.eligible, disabledReason: i2.reason };
  }
  canRenderSurveyAsync(t2, i2) {
    return j(this._surveyManager) ? (Jn.warn("init was not called"), Promise.resolve({ visible: false, disabledReason: "SDK is not enabled or survey functionality is not yet loaded" })) : new Promise(((e2) => {
      this.getSurveys(((i3) => {
        var r2, s2 = null !== (r2 = i3.find(((i4) => i4.id === t2))) && void 0 !== r2 ? r2 : null;
        if (s2) {
          var n2 = this.we(s2);
          e2({ visible: n2.eligible, disabledReason: n2.reason });
        } else e2({ visible: false, disabledReason: "Survey not found" });
      }), i2);
    }));
  }
  renderSurvey(t2, i2, e2) {
    var r2;
    if (j(this._surveyManager)) Jn.warn("init was not called");
    else {
      var s2 = "string" == typeof t2 ? this.be(t2) : t2;
      if (null != s2 && s2.id) if (Qn.includes(s2.type)) {
        var n2 = null == o ? void 0 : o.querySelector(i2);
        if (n2) return null != (r2 = s2.appearance) && r2.surveyPopupDelaySeconds ? (Jn.info("Rendering survey " + s2.id + " with delay of " + s2.appearance.surveyPopupDelaySeconds + " seconds"), void setTimeout((() => {
          var t3, i3;
          Jn.info("Rendering survey " + s2.id + " with delay of " + (null == (t3 = s2.appearance) ? void 0 : t3.surveyPopupDelaySeconds) + " seconds"), null == (i3 = this._surveyManager) || i3.renderSurvey(s2, n2, e2), Jn.info("Survey " + s2.id + " rendered");
        }), 1e3 * s2.appearance.surveyPopupDelaySeconds)) : void this._surveyManager.renderSurvey(s2, n2, e2);
        Jn.warn("Survey element not found");
      } else Jn.warn("Surveys of type " + s2.type + " cannot be rendered in the app");
      else Jn.warn("Survey not found");
    }
  }
  displaySurvey(t2, i2) {
    var e2;
    if (j(this._surveyManager)) Jn.warn("init was not called");
    else {
      var r2 = this.be(t2);
      if (r2) {
        var s2 = r2;
        if (null != (e2 = r2.appearance) && e2.surveyPopupDelaySeconds && i2.ignoreDelay && (s2 = g({}, r2, { appearance: g({}, r2.appearance, { surveyPopupDelaySeconds: 0 }) })), i2.displayType !== Vn.Popover && i2.initialResponses && Jn.warn("initialResponses is only supported for popover surveys. prefill will not be applied."), false === i2.ignoreConditions) {
          var n2 = this.canRenderSurvey(r2);
          if (!n2.visible) return void Jn.warn("Survey is not eligible to be displayed: ", n2.disabledReason);
        }
        i2.displayType !== Vn.Inline ? this._surveyManager.handlePopoverSurvey(s2, i2) : this.renderSurvey(s2, i2.selector, i2.properties);
      } else Jn.warn("Survey not found");
    }
  }
  cancelPendingSurvey(t2) {
    j(this._surveyManager) ? Jn.warn("init was not called") : this._surveyManager.cancelSurvey(t2);
  }
  handlePageUnload() {
    var t2;
    null == (t2 = this._surveyManager) || t2.handlePageUnload();
  }
};
var oo = Si("[Conversations]");
var ao = class {
  constructor(t2) {
    this.xe = void 0, this._conversationsManager = null, this.Ee = false, this.$e = null, this._instance = t2;
  }
  onRemoteConfig(t2) {
    if (!this._instance.config.disable_conversations) {
      var i2 = t2.conversations;
      j(i2) || (U(i2) ? this.xe = i2 : (this.xe = i2.enabled, this.$e = i2), this.loadIfEnabled());
    }
  }
  reset() {
    var t2;
    null == (t2 = this._conversationsManager) || t2.reset(), this._conversationsManager = null, this.xe = void 0, this.$e = null;
  }
  loadIfEnabled() {
    if (!this._conversationsManager && !this.Ee && !(this._instance.config.disable_conversations || this._instance.config.cookieless_mode && this._instance.consent.isOptedOut())) {
      var t2 = null == v ? void 0 : v.__PosthogExtensions__;
      if (t2 && !M(this.xe) && this.xe) if (this.$e && this.$e.token) {
        this.Ee = true;
        try {
          var i2 = t2.initConversations;
          if (i2) return this.Se(i2), void (this.Ee = false);
          var e2 = t2.loadExternalDependency;
          if (!e2) return void this.ke("PostHog loadExternalDependency extension not found.");
          e2(this._instance, "conversations", ((i3) => {
            i3 || !t2.initConversations ? this.ke("Could not load conversations script", i3) : this.Se(t2.initConversations), this.Ee = false;
          }));
        } catch (t3) {
          this.ke("Error initializing conversations", t3), this.Ee = false;
        }
      } else oo.error("Conversations enabled but missing token in remote config.");
    }
  }
  Se(t2) {
    if (this.$e) try {
      this._conversationsManager = t2(this.$e, this._instance), oo.info("Conversations loaded successfully");
    } catch (t3) {
      this.ke("Error completing conversations initialization", t3);
    }
    else oo.error("Cannot complete initialization: remote config is null");
  }
  ke(t2, i2) {
    oo.error(t2, i2), this._conversationsManager = null, this.Ee = false;
  }
  show() {
    this._conversationsManager ? this._conversationsManager.show() : oo.warn("Conversations not loaded yet.");
  }
  hide() {
    this._conversationsManager && this._conversationsManager.hide();
  }
  isAvailable() {
    return true === this.xe && !D(this._conversationsManager);
  }
  isVisible() {
    var t2, i2;
    return null !== (t2 = null == (i2 = this._conversationsManager) ? void 0 : i2.isVisible()) && void 0 !== t2 && t2;
  }
  sendMessage(t2, i2, e2) {
    var r2 = this;
    return p((function* () {
      return r2._conversationsManager ? r2._conversationsManager.sendMessage(t2, i2, e2) : (oo.warn("Conversations not available yet."), null);
    }))();
  }
  getMessages(t2, i2) {
    var e2 = this;
    return p((function* () {
      return e2._conversationsManager ? e2._conversationsManager.getMessages(t2, i2) : (oo.warn("Conversations not available yet."), null);
    }))();
  }
  markAsRead(t2) {
    var i2 = this;
    return p((function* () {
      return i2._conversationsManager ? i2._conversationsManager.markAsRead(t2) : (oo.warn("Conversations not available yet."), null);
    }))();
  }
  getTickets(t2) {
    var i2 = this;
    return p((function* () {
      return i2._conversationsManager ? i2._conversationsManager.getTickets(t2) : (oo.warn("Conversations not available yet."), null);
    }))();
  }
  getCurrentTicketId() {
    var t2, i2;
    return null !== (t2 = null == (i2 = this._conversationsManager) ? void 0 : i2.getCurrentTicketId()) && void 0 !== t2 ? t2 : null;
  }
  getWidgetSessionId() {
    var t2, i2;
    return null !== (t2 = null == (i2 = this._conversationsManager) ? void 0 : i2.getWidgetSessionId()) && void 0 !== t2 ? t2 : null;
  }
};
var lo = class {
  constructor(t2) {
    var i2;
    this.Pe = false, this.Te = false, this._instance = t2, this._instance && null != (i2 = this._instance.config.logs) && i2.captureConsoleLogs && (this.Pe = true);
  }
  onRemoteConfig(t2) {
    var i2, e2 = null == (i2 = t2.logs) ? void 0 : i2.captureConsoleLogs;
    !j(e2) && e2 && (this.Pe = true, this.loadIfEnabled());
  }
  reset() {
  }
  loadIfEnabled() {
    if (this.Pe && !this.Te) {
      var t2 = Si("[logs]"), i2 = null == v ? void 0 : v.__PosthogExtensions__;
      if (i2) {
        var e2 = i2.loadExternalDependency;
        e2 ? e2(this._instance, "logs", ((e3) => {
          var r2;
          e3 || null == (r2 = i2.logs) || !r2.initializeLogs ? t2.error("Could not load logs script", e3) : (i2.logs.initializeLogs(this._instance), this.Te = true);
        })) : t2.error("PostHog loadExternalDependency extension not found.");
      } else t2.error("PostHog Extensions not found.");
    }
  }
};
var uo = Si("[RateLimiter]");
var ho = class {
  constructor(t2) {
    this.serverLimits = {}, this.lastEventRateLimited = false, this.checkForLimiting = (t3) => {
      var i2 = t3.text;
      if (i2 && i2.length) try {
        (JSON.parse(i2).quota_limited || []).forEach(((t4) => {
          uo.info((t4 || "events") + " is quota limited."), this.serverLimits[t4] = (/* @__PURE__ */ new Date()).getTime() + 6e4;
        }));
      } catch (t4) {
        return void uo.warn('could not rate limit - continuing. Error: "' + (null == t4 ? void 0 : t4.message) + '"', { text: i2 });
      }
    }, this.instance = t2, this.lastEventRateLimited = this.clientRateLimitContext(true).isRateLimited;
  }
  get captureEventsPerSecond() {
    var t2;
    return (null == (t2 = this.instance.config.rate_limiting) ? void 0 : t2.events_per_second) || 10;
  }
  get captureEventsBurstLimit() {
    var t2;
    return Math.max((null == (t2 = this.instance.config.rate_limiting) ? void 0 : t2.events_burst_limit) || 10 * this.captureEventsPerSecond, this.captureEventsPerSecond);
  }
  clientRateLimitContext(t2) {
    var i2, e2, r2;
    void 0 === t2 && (t2 = false);
    var { captureEventsBurstLimit: s2, captureEventsPerSecond: n2 } = this, o2 = (/* @__PURE__ */ new Date()).getTime(), a2 = null !== (i2 = null == (e2 = this.instance.persistence) ? void 0 : e2.get_property(ve)) && void 0 !== i2 ? i2 : { tokens: s2, last: o2 };
    a2.tokens += (o2 - a2.last) / 1e3 * n2, a2.last = o2, a2.tokens > s2 && (a2.tokens = s2);
    var l2 = a2.tokens < 1;
    return l2 || t2 || (a2.tokens = Math.max(0, a2.tokens - 1)), !l2 || this.lastEventRateLimited || t2 || this.instance.capture("$$client_ingestion_warning", { $$client_ingestion_warning_message: "posthog-js client rate limited. Config is set to " + n2 + " events per second and " + s2 + " events burst limit." }, { skip_client_rate_limiting: true }), this.lastEventRateLimited = l2, null == (r2 = this.instance.persistence) || r2.set_property(ve, a2), { isRateLimited: l2, remainingTokens: a2.tokens };
  }
  isServerRateLimited(t2) {
    var i2 = this.serverLimits[t2 || "events"] || false;
    return false !== i2 && (/* @__PURE__ */ new Date()).getTime() < i2;
  }
};
var vo = Si("[RemoteConfig]");
var co = class {
  constructor(t2) {
    this._instance = t2;
  }
  get remoteConfig() {
    var t2;
    return null == (t2 = v._POSTHOG_REMOTE_CONFIG) || null == (t2 = t2[this._instance.config.token]) ? void 0 : t2.config;
  }
  Ie(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.loadExternalDependency ? null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, "remote-config", (() => t2(this.remoteConfig))) : (vo.error("PostHog Extensions not found. Cannot load remote config."), t2());
  }
  Ce(t2) {
    this._instance._send_request({ method: "GET", url: this._instance.requestRouter.endpointFor("assets", "/array/" + this._instance.config.token + "/config"), callback: (i2) => {
      t2(i2.json);
    } });
  }
  load() {
    try {
      if (this.remoteConfig) return vo.info("Using preloaded remote config", this.remoteConfig), void this.bi(this.remoteConfig);
      if (this._instance.O()) return void vo.warn("Remote config is disabled. Falling back to local config.");
      this.Ie(((t2) => {
        if (!t2) return vo.info("No config found after loading remote JS config. Falling back to JSON."), void this.Ce(((t3) => {
          this.bi(t3);
        }));
        this.bi(t2);
      }));
    } catch (t2) {
      vo.error("Error loading remote config", t2);
    }
  }
  bi(t2) {
    t2 ? this._instance.config.__preview_remote_config ? (this._instance.bi(t2), false !== t2.hasFeatureFlags && this._instance.featureFlags.ensureFlagsLoaded()) : vo.info("__preview_remote_config is disabled. Logging config instead", t2) : vo.error("Failed to fetch remote config from PostHog.");
  }
};
var fo = 3e3;
var po = class {
  constructor(t2, i2) {
    this.Re = true, this.Fe = [], this.Me = K((null == i2 ? void 0 : i2.flush_interval_ms) || fo, 250, 5e3, $i.createLogger("flush interval"), fo), this.Oe = t2;
  }
  enqueue(t2) {
    this.Fe.push(t2), this.Ae || this.De();
  }
  unload() {
    this.je();
    var t2 = this.Fe.length > 0 ? this.Le() : {}, i2 = Object.values(t2);
    [...i2.filter(((t3) => 0 === t3.url.indexOf("/e"))), ...i2.filter(((t3) => 0 !== t3.url.indexOf("/e")))].map(((t3) => {
      this.Oe(g({}, t3, { transport: "sendBeacon" }));
    }));
  }
  enable() {
    this.Re = false, this.De();
  }
  De() {
    var t2 = this;
    this.Re || (this.Ae = setTimeout((() => {
      if (this.je(), this.Fe.length > 0) {
        var i2 = this.Le(), e2 = function() {
          var e3 = i2[r2], s2 = (/* @__PURE__ */ new Date()).getTime();
          e3.data && I(e3.data) && Ci(e3.data, ((t3) => {
            t3.offset = Math.abs(t3.timestamp - s2), delete t3.timestamp;
          })), t2.Oe(e3);
        };
        for (var r2 in i2) e2();
      }
    }), this.Me));
  }
  je() {
    clearTimeout(this.Ae), this.Ae = void 0;
  }
  Le() {
    var t2 = {};
    return Ci(this.Fe, ((i2) => {
      var e2, r2 = i2, s2 = (r2 ? r2.batchKey : null) || r2.url;
      M(t2[s2]) && (t2[s2] = g({}, r2, { data: [] })), null == (e2 = t2[s2].data) || e2.push(r2.data);
    })), this.Fe = [], t2;
  }
};
var go = ["retriesPerformedSoFar"];
var _o = class {
  constructor(i2) {
    this.Ne = false, this.Ue = 3e3, this.Fe = [], this._instance = i2, this.Fe = [], this.ze = true, !M(t) && "onLine" in t.navigator && (this.ze = t.navigator.onLine, this.He = () => {
      this.ze = true, this.Lt();
    }, this.Be = () => {
      this.ze = false;
    }, zi(t, "online", this.He), zi(t, "offline", this.Be));
  }
  get length() {
    return this.Fe.length;
  }
  retriableRequest(t2) {
    var { retriesPerformedSoFar: i2 } = t2, e2 = _(t2, go);
    N(i2) && (e2.url = un(e2.url, { retry_count: i2 })), this._instance._send_request(g({}, e2, { callback: (t3) => {
      200 !== t3.statusCode && (t3.statusCode < 400 || t3.statusCode >= 500) && (null != i2 ? i2 : 0) < 10 ? this.qe(g({ retriesPerformedSoFar: i2 }, e2)) : null == e2.callback || e2.callback(t3);
    } }));
  }
  qe(t2) {
    var i2 = t2.retriesPerformedSoFar || 0;
    t2.retriesPerformedSoFar = i2 + 1;
    var e2 = (function(t3) {
      var i3 = 3e3 * Math.pow(2, t3), e3 = i3 / 2, r3 = Math.min(18e5, i3), s3 = (Math.random() - 0.5) * (r3 - e3);
      return Math.ceil(r3 + s3);
    })(i2), r2 = Date.now() + e2;
    this.Fe.push({ retryAt: r2, requestOptions: t2 });
    var s2 = "Enqueued failed request for retry in " + e2;
    navigator.onLine || (s2 += " (Browser is offline)"), $i.warn(s2), this.Ne || (this.Ne = true, this.We());
  }
  We() {
    if (this.Ge && clearTimeout(this.Ge), 0 === this.Fe.length) return this.Ne = false, void (this.Ge = void 0);
    this.Ge = setTimeout((() => {
      this.ze && this.Fe.length > 0 && this.Lt(), this.We();
    }), this.Ue);
  }
  Lt() {
    var t2 = Date.now(), i2 = [], e2 = this.Fe.filter(((e3) => e3.retryAt < t2 || (i2.push(e3), false)));
    if (this.Fe = i2, e2.length > 0) for (var { requestOptions: r2 } of e2) this.retriableRequest(r2);
  }
  unload() {
    for (var { requestOptions: i2 } of (this.Ge && (clearTimeout(this.Ge), this.Ge = void 0), this.Ne = false, M(t) || (this.He && (t.removeEventListener("online", this.He), this.He = void 0), this.Be && (t.removeEventListener("offline", this.Be), this.Be = void 0)), this.Fe)) try {
      this._instance._send_request(g({}, i2, { transport: "sendBeacon" }));
    } catch (t2) {
      $i.error(t2);
    }
    this.Fe = [];
  }
};
var mo = class {
  constructor(t2) {
    this.Ve = () => {
      var t3, i2, e2, r2;
      this.Je || (this.Je = {});
      var s2 = this.scrollElement(), n2 = this.scrollY(), o2 = s2 ? Math.max(0, s2.scrollHeight - s2.clientHeight) : 0, a2 = n2 + ((null == s2 ? void 0 : s2.clientHeight) || 0), l2 = (null == s2 ? void 0 : s2.scrollHeight) || 0;
      this.Je.lastScrollY = Math.ceil(n2), this.Je.maxScrollY = Math.max(n2, null !== (t3 = this.Je.maxScrollY) && void 0 !== t3 ? t3 : 0), this.Je.maxScrollHeight = Math.max(o2, null !== (i2 = this.Je.maxScrollHeight) && void 0 !== i2 ? i2 : 0), this.Je.lastContentY = a2, this.Je.maxContentY = Math.max(a2, null !== (e2 = this.Je.maxContentY) && void 0 !== e2 ? e2 : 0), this.Je.maxContentHeight = Math.max(l2, null !== (r2 = this.Je.maxContentHeight) && void 0 !== r2 ? r2 : 0);
    }, this._instance = t2;
  }
  getContext() {
    return this.Je;
  }
  resetContext() {
    var t2 = this.Je;
    return setTimeout(this.Ve, 0), t2;
  }
  startMeasuringScrollPosition() {
    zi(t, "scroll", this.Ve, { capture: true }), zi(t, "scrollend", this.Ve, { capture: true }), zi(t, "resize", this.Ve);
  }
  scrollElement() {
    if (!this._instance.config.scroll_root_selector) return null == t ? void 0 : t.document.documentElement;
    var i2 = I(this._instance.config.scroll_root_selector) ? this._instance.config.scroll_root_selector : [this._instance.config.scroll_root_selector];
    for (var e2 of i2) {
      var r2 = null == t ? void 0 : t.document.querySelector(e2);
      if (r2) return r2;
    }
  }
  scrollY() {
    if (this._instance.config.scroll_root_selector) {
      var i2 = this.scrollElement();
      return i2 && i2.scrollTop || 0;
    }
    return t && (t.scrollY || t.pageYOffset || t.document.documentElement.scrollTop) || 0;
  }
  scrollX() {
    if (this._instance.config.scroll_root_selector) {
      var i2 = this.scrollElement();
      return i2 && i2.scrollLeft || 0;
    }
    return t && (t.scrollX || t.pageXOffset || t.document.documentElement.scrollLeft) || 0;
  }
};
var yo = (t2) => ds(null == t2 ? void 0 : t2.config.mask_personal_data_properties, null == t2 ? void 0 : t2.config.custom_personal_data_properties);
var bo = class {
  constructor(t2, i2, e2, r2) {
    this.Ke = (t3) => {
      var i3 = this.Ye();
      if (!i3 || i3.sessionId !== t3) {
        var e3 = { sessionId: t3, props: this.Xe(this._instance) };
        this.Qe.register({ [de]: e3 });
      }
    }, this._instance = t2, this.Ze = i2, this.Qe = e2, this.Xe = r2 || yo, this.Ze.onSessionId(this.Ke);
  }
  Ye() {
    return this.Qe.props[de];
  }
  getSetOnceProps() {
    var t2, i2 = null == (t2 = this.Ye()) ? void 0 : t2.props;
    return i2 ? "r" in i2 ? vs(i2) : { $referring_domain: i2.referringDomain, $pathname: i2.initialPathName, utm_source: i2.utm_source, utm_campaign: i2.utm_campaign, utm_medium: i2.utm_medium, utm_content: i2.utm_content, utm_term: i2.utm_term } : {};
  }
  getSessionProps() {
    var t2 = {};
    return Ci(Di(this.getSetOnceProps()), ((i2, e2) => {
      "$current_url" === e2 && (e2 = "url"), t2["$session_entry_" + E(e2)] = i2;
    })), t2;
  }
};
var wo = Si("[SessionId]");
var xo = class {
  on(t2, i2) {
    return this.tr.on(t2, i2);
  }
  constructor(t2, i2, e2) {
    var r2;
    if (this.ir = [], this.er = void 0, this.tr = new to(), this.rr = (t3, i3) => !(!N(t3) || !N(i3)) && Math.abs(t3 - i3) > this.sessionTimeoutMs, !t2.persistence) throw new Error("SessionIdManager requires a PostHogPersistence instance");
    if ("always" === t2.config.cookieless_mode) throw new Error('SessionIdManager cannot be used with cookieless_mode="always"');
    this.R = t2.config, this.Qe = t2.persistence, this.sr = void 0, this.nr = void 0, this._sessionStartTimestamp = null, this._sessionActivityTimestamp = null, this.ar = i2 || br, this.lr = e2 || br;
    var s2 = this.R.persistence_name || this.R.token, n2 = this.R.session_idle_timeout_seconds || 1800;
    if (this._sessionTimeoutMs = 1e3 * K(n2, 60, 36e3, wo.createLogger("session_idle_timeout_seconds"), 1800), t2.register({ $configured_session_timeout_ms: this._sessionTimeoutMs }), this.ur(), this.hr = "ph_" + s2 + "_window_id", this.dr = "ph_" + s2 + "_primary_window_exists", this.vr()) {
      var o2 = Fr.W(this.hr), a2 = Fr.W(this.dr);
      o2 && !a2 ? this.sr = o2 : Fr.V(this.hr), Fr.G(this.dr, true);
    }
    if (null != (r2 = this.R.bootstrap) && r2.sessionID) try {
      var l2 = ((t3) => {
        var i3 = t3.replace(/-/g, "");
        if (32 !== i3.length) throw new Error("Not a valid UUID");
        if ("7" !== i3[12]) throw new Error("Not a UUIDv7");
        return parseInt(i3.substring(0, 12), 16);
      })(this.R.bootstrap.sessionID);
      this.cr(this.R.bootstrap.sessionID, (/* @__PURE__ */ new Date()).getTime(), l2);
    } catch (t3) {
      wo.error("Invalid sessionID in bootstrap", t3);
    }
    this.pr();
  }
  get sessionTimeoutMs() {
    return this._sessionTimeoutMs;
  }
  onSessionId(t2) {
    return M(this.ir) && (this.ir = []), this.ir.push(t2), this.nr && t2(this.nr, this.sr), () => {
      this.ir = this.ir.filter(((i2) => i2 !== t2));
    };
  }
  vr() {
    return "memory" !== this.R.persistence && !this.Qe.ki && Fr.H();
  }
  gr(t2) {
    t2 !== this.sr && (this.sr = t2, this.vr() && Fr.G(this.hr, t2));
  }
  _r() {
    return this.sr ? this.sr : this.vr() ? Fr.W(this.hr) : null;
  }
  cr(t2, i2, e2) {
    t2 === this.nr && i2 === this._sessionActivityTimestamp && e2 === this._sessionStartTimestamp || (this._sessionStartTimestamp = e2, this._sessionActivityTimestamp = i2, this.nr = t2, this.Qe.register({ [ie]: [i2, t2, e2] }));
  }
  mr() {
    var t2 = this.Qe.props[ie];
    return I(t2) && 2 === t2.length && t2.push(t2[0]), t2 || [0, null, 0];
  }
  resetSessionId() {
    this.cr(null, null, null);
  }
  destroy() {
    clearTimeout(this.yr), this.yr = void 0, this.er && t && (t.removeEventListener("beforeunload", this.er, { capture: false }), this.er = void 0), this.ir = [];
  }
  pr() {
    this.er = () => {
      this.vr() && Fr.V(this.dr);
    }, zi(t, "beforeunload", this.er, { capture: false });
  }
  checkAndGetSessionAndWindowId(t2, i2) {
    if (void 0 === t2 && (t2 = false), void 0 === i2 && (i2 = null), "always" === this.R.cookieless_mode) throw new Error('checkAndGetSessionAndWindowId should not be called with cookieless_mode="always"');
    var e2 = i2 || (/* @__PURE__ */ new Date()).getTime(), [r2, s2, n2] = this.mr(), o2 = this._r(), a2 = N(n2) && Math.abs(e2 - n2) > 864e5, l2 = false, u2 = !s2, h3 = !u2 && !t2 && this.rr(e2, r2);
    u2 || h3 || a2 ? (s2 = this.ar(), o2 = this.lr(), wo.info("new session ID generated", { sessionId: s2, windowId: o2, changeReason: { noSessionId: u2, activityTimeout: h3, sessionPastMaximumLength: a2 } }), n2 = e2, l2 = true) : o2 || (o2 = this.lr(), l2 = true);
    var d2 = !!N(r2) && t2 && !a2 ? r2 : e2, v2 = !N(n2) ? (/* @__PURE__ */ new Date()).getTime() : n2;
    return this.gr(o2), this.cr(s2, d2, v2), t2 || this.ur(), l2 && this.ir.forEach(((t3) => t3(s2, o2, l2 ? { noSessionId: u2, activityTimeout: h3, sessionPastMaximumLength: a2 } : void 0))), { sessionId: s2, windowId: o2, sessionStartTimestamp: v2, changeReason: l2 ? { noSessionId: u2, activityTimeout: h3, sessionPastMaximumLength: a2 } : void 0, lastActivityTimestamp: r2 };
  }
  ur() {
    clearTimeout(this.yr), this.yr = setTimeout((() => {
      var [t2] = this.mr();
      if (this.rr((/* @__PURE__ */ new Date()).getTime(), t2)) {
        var i2 = this.nr;
        this.resetSessionId(), this.tr.emit("forcedIdleReset", { idleSessionId: i2 });
      }
    }), 1.1 * this.sessionTimeoutMs);
  }
};
var Eo = ["$set_once", "$set"];
var $o = Si("[SiteApps]");
var So = class {
  constructor(t2) {
    this._instance = t2, this.br = [], this.apps = {};
  }
  get isEnabled() {
    return !!this._instance.config.opt_in_site_apps;
  }
  wr(t2, i2) {
    if (i2) {
      var e2 = this.globalsForEvent(i2);
      this.br.push(e2), this.br.length > 1e3 && (this.br = this.br.slice(10));
    }
  }
  get siteAppLoaders() {
    var t2;
    return null == (t2 = v._POSTHOG_REMOTE_CONFIG) || null == (t2 = t2[this._instance.config.token]) ? void 0 : t2.siteApps;
  }
  init() {
    if (this.isEnabled) {
      var t2 = this._instance.Bi(this.wr.bind(this));
      this.Er = () => {
        t2(), this.br = [], this.Er = void 0;
      };
    }
  }
  globalsForEvent(t2) {
    var i2, e2, r2, s2, n2, o2, a2;
    if (!t2) throw new Error("Event payload is required");
    var l2 = {}, u2 = this._instance.get_property("$groups") || [], h3 = this._instance.get_property("$stored_group_properties") || {};
    for (var [d2, v2] of Object.entries(h3)) l2[d2] = { id: u2[d2], type: d2, properties: v2 };
    var { $set_once: c2, $set: f2 } = t2;
    return { event: g({}, _(t2, Eo), { properties: g({}, t2.properties, f2 ? { $set: g({}, null !== (i2 = null == (e2 = t2.properties) ? void 0 : e2.$set) && void 0 !== i2 ? i2 : {}, f2) } : {}, c2 ? { $set_once: g({}, null !== (r2 = null == (s2 = t2.properties) ? void 0 : s2.$set_once) && void 0 !== r2 ? r2 : {}, c2) } : {}), elements_chain: null !== (n2 = null == (o2 = t2.properties) ? void 0 : o2.$elements_chain) && void 0 !== n2 ? n2 : "", distinct_id: null == (a2 = t2.properties) ? void 0 : a2.distinct_id }), person: { properties: this._instance.get_property("$stored_person_properties") }, groups: l2 };
  }
  setupSiteApp(t2) {
    var i2 = this.apps[t2.id], e2 = () => {
      var e3;
      (!i2.errored && this.br.length && ($o.info("Processing " + this.br.length + " events for site app with id " + t2.id), this.br.forEach(((t3) => null == i2.processEvent ? void 0 : i2.processEvent(t3))), i2.processedBuffer = true), Object.values(this.apps).every(((t3) => t3.processedBuffer || t3.errored))) && (null == (e3 = this.Er) || e3.call(this));
    }, r2 = false, s2 = (s3) => {
      i2.errored = !s3, i2.loaded = true, $o.info("Site app with id " + t2.id + " " + (s3 ? "loaded" : "errored")), r2 && e2();
    };
    try {
      var { processEvent: n2 } = t2.init({ posthog: this._instance, callback: (t3) => {
        s2(t3);
      } });
      n2 && (i2.processEvent = n2), r2 = true;
    } catch (i3) {
      $o.error("Error while initializing PostHog app with config id " + t2.id, i3), s2(false);
    }
    if (r2 && i2.loaded) try {
      e2();
    } catch (e3) {
      $o.error("Error while processing buffered events PostHog app with config id " + t2.id, e3), i2.errored = true;
    }
  }
  $r() {
    var t2 = this.siteAppLoaders || [];
    for (var i2 of t2) this.apps[i2.id] = { id: i2.id, loaded: false, errored: false, processedBuffer: false };
    for (var e2 of t2) this.setupSiteApp(e2);
  }
  Sr(t2) {
    if (0 !== Object.keys(this.apps).length) {
      var i2 = this.globalsForEvent(t2);
      for (var e2 of Object.values(this.apps)) try {
        null == e2.processEvent || e2.processEvent(i2);
      } catch (i3) {
        $o.error("Error while processing event " + t2.event + " for site app " + e2.id, i3);
      }
    }
  }
  onRemoteConfig(t2) {
    var i2, e2, r2, s2 = this;
    if (null != (i2 = this.siteAppLoaders) && i2.length) return this.isEnabled ? (this.$r(), void this._instance.on("eventCaptured", ((t3) => this.Sr(t3)))) : void $o.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
    if (null == (e2 = this.Er) || e2.call(this), null != (r2 = t2.siteApps) && r2.length) if (this.isEnabled) {
      var n2 = function(t3) {
        var i3;
        v["__$$ph_site_app_" + t3] = s2._instance, null == (i3 = v.__PosthogExtensions__) || null == i3.loadSiteApp || i3.loadSiteApp(s2._instance, a2, ((i4) => {
          if (i4) return $o.error("Error while initializing PostHog app with config id " + t3, i4);
        }));
      };
      for (var { id: o2, url: a2 } of t2.siteApps) n2(o2);
    } else $o.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
  }
};
var ko = function(t2, i2) {
  if (!t2) return false;
  var e2 = t2.userAgent;
  if (e2 && y(e2, i2)) return true;
  try {
    var r2 = null == t2 ? void 0 : t2.userAgentData;
    if (null != r2 && r2.brands && r2.brands.some(((t3) => y(null == t3 ? void 0 : t3.brand, i2)))) return true;
  } catch (t3) {
  }
  return !!t2.webdriver;
};
var Po = (function(t2) {
  return t2.US = "us", t2.EU = "eu", t2.CUSTOM = "custom", t2;
})({});
var To = "i.posthog.com";
var Io = class {
  constructor(t2) {
    this.kr = {}, this.instance = t2;
  }
  get apiHost() {
    var t2 = this.instance.config.api_host.trim().replace(/\/$/, "");
    return "https://app.posthog.com" === t2 ? "https://us.i.posthog.com" : t2;
  }
  get flagsApiHost() {
    var t2 = this.instance.config.flags_api_host;
    return t2 ? t2.trim().replace(/\/$/, "") : this.apiHost;
  }
  get uiHost() {
    var t2, i2 = null == (t2 = this.instance.config.ui_host) ? void 0 : t2.replace(/\/$/, "");
    return i2 || (i2 = this.apiHost.replace("." + To, ".posthog.com")), "https://app.posthog.com" === i2 ? "https://us.posthog.com" : i2;
  }
  get region() {
    return this.kr[this.apiHost] || (/https:\/\/(app|us|us-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? this.kr[this.apiHost] = Po.US : /https:\/\/(eu|eu-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? this.kr[this.apiHost] = Po.EU : this.kr[this.apiHost] = Po.CUSTOM), this.kr[this.apiHost];
  }
  endpointFor(t2, i2) {
    if (void 0 === i2 && (i2 = ""), i2 && (i2 = "/" === i2[0] ? i2 : "/" + i2), "ui" === t2) return this.uiHost + i2;
    if ("flags" === t2) return this.flagsApiHost + i2;
    if (this.region === Po.CUSTOM) return this.apiHost + i2;
    var e2 = To + i2;
    switch (t2) {
      case "assets":
        return "https://" + this.region + "-assets." + e2;
      case "api":
        return "https://" + this.region + "." + e2;
    }
  }
};
var Co = { icontains: (i2, e2) => !!t && e2.href.toLowerCase().indexOf(i2.toLowerCase()) > -1, not_icontains: (i2, e2) => !!t && -1 === e2.href.toLowerCase().indexOf(i2.toLowerCase()), regex: (i2, e2) => !!t && cn(e2.href, i2), not_regex: (i2, e2) => !!t && !cn(e2.href, i2), exact: (t2, i2) => i2.href === t2, is_not: (t2, i2) => i2.href !== t2 };
var Ro = class _Ro {
  constructor(t2) {
    var i2 = this;
    this.getWebExperimentsAndEvaluateDisplayLogic = function(t3) {
      void 0 === t3 && (t3 = false), i2.getWebExperiments(((t4) => {
        _Ro.Pr("retrieved web experiments from the server"), i2.Tr = /* @__PURE__ */ new Map(), t4.forEach(((t5) => {
          if (t5.feature_flag_key) {
            var e2;
            if (i2.Tr) _Ro.Pr("setting flag key ", t5.feature_flag_key, " to web experiment ", t5), null == (e2 = i2.Tr) || e2.set(t5.feature_flag_key, t5);
            var r2 = i2._instance.getFeatureFlag(t5.feature_flag_key);
            O(r2) && t5.variants[r2] && i2.Ir(t5.name, r2, t5.variants[r2].transforms);
          } else if (t5.variants) for (var s2 in t5.variants) {
            var n2 = t5.variants[s2];
            _Ro.Cr(n2) && i2.Ir(t5.name, s2, n2.transforms);
          }
        }));
      }), t3);
    }, this._instance = t2, this._instance.onFeatureFlags(((t3) => {
      this.onFeatureFlags(t3);
    }));
  }
  onFeatureFlags(t2) {
    if (this._is_bot()) _Ro.Pr("Refusing to render web experiment since the viewer is a likely bot");
    else if (!this._instance.config.disable_web_experiments) {
      if (j(this.Tr)) return this.Tr = /* @__PURE__ */ new Map(), this.loadIfEnabled(), void this.previewWebExperiment();
      _Ro.Pr("applying feature flags", t2), t2.forEach(((t3) => {
        var i2;
        if (this.Tr && null != (i2 = this.Tr) && i2.has(t3)) {
          var e2, r2 = this._instance.getFeatureFlag(t3), s2 = null == (e2 = this.Tr) ? void 0 : e2.get(t3);
          r2 && null != s2 && s2.variants[r2] && this.Ir(s2.name, r2, s2.variants[r2].transforms);
        }
      }));
    }
  }
  previewWebExperiment() {
    var t2 = _Ro.getWindowLocation();
    if (null != t2 && t2.search) {
      var i2 = sr(null == t2 ? void 0 : t2.search, "__experiment_id"), e2 = sr(null == t2 ? void 0 : t2.search, "__experiment_variant");
      i2 && e2 && (_Ro.Pr("previewing web experiments " + i2 + " && " + e2), this.getWebExperiments(((t3) => {
        this.Rr(parseInt(i2), e2, t3);
      }), false, true));
    }
  }
  loadIfEnabled() {
    this._instance.config.disable_web_experiments || this.getWebExperimentsAndEvaluateDisplayLogic();
  }
  getWebExperiments(t2, i2, e2) {
    if (this._instance.config.disable_web_experiments && !e2) return t2([]);
    var r2 = this._instance.get_property("$web_experiments");
    if (r2 && !i2) return t2(r2);
    this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/web_experiments/?token=" + this._instance.config.token), method: "GET", callback: (i3) => {
      if (200 !== i3.statusCode || !i3.json) return t2([]);
      var e3 = i3.json.experiments || [];
      return t2(e3);
    } });
  }
  Rr(t2, i2, e2) {
    var r2 = e2.filter(((i3) => i3.id === t2));
    r2 && r2.length > 0 && (_Ro.Pr("Previewing web experiment [" + r2[0].name + "] with variant [" + i2 + "]"), this.Ir(r2[0].name, i2, r2[0].variants[i2].transforms));
  }
  static Cr(t2) {
    return !j(t2.conditions) && (_Ro.Fr(t2) && _Ro.Mr(t2));
  }
  static Fr(t2) {
    var i2;
    if (j(t2.conditions) || j(null == (i2 = t2.conditions) ? void 0 : i2.url)) return true;
    var e2, r2, s2, n2 = _Ro.getWindowLocation();
    return !!n2 && (null == (e2 = t2.conditions) || !e2.url || Co[null !== (r2 = null == (s2 = t2.conditions) ? void 0 : s2.urlMatchType) && void 0 !== r2 ? r2 : "icontains"](t2.conditions.url, n2));
  }
  static getWindowLocation() {
    return null == t ? void 0 : t.location;
  }
  static Mr(t2) {
    var i2;
    if (j(t2.conditions) || j(null == (i2 = t2.conditions) ? void 0 : i2.utm)) return true;
    var e2 = os();
    if (e2.utm_source) {
      var r2, s2, n2, o2, a2, l2, u2, h3, d2 = null == (r2 = t2.conditions) || null == (r2 = r2.utm) || !r2.utm_campaign || (null == (s2 = t2.conditions) || null == (s2 = s2.utm) ? void 0 : s2.utm_campaign) == e2.utm_campaign, v2 = null == (n2 = t2.conditions) || null == (n2 = n2.utm) || !n2.utm_source || (null == (o2 = t2.conditions) || null == (o2 = o2.utm) ? void 0 : o2.utm_source) == e2.utm_source, c2 = null == (a2 = t2.conditions) || null == (a2 = a2.utm) || !a2.utm_medium || (null == (l2 = t2.conditions) || null == (l2 = l2.utm) ? void 0 : l2.utm_medium) == e2.utm_medium, f2 = null == (u2 = t2.conditions) || null == (u2 = u2.utm) || !u2.utm_term || (null == (h3 = t2.conditions) || null == (h3 = h3.utm) ? void 0 : h3.utm_term) == e2.utm_term;
      return d2 && c2 && f2 && v2;
    }
    return false;
  }
  static Pr(t2) {
    for (var i2 = arguments.length, e2 = new Array(i2 > 1 ? i2 - 1 : 0), r2 = 1; r2 < i2; r2++) e2[r2 - 1] = arguments[r2];
    $i.info("[WebExperiments] " + t2, e2);
  }
  Ir(t2, i2, e2) {
    this._is_bot() ? _Ro.Pr("Refusing to render web experiment since the viewer is a likely bot") : "control" !== i2 ? e2.forEach(((e3) => {
      if (e3.selector) {
        var r2;
        _Ro.Pr("applying transform of variant " + i2 + " for experiment " + t2 + " ", e3);
        var s2 = null == (r2 = document) ? void 0 : r2.querySelectorAll(e3.selector);
        null == s2 || s2.forEach(((t3) => {
          var i3 = t3;
          e3.html && (i3.innerHTML = e3.html), e3.css && i3.setAttribute("style", e3.css);
        }));
      }
    })) : _Ro.Pr("Control variants leave the page unmodified.");
  }
  _is_bot() {
    return n && this._instance ? ko(n, this._instance.config.custom_blocked_useragents) : void 0;
  }
};
var Fo = Si("[PostHog ExternalIntegrations]");
var Mo = { intercom: "intercom-integration", crispChat: "crisp-chat-integration" };
var Oo = class {
  constructor(t2) {
    this._instance = t2;
  }
  it(t2, i2) {
    var e2;
    null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, t2, ((t3) => {
      if (t3) return Fo.error("failed to load script", t3);
      i2();
    }));
  }
  startIfEnabledOrStop() {
    var t2 = this, i2 = function(i3) {
      var e3, s3, n2;
      (!r2 || null != (e3 = v.__PosthogExtensions__) && null != (e3 = e3.integrations) && e3[i3] || t2.it(Mo[i3], (() => {
        var e4;
        null == (e4 = v.__PosthogExtensions__) || null == (e4 = e4.integrations) || null == (e4 = e4[i3]) || e4.start(t2._instance);
      })), !r2 && null != (s3 = v.__PosthogExtensions__) && null != (s3 = s3.integrations) && s3[i3]) && (null == (n2 = v.__PosthogExtensions__) || null == (n2 = n2.integrations) || null == (n2 = n2[i3]) || n2.stop());
    };
    for (var [e2, r2] of Object.entries(null !== (s2 = this._instance.config.integrations) && void 0 !== s2 ? s2 : {})) {
      var s2;
      i2(e2);
    }
  }
};
var Ao = "[SessionRecording]";
var Do = Si(Ao);
var jo = class {
  get started() {
    var t2;
    return !(null == (t2 = this.Or) || !t2.isStarted);
  }
  get status() {
    return this.Or ? this.Or.status : this.Ar && !this.Dr ? "disabled" : "lazy_loading";
  }
  constructor(t2) {
    if (this._forceAllowLocalhostNetworkCapture = false, this.Ar = false, this.jr = void 0, this._instance = t2, !this._instance.sessionManager) throw Do.error("started without valid sessionManager"), new Error(Ao + " started without valid sessionManager. This is a bug.");
    if ("always" === this._instance.config.cookieless_mode) throw new Error(Ao + ' cannot be used with cookieless_mode="always"');
  }
  get Dr() {
    var i2, e2 = !(null == (i2 = this._instance.get_property(te)) || !i2.enabled), r2 = !this._instance.config.disable_session_recording, s2 = this._instance.config.disable_session_recording || this._instance.consent.isOptedOut();
    return t && e2 && r2 && !s2;
  }
  startIfEnabledOrStop(t2) {
    var i2;
    if (!this.Dr || null == (i2 = this.Or) || !i2.isStarted) {
      var e2 = !M(Object.assign) && !M(Array.from);
      this.Dr && e2 ? (this.Lr(t2), Do.info("starting")) : this.stopRecording();
    }
  }
  Lr(t2) {
    var i2, e2, r2;
    this.Dr && (null != v && null != (i2 = v.__PosthogExtensions__) && null != (i2 = i2.rrweb) && i2.record && null != (e2 = v.__PosthogExtensions__) && e2.initSessionRecording ? this.Nr(t2) : null == (r2 = v.__PosthogExtensions__) || null == r2.loadExternalDependency || r2.loadExternalDependency(this._instance, this.Ur, ((i3) => {
      if (i3) return Do.error("could not load recorder", i3);
      this.Nr(t2);
    })));
  }
  stopRecording() {
    var t2, i2;
    null == (t2 = this.jr) || t2.call(this), this.jr = void 0, null == (i2 = this.Or) || i2.stop();
  }
  zr() {
    var t2;
    null == (t2 = this._instance.persistence) || t2.unregister(ee);
  }
  Hr(t2) {
    if (this._instance.persistence) {
      var i2, e2, r2 = this._instance.persistence, s2 = () => {
        var i3 = false === t2.sessionRecording ? void 0 : t2.sessionRecording, e3 = null == i3 ? void 0 : i3.sampleRate, s3 = j(e3) ? null : parseFloat(e3);
        j(s3) && this.zr();
        var n2 = null == i3 ? void 0 : i3.minimumDurationMilliseconds;
        r2.register({ [te]: g({ enabled: !!i3 }, i3, { networkPayloadCapture: g({ capturePerformance: t2.capturePerformance }, null == i3 ? void 0 : i3.networkPayloadCapture), canvasRecording: { enabled: null == i3 ? void 0 : i3.recordCanvas, fps: null == i3 ? void 0 : i3.canvasFps, quality: null == i3 ? void 0 : i3.canvasQuality }, sampleRate: s3, minimumDurationMilliseconds: M(n2) ? null : n2, endpoint: null == i3 ? void 0 : i3.endpoint, triggerMatchType: null == i3 ? void 0 : i3.triggerMatchType, masking: null == i3 ? void 0 : i3.masking, urlTriggers: null == i3 ? void 0 : i3.urlTriggers }) });
      };
      s2(), null == (i2 = this.jr) || i2.call(this), this.jr = null == (e2 = this._instance.sessionManager) ? void 0 : e2.onSessionId(s2);
    }
  }
  onRemoteConfig(t2) {
    "sessionRecording" in t2 ? false !== t2.sessionRecording ? (this.Hr(t2), this.Ar = true, this.startIfEnabledOrStop()) : this.Ar = true : Do.info("skipping remote config with no sessionRecording", t2);
  }
  log(t2, i2) {
    var e2;
    void 0 === i2 && (i2 = "log"), null != (e2 = this.Or) && e2.log ? this.Or.log(t2, i2) : Do.warn("log called before recorder was ready");
  }
  get Ur() {
    var t2, i2, e2 = null == (t2 = this._instance) || null == (t2 = t2.persistence) ? void 0 : t2.get_property(te);
    return (null == e2 || null == (i2 = e2.scriptConfig) ? void 0 : i2.script) || "lazy-recorder";
  }
  Nr(t2) {
    var i2, e2;
    if (null == (i2 = v.__PosthogExtensions__) || !i2.initSessionRecording) throw Error("Called on script loaded before session recording is available");
    this.Or || (this.Or = null == (e2 = v.__PosthogExtensions__) ? void 0 : e2.initSessionRecording(this._instance), this.Or._forceAllowLocalhostNetworkCapture = this._forceAllowLocalhostNetworkCapture);
    this.Or.start(t2);
  }
  onRRwebEmit(t2) {
    var i2;
    null == (i2 = this.Or) || null == i2.onRRwebEmit || i2.onRRwebEmit(t2);
  }
  overrideLinkedFlag() {
    var t2, i2;
    this.Or || (null == (i2 = this._instance.persistence) || i2.register({ $replay_override_linked_flag: true }));
    null == (t2 = this.Or) || t2.overrideLinkedFlag();
  }
  overrideSampling() {
    var t2, i2;
    this.Or || (null == (i2 = this._instance.persistence) || i2.register({ $replay_override_sampling: true }));
    null == (t2 = this.Or) || t2.overrideSampling();
  }
  overrideTrigger(t2) {
    var i2, e2;
    this.Or || (null == (e2 = this._instance.persistence) || e2.register({ ["url" === t2 ? "$replay_override_url_trigger" : "$replay_override_event_trigger"]: true }));
    null == (i2 = this.Or) || i2.overrideTrigger(t2);
  }
  get sdkDebugProperties() {
    var t2;
    return (null == (t2 = this.Or) ? void 0 : t2.sdkDebugProperties) || { $recording_status: this.status };
  }
  tryAddCustomEvent(t2, i2) {
    var e2;
    return !(null == (e2 = this.Or) || !e2.tryAddCustomEvent(t2, i2));
  }
};
var Lo = {};
var No = () => {
};
var Uo = "posthog";
var zo = !an && -1 === (null == d ? void 0 : d.indexOf("MSIE")) && -1 === (null == d ? void 0 : d.indexOf("Mozilla"));
var Ho = (i2) => {
  var e2;
  return g({ api_host: "https://us.i.posthog.com", flags_api_host: null, ui_host: null, token: "", autocapture: true, cross_subdomain_cookie: Ni(null == o ? void 0 : o.location), persistence: "localStorage+cookie", persistence_name: "", cookie_persisted_properties: [], loaded: No, save_campaign_params: true, custom_campaign_params: [], custom_blocked_useragents: [], save_referrer: true, capture_pageleave: "if_capture_pageview", defaults: null != i2 ? i2 : "unset", __preview_deferred_init_extensions: false, debug: a && O(null == a ? void 0 : a.search) && -1 !== a.search.indexOf("__posthog_debug=true") || false, cookie_expiration: 365, upgrade: false, disable_session_recording: false, disable_persistence: false, disable_web_experiments: true, disable_surveys: false, disable_surveys_automatic_display: false, disable_conversations: false, disable_product_tours: true, disable_external_dependency_loading: false, enable_recording_console_log: void 0, secure_cookie: "https:" === (null == t || null == (e2 = t.location) ? void 0 : e2.protocol), ip: false, opt_out_capturing_by_default: false, opt_out_persistence_by_default: false, opt_out_useragent_filter: false, opt_out_capturing_persistence_type: "localStorage", consent_persistence_name: null, opt_out_capturing_cookie_prefix: null, opt_in_site_apps: false, property_denylist: [], respect_dnt: false, sanitize_properties: null, request_headers: {}, request_batching: true, properties_string_max_length: 65535, mask_all_element_attributes: false, mask_all_text: false, mask_personal_data_properties: false, custom_personal_data_properties: [], advanced_disable_flags: false, advanced_disable_decide: false, advanced_disable_feature_flags: false, advanced_disable_feature_flags_on_first_load: false, advanced_only_evaluate_survey_feature_flags: false, advanced_enable_surveys: false, advanced_disable_toolbar_metrics: false, feature_flag_request_timeout_ms: 3e3, surveys_request_timeout_ms: 1e4, on_request_error: (t2) => {
    var i3 = "Bad HTTP status: " + t2.statusCode + " " + t2.text;
    $i.error(i3);
  }, get_device_id: (t2) => t2, capture_performance: void 0, name: "posthog", bootstrap: {}, disable_compression: false, session_idle_timeout_seconds: 1800, person_profiles: "identified_only", before_send: void 0, request_queue_config: { flush_interval_ms: fo }, error_tracking: {}, _onCapture: No, __preview_eager_load_replay: false }, ((t2) => ({ rageclick: !(t2 && t2 >= "2025-11-30") || { content_ignorelist: true }, capture_pageview: !(t2 && t2 >= "2025-05-24") || "history_change", session_recording: t2 && t2 >= "2025-11-30" ? { strictMinimumDuration: true } : {} }))(i2));
};
var Bo = (t2) => {
  var i2 = {};
  M(t2.process_person) || (i2.person_profiles = t2.process_person), M(t2.xhr_headers) || (i2.request_headers = t2.xhr_headers), M(t2.cookie_name) || (i2.persistence_name = t2.cookie_name), M(t2.disable_cookie) || (i2.disable_persistence = t2.disable_cookie), M(t2.store_google) || (i2.save_campaign_params = t2.store_google), M(t2.verbose) || (i2.debug = t2.verbose);
  var e2 = Ri({}, i2, t2);
  return I(t2.property_blacklist) && (M(t2.property_denylist) ? e2.property_denylist = t2.property_blacklist : I(t2.property_denylist) ? e2.property_denylist = [...t2.property_blacklist, ...t2.property_denylist] : $i.error("Invalid value for property_denylist config: " + t2.property_denylist)), e2;
};
var qo = class {
  constructor() {
    this.__forceAllowLocalhost = false;
  }
  get Br() {
    return this.__forceAllowLocalhost;
  }
  set Br(t2) {
    $i.error("WebPerformanceObserver is deprecated and has no impact on network capture. Use `_forceAllowLocalhostNetworkCapture` on `posthog.sessionRecording`"), this.__forceAllowLocalhost = t2;
  }
};
var Wo = class _Wo {
  get decideEndpointWasHit() {
    var t2, i2;
    return null !== (t2 = null == (i2 = this.featureFlags) ? void 0 : i2.hasLoadedFlags) && void 0 !== t2 && t2;
  }
  get flagsEndpointWasHit() {
    var t2, i2;
    return null !== (t2 = null == (i2 = this.featureFlags) ? void 0 : i2.hasLoadedFlags) && void 0 !== t2 && t2;
  }
  constructor() {
    this.webPerformance = new qo(), this.qr = false, this.version = c.LIB_VERSION, this.Wr = new to(), this._calculate_event_properties = this.calculateEventProperties.bind(this), this.config = Ho(), this.SentryIntegration = Vr, this.sentryIntegration = (t2) => (function(t3, i2) {
      var e2 = Gr(t3, i2);
      return { name: Wr, processEvent: (t4) => e2(t4) };
    })(this, t2), this.__request_queue = [], this.__loaded = false, this.analyticsDefaultEndpoint = "/e/", this.Gr = false, this.Vr = null, this.Jr = null, this.Kr = null, this.featureFlags = new Rn(this), this.toolbar = new Qr(this), this.scrollManager = new mo(this), this.pageViewManager = new xs(this), this.surveys = new no(this), this.conversations = new ao(this), this.logs = new lo(this), this.experiments = new Ro(this), this.exceptions = new yn(this), this.rateLimiter = new ho(this), this.requestRouter = new Io(this), this.consent = new Or(this), this.externalIntegrations = new Oo(this), this.people = { set: (t2, i2, e2) => {
      var r2 = O(t2) ? { [t2]: i2 } : t2;
      this.setPersonProperties(r2), null == e2 || e2({});
    }, set_once: (t2, i2, e2) => {
      var r2 = O(t2) ? { [t2]: i2 } : t2;
      this.setPersonProperties(void 0, r2), null == e2 || e2({});
    } }, this.on("eventCaptured", ((t2) => $i.info('send "' + (null == t2 ? void 0 : t2.event) + '"', t2)));
  }
  init(t2, i2, e2) {
    if (e2 && e2 !== Uo) {
      var r2, s2 = null !== (r2 = Lo[e2]) && void 0 !== r2 ? r2 : new _Wo();
      return s2._init(t2, i2, e2), Lo[e2] = s2, Lo[Uo][e2] = s2, s2;
    }
    return this._init(t2, i2, e2);
  }
  _init(i2, e2, r2) {
    var s2;
    if (void 0 === e2 && (e2 = {}), M(i2) || A(i2)) return $i.critical("PostHog was initialized without a token. This likely indicates a misconfiguration. Please check the first argument passed to posthog.init()"), this;
    if (this.__loaded) return console.warn("[PostHog.js]", "You have already initialized PostHog! Re-initializing is a no-op"), this;
    this.__loaded = true, this.config = {}, e2.debug = this.Yr(e2.debug), this.Xr = e2, this.Qr = [], e2.person_profiles && (this.Jr = e2.person_profiles), this.set_config(Ri({}, Ho(e2.defaults), Bo(e2), { name: r2, token: i2 })), this.config.on_xhr_error && $i.error("on_xhr_error is deprecated. Use on_request_error instead"), this.compression = e2.disable_compression ? void 0 : $s.GZipJS;
    var n2 = this.Zr();
    this.persistence = new Mn(this.config, n2), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new Mn(g({}, this.config, { persistence: "sessionStorage" }), n2);
    var o2 = g({}, this.persistence.props), a2 = g({}, this.sessionPersistence.props);
    this.register({ $initialization_time: (/* @__PURE__ */ new Date()).toISOString() }), this.ts = new po(((t2) => this.es(t2)), this.config.request_queue_config), this.rs = new _o(this), this.__request_queue = [];
    var l2 = "always" === this.config.cookieless_mode || "on_reject" === this.config.cookieless_mode && this.consent.isExplicitlyOptedOut();
    if (l2 || (this.sessionManager = new xo(this), this.sessionPropsManager = new bo(this, this.sessionManager, this.persistence)), this.config.__preview_deferred_init_extensions ? ($i.info("Deferring extension initialization to improve startup performance"), setTimeout((() => {
      this.ss(l2);
    }), 0)) : ($i.info("Initializing extensions synchronously"), this.ss(l2)), c.DEBUG = c.DEBUG || this.config.debug, c.DEBUG && $i.info("Starting in debug mode", { this: this, config: e2, thisC: g({}, this.config), p: o2, s: a2 }), void 0 !== (null == (s2 = e2.bootstrap) ? void 0 : s2.distinctID)) {
      var u2, h3, d2 = this.config.get_device_id(br()), v2 = null != (u2 = e2.bootstrap) && u2.isIdentifiedID ? d2 : e2.bootstrap.distinctID;
      this.persistence.set_property(he, null != (h3 = e2.bootstrap) && h3.isIdentifiedID ? "identified" : "anonymous"), this.register({ distinct_id: e2.bootstrap.distinctID, $device_id: v2 });
    }
    if (this.ns()) {
      var f2, p2, _2 = Object.keys((null == (f2 = e2.bootstrap) ? void 0 : f2.featureFlags) || {}).filter(((t2) => {
        var i3;
        return !(null == (i3 = e2.bootstrap) || null == (i3 = i3.featureFlags) || !i3[t2]);
      })).reduce(((t2, i3) => {
        var r3;
        return t2[i3] = (null == (r3 = e2.bootstrap) || null == (r3 = r3.featureFlags) ? void 0 : r3[i3]) || false, t2;
      }), {}), m2 = Object.keys((null == (p2 = e2.bootstrap) ? void 0 : p2.featureFlagPayloads) || {}).filter(((t2) => _2[t2])).reduce(((t2, i3) => {
        var r3, s3;
        null != (r3 = e2.bootstrap) && null != (r3 = r3.featureFlagPayloads) && r3[i3] && (t2[i3] = null == (s3 = e2.bootstrap) || null == (s3 = s3.featureFlagPayloads) ? void 0 : s3[i3]);
        return t2;
      }), {});
      this.featureFlags.receivedFeatureFlags({ featureFlags: _2, featureFlagPayloads: m2 });
    }
    if (l2) this.register_once({ distinct_id: me, $device_id: null }, "");
    else if (!this.get_distinct_id()) {
      var y2 = this.config.get_device_id(br());
      this.register_once({ distinct_id: y2, $device_id: y2 }, ""), this.persistence.set_property(he, "anonymous");
    }
    return zi(t, "onpagehide" in self ? "pagehide" : "unload", this._handle_unload.bind(this), { passive: false }), this.toolbar.maybeLoadToolbar(), e2.segment ? qr(this, (() => this.os())) : this.os(), C(this.config._onCapture) && this.config._onCapture !== No && ($i.warn("onCapture is deprecated. Please use `before_send` instead"), this.on("eventCaptured", ((t2) => this.config._onCapture(t2.event, t2)))), this.config.ip && $i.warn('The `ip` config option has NO EFFECT AT ALL and has been deprecated. Use a custom transformation or "Discard IP data" project setting instead. See https://posthog.com/tutorials/web-redact-properties#hiding-customer-ip-address for more information.'), this;
  }
  ss(t2) {
    var i2 = performance.now();
    this.historyAutocapture = new Hr(this), this.historyAutocapture.startIfEnabled();
    var e2 = [];
    e2.push((() => {
      new ts(this).startIfEnabledOrStop();
    })), e2.push((() => {
      var t3;
      this.siteApps = new So(this), null == (t3 = this.siteApps) || t3.init();
    })), t2 || e2.push((() => {
      this.sessionRecording = new jo(this), this.sessionRecording.startIfEnabledOrStop();
    })), this.config.disable_scroll_properties || e2.push((() => {
      this.scrollManager.startMeasuringScrollPosition();
    })), e2.push((() => {
      this.autocapture = new cr(this), this.autocapture.startIfEnabled();
    })), e2.push((() => {
      this.surveys.loadIfEnabled();
    })), e2.push((() => {
      this.logs.loadIfEnabled();
    })), e2.push((() => {
      this.conversations.loadIfEnabled();
    })), e2.push((() => {
      this.productTours = new Dn(this), this.productTours.loadIfEnabled();
    })), e2.push((() => {
      this.heatmaps = new ws(this), this.heatmaps.startIfEnabled();
    })), e2.push((() => {
      this.webVitalsAutocapture = new ms(this);
    })), e2.push((() => {
      this.exceptionObserver = new Ur(this), this.exceptionObserver.startIfEnabledOrStop();
    })), e2.push((() => {
      this.deadClicksAutocapture = new Lr(this, jr), this.deadClicksAutocapture.startIfEnabled();
    })), e2.push((() => {
      if (this.ls) {
        var t3 = this.ls;
        this.ls = void 0, this.bi(t3);
      }
    })), this.us(e2, i2);
  }
  us(t2, i2) {
    for (; t2.length > 0; ) {
      if (this.config.__preview_deferred_init_extensions) {
        if (performance.now() - i2 >= 30 && t2.length > 0) return void setTimeout((() => {
          this.us(t2, i2);
        }), 0);
      }
      var e2 = t2.shift();
      if (e2) try {
        e2();
      } catch (t3) {
        $i.error("Error initializing extension:", t3);
      }
    }
    var r2 = Math.round(performance.now() - i2);
    this.register_for_session({ $sdk_debug_extensions_init_method: this.config.__preview_deferred_init_extensions ? "deferred" : "synchronous", $sdk_debug_extensions_init_time_ms: r2 }), this.config.__preview_deferred_init_extensions && $i.info("PostHog extensions initialized (" + r2 + "ms)");
  }
  bi(t2) {
    var i2, e2, r2, s2, n2, a2, l2, u2, h3;
    if (!o || !o.body) return $i.info("document not ready yet, trying again in 500 milliseconds..."), void setTimeout((() => {
      this.bi(t2);
    }), 500);
    this.config.__preview_deferred_init_extensions && (this.ls = t2), this.compression = void 0, t2.supportedCompression && !this.config.disable_compression && (this.compression = w(t2.supportedCompression, $s.GZipJS) ? $s.GZipJS : w(t2.supportedCompression, $s.Base64) ? $s.Base64 : void 0), null != (i2 = t2.analytics) && i2.endpoint && (this.analyticsDefaultEndpoint = t2.analytics.endpoint), this.set_config({ person_profiles: this.Jr ? this.Jr : "identified_only" }), null == (e2 = this.siteApps) || e2.onRemoteConfig(t2), null == (r2 = this.sessionRecording) || r2.onRemoteConfig(t2), null == (s2 = this.autocapture) || s2.onRemoteConfig(t2), null == (n2 = this.heatmaps) || n2.onRemoteConfig(t2), this.surveys.onRemoteConfig(t2), this.logs.onRemoteConfig(t2), this.conversations.onRemoteConfig(t2), null == (a2 = this.productTours) || a2.onRemoteConfig(t2), null == (l2 = this.webVitalsAutocapture) || l2.onRemoteConfig(t2), null == (u2 = this.exceptionObserver) || u2.onRemoteConfig(t2), this.exceptions.onRemoteConfig(t2), null == (h3 = this.deadClicksAutocapture) || h3.onRemoteConfig(t2);
  }
  os() {
    try {
      this.config.loaded(this);
    } catch (t2) {
      $i.critical("`loaded` function failed", t2);
    }
    this.hs(), this.config.capture_pageview && setTimeout((() => {
      (this.consent.isOptedIn() || "always" === this.config.cookieless_mode) && this.ds();
    }), 1), new co(this).load(), this.featureFlags.flags();
  }
  hs() {
    var t2;
    this.is_capturing() && (this.config.request_batching && (null == (t2 = this.ts) || t2.enable()));
  }
  _dom_loaded() {
    this.is_capturing() && Ii(this.__request_queue, ((t2) => this.es(t2))), this.__request_queue = [], this.hs();
  }
  _handle_unload() {
    var t2, i2;
    this.surveys.handlePageUnload(), this.config.request_batching ? (this.vs() && this.capture("$pageleave"), null == (t2 = this.ts) || t2.unload(), null == (i2 = this.rs) || i2.unload()) : this.vs() && this.capture("$pageleave", null, { transport: "sendBeacon" });
  }
  _send_request(t2) {
    this.__loaded && (zo ? this.__request_queue.push(t2) : this.rateLimiter.isServerRateLimited(t2.batchKey) || (t2.transport = t2.transport || this.config.api_transport, t2.url = un(t2.url, { ip: this.config.ip ? 1 : 0 }), t2.headers = g({}, this.config.request_headers, t2.headers), t2.compression = "best-available" === t2.compression ? this.compression : t2.compression, t2.disableXHRCredentials = this.config.__preview_disable_xhr_credentials, this.config.__preview_disable_beacon && (t2.disableTransport = ["sendBeacon"]), t2.fetchOptions = t2.fetchOptions || this.config.fetch_options, ((t3) => {
      var i2, e2, r2, s2 = g({}, t3);
      s2.timeout = s2.timeout || 6e4, s2.url = un(s2.url, { _: (/* @__PURE__ */ new Date()).getTime().toString(), ver: c.LIB_VERSION, compression: s2.compression });
      var n2 = null !== (i2 = s2.transport) && void 0 !== i2 ? i2 : "fetch", o2 = vn.filter(((t4) => !s2.disableTransport || !t4.transport || !s2.disableTransport.includes(t4.transport))), a2 = null !== (e2 = null == (r2 = Ui(o2, ((t4) => t4.transport === n2))) ? void 0 : r2.method) && void 0 !== e2 ? e2 : o2[0].method;
      if (!a2) throw new Error("No available transport method");
      a2(s2);
    })(g({}, t2, { callback: (i2) => {
      var e2, r2;
      (this.rateLimiter.checkForLimiting(i2), i2.statusCode >= 400) && (null == (e2 = (r2 = this.config).on_request_error) || e2.call(r2, i2));
      null == t2.callback || t2.callback(i2);
    } }))));
  }
  es(t2) {
    this.rs ? this.rs.retriableRequest(t2) : this._send_request(t2);
  }
  _execute_array(t2) {
    var i2, e2 = [], r2 = [], s2 = [];
    Ii(t2, ((t3) => {
      t3 && (i2 = t3[0], I(i2) ? s2.push(t3) : C(t3) ? t3.call(this) : I(t3) && "alias" === i2 ? e2.push(t3) : I(t3) && -1 !== i2.indexOf("capture") && C(this[i2]) ? s2.push(t3) : r2.push(t3));
    }));
    var n2 = function(t3, i3) {
      Ii(t3, (function(t4) {
        if (I(t4[0])) {
          var e3 = i3;
          Ci(t4, (function(t5) {
            e3 = e3[t5[0]].apply(e3, t5.slice(1));
          }));
        } else this[t4[0]].apply(this, t4.slice(1));
      }), i3);
    };
    n2(e2, this), n2(r2, this), n2(s2, this);
  }
  ns() {
    var t2, i2;
    return (null == (t2 = this.config.bootstrap) ? void 0 : t2.featureFlags) && Object.keys(null == (i2 = this.config.bootstrap) ? void 0 : i2.featureFlags).length > 0 || false;
  }
  push(t2) {
    this._execute_array([t2]);
  }
  capture(t2, i2, e2) {
    var r2;
    if (this.__loaded && this.persistence && this.sessionPersistence && this.ts) {
      if (this.is_capturing()) if (!M(t2) && O(t2)) {
        var s2 = !this.config.opt_out_useragent_filter && this._is_bot();
        if (!(s2 && !this.config.__preview_capture_bot_pageviews)) {
          var n2 = null != e2 && e2.skip_client_rate_limiting ? void 0 : this.rateLimiter.clientRateLimitContext();
          if (null == n2 || !n2.isRateLimited) {
            null != i2 && i2.$current_url && !O(null == i2 ? void 0 : i2.$current_url) && ($i.error("Invalid `$current_url` property provided to `posthog.capture`. Input must be a string. Ignoring provided value."), null == i2 || delete i2.$current_url), this.sessionPersistence.update_search_keyword(), this.config.save_campaign_params && this.sessionPersistence.update_campaign_params(), this.config.save_referrer && this.sessionPersistence.update_referrer_info(), (this.config.save_campaign_params || this.config.save_referrer) && this.persistence.set_initial_person_info();
            var o2 = /* @__PURE__ */ new Date(), a2 = (null == e2 ? void 0 : e2.timestamp) || o2, l2 = br(), u2 = { uuid: l2, event: t2, properties: this.calculateEventProperties(t2, i2 || {}, a2, l2) };
            "$pageview" === t2 && this.config.__preview_capture_bot_pageviews && s2 && (u2.event = "$bot_pageview", u2.properties.$browser_type = "bot"), n2 && (u2.properties.$lib_rate_limit_remaining_tokens = n2.remainingTokens), (null == e2 ? void 0 : e2.$set) && (u2.$set = null == e2 ? void 0 : e2.$set);
            var h3, d2 = "$groupidentify" !== t2, v2 = this.cs(null == e2 ? void 0 : e2.$set_once, d2);
            if (v2 && (u2.$set_once = v2), (u2 = ji(u2, null != e2 && e2._noTruncate ? null : this.config.properties_string_max_length)).timestamp = a2, M(null == e2 ? void 0 : e2.timestamp) || (u2.properties.$event_time_override_provided = true, u2.properties.$event_time_override_system_time = o2), t2 === Wn.DISMISSED || t2 === Wn.SENT) {
              var c2 = null == i2 ? void 0 : i2[Gn.SURVEY_ID], f2 = null == i2 ? void 0 : i2[Gn.SURVEY_ITERATION];
              h3 = { id: c2, current_iteration: f2 }, localStorage.getItem(Xn(h3)) || localStorage.setItem(Xn(h3), "true"), u2.$set = g({}, u2.$set, { [Yn({ id: c2, current_iteration: f2 }, t2 === Wn.SENT ? "responded" : "dismissed")]: true });
            } else t2 === Wn.SHOWN && (u2.$set = g({}, u2.$set, { [Gn.SURVEY_LAST_SEEN_DATE]: (/* @__PURE__ */ new Date()).toISOString() }));
            var p2 = g({}, u2.properties.$set, u2.$set);
            if (F(p2) || this.setPersonPropertiesForFlags(p2), !j(this.config.before_send)) {
              var _2 = this.fs(u2);
              if (!_2) return;
              u2 = _2;
            }
            this.Wr.emit("eventCaptured", u2);
            var m2 = { method: "POST", url: null !== (r2 = null == e2 ? void 0 : e2._url) && void 0 !== r2 ? r2 : this.requestRouter.endpointFor("api", this.analyticsDefaultEndpoint), data: u2, compression: "best-available", batchKey: null == e2 ? void 0 : e2._batchKey };
            return !this.config.request_batching || e2 && (null == e2 || !e2._batchKey) || null != e2 && e2.send_instantly ? this.es(m2) : this.ts.enqueue(m2), u2;
          }
          $i.critical("This capture call is ignored due to client rate limiting.");
        }
      } else $i.error("No event name provided to posthog.capture");
    } else $i.uninitializedWarning("posthog.capture");
  }
  Bi(t2) {
    return this.on("eventCaptured", ((i2) => t2(i2.event, i2)));
  }
  calculateEventProperties(t2, i2, e2, r2, s2) {
    if (e2 = e2 || /* @__PURE__ */ new Date(), !this.persistence || !this.sessionPersistence) return i2;
    var n2 = s2 ? void 0 : this.persistence.remove_event_timer(t2), a2 = g({}, i2);
    if (a2.token = this.config.token, a2.$config_defaults = this.config.defaults, ("always" == this.config.cookieless_mode || "on_reject" == this.config.cookieless_mode && this.consent.isExplicitlyOptedOut()) && (a2.$cookieless_mode = true), "$snapshot" === t2) {
      var l2 = g({}, this.persistence.properties(), this.sessionPersistence.properties());
      return a2.distinct_id = l2.distinct_id, (!O(a2.distinct_id) && !L(a2.distinct_id) || A(a2.distinct_id)) && $i.error("Invalid distinct_id for replay event. This indicates a bug in your implementation"), a2;
    }
    var u2, h3 = ps(this.config.mask_personal_data_properties, this.config.custom_personal_data_properties);
    if (this.sessionManager) {
      var { sessionId: v2, windowId: c2 } = this.sessionManager.checkAndGetSessionAndWindowId(s2, e2.getTime());
      a2.$session_id = v2, a2.$window_id = c2;
    }
    this.sessionPropsManager && Ri(a2, this.sessionPropsManager.getSessionProps());
    try {
      var f2;
      this.sessionRecording && Ri(a2, this.sessionRecording.sdkDebugProperties), a2.$sdk_debug_retry_queue_size = null == (f2 = this.rs) ? void 0 : f2.length;
    } catch (t3) {
      a2.$sdk_debug_error_capturing_properties = String(t3);
    }
    if (this.requestRouter.region === Po.CUSTOM && (a2.$lib_custom_api_host = this.config.api_host), u2 = "$pageview" !== t2 || s2 ? "$pageleave" !== t2 || s2 ? this.pageViewManager.doEvent() : this.pageViewManager.doPageLeave(e2) : this.pageViewManager.doPageView(e2, r2), a2 = Ri(a2, u2), "$pageview" === t2 && o && (a2.title = o.title), !M(n2)) {
      var p2 = e2.getTime() - n2;
      a2.$duration = parseFloat((p2 / 1e3).toFixed(3));
    }
    d && this.config.opt_out_useragent_filter && (a2.$browser_type = this._is_bot() ? "bot" : "browser"), (a2 = Ri({}, h3, this.persistence.properties(), this.sessionPersistence.properties(), a2)).$is_identified = this._isIdentified(), I(this.config.property_denylist) ? Ci(this.config.property_denylist, (function(t3) {
      delete a2[t3];
    })) : $i.error("Invalid value for property_denylist config: " + this.config.property_denylist + " or property_blacklist config: " + this.config.property_blacklist);
    var _2 = this.config.sanitize_properties;
    _2 && ($i.error("sanitize_properties is deprecated. Use before_send instead"), a2 = _2(a2, t2));
    var m2 = this.ps();
    return a2.$process_person_profile = m2, m2 && !s2 && this.gs("_calculate_event_properties"), a2;
  }
  cs(t2, i2) {
    var e2;
    if (void 0 === i2 && (i2 = true), !this.persistence || !this.ps()) return t2;
    if (this.qr) return t2;
    var r2 = this.persistence.get_initial_props(), s2 = null == (e2 = this.sessionPropsManager) ? void 0 : e2.getSetOnceProps(), n2 = Ri({}, r2, s2 || {}, t2 || {}), o2 = this.config.sanitize_properties;
    return o2 && ($i.error("sanitize_properties is deprecated. Use before_send instead"), n2 = o2(n2, "$set_once")), i2 && (this.qr = true), F(n2) ? void 0 : n2;
  }
  register(t2, i2) {
    var e2;
    null == (e2 = this.persistence) || e2.register(t2, i2);
  }
  register_once(t2, i2, e2) {
    var r2;
    null == (r2 = this.persistence) || r2.register_once(t2, i2, e2);
  }
  register_for_session(t2) {
    var i2;
    null == (i2 = this.sessionPersistence) || i2.register(t2);
  }
  unregister(t2) {
    var i2;
    null == (i2 = this.persistence) || i2.unregister(t2);
  }
  unregister_for_session(t2) {
    var i2;
    null == (i2 = this.sessionPersistence) || i2.unregister(t2);
  }
  _s(t2, i2) {
    this.register({ [t2]: i2 });
  }
  getFeatureFlag(t2, i2) {
    return this.featureFlags.getFeatureFlag(t2, i2);
  }
  getFeatureFlagPayload(t2) {
    var i2 = this.featureFlags.getFeatureFlagPayload(t2);
    try {
      return JSON.parse(i2);
    } catch (t3) {
      return i2;
    }
  }
  isFeatureEnabled(t2, i2) {
    return this.featureFlags.isFeatureEnabled(t2, i2);
  }
  reloadFeatureFlags() {
    this.featureFlags.reloadFeatureFlags();
  }
  updateFlags(t2, i2, e2) {
    var r2 = null != e2 && e2.merge ? this.featureFlags.getFlagVariants() : {}, s2 = null != e2 && e2.merge ? this.featureFlags.getFlagPayloads() : {}, n2 = g({}, r2, t2), o2 = g({}, s2, i2), a2 = {};
    for (var [l2, u2] of Object.entries(n2)) {
      var h3 = "string" == typeof u2;
      a2[l2] = { key: l2, enabled: !!h3 || Boolean(u2), variant: h3 ? u2 : void 0, reason: void 0, metadata: M(null == o2 ? void 0 : o2[l2]) ? void 0 : { id: 0, version: void 0, description: void 0, payload: o2[l2] } };
    }
    this.featureFlags.receivedFeatureFlags({ flags: a2 });
  }
  updateEarlyAccessFeatureEnrollment(t2, i2, e2) {
    this.featureFlags.updateEarlyAccessFeatureEnrollment(t2, i2, e2);
  }
  getEarlyAccessFeatures(t2, i2, e2) {
    return void 0 === i2 && (i2 = false), this.featureFlags.getEarlyAccessFeatures(t2, i2, e2);
  }
  on(t2, i2) {
    return this.Wr.on(t2, i2);
  }
  onFeatureFlags(t2) {
    return this.featureFlags.onFeatureFlags(t2);
  }
  onSurveysLoaded(t2) {
    return this.surveys.onSurveysLoaded(t2);
  }
  onSessionId(t2) {
    var i2, e2;
    return null !== (i2 = null == (e2 = this.sessionManager) ? void 0 : e2.onSessionId(t2)) && void 0 !== i2 ? i2 : () => {
    };
  }
  getSurveys(t2, i2) {
    void 0 === i2 && (i2 = false), this.surveys.getSurveys(t2, i2);
  }
  getActiveMatchingSurveys(t2, i2) {
    void 0 === i2 && (i2 = false), this.surveys.getActiveMatchingSurveys(t2, i2);
  }
  renderSurvey(t2, i2) {
    this.surveys.renderSurvey(t2, i2);
  }
  displaySurvey(t2, i2) {
    void 0 === i2 && (i2 = Zn), this.surveys.displaySurvey(t2, i2);
  }
  cancelPendingSurvey(t2) {
    this.surveys.cancelPendingSurvey(t2);
  }
  canRenderSurvey(t2) {
    return this.surveys.canRenderSurvey(t2);
  }
  canRenderSurveyAsync(t2, i2) {
    return void 0 === i2 && (i2 = false), this.surveys.canRenderSurveyAsync(t2, i2);
  }
  identify(t2, i2, e2) {
    if (!this.__loaded || !this.persistence) return $i.uninitializedWarning("posthog.identify");
    if (L(t2) && (t2 = t2.toString(), $i.warn("The first argument to posthog.identify was a number, but it should be a string. It has been converted to a string.")), t2) if (["distinct_id", "distinctid"].includes(t2.toLowerCase())) $i.critical('The string "' + t2 + '" was set in posthog.identify which indicates an error. This ID should be unique to the user and not a hardcoded string.');
    else if (t2 !== me) {
      if (this.gs("posthog.identify")) {
        var r2 = this.get_distinct_id();
        if (this.register({ $user_id: t2 }), !this.get_property("$device_id")) {
          var s2 = r2;
          this.register_once({ $had_persisted_distinct_id: true, $device_id: s2 }, "");
        }
        t2 !== r2 && t2 !== this.get_property(Bi) && (this.unregister(Bi), this.register({ distinct_id: t2 }));
        var n2 = "anonymous" === (this.persistence.get_property(he) || "anonymous");
        t2 !== r2 && n2 ? (this.persistence.set_property(he, "identified"), this.setPersonPropertiesForFlags(g({}, e2 || {}, i2 || {}), false), this.capture("$identify", { distinct_id: t2, $anon_distinct_id: r2 }, { $set: i2 || {}, $set_once: e2 || {} }), this.Kr = fn(t2, i2, e2), this.featureFlags.setAnonymousDistinctId(r2)) : (i2 || e2) && this.setPersonProperties(i2, e2), t2 !== r2 && (this.reloadFeatureFlags(), this.unregister(ue));
      }
    } else $i.critical('The string "' + me + '" was set in posthog.identify which indicates an error. This ID is only used as a sentinel value.');
    else $i.error("Unique user id has not been set in posthog.identify");
  }
  setPersonProperties(t2, i2) {
    if ((t2 || i2) && this.gs("posthog.setPersonProperties")) {
      var e2 = fn(this.get_distinct_id(), t2, i2);
      this.Kr !== e2 ? (this.setPersonPropertiesForFlags(g({}, i2 || {}, t2 || {})), this.capture("$set", { $set: t2 || {}, $set_once: i2 || {} }), this.Kr = e2) : $i.info("A duplicate setPersonProperties call was made with the same properties. It has been ignored.");
    }
  }
  group(t2, i2, e2) {
    if (t2 && i2) {
      var r2 = this.getGroups();
      r2[t2] !== i2 && this.resetGroupPropertiesForFlags(t2), this.register({ $groups: g({}, r2, { [t2]: i2 }) }), e2 && (this.capture("$groupidentify", { $group_type: t2, $group_key: i2, $group_set: e2 }), this.setGroupPropertiesForFlags({ [t2]: e2 })), r2[t2] === i2 || e2 || this.reloadFeatureFlags();
    } else $i.error("posthog.group requires a group type and group key");
  }
  resetGroups() {
    this.register({ $groups: {} }), this.resetGroupPropertiesForFlags(), this.reloadFeatureFlags();
  }
  setPersonPropertiesForFlags(t2, i2) {
    void 0 === i2 && (i2 = true), this.featureFlags.setPersonPropertiesForFlags(t2, i2);
  }
  resetPersonPropertiesForFlags() {
    this.featureFlags.resetPersonPropertiesForFlags();
  }
  setGroupPropertiesForFlags(t2, i2) {
    void 0 === i2 && (i2 = true), this.gs("posthog.setGroupPropertiesForFlags") && this.featureFlags.setGroupPropertiesForFlags(t2, i2);
  }
  resetGroupPropertiesForFlags(t2) {
    this.featureFlags.resetGroupPropertiesForFlags(t2);
  }
  reset(t2) {
    var i2, e2, r2, s2;
    if ($i.info("reset"), !this.__loaded) return $i.uninitializedWarning("posthog.reset");
    var n2 = this.get_property("$device_id");
    if (this.consent.reset(), null == (i2 = this.persistence) || i2.clear(), null == (e2 = this.sessionPersistence) || e2.clear(), this.surveys.reset(), this.featureFlags.reset(), null == (r2 = this.persistence) || r2.set_property(he, "anonymous"), null == (s2 = this.sessionManager) || s2.resetSessionId(), this.Kr = null, "always" === this.config.cookieless_mode) this.register_once({ distinct_id: me, $device_id: null }, "");
    else {
      var o2 = this.config.get_device_id(br());
      this.register_once({ distinct_id: o2, $device_id: t2 ? o2 : n2 }, "");
    }
    this.register({ $last_posthog_reset: (/* @__PURE__ */ new Date()).toISOString() }, 1);
  }
  get_distinct_id() {
    return this.get_property("distinct_id");
  }
  getGroups() {
    return this.get_property("$groups") || {};
  }
  get_session_id() {
    var t2, i2;
    return null !== (t2 = null == (i2 = this.sessionManager) ? void 0 : i2.checkAndGetSessionAndWindowId(true).sessionId) && void 0 !== t2 ? t2 : "";
  }
  get_session_replay_url(t2) {
    if (!this.sessionManager) return "";
    var { sessionId: i2, sessionStartTimestamp: e2 } = this.sessionManager.checkAndGetSessionAndWindowId(true), r2 = this.requestRouter.endpointFor("ui", "/project/" + this.config.token + "/replay/" + i2);
    if (null != t2 && t2.withTimestamp && e2) {
      var s2, n2 = null !== (s2 = t2.timestampLookBack) && void 0 !== s2 ? s2 : 10;
      if (!e2) return r2;
      r2 += "?t=" + Math.max(Math.floor(((/* @__PURE__ */ new Date()).getTime() - e2) / 1e3) - n2, 0);
    }
    return r2;
  }
  alias(t2, i2) {
    return t2 === this.get_property(Hi) ? ($i.critical("Attempting to create alias for existing People user - aborting."), -2) : this.gs("posthog.alias") ? (M(i2) && (i2 = this.get_distinct_id()), t2 !== i2 ? (this._s(Bi, t2), this.capture("$create_alias", { alias: t2, distinct_id: i2 })) : ($i.warn("alias matches current distinct_id - skipping api call."), this.identify(t2), -1)) : void 0;
  }
  set_config(t2) {
    var i2 = g({}, this.config);
    if (R(t2)) {
      var e2, r2, s2, n2, o2, a2, l2;
      Ri(this.config, Bo(t2));
      var u2 = this.Zr();
      null == (e2 = this.persistence) || e2.update_config(this.config, i2, u2), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new Mn(g({}, this.config, { persistence: "sessionStorage" }), u2);
      var h3 = this.Yr(this.config.debug);
      U(h3) && (this.config.debug = h3), U(this.config.debug) && (this.config.debug ? (c.DEBUG = true, Pr.H() && Pr.G("ph_debug", "true"), $i.info("set_config", { config: t2, oldConfig: i2, newConfig: g({}, this.config) })) : (c.DEBUG = false, Pr.H() && Pr.V("ph_debug"))), null == (r2 = this.exceptionObserver) || r2.onConfigChange(), null == (s2 = this.sessionRecording) || s2.startIfEnabledOrStop(), null == (n2 = this.autocapture) || n2.startIfEnabled(), null == (o2 = this.heatmaps) || o2.startIfEnabled(), null == (a2 = this.exceptionObserver) || a2.startIfEnabledOrStop(), this.surveys.loadIfEnabled(), this.ys(), null == (l2 = this.externalIntegrations) || l2.startIfEnabledOrStop();
    }
  }
  startSessionRecording(t2) {
    var i2 = true === t2, e2 = { sampling: i2 || !(null == t2 || !t2.sampling), linked_flag: i2 || !(null == t2 || !t2.linked_flag), url_trigger: i2 || !(null == t2 || !t2.url_trigger), event_trigger: i2 || !(null == t2 || !t2.event_trigger) };
    if (Object.values(e2).some(Boolean)) {
      var r2, s2, n2, o2, a2;
      if (null == (r2 = this.sessionManager) || r2.checkAndGetSessionAndWindowId(), e2.sampling) null == (s2 = this.sessionRecording) || s2.overrideSampling();
      if (e2.linked_flag) null == (n2 = this.sessionRecording) || n2.overrideLinkedFlag();
      if (e2.url_trigger) null == (o2 = this.sessionRecording) || o2.overrideTrigger("url");
      if (e2.event_trigger) null == (a2 = this.sessionRecording) || a2.overrideTrigger("event");
    }
    this.set_config({ disable_session_recording: false });
  }
  stopSessionRecording() {
    this.set_config({ disable_session_recording: true });
  }
  sessionRecordingStarted() {
    var t2;
    return !(null == (t2 = this.sessionRecording) || !t2.started);
  }
  captureException(t2, i2) {
    var e2 = new Error("PostHog syntheticException"), r2 = this.exceptions.buildProperties(t2, { handled: true, syntheticException: e2 });
    return this.exceptions.sendExceptionEvent(g({}, r2, i2));
  }
  startExceptionAutocapture(t2) {
    this.set_config({ capture_exceptions: null == t2 || t2 });
  }
  stopExceptionAutocapture() {
    this.set_config({ capture_exceptions: false });
  }
  loadToolbar(t2) {
    return this.toolbar.loadToolbar(t2);
  }
  get_property(t2) {
    var i2;
    return null == (i2 = this.persistence) ? void 0 : i2.props[t2];
  }
  getSessionProperty(t2) {
    var i2;
    return null == (i2 = this.sessionPersistence) ? void 0 : i2.props[t2];
  }
  toString() {
    var t2, i2 = null !== (t2 = this.config.name) && void 0 !== t2 ? t2 : Uo;
    return i2 !== Uo && (i2 = Uo + "." + i2), i2;
  }
  _isIdentified() {
    var t2, i2;
    return "identified" === (null == (t2 = this.persistence) ? void 0 : t2.get_property(he)) || "identified" === (null == (i2 = this.sessionPersistence) ? void 0 : i2.get_property(he));
  }
  ps() {
    var t2, i2;
    return !("never" === this.config.person_profiles || "identified_only" === this.config.person_profiles && !this._isIdentified() && F(this.getGroups()) && (null == (t2 = this.persistence) || null == (t2 = t2.props) || !t2[Bi]) && (null == (i2 = this.persistence) || null == (i2 = i2.props) || !i2[ge]));
  }
  vs() {
    return true === this.config.capture_pageleave || "if_capture_pageview" === this.config.capture_pageleave && (true === this.config.capture_pageview || "history_change" === this.config.capture_pageview);
  }
  createPersonProfile() {
    this.ps() || this.gs("posthog.createPersonProfile") && this.setPersonProperties({}, {});
  }
  gs(t2) {
    return "never" === this.config.person_profiles ? ($i.error(t2 + ' was called, but process_person is set to "never". This call will be ignored.'), false) : (this._s(ge, true), true);
  }
  Zr() {
    if ("always" === this.config.cookieless_mode) return true;
    var t2 = this.consent.isOptedOut(), i2 = this.config.opt_out_persistence_by_default || "on_reject" === this.config.cookieless_mode;
    return this.config.disable_persistence || t2 && !!i2;
  }
  ys() {
    var t2, i2, e2, r2, s2 = this.Zr();
    (null == (t2 = this.persistence) ? void 0 : t2.ki) !== s2 && (null == (e2 = this.persistence) || e2.set_disabled(s2));
    (null == (i2 = this.sessionPersistence) ? void 0 : i2.ki) !== s2 && (null == (r2 = this.sessionPersistence) || r2.set_disabled(s2));
    return s2;
  }
  opt_in_capturing(t2) {
    var i2;
    if ("always" !== this.config.cookieless_mode) {
      var e2, r2, s2;
      if ("on_reject" === this.config.cookieless_mode && this.consent.isExplicitlyOptedOut()) this.reset(true), null == (e2 = this.sessionManager) || e2.destroy(), null == (r2 = this.pageViewManager) || r2.destroy(), this.sessionManager = new xo(this), this.pageViewManager = new xs(this), this.persistence && (this.sessionPropsManager = new bo(this, this.sessionManager, this.persistence)), this.sessionRecording = new jo(this), this.sessionRecording.startIfEnabledOrStop();
      if (this.consent.optInOut(true), this.ys(), this.hs(), null == (i2 = this.sessionRecording) || i2.startIfEnabledOrStop(), "on_reject" == this.config.cookieless_mode && this.surveys.loadIfEnabled(), M(null == t2 ? void 0 : t2.captureEventName) || null != t2 && t2.captureEventName) this.capture(null !== (s2 = null == t2 ? void 0 : t2.captureEventName) && void 0 !== s2 ? s2 : "$opt_in", null == t2 ? void 0 : t2.captureProperties, { send_instantly: true });
      this.config.capture_pageview && this.ds();
    } else $i.warn('Consent opt in/out is not valid with cookieless_mode="always" and will be ignored');
  }
  opt_out_capturing() {
    var t2, i2, e2;
    "always" !== this.config.cookieless_mode ? ("on_reject" === this.config.cookieless_mode && this.consent.isOptedIn() && this.reset(true), this.consent.optInOut(false), this.ys(), "on_reject" === this.config.cookieless_mode && (this.register({ distinct_id: me, $device_id: null }), null == (t2 = this.sessionManager) || t2.destroy(), null == (i2 = this.pageViewManager) || i2.destroy(), this.sessionManager = void 0, this.sessionPropsManager = void 0, null == (e2 = this.sessionRecording) || e2.stopRecording(), this.sessionRecording = void 0, this.ds())) : $i.warn('Consent opt in/out is not valid with cookieless_mode="always" and will be ignored');
  }
  has_opted_in_capturing() {
    return this.consent.isOptedIn();
  }
  has_opted_out_capturing() {
    return this.consent.isOptedOut();
  }
  get_explicit_consent_status() {
    var t2 = this.consent.consent;
    return t2 === Mr.GRANTED ? "granted" : t2 === Mr.DENIED ? "denied" : "pending";
  }
  is_capturing() {
    return "always" === this.config.cookieless_mode || ("on_reject" === this.config.cookieless_mode ? this.consent.isExplicitlyOptedOut() || this.consent.isOptedIn() : !this.has_opted_out_capturing());
  }
  clear_opt_in_out_capturing() {
    this.consent.reset(), this.ys();
  }
  _is_bot() {
    return n ? ko(n, this.config.custom_blocked_useragents) : void 0;
  }
  ds() {
    o && ("visible" === o.visibilityState ? this.Gr || (this.Gr = true, this.capture("$pageview", { title: o.title }, { send_instantly: true }), this.Vr && (o.removeEventListener("visibilitychange", this.Vr), this.Vr = null)) : this.Vr || (this.Vr = this.ds.bind(this), zi(o, "visibilitychange", this.Vr)));
  }
  debug(i2) {
    false === i2 ? (null == t || t.console.log("You've disabled debug mode."), this.set_config({ debug: false })) : (null == t || t.console.log("You're now in debug mode. All calls to PostHog will be logged in your console.\nYou can disable this with `posthog.debug(false)`."), this.set_config({ debug: true }));
  }
  O() {
    var t2, i2, e2, r2, s2, n2, o2, a2 = this.Xr || {};
    return "advanced_disable_flags" in a2 ? !!a2.advanced_disable_flags : false !== this.config.advanced_disable_flags ? !!this.config.advanced_disable_flags : true === this.config.advanced_disable_decide ? ($i.warn("Config field 'advanced_disable_decide' is deprecated. Please use 'advanced_disable_flags' instead. The old field will be removed in a future major version."), true) : (e2 = "advanced_disable_decide", r2 = false, s2 = $i, n2 = (i2 = "advanced_disable_flags") in (t2 = a2) && !M(t2[i2]), o2 = e2 in t2 && !M(t2[e2]), n2 ? t2[i2] : o2 ? (s2 && s2.warn("Config field '" + e2 + "' is deprecated. Please use '" + i2 + "' instead. The old field will be removed in a future major version."), t2[e2]) : r2);
  }
  fs(t2) {
    if (j(this.config.before_send)) return t2;
    var i2 = I(this.config.before_send) ? this.config.before_send : [this.config.before_send], e2 = t2;
    for (var r2 of i2) {
      if (e2 = r2(e2), j(e2)) {
        var s2 = "Event '" + t2.event + "' was rejected in beforeSend function";
        return H(t2.event) ? $i.warn(s2 + ". This can cause unexpected behavior.") : $i.info(s2), null;
      }
      e2.properties && !F(e2.properties) || $i.warn("Event '" + t2.event + "' has no properties after beforeSend function, this is likely an error.");
    }
    return e2;
  }
  getPageViewId() {
    var t2;
    return null == (t2 = this.pageViewManager.Kt) ? void 0 : t2.pageViewId;
  }
  captureTraceFeedback(t2, i2) {
    this.capture("$ai_feedback", { $ai_trace_id: String(t2), $ai_feedback_text: i2 });
  }
  captureTraceMetric(t2, i2, e2) {
    this.capture("$ai_metric", { $ai_trace_id: String(t2), $ai_metric_name: i2, $ai_metric_value: String(e2) });
  }
  Yr(t2) {
    var i2 = U(t2) && !t2, e2 = Pr.H() && "true" === Pr.q("ph_debug");
    return !i2 && (!!e2 || t2);
  }
};
!(function(t2, i2) {
  for (var e2 = 0; e2 < i2.length; e2++) t2.prototype[i2[e2]] = Ai(t2.prototype[i2[e2]]);
})(Wo, ["identify"]);
var Go;
var Jo = (Go = Lo[Uo] = new Wo(), (function() {
  function i2() {
    i2.done || (i2.done = true, zo = false, Ci(Lo, (function(t2) {
      t2._dom_loaded();
    })));
  }
  null != o && o.addEventListener ? "complete" === o.readyState ? i2() : zi(o, "DOMContentLoaded", i2, { capture: false }) : t && $i.error("Browser doesn't support `document.addEventListener` so PostHog couldn't be initialized");
})(), Go);

// node_modules/@kurkle/color/dist/color.esm.js
function round(v2) {
  return v2 + 0.5 | 0;
}
var lim = (v2, l2, h3) => Math.max(Math.min(v2, h3), l2);
function p2b(v2) {
  return lim(round(v2 * 2.55), 0, 255);
}
function n2b(v2) {
  return lim(round(v2 * 255), 0, 255);
}
function b2n(v2) {
  return lim(round(v2 / 2.55) / 100, 0, 1);
}
function n2p(v2) {
  return lim(round(v2 * 100), 0, 100);
}
var map$1 = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 };
var hex = [..."0123456789ABCDEF"];
var h1 = (b2) => hex[b2 & 15];
var h2 = (b2) => hex[(b2 & 240) >> 4] + hex[b2 & 15];
var eq = (b2) => (b2 & 240) >> 4 === (b2 & 15);
var isShort = (v2) => eq(v2.r) && eq(v2.g) && eq(v2.b) && eq(v2.a);
function hexParse(str) {
  var len = str.length;
  var ret;
  if (str[0] === "#") {
    if (len === 4 || len === 5) {
      ret = {
        r: 255 & map$1[str[1]] * 17,
        g: 255 & map$1[str[2]] * 17,
        b: 255 & map$1[str[3]] * 17,
        a: len === 5 ? map$1[str[4]] * 17 : 255
      };
    } else if (len === 7 || len === 9) {
      ret = {
        r: map$1[str[1]] << 4 | map$1[str[2]],
        g: map$1[str[3]] << 4 | map$1[str[4]],
        b: map$1[str[5]] << 4 | map$1[str[6]],
        a: len === 9 ? map$1[str[7]] << 4 | map$1[str[8]] : 255
      };
    }
  }
  return ret;
}
var alpha = (a2, f2) => a2 < 255 ? f2(a2) : "";
function hexString(v2) {
  var f2 = isShort(v2) ? h1 : h2;
  return v2 ? "#" + f2(v2.r) + f2(v2.g) + f2(v2.b) + alpha(v2.a, f2) : void 0;
}
var HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function hsl2rgbn(h3, s2, l2) {
  const a2 = s2 * Math.min(l2, 1 - l2);
  const f2 = (n2, k2 = (n2 + h3 / 30) % 12) => l2 - a2 * Math.max(Math.min(k2 - 3, 9 - k2, 1), -1);
  return [f2(0), f2(8), f2(4)];
}
function hsv2rgbn(h3, s2, v2) {
  const f2 = (n2, k2 = (n2 + h3 / 60) % 6) => v2 - v2 * s2 * Math.max(Math.min(k2, 4 - k2, 1), 0);
  return [f2(5), f2(3), f2(1)];
}
function hwb2rgbn(h3, w2, b2) {
  const rgb = hsl2rgbn(h3, 1, 0.5);
  let i2;
  if (w2 + b2 > 1) {
    i2 = 1 / (w2 + b2);
    w2 *= i2;
    b2 *= i2;
  }
  for (i2 = 0; i2 < 3; i2++) {
    rgb[i2] *= 1 - w2 - b2;
    rgb[i2] += w2;
  }
  return rgb;
}
function hueValue(r2, g2, b2, d2, max) {
  if (r2 === max) {
    return (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
  }
  if (g2 === max) {
    return (b2 - r2) / d2 + 2;
  }
  return (r2 - g2) / d2 + 4;
}
function rgb2hsl(v2) {
  const range = 255;
  const r2 = v2.r / range;
  const g2 = v2.g / range;
  const b2 = v2.b / range;
  const max = Math.max(r2, g2, b2);
  const min = Math.min(r2, g2, b2);
  const l2 = (max + min) / 2;
  let h3, s2, d2;
  if (max !== min) {
    d2 = max - min;
    s2 = l2 > 0.5 ? d2 / (2 - max - min) : d2 / (max + min);
    h3 = hueValue(r2, g2, b2, d2, max);
    h3 = h3 * 60 + 0.5;
  }
  return [h3 | 0, s2 || 0, l2];
}
function calln(f2, a2, b2, c2) {
  return (Array.isArray(a2) ? f2(a2[0], a2[1], a2[2]) : f2(a2, b2, c2)).map(n2b);
}
function hsl2rgb(h3, s2, l2) {
  return calln(hsl2rgbn, h3, s2, l2);
}
function hwb2rgb(h3, w2, b2) {
  return calln(hwb2rgbn, h3, w2, b2);
}
function hsv2rgb(h3, s2, v2) {
  return calln(hsv2rgbn, h3, s2, v2);
}
function hue(h3) {
  return (h3 % 360 + 360) % 360;
}
function hueParse(str) {
  const m2 = HUE_RE.exec(str);
  let a2 = 255;
  let v2;
  if (!m2) {
    return;
  }
  if (m2[5] !== v2) {
    a2 = m2[6] ? p2b(+m2[5]) : n2b(+m2[5]);
  }
  const h3 = hue(+m2[2]);
  const p1 = +m2[3] / 100;
  const p2 = +m2[4] / 100;
  if (m2[1] === "hwb") {
    v2 = hwb2rgb(h3, p1, p2);
  } else if (m2[1] === "hsv") {
    v2 = hsv2rgb(h3, p1, p2);
  } else {
    v2 = hsl2rgb(h3, p1, p2);
  }
  return {
    r: v2[0],
    g: v2[1],
    b: v2[2],
    a: a2
  };
}
function rotate(v2, deg) {
  var h3 = rgb2hsl(v2);
  h3[0] = hue(h3[0] + deg);
  h3 = hsl2rgb(h3);
  v2.r = h3[0];
  v2.g = h3[1];
  v2.b = h3[2];
}
function hslString(v2) {
  if (!v2) {
    return;
  }
  const a2 = rgb2hsl(v2);
  const h3 = a2[0];
  const s2 = n2p(a2[1]);
  const l2 = n2p(a2[2]);
  return v2.a < 255 ? `hsla(${h3}, ${s2}%, ${l2}%, ${b2n(v2.a)})` : `hsl(${h3}, ${s2}%, ${l2}%)`;
}
var map = {
  x: "dark",
  Z: "light",
  Y: "re",
  X: "blu",
  W: "gr",
  V: "medium",
  U: "slate",
  A: "ee",
  T: "ol",
  S: "or",
  B: "ra",
  C: "lateg",
  D: "ights",
  R: "in",
  Q: "turquois",
  E: "hi",
  P: "ro",
  O: "al",
  N: "le",
  M: "de",
  L: "yello",
  F: "en",
  K: "ch",
  G: "arks",
  H: "ea",
  I: "ightg",
  J: "wh"
};
var names$1 = {
  OiceXe: "f0f8ff",
  antiquewEte: "faebd7",
  aqua: "ffff",
  aquamarRe: "7fffd4",
  azuY: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "0",
  blanKedOmond: "ffebcd",
  Xe: "ff",
  XeviTet: "8a2be2",
  bPwn: "a52a2a",
  burlywood: "deb887",
  caMtXe: "5f9ea0",
  KartYuse: "7fff00",
  KocTate: "d2691e",
  cSO: "ff7f50",
  cSnflowerXe: "6495ed",
  cSnsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "ffff",
  xXe: "8b",
  xcyan: "8b8b",
  xgTMnPd: "b8860b",
  xWay: "a9a9a9",
  xgYF: "6400",
  xgYy: "a9a9a9",
  xkhaki: "bdb76b",
  xmagFta: "8b008b",
  xTivegYF: "556b2f",
  xSange: "ff8c00",
  xScEd: "9932cc",
  xYd: "8b0000",
  xsOmon: "e9967a",
  xsHgYF: "8fbc8f",
  xUXe: "483d8b",
  xUWay: "2f4f4f",
  xUgYy: "2f4f4f",
  xQe: "ced1",
  xviTet: "9400d3",
  dAppRk: "ff1493",
  dApskyXe: "bfff",
  dimWay: "696969",
  dimgYy: "696969",
  dodgerXe: "1e90ff",
  fiYbrick: "b22222",
  flSOwEte: "fffaf0",
  foYstWAn: "228b22",
  fuKsia: "ff00ff",
  gaRsbSo: "dcdcdc",
  ghostwEte: "f8f8ff",
  gTd: "ffd700",
  gTMnPd: "daa520",
  Way: "808080",
  gYF: "8000",
  gYFLw: "adff2f",
  gYy: "808080",
  honeyMw: "f0fff0",
  hotpRk: "ff69b4",
  RdianYd: "cd5c5c",
  Rdigo: "4b0082",
  ivSy: "fffff0",
  khaki: "f0e68c",
  lavFMr: "e6e6fa",
  lavFMrXsh: "fff0f5",
  lawngYF: "7cfc00",
  NmoncEffon: "fffacd",
  ZXe: "add8e6",
  ZcSO: "f08080",
  Zcyan: "e0ffff",
  ZgTMnPdLw: "fafad2",
  ZWay: "d3d3d3",
  ZgYF: "90ee90",
  ZgYy: "d3d3d3",
  ZpRk: "ffb6c1",
  ZsOmon: "ffa07a",
  ZsHgYF: "20b2aa",
  ZskyXe: "87cefa",
  ZUWay: "778899",
  ZUgYy: "778899",
  ZstAlXe: "b0c4de",
  ZLw: "ffffe0",
  lime: "ff00",
  limegYF: "32cd32",
  lRF: "faf0e6",
  magFta: "ff00ff",
  maPon: "800000",
  VaquamarRe: "66cdaa",
  VXe: "cd",
  VScEd: "ba55d3",
  VpurpN: "9370db",
  VsHgYF: "3cb371",
  VUXe: "7b68ee",
  VsprRggYF: "fa9a",
  VQe: "48d1cc",
  VviTetYd: "c71585",
  midnightXe: "191970",
  mRtcYam: "f5fffa",
  mistyPse: "ffe4e1",
  moccasR: "ffe4b5",
  navajowEte: "ffdead",
  navy: "80",
  Tdlace: "fdf5e6",
  Tive: "808000",
  TivedBb: "6b8e23",
  Sange: "ffa500",
  SangeYd: "ff4500",
  ScEd: "da70d6",
  pOegTMnPd: "eee8aa",
  pOegYF: "98fb98",
  pOeQe: "afeeee",
  pOeviTetYd: "db7093",
  papayawEp: "ffefd5",
  pHKpuff: "ffdab9",
  peru: "cd853f",
  pRk: "ffc0cb",
  plum: "dda0dd",
  powMrXe: "b0e0e6",
  purpN: "800080",
  YbeccapurpN: "663399",
  Yd: "ff0000",
  Psybrown: "bc8f8f",
  PyOXe: "4169e1",
  saddNbPwn: "8b4513",
  sOmon: "fa8072",
  sandybPwn: "f4a460",
  sHgYF: "2e8b57",
  sHshell: "fff5ee",
  siFna: "a0522d",
  silver: "c0c0c0",
  skyXe: "87ceeb",
  UXe: "6a5acd",
  UWay: "708090",
  UgYy: "708090",
  snow: "fffafa",
  sprRggYF: "ff7f",
  stAlXe: "4682b4",
  tan: "d2b48c",
  teO: "8080",
  tEstN: "d8bfd8",
  tomato: "ff6347",
  Qe: "40e0d0",
  viTet: "ee82ee",
  JHt: "f5deb3",
  wEte: "ffffff",
  wEtesmoke: "f5f5f5",
  Lw: "ffff00",
  LwgYF: "9acd32"
};
function unpack() {
  const unpacked = {};
  const keys = Object.keys(names$1);
  const tkeys = Object.keys(map);
  let i2, j2, k2, ok, nk;
  for (i2 = 0; i2 < keys.length; i2++) {
    ok = nk = keys[i2];
    for (j2 = 0; j2 < tkeys.length; j2++) {
      k2 = tkeys[j2];
      nk = nk.replace(k2, map[k2]);
    }
    k2 = parseInt(names$1[ok], 16);
    unpacked[nk] = [k2 >> 16 & 255, k2 >> 8 & 255, k2 & 255];
  }
  return unpacked;
}
var names;
function nameParse(str) {
  if (!names) {
    names = unpack();
    names.transparent = [0, 0, 0, 0];
  }
  const a2 = names[str.toLowerCase()];
  return a2 && {
    r: a2[0],
    g: a2[1],
    b: a2[2],
    a: a2.length === 4 ? a2[3] : 255
  };
}
var RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function rgbParse(str) {
  const m2 = RGB_RE.exec(str);
  let a2 = 255;
  let r2, g2, b2;
  if (!m2) {
    return;
  }
  if (m2[7] !== r2) {
    const v2 = +m2[7];
    a2 = m2[8] ? p2b(v2) : lim(v2 * 255, 0, 255);
  }
  r2 = +m2[1];
  g2 = +m2[3];
  b2 = +m2[5];
  r2 = 255 & (m2[2] ? p2b(r2) : lim(r2, 0, 255));
  g2 = 255 & (m2[4] ? p2b(g2) : lim(g2, 0, 255));
  b2 = 255 & (m2[6] ? p2b(b2) : lim(b2, 0, 255));
  return {
    r: r2,
    g: g2,
    b: b2,
    a: a2
  };
}
function rgbString(v2) {
  return v2 && (v2.a < 255 ? `rgba(${v2.r}, ${v2.g}, ${v2.b}, ${b2n(v2.a)})` : `rgb(${v2.r}, ${v2.g}, ${v2.b})`);
}
var to2 = (v2) => v2 <= 31308e-7 ? v2 * 12.92 : Math.pow(v2, 1 / 2.4) * 1.055 - 0.055;
var from = (v2) => v2 <= 0.04045 ? v2 / 12.92 : Math.pow((v2 + 0.055) / 1.055, 2.4);
function interpolate(rgb1, rgb2, t2) {
  const r2 = from(b2n(rgb1.r));
  const g2 = from(b2n(rgb1.g));
  const b2 = from(b2n(rgb1.b));
  return {
    r: n2b(to2(r2 + t2 * (from(b2n(rgb2.r)) - r2))),
    g: n2b(to2(g2 + t2 * (from(b2n(rgb2.g)) - g2))),
    b: n2b(to2(b2 + t2 * (from(b2n(rgb2.b)) - b2))),
    a: rgb1.a + t2 * (rgb2.a - rgb1.a)
  };
}
function modHSL(v2, i2, ratio) {
  if (v2) {
    let tmp = rgb2hsl(v2);
    tmp[i2] = Math.max(0, Math.min(tmp[i2] + tmp[i2] * ratio, i2 === 0 ? 360 : 1));
    tmp = hsl2rgb(tmp);
    v2.r = tmp[0];
    v2.g = tmp[1];
    v2.b = tmp[2];
  }
}
function clone(v2, proto) {
  return v2 ? Object.assign(proto || {}, v2) : v2;
}
function fromObject(input) {
  var v2 = { r: 0, g: 0, b: 0, a: 255 };
  if (Array.isArray(input)) {
    if (input.length >= 3) {
      v2 = { r: input[0], g: input[1], b: input[2], a: 255 };
      if (input.length > 3) {
        v2.a = n2b(input[3]);
      }
    }
  } else {
    v2 = clone(input, { r: 0, g: 0, b: 0, a: 1 });
    v2.a = n2b(v2.a);
  }
  return v2;
}
function functionParse(str) {
  if (str.charAt(0) === "r") {
    return rgbParse(str);
  }
  return hueParse(str);
}
var Color = class _Color {
  constructor(input) {
    if (input instanceof _Color) {
      return input;
    }
    const type = typeof input;
    let v2;
    if (type === "object") {
      v2 = fromObject(input);
    } else if (type === "string") {
      v2 = hexParse(input) || nameParse(input) || functionParse(input);
    }
    this._rgb = v2;
    this._valid = !!v2;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var v2 = clone(this._rgb);
    if (v2) {
      v2.a = b2n(v2.a);
    }
    return v2;
  }
  set rgb(obj) {
    this._rgb = fromObject(obj);
  }
  rgbString() {
    return this._valid ? rgbString(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? hexString(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? hslString(this._rgb) : void 0;
  }
  mix(color2, weight) {
    if (color2) {
      const c1 = this.rgb;
      const c2 = color2.rgb;
      let w2;
      const p2 = weight === w2 ? 0.5 : weight;
      const w3 = 2 * p2 - 1;
      const a2 = c1.a - c2.a;
      const w1 = ((w3 * a2 === -1 ? w3 : (w3 + a2) / (1 + w3 * a2)) + 1) / 2;
      w2 = 1 - w1;
      c1.r = 255 & w1 * c1.r + w2 * c2.r + 0.5;
      c1.g = 255 & w1 * c1.g + w2 * c2.g + 0.5;
      c1.b = 255 & w1 * c1.b + w2 * c2.b + 0.5;
      c1.a = p2 * c1.a + (1 - p2) * c2.a;
      this.rgb = c1;
    }
    return this;
  }
  interpolate(color2, t2) {
    if (color2) {
      this._rgb = interpolate(this._rgb, color2._rgb, t2);
    }
    return this;
  }
  clone() {
    return new _Color(this.rgb);
  }
  alpha(a2) {
    this._rgb.a = n2b(a2);
    return this;
  }
  clearer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 - ratio;
    return this;
  }
  greyscale() {
    const rgb = this._rgb;
    const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
    rgb.r = rgb.g = rgb.b = val;
    return this;
  }
  opaquer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 + ratio;
    return this;
  }
  negate() {
    const v2 = this._rgb;
    v2.r = 255 - v2.r;
    v2.g = 255 - v2.g;
    v2.b = 255 - v2.b;
    return this;
  }
  lighten(ratio) {
    modHSL(this._rgb, 2, ratio);
    return this;
  }
  darken(ratio) {
    modHSL(this._rgb, 2, -ratio);
    return this;
  }
  saturate(ratio) {
    modHSL(this._rgb, 1, ratio);
    return this;
  }
  desaturate(ratio) {
    modHSL(this._rgb, 1, -ratio);
    return this;
  }
  rotate(deg) {
    rotate(this._rgb, deg);
    return this;
  }
};

// node_modules/chart.js/dist/chunks/helpers.dataset.js
function noop() {
}
var uid = /* @__PURE__ */ (() => {
  let id = 0;
  return () => id++;
})();
function isNullOrUndef(value) {
  return value === null || value === void 0;
}
function isArray(value) {
  if (Array.isArray && Array.isArray(value)) {
    return true;
  }
  const type = Object.prototype.toString.call(value);
  if (type.slice(0, 7) === "[object" && type.slice(-6) === "Array]") {
    return true;
  }
  return false;
}
function isObject(value) {
  return value !== null && Object.prototype.toString.call(value) === "[object Object]";
}
function isNumberFinite(value) {
  return (typeof value === "number" || value instanceof Number) && isFinite(+value);
}
function finiteOrDefault(value, defaultValue) {
  return isNumberFinite(value) ? value : defaultValue;
}
function valueOrDefault(value, defaultValue) {
  return typeof value === "undefined" ? defaultValue : value;
}
var toPercentage = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 : +value / dimension;
var toDimension = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 * dimension : +value;
function callback(fn2, args, thisArg) {
  if (fn2 && typeof fn2.call === "function") {
    return fn2.apply(thisArg, args);
  }
}
function each(loopable, fn2, thisArg, reverse) {
  let i2, len, keys;
  if (isArray(loopable)) {
    len = loopable.length;
    if (reverse) {
      for (i2 = len - 1; i2 >= 0; i2--) {
        fn2.call(thisArg, loopable[i2], i2);
      }
    } else {
      for (i2 = 0; i2 < len; i2++) {
        fn2.call(thisArg, loopable[i2], i2);
      }
    }
  } else if (isObject(loopable)) {
    keys = Object.keys(loopable);
    len = keys.length;
    for (i2 = 0; i2 < len; i2++) {
      fn2.call(thisArg, loopable[keys[i2]], keys[i2]);
    }
  }
}
function _elementsEqual(a0, a1) {
  let i2, ilen, v0, v1;
  if (!a0 || !a1 || a0.length !== a1.length) {
    return false;
  }
  for (i2 = 0, ilen = a0.length; i2 < ilen; ++i2) {
    v0 = a0[i2];
    v1 = a1[i2];
    if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
      return false;
    }
  }
  return true;
}
function clone2(source) {
  if (isArray(source)) {
    return source.map(clone2);
  }
  if (isObject(source)) {
    const target = /* @__PURE__ */ Object.create(null);
    const keys = Object.keys(source);
    const klen = keys.length;
    let k2 = 0;
    for (; k2 < klen; ++k2) {
      target[keys[k2]] = clone2(source[keys[k2]]);
    }
    return target;
  }
  return source;
}
function isValidKey(key) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(key) === -1;
}
function _merger(key, target, source, options) {
  if (!isValidKey(key)) {
    return;
  }
  const tval = target[key];
  const sval = source[key];
  if (isObject(tval) && isObject(sval)) {
    merge(tval, sval, options);
  } else {
    target[key] = clone2(sval);
  }
}
function merge(target, source, options) {
  const sources = isArray(source) ? source : [
    source
  ];
  const ilen = sources.length;
  if (!isObject(target)) {
    return target;
  }
  options = options || {};
  const merger = options.merger || _merger;
  let current;
  for (let i2 = 0; i2 < ilen; ++i2) {
    current = sources[i2];
    if (!isObject(current)) {
      continue;
    }
    const keys = Object.keys(current);
    for (let k2 = 0, klen = keys.length; k2 < klen; ++k2) {
      merger(keys[k2], target, current, options);
    }
  }
  return target;
}
function mergeIf(target, source) {
  return merge(target, source, {
    merger: _mergerIf
  });
}
function _mergerIf(key, target, source) {
  if (!isValidKey(key)) {
    return;
  }
  const tval = target[key];
  const sval = source[key];
  if (isObject(tval) && isObject(sval)) {
    mergeIf(tval, sval);
  } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = clone2(sval);
  }
}
var keyResolvers = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (v2) => v2,
  // default resolvers
  x: (o2) => o2.x,
  y: (o2) => o2.y
};
function _splitKey(key) {
  const parts = key.split(".");
  const keys = [];
  let tmp = "";
  for (const part of parts) {
    tmp += part;
    if (tmp.endsWith("\\")) {
      tmp = tmp.slice(0, -1) + ".";
    } else {
      keys.push(tmp);
      tmp = "";
    }
  }
  return keys;
}
function _getKeyResolver(key) {
  const keys = _splitKey(key);
  return (obj) => {
    for (const k2 of keys) {
      if (k2 === "") {
        break;
      }
      obj = obj && obj[k2];
    }
    return obj;
  };
}
function resolveObjectKey(obj, key) {
  const resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
  return resolver(obj);
}
function _capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
var defined = (value) => typeof value !== "undefined";
var isFunction = (value) => typeof value === "function";
var setsEqual = (a2, b2) => {
  if (a2.size !== b2.size) {
    return false;
  }
  for (const item of a2) {
    if (!b2.has(item)) {
      return false;
    }
  }
  return true;
};
function _isClickEvent(e2) {
  return e2.type === "mouseup" || e2.type === "click" || e2.type === "contextmenu";
}
var PI = Math.PI;
var TAU = 2 * PI;
var PITAU = TAU + PI;
var INFINITY = Number.POSITIVE_INFINITY;
var RAD_PER_DEG = PI / 180;
var HALF_PI = PI / 2;
var QUARTER_PI = PI / 4;
var TWO_THIRDS_PI = PI * 2 / 3;
var log10 = Math.log10;
var sign = Math.sign;
function almostEquals(x2, y2, epsilon) {
  return Math.abs(x2 - y2) < epsilon;
}
function niceNum(range) {
  const roundedRange = Math.round(range);
  range = almostEquals(range, roundedRange, range / 1e3) ? roundedRange : range;
  const niceRange = Math.pow(10, Math.floor(log10(range)));
  const fraction = range / niceRange;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * niceRange;
}
function _factorize(value) {
  const result = [];
  const sqrt = Math.sqrt(value);
  let i2;
  for (i2 = 1; i2 < sqrt; i2++) {
    if (value % i2 === 0) {
      result.push(i2);
      result.push(value / i2);
    }
  }
  if (sqrt === (sqrt | 0)) {
    result.push(sqrt);
  }
  result.sort((a2, b2) => a2 - b2).pop();
  return result;
}
function isNonPrimitive(n2) {
  return typeof n2 === "symbol" || typeof n2 === "object" && n2 !== null && !(Symbol.toPrimitive in n2 || "toString" in n2 || "valueOf" in n2);
}
function isNumber(n2) {
  return !isNonPrimitive(n2) && !isNaN(parseFloat(n2)) && isFinite(n2);
}
function almostWhole(x2, epsilon) {
  const rounded = Math.round(x2);
  return rounded - epsilon <= x2 && rounded + epsilon >= x2;
}
function _setMinAndMaxByKey(array, target, property) {
  let i2, ilen, value;
  for (i2 = 0, ilen = array.length; i2 < ilen; i2++) {
    value = array[i2][property];
    if (!isNaN(value)) {
      target.min = Math.min(target.min, value);
      target.max = Math.max(target.max, value);
    }
  }
}
function toRadians(degrees) {
  return degrees * (PI / 180);
}
function toDegrees(radians) {
  return radians * (180 / PI);
}
function _decimalPlaces(x2) {
  if (!isNumberFinite(x2)) {
    return;
  }
  let e2 = 1;
  let p2 = 0;
  while (Math.round(x2 * e2) / e2 !== x2) {
    e2 *= 10;
    p2++;
  }
  return p2;
}
function getAngleFromPoint(centrePoint, anglePoint) {
  const distanceFromXCenter = anglePoint.x - centrePoint.x;
  const distanceFromYCenter = anglePoint.y - centrePoint.y;
  const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
  let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
  if (angle < -0.5 * PI) {
    angle += TAU;
  }
  return {
    angle,
    distance: radialDistanceFromCenter
  };
}
function distanceBetweenPoints(pt1, pt2) {
  return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}
function _angleDiff(a2, b2) {
  return (a2 - b2 + PITAU) % TAU - PI;
}
function _normalizeAngle(a2) {
  return (a2 % TAU + TAU) % TAU;
}
function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
  const a2 = _normalizeAngle(angle);
  const s2 = _normalizeAngle(start);
  const e2 = _normalizeAngle(end);
  const angleToStart = _normalizeAngle(s2 - a2);
  const angleToEnd = _normalizeAngle(e2 - a2);
  const startToAngle = _normalizeAngle(a2 - s2);
  const endToAngle = _normalizeAngle(a2 - e2);
  return a2 === s2 || a2 === e2 || sameAngleIsFullCircle && s2 === e2 || angleToStart > angleToEnd && startToAngle < endToAngle;
}
function _limitValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function _int16Range(value) {
  return _limitValue(value, -32768, 32767);
}
function _isBetween(value, start, end, epsilon = 1e-6) {
  return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
}
function _lookup(table, value, cmp) {
  cmp = cmp || ((index2) => table[index2] < value);
  let hi2 = table.length - 1;
  let lo2 = 0;
  let mid;
  while (hi2 - lo2 > 1) {
    mid = lo2 + hi2 >> 1;
    if (cmp(mid)) {
      lo2 = mid;
    } else {
      hi2 = mid;
    }
  }
  return {
    lo: lo2,
    hi: hi2
  };
}
var _lookupByKey = (table, key, value, last) => _lookup(table, value, last ? (index2) => {
  const ti2 = table[index2][key];
  return ti2 < value || ti2 === value && table[index2 + 1][key] === value;
} : (index2) => table[index2][key] < value);
var _rlookupByKey = (table, key, value) => _lookup(table, value, (index2) => table[index2][key] >= value);
function _filterBetween(values, min, max) {
  let start = 0;
  let end = values.length;
  while (start < end && values[start] < min) {
    start++;
  }
  while (end > start && values[end - 1] > max) {
    end--;
  }
  return start > 0 || end < values.length ? values.slice(start, end) : values;
}
var arrayEvents = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function listenArrayEvents(array, listener) {
  if (array._chartjs) {
    array._chartjs.listeners.push(listener);
    return;
  }
  Object.defineProperty(array, "_chartjs", {
    configurable: true,
    enumerable: false,
    value: {
      listeners: [
        listener
      ]
    }
  });
  arrayEvents.forEach((key) => {
    const method = "_onData" + _capitalize(key);
    const base = array[key];
    Object.defineProperty(array, key, {
      configurable: true,
      enumerable: false,
      value(...args) {
        const res = base.apply(this, args);
        array._chartjs.listeners.forEach((object) => {
          if (typeof object[method] === "function") {
            object[method](...args);
          }
        });
        return res;
      }
    });
  });
}
function unlistenArrayEvents(array, listener) {
  const stub = array._chartjs;
  if (!stub) {
    return;
  }
  const listeners = stub.listeners;
  const index2 = listeners.indexOf(listener);
  if (index2 !== -1) {
    listeners.splice(index2, 1);
  }
  if (listeners.length > 0) {
    return;
  }
  arrayEvents.forEach((key) => {
    delete array[key];
  });
  delete array._chartjs;
}
function _arrayUnique(items) {
  const set2 = new Set(items);
  if (set2.size === items.length) {
    return items;
  }
  return Array.from(set2);
}
var requestAnimFrame = (function() {
  if (typeof window === "undefined") {
    return function(callback2) {
      return callback2();
    };
  }
  return window.requestAnimationFrame;
})();
function throttled(fn2, thisArg) {
  let argsToUse = [];
  let ticking = false;
  return function(...args) {
    argsToUse = args;
    if (!ticking) {
      ticking = true;
      requestAnimFrame.call(window, () => {
        ticking = false;
        fn2.apply(thisArg, argsToUse);
      });
    }
  };
}
function debounce(fn2, delay) {
  let timeout;
  return function(...args) {
    if (delay) {
      clearTimeout(timeout);
      timeout = setTimeout(fn2, delay, args);
    } else {
      fn2.apply(this, args);
    }
    return delay;
  };
}
var _toLeftRightCenter = (align) => align === "start" ? "left" : align === "end" ? "right" : "center";
var _alignStartEnd = (align, start, end) => align === "start" ? start : align === "end" ? end : (start + end) / 2;
var _textX = (align, left, right, rtl) => {
  const check = rtl ? "left" : "right";
  return align === check ? right : align === "center" ? (left + right) / 2 : left;
};
function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
  const pointCount = points.length;
  let start = 0;
  let count = pointCount;
  if (meta._sorted) {
    const { iScale, vScale, _parsed } = meta;
    const spanGaps = meta.dataset ? meta.dataset.options ? meta.dataset.options.spanGaps : null : null;
    const axis = iScale.axis;
    const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
    if (minDefined) {
      start = Math.min(
        // @ts-expect-error Need to type _parsed
        _lookupByKey(_parsed, axis, min).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo
      );
      if (spanGaps) {
        const distanceToDefinedLo = _parsed.slice(0, start + 1).reverse().findIndex((point) => !isNullOrUndef(point[vScale.axis]));
        start -= Math.max(0, distanceToDefinedLo);
      }
      start = _limitValue(start, 0, pointCount - 1);
    }
    if (maxDefined) {
      let end = Math.max(
        // @ts-expect-error Need to type _parsed
        _lookupByKey(_parsed, iScale.axis, max, true).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max), true).hi + 1
      );
      if (spanGaps) {
        const distanceToDefinedHi = _parsed.slice(end - 1).findIndex((point) => !isNullOrUndef(point[vScale.axis]));
        end += Math.max(0, distanceToDefinedHi);
      }
      count = _limitValue(end, start, pointCount) - start;
    } else {
      count = pointCount - start;
    }
  }
  return {
    start,
    count
  };
}
function _scaleRangesChanged(meta) {
  const { xScale, yScale, _scaleRanges } = meta;
  const newRanges = {
    xmin: xScale.min,
    xmax: xScale.max,
    ymin: yScale.min,
    ymax: yScale.max
  };
  if (!_scaleRanges) {
    meta._scaleRanges = newRanges;
    return true;
  }
  const changed = _scaleRanges.xmin !== xScale.min || _scaleRanges.xmax !== xScale.max || _scaleRanges.ymin !== yScale.min || _scaleRanges.ymax !== yScale.max;
  Object.assign(_scaleRanges, newRanges);
  return changed;
}
var atEdge = (t2) => t2 === 0 || t2 === 1;
var elasticIn = (t2, s2, p2) => -(Math.pow(2, 10 * (t2 -= 1)) * Math.sin((t2 - s2) * TAU / p2));
var elasticOut = (t2, s2, p2) => Math.pow(2, -10 * t2) * Math.sin((t2 - s2) * TAU / p2) + 1;
var effects = {
  linear: (t2) => t2,
  easeInQuad: (t2) => t2 * t2,
  easeOutQuad: (t2) => -t2 * (t2 - 2),
  easeInOutQuad: (t2) => (t2 /= 0.5) < 1 ? 0.5 * t2 * t2 : -0.5 * (--t2 * (t2 - 2) - 1),
  easeInCubic: (t2) => t2 * t2 * t2,
  easeOutCubic: (t2) => (t2 -= 1) * t2 * t2 + 1,
  easeInOutCubic: (t2) => (t2 /= 0.5) < 1 ? 0.5 * t2 * t2 * t2 : 0.5 * ((t2 -= 2) * t2 * t2 + 2),
  easeInQuart: (t2) => t2 * t2 * t2 * t2,
  easeOutQuart: (t2) => -((t2 -= 1) * t2 * t2 * t2 - 1),
  easeInOutQuart: (t2) => (t2 /= 0.5) < 1 ? 0.5 * t2 * t2 * t2 * t2 : -0.5 * ((t2 -= 2) * t2 * t2 * t2 - 2),
  easeInQuint: (t2) => t2 * t2 * t2 * t2 * t2,
  easeOutQuint: (t2) => (t2 -= 1) * t2 * t2 * t2 * t2 + 1,
  easeInOutQuint: (t2) => (t2 /= 0.5) < 1 ? 0.5 * t2 * t2 * t2 * t2 * t2 : 0.5 * ((t2 -= 2) * t2 * t2 * t2 * t2 + 2),
  easeInSine: (t2) => -Math.cos(t2 * HALF_PI) + 1,
  easeOutSine: (t2) => Math.sin(t2 * HALF_PI),
  easeInOutSine: (t2) => -0.5 * (Math.cos(PI * t2) - 1),
  easeInExpo: (t2) => t2 === 0 ? 0 : Math.pow(2, 10 * (t2 - 1)),
  easeOutExpo: (t2) => t2 === 1 ? 1 : -Math.pow(2, -10 * t2) + 1,
  easeInOutExpo: (t2) => atEdge(t2) ? t2 : t2 < 0.5 ? 0.5 * Math.pow(2, 10 * (t2 * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t2 * 2 - 1)) + 2),
  easeInCirc: (t2) => t2 >= 1 ? t2 : -(Math.sqrt(1 - t2 * t2) - 1),
  easeOutCirc: (t2) => Math.sqrt(1 - (t2 -= 1) * t2),
  easeInOutCirc: (t2) => (t2 /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t2 * t2) - 1) : 0.5 * (Math.sqrt(1 - (t2 -= 2) * t2) + 1),
  easeInElastic: (t2) => atEdge(t2) ? t2 : elasticIn(t2, 0.075, 0.3),
  easeOutElastic: (t2) => atEdge(t2) ? t2 : elasticOut(t2, 0.075, 0.3),
  easeInOutElastic(t2) {
    const s2 = 0.1125;
    const p2 = 0.45;
    return atEdge(t2) ? t2 : t2 < 0.5 ? 0.5 * elasticIn(t2 * 2, s2, p2) : 0.5 + 0.5 * elasticOut(t2 * 2 - 1, s2, p2);
  },
  easeInBack(t2) {
    const s2 = 1.70158;
    return t2 * t2 * ((s2 + 1) * t2 - s2);
  },
  easeOutBack(t2) {
    const s2 = 1.70158;
    return (t2 -= 1) * t2 * ((s2 + 1) * t2 + s2) + 1;
  },
  easeInOutBack(t2) {
    let s2 = 1.70158;
    if ((t2 /= 0.5) < 1) {
      return 0.5 * (t2 * t2 * (((s2 *= 1.525) + 1) * t2 - s2));
    }
    return 0.5 * ((t2 -= 2) * t2 * (((s2 *= 1.525) + 1) * t2 + s2) + 2);
  },
  easeInBounce: (t2) => 1 - effects.easeOutBounce(1 - t2),
  easeOutBounce(t2) {
    const m2 = 7.5625;
    const d2 = 2.75;
    if (t2 < 1 / d2) {
      return m2 * t2 * t2;
    }
    if (t2 < 2 / d2) {
      return m2 * (t2 -= 1.5 / d2) * t2 + 0.75;
    }
    if (t2 < 2.5 / d2) {
      return m2 * (t2 -= 2.25 / d2) * t2 + 0.9375;
    }
    return m2 * (t2 -= 2.625 / d2) * t2 + 0.984375;
  },
  easeInOutBounce: (t2) => t2 < 0.5 ? effects.easeInBounce(t2 * 2) * 0.5 : effects.easeOutBounce(t2 * 2 - 1) * 0.5 + 0.5
};
function isPatternOrGradient(value) {
  if (value && typeof value === "object") {
    const type = value.toString();
    return type === "[object CanvasPattern]" || type === "[object CanvasGradient]";
  }
  return false;
}
function color(value) {
  return isPatternOrGradient(value) ? value : new Color(value);
}
function getHoverColor(value) {
  return isPatternOrGradient(value) ? value : new Color(value).saturate(0.5).darken(0.1).hexString();
}
var numbers = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
];
var colors = [
  "color",
  "borderColor",
  "backgroundColor"
];
function applyAnimationsDefaults(defaults2) {
  defaults2.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0
  });
  defaults2.describe("animation", {
    _fallback: false,
    _indexable: false,
    _scriptable: (name) => name !== "onProgress" && name !== "onComplete" && name !== "fn"
  });
  defaults2.set("animations", {
    colors: {
      type: "color",
      properties: colors
    },
    numbers: {
      type: "number",
      properties: numbers
    }
  });
  defaults2.describe("animations", {
    _fallback: "animation"
  });
  defaults2.set("transitions", {
    active: {
      animation: {
        duration: 400
      }
    },
    resize: {
      animation: {
        duration: 0
      }
    },
    show: {
      animations: {
        colors: {
          from: "transparent"
        },
        visible: {
          type: "boolean",
          duration: 0
        }
      }
    },
    hide: {
      animations: {
        colors: {
          to: "transparent"
        },
        visible: {
          type: "boolean",
          easing: "linear",
          fn: (v2) => v2 | 0
        }
      }
    }
  });
}
function applyLayoutsDefaults(defaults2) {
  defaults2.set("layout", {
    autoPadding: true,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
}
var intlCache = /* @__PURE__ */ new Map();
function getNumberFormat(locale, options) {
  options = options || {};
  const cacheKey = locale + JSON.stringify(options);
  let formatter = intlCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    intlCache.set(cacheKey, formatter);
  }
  return formatter;
}
function formatNumber(num, locale, options) {
  return getNumberFormat(locale, options).format(num);
}
var formatters = {
  values(value) {
    return isArray(value) ? value : "" + value;
  },
  numeric(tickValue, index2, ticks) {
    if (tickValue === 0) {
      return "0";
    }
    const locale = this.chart.options.locale;
    let notation;
    let delta = tickValue;
    if (ticks.length > 1) {
      const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
      if (maxTick < 1e-4 || maxTick > 1e15) {
        notation = "scientific";
      }
      delta = calculateDelta(tickValue, ticks);
    }
    const logDelta = log10(Math.abs(delta));
    const numDecimal = isNaN(logDelta) ? 1 : Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
    const options = {
      notation,
      minimumFractionDigits: numDecimal,
      maximumFractionDigits: numDecimal
    };
    Object.assign(options, this.options.ticks.format);
    return formatNumber(tickValue, locale, options);
  },
  logarithmic(tickValue, index2, ticks) {
    if (tickValue === 0) {
      return "0";
    }
    const remain = ticks[index2].significand || tickValue / Math.pow(10, Math.floor(log10(tickValue)));
    if ([
      1,
      2,
      3,
      5,
      10,
      15
    ].includes(remain) || index2 > 0.8 * ticks.length) {
      return formatters.numeric.call(this, tickValue, index2, ticks);
    }
    return "";
  }
};
function calculateDelta(tickValue, ticks) {
  let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
  if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
    delta = tickValue - Math.floor(tickValue);
  }
  return delta;
}
var Ticks = {
  formatters
};
function applyScaleDefaults(defaults2) {
  defaults2.set("scale", {
    display: true,
    offset: false,
    reverse: false,
    beginAtZero: false,
    bounds: "ticks",
    clip: true,
    grace: 0,
    grid: {
      display: true,
      lineWidth: 1,
      drawOnChartArea: true,
      drawTicks: true,
      tickLength: 8,
      tickWidth: (_ctx, options) => options.lineWidth,
      tickColor: (_ctx, options) => options.color,
      offset: false
    },
    border: {
      display: true,
      dash: [],
      dashOffset: 0,
      width: 1
    },
    title: {
      display: false,
      text: "",
      padding: {
        top: 4,
        bottom: 4
      }
    },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: false,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: true,
      autoSkip: true,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: Ticks.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: false,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2
    }
  });
  defaults2.route("scale.ticks", "color", "", "color");
  defaults2.route("scale.grid", "color", "", "borderColor");
  defaults2.route("scale.border", "color", "", "borderColor");
  defaults2.route("scale.title", "color", "", "color");
  defaults2.describe("scale", {
    _fallback: false,
    _scriptable: (name) => !name.startsWith("before") && !name.startsWith("after") && name !== "callback" && name !== "parser",
    _indexable: (name) => name !== "borderDash" && name !== "tickBorderDash" && name !== "dash"
  });
  defaults2.describe("scales", {
    _fallback: "scale"
  });
  defaults2.describe("scale.ticks", {
    _scriptable: (name) => name !== "backdropPadding" && name !== "callback",
    _indexable: (name) => name !== "backdropPadding"
  });
}
var overrides = /* @__PURE__ */ Object.create(null);
var descriptors = /* @__PURE__ */ Object.create(null);
function getScope$1(node, key) {
  if (!key) {
    return node;
  }
  const keys = key.split(".");
  for (let i2 = 0, n2 = keys.length; i2 < n2; ++i2) {
    const k2 = keys[i2];
    node = node[k2] || (node[k2] = /* @__PURE__ */ Object.create(null));
  }
  return node;
}
function set(root2, scope, values) {
  if (typeof scope === "string") {
    return merge(getScope$1(root2, scope), values);
  }
  return merge(getScope$1(root2, ""), scope);
}
var Defaults = class {
  constructor(_descriptors2, _appliers) {
    this.animation = void 0;
    this.backgroundColor = "rgba(0,0,0,0.1)";
    this.borderColor = "rgba(0,0,0,0.1)";
    this.color = "#666";
    this.datasets = {};
    this.devicePixelRatio = (context) => context.chart.platform.getDevicePixelRatio();
    this.elements = {};
    this.events = [
      "mousemove",
      "mouseout",
      "click",
      "touchstart",
      "touchmove"
    ];
    this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: "normal",
      lineHeight: 1.2,
      weight: null
    };
    this.hover = {};
    this.hoverBackgroundColor = (ctx, options) => getHoverColor(options.backgroundColor);
    this.hoverBorderColor = (ctx, options) => getHoverColor(options.borderColor);
    this.hoverColor = (ctx, options) => getHoverColor(options.color);
    this.indexAxis = "x";
    this.interaction = {
      mode: "nearest",
      intersect: true,
      includeInvisible: false
    };
    this.maintainAspectRatio = true;
    this.onHover = null;
    this.onClick = null;
    this.parsing = true;
    this.plugins = {};
    this.responsive = true;
    this.scale = void 0;
    this.scales = {};
    this.showLine = true;
    this.drawActiveElementsOnTop = true;
    this.describe(_descriptors2);
    this.apply(_appliers);
  }
  set(scope, values) {
    return set(this, scope, values);
  }
  get(scope) {
    return getScope$1(this, scope);
  }
  describe(scope, values) {
    return set(descriptors, scope, values);
  }
  override(scope, values) {
    return set(overrides, scope, values);
  }
  route(scope, name, targetScope, targetName) {
    const scopeObject = getScope$1(this, scope);
    const targetScopeObject = getScope$1(this, targetScope);
    const privateName = "_" + name;
    Object.defineProperties(scopeObject, {
      [privateName]: {
        value: scopeObject[name],
        writable: true
      },
      [name]: {
        enumerable: true,
        get() {
          const local = this[privateName];
          const target = targetScopeObject[targetName];
          if (isObject(local)) {
            return Object.assign({}, target, local);
          }
          return valueOrDefault(local, target);
        },
        set(value) {
          this[privateName] = value;
        }
      }
    });
  }
  apply(appliers) {
    appliers.forEach((apply2) => apply2(this));
  }
};
var defaults = /* @__PURE__ */ new Defaults({
  _scriptable: (name) => !name.startsWith("on"),
  _indexable: (name) => name !== "events",
  hover: {
    _fallback: "interaction"
  },
  interaction: {
    _scriptable: false,
    _indexable: false
  }
}, [
  applyAnimationsDefaults,
  applyLayoutsDefaults,
  applyScaleDefaults
]);
function toFontString(font) {
  if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
    return null;
  }
  return (font.style ? font.style + " " : "") + (font.weight ? font.weight + " " : "") + font.size + "px " + font.family;
}
function _measureText(ctx, data, gc, longest, string) {
  let textWidth = data[string];
  if (!textWidth) {
    textWidth = data[string] = ctx.measureText(string).width;
    gc.push(string);
  }
  if (textWidth > longest) {
    longest = textWidth;
  }
  return longest;
}
function _longestText(ctx, font, arrayOfThings, cache) {
  cache = cache || {};
  let data = cache.data = cache.data || {};
  let gc = cache.garbageCollect = cache.garbageCollect || [];
  if (cache.font !== font) {
    data = cache.data = {};
    gc = cache.garbageCollect = [];
    cache.font = font;
  }
  ctx.save();
  ctx.font = font;
  let longest = 0;
  const ilen = arrayOfThings.length;
  let i2, j2, jlen, thing, nestedThing;
  for (i2 = 0; i2 < ilen; i2++) {
    thing = arrayOfThings[i2];
    if (thing !== void 0 && thing !== null && !isArray(thing)) {
      longest = _measureText(ctx, data, gc, longest, thing);
    } else if (isArray(thing)) {
      for (j2 = 0, jlen = thing.length; j2 < jlen; j2++) {
        nestedThing = thing[j2];
        if (nestedThing !== void 0 && nestedThing !== null && !isArray(nestedThing)) {
          longest = _measureText(ctx, data, gc, longest, nestedThing);
        }
      }
    }
  }
  ctx.restore();
  const gcLen = gc.length / 2;
  if (gcLen > arrayOfThings.length) {
    for (i2 = 0; i2 < gcLen; i2++) {
      delete data[gc[i2]];
    }
    gc.splice(0, gcLen);
  }
  return longest;
}
function _alignPixel(chart, pixel, width) {
  const devicePixelRatio = chart.currentDevicePixelRatio;
  const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
  return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
}
function clearCanvas(canvas, ctx) {
  if (!ctx && !canvas) {
    return;
  }
  ctx = ctx || canvas.getContext("2d");
  ctx.save();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
function drawPoint(ctx, options, x2, y2) {
  drawPointLegend(ctx, options, x2, y2, null);
}
function drawPointLegend(ctx, options, x2, y2, w2) {
  let type, xOffset, yOffset, size, cornerRadius, width, xOffsetW, yOffsetW;
  const style = options.pointStyle;
  const rotation = options.rotation;
  const radius = options.radius;
  let rad = (rotation || 0) * RAD_PER_DEG;
  if (style && typeof style === "object") {
    type = style.toString();
    if (type === "[object HTMLImageElement]" || type === "[object HTMLCanvasElement]") {
      ctx.save();
      ctx.translate(x2, y2);
      ctx.rotate(rad);
      ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
      ctx.restore();
      return;
    }
  }
  if (isNaN(radius) || radius <= 0) {
    return;
  }
  ctx.beginPath();
  switch (style) {
    // Default includes circle
    default:
      if (w2) {
        ctx.ellipse(x2, y2, w2 / 2, radius, 0, 0, TAU);
      } else {
        ctx.arc(x2, y2, radius, 0, TAU);
      }
      ctx.closePath();
      break;
    case "triangle":
      width = w2 ? w2 / 2 : radius;
      ctx.moveTo(x2 + Math.sin(rad) * width, y2 - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x2 + Math.sin(rad) * width, y2 - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x2 + Math.sin(rad) * width, y2 - Math.cos(rad) * radius);
      ctx.closePath();
      break;
    case "rectRounded":
      cornerRadius = radius * 0.516;
      size = radius - cornerRadius;
      xOffset = Math.cos(rad + QUARTER_PI) * size;
      xOffsetW = Math.cos(rad + QUARTER_PI) * (w2 ? w2 / 2 - cornerRadius : size);
      yOffset = Math.sin(rad + QUARTER_PI) * size;
      yOffsetW = Math.sin(rad + QUARTER_PI) * (w2 ? w2 / 2 - cornerRadius : size);
      ctx.arc(x2 - xOffsetW, y2 - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
      ctx.arc(x2 + yOffsetW, y2 - xOffset, cornerRadius, rad - HALF_PI, rad);
      ctx.arc(x2 + xOffsetW, y2 + yOffset, cornerRadius, rad, rad + HALF_PI);
      ctx.arc(x2 - yOffsetW, y2 + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
      ctx.closePath();
      break;
    case "rect":
      if (!rotation) {
        size = Math.SQRT1_2 * radius;
        width = w2 ? w2 / 2 : size;
        ctx.rect(x2 - width, y2 - size, 2 * width, 2 * size);
        break;
      }
      rad += QUARTER_PI;
    /* falls through */
    case "rectRot":
      xOffsetW = Math.cos(rad) * (w2 ? w2 / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w2 ? w2 / 2 : radius);
      ctx.moveTo(x2 - xOffsetW, y2 - yOffset);
      ctx.lineTo(x2 + yOffsetW, y2 - xOffset);
      ctx.lineTo(x2 + xOffsetW, y2 + yOffset);
      ctx.lineTo(x2 - yOffsetW, y2 + xOffset);
      ctx.closePath();
      break;
    case "crossRot":
      rad += QUARTER_PI;
    /* falls through */
    case "cross":
      xOffsetW = Math.cos(rad) * (w2 ? w2 / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w2 ? w2 / 2 : radius);
      ctx.moveTo(x2 - xOffsetW, y2 - yOffset);
      ctx.lineTo(x2 + xOffsetW, y2 + yOffset);
      ctx.moveTo(x2 + yOffsetW, y2 - xOffset);
      ctx.lineTo(x2 - yOffsetW, y2 + xOffset);
      break;
    case "star":
      xOffsetW = Math.cos(rad) * (w2 ? w2 / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w2 ? w2 / 2 : radius);
      ctx.moveTo(x2 - xOffsetW, y2 - yOffset);
      ctx.lineTo(x2 + xOffsetW, y2 + yOffset);
      ctx.moveTo(x2 + yOffsetW, y2 - xOffset);
      ctx.lineTo(x2 - yOffsetW, y2 + xOffset);
      rad += QUARTER_PI;
      xOffsetW = Math.cos(rad) * (w2 ? w2 / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w2 ? w2 / 2 : radius);
      ctx.moveTo(x2 - xOffsetW, y2 - yOffset);
      ctx.lineTo(x2 + xOffsetW, y2 + yOffset);
      ctx.moveTo(x2 + yOffsetW, y2 - xOffset);
      ctx.lineTo(x2 - yOffsetW, y2 + xOffset);
      break;
    case "line":
      xOffset = w2 ? w2 / 2 : Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x2 - xOffset, y2 - yOffset);
      ctx.lineTo(x2 + xOffset, y2 + yOffset);
      break;
    case "dash":
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 + Math.cos(rad) * (w2 ? w2 / 2 : radius), y2 + Math.sin(rad) * radius);
      break;
    case false:
      ctx.closePath();
      break;
  }
  ctx.fill();
  if (options.borderWidth > 0) {
    ctx.stroke();
  }
}
function _isPointInArea(point, area, margin) {
  margin = margin || 0.5;
  return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
}
function clipArea(ctx, area) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  ctx.clip();
}
function unclipArea(ctx) {
  ctx.restore();
}
function _steppedLineTo(ctx, previous, target, flip, mode) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }
  if (mode === "middle") {
    const midpoint = (previous.x + target.x) / 2;
    ctx.lineTo(midpoint, previous.y);
    ctx.lineTo(midpoint, target.y);
  } else if (mode === "after" !== !!flip) {
    ctx.lineTo(previous.x, target.y);
  } else {
    ctx.lineTo(target.x, previous.y);
  }
  ctx.lineTo(target.x, target.y);
}
function _bezierCurveTo(ctx, previous, target, flip) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }
  ctx.bezierCurveTo(flip ? previous.cp1x : previous.cp2x, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2x : target.cp1x, flip ? target.cp2y : target.cp1y, target.x, target.y);
}
function setRenderOpts(ctx, opts) {
  if (opts.translation) {
    ctx.translate(opts.translation[0], opts.translation[1]);
  }
  if (!isNullOrUndef(opts.rotation)) {
    ctx.rotate(opts.rotation);
  }
  if (opts.color) {
    ctx.fillStyle = opts.color;
  }
  if (opts.textAlign) {
    ctx.textAlign = opts.textAlign;
  }
  if (opts.textBaseline) {
    ctx.textBaseline = opts.textBaseline;
  }
}
function decorateText(ctx, x2, y2, line, opts) {
  if (opts.strikethrough || opts.underline) {
    const metrics = ctx.measureText(line);
    const left = x2 - metrics.actualBoundingBoxLeft;
    const right = x2 + metrics.actualBoundingBoxRight;
    const top = y2 - metrics.actualBoundingBoxAscent;
    const bottom = y2 + metrics.actualBoundingBoxDescent;
    const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.lineWidth = opts.decorationWidth || 2;
    ctx.moveTo(left, yDecoration);
    ctx.lineTo(right, yDecoration);
    ctx.stroke();
  }
}
function drawBackdrop(ctx, opts) {
  const oldColor = ctx.fillStyle;
  ctx.fillStyle = opts.color;
  ctx.fillRect(opts.left, opts.top, opts.width, opts.height);
  ctx.fillStyle = oldColor;
}
function renderText(ctx, text, x2, y2, font, opts = {}) {
  const lines = isArray(text) ? text : [
    text
  ];
  const stroke = opts.strokeWidth > 0 && opts.strokeColor !== "";
  let i2, line;
  ctx.save();
  ctx.font = font.string;
  setRenderOpts(ctx, opts);
  for (i2 = 0; i2 < lines.length; ++i2) {
    line = lines[i2];
    if (opts.backdrop) {
      drawBackdrop(ctx, opts.backdrop);
    }
    if (stroke) {
      if (opts.strokeColor) {
        ctx.strokeStyle = opts.strokeColor;
      }
      if (!isNullOrUndef(opts.strokeWidth)) {
        ctx.lineWidth = opts.strokeWidth;
      }
      ctx.strokeText(line, x2, y2, opts.maxWidth);
    }
    ctx.fillText(line, x2, y2, opts.maxWidth);
    decorateText(ctx, x2, y2, line, opts);
    y2 += Number(font.lineHeight);
  }
  ctx.restore();
}
function addRoundedRectPath(ctx, rect) {
  const { x: x2, y: y2, w: w2, h: h3, radius } = rect;
  ctx.arc(x2 + radius.topLeft, y2 + radius.topLeft, radius.topLeft, 1.5 * PI, PI, true);
  ctx.lineTo(x2, y2 + h3 - radius.bottomLeft);
  ctx.arc(x2 + radius.bottomLeft, y2 + h3 - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
  ctx.lineTo(x2 + w2 - radius.bottomRight, y2 + h3);
  ctx.arc(x2 + w2 - radius.bottomRight, y2 + h3 - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
  ctx.lineTo(x2 + w2, y2 + radius.topRight);
  ctx.arc(x2 + w2 - radius.topRight, y2 + radius.topRight, radius.topRight, 0, -HALF_PI, true);
  ctx.lineTo(x2 + radius.topLeft, y2);
}
var LINE_HEIGHT = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/;
var FONT_STYLE = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function toLineHeight(value, size) {
  const matches = ("" + value).match(LINE_HEIGHT);
  if (!matches || matches[1] === "normal") {
    return size * 1.2;
  }
  value = +matches[2];
  switch (matches[3]) {
    case "px":
      return value;
    case "%":
      value /= 100;
      break;
  }
  return size * value;
}
var numberOrZero = (v2) => +v2 || 0;
function _readValueToProps(value, props) {
  const ret = {};
  const objProps = isObject(props);
  const keys = objProps ? Object.keys(props) : props;
  const read = isObject(value) ? objProps ? (prop) => valueOrDefault(value[prop], value[props[prop]]) : (prop) => value[prop] : () => value;
  for (const prop of keys) {
    ret[prop] = numberOrZero(read(prop));
  }
  return ret;
}
function toTRBL(value) {
  return _readValueToProps(value, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function toTRBLCorners(value) {
  return _readValueToProps(value, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function toPadding(value) {
  const obj = toTRBL(value);
  obj.width = obj.left + obj.right;
  obj.height = obj.top + obj.bottom;
  return obj;
}
function toFont(options, fallback) {
  options = options || {};
  fallback = fallback || defaults.font;
  let size = valueOrDefault(options.size, fallback.size);
  if (typeof size === "string") {
    size = parseInt(size, 10);
  }
  let style = valueOrDefault(options.style, fallback.style);
  if (style && !("" + style).match(FONT_STYLE)) {
    console.warn('Invalid font style specified: "' + style + '"');
    style = void 0;
  }
  const font = {
    family: valueOrDefault(options.family, fallback.family),
    lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
    size,
    style,
    weight: valueOrDefault(options.weight, fallback.weight),
    string: ""
  };
  font.string = toFontString(font);
  return font;
}
function resolve(inputs, context, index2, info) {
  let cacheable = true;
  let i2, ilen, value;
  for (i2 = 0, ilen = inputs.length; i2 < ilen; ++i2) {
    value = inputs[i2];
    if (value === void 0) {
      continue;
    }
    if (context !== void 0 && typeof value === "function") {
      value = value(context);
      cacheable = false;
    }
    if (index2 !== void 0 && isArray(value)) {
      value = value[index2 % value.length];
      cacheable = false;
    }
    if (value !== void 0) {
      if (info && !cacheable) {
        info.cacheable = false;
      }
      return value;
    }
  }
}
function _addGrace(minmax, grace, beginAtZero) {
  const { min, max } = minmax;
  const change = toDimension(grace, (max - min) / 2);
  const keepZero = (value, add) => beginAtZero && value === 0 ? 0 : value + add;
  return {
    min: keepZero(min, -Math.abs(change)),
    max: keepZero(max, change)
  };
}
function createContext(parentContext, context) {
  return Object.assign(Object.create(parentContext), context);
}
function _createResolver(scopes, prefixes = [
  ""
], rootScopes, fallback, getTarget = () => scopes[0]) {
  const finalRootScopes = rootScopes || scopes;
  if (typeof fallback === "undefined") {
    fallback = _resolve("_fallback", scopes);
  }
  const cache = {
    [Symbol.toStringTag]: "Object",
    _cacheable: true,
    _scopes: scopes,
    _rootScopes: finalRootScopes,
    _fallback: fallback,
    _getTarget: getTarget,
    override: (scope) => _createResolver([
      scope,
      ...scopes
    ], prefixes, finalRootScopes, fallback)
  };
  return new Proxy(cache, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(target, prop) {
      delete target[prop];
      delete target._keys;
      delete scopes[0][prop];
      return true;
    },
    /**
    * A trap for getting property values.
    */
    get(target, prop) {
      return _cached(target, prop, () => _resolveWithPrefixes(prop, prefixes, scopes, target));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(scopes[0]);
    },
    /**
    * A trap for the in operator.
    */
    has(target, prop) {
      return getKeysFromAllScopes(target).includes(prop);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(target) {
      return getKeysFromAllScopes(target);
    },
    /**
    * A trap for setting property values.
    */
    set(target, prop, value) {
      const storage = target._storage || (target._storage = getTarget());
      target[prop] = storage[prop] = value;
      delete target._keys;
      return true;
    }
  });
}
function _attachContext(proxy, context, subProxy, descriptorDefaults) {
  const cache = {
    _cacheable: false,
    _proxy: proxy,
    _context: context,
    _subProxy: subProxy,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: _descriptors(proxy, descriptorDefaults),
    setContext: (ctx) => _attachContext(proxy, ctx, subProxy, descriptorDefaults),
    override: (scope) => _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
  };
  return new Proxy(cache, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(target, prop) {
      delete target[prop];
      delete proxy[prop];
      return true;
    },
    /**
    * A trap for getting property values.
    */
    get(target, prop, receiver) {
      return _cached(target, prop, () => _resolveWithContext(target, prop, receiver));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(target, prop) {
      return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? {
        enumerable: true,
        configurable: true
      } : void 0 : Reflect.getOwnPropertyDescriptor(proxy, prop);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(proxy);
    },
    /**
    * A trap for the in operator.
    */
    has(target, prop) {
      return Reflect.has(proxy, prop);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys() {
      return Reflect.ownKeys(proxy);
    },
    /**
    * A trap for setting property values.
    */
    set(target, prop, value) {
      proxy[prop] = value;
      delete target[prop];
      return true;
    }
  });
}
function _descriptors(proxy, defaults2 = {
  scriptable: true,
  indexable: true
}) {
  const { _scriptable = defaults2.scriptable, _indexable = defaults2.indexable, _allKeys = defaults2.allKeys } = proxy;
  return {
    allKeys: _allKeys,
    scriptable: _scriptable,
    indexable: _indexable,
    isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
    isIndexable: isFunction(_indexable) ? _indexable : () => _indexable
  };
}
var readKey = (prefix, name) => prefix ? prefix + _capitalize(name) : name;
var needsSubResolver = (prop, value) => isObject(value) && prop !== "adapters" && (Object.getPrototypeOf(value) === null || value.constructor === Object);
function _cached(target, prop, resolve2) {
  if (Object.prototype.hasOwnProperty.call(target, prop) || prop === "constructor") {
    return target[prop];
  }
  const value = resolve2();
  target[prop] = value;
  return value;
}
function _resolveWithContext(target, prop, receiver) {
  const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
  let value = _proxy[prop];
  if (isFunction(value) && descriptors2.isScriptable(prop)) {
    value = _resolveScriptable(prop, value, target, receiver);
  }
  if (isArray(value) && value.length) {
    value = _resolveArray(prop, value, target, descriptors2.isIndexable);
  }
  if (needsSubResolver(prop, value)) {
    value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors2);
  }
  return value;
}
function _resolveScriptable(prop, getValue2, target, receiver) {
  const { _proxy, _context, _subProxy, _stack } = target;
  if (_stack.has(prop)) {
    throw new Error("Recursion detected: " + Array.from(_stack).join("->") + "->" + prop);
  }
  _stack.add(prop);
  let value = getValue2(_context, _subProxy || receiver);
  _stack.delete(prop);
  if (needsSubResolver(prop, value)) {
    value = createSubResolver(_proxy._scopes, _proxy, prop, value);
  }
  return value;
}
function _resolveArray(prop, value, target, isIndexable) {
  const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
  if (typeof _context.index !== "undefined" && isIndexable(prop)) {
    return value[_context.index % value.length];
  } else if (isObject(value[0])) {
    const arr = value;
    const scopes = _proxy._scopes.filter((s2) => s2 !== arr);
    value = [];
    for (const item of arr) {
      const resolver = createSubResolver(scopes, _proxy, prop, item);
      value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors2));
    }
  }
  return value;
}
function resolveFallback(fallback, prop, value) {
  return isFunction(fallback) ? fallback(prop, value) : fallback;
}
var getScope = (key, parent) => key === true ? parent : typeof key === "string" ? resolveObjectKey(parent, key) : void 0;
function addScopes(set2, parentScopes, key, parentFallback, value) {
  for (const parent of parentScopes) {
    const scope = getScope(key, parent);
    if (scope) {
      set2.add(scope);
      const fallback = resolveFallback(scope._fallback, key, value);
      if (typeof fallback !== "undefined" && fallback !== key && fallback !== parentFallback) {
        return fallback;
      }
    } else if (scope === false && typeof parentFallback !== "undefined" && key !== parentFallback) {
      return null;
    }
  }
  return false;
}
function createSubResolver(parentScopes, resolver, prop, value) {
  const rootScopes = resolver._rootScopes;
  const fallback = resolveFallback(resolver._fallback, prop, value);
  const allScopes = [
    ...parentScopes,
    ...rootScopes
  ];
  const set2 = /* @__PURE__ */ new Set();
  set2.add(value);
  let key = addScopesFromKey(set2, allScopes, prop, fallback || prop, value);
  if (key === null) {
    return false;
  }
  if (typeof fallback !== "undefined" && fallback !== prop) {
    key = addScopesFromKey(set2, allScopes, fallback, key, value);
    if (key === null) {
      return false;
    }
  }
  return _createResolver(Array.from(set2), [
    ""
  ], rootScopes, fallback, () => subGetTarget(resolver, prop, value));
}
function addScopesFromKey(set2, allScopes, key, fallback, item) {
  while (key) {
    key = addScopes(set2, allScopes, key, fallback, item);
  }
  return key;
}
function subGetTarget(resolver, prop, value) {
  const parent = resolver._getTarget();
  if (!(prop in parent)) {
    parent[prop] = {};
  }
  const target = parent[prop];
  if (isArray(target) && isObject(value)) {
    return value;
  }
  return target || {};
}
function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
  let value;
  for (const prefix of prefixes) {
    value = _resolve(readKey(prefix, prop), scopes);
    if (typeof value !== "undefined") {
      return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
    }
  }
}
function _resolve(key, scopes) {
  for (const scope of scopes) {
    if (!scope) {
      continue;
    }
    const value = scope[key];
    if (typeof value !== "undefined") {
      return value;
    }
  }
}
function getKeysFromAllScopes(target) {
  let keys = target._keys;
  if (!keys) {
    keys = target._keys = resolveKeysFromAllScopes(target._scopes);
  }
  return keys;
}
function resolveKeysFromAllScopes(scopes) {
  const set2 = /* @__PURE__ */ new Set();
  for (const scope of scopes) {
    for (const key of Object.keys(scope).filter((k2) => !k2.startsWith("_"))) {
      set2.add(key);
    }
  }
  return Array.from(set2);
}
function _parseObjectDataRadialScale(meta, data, start, count) {
  const { iScale } = meta;
  const { key = "r" } = this._parsing;
  const parsed = new Array(count);
  let i2, ilen, index2, item;
  for (i2 = 0, ilen = count; i2 < ilen; ++i2) {
    index2 = i2 + start;
    item = data[index2];
    parsed[i2] = {
      r: iScale.parse(resolveObjectKey(item, key), index2)
    };
  }
  return parsed;
}
var EPSILON = Number.EPSILON || 1e-14;
var getPoint = (points, i2) => i2 < points.length && !points[i2].skip && points[i2];
var getValueAxis = (indexAxis) => indexAxis === "x" ? "y" : "x";
function splineCurve(firstPoint, middlePoint, afterPoint, t2) {
  const previous = firstPoint.skip ? middlePoint : firstPoint;
  const current = middlePoint;
  const next = afterPoint.skip ? middlePoint : afterPoint;
  const d01 = distanceBetweenPoints(current, previous);
  const d12 = distanceBetweenPoints(next, current);
  let s01 = d01 / (d01 + d12);
  let s12 = d12 / (d01 + d12);
  s01 = isNaN(s01) ? 0 : s01;
  s12 = isNaN(s12) ? 0 : s12;
  const fa = t2 * s01;
  const fb = t2 * s12;
  return {
    previous: {
      x: current.x - fa * (next.x - previous.x),
      y: current.y - fa * (next.y - previous.y)
    },
    next: {
      x: current.x + fb * (next.x - previous.x),
      y: current.y + fb * (next.y - previous.y)
    }
  };
}
function monotoneAdjust(points, deltaK, mK) {
  const pointsLen = points.length;
  let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (let i2 = 0; i2 < pointsLen - 1; ++i2) {
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i2 + 1);
    if (!pointCurrent || !pointAfter) {
      continue;
    }
    if (almostEquals(deltaK[i2], 0, EPSILON)) {
      mK[i2] = mK[i2 + 1] = 0;
      continue;
    }
    alphaK = mK[i2] / deltaK[i2];
    betaK = mK[i2 + 1] / deltaK[i2];
    squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
    if (squaredMagnitude <= 9) {
      continue;
    }
    tauK = 3 / Math.sqrt(squaredMagnitude);
    mK[i2] = alphaK * tauK * deltaK[i2];
    mK[i2 + 1] = betaK * tauK * deltaK[i2];
  }
}
function monotoneCompute(points, mK, indexAxis = "x") {
  const valueAxis = getValueAxis(indexAxis);
  const pointsLen = points.length;
  let delta, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (let i2 = 0; i2 < pointsLen; ++i2) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i2 + 1);
    if (!pointCurrent) {
      continue;
    }
    const iPixel = pointCurrent[indexAxis];
    const vPixel = pointCurrent[valueAxis];
    if (pointBefore) {
      delta = (iPixel - pointBefore[indexAxis]) / 3;
      pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
      pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i2];
    }
    if (pointAfter) {
      delta = (pointAfter[indexAxis] - iPixel) / 3;
      pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
      pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i2];
    }
  }
}
function splineCurveMonotone(points, indexAxis = "x") {
  const valueAxis = getValueAxis(indexAxis);
  const pointsLen = points.length;
  const deltaK = Array(pointsLen).fill(0);
  const mK = Array(pointsLen);
  let i2, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (i2 = 0; i2 < pointsLen; ++i2) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i2 + 1);
    if (!pointCurrent) {
      continue;
    }
    if (pointAfter) {
      const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
      deltaK[i2] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
    }
    mK[i2] = !pointBefore ? deltaK[i2] : !pointAfter ? deltaK[i2 - 1] : sign(deltaK[i2 - 1]) !== sign(deltaK[i2]) ? 0 : (deltaK[i2 - 1] + deltaK[i2]) / 2;
  }
  monotoneAdjust(points, deltaK, mK);
  monotoneCompute(points, mK, indexAxis);
}
function capControlPoint(pt2, min, max) {
  return Math.max(Math.min(pt2, max), min);
}
function capBezierPoints(points, area) {
  let i2, ilen, point, inArea, inAreaPrev;
  let inAreaNext = _isPointInArea(points[0], area);
  for (i2 = 0, ilen = points.length; i2 < ilen; ++i2) {
    inAreaPrev = inArea;
    inArea = inAreaNext;
    inAreaNext = i2 < ilen - 1 && _isPointInArea(points[i2 + 1], area);
    if (!inArea) {
      continue;
    }
    point = points[i2];
    if (inAreaPrev) {
      point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
      point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
    }
    if (inAreaNext) {
      point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
      point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
    }
  }
}
function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
  let i2, ilen, point, controlPoints;
  if (options.spanGaps) {
    points = points.filter((pt2) => !pt2.skip);
  }
  if (options.cubicInterpolationMode === "monotone") {
    splineCurveMonotone(points, indexAxis);
  } else {
    let prev = loop ? points[points.length - 1] : points[0];
    for (i2 = 0, ilen = points.length; i2 < ilen; ++i2) {
      point = points[i2];
      controlPoints = splineCurve(prev, point, points[Math.min(i2 + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
      point.cp1x = controlPoints.previous.x;
      point.cp1y = controlPoints.previous.y;
      point.cp2x = controlPoints.next.x;
      point.cp2y = controlPoints.next.y;
      prev = point;
    }
  }
  if (options.capBezierPoints) {
    capBezierPoints(points, area);
  }
}
function _isDomSupported() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function _getParentNode(domNode) {
  let parent = domNode.parentNode;
  if (parent && parent.toString() === "[object ShadowRoot]") {
    parent = parent.host;
  }
  return parent;
}
function parseMaxStyle(styleValue, node, parentProperty) {
  let valueInPixels;
  if (typeof styleValue === "string") {
    valueInPixels = parseInt(styleValue, 10);
    if (styleValue.indexOf("%") !== -1) {
      valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
    }
  } else {
    valueInPixels = styleValue;
  }
  return valueInPixels;
}
var getComputedStyle = (element) => element.ownerDocument.defaultView.getComputedStyle(element, null);
function getStyle(el, property) {
  return getComputedStyle(el).getPropertyValue(property);
}
var positions = [
  "top",
  "right",
  "bottom",
  "left"
];
function getPositionedStyle(styles, style, suffix) {
  const result = {};
  suffix = suffix ? "-" + suffix : "";
  for (let i2 = 0; i2 < 4; i2++) {
    const pos = positions[i2];
    result[pos] = parseFloat(styles[style + "-" + pos + suffix]) || 0;
  }
  result.width = result.left + result.right;
  result.height = result.top + result.bottom;
  return result;
}
var useOffsetPos = (x2, y2, target) => (x2 > 0 || y2 > 0) && (!target || !target.shadowRoot);
function getCanvasPosition(e2, canvas) {
  const touches = e2.touches;
  const source = touches && touches.length ? touches[0] : e2;
  const { offsetX, offsetY } = source;
  let box = false;
  let x2, y2;
  if (useOffsetPos(offsetX, offsetY, e2.target)) {
    x2 = offsetX;
    y2 = offsetY;
  } else {
    const rect = canvas.getBoundingClientRect();
    x2 = source.clientX - rect.left;
    y2 = source.clientY - rect.top;
    box = true;
  }
  return {
    x: x2,
    y: y2,
    box
  };
}
function getRelativePosition(event, chart) {
  if ("native" in event) {
    return event;
  }
  const { canvas, currentDevicePixelRatio } = chart;
  const style = getComputedStyle(canvas);
  const borderBox = style.boxSizing === "border-box";
  const paddings = getPositionedStyle(style, "padding");
  const borders = getPositionedStyle(style, "border", "width");
  const { x: x2, y: y2, box } = getCanvasPosition(event, canvas);
  const xOffset = paddings.left + (box && borders.left);
  const yOffset = paddings.top + (box && borders.top);
  let { width, height } = chart;
  if (borderBox) {
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }
  return {
    x: Math.round((x2 - xOffset) / width * canvas.width / currentDevicePixelRatio),
    y: Math.round((y2 - yOffset) / height * canvas.height / currentDevicePixelRatio)
  };
}
function getContainerSize(canvas, width, height) {
  let maxWidth, maxHeight;
  if (width === void 0 || height === void 0) {
    const container = canvas && _getParentNode(canvas);
    if (!container) {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    } else {
      const rect = container.getBoundingClientRect();
      const containerStyle = getComputedStyle(container);
      const containerBorder = getPositionedStyle(containerStyle, "border", "width");
      const containerPadding = getPositionedStyle(containerStyle, "padding");
      width = rect.width - containerPadding.width - containerBorder.width;
      height = rect.height - containerPadding.height - containerBorder.height;
      maxWidth = parseMaxStyle(containerStyle.maxWidth, container, "clientWidth");
      maxHeight = parseMaxStyle(containerStyle.maxHeight, container, "clientHeight");
    }
  }
  return {
    width,
    height,
    maxWidth: maxWidth || INFINITY,
    maxHeight: maxHeight || INFINITY
  };
}
var round1 = (v2) => Math.round(v2 * 10) / 10;
function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
  const style = getComputedStyle(canvas);
  const margins = getPositionedStyle(style, "margin");
  const maxWidth = parseMaxStyle(style.maxWidth, canvas, "clientWidth") || INFINITY;
  const maxHeight = parseMaxStyle(style.maxHeight, canvas, "clientHeight") || INFINITY;
  const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
  let { width, height } = containerSize;
  if (style.boxSizing === "content-box") {
    const borders = getPositionedStyle(style, "border", "width");
    const paddings = getPositionedStyle(style, "padding");
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }
  width = Math.max(0, width - margins.width);
  height = Math.max(0, aspectRatio ? width / aspectRatio : height - margins.height);
  width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
  height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
  if (width && !height) {
    height = round1(width / 2);
  }
  const maintainHeight = bbWidth !== void 0 || bbHeight !== void 0;
  if (maintainHeight && aspectRatio && containerSize.height && height > containerSize.height) {
    height = containerSize.height;
    width = round1(Math.floor(height * aspectRatio));
  }
  return {
    width,
    height
  };
}
function retinaScale(chart, forceRatio, forceStyle) {
  const pixelRatio = forceRatio || 1;
  const deviceHeight = round1(chart.height * pixelRatio);
  const deviceWidth = round1(chart.width * pixelRatio);
  chart.height = round1(chart.height);
  chart.width = round1(chart.width);
  const canvas = chart.canvas;
  if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
    canvas.style.height = `${chart.height}px`;
    canvas.style.width = `${chart.width}px`;
  }
  if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
    chart.currentDevicePixelRatio = pixelRatio;
    canvas.height = deviceHeight;
    canvas.width = deviceWidth;
    chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    return true;
  }
  return false;
}
var supportsEventListenerOptions = (function() {
  let passiveSupported = false;
  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    if (_isDomSupported()) {
      window.addEventListener("test", null, options);
      window.removeEventListener("test", null, options);
    }
  } catch (e2) {
  }
  return passiveSupported;
})();
function readUsedSize(element, property) {
  const value = getStyle(element, property);
  const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
  return matches ? +matches[1] : void 0;
}
function _pointInLine(p1, p2, t2, mode) {
  return {
    x: p1.x + t2 * (p2.x - p1.x),
    y: p1.y + t2 * (p2.y - p1.y)
  };
}
function _steppedInterpolation(p1, p2, t2, mode) {
  return {
    x: p1.x + t2 * (p2.x - p1.x),
    y: mode === "middle" ? t2 < 0.5 ? p1.y : p2.y : mode === "after" ? t2 < 1 ? p1.y : p2.y : t2 > 0 ? p2.y : p1.y
  };
}
function _bezierInterpolation(p1, p2, t2, mode) {
  const cp1 = {
    x: p1.cp2x,
    y: p1.cp2y
  };
  const cp2 = {
    x: p2.cp1x,
    y: p2.cp1y
  };
  const a2 = _pointInLine(p1, cp1, t2);
  const b2 = _pointInLine(cp1, cp2, t2);
  const c2 = _pointInLine(cp2, p2, t2);
  const d2 = _pointInLine(a2, b2, t2);
  const e2 = _pointInLine(b2, c2, t2);
  return _pointInLine(d2, e2, t2);
}
var getRightToLeftAdapter = function(rectX, width) {
  return {
    x(x2) {
      return rectX + rectX + width - x2;
    },
    setWidth(w2) {
      width = w2;
    },
    textAlign(align) {
      if (align === "center") {
        return align;
      }
      return align === "right" ? "left" : "right";
    },
    xPlus(x2, value) {
      return x2 - value;
    },
    leftForLtr(x2, itemWidth) {
      return x2 - itemWidth;
    }
  };
};
var getLeftToRightAdapter = function() {
  return {
    x(x2) {
      return x2;
    },
    setWidth(w2) {
    },
    textAlign(align) {
      return align;
    },
    xPlus(x2, value) {
      return x2 + value;
    },
    leftForLtr(x2, _itemWidth) {
      return x2;
    }
  };
};
function getRtlAdapter(rtl, rectX, width) {
  return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
}
function overrideTextDirection(ctx, direction) {
  let style, original;
  if (direction === "ltr" || direction === "rtl") {
    style = ctx.canvas.style;
    original = [
      style.getPropertyValue("direction"),
      style.getPropertyPriority("direction")
    ];
    style.setProperty("direction", direction, "important");
    ctx.prevTextDirection = original;
  }
}
function restoreTextDirection(ctx, original) {
  if (original !== void 0) {
    delete ctx.prevTextDirection;
    ctx.canvas.style.setProperty("direction", original[0], original[1]);
  }
}
function propertyFn(property) {
  if (property === "angle") {
    return {
      between: _angleBetween,
      compare: _angleDiff,
      normalize: _normalizeAngle
    };
  }
  return {
    between: _isBetween,
    compare: (a2, b2) => a2 - b2,
    normalize: (x2) => x2
  };
}
function normalizeSegment({ start, end, count, loop, style }) {
  return {
    start: start % count,
    end: end % count,
    loop: loop && (end - start + 1) % count === 0,
    style
  };
}
function getSegment(segment, points, bounds) {
  const { property, start: startBound, end: endBound } = bounds;
  const { between, normalize } = propertyFn(property);
  const count = points.length;
  let { start, end, loop } = segment;
  let i2, ilen;
  if (loop) {
    start += count;
    end += count;
    for (i2 = 0, ilen = count; i2 < ilen; ++i2) {
      if (!between(normalize(points[start % count][property]), startBound, endBound)) {
        break;
      }
      start--;
      end--;
    }
    start %= count;
    end %= count;
  }
  if (end < start) {
    end += count;
  }
  return {
    start,
    end,
    loop,
    style: segment.style
  };
}
function _boundSegment(segment, points, bounds) {
  if (!bounds) {
    return [
      segment
    ];
  }
  const { property, start: startBound, end: endBound } = bounds;
  const count = points.length;
  const { compare, between, normalize } = propertyFn(property);
  const { start, end, loop, style } = getSegment(segment, points, bounds);
  const result = [];
  let inside = false;
  let subStart = null;
  let value, point, prevValue;
  const startIsBefore = () => between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
  const endIsBefore = () => compare(endBound, value) === 0 || between(endBound, prevValue, value);
  const shouldStart = () => inside || startIsBefore();
  const shouldStop = () => !inside || endIsBefore();
  for (let i2 = start, prev = start; i2 <= end; ++i2) {
    point = points[i2 % count];
    if (point.skip) {
      continue;
    }
    value = normalize(point[property]);
    if (value === prevValue) {
      continue;
    }
    inside = between(value, startBound, endBound);
    if (subStart === null && shouldStart()) {
      subStart = compare(value, startBound) === 0 ? i2 : prev;
    }
    if (subStart !== null && shouldStop()) {
      result.push(normalizeSegment({
        start: subStart,
        end: i2,
        loop,
        count,
        style
      }));
      subStart = null;
    }
    prev = i2;
    prevValue = value;
  }
  if (subStart !== null) {
    result.push(normalizeSegment({
      start: subStart,
      end,
      loop,
      count,
      style
    }));
  }
  return result;
}
function _boundSegments(line, bounds) {
  const result = [];
  const segments = line.segments;
  for (let i2 = 0; i2 < segments.length; i2++) {
    const sub = _boundSegment(segments[i2], line.points, bounds);
    if (sub.length) {
      result.push(...sub);
    }
  }
  return result;
}
function findStartAndEnd(points, count, loop, spanGaps) {
  let start = 0;
  let end = count - 1;
  if (loop && !spanGaps) {
    while (start < count && !points[start].skip) {
      start++;
    }
  }
  while (start < count && points[start].skip) {
    start++;
  }
  start %= count;
  if (loop) {
    end += start;
  }
  while (end > start && points[end % count].skip) {
    end--;
  }
  end %= count;
  return {
    start,
    end
  };
}
function solidSegments(points, start, max, loop) {
  const count = points.length;
  const result = [];
  let last = start;
  let prev = points[start];
  let end;
  for (end = start + 1; end <= max; ++end) {
    const cur = points[end % count];
    if (cur.skip || cur.stop) {
      if (!prev.skip) {
        loop = false;
        result.push({
          start: start % count,
          end: (end - 1) % count,
          loop
        });
        start = last = cur.stop ? end : null;
      }
    } else {
      last = end;
      if (prev.skip) {
        start = end;
      }
    }
    prev = cur;
  }
  if (last !== null) {
    result.push({
      start: start % count,
      end: last % count,
      loop
    });
  }
  return result;
}
function _computeSegments(line, segmentOptions) {
  const points = line.points;
  const spanGaps = line.options.spanGaps;
  const count = points.length;
  if (!count) {
    return [];
  }
  const loop = !!line._loop;
  const { start, end } = findStartAndEnd(points, count, loop, spanGaps);
  if (spanGaps === true) {
    return splitByStyles(line, [
      {
        start,
        end,
        loop
      }
    ], points, segmentOptions);
  }
  const max = end < start ? end + count : end;
  const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
  return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
}
function splitByStyles(line, segments, points, segmentOptions) {
  if (!segmentOptions || !segmentOptions.setContext || !points) {
    return segments;
  }
  return doSplitByStyles(line, segments, points, segmentOptions);
}
function doSplitByStyles(line, segments, points, segmentOptions) {
  const chartContext = line._chart.getContext();
  const baseStyle = readStyle(line.options);
  const { _datasetIndex: datasetIndex, options: { spanGaps } } = line;
  const count = points.length;
  const result = [];
  let prevStyle = baseStyle;
  let start = segments[0].start;
  let i2 = start;
  function addStyle(s2, e2, l2, st2) {
    const dir = spanGaps ? -1 : 1;
    if (s2 === e2) {
      return;
    }
    s2 += count;
    while (points[s2 % count].skip) {
      s2 -= dir;
    }
    while (points[e2 % count].skip) {
      e2 += dir;
    }
    if (s2 % count !== e2 % count) {
      result.push({
        start: s2 % count,
        end: e2 % count,
        loop: l2,
        style: st2
      });
      prevStyle = st2;
      start = e2 % count;
    }
  }
  for (const segment of segments) {
    start = spanGaps ? start : segment.start;
    let prev = points[start % count];
    let style;
    for (i2 = start + 1; i2 <= segment.end; i2++) {
      const pt2 = points[i2 % count];
      style = readStyle(segmentOptions.setContext(createContext(chartContext, {
        type: "segment",
        p0: prev,
        p1: pt2,
        p0DataIndex: (i2 - 1) % count,
        p1DataIndex: i2 % count,
        datasetIndex
      })));
      if (styleChanged(style, prevStyle)) {
        addStyle(start, i2 - 1, segment.loop, prevStyle);
      }
      prev = pt2;
      prevStyle = style;
    }
    if (start < i2 - 1) {
      addStyle(start, i2 - 1, segment.loop, prevStyle);
    }
  }
  return result;
}
function readStyle(options) {
  return {
    backgroundColor: options.backgroundColor,
    borderCapStyle: options.borderCapStyle,
    borderDash: options.borderDash,
    borderDashOffset: options.borderDashOffset,
    borderJoinStyle: options.borderJoinStyle,
    borderWidth: options.borderWidth,
    borderColor: options.borderColor
  };
}
function styleChanged(style, prevStyle) {
  if (!prevStyle) {
    return false;
  }
  const cache = [];
  const replacer = function(key, value) {
    if (!isPatternOrGradient(value)) {
      return value;
    }
    if (!cache.includes(value)) {
      cache.push(value);
    }
    return cache.indexOf(value);
  };
  return JSON.stringify(style, replacer) !== JSON.stringify(prevStyle, replacer);
}
function getSizeForArea(scale, chartArea, field) {
  return scale.options.clip ? scale[field] : chartArea[field];
}
function getDatasetArea(meta, chartArea) {
  const { xScale, yScale } = meta;
  if (xScale && yScale) {
    return {
      left: getSizeForArea(xScale, chartArea, "left"),
      right: getSizeForArea(xScale, chartArea, "right"),
      top: getSizeForArea(yScale, chartArea, "top"),
      bottom: getSizeForArea(yScale, chartArea, "bottom")
    };
  }
  return chartArea;
}
function getDatasetClipArea(chart, meta) {
  const clip = meta._clip;
  if (clip.disabled) {
    return false;
  }
  const area = getDatasetArea(meta, chart.chartArea);
  return {
    left: clip.left === false ? 0 : area.left - (clip.left === true ? 0 : clip.left),
    right: clip.right === false ? chart.width : area.right + (clip.right === true ? 0 : clip.right),
    top: clip.top === false ? 0 : area.top - (clip.top === true ? 0 : clip.top),
    bottom: clip.bottom === false ? chart.height : area.bottom + (clip.bottom === true ? 0 : clip.bottom)
  };
}

// node_modules/chart.js/dist/chart.js
var Animator = class {
  constructor() {
    this._request = null;
    this._charts = /* @__PURE__ */ new Map();
    this._running = false;
    this._lastDate = void 0;
  }
  _notify(chart, anims, date, type) {
    const callbacks = anims.listeners[type];
    const numSteps = anims.duration;
    callbacks.forEach((fn2) => fn2({
      chart,
      initial: anims.initial,
      numSteps,
      currentStep: Math.min(date - anims.start, numSteps)
    }));
  }
  _refresh() {
    if (this._request) {
      return;
    }
    this._running = true;
    this._request = requestAnimFrame.call(window, () => {
      this._update();
      this._request = null;
      if (this._running) {
        this._refresh();
      }
    });
  }
  _update(date = Date.now()) {
    let remaining = 0;
    this._charts.forEach((anims, chart) => {
      if (!anims.running || !anims.items.length) {
        return;
      }
      const items = anims.items;
      let i2 = items.length - 1;
      let draw2 = false;
      let item;
      for (; i2 >= 0; --i2) {
        item = items[i2];
        if (item._active) {
          if (item._total > anims.duration) {
            anims.duration = item._total;
          }
          item.tick(date);
          draw2 = true;
        } else {
          items[i2] = items[items.length - 1];
          items.pop();
        }
      }
      if (draw2) {
        chart.draw();
        this._notify(chart, anims, date, "progress");
      }
      if (!items.length) {
        anims.running = false;
        this._notify(chart, anims, date, "complete");
        anims.initial = false;
      }
      remaining += items.length;
    });
    this._lastDate = date;
    if (remaining === 0) {
      this._running = false;
    }
  }
  _getAnims(chart) {
    const charts = this._charts;
    let anims = charts.get(chart);
    if (!anims) {
      anims = {
        running: false,
        initial: true,
        items: [],
        listeners: {
          complete: [],
          progress: []
        }
      };
      charts.set(chart, anims);
    }
    return anims;
  }
  listen(chart, event, cb) {
    this._getAnims(chart).listeners[event].push(cb);
  }
  add(chart, items) {
    if (!items || !items.length) {
      return;
    }
    this._getAnims(chart).items.push(...items);
  }
  has(chart) {
    return this._getAnims(chart).items.length > 0;
  }
  start(chart) {
    const anims = this._charts.get(chart);
    if (!anims) {
      return;
    }
    anims.running = true;
    anims.start = Date.now();
    anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);
    this._refresh();
  }
  running(chart) {
    if (!this._running) {
      return false;
    }
    const anims = this._charts.get(chart);
    if (!anims || !anims.running || !anims.items.length) {
      return false;
    }
    return true;
  }
  stop(chart) {
    const anims = this._charts.get(chart);
    if (!anims || !anims.items.length) {
      return;
    }
    const items = anims.items;
    let i2 = items.length - 1;
    for (; i2 >= 0; --i2) {
      items[i2].cancel();
    }
    anims.items = [];
    this._notify(chart, anims, Date.now(), "complete");
  }
  remove(chart) {
    return this._charts.delete(chart);
  }
};
var animator = /* @__PURE__ */ new Animator();
var transparent = "transparent";
var interpolators = {
  boolean(from2, to3, factor) {
    return factor > 0.5 ? to3 : from2;
  },
  color(from2, to3, factor) {
    const c0 = color(from2 || transparent);
    const c1 = c0.valid && color(to3 || transparent);
    return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to3;
  },
  number(from2, to3, factor) {
    return from2 + (to3 - from2) * factor;
  }
};
var Animation = class {
  constructor(cfg, target, prop, to3) {
    const currentValue = target[prop];
    to3 = resolve([
      cfg.to,
      to3,
      currentValue,
      cfg.from
    ]);
    const from2 = resolve([
      cfg.from,
      currentValue,
      to3
    ]);
    this._active = true;
    this._fn = cfg.fn || interpolators[cfg.type || typeof from2];
    this._easing = effects[cfg.easing] || effects.linear;
    this._start = Math.floor(Date.now() + (cfg.delay || 0));
    this._duration = this._total = Math.floor(cfg.duration);
    this._loop = !!cfg.loop;
    this._target = target;
    this._prop = prop;
    this._from = from2;
    this._to = to3;
    this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(cfg, to3, date) {
    if (this._active) {
      this._notify(false);
      const currentValue = this._target[this._prop];
      const elapsed = date - this._start;
      const remain = this._duration - elapsed;
      this._start = date;
      this._duration = Math.floor(Math.max(remain, cfg.duration));
      this._total += elapsed;
      this._loop = !!cfg.loop;
      this._to = resolve([
        cfg.to,
        to3,
        currentValue,
        cfg.from
      ]);
      this._from = resolve([
        cfg.from,
        currentValue,
        to3
      ]);
    }
  }
  cancel() {
    if (this._active) {
      this.tick(Date.now());
      this._active = false;
      this._notify(false);
    }
  }
  tick(date) {
    const elapsed = date - this._start;
    const duration = this._duration;
    const prop = this._prop;
    const from2 = this._from;
    const loop = this._loop;
    const to3 = this._to;
    let factor;
    this._active = from2 !== to3 && (loop || elapsed < duration);
    if (!this._active) {
      this._target[prop] = to3;
      this._notify(true);
      return;
    }
    if (elapsed < 0) {
      this._target[prop] = from2;
      return;
    }
    factor = elapsed / duration % 2;
    factor = loop && factor > 1 ? 2 - factor : factor;
    factor = this._easing(Math.min(1, Math.max(0, factor)));
    this._target[prop] = this._fn(from2, to3, factor);
  }
  wait() {
    const promises = this._promises || (this._promises = []);
    return new Promise((res, rej) => {
      promises.push({
        res,
        rej
      });
    });
  }
  _notify(resolved) {
    const method = resolved ? "res" : "rej";
    const promises = this._promises || [];
    for (let i2 = 0; i2 < promises.length; i2++) {
      promises[i2][method]();
    }
  }
};
var Animations = class {
  constructor(chart, config) {
    this._chart = chart;
    this._properties = /* @__PURE__ */ new Map();
    this.configure(config);
  }
  configure(config) {
    if (!isObject(config)) {
      return;
    }
    const animationOptions = Object.keys(defaults.animation);
    const animatedProps = this._properties;
    Object.getOwnPropertyNames(config).forEach((key) => {
      const cfg = config[key];
      if (!isObject(cfg)) {
        return;
      }
      const resolved = {};
      for (const option of animationOptions) {
        resolved[option] = cfg[option];
      }
      (isArray(cfg.properties) && cfg.properties || [
        key
      ]).forEach((prop) => {
        if (prop === key || !animatedProps.has(prop)) {
          animatedProps.set(prop, resolved);
        }
      });
    });
  }
  _animateOptions(target, values) {
    const newOptions = values.options;
    const options = resolveTargetOptions(target, newOptions);
    if (!options) {
      return [];
    }
    const animations = this._createAnimations(options, newOptions);
    if (newOptions.$shared) {
      awaitAll(target.options.$animations, newOptions).then(() => {
        target.options = newOptions;
      }, () => {
      });
    }
    return animations;
  }
  _createAnimations(target, values) {
    const animatedProps = this._properties;
    const animations = [];
    const running = target.$animations || (target.$animations = {});
    const props = Object.keys(values);
    const date = Date.now();
    let i2;
    for (i2 = props.length - 1; i2 >= 0; --i2) {
      const prop = props[i2];
      if (prop.charAt(0) === "$") {
        continue;
      }
      if (prop === "options") {
        animations.push(...this._animateOptions(target, values));
        continue;
      }
      const value = values[prop];
      let animation = running[prop];
      const cfg = animatedProps.get(prop);
      if (animation) {
        if (cfg && animation.active()) {
          animation.update(cfg, value, date);
          continue;
        } else {
          animation.cancel();
        }
      }
      if (!cfg || !cfg.duration) {
        target[prop] = value;
        continue;
      }
      running[prop] = animation = new Animation(cfg, target, prop, value);
      animations.push(animation);
    }
    return animations;
  }
  update(target, values) {
    if (this._properties.size === 0) {
      Object.assign(target, values);
      return;
    }
    const animations = this._createAnimations(target, values);
    if (animations.length) {
      animator.add(this._chart, animations);
      return true;
    }
  }
};
function awaitAll(animations, properties) {
  const running = [];
  const keys = Object.keys(properties);
  for (let i2 = 0; i2 < keys.length; i2++) {
    const anim = animations[keys[i2]];
    if (anim && anim.active()) {
      running.push(anim.wait());
    }
  }
  return Promise.all(running);
}
function resolveTargetOptions(target, newOptions) {
  if (!newOptions) {
    return;
  }
  let options = target.options;
  if (!options) {
    target.options = newOptions;
    return;
  }
  if (options.$shared) {
    target.options = options = Object.assign({}, options, {
      $shared: false,
      $animations: {}
    });
  }
  return options;
}
function scaleClip(scale, allowedOverflow) {
  const opts = scale && scale.options || {};
  const reverse = opts.reverse;
  const min = opts.min === void 0 ? allowedOverflow : 0;
  const max = opts.max === void 0 ? allowedOverflow : 0;
  return {
    start: reverse ? max : min,
    end: reverse ? min : max
  };
}
function defaultClip(xScale, yScale, allowedOverflow) {
  if (allowedOverflow === false) {
    return false;
  }
  const x2 = scaleClip(xScale, allowedOverflow);
  const y2 = scaleClip(yScale, allowedOverflow);
  return {
    top: y2.end,
    right: x2.end,
    bottom: y2.start,
    left: x2.start
  };
}
function toClip(value) {
  let t2, r2, b2, l2;
  if (isObject(value)) {
    t2 = value.top;
    r2 = value.right;
    b2 = value.bottom;
    l2 = value.left;
  } else {
    t2 = r2 = b2 = l2 = value;
  }
  return {
    top: t2,
    right: r2,
    bottom: b2,
    left: l2,
    disabled: value === false
  };
}
function getSortedDatasetIndices(chart, filterVisible) {
  const keys = [];
  const metasets = chart._getSortedDatasetMetas(filterVisible);
  let i2, ilen;
  for (i2 = 0, ilen = metasets.length; i2 < ilen; ++i2) {
    keys.push(metasets[i2].index);
  }
  return keys;
}
function applyStack(stack, value, dsIndex, options = {}) {
  const keys = stack.keys;
  const singleMode = options.mode === "single";
  let i2, ilen, datasetIndex, otherValue;
  if (value === null) {
    return;
  }
  let found = false;
  for (i2 = 0, ilen = keys.length; i2 < ilen; ++i2) {
    datasetIndex = +keys[i2];
    if (datasetIndex === dsIndex) {
      found = true;
      if (options.all) {
        continue;
      }
      break;
    }
    otherValue = stack.values[datasetIndex];
    if (isNumberFinite(otherValue) && (singleMode || value === 0 || sign(value) === sign(otherValue))) {
      value += otherValue;
    }
  }
  if (!found && !options.all) {
    return 0;
  }
  return value;
}
function convertObjectDataToArray(data, meta) {
  const { iScale, vScale } = meta;
  const iAxisKey = iScale.axis === "x" ? "x" : "y";
  const vAxisKey = vScale.axis === "x" ? "x" : "y";
  const keys = Object.keys(data);
  const adata = new Array(keys.length);
  let i2, ilen, key;
  for (i2 = 0, ilen = keys.length; i2 < ilen; ++i2) {
    key = keys[i2];
    adata[i2] = {
      [iAxisKey]: key,
      [vAxisKey]: data[key]
    };
  }
  return adata;
}
function isStacked(scale, meta) {
  const stacked = scale && scale.options.stacked;
  return stacked || stacked === void 0 && meta.stack !== void 0;
}
function getStackKey(indexScale, valueScale, meta) {
  return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
}
function getUserBounds(scale) {
  const { min, max, minDefined, maxDefined } = scale.getUserBounds();
  return {
    min: minDefined ? min : Number.NEGATIVE_INFINITY,
    max: maxDefined ? max : Number.POSITIVE_INFINITY
  };
}
function getOrCreateStack(stacks, stackKey, indexValue) {
  const subStack = stacks[stackKey] || (stacks[stackKey] = {});
  return subStack[indexValue] || (subStack[indexValue] = {});
}
function getLastIndexInStack(stack, vScale, positive, type) {
  for (const meta of vScale.getMatchingVisibleMetas(type).reverse()) {
    const value = stack[meta.index];
    if (positive && value > 0 || !positive && value < 0) {
      return meta.index;
    }
  }
  return null;
}
function updateStacks(controller, parsed) {
  const { chart, _cachedMeta: meta } = controller;
  const stacks = chart._stacks || (chart._stacks = {});
  const { iScale, vScale, index: datasetIndex } = meta;
  const iAxis = iScale.axis;
  const vAxis = vScale.axis;
  const key = getStackKey(iScale, vScale, meta);
  const ilen = parsed.length;
  let stack;
  for (let i2 = 0; i2 < ilen; ++i2) {
    const item = parsed[i2];
    const { [iAxis]: index2, [vAxis]: value } = item;
    const itemStacks = item._stacks || (item._stacks = {});
    stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index2);
    stack[datasetIndex] = value;
    stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
    stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
    const visualValues = stack._visualValues || (stack._visualValues = {});
    visualValues[datasetIndex] = value;
  }
}
function getFirstScaleId(chart, axis) {
  const scales2 = chart.scales;
  return Object.keys(scales2).filter((key) => scales2[key].axis === axis).shift();
}
function createDatasetContext(parent, index2) {
  return createContext(parent, {
    active: false,
    dataset: void 0,
    datasetIndex: index2,
    index: index2,
    mode: "default",
    type: "dataset"
  });
}
function createDataContext(parent, index2, element) {
  return createContext(parent, {
    active: false,
    dataIndex: index2,
    parsed: void 0,
    raw: void 0,
    element,
    index: index2,
    mode: "default",
    type: "data"
  });
}
function clearStacks(meta, items) {
  const datasetIndex = meta.controller.index;
  const axis = meta.vScale && meta.vScale.axis;
  if (!axis) {
    return;
  }
  items = items || meta._parsed;
  for (const parsed of items) {
    const stacks = parsed._stacks;
    if (!stacks || stacks[axis] === void 0 || stacks[axis][datasetIndex] === void 0) {
      return;
    }
    delete stacks[axis][datasetIndex];
    if (stacks[axis]._visualValues !== void 0 && stacks[axis]._visualValues[datasetIndex] !== void 0) {
      delete stacks[axis]._visualValues[datasetIndex];
    }
  }
}
var isDirectUpdateMode = (mode) => mode === "reset" || mode === "none";
var cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);
var createStack = (canStack, meta, chart) => canStack && !meta.hidden && meta._stacked && {
  keys: getSortedDatasetIndices(chart, true),
  values: null
};
var DatasetController = class {
  static defaults = {};
  static datasetElementType = null;
  static dataElementType = null;
  constructor(chart, datasetIndex) {
    this.chart = chart;
    this._ctx = chart.ctx;
    this.index = datasetIndex;
    this._cachedDataOpts = {};
    this._cachedMeta = this.getMeta();
    this._type = this._cachedMeta.type;
    this.options = void 0;
    this._parsing = false;
    this._data = void 0;
    this._objectData = void 0;
    this._sharedOptions = void 0;
    this._drawStart = void 0;
    this._drawCount = void 0;
    this.enableOptionSharing = false;
    this.supportsDecimation = false;
    this.$context = void 0;
    this._syncList = [];
    this.datasetElementType = new.target.datasetElementType;
    this.dataElementType = new.target.dataElementType;
    this.initialize();
  }
  initialize() {
    const meta = this._cachedMeta;
    this.configure();
    this.linkScales();
    meta._stacked = isStacked(meta.vScale, meta);
    this.addElements();
    if (this.options.fill && !this.chart.isPluginEnabled("filler")) {
      console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
    }
  }
  updateIndex(datasetIndex) {
    if (this.index !== datasetIndex) {
      clearStacks(this._cachedMeta);
    }
    this.index = datasetIndex;
  }
  linkScales() {
    const chart = this.chart;
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    const chooseId = (axis, x2, y2, r2) => axis === "x" ? x2 : axis === "r" ? r2 : y2;
    const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, "x"));
    const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, "y"));
    const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, "r"));
    const indexAxis = meta.indexAxis;
    const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
    const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
    meta.xScale = this.getScaleForId(xid);
    meta.yScale = this.getScaleForId(yid);
    meta.rScale = this.getScaleForId(rid);
    meta.iScale = this.getScaleForId(iid);
    meta.vScale = this.getScaleForId(vid);
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(scaleID) {
    return this.chart.scales[scaleID];
  }
  _getOtherScale(scale) {
    const meta = this._cachedMeta;
    return scale === meta.iScale ? meta.vScale : meta.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const meta = this._cachedMeta;
    if (this._data) {
      unlistenArrayEvents(this._data, this);
    }
    if (meta._stacked) {
      clearStacks(meta);
    }
  }
  _dataCheck() {
    const dataset = this.getDataset();
    const data = dataset.data || (dataset.data = []);
    const _data = this._data;
    if (isObject(data)) {
      const meta = this._cachedMeta;
      this._data = convertObjectDataToArray(data, meta);
    } else if (_data !== data) {
      if (_data) {
        unlistenArrayEvents(_data, this);
        const meta = this._cachedMeta;
        clearStacks(meta);
        meta._parsed = [];
      }
      if (data && Object.isExtensible(data)) {
        listenArrayEvents(data, this);
      }
      this._syncList = [];
      this._data = data;
    }
  }
  addElements() {
    const meta = this._cachedMeta;
    this._dataCheck();
    if (this.datasetElementType) {
      meta.dataset = new this.datasetElementType();
    }
  }
  buildOrUpdateElements(resetNewElements) {
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    let stackChanged = false;
    this._dataCheck();
    const oldStacked = meta._stacked;
    meta._stacked = isStacked(meta.vScale, meta);
    if (meta.stack !== dataset.stack) {
      stackChanged = true;
      clearStacks(meta);
      meta.stack = dataset.stack;
    }
    this._resyncElements(resetNewElements);
    if (stackChanged || oldStacked !== meta._stacked) {
      updateStacks(this, meta._parsed);
      meta._stacked = isStacked(meta.vScale, meta);
    }
  }
  configure() {
    const config = this.chart.config;
    const scopeKeys = config.datasetScopeKeys(this._type);
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
    this.options = config.createResolver(scopes, this.getContext());
    this._parsing = this.options.parsing;
    this._cachedDataOpts = {};
  }
  parse(start, count) {
    const { _cachedMeta: meta, _data: data } = this;
    const { iScale, _stacked } = meta;
    const iAxis = iScale.axis;
    let sorted = start === 0 && count === data.length ? true : meta._sorted;
    let prev = start > 0 && meta._parsed[start - 1];
    let i2, cur, parsed;
    if (this._parsing === false) {
      meta._parsed = data;
      meta._sorted = true;
      parsed = data;
    } else {
      if (isArray(data[start])) {
        parsed = this.parseArrayData(meta, data, start, count);
      } else if (isObject(data[start])) {
        parsed = this.parseObjectData(meta, data, start, count);
      } else {
        parsed = this.parsePrimitiveData(meta, data, start, count);
      }
      const isNotInOrderComparedToPrev = () => cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
      for (i2 = 0; i2 < count; ++i2) {
        meta._parsed[i2 + start] = cur = parsed[i2];
        if (sorted) {
          if (isNotInOrderComparedToPrev()) {
            sorted = false;
          }
          prev = cur;
        }
      }
      meta._sorted = sorted;
    }
    if (_stacked) {
      updateStacks(this, parsed);
    }
  }
  parsePrimitiveData(meta, data, start, count) {
    const { iScale, vScale } = meta;
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const labels = iScale.getLabels();
    const singleScale = iScale === vScale;
    const parsed = new Array(count);
    let i2, ilen, index2;
    for (i2 = 0, ilen = count; i2 < ilen; ++i2) {
      index2 = i2 + start;
      parsed[i2] = {
        [iAxis]: singleScale || iScale.parse(labels[index2], index2),
        [vAxis]: vScale.parse(data[index2], index2)
      };
    }
    return parsed;
  }
  parseArrayData(meta, data, start, count) {
    const { xScale, yScale } = meta;
    const parsed = new Array(count);
    let i2, ilen, index2, item;
    for (i2 = 0, ilen = count; i2 < ilen; ++i2) {
      index2 = i2 + start;
      item = data[index2];
      parsed[i2] = {
        x: xScale.parse(item[0], index2),
        y: yScale.parse(item[1], index2)
      };
    }
    return parsed;
  }
  parseObjectData(meta, data, start, count) {
    const { xScale, yScale } = meta;
    const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
    const parsed = new Array(count);
    let i2, ilen, index2, item;
    for (i2 = 0, ilen = count; i2 < ilen; ++i2) {
      index2 = i2 + start;
      item = data[index2];
      parsed[i2] = {
        x: xScale.parse(resolveObjectKey(item, xAxisKey), index2),
        y: yScale.parse(resolveObjectKey(item, yAxisKey), index2)
      };
    }
    return parsed;
  }
  getParsed(index2) {
    return this._cachedMeta._parsed[index2];
  }
  getDataElement(index2) {
    return this._cachedMeta.data[index2];
  }
  applyStack(scale, parsed, mode) {
    const chart = this.chart;
    const meta = this._cachedMeta;
    const value = parsed[scale.axis];
    const stack = {
      keys: getSortedDatasetIndices(chart, true),
      values: parsed._stacks[scale.axis]._visualValues
    };
    return applyStack(stack, value, meta.index, {
      mode
    });
  }
  updateRangeFromParsed(range, scale, parsed, stack) {
    const parsedValue = parsed[scale.axis];
    let value = parsedValue === null ? NaN : parsedValue;
    const values = stack && parsed._stacks[scale.axis];
    if (stack && values) {
      stack.values = values;
      value = applyStack(stack, parsedValue, this._cachedMeta.index);
    }
    range.min = Math.min(range.min, value);
    range.max = Math.max(range.max, value);
  }
  getMinMax(scale, canStack) {
    const meta = this._cachedMeta;
    const _parsed = meta._parsed;
    const sorted = meta._sorted && scale === meta.iScale;
    const ilen = _parsed.length;
    const otherScale = this._getOtherScale(scale);
    const stack = createStack(canStack, meta, this.chart);
    const range = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    };
    const { min: otherMin, max: otherMax } = getUserBounds(otherScale);
    let i2, parsed;
    function _skip() {
      parsed = _parsed[i2];
      const otherValue = parsed[otherScale.axis];
      return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
    }
    for (i2 = 0; i2 < ilen; ++i2) {
      if (_skip()) {
        continue;
      }
      this.updateRangeFromParsed(range, scale, parsed, stack);
      if (sorted) {
        break;
      }
    }
    if (sorted) {
      for (i2 = ilen - 1; i2 >= 0; --i2) {
        if (_skip()) {
          continue;
        }
        this.updateRangeFromParsed(range, scale, parsed, stack);
        break;
      }
    }
    return range;
  }
  getAllParsedValues(scale) {
    const parsed = this._cachedMeta._parsed;
    const values = [];
    let i2, ilen, value;
    for (i2 = 0, ilen = parsed.length; i2 < ilen; ++i2) {
      value = parsed[i2][scale.axis];
      if (isNumberFinite(value)) {
        values.push(value);
      }
    }
    return values;
  }
  getMaxOverflow() {
    return false;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const parsed = this.getParsed(index2);
    return {
      label: iScale ? "" + iScale.getLabelForValue(parsed[iScale.axis]) : "",
      value: vScale ? "" + vScale.getLabelForValue(parsed[vScale.axis]) : ""
    };
  }
  _update(mode) {
    const meta = this._cachedMeta;
    this.update(mode || "default");
    meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
  }
  update(mode) {
  }
  draw() {
    const ctx = this._ctx;
    const chart = this.chart;
    const meta = this._cachedMeta;
    const elements2 = meta.data || [];
    const area = chart.chartArea;
    const active = [];
    const start = this._drawStart || 0;
    const count = this._drawCount || elements2.length - start;
    const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
    let i2;
    if (meta.dataset) {
      meta.dataset.draw(ctx, area, start, count);
    }
    for (i2 = start; i2 < start + count; ++i2) {
      const element = elements2[i2];
      if (element.hidden) {
        continue;
      }
      if (element.active && drawActiveElementsOnTop) {
        active.push(element);
      } else {
        element.draw(ctx, area);
      }
    }
    for (i2 = 0; i2 < active.length; ++i2) {
      active[i2].draw(ctx, area);
    }
  }
  getStyle(index2, active) {
    const mode = active ? "active" : "default";
    return index2 === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index2 || 0, mode);
  }
  getContext(index2, active, mode) {
    const dataset = this.getDataset();
    let context;
    if (index2 >= 0 && index2 < this._cachedMeta.data.length) {
      const element = this._cachedMeta.data[index2];
      context = element.$context || (element.$context = createDataContext(this.getContext(), index2, element));
      context.parsed = this.getParsed(index2);
      context.raw = dataset.data[index2];
      context.index = context.dataIndex = index2;
    } else {
      context = this.$context || (this.$context = createDatasetContext(this.chart.getContext(), this.index));
      context.dataset = dataset;
      context.index = context.datasetIndex = this.index;
    }
    context.active = !!active;
    context.mode = mode;
    return context;
  }
  resolveDatasetElementOptions(mode) {
    return this._resolveElementOptions(this.datasetElementType.id, mode);
  }
  resolveDataElementOptions(index2, mode) {
    return this._resolveElementOptions(this.dataElementType.id, mode, index2);
  }
  _resolveElementOptions(elementType, mode = "default", index2) {
    const active = mode === "active";
    const cache = this._cachedDataOpts;
    const cacheKey = elementType + "-" + mode;
    const cached = cache[cacheKey];
    const sharing = this.enableOptionSharing && defined(index2);
    if (cached) {
      return cloneIfNotShared(cached, sharing);
    }
    const config = this.chart.config;
    const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
    const prefixes = active ? [
      `${elementType}Hover`,
      "hover",
      elementType,
      ""
    ] : [
      elementType,
      ""
    ];
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
    const names2 = Object.keys(defaults.elements[elementType]);
    const context = () => this.getContext(index2, active, mode);
    const values = config.resolveNamedOptions(scopes, names2, context, prefixes);
    if (values.$shared) {
      values.$shared = sharing;
      cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
    }
    return values;
  }
  _resolveAnimations(index2, transition, active) {
    const chart = this.chart;
    const cache = this._cachedDataOpts;
    const cacheKey = `animation-${transition}`;
    const cached = cache[cacheKey];
    if (cached) {
      return cached;
    }
    let options;
    if (chart.options.animation !== false) {
      const config = this.chart.config;
      const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
      const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
      options = config.createResolver(scopes, this.getContext(index2, active, transition));
    }
    const animations = new Animations(chart, options && options.animations);
    if (options && options._cacheable) {
      cache[cacheKey] = Object.freeze(animations);
    }
    return animations;
  }
  getSharedOptions(options) {
    if (!options.$shared) {
      return;
    }
    return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
  }
  includeOptions(mode, sharedOptions) {
    return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
  }
  _getSharedOptions(start, mode) {
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const previouslySharedOptions = this._sharedOptions;
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
    return {
      sharedOptions,
      includeOptions
    };
  }
  updateElement(element, index2, properties, mode) {
    if (isDirectUpdateMode(mode)) {
      Object.assign(element, properties);
    } else {
      this._resolveAnimations(index2, mode).update(element, properties);
    }
  }
  updateSharedOptions(sharedOptions, mode, newOptions) {
    if (sharedOptions && !isDirectUpdateMode(mode)) {
      this._resolveAnimations(void 0, mode).update(sharedOptions, newOptions);
    }
  }
  _setStyle(element, index2, mode, active) {
    element.active = active;
    const options = this.getStyle(index2, active);
    this._resolveAnimations(index2, mode, active).update(element, {
      options: !active && this.getSharedOptions(options) || options
    });
  }
  removeHoverStyle(element, datasetIndex, index2) {
    this._setStyle(element, index2, "active", false);
  }
  setHoverStyle(element, datasetIndex, index2) {
    this._setStyle(element, index2, "active", true);
  }
  _removeDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;
    if (element) {
      this._setStyle(element, void 0, "active", false);
    }
  }
  _setDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;
    if (element) {
      this._setStyle(element, void 0, "active", true);
    }
  }
  _resyncElements(resetNewElements) {
    const data = this._data;
    const elements2 = this._cachedMeta.data;
    for (const [method, arg1, arg2] of this._syncList) {
      this[method](arg1, arg2);
    }
    this._syncList = [];
    const numMeta = elements2.length;
    const numData = data.length;
    const count = Math.min(numData, numMeta);
    if (count) {
      this.parse(0, count);
    }
    if (numData > numMeta) {
      this._insertElements(numMeta, numData - numMeta, resetNewElements);
    } else if (numData < numMeta) {
      this._removeElements(numData, numMeta - numData);
    }
  }
  _insertElements(start, count, resetNewElements = true) {
    const meta = this._cachedMeta;
    const data = meta.data;
    const end = start + count;
    let i2;
    const move = (arr) => {
      arr.length += count;
      for (i2 = arr.length - 1; i2 >= end; i2--) {
        arr[i2] = arr[i2 - count];
      }
    };
    move(data);
    for (i2 = start; i2 < end; ++i2) {
      data[i2] = new this.dataElementType();
    }
    if (this._parsing) {
      move(meta._parsed);
    }
    this.parse(start, count);
    if (resetNewElements) {
      this.updateElements(data, start, count, "reset");
    }
  }
  updateElements(element, start, count, mode) {
  }
  _removeElements(start, count) {
    const meta = this._cachedMeta;
    if (this._parsing) {
      const removed = meta._parsed.splice(start, count);
      if (meta._stacked) {
        clearStacks(meta, removed);
      }
    }
    meta.data.splice(start, count);
  }
  _sync(args) {
    if (this._parsing) {
      this._syncList.push(args);
    } else {
      const [method, arg1, arg2] = args;
      this[method](arg1, arg2);
    }
    this.chart._dataChanges.push([
      this.index,
      ...args
    ]);
  }
  _onDataPush() {
    const count = arguments.length;
    this._sync([
      "_insertElements",
      this.getDataset().data.length - count,
      count
    ]);
  }
  _onDataPop() {
    this._sync([
      "_removeElements",
      this._cachedMeta.data.length - 1,
      1
    ]);
  }
  _onDataShift() {
    this._sync([
      "_removeElements",
      0,
      1
    ]);
  }
  _onDataSplice(start, count) {
    if (count) {
      this._sync([
        "_removeElements",
        start,
        count
      ]);
    }
    const newCount = arguments.length - 2;
    if (newCount) {
      this._sync([
        "_insertElements",
        start,
        newCount
      ]);
    }
  }
  _onDataUnshift() {
    this._sync([
      "_insertElements",
      0,
      arguments.length
    ]);
  }
};
function getAllScaleValues(scale, type) {
  if (!scale._cache.$bar) {
    const visibleMetas = scale.getMatchingVisibleMetas(type);
    let values = [];
    for (let i2 = 0, ilen = visibleMetas.length; i2 < ilen; i2++) {
      values = values.concat(visibleMetas[i2].controller.getAllParsedValues(scale));
    }
    scale._cache.$bar = _arrayUnique(values.sort((a2, b2) => a2 - b2));
  }
  return scale._cache.$bar;
}
function computeMinSampleSize(meta) {
  const scale = meta.iScale;
  const values = getAllScaleValues(scale, meta.type);
  let min = scale._length;
  let i2, ilen, curr, prev;
  const updateMinAndPrev = () => {
    if (curr === 32767 || curr === -32768) {
      return;
    }
    if (defined(prev)) {
      min = Math.min(min, Math.abs(curr - prev) || min);
    }
    prev = curr;
  };
  for (i2 = 0, ilen = values.length; i2 < ilen; ++i2) {
    curr = scale.getPixelForValue(values[i2]);
    updateMinAndPrev();
  }
  prev = void 0;
  for (i2 = 0, ilen = scale.ticks.length; i2 < ilen; ++i2) {
    curr = scale.getPixelForTick(i2);
    updateMinAndPrev();
  }
  return min;
}
function computeFitCategoryTraits(index2, ruler, options, stackCount) {
  const thickness = options.barThickness;
  let size, ratio;
  if (isNullOrUndef(thickness)) {
    size = ruler.min * options.categoryPercentage;
    ratio = options.barPercentage;
  } else {
    size = thickness * stackCount;
    ratio = 1;
  }
  return {
    chunk: size / stackCount,
    ratio,
    start: ruler.pixels[index2] - size / 2
  };
}
function computeFlexCategoryTraits(index2, ruler, options, stackCount) {
  const pixels = ruler.pixels;
  const curr = pixels[index2];
  let prev = index2 > 0 ? pixels[index2 - 1] : null;
  let next = index2 < pixels.length - 1 ? pixels[index2 + 1] : null;
  const percent = options.categoryPercentage;
  if (prev === null) {
    prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
  }
  if (next === null) {
    next = curr + curr - prev;
  }
  const start = curr - (curr - Math.min(prev, next)) / 2 * percent;
  const size = Math.abs(next - prev) / 2 * percent;
  return {
    chunk: size / stackCount,
    ratio: options.barPercentage,
    start
  };
}
function parseFloatBar(entry, item, vScale, i2) {
  const startValue = vScale.parse(entry[0], i2);
  const endValue = vScale.parse(entry[1], i2);
  const min = Math.min(startValue, endValue);
  const max = Math.max(startValue, endValue);
  let barStart = min;
  let barEnd = max;
  if (Math.abs(min) > Math.abs(max)) {
    barStart = max;
    barEnd = min;
  }
  item[vScale.axis] = barEnd;
  item._custom = {
    barStart,
    barEnd,
    start: startValue,
    end: endValue,
    min,
    max
  };
}
function parseValue(entry, item, vScale, i2) {
  if (isArray(entry)) {
    parseFloatBar(entry, item, vScale, i2);
  } else {
    item[vScale.axis] = vScale.parse(entry, i2);
  }
  return item;
}
function parseArrayOrPrimitive(meta, data, start, count) {
  const iScale = meta.iScale;
  const vScale = meta.vScale;
  const labels = iScale.getLabels();
  const singleScale = iScale === vScale;
  const parsed = [];
  let i2, ilen, item, entry;
  for (i2 = start, ilen = start + count; i2 < ilen; ++i2) {
    entry = data[i2];
    item = {};
    item[iScale.axis] = singleScale || iScale.parse(labels[i2], i2);
    parsed.push(parseValue(entry, item, vScale, i2));
  }
  return parsed;
}
function isFloatBar(custom) {
  return custom && custom.barStart !== void 0 && custom.barEnd !== void 0;
}
function barSign(size, vScale, actualBase) {
  if (size !== 0) {
    return sign(size);
  }
  return (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
}
function borderProps(properties) {
  let reverse, start, end, top, bottom;
  if (properties.horizontal) {
    reverse = properties.base > properties.x;
    start = "left";
    end = "right";
  } else {
    reverse = properties.base < properties.y;
    start = "bottom";
    end = "top";
  }
  if (reverse) {
    top = "end";
    bottom = "start";
  } else {
    top = "start";
    bottom = "end";
  }
  return {
    start,
    end,
    reverse,
    top,
    bottom
  };
}
function setBorderSkipped(properties, options, stack, index2) {
  let edge = options.borderSkipped;
  const res = {};
  if (!edge) {
    properties.borderSkipped = res;
    return;
  }
  if (edge === true) {
    properties.borderSkipped = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
    return;
  }
  const { start, end, reverse, top, bottom } = borderProps(properties);
  if (edge === "middle" && stack) {
    properties.enableBorderRadius = true;
    if ((stack._top || 0) === index2) {
      edge = top;
    } else if ((stack._bottom || 0) === index2) {
      edge = bottom;
    } else {
      res[parseEdge(bottom, start, end, reverse)] = true;
      edge = top;
    }
  }
  res[parseEdge(edge, start, end, reverse)] = true;
  properties.borderSkipped = res;
}
function parseEdge(edge, a2, b2, reverse) {
  if (reverse) {
    edge = swap(edge, a2, b2);
    edge = startEnd(edge, b2, a2);
  } else {
    edge = startEnd(edge, a2, b2);
  }
  return edge;
}
function swap(orig, v1, v2) {
  return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}
function startEnd(v2, start, end) {
  return v2 === "start" ? start : v2 === "end" ? end : v2;
}
function setInflateAmount(properties, { inflateAmount }, ratio) {
  properties.inflateAmount = inflateAmount === "auto" ? ratio === 1 ? 0.33 : 0 : inflateAmount;
}
var BarController = class extends DatasetController {
  static id = "bar";
  static defaults = {
    datasetElementType: false,
    dataElementType: "bar",
    categoryPercentage: 0.8,
    barPercentage: 0.9,
    grouped: true,
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "base",
          "width",
          "height"
        ]
      }
    }
  };
  static overrides = {
    scales: {
      _index_: {
        type: "category",
        offset: true,
        grid: {
          offset: true
        }
      },
      _value_: {
        type: "linear",
        beginAtZero: true
      }
    }
  };
  parsePrimitiveData(meta, data, start, count) {
    return parseArrayOrPrimitive(meta, data, start, count);
  }
  parseArrayData(meta, data, start, count) {
    return parseArrayOrPrimitive(meta, data, start, count);
  }
  parseObjectData(meta, data, start, count) {
    const { iScale, vScale } = meta;
    const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
    const iAxisKey = iScale.axis === "x" ? xAxisKey : yAxisKey;
    const vAxisKey = vScale.axis === "x" ? xAxisKey : yAxisKey;
    const parsed = [];
    let i2, ilen, item, obj;
    for (i2 = start, ilen = start + count; i2 < ilen; ++i2) {
      obj = data[i2];
      item = {};
      item[iScale.axis] = iScale.parse(resolveObjectKey(obj, iAxisKey), i2);
      parsed.push(parseValue(resolveObjectKey(obj, vAxisKey), item, vScale, i2));
    }
    return parsed;
  }
  updateRangeFromParsed(range, scale, parsed, stack) {
    super.updateRangeFromParsed(range, scale, parsed, stack);
    const custom = parsed._custom;
    if (custom && scale === this._cachedMeta.vScale) {
      range.min = Math.min(range.min, custom.min);
      range.max = Math.max(range.max, custom.max);
    }
  }
  getMaxOverflow() {
    return 0;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const { iScale, vScale } = meta;
    const parsed = this.getParsed(index2);
    const custom = parsed._custom;
    const value = isFloatBar(custom) ? "[" + custom.start + ", " + custom.end + "]" : "" + vScale.getLabelForValue(parsed[vScale.axis]);
    return {
      label: "" + iScale.getLabelForValue(parsed[iScale.axis]),
      value
    };
  }
  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
    const meta = this._cachedMeta;
    meta.stack = this.getDataset().stack;
  }
  update(mode) {
    const meta = this._cachedMeta;
    this.updateElements(meta.data, 0, meta.data.length, mode);
  }
  updateElements(bars, start, count, mode) {
    const reset = mode === "reset";
    const { index: index2, _cachedMeta: { vScale } } = this;
    const base = vScale.getBasePixel();
    const horizontal = vScale.isHorizontal();
    const ruler = this._getRuler();
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    for (let i2 = start; i2 < start + count; i2++) {
      const parsed = this.getParsed(i2);
      const vpixels = reset || isNullOrUndef(parsed[vScale.axis]) ? {
        base,
        head: base
      } : this._calculateBarValuePixels(i2);
      const ipixels = this._calculateBarIndexPixels(i2, ruler);
      const stack = (parsed._stacks || {})[vScale.axis];
      const properties = {
        horizontal,
        base: vpixels.base,
        enableBorderRadius: !stack || isFloatBar(parsed._custom) || index2 === stack._top || index2 === stack._bottom,
        x: horizontal ? vpixels.head : ipixels.center,
        y: horizontal ? ipixels.center : vpixels.head,
        height: horizontal ? ipixels.size : Math.abs(vpixels.size),
        width: horizontal ? Math.abs(vpixels.size) : ipixels.size
      };
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i2, bars[i2].active ? "active" : mode);
      }
      const options = properties.options || bars[i2].options;
      setBorderSkipped(properties, options, stack, index2);
      setInflateAmount(properties, options, ruler.ratio);
      this.updateElement(bars[i2], i2, properties, mode);
    }
  }
  _getStacks(last, dataIndex) {
    const { iScale } = this._cachedMeta;
    const metasets = iScale.getMatchingVisibleMetas(this._type).filter((meta) => meta.controller.options.grouped);
    const stacked = iScale.options.stacked;
    const stacks = [];
    const currentParsed = this._cachedMeta.controller.getParsed(dataIndex);
    const iScaleValue = currentParsed && currentParsed[iScale.axis];
    const skipNull = (meta) => {
      const parsed = meta._parsed.find((item) => item[iScale.axis] === iScaleValue);
      const val = parsed && parsed[meta.vScale.axis];
      if (isNullOrUndef(val) || isNaN(val)) {
        return true;
      }
    };
    for (const meta of metasets) {
      if (dataIndex !== void 0 && skipNull(meta)) {
        continue;
      }
      if (stacked === false || stacks.indexOf(meta.stack) === -1 || stacked === void 0 && meta.stack === void 0) {
        stacks.push(meta.stack);
      }
      if (meta.index === last) {
        break;
      }
    }
    if (!stacks.length) {
      stacks.push(void 0);
    }
    return stacks;
  }
  _getStackCount(index2) {
    return this._getStacks(void 0, index2).length;
  }
  _getAxisCount() {
    return this._getAxis().length;
  }
  getFirstScaleIdForIndexAxis() {
    const scales2 = this.chart.scales;
    const indexScaleId = this.chart.options.indexAxis;
    return Object.keys(scales2).filter((key) => scales2[key].axis === indexScaleId).shift();
  }
  _getAxis() {
    const axis = {};
    const firstScaleAxisId = this.getFirstScaleIdForIndexAxis();
    for (const dataset of this.chart.data.datasets) {
      axis[valueOrDefault(this.chart.options.indexAxis === "x" ? dataset.xAxisID : dataset.yAxisID, firstScaleAxisId)] = true;
    }
    return Object.keys(axis);
  }
  _getStackIndex(datasetIndex, name, dataIndex) {
    const stacks = this._getStacks(datasetIndex, dataIndex);
    const index2 = name !== void 0 ? stacks.indexOf(name) : -1;
    return index2 === -1 ? stacks.length - 1 : index2;
  }
  _getRuler() {
    const opts = this.options;
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const pixels = [];
    let i2, ilen;
    for (i2 = 0, ilen = meta.data.length; i2 < ilen; ++i2) {
      pixels.push(iScale.getPixelForValue(this.getParsed(i2)[iScale.axis], i2));
    }
    const barThickness = opts.barThickness;
    const min = barThickness || computeMinSampleSize(meta);
    return {
      min,
      pixels,
      start: iScale._startPixel,
      end: iScale._endPixel,
      stackCount: this._getStackCount(),
      scale: iScale,
      grouped: opts.grouped,
      ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
    };
  }
  _calculateBarValuePixels(index2) {
    const { _cachedMeta: { vScale, _stacked, index: datasetIndex }, options: { base: baseValue, minBarLength } } = this;
    const actualBase = baseValue || 0;
    const parsed = this.getParsed(index2);
    const custom = parsed._custom;
    const floating = isFloatBar(custom);
    let value = parsed[vScale.axis];
    let start = 0;
    let length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
    let head, size;
    if (length !== value) {
      start = length - value;
      length = value;
    }
    if (floating) {
      value = custom.barStart;
      length = custom.barEnd - custom.barStart;
      if (value !== 0 && sign(value) !== sign(custom.barEnd)) {
        start = 0;
      }
      start += value;
    }
    const startValue = !isNullOrUndef(baseValue) && !floating ? baseValue : start;
    let base = vScale.getPixelForValue(startValue);
    if (this.chart.getDataVisibility(index2)) {
      head = vScale.getPixelForValue(start + length);
    } else {
      head = base;
    }
    size = head - base;
    if (Math.abs(size) < minBarLength) {
      size = barSign(size, vScale, actualBase) * minBarLength;
      if (value === actualBase) {
        base -= size / 2;
      }
      const startPixel = vScale.getPixelForDecimal(0);
      const endPixel = vScale.getPixelForDecimal(1);
      const min = Math.min(startPixel, endPixel);
      const max = Math.max(startPixel, endPixel);
      base = Math.max(Math.min(base, max), min);
      head = base + size;
      if (_stacked && !floating) {
        parsed._stacks[vScale.axis]._visualValues[datasetIndex] = vScale.getValueForPixel(head) - vScale.getValueForPixel(base);
      }
    }
    if (base === vScale.getPixelForValue(actualBase)) {
      const halfGrid = sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
      base += halfGrid;
      size -= halfGrid;
    }
    return {
      size,
      base,
      head,
      center: head + size / 2
    };
  }
  _calculateBarIndexPixels(index2, ruler) {
    const scale = ruler.scale;
    const options = this.options;
    const skipNull = options.skipNull;
    const maxBarThickness = valueOrDefault(options.maxBarThickness, Infinity);
    let center, size;
    const axisCount = this._getAxisCount();
    if (ruler.grouped) {
      const stackCount = skipNull ? this._getStackCount(index2) : ruler.stackCount;
      const range = options.barThickness === "flex" ? computeFlexCategoryTraits(index2, ruler, options, stackCount * axisCount) : computeFitCategoryTraits(index2, ruler, options, stackCount * axisCount);
      const axisID = this.chart.options.indexAxis === "x" ? this.getDataset().xAxisID : this.getDataset().yAxisID;
      const axisNumber = this._getAxis().indexOf(valueOrDefault(axisID, this.getFirstScaleIdForIndexAxis()));
      const stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index2 : void 0) + axisNumber;
      center = range.start + range.chunk * stackIndex + range.chunk / 2;
      size = Math.min(maxBarThickness, range.chunk * range.ratio);
    } else {
      center = scale.getPixelForValue(this.getParsed(index2)[scale.axis], index2);
      size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
    }
    return {
      base: center - size / 2,
      head: center + size / 2,
      center,
      size
    };
  }
  draw() {
    const meta = this._cachedMeta;
    const vScale = meta.vScale;
    const rects = meta.data;
    const ilen = rects.length;
    let i2 = 0;
    for (; i2 < ilen; ++i2) {
      if (this.getParsed(i2)[vScale.axis] !== null && !rects[i2].hidden) {
        rects[i2].draw(this._ctx);
      }
    }
  }
};
var BubbleController = class extends DatasetController {
  static id = "bubble";
  static defaults = {
    datasetElementType: false,
    dataElementType: "point",
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "borderWidth",
          "radius"
        ]
      }
    }
  };
  static overrides = {
    scales: {
      x: {
        type: "linear"
      },
      y: {
        type: "linear"
      }
    }
  };
  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
  }
  parsePrimitiveData(meta, data, start, count) {
    const parsed = super.parsePrimitiveData(meta, data, start, count);
    for (let i2 = 0; i2 < parsed.length; i2++) {
      parsed[i2]._custom = this.resolveDataElementOptions(i2 + start).radius;
    }
    return parsed;
  }
  parseArrayData(meta, data, start, count) {
    const parsed = super.parseArrayData(meta, data, start, count);
    for (let i2 = 0; i2 < parsed.length; i2++) {
      const item = data[start + i2];
      parsed[i2]._custom = valueOrDefault(item[2], this.resolveDataElementOptions(i2 + start).radius);
    }
    return parsed;
  }
  parseObjectData(meta, data, start, count) {
    const parsed = super.parseObjectData(meta, data, start, count);
    for (let i2 = 0; i2 < parsed.length; i2++) {
      const item = data[start + i2];
      parsed[i2]._custom = valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i2 + start).radius);
    }
    return parsed;
  }
  getMaxOverflow() {
    const data = this._cachedMeta.data;
    let max = 0;
    for (let i2 = data.length - 1; i2 >= 0; --i2) {
      max = Math.max(max, data[i2].size(this.resolveDataElementOptions(i2)) / 2);
    }
    return max > 0 && max;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const labels = this.chart.data.labels || [];
    const { xScale, yScale } = meta;
    const parsed = this.getParsed(index2);
    const x2 = xScale.getLabelForValue(parsed.x);
    const y2 = yScale.getLabelForValue(parsed.y);
    const r2 = parsed._custom;
    return {
      label: labels[index2] || "",
      value: "(" + x2 + ", " + y2 + (r2 ? ", " + r2 : "") + ")"
    };
  }
  update(mode) {
    const points = this._cachedMeta.data;
    this.updateElements(points, 0, points.length, mode);
  }
  updateElements(points, start, count, mode) {
    const reset = mode === "reset";
    const { iScale, vScale } = this._cachedMeta;
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    for (let i2 = start; i2 < start + count; i2++) {
      const point = points[i2];
      const parsed = !reset && this.getParsed(i2);
      const properties = {};
      const iPixel = properties[iAxis] = reset ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]);
      const vPixel = properties[vAxis] = reset ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
      properties.skip = isNaN(iPixel) || isNaN(vPixel);
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i2, point.active ? "active" : mode);
        if (reset) {
          properties.options.radius = 0;
        }
      }
      this.updateElement(point, i2, properties, mode);
    }
  }
  resolveDataElementOptions(index2, mode) {
    const parsed = this.getParsed(index2);
    let values = super.resolveDataElementOptions(index2, mode);
    if (values.$shared) {
      values = Object.assign({}, values, {
        $shared: false
      });
    }
    const radius = values.radius;
    if (mode !== "active") {
      values.radius = 0;
    }
    values.radius += valueOrDefault(parsed && parsed._custom, radius);
    return values;
  }
};
function getRatioAndOffset(rotation, circumference, cutout) {
  let ratioX = 1;
  let ratioY = 1;
  let offsetX = 0;
  let offsetY = 0;
  if (circumference < TAU) {
    const startAngle = rotation;
    const endAngle = startAngle + circumference;
    const startX = Math.cos(startAngle);
    const startY = Math.sin(startAngle);
    const endX = Math.cos(endAngle);
    const endY = Math.sin(endAngle);
    const calcMax = (angle, a2, b2) => _angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a2, a2 * cutout, b2, b2 * cutout);
    const calcMin = (angle, a2, b2) => _angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a2, a2 * cutout, b2, b2 * cutout);
    const maxX = calcMax(0, startX, endX);
    const maxY = calcMax(HALF_PI, startY, endY);
    const minX = calcMin(PI, startX, endX);
    const minY = calcMin(PI + HALF_PI, startY, endY);
    ratioX = (maxX - minX) / 2;
    ratioY = (maxY - minY) / 2;
    offsetX = -(maxX + minX) / 2;
    offsetY = -(maxY + minY) / 2;
  }
  return {
    ratioX,
    ratioY,
    offsetX,
    offsetY
  };
}
var DoughnutController = class extends DatasetController {
  static id = "doughnut";
  static defaults = {
    datasetElementType: false,
    dataElementType: "arc",
    animation: {
      animateRotate: true,
      animateScale: false
    },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "circumference",
          "endAngle",
          "innerRadius",
          "outerRadius",
          "startAngle",
          "x",
          "y",
          "offset",
          "borderWidth",
          "spacing"
        ]
      }
    },
    cutout: "50%",
    rotation: 0,
    circumference: 360,
    radius: "100%",
    spacing: 0,
    indexAxis: "r"
  };
  static descriptors = {
    _scriptable: (name) => name !== "spacing",
    _indexable: (name) => name !== "spacing" && !name.startsWith("borderDash") && !name.startsWith("hoverBorderDash")
  };
  static overrides = {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(chart) {
            const data = chart.data;
            const { labels: { pointStyle, textAlign, color: color2, useBorderRadius, borderRadius } } = chart.legend.options;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i2) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i2);
                return {
                  text: label,
                  fillStyle: style.backgroundColor,
                  fontColor: color2,
                  hidden: !chart.getDataVisibility(i2),
                  lineDash: style.borderDash,
                  lineDashOffset: style.borderDashOffset,
                  lineJoin: style.borderJoinStyle,
                  lineWidth: style.borderWidth,
                  strokeStyle: style.borderColor,
                  textAlign,
                  pointStyle,
                  borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
                  index: i2
                };
              });
            }
            return [];
          }
        },
        onClick(e2, legendItem, legend) {
          legend.chart.toggleDataVisibility(legendItem.index);
          legend.chart.update();
        }
      }
    }
  };
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.enableOptionSharing = true;
    this.innerRadius = void 0;
    this.outerRadius = void 0;
    this.offsetX = void 0;
    this.offsetY = void 0;
  }
  linkScales() {
  }
  parse(start, count) {
    const data = this.getDataset().data;
    const meta = this._cachedMeta;
    if (this._parsing === false) {
      meta._parsed = data;
    } else {
      let getter = (i3) => +data[i3];
      if (isObject(data[start])) {
        const { key = "value" } = this._parsing;
        getter = (i3) => +resolveObjectKey(data[i3], key);
      }
      let i2, ilen;
      for (i2 = start, ilen = start + count; i2 < ilen; ++i2) {
        meta._parsed[i2] = getter(i2);
      }
    }
  }
  _getRotation() {
    return toRadians(this.options.rotation - 90);
  }
  _getCircumference() {
    return toRadians(this.options.circumference);
  }
  _getRotationExtents() {
    let min = TAU;
    let max = -TAU;
    for (let i2 = 0; i2 < this.chart.data.datasets.length; ++i2) {
      if (this.chart.isDatasetVisible(i2) && this.chart.getDatasetMeta(i2).type === this._type) {
        const controller = this.chart.getDatasetMeta(i2).controller;
        const rotation = controller._getRotation();
        const circumference = controller._getCircumference();
        min = Math.min(min, rotation);
        max = Math.max(max, rotation + circumference);
      }
    }
    return {
      rotation: min,
      circumference: max - min
    };
  }
  update(mode) {
    const chart = this.chart;
    const { chartArea } = chart;
    const meta = this._cachedMeta;
    const arcs = meta.data;
    const spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing;
    const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
    const cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
    const chartWeight = this._getRingWeight(this.index);
    const { circumference, rotation } = this._getRotationExtents();
    const { ratioX, ratioY, offsetX, offsetY } = getRatioAndOffset(rotation, circumference, cutout);
    const maxWidth = (chartArea.width - spacing) / ratioX;
    const maxHeight = (chartArea.height - spacing) / ratioY;
    const maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
    const outerRadius = toDimension(this.options.radius, maxRadius);
    const innerRadius = Math.max(outerRadius * cutout, 0);
    const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
    this.offsetX = offsetX * outerRadius;
    this.offsetY = offsetY * outerRadius;
    meta.total = this.calculateTotal();
    this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
    this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
    this.updateElements(arcs, 0, arcs.length, mode);
  }
  _circumference(i2, reset) {
    const opts = this.options;
    const meta = this._cachedMeta;
    const circumference = this._getCircumference();
    if (reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i2) || meta._parsed[i2] === null || meta.data[i2].hidden) {
      return 0;
    }
    return this.calculateCircumference(meta._parsed[i2] * circumference / TAU);
  }
  updateElements(arcs, start, count, mode) {
    const reset = mode === "reset";
    const chart = this.chart;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const animationOpts = opts.animation;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const animateScale = reset && animationOpts.animateScale;
    const innerRadius = animateScale ? 0 : this.innerRadius;
    const outerRadius = animateScale ? 0 : this.outerRadius;
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    let startAngle = this._getRotation();
    let i2;
    for (i2 = 0; i2 < start; ++i2) {
      startAngle += this._circumference(i2, reset);
    }
    for (i2 = start; i2 < start + count; ++i2) {
      const circumference = this._circumference(i2, reset);
      const arc = arcs[i2];
      const properties = {
        x: centerX + this.offsetX,
        y: centerY + this.offsetY,
        startAngle,
        endAngle: startAngle + circumference,
        circumference,
        outerRadius,
        innerRadius
      };
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i2, arc.active ? "active" : mode);
      }
      startAngle += circumference;
      this.updateElement(arc, i2, properties, mode);
    }
  }
  calculateTotal() {
    const meta = this._cachedMeta;
    const metaData = meta.data;
    let total = 0;
    let i2;
    for (i2 = 0; i2 < metaData.length; i2++) {
      const value = meta._parsed[i2];
      if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i2) && !metaData[i2].hidden) {
        total += Math.abs(value);
      }
    }
    return total;
  }
  calculateCircumference(value) {
    const total = this._cachedMeta.total;
    if (total > 0 && !isNaN(value)) {
      return TAU * (Math.abs(value) / total);
    }
    return 0;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const chart = this.chart;
    const labels = chart.data.labels || [];
    const value = formatNumber(meta._parsed[index2], chart.options.locale);
    return {
      label: labels[index2] || "",
      value
    };
  }
  getMaxBorderWidth(arcs) {
    let max = 0;
    const chart = this.chart;
    let i2, ilen, meta, controller, options;
    if (!arcs) {
      for (i2 = 0, ilen = chart.data.datasets.length; i2 < ilen; ++i2) {
        if (chart.isDatasetVisible(i2)) {
          meta = chart.getDatasetMeta(i2);
          arcs = meta.data;
          controller = meta.controller;
          break;
        }
      }
    }
    if (!arcs) {
      return 0;
    }
    for (i2 = 0, ilen = arcs.length; i2 < ilen; ++i2) {
      options = controller.resolveDataElementOptions(i2);
      if (options.borderAlign !== "inner") {
        max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
      }
    }
    return max;
  }
  getMaxOffset(arcs) {
    let max = 0;
    for (let i2 = 0, ilen = arcs.length; i2 < ilen; ++i2) {
      const options = this.resolveDataElementOptions(i2);
      max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
    }
    return max;
  }
  _getRingWeightOffset(datasetIndex) {
    let ringWeightOffset = 0;
    for (let i2 = 0; i2 < datasetIndex; ++i2) {
      if (this.chart.isDatasetVisible(i2)) {
        ringWeightOffset += this._getRingWeight(i2);
      }
    }
    return ringWeightOffset;
  }
  _getRingWeight(datasetIndex) {
    return Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
  }
  _getVisibleDatasetWeightTotal() {
    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
  }
};
var LineController = class extends DatasetController {
  static id = "line";
  static defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    showLine: true,
    spanGaps: false
  };
  static overrides = {
    scales: {
      _index_: {
        type: "category"
      },
      _value_: {
        type: "linear"
      }
    }
  };
  initialize() {
    this.enableOptionSharing = true;
    this.supportsDecimation = true;
    super.initialize();
  }
  update(mode) {
    const meta = this._cachedMeta;
    const { dataset: line, data: points = [], _dataset } = meta;
    const animationsDisabled = this.chart._animationsDisabled;
    let { start, count } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
    this._drawStart = start;
    this._drawCount = count;
    if (_scaleRangesChanged(meta)) {
      start = 0;
      count = points.length;
    }
    line._chart = this.chart;
    line._datasetIndex = this.index;
    line._decimated = !!_dataset._decimated;
    line.points = points;
    const options = this.resolveDatasetElementOptions(mode);
    if (!this.options.showLine) {
      options.borderWidth = 0;
    }
    options.segment = this.options.segment;
    this.updateElement(line, void 0, {
      animated: !animationsDisabled,
      options
    }, mode);
    this.updateElements(points, start, count, mode);
  }
  updateElements(points, start, count, mode) {
    const reset = mode === "reset";
    const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const { spanGaps, segment } = this.options;
    const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
    const directUpdate = this.chart._animationsDisabled || reset || mode === "none";
    const end = start + count;
    const pointsCount = points.length;
    let prevParsed = start > 0 && this.getParsed(start - 1);
    for (let i2 = 0; i2 < pointsCount; ++i2) {
      const point = points[i2];
      const properties = directUpdate ? point : {};
      if (i2 < start || i2 >= end) {
        properties.skip = true;
        continue;
      }
      const parsed = this.getParsed(i2);
      const nullData = isNullOrUndef(parsed[vAxis]);
      const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i2);
      const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i2);
      properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
      properties.stop = i2 > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
      if (segment) {
        properties.parsed = parsed;
        properties.raw = _dataset.data[i2];
      }
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i2, point.active ? "active" : mode);
      }
      if (!directUpdate) {
        this.updateElement(point, i2, properties, mode);
      }
      prevParsed = parsed;
    }
  }
  getMaxOverflow() {
    const meta = this._cachedMeta;
    const dataset = meta.dataset;
    const border = dataset.options && dataset.options.borderWidth || 0;
    const data = meta.data || [];
    if (!data.length) {
      return border;
    }
    const firstPoint = data[0].size(this.resolveDataElementOptions(0));
    const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
    return Math.max(border, firstPoint, lastPoint) / 2;
  }
  draw() {
    const meta = this._cachedMeta;
    meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
    super.draw();
  }
};
var PolarAreaController = class extends DatasetController {
  static id = "polarArea";
  static defaults = {
    dataElementType: "arc",
    animation: {
      animateRotate: true,
      animateScale: true
    },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "startAngle",
          "endAngle",
          "innerRadius",
          "outerRadius"
        ]
      }
    },
    indexAxis: "r",
    startAngle: 0
  };
  static overrides = {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const { labels: { pointStyle, color: color2 } } = chart.legend.options;
              return data.labels.map((label, i2) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i2);
                return {
                  text: label,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  fontColor: color2,
                  lineWidth: style.borderWidth,
                  pointStyle,
                  hidden: !chart.getDataVisibility(i2),
                  index: i2
                };
              });
            }
            return [];
          }
        },
        onClick(e2, legendItem, legend) {
          legend.chart.toggleDataVisibility(legendItem.index);
          legend.chart.update();
        }
      }
    },
    scales: {
      r: {
        type: "radialLinear",
        angleLines: {
          display: false
        },
        beginAtZero: true,
        grid: {
          circular: true
        },
        pointLabels: {
          display: false
        },
        startAngle: 0
      }
    }
  };
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.innerRadius = void 0;
    this.outerRadius = void 0;
  }
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const chart = this.chart;
    const labels = chart.data.labels || [];
    const value = formatNumber(meta._parsed[index2].r, chart.options.locale);
    return {
      label: labels[index2] || "",
      value
    };
  }
  parseObjectData(meta, data, start, count) {
    return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
  }
  update(mode) {
    const arcs = this._cachedMeta.data;
    this._updateRadius();
    this.updateElements(arcs, 0, arcs.length, mode);
  }
  getMinMax() {
    const meta = this._cachedMeta;
    const range = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    };
    meta.data.forEach((element, index2) => {
      const parsed = this.getParsed(index2).r;
      if (!isNaN(parsed) && this.chart.getDataVisibility(index2)) {
        if (parsed < range.min) {
          range.min = parsed;
        }
        if (parsed > range.max) {
          range.max = parsed;
        }
      }
    });
    return range;
  }
  _updateRadius() {
    const chart = this.chart;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    const outerRadius = Math.max(minSize / 2, 0);
    const innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
    const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
    this.outerRadius = outerRadius - radiusLength * this.index;
    this.innerRadius = this.outerRadius - radiusLength;
  }
  updateElements(arcs, start, count, mode) {
    const reset = mode === "reset";
    const chart = this.chart;
    const opts = chart.options;
    const animationOpts = opts.animation;
    const scale = this._cachedMeta.rScale;
    const centerX = scale.xCenter;
    const centerY = scale.yCenter;
    const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI;
    let angle = datasetStartAngle;
    let i2;
    const defaultAngle = 360 / this.countVisibleElements();
    for (i2 = 0; i2 < start; ++i2) {
      angle += this._computeAngle(i2, mode, defaultAngle);
    }
    for (i2 = start; i2 < start + count; i2++) {
      const arc = arcs[i2];
      let startAngle = angle;
      let endAngle = angle + this._computeAngle(i2, mode, defaultAngle);
      let outerRadius = chart.getDataVisibility(i2) ? scale.getDistanceFromCenterForValue(this.getParsed(i2).r) : 0;
      angle = endAngle;
      if (reset) {
        if (animationOpts.animateScale) {
          outerRadius = 0;
        }
        if (animationOpts.animateRotate) {
          startAngle = endAngle = datasetStartAngle;
        }
      }
      const properties = {
        x: centerX,
        y: centerY,
        innerRadius: 0,
        outerRadius,
        startAngle,
        endAngle,
        options: this.resolveDataElementOptions(i2, arc.active ? "active" : mode)
      };
      this.updateElement(arc, i2, properties, mode);
    }
  }
  countVisibleElements() {
    const meta = this._cachedMeta;
    let count = 0;
    meta.data.forEach((element, index2) => {
      if (!isNaN(this.getParsed(index2).r) && this.chart.getDataVisibility(index2)) {
        count++;
      }
    });
    return count;
  }
  _computeAngle(index2, mode, defaultAngle) {
    return this.chart.getDataVisibility(index2) ? toRadians(this.resolveDataElementOptions(index2, mode).angle || defaultAngle) : 0;
  }
};
var PieController = class extends DoughnutController {
  static id = "pie";
  static defaults = {
    cutout: 0,
    rotation: 0,
    circumference: 360,
    radius: "100%"
  };
};
var RadarController = class extends DatasetController {
  static id = "radar";
  static defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    indexAxis: "r",
    showLine: true,
    elements: {
      line: {
        fill: "start"
      }
    }
  };
  static overrides = {
    aspectRatio: 1,
    scales: {
      r: {
        type: "radialLinear"
      }
    }
  };
  getLabelAndValue(index2) {
    const vScale = this._cachedMeta.vScale;
    const parsed = this.getParsed(index2);
    return {
      label: vScale.getLabels()[index2],
      value: "" + vScale.getLabelForValue(parsed[vScale.axis])
    };
  }
  parseObjectData(meta, data, start, count) {
    return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
  }
  update(mode) {
    const meta = this._cachedMeta;
    const line = meta.dataset;
    const points = meta.data || [];
    const labels = meta.iScale.getLabels();
    line.points = points;
    if (mode !== "resize") {
      const options = this.resolveDatasetElementOptions(mode);
      if (!this.options.showLine) {
        options.borderWidth = 0;
      }
      const properties = {
        _loop: true,
        _fullLoop: labels.length === points.length,
        options
      };
      this.updateElement(line, void 0, properties, mode);
    }
    this.updateElements(points, 0, points.length, mode);
  }
  updateElements(points, start, count, mode) {
    const scale = this._cachedMeta.rScale;
    const reset = mode === "reset";
    for (let i2 = start; i2 < start + count; i2++) {
      const point = points[i2];
      const options = this.resolveDataElementOptions(i2, point.active ? "active" : mode);
      const pointPosition = scale.getPointPositionForValue(i2, this.getParsed(i2).r);
      const x2 = reset ? scale.xCenter : pointPosition.x;
      const y2 = reset ? scale.yCenter : pointPosition.y;
      const properties = {
        x: x2,
        y: y2,
        angle: pointPosition.angle,
        skip: isNaN(x2) || isNaN(y2),
        options
      };
      this.updateElement(point, i2, properties, mode);
    }
  }
};
var ScatterController = class extends DatasetController {
  static id = "scatter";
  static defaults = {
    datasetElementType: false,
    dataElementType: "point",
    showLine: false,
    fill: false
  };
  static overrides = {
    interaction: {
      mode: "point"
    },
    scales: {
      x: {
        type: "linear"
      },
      y: {
        type: "linear"
      }
    }
  };
  getLabelAndValue(index2) {
    const meta = this._cachedMeta;
    const labels = this.chart.data.labels || [];
    const { xScale, yScale } = meta;
    const parsed = this.getParsed(index2);
    const x2 = xScale.getLabelForValue(parsed.x);
    const y2 = yScale.getLabelForValue(parsed.y);
    return {
      label: labels[index2] || "",
      value: "(" + x2 + ", " + y2 + ")"
    };
  }
  update(mode) {
    const meta = this._cachedMeta;
    const { data: points = [] } = meta;
    const animationsDisabled = this.chart._animationsDisabled;
    let { start, count } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
    this._drawStart = start;
    this._drawCount = count;
    if (_scaleRangesChanged(meta)) {
      start = 0;
      count = points.length;
    }
    if (this.options.showLine) {
      if (!this.datasetElementType) {
        this.addElements();
      }
      const { dataset: line, _dataset } = meta;
      line._chart = this.chart;
      line._datasetIndex = this.index;
      line._decimated = !!_dataset._decimated;
      line.points = points;
      const options = this.resolveDatasetElementOptions(mode);
      options.segment = this.options.segment;
      this.updateElement(line, void 0, {
        animated: !animationsDisabled,
        options
      }, mode);
    } else if (this.datasetElementType) {
      delete meta.dataset;
      this.datasetElementType = false;
    }
    this.updateElements(points, start, count, mode);
  }
  addElements() {
    const { showLine } = this.options;
    if (!this.datasetElementType && showLine) {
      this.datasetElementType = this.chart.registry.getElement("line");
    }
    super.addElements();
  }
  updateElements(points, start, count, mode) {
    const reset = mode === "reset";
    const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions);
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const { spanGaps, segment } = this.options;
    const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
    const directUpdate = this.chart._animationsDisabled || reset || mode === "none";
    let prevParsed = start > 0 && this.getParsed(start - 1);
    for (let i2 = start; i2 < start + count; ++i2) {
      const point = points[i2];
      const parsed = this.getParsed(i2);
      const properties = directUpdate ? point : {};
      const nullData = isNullOrUndef(parsed[vAxis]);
      const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i2);
      const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i2);
      properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
      properties.stop = i2 > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
      if (segment) {
        properties.parsed = parsed;
        properties.raw = _dataset.data[i2];
      }
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i2, point.active ? "active" : mode);
      }
      if (!directUpdate) {
        this.updateElement(point, i2, properties, mode);
      }
      prevParsed = parsed;
    }
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
  }
  getMaxOverflow() {
    const meta = this._cachedMeta;
    const data = meta.data || [];
    if (!this.options.showLine) {
      let max = 0;
      for (let i2 = data.length - 1; i2 >= 0; --i2) {
        max = Math.max(max, data[i2].size(this.resolveDataElementOptions(i2)) / 2);
      }
      return max > 0 && max;
    }
    const dataset = meta.dataset;
    const border = dataset.options && dataset.options.borderWidth || 0;
    if (!data.length) {
      return border;
    }
    const firstPoint = data[0].size(this.resolveDataElementOptions(0));
    const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
    return Math.max(border, firstPoint, lastPoint) / 2;
  }
};
var controllers = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController
});
function abstract() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
var DateAdapterBase = class _DateAdapterBase {
  /**
  * Override default date adapter methods.
  * Accepts type parameter to define options type.
  * @example
  * Chart._adapters._date.override<{myAdapterOption: string}>({
  *   init() {
  *     console.log(this.options.myAdapterOption);
  *   }
  * })
  */
  static override(members) {
    Object.assign(_DateAdapterBase.prototype, members);
  }
  options;
  constructor(options) {
    this.options = options || {};
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {
  }
  formats() {
    return abstract();
  }
  parse() {
    return abstract();
  }
  format() {
    return abstract();
  }
  add() {
    return abstract();
  }
  diff() {
    return abstract();
  }
  startOf() {
    return abstract();
  }
  endOf() {
    return abstract();
  }
};
var adapters = {
  _date: DateAdapterBase
};
function binarySearch(metaset, axis, value, intersect) {
  const { controller, data, _sorted } = metaset;
  const iScale = controller._cachedMeta.iScale;
  const spanGaps = metaset.dataset ? metaset.dataset.options ? metaset.dataset.options.spanGaps : null : null;
  if (iScale && axis === iScale.axis && axis !== "r" && _sorted && data.length) {
    const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
    if (!intersect) {
      const result = lookupMethod(data, axis, value);
      if (spanGaps) {
        const { vScale } = controller._cachedMeta;
        const { _parsed } = metaset;
        const distanceToDefinedLo = _parsed.slice(0, result.lo + 1).reverse().findIndex((point) => !isNullOrUndef(point[vScale.axis]));
        result.lo -= Math.max(0, distanceToDefinedLo);
        const distanceToDefinedHi = _parsed.slice(result.hi).findIndex((point) => !isNullOrUndef(point[vScale.axis]));
        result.hi += Math.max(0, distanceToDefinedHi);
      }
      return result;
    } else if (controller._sharedOptions) {
      const el = data[0];
      const range = typeof el.getRange === "function" && el.getRange(axis);
      if (range) {
        const start = lookupMethod(data, axis, value - range);
        const end = lookupMethod(data, axis, value + range);
        return {
          lo: start.lo,
          hi: end.hi
        };
      }
    }
  }
  return {
    lo: 0,
    hi: data.length - 1
  };
}
function evaluateInteractionItems(chart, axis, position, handler, intersect) {
  const metasets = chart.getSortedVisibleDatasetMetas();
  const value = position[axis];
  for (let i2 = 0, ilen = metasets.length; i2 < ilen; ++i2) {
    const { index: index2, data } = metasets[i2];
    const { lo: lo2, hi: hi2 } = binarySearch(metasets[i2], axis, value, intersect);
    for (let j2 = lo2; j2 <= hi2; ++j2) {
      const element = data[j2];
      if (!element.skip) {
        handler(element, index2, j2);
      }
    }
  }
}
function getDistanceMetricForAxis(axis) {
  const useX = axis.indexOf("x") !== -1;
  const useY = axis.indexOf("y") !== -1;
  return function(pt1, pt2) {
    const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
    const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  };
}
function getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) {
  const items = [];
  if (!includeInvisible && !chart.isPointInArea(position)) {
    return items;
  }
  const evaluationFunc = function(element, datasetIndex, index2) {
    if (!includeInvisible && !_isPointInArea(element, chart.chartArea, 0)) {
      return;
    }
    if (element.inRange(position.x, position.y, useFinalPosition)) {
      items.push({
        element,
        datasetIndex,
        index: index2
      });
    }
  };
  evaluateInteractionItems(chart, axis, position, evaluationFunc, true);
  return items;
}
function getNearestRadialItems(chart, position, axis, useFinalPosition) {
  let items = [];
  function evaluationFunc(element, datasetIndex, index2) {
    const { startAngle, endAngle } = element.getProps([
      "startAngle",
      "endAngle"
    ], useFinalPosition);
    const { angle } = getAngleFromPoint(element, {
      x: position.x,
      y: position.y
    });
    if (_angleBetween(angle, startAngle, endAngle)) {
      items.push({
        element,
        datasetIndex,
        index: index2
      });
    }
  }
  evaluateInteractionItems(chart, axis, position, evaluationFunc);
  return items;
}
function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
  let items = [];
  const distanceMetric = getDistanceMetricForAxis(axis);
  let minDistance = Number.POSITIVE_INFINITY;
  function evaluationFunc(element, datasetIndex, index2) {
    const inRange2 = element.inRange(position.x, position.y, useFinalPosition);
    if (intersect && !inRange2) {
      return;
    }
    const center = element.getCenterPoint(useFinalPosition);
    const pointInArea = !!includeInvisible || chart.isPointInArea(center);
    if (!pointInArea && !inRange2) {
      return;
    }
    const distance = distanceMetric(position, center);
    if (distance < minDistance) {
      items = [
        {
          element,
          datasetIndex,
          index: index2
        }
      ];
      minDistance = distance;
    } else if (distance === minDistance) {
      items.push({
        element,
        datasetIndex,
        index: index2
      });
    }
  }
  evaluateInteractionItems(chart, axis, position, evaluationFunc);
  return items;
}
function getNearestItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
  if (!includeInvisible && !chart.isPointInArea(position)) {
    return [];
  }
  return axis === "r" && !intersect ? getNearestRadialItems(chart, position, axis, useFinalPosition) : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible);
}
function getAxisItems(chart, position, axis, intersect, useFinalPosition) {
  const items = [];
  const rangeMethod = axis === "x" ? "inXRange" : "inYRange";
  let intersectsItem = false;
  evaluateInteractionItems(chart, axis, position, (element, datasetIndex, index2) => {
    if (element[rangeMethod] && element[rangeMethod](position[axis], useFinalPosition)) {
      items.push({
        element,
        datasetIndex,
        index: index2
      });
      intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition);
    }
  });
  if (intersect && !intersectsItem) {
    return [];
  }
  return items;
}
var Interaction = {
  evaluateInteractionItems,
  modes: {
    index(chart, e2, options, useFinalPosition) {
      const position = getRelativePosition(e2, chart);
      const axis = options.axis || "x";
      const includeInvisible = options.includeInvisible || false;
      const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
      const elements2 = [];
      if (!items.length) {
        return [];
      }
      chart.getSortedVisibleDatasetMetas().forEach((meta) => {
        const index2 = items[0].index;
        const element = meta.data[index2];
        if (element && !element.skip) {
          elements2.push({
            element,
            datasetIndex: meta.index,
            index: index2
          });
        }
      });
      return elements2;
    },
    dataset(chart, e2, options, useFinalPosition) {
      const position = getRelativePosition(e2, chart);
      const axis = options.axis || "xy";
      const includeInvisible = options.includeInvisible || false;
      let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
      if (items.length > 0) {
        const datasetIndex = items[0].datasetIndex;
        const data = chart.getDatasetMeta(datasetIndex).data;
        items = [];
        for (let i2 = 0; i2 < data.length; ++i2) {
          items.push({
            element: data[i2],
            datasetIndex,
            index: i2
          });
        }
      }
      return items;
    },
    point(chart, e2, options, useFinalPosition) {
      const position = getRelativePosition(e2, chart);
      const axis = options.axis || "xy";
      const includeInvisible = options.includeInvisible || false;
      return getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
    },
    nearest(chart, e2, options, useFinalPosition) {
      const position = getRelativePosition(e2, chart);
      const axis = options.axis || "xy";
      const includeInvisible = options.includeInvisible || false;
      return getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
    },
    x(chart, e2, options, useFinalPosition) {
      const position = getRelativePosition(e2, chart);
      return getAxisItems(chart, position, "x", options.intersect, useFinalPosition);
    },
    y(chart, e2, options, useFinalPosition) {
      const position = getRelativePosition(e2, chart);
      return getAxisItems(chart, position, "y", options.intersect, useFinalPosition);
    }
  }
};
var STATIC_POSITIONS = [
  "left",
  "top",
  "right",
  "bottom"
];
function filterByPosition(array, position) {
  return array.filter((v2) => v2.pos === position);
}
function filterDynamicPositionByAxis(array, axis) {
  return array.filter((v2) => STATIC_POSITIONS.indexOf(v2.pos) === -1 && v2.box.axis === axis);
}
function sortByWeight(array, reverse) {
  return array.sort((a2, b2) => {
    const v0 = reverse ? b2 : a2;
    const v1 = reverse ? a2 : b2;
    return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
  });
}
function wrapBoxes(boxes) {
  const layoutBoxes = [];
  let i2, ilen, box, pos, stack, stackWeight;
  for (i2 = 0, ilen = (boxes || []).length; i2 < ilen; ++i2) {
    box = boxes[i2];
    ({ position: pos, options: { stack, stackWeight = 1 } } = box);
    layoutBoxes.push({
      index: i2,
      box,
      pos,
      horizontal: box.isHorizontal(),
      weight: box.weight,
      stack: stack && pos + stack,
      stackWeight
    });
  }
  return layoutBoxes;
}
function buildStacks(layouts2) {
  const stacks = {};
  for (const wrap of layouts2) {
    const { stack, pos, stackWeight } = wrap;
    if (!stack || !STATIC_POSITIONS.includes(pos)) {
      continue;
    }
    const _stack = stacks[stack] || (stacks[stack] = {
      count: 0,
      placed: 0,
      weight: 0,
      size: 0
    });
    _stack.count++;
    _stack.weight += stackWeight;
  }
  return stacks;
}
function setLayoutDims(layouts2, params) {
  const stacks = buildStacks(layouts2);
  const { vBoxMaxWidth, hBoxMaxHeight } = params;
  let i2, ilen, layout;
  for (i2 = 0, ilen = layouts2.length; i2 < ilen; ++i2) {
    layout = layouts2[i2];
    const { fullSize } = layout.box;
    const stack = stacks[layout.stack];
    const factor = stack && layout.stackWeight / stack.weight;
    if (layout.horizontal) {
      layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
      layout.height = hBoxMaxHeight;
    } else {
      layout.width = vBoxMaxWidth;
      layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
    }
  }
  return stacks;
}
function buildLayoutBoxes(boxes) {
  const layoutBoxes = wrapBoxes(boxes);
  const fullSize = sortByWeight(layoutBoxes.filter((wrap) => wrap.box.fullSize), true);
  const left = sortByWeight(filterByPosition(layoutBoxes, "left"), true);
  const right = sortByWeight(filterByPosition(layoutBoxes, "right"));
  const top = sortByWeight(filterByPosition(layoutBoxes, "top"), true);
  const bottom = sortByWeight(filterByPosition(layoutBoxes, "bottom"));
  const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, "x");
  const centerVertical = filterDynamicPositionByAxis(layoutBoxes, "y");
  return {
    fullSize,
    leftAndTop: left.concat(top),
    rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
    chartArea: filterByPosition(layoutBoxes, "chartArea"),
    vertical: left.concat(right).concat(centerVertical),
    horizontal: top.concat(bottom).concat(centerHorizontal)
  };
}
function getCombinedMax(maxPadding, chartArea, a2, b2) {
  return Math.max(maxPadding[a2], chartArea[a2]) + Math.max(maxPadding[b2], chartArea[b2]);
}
function updateMaxPadding(maxPadding, boxPadding) {
  maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
  maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
  maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
  maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
}
function updateDims(chartArea, params, layout, stacks) {
  const { pos, box } = layout;
  const maxPadding = chartArea.maxPadding;
  if (!isObject(pos)) {
    if (layout.size) {
      chartArea[pos] -= layout.size;
    }
    const stack = stacks[layout.stack] || {
      size: 0,
      count: 1
    };
    stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
    layout.size = stack.size / stack.count;
    chartArea[pos] += layout.size;
  }
  if (box.getPadding) {
    updateMaxPadding(maxPadding, box.getPadding());
  }
  const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, "left", "right"));
  const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, "top", "bottom"));
  const widthChanged = newWidth !== chartArea.w;
  const heightChanged = newHeight !== chartArea.h;
  chartArea.w = newWidth;
  chartArea.h = newHeight;
  return layout.horizontal ? {
    same: widthChanged,
    other: heightChanged
  } : {
    same: heightChanged,
    other: widthChanged
  };
}
function handleMaxPadding(chartArea) {
  const maxPadding = chartArea.maxPadding;
  function updatePos(pos) {
    const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
    chartArea[pos] += change;
    return change;
  }
  chartArea.y += updatePos("top");
  chartArea.x += updatePos("left");
  updatePos("right");
  updatePos("bottom");
}
function getMargins(horizontal, chartArea) {
  const maxPadding = chartArea.maxPadding;
  function marginForPositions(positions2) {
    const margin = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    positions2.forEach((pos) => {
      margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
    });
    return margin;
  }
  return horizontal ? marginForPositions([
    "left",
    "right"
  ]) : marginForPositions([
    "top",
    "bottom"
  ]);
}
function fitBoxes(boxes, chartArea, params, stacks) {
  const refitBoxes = [];
  let i2, ilen, layout, box, refit, changed;
  for (i2 = 0, ilen = boxes.length, refit = 0; i2 < ilen; ++i2) {
    layout = boxes[i2];
    box = layout.box;
    box.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
    const { same, other } = updateDims(chartArea, params, layout, stacks);
    refit |= same && refitBoxes.length;
    changed = changed || other;
    if (!box.fullSize) {
      refitBoxes.push(layout);
    }
  }
  return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
}
function setBoxDims(box, left, top, width, height) {
  box.top = top;
  box.left = left;
  box.right = left + width;
  box.bottom = top + height;
  box.width = width;
  box.height = height;
}
function placeBoxes(boxes, chartArea, params, stacks) {
  const userPadding = params.padding;
  let { x: x2, y: y2 } = chartArea;
  for (const layout of boxes) {
    const box = layout.box;
    const stack = stacks[layout.stack] || {
      count: 1,
      placed: 0,
      weight: 1
    };
    const weight = layout.stackWeight / stack.weight || 1;
    if (layout.horizontal) {
      const width = chartArea.w * weight;
      const height = stack.size || box.height;
      if (defined(stack.start)) {
        y2 = stack.start;
      }
      if (box.fullSize) {
        setBoxDims(box, userPadding.left, y2, params.outerWidth - userPadding.right - userPadding.left, height);
      } else {
        setBoxDims(box, chartArea.left + stack.placed, y2, width, height);
      }
      stack.start = y2;
      stack.placed += width;
      y2 = box.bottom;
    } else {
      const height = chartArea.h * weight;
      const width = stack.size || box.width;
      if (defined(stack.start)) {
        x2 = stack.start;
      }
      if (box.fullSize) {
        setBoxDims(box, x2, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
      } else {
        setBoxDims(box, x2, chartArea.top + stack.placed, width, height);
      }
      stack.start = x2;
      stack.placed += height;
      x2 = box.right;
    }
  }
  chartArea.x = x2;
  chartArea.y = y2;
}
var layouts = {
  addBox(chart, item) {
    if (!chart.boxes) {
      chart.boxes = [];
    }
    item.fullSize = item.fullSize || false;
    item.position = item.position || "top";
    item.weight = item.weight || 0;
    item._layers = item._layers || function() {
      return [
        {
          z: 0,
          draw(chartArea) {
            item.draw(chartArea);
          }
        }
      ];
    };
    chart.boxes.push(item);
  },
  removeBox(chart, layoutItem) {
    const index2 = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
    if (index2 !== -1) {
      chart.boxes.splice(index2, 1);
    }
  },
  configure(chart, item, options) {
    item.fullSize = options.fullSize;
    item.position = options.position;
    item.weight = options.weight;
  },
  update(chart, width, height, minPadding) {
    if (!chart) {
      return;
    }
    const padding = toPadding(chart.options.layout.padding);
    const availableWidth = Math.max(width - padding.width, 0);
    const availableHeight = Math.max(height - padding.height, 0);
    const boxes = buildLayoutBoxes(chart.boxes);
    const verticalBoxes = boxes.vertical;
    const horizontalBoxes = boxes.horizontal;
    each(chart.boxes, (box) => {
      if (typeof box.beforeLayout === "function") {
        box.beforeLayout();
      }
    });
    const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) => wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
    const params = Object.freeze({
      outerWidth: width,
      outerHeight: height,
      padding,
      availableWidth,
      availableHeight,
      vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
      hBoxMaxHeight: availableHeight / 2
    });
    const maxPadding = Object.assign({}, padding);
    updateMaxPadding(maxPadding, toPadding(minPadding));
    const chartArea = Object.assign({
      maxPadding,
      w: availableWidth,
      h: availableHeight,
      x: padding.left,
      y: padding.top
    }, padding);
    const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
    fitBoxes(boxes.fullSize, chartArea, params, stacks);
    fitBoxes(verticalBoxes, chartArea, params, stacks);
    if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
      fitBoxes(verticalBoxes, chartArea, params, stacks);
    }
    handleMaxPadding(chartArea);
    placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
    chartArea.x += chartArea.w;
    chartArea.y += chartArea.h;
    placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
    chart.chartArea = {
      left: chartArea.left,
      top: chartArea.top,
      right: chartArea.left + chartArea.w,
      bottom: chartArea.top + chartArea.h,
      height: chartArea.h,
      width: chartArea.w
    };
    each(boxes.chartArea, (layout) => {
      const box = layout.box;
      Object.assign(box, chart.chartArea);
      box.update(chartArea.w, chartArea.h, {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      });
    });
  }
};
var BasePlatform = class {
  acquireContext(canvas, aspectRatio) {
  }
  releaseContext(context) {
    return false;
  }
  addEventListener(chart, type, listener) {
  }
  removeEventListener(chart, type, listener) {
  }
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(element, width, height, aspectRatio) {
    width = Math.max(0, width || element.width);
    height = height || element.height;
    return {
      width,
      height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
    };
  }
  isAttached(canvas) {
    return true;
  }
  updateConfig(config) {
  }
};
var BasicPlatform = class extends BasePlatform {
  acquireContext(item) {
    return item && item.getContext && item.getContext("2d") || null;
  }
  updateConfig(config) {
    config.options.animation = false;
  }
};
var EXPANDO_KEY = "$chartjs";
var EVENT_TYPES = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
};
var isNullOrEmpty = (value) => value === null || value === "";
function initCanvas(canvas, aspectRatio) {
  const style = canvas.style;
  const renderHeight = canvas.getAttribute("height");
  const renderWidth = canvas.getAttribute("width");
  canvas[EXPANDO_KEY] = {
    initial: {
      height: renderHeight,
      width: renderWidth,
      style: {
        display: style.display,
        height: style.height,
        width: style.width
      }
    }
  };
  style.display = style.display || "block";
  style.boxSizing = style.boxSizing || "border-box";
  if (isNullOrEmpty(renderWidth)) {
    const displayWidth = readUsedSize(canvas, "width");
    if (displayWidth !== void 0) {
      canvas.width = displayWidth;
    }
  }
  if (isNullOrEmpty(renderHeight)) {
    if (canvas.style.height === "") {
      canvas.height = canvas.width / (aspectRatio || 2);
    } else {
      const displayHeight = readUsedSize(canvas, "height");
      if (displayHeight !== void 0) {
        canvas.height = displayHeight;
      }
    }
  }
  return canvas;
}
var eventListenerOptions = supportsEventListenerOptions ? {
  passive: true
} : false;
function addListener(node, type, listener) {
  if (node) {
    node.addEventListener(type, listener, eventListenerOptions);
  }
}
function removeListener(chart, type, listener) {
  if (chart && chart.canvas) {
    chart.canvas.removeEventListener(type, listener, eventListenerOptions);
  }
}
function fromNativeEvent(event, chart) {
  const type = EVENT_TYPES[event.type] || event.type;
  const { x: x2, y: y2 } = getRelativePosition(event, chart);
  return {
    type,
    chart,
    native: event,
    x: x2 !== void 0 ? x2 : null,
    y: y2 !== void 0 ? y2 : null
  };
}
function nodeListContains(nodeList, canvas) {
  for (const node of nodeList) {
    if (node === canvas || node.contains(canvas)) {
      return true;
    }
  }
}
function createAttachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const observer = new MutationObserver((entries) => {
    let trigger = false;
    for (const entry of entries) {
      trigger = trigger || nodeListContains(entry.addedNodes, canvas);
      trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
    }
    if (trigger) {
      listener();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  return observer;
}
function createDetachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const observer = new MutationObserver((entries) => {
    let trigger = false;
    for (const entry of entries) {
      trigger = trigger || nodeListContains(entry.removedNodes, canvas);
      trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
    }
    if (trigger) {
      listener();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  return observer;
}
var drpListeningCharts = /* @__PURE__ */ new Map();
var oldDevicePixelRatio = 0;
function onWindowResize() {
  const dpr = window.devicePixelRatio;
  if (dpr === oldDevicePixelRatio) {
    return;
  }
  oldDevicePixelRatio = dpr;
  drpListeningCharts.forEach((resize, chart) => {
    if (chart.currentDevicePixelRatio !== dpr) {
      resize();
    }
  });
}
function listenDevicePixelRatioChanges(chart, resize) {
  if (!drpListeningCharts.size) {
    window.addEventListener("resize", onWindowResize);
  }
  drpListeningCharts.set(chart, resize);
}
function unlistenDevicePixelRatioChanges(chart) {
  drpListeningCharts.delete(chart);
  if (!drpListeningCharts.size) {
    window.removeEventListener("resize", onWindowResize);
  }
}
function createResizeObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const container = canvas && _getParentNode(canvas);
  if (!container) {
    return;
  }
  const resize = throttled((width, height) => {
    const w2 = container.clientWidth;
    listener(width, height);
    if (w2 < container.clientWidth) {
      listener();
    }
  }, window);
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    const width = entry.contentRect.width;
    const height = entry.contentRect.height;
    if (width === 0 && height === 0) {
      return;
    }
    resize(width, height);
  });
  observer.observe(container);
  listenDevicePixelRatioChanges(chart, resize);
  return observer;
}
function releaseObserver(chart, type, observer) {
  if (observer) {
    observer.disconnect();
  }
  if (type === "resize") {
    unlistenDevicePixelRatioChanges(chart);
  }
}
function createProxyAndListen(chart, type, listener) {
  const canvas = chart.canvas;
  const proxy = throttled((event) => {
    if (chart.ctx !== null) {
      listener(fromNativeEvent(event, chart));
    }
  }, chart);
  addListener(canvas, type, proxy);
  return proxy;
}
var DomPlatform = class extends BasePlatform {
  acquireContext(canvas, aspectRatio) {
    const context = canvas && canvas.getContext && canvas.getContext("2d");
    if (context && context.canvas === canvas) {
      initCanvas(canvas, aspectRatio);
      return context;
    }
    return null;
  }
  releaseContext(context) {
    const canvas = context.canvas;
    if (!canvas[EXPANDO_KEY]) {
      return false;
    }
    const initial = canvas[EXPANDO_KEY].initial;
    [
      "height",
      "width"
    ].forEach((prop) => {
      const value = initial[prop];
      if (isNullOrUndef(value)) {
        canvas.removeAttribute(prop);
      } else {
        canvas.setAttribute(prop, value);
      }
    });
    const style = initial.style || {};
    Object.keys(style).forEach((key) => {
      canvas.style[key] = style[key];
    });
    canvas.width = canvas.width;
    delete canvas[EXPANDO_KEY];
    return true;
  }
  addEventListener(chart, type, listener) {
    this.removeEventListener(chart, type);
    const proxies = chart.$proxies || (chart.$proxies = {});
    const handlers = {
      attach: createAttachObserver,
      detach: createDetachObserver,
      resize: createResizeObserver
    };
    const handler = handlers[type] || createProxyAndListen;
    proxies[type] = handler(chart, type, listener);
  }
  removeEventListener(chart, type) {
    const proxies = chart.$proxies || (chart.$proxies = {});
    const proxy = proxies[type];
    if (!proxy) {
      return;
    }
    const handlers = {
      attach: releaseObserver,
      detach: releaseObserver,
      resize: releaseObserver
    };
    const handler = handlers[type] || removeListener;
    handler(chart, type, proxy);
    proxies[type] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(canvas, width, height, aspectRatio) {
    return getMaximumSize(canvas, width, height, aspectRatio);
  }
  isAttached(canvas) {
    const container = canvas && _getParentNode(canvas);
    return !!(container && container.isConnected);
  }
};
function _detectPlatform(canvas) {
  if (!_isDomSupported() || typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
    return BasicPlatform;
  }
  return DomPlatform;
}
var Element2 = class {
  static defaults = {};
  static defaultRoutes = void 0;
  x;
  y;
  active = false;
  options;
  $animations;
  tooltipPosition(useFinalPosition) {
    const { x: x2, y: y2 } = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    return {
      x: x2,
      y: y2
    };
  }
  hasValue() {
    return isNumber(this.x) && isNumber(this.y);
  }
  getProps(props, final) {
    const anims = this.$animations;
    if (!final || !anims) {
      return this;
    }
    const ret = {};
    props.forEach((prop) => {
      ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
    });
    return ret;
  }
};
function autoSkip(scale, ticks) {
  const tickOpts = scale.options.ticks;
  const determinedMaxTicks = determineMaxTicks(scale);
  const ticksLimit = Math.min(tickOpts.maxTicksLimit || determinedMaxTicks, determinedMaxTicks);
  const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
  const numMajorIndices = majorIndices.length;
  const first = majorIndices[0];
  const last = majorIndices[numMajorIndices - 1];
  const newTicks = [];
  if (numMajorIndices > ticksLimit) {
    skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
    return newTicks;
  }
  const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
  if (numMajorIndices > 0) {
    let i2, ilen;
    const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
    skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
    for (i2 = 0, ilen = numMajorIndices - 1; i2 < ilen; i2++) {
      skip(ticks, newTicks, spacing, majorIndices[i2], majorIndices[i2 + 1]);
    }
    skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
    return newTicks;
  }
  skip(ticks, newTicks, spacing);
  return newTicks;
}
function determineMaxTicks(scale) {
  const offset = scale.options.offset;
  const tickLength = scale._tickSize();
  const maxScale = scale._length / tickLength + (offset ? 0 : 1);
  const maxChart = scale._maxLength / tickLength;
  return Math.floor(Math.min(maxScale, maxChart));
}
function calculateSpacing(majorIndices, ticks, ticksLimit) {
  const evenMajorSpacing = getEvenSpacing(majorIndices);
  const spacing = ticks.length / ticksLimit;
  if (!evenMajorSpacing) {
    return Math.max(spacing, 1);
  }
  const factors = _factorize(evenMajorSpacing);
  for (let i2 = 0, ilen = factors.length - 1; i2 < ilen; i2++) {
    const factor = factors[i2];
    if (factor > spacing) {
      return factor;
    }
  }
  return Math.max(spacing, 1);
}
function getMajorIndices(ticks) {
  const result = [];
  let i2, ilen;
  for (i2 = 0, ilen = ticks.length; i2 < ilen; i2++) {
    if (ticks[i2].major) {
      result.push(i2);
    }
  }
  return result;
}
function skipMajors(ticks, newTicks, majorIndices, spacing) {
  let count = 0;
  let next = majorIndices[0];
  let i2;
  spacing = Math.ceil(spacing);
  for (i2 = 0; i2 < ticks.length; i2++) {
    if (i2 === next) {
      newTicks.push(ticks[i2]);
      count++;
      next = majorIndices[count * spacing];
    }
  }
}
function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
  const start = valueOrDefault(majorStart, 0);
  const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
  let count = 0;
  let length, i2, next;
  spacing = Math.ceil(spacing);
  if (majorEnd) {
    length = majorEnd - majorStart;
    spacing = length / Math.floor(length / spacing);
  }
  next = start;
  while (next < 0) {
    count++;
    next = Math.round(start + count * spacing);
  }
  for (i2 = Math.max(start, 0); i2 < end; i2++) {
    if (i2 === next) {
      newTicks.push(ticks[i2]);
      count++;
      next = Math.round(start + count * spacing);
    }
  }
}
function getEvenSpacing(arr) {
  const len = arr.length;
  let i2, diff;
  if (len < 2) {
    return false;
  }
  for (diff = arr[0], i2 = 1; i2 < len; ++i2) {
    if (arr[i2] - arr[i2 - 1] !== diff) {
      return false;
    }
  }
  return diff;
}
var reverseAlign = (align) => align === "left" ? "right" : align === "right" ? "left" : align;
var offsetFromEdge = (scale, edge, offset) => edge === "top" || edge === "left" ? scale[edge] + offset : scale[edge] - offset;
var getTicksLimit = (ticksLength, maxTicksLimit) => Math.min(maxTicksLimit || ticksLength, ticksLength);
function sample(arr, numItems) {
  const result = [];
  const increment = arr.length / numItems;
  const len = arr.length;
  let i2 = 0;
  for (; i2 < len; i2 += increment) {
    result.push(arr[Math.floor(i2)]);
  }
  return result;
}
function getPixelForGridLine(scale, index2, offsetGridLines) {
  const length = scale.ticks.length;
  const validIndex2 = Math.min(index2, length - 1);
  const start = scale._startPixel;
  const end = scale._endPixel;
  const epsilon = 1e-6;
  let lineValue = scale.getPixelForTick(validIndex2);
  let offset;
  if (offsetGridLines) {
    if (length === 1) {
      offset = Math.max(lineValue - start, end - lineValue);
    } else if (index2 === 0) {
      offset = (scale.getPixelForTick(1) - lineValue) / 2;
    } else {
      offset = (lineValue - scale.getPixelForTick(validIndex2 - 1)) / 2;
    }
    lineValue += validIndex2 < index2 ? offset : -offset;
    if (lineValue < start - epsilon || lineValue > end + epsilon) {
      return;
    }
  }
  return lineValue;
}
function garbageCollect(caches, length) {
  each(caches, (cache) => {
    const gc = cache.gc;
    const gcLen = gc.length / 2;
    let i2;
    if (gcLen > length) {
      for (i2 = 0; i2 < gcLen; ++i2) {
        delete cache.data[gc[i2]];
      }
      gc.splice(0, gcLen);
    }
  });
}
function getTickMarkLength(options) {
  return options.drawTicks ? options.tickLength : 0;
}
function getTitleHeight(options, fallback) {
  if (!options.display) {
    return 0;
  }
  const font = toFont(options.font, fallback);
  const padding = toPadding(options.padding);
  const lines = isArray(options.text) ? options.text.length : 1;
  return lines * font.lineHeight + padding.height;
}
function createScaleContext(parent, scale) {
  return createContext(parent, {
    scale,
    type: "scale"
  });
}
function createTickContext(parent, index2, tick) {
  return createContext(parent, {
    tick,
    index: index2,
    type: "tick"
  });
}
function titleAlign(align, position, reverse) {
  let ret = _toLeftRightCenter(align);
  if (reverse && position !== "right" || !reverse && position === "right") {
    ret = reverseAlign(ret);
  }
  return ret;
}
function titleArgs(scale, offset, position, align) {
  const { top, left, bottom, right, chart } = scale;
  const { chartArea, scales: scales2 } = chart;
  let rotation = 0;
  let maxWidth, titleX, titleY;
  const height = bottom - top;
  const width = right - left;
  if (scale.isHorizontal()) {
    titleX = _alignStartEnd(align, left, right);
    if (isObject(position)) {
      const positionAxisID = Object.keys(position)[0];
      const value = position[positionAxisID];
      titleY = scales2[positionAxisID].getPixelForValue(value) + height - offset;
    } else if (position === "center") {
      titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
    } else {
      titleY = offsetFromEdge(scale, position, offset);
    }
    maxWidth = right - left;
  } else {
    if (isObject(position)) {
      const positionAxisID = Object.keys(position)[0];
      const value = position[positionAxisID];
      titleX = scales2[positionAxisID].getPixelForValue(value) - width + offset;
    } else if (position === "center") {
      titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
    } else {
      titleX = offsetFromEdge(scale, position, offset);
    }
    titleY = _alignStartEnd(align, bottom, top);
    rotation = position === "left" ? -HALF_PI : HALF_PI;
  }
  return {
    titleX,
    titleY,
    maxWidth,
    rotation
  };
}
var Scale = class _Scale extends Element2 {
  constructor(cfg) {
    super();
    this.id = cfg.id;
    this.type = cfg.type;
    this.options = void 0;
    this.ctx = cfg.ctx;
    this.chart = cfg.chart;
    this.top = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.right = void 0;
    this.width = void 0;
    this.height = void 0;
    this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
    this.maxWidth = void 0;
    this.maxHeight = void 0;
    this.paddingTop = void 0;
    this.paddingBottom = void 0;
    this.paddingLeft = void 0;
    this.paddingRight = void 0;
    this.axis = void 0;
    this.labelRotation = void 0;
    this.min = void 0;
    this.max = void 0;
    this._range = void 0;
    this.ticks = [];
    this._gridLineItems = null;
    this._labelItems = null;
    this._labelSizes = null;
    this._length = 0;
    this._maxLength = 0;
    this._longestTextCache = {};
    this._startPixel = void 0;
    this._endPixel = void 0;
    this._reversePixels = false;
    this._userMax = void 0;
    this._userMin = void 0;
    this._suggestedMax = void 0;
    this._suggestedMin = void 0;
    this._ticksLength = 0;
    this._borderValue = 0;
    this._cache = {};
    this._dataLimitsCached = false;
    this.$context = void 0;
  }
  init(options) {
    this.options = options.setContext(this.getContext());
    this.axis = options.axis;
    this._userMin = this.parse(options.min);
    this._userMax = this.parse(options.max);
    this._suggestedMin = this.parse(options.suggestedMin);
    this._suggestedMax = this.parse(options.suggestedMax);
  }
  parse(raw, index2) {
    return raw;
  }
  getUserBounds() {
    let { _userMin, _userMax, _suggestedMin, _suggestedMax } = this;
    _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
    _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
    _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
    _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
    return {
      min: finiteOrDefault(_userMin, _suggestedMin),
      max: finiteOrDefault(_userMax, _suggestedMax),
      minDefined: isNumberFinite(_userMin),
      maxDefined: isNumberFinite(_userMax)
    };
  }
  getMinMax(canStack) {
    let { min, max, minDefined, maxDefined } = this.getUserBounds();
    let range;
    if (minDefined && maxDefined) {
      return {
        min,
        max
      };
    }
    const metas = this.getMatchingVisibleMetas();
    for (let i2 = 0, ilen = metas.length; i2 < ilen; ++i2) {
      range = metas[i2].controller.getMinMax(this, canStack);
      if (!minDefined) {
        min = Math.min(min, range.min);
      }
      if (!maxDefined) {
        max = Math.max(max, range.max);
      }
    }
    min = maxDefined && min > max ? max : min;
    max = minDefined && min > max ? min : max;
    return {
      min: finiteOrDefault(min, finiteOrDefault(max, min)),
      max: finiteOrDefault(max, finiteOrDefault(min, max))
    };
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const data = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
  }
  getLabelItems(chartArea = this.chart.chartArea) {
    const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
    return items;
  }
  beforeLayout() {
    this._cache = {};
    this._dataLimitsCached = false;
  }
  beforeUpdate() {
    callback(this.options.beforeUpdate, [
      this
    ]);
  }
  update(maxWidth, maxHeight, margins) {
    const { beginAtZero, grace, ticks: tickOpts } = this.options;
    const sampleSize = tickOpts.sampleSize;
    this.beforeUpdate();
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this._margins = margins = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, margins);
    this.ticks = null;
    this._labelSizes = null;
    this._gridLineItems = null;
    this._labelItems = null;
    this.beforeSetDimensions();
    this.setDimensions();
    this.afterSetDimensions();
    this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
    if (!this._dataLimitsCached) {
      this.beforeDataLimits();
      this.determineDataLimits();
      this.afterDataLimits();
      this._range = _addGrace(this, grace, beginAtZero);
      this._dataLimitsCached = true;
    }
    this.beforeBuildTicks();
    this.ticks = this.buildTicks() || [];
    this.afterBuildTicks();
    const samplingEnabled = sampleSize < this.ticks.length;
    this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
    this.configure();
    this.beforeCalculateLabelRotation();
    this.calculateLabelRotation();
    this.afterCalculateLabelRotation();
    if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === "auto")) {
      this.ticks = autoSkip(this, this.ticks);
      this._labelSizes = null;
      this.afterAutoSkip();
    }
    if (samplingEnabled) {
      this._convertTicksToLabels(this.ticks);
    }
    this.beforeFit();
    this.fit();
    this.afterFit();
    this.afterUpdate();
  }
  configure() {
    let reversePixels = this.options.reverse;
    let startPixel, endPixel;
    if (this.isHorizontal()) {
      startPixel = this.left;
      endPixel = this.right;
    } else {
      startPixel = this.top;
      endPixel = this.bottom;
      reversePixels = !reversePixels;
    }
    this._startPixel = startPixel;
    this._endPixel = endPixel;
    this._reversePixels = reversePixels;
    this._length = endPixel - startPixel;
    this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    callback(this.options.afterUpdate, [
      this
    ]);
  }
  beforeSetDimensions() {
    callback(this.options.beforeSetDimensions, [
      this
    ]);
  }
  setDimensions() {
    if (this.isHorizontal()) {
      this.width = this.maxWidth;
      this.left = 0;
      this.right = this.width;
    } else {
      this.height = this.maxHeight;
      this.top = 0;
      this.bottom = this.height;
    }
    this.paddingLeft = 0;
    this.paddingTop = 0;
    this.paddingRight = 0;
    this.paddingBottom = 0;
  }
  afterSetDimensions() {
    callback(this.options.afterSetDimensions, [
      this
    ]);
  }
  _callHooks(name) {
    this.chart.notifyPlugins(name, this.getContext());
    callback(this.options[name], [
      this
    ]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {
  }
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    callback(this.options.beforeTickToLabelConversion, [
      this
    ]);
  }
  generateTickLabels(ticks) {
    const tickOpts = this.options.ticks;
    let i2, ilen, tick;
    for (i2 = 0, ilen = ticks.length; i2 < ilen; i2++) {
      tick = ticks[i2];
      tick.label = callback(tickOpts.callback, [
        tick.value,
        i2,
        ticks
      ], this);
    }
  }
  afterTickToLabelConversion() {
    callback(this.options.afterTickToLabelConversion, [
      this
    ]);
  }
  beforeCalculateLabelRotation() {
    callback(this.options.beforeCalculateLabelRotation, [
      this
    ]);
  }
  calculateLabelRotation() {
    const options = this.options;
    const tickOpts = options.ticks;
    const numTicks = getTicksLimit(this.ticks.length, options.ticks.maxTicksLimit);
    const minRotation = tickOpts.minRotation || 0;
    const maxRotation = tickOpts.maxRotation;
    let labelRotation = minRotation;
    let tickWidth, maxHeight, maxLabelDiagonal;
    if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
      this.labelRotation = minRotation;
      return;
    }
    const labelSizes = this._getLabelSizes();
    const maxLabelWidth = labelSizes.widest.width;
    const maxLabelHeight = labelSizes.highest.height;
    const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
    tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
    if (maxLabelWidth + 6 > tickWidth) {
      tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
      maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
      maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
      labelRotation = toDegrees(Math.min(Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))));
      labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
    }
    this.labelRotation = labelRotation;
  }
  afterCalculateLabelRotation() {
    callback(this.options.afterCalculateLabelRotation, [
      this
    ]);
  }
  afterAutoSkip() {
  }
  beforeFit() {
    callback(this.options.beforeFit, [
      this
    ]);
  }
  fit() {
    const minSize = {
      width: 0,
      height: 0
    };
    const { chart, options: { ticks: tickOpts, title: titleOpts, grid: gridOpts } } = this;
    const display = this._isVisible();
    const isHorizontal = this.isHorizontal();
    if (display) {
      const titleHeight = getTitleHeight(titleOpts, chart.options.font);
      if (isHorizontal) {
        minSize.width = this.maxWidth;
        minSize.height = getTickMarkLength(gridOpts) + titleHeight;
      } else {
        minSize.height = this.maxHeight;
        minSize.width = getTickMarkLength(gridOpts) + titleHeight;
      }
      if (tickOpts.display && this.ticks.length) {
        const { first, last, widest, highest } = this._getLabelSizes();
        const tickPadding = tickOpts.padding * 2;
        const angleRadians = toRadians(this.labelRotation);
        const cos = Math.cos(angleRadians);
        const sin = Math.sin(angleRadians);
        if (isHorizontal) {
          const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
          minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
        } else {
          const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
          minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
        }
        this._calculatePadding(first, last, sin, cos);
      }
    }
    this._handleMargins();
    if (isHorizontal) {
      this.width = this._length = chart.width - this._margins.left - this._margins.right;
      this.height = minSize.height;
    } else {
      this.width = minSize.width;
      this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
    }
  }
  _calculatePadding(first, last, sin, cos) {
    const { ticks: { align, padding }, position } = this.options;
    const isRotated = this.labelRotation !== 0;
    const labelsBelowTicks = position !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const offsetLeft = this.getPixelForTick(0) - this.left;
      const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
      let paddingLeft = 0;
      let paddingRight = 0;
      if (isRotated) {
        if (labelsBelowTicks) {
          paddingLeft = cos * first.width;
          paddingRight = sin * last.height;
        } else {
          paddingLeft = sin * first.height;
          paddingRight = cos * last.width;
        }
      } else if (align === "start") {
        paddingRight = last.width;
      } else if (align === "end") {
        paddingLeft = first.width;
      } else if (align !== "inner") {
        paddingLeft = first.width / 2;
        paddingRight = last.width / 2;
      }
      this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
      this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
    } else {
      let paddingTop = last.height / 2;
      let paddingBottom = first.height / 2;
      if (align === "start") {
        paddingTop = 0;
        paddingBottom = first.height;
      } else if (align === "end") {
        paddingTop = last.height;
        paddingBottom = 0;
      }
      this.paddingTop = paddingTop + padding;
      this.paddingBottom = paddingBottom + padding;
    }
  }
  _handleMargins() {
    if (this._margins) {
      this._margins.left = Math.max(this.paddingLeft, this._margins.left);
      this._margins.top = Math.max(this.paddingTop, this._margins.top);
      this._margins.right = Math.max(this.paddingRight, this._margins.right);
      this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
    }
  }
  afterFit() {
    callback(this.options.afterFit, [
      this
    ]);
  }
  isHorizontal() {
    const { axis, position } = this.options;
    return position === "top" || position === "bottom" || axis === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(ticks) {
    this.beforeTickToLabelConversion();
    this.generateTickLabels(ticks);
    let i2, ilen;
    for (i2 = 0, ilen = ticks.length; i2 < ilen; i2++) {
      if (isNullOrUndef(ticks[i2].label)) {
        ticks.splice(i2, 1);
        ilen--;
        i2--;
      }
    }
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let labelSizes = this._labelSizes;
    if (!labelSizes) {
      const sampleSize = this.options.ticks.sampleSize;
      let ticks = this.ticks;
      if (sampleSize < ticks.length) {
        ticks = sample(ticks, sampleSize);
      }
      this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length, this.options.ticks.maxTicksLimit);
    }
    return labelSizes;
  }
  _computeLabelSizes(ticks, length, maxTicksLimit) {
    const { ctx, _longestTextCache: caches } = this;
    const widths = [];
    const heights = [];
    const increment = Math.floor(length / getTicksLimit(length, maxTicksLimit));
    let widestLabelSize = 0;
    let highestLabelSize = 0;
    let i2, j2, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
    for (i2 = 0; i2 < length; i2 += increment) {
      label = ticks[i2].label;
      tickFont = this._resolveTickFontOptions(i2);
      ctx.font = fontString = tickFont.string;
      cache = caches[fontString] = caches[fontString] || {
        data: {},
        gc: []
      };
      lineHeight = tickFont.lineHeight;
      width = height = 0;
      if (!isNullOrUndef(label) && !isArray(label)) {
        width = _measureText(ctx, cache.data, cache.gc, width, label);
        height = lineHeight;
      } else if (isArray(label)) {
        for (j2 = 0, jlen = label.length; j2 < jlen; ++j2) {
          nestedLabel = label[j2];
          if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
            width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
            height += lineHeight;
          }
        }
      }
      widths.push(width);
      heights.push(height);
      widestLabelSize = Math.max(width, widestLabelSize);
      highestLabelSize = Math.max(height, highestLabelSize);
    }
    garbageCollect(caches, length);
    const widest = widths.indexOf(widestLabelSize);
    const highest = heights.indexOf(highestLabelSize);
    const valueAt = (idx) => ({
      width: widths[idx] || 0,
      height: heights[idx] || 0
    });
    return {
      first: valueAt(0),
      last: valueAt(length - 1),
      widest: valueAt(widest),
      highest: valueAt(highest),
      widths,
      heights
    };
  }
  getLabelForValue(value) {
    return value;
  }
  getPixelForValue(value, index2) {
    return NaN;
  }
  getValueForPixel(pixel) {
  }
  getPixelForTick(index2) {
    const ticks = this.ticks;
    if (index2 < 0 || index2 > ticks.length - 1) {
      return null;
    }
    return this.getPixelForValue(ticks[index2].value);
  }
  getPixelForDecimal(decimal) {
    if (this._reversePixels) {
      decimal = 1 - decimal;
    }
    const pixel = this._startPixel + decimal * this._length;
    return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
  }
  getDecimalForPixel(pixel) {
    const decimal = (pixel - this._startPixel) / this._length;
    return this._reversePixels ? 1 - decimal : decimal;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min, max } = this;
    return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
  }
  getContext(index2) {
    const ticks = this.ticks || [];
    if (index2 >= 0 && index2 < ticks.length) {
      const tick = ticks[index2];
      return tick.$context || (tick.$context = createTickContext(this.getContext(), index2, tick));
    }
    return this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
  }
  _tickSize() {
    const optionTicks = this.options.ticks;
    const rot = toRadians(this.labelRotation);
    const cos = Math.abs(Math.cos(rot));
    const sin = Math.abs(Math.sin(rot));
    const labelSizes = this._getLabelSizes();
    const padding = optionTicks.autoSkipPadding || 0;
    const w2 = labelSizes ? labelSizes.widest.width + padding : 0;
    const h3 = labelSizes ? labelSizes.highest.height + padding : 0;
    return this.isHorizontal() ? h3 * cos > w2 * sin ? w2 / cos : h3 / sin : h3 * sin < w2 * cos ? h3 / cos : w2 / sin;
  }
  _isVisible() {
    const display = this.options.display;
    if (display !== "auto") {
      return !!display;
    }
    return this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(chartArea) {
    const axis = this.axis;
    const chart = this.chart;
    const options = this.options;
    const { grid, position, border } = options;
    const offset = grid.offset;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const ticksLength = ticks.length + (offset ? 1 : 0);
    const tl = getTickMarkLength(grid);
    const items = [];
    const borderOpts = border.setContext(this.getContext());
    const axisWidth = borderOpts.display ? borderOpts.width : 0;
    const axisHalfWidth = axisWidth / 2;
    const alignBorderValue = function(pixel) {
      return _alignPixel(chart, pixel, axisWidth);
    };
    let borderValue, i2, lineValue, alignedLineValue;
    let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
    if (position === "top") {
      borderValue = alignBorderValue(this.bottom);
      ty1 = this.bottom - tl;
      ty2 = borderValue - axisHalfWidth;
      y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
      y2 = chartArea.bottom;
    } else if (position === "bottom") {
      borderValue = alignBorderValue(this.top);
      y1 = chartArea.top;
      y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
      ty1 = borderValue + axisHalfWidth;
      ty2 = this.top + tl;
    } else if (position === "left") {
      borderValue = alignBorderValue(this.right);
      tx1 = this.right - tl;
      tx2 = borderValue - axisHalfWidth;
      x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
      x2 = chartArea.right;
    } else if (position === "right") {
      borderValue = alignBorderValue(this.left);
      x1 = chartArea.left;
      x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
      tx1 = borderValue + axisHalfWidth;
      tx2 = this.left + tl;
    } else if (axis === "x") {
      if (position === "center") {
        borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
      }
      y1 = chartArea.top;
      y2 = chartArea.bottom;
      ty1 = borderValue + axisHalfWidth;
      ty2 = ty1 + tl;
    } else if (axis === "y") {
      if (position === "center") {
        borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
      }
      tx1 = borderValue - axisHalfWidth;
      tx2 = tx1 - tl;
      x1 = chartArea.left;
      x2 = chartArea.right;
    }
    const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
    const step = Math.max(1, Math.ceil(ticksLength / limit));
    for (i2 = 0; i2 < ticksLength; i2 += step) {
      const context = this.getContext(i2);
      const optsAtIndex = grid.setContext(context);
      const optsAtIndexBorder = border.setContext(context);
      const lineWidth = optsAtIndex.lineWidth;
      const lineColor = optsAtIndex.color;
      const borderDash = optsAtIndexBorder.dash || [];
      const borderDashOffset = optsAtIndexBorder.dashOffset;
      const tickWidth = optsAtIndex.tickWidth;
      const tickColor = optsAtIndex.tickColor;
      const tickBorderDash = optsAtIndex.tickBorderDash || [];
      const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
      lineValue = getPixelForGridLine(this, i2, offset);
      if (lineValue === void 0) {
        continue;
      }
      alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
      if (isHorizontal) {
        tx1 = tx2 = x1 = x2 = alignedLineValue;
      } else {
        ty1 = ty2 = y1 = y2 = alignedLineValue;
      }
      items.push({
        tx1,
        ty1,
        tx2,
        ty2,
        x1,
        y1,
        x2,
        y2,
        width: lineWidth,
        color: lineColor,
        borderDash,
        borderDashOffset,
        tickWidth,
        tickColor,
        tickBorderDash,
        tickBorderDashOffset
      });
    }
    this._ticksLength = ticksLength;
    this._borderValue = borderValue;
    return items;
  }
  _computeLabelItems(chartArea) {
    const axis = this.axis;
    const options = this.options;
    const { position, ticks: optionTicks } = options;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const { align, crossAlign, padding, mirror } = optionTicks;
    const tl = getTickMarkLength(options.grid);
    const tickAndPadding = tl + padding;
    const hTickAndPadding = mirror ? -padding : tickAndPadding;
    const rotation = -toRadians(this.labelRotation);
    const items = [];
    let i2, ilen, tick, label, x2, y2, textAlign, pixel, font, lineHeight, lineCount, textOffset;
    let textBaseline = "middle";
    if (position === "top") {
      y2 = this.bottom - hTickAndPadding;
      textAlign = this._getXAxisLabelAlignment();
    } else if (position === "bottom") {
      y2 = this.top + hTickAndPadding;
      textAlign = this._getXAxisLabelAlignment();
    } else if (position === "left") {
      const ret = this._getYAxisLabelAlignment(tl);
      textAlign = ret.textAlign;
      x2 = ret.x;
    } else if (position === "right") {
      const ret = this._getYAxisLabelAlignment(tl);
      textAlign = ret.textAlign;
      x2 = ret.x;
    } else if (axis === "x") {
      if (position === "center") {
        y2 = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        y2 = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
      }
      textAlign = this._getXAxisLabelAlignment();
    } else if (axis === "y") {
      if (position === "center") {
        x2 = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        x2 = this.chart.scales[positionAxisID].getPixelForValue(value);
      }
      textAlign = this._getYAxisLabelAlignment(tl).textAlign;
    }
    if (axis === "y") {
      if (align === "start") {
        textBaseline = "top";
      } else if (align === "end") {
        textBaseline = "bottom";
      }
    }
    const labelSizes = this._getLabelSizes();
    for (i2 = 0, ilen = ticks.length; i2 < ilen; ++i2) {
      tick = ticks[i2];
      label = tick.label;
      const optsAtIndex = optionTicks.setContext(this.getContext(i2));
      pixel = this.getPixelForTick(i2) + optionTicks.labelOffset;
      font = this._resolveTickFontOptions(i2);
      lineHeight = font.lineHeight;
      lineCount = isArray(label) ? label.length : 1;
      const halfCount = lineCount / 2;
      const color2 = optsAtIndex.color;
      const strokeColor = optsAtIndex.textStrokeColor;
      const strokeWidth = optsAtIndex.textStrokeWidth;
      let tickTextAlign = textAlign;
      if (isHorizontal) {
        x2 = pixel;
        if (textAlign === "inner") {
          if (i2 === ilen - 1) {
            tickTextAlign = !this.options.reverse ? "right" : "left";
          } else if (i2 === 0) {
            tickTextAlign = !this.options.reverse ? "left" : "right";
          } else {
            tickTextAlign = "center";
          }
        }
        if (position === "top") {
          if (crossAlign === "near" || rotation !== 0) {
            textOffset = -lineCount * lineHeight + lineHeight / 2;
          } else if (crossAlign === "center") {
            textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
          } else {
            textOffset = -labelSizes.highest.height + lineHeight / 2;
          }
        } else {
          if (crossAlign === "near" || rotation !== 0) {
            textOffset = lineHeight / 2;
          } else if (crossAlign === "center") {
            textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
          } else {
            textOffset = labelSizes.highest.height - lineCount * lineHeight;
          }
        }
        if (mirror) {
          textOffset *= -1;
        }
        if (rotation !== 0 && !optsAtIndex.showLabelBackdrop) {
          x2 += lineHeight / 2 * Math.sin(rotation);
        }
      } else {
        y2 = pixel;
        textOffset = (1 - lineCount) * lineHeight / 2;
      }
      let backdrop;
      if (optsAtIndex.showLabelBackdrop) {
        const labelPadding = toPadding(optsAtIndex.backdropPadding);
        const height = labelSizes.heights[i2];
        const width = labelSizes.widths[i2];
        let top = textOffset - labelPadding.top;
        let left = 0 - labelPadding.left;
        switch (textBaseline) {
          case "middle":
            top -= height / 2;
            break;
          case "bottom":
            top -= height;
            break;
        }
        switch (textAlign) {
          case "center":
            left -= width / 2;
            break;
          case "right":
            left -= width;
            break;
          case "inner":
            if (i2 === ilen - 1) {
              left -= width;
            } else if (i2 > 0) {
              left -= width / 2;
            }
            break;
        }
        backdrop = {
          left,
          top,
          width: width + labelPadding.width,
          height: height + labelPadding.height,
          color: optsAtIndex.backdropColor
        };
      }
      items.push({
        label,
        font,
        textOffset,
        options: {
          rotation,
          color: color2,
          strokeColor,
          strokeWidth,
          textAlign: tickTextAlign,
          textBaseline,
          translation: [
            x2,
            y2
          ],
          backdrop
        }
      });
    }
    return items;
  }
  _getXAxisLabelAlignment() {
    const { position, ticks } = this.options;
    const rotation = -toRadians(this.labelRotation);
    if (rotation) {
      return position === "top" ? "left" : "right";
    }
    let align = "center";
    if (ticks.align === "start") {
      align = "left";
    } else if (ticks.align === "end") {
      align = "right";
    } else if (ticks.align === "inner") {
      align = "inner";
    }
    return align;
  }
  _getYAxisLabelAlignment(tl) {
    const { position, ticks: { crossAlign, mirror, padding } } = this.options;
    const labelSizes = this._getLabelSizes();
    const tickAndPadding = tl + padding;
    const widest = labelSizes.widest.width;
    let textAlign;
    let x2;
    if (position === "left") {
      if (mirror) {
        x2 = this.right + padding;
        if (crossAlign === "near") {
          textAlign = "left";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x2 += widest / 2;
        } else {
          textAlign = "right";
          x2 += widest;
        }
      } else {
        x2 = this.right - tickAndPadding;
        if (crossAlign === "near") {
          textAlign = "right";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x2 -= widest / 2;
        } else {
          textAlign = "left";
          x2 = this.left;
        }
      }
    } else if (position === "right") {
      if (mirror) {
        x2 = this.left + padding;
        if (crossAlign === "near") {
          textAlign = "right";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x2 -= widest / 2;
        } else {
          textAlign = "left";
          x2 -= widest;
        }
      } else {
        x2 = this.left + tickAndPadding;
        if (crossAlign === "near") {
          textAlign = "left";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x2 += widest / 2;
        } else {
          textAlign = "right";
          x2 = this.right;
        }
      }
    } else {
      textAlign = "right";
    }
    return {
      textAlign,
      x: x2
    };
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror) {
      return;
    }
    const chart = this.chart;
    const position = this.options.position;
    if (position === "left" || position === "right") {
      return {
        top: 0,
        left: this.left,
        bottom: chart.height,
        right: this.right
      };
    }
    if (position === "top" || position === "bottom") {
      return {
        top: this.top,
        left: 0,
        bottom: this.bottom,
        right: chart.width
      };
    }
  }
  drawBackground() {
    const { ctx, options: { backgroundColor }, left, top, width, height } = this;
    if (backgroundColor) {
      ctx.save();
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(left, top, width, height);
      ctx.restore();
    }
  }
  getLineWidthForValue(value) {
    const grid = this.options.grid;
    if (!this._isVisible() || !grid.display) {
      return 0;
    }
    const ticks = this.ticks;
    const index2 = ticks.findIndex((t2) => t2.value === value);
    if (index2 >= 0) {
      const opts = grid.setContext(this.getContext(index2));
      return opts.lineWidth;
    }
    return 0;
  }
  drawGrid(chartArea) {
    const grid = this.options.grid;
    const ctx = this.ctx;
    const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
    let i2, ilen;
    const drawLine = (p1, p2, style) => {
      if (!style.width || !style.color) {
        return;
      }
      ctx.save();
      ctx.lineWidth = style.width;
      ctx.strokeStyle = style.color;
      ctx.setLineDash(style.borderDash || []);
      ctx.lineDashOffset = style.borderDashOffset;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.restore();
    };
    if (grid.display) {
      for (i2 = 0, ilen = items.length; i2 < ilen; ++i2) {
        const item = items[i2];
        if (grid.drawOnChartArea) {
          drawLine({
            x: item.x1,
            y: item.y1
          }, {
            x: item.x2,
            y: item.y2
          }, item);
        }
        if (grid.drawTicks) {
          drawLine({
            x: item.tx1,
            y: item.ty1
          }, {
            x: item.tx2,
            y: item.ty2
          }, {
            color: item.tickColor,
            width: item.tickWidth,
            borderDash: item.tickBorderDash,
            borderDashOffset: item.tickBorderDashOffset
          });
        }
      }
    }
  }
  drawBorder() {
    const { chart, ctx, options: { border, grid } } = this;
    const borderOpts = border.setContext(this.getContext());
    const axisWidth = border.display ? borderOpts.width : 0;
    if (!axisWidth) {
      return;
    }
    const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
    const borderValue = this._borderValue;
    let x1, x2, y1, y2;
    if (this.isHorizontal()) {
      x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
      x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
      y1 = y2 = borderValue;
    } else {
      y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
      y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
      x1 = x2 = borderValue;
    }
    ctx.save();
    ctx.lineWidth = borderOpts.width;
    ctx.strokeStyle = borderOpts.color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
  drawLabels(chartArea) {
    const optionTicks = this.options.ticks;
    if (!optionTicks.display) {
      return;
    }
    const ctx = this.ctx;
    const area = this._computeLabelArea();
    if (area) {
      clipArea(ctx, area);
    }
    const items = this.getLabelItems(chartArea);
    for (const item of items) {
      const renderTextOptions = item.options;
      const tickFont = item.font;
      const label = item.label;
      const y2 = item.textOffset;
      renderText(ctx, label, 0, y2, tickFont, renderTextOptions);
    }
    if (area) {
      unclipArea(ctx);
    }
  }
  drawTitle() {
    const { ctx, options: { position, title, reverse } } = this;
    if (!title.display) {
      return;
    }
    const font = toFont(title.font);
    const padding = toPadding(title.padding);
    const align = title.align;
    let offset = font.lineHeight / 2;
    if (position === "bottom" || position === "center" || isObject(position)) {
      offset += padding.bottom;
      if (isArray(title.text)) {
        offset += font.lineHeight * (title.text.length - 1);
      }
    } else {
      offset += padding.top;
    }
    const { titleX, titleY, maxWidth, rotation } = titleArgs(this, offset, position, align);
    renderText(ctx, title.text, 0, 0, font, {
      color: title.color,
      maxWidth,
      rotation,
      textAlign: titleAlign(align, position, reverse),
      textBaseline: "middle",
      translation: [
        titleX,
        titleY
      ]
    });
  }
  draw(chartArea) {
    if (!this._isVisible()) {
      return;
    }
    this.drawBackground();
    this.drawGrid(chartArea);
    this.drawBorder();
    this.drawTitle();
    this.drawLabels(chartArea);
  }
  _layers() {
    const opts = this.options;
    const tz = opts.ticks && opts.ticks.z || 0;
    const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
    const bz = valueOrDefault(opts.border && opts.border.z, 0);
    if (!this._isVisible() || this.draw !== _Scale.prototype.draw) {
      return [
        {
          z: tz,
          draw: (chartArea) => {
            this.draw(chartArea);
          }
        }
      ];
    }
    return [
      {
        z: gz,
        draw: (chartArea) => {
          this.drawBackground();
          this.drawGrid(chartArea);
          this.drawTitle();
        }
      },
      {
        z: bz,
        draw: () => {
          this.drawBorder();
        }
      },
      {
        z: tz,
        draw: (chartArea) => {
          this.drawLabels(chartArea);
        }
      }
    ];
  }
  getMatchingVisibleMetas(type) {
    const metas = this.chart.getSortedVisibleDatasetMetas();
    const axisID = this.axis + "AxisID";
    const result = [];
    let i2, ilen;
    for (i2 = 0, ilen = metas.length; i2 < ilen; ++i2) {
      const meta = metas[i2];
      if (meta[axisID] === this.id && (!type || meta.type === type)) {
        result.push(meta);
      }
    }
    return result;
  }
  _resolveTickFontOptions(index2) {
    const opts = this.options.ticks.setContext(this.getContext(index2));
    return toFont(opts.font);
  }
  _maxDigits() {
    const fontSize = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / fontSize;
  }
};
var TypedRegistry = class {
  constructor(type, scope, override) {
    this.type = type;
    this.scope = scope;
    this.override = override;
    this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(type) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
  }
  register(item) {
    const proto = Object.getPrototypeOf(item);
    let parentScope;
    if (isIChartComponent(proto)) {
      parentScope = this.register(proto);
    }
    const items = this.items;
    const id = item.id;
    const scope = this.scope + "." + id;
    if (!id) {
      throw new Error("class does not have id: " + item);
    }
    if (id in items) {
      return scope;
    }
    items[id] = item;
    registerDefaults(item, scope, parentScope);
    if (this.override) {
      defaults.override(item.id, item.overrides);
    }
    return scope;
  }
  get(id) {
    return this.items[id];
  }
  unregister(item) {
    const items = this.items;
    const id = item.id;
    const scope = this.scope;
    if (id in items) {
      delete items[id];
    }
    if (scope && id in defaults[scope]) {
      delete defaults[scope][id];
      if (this.override) {
        delete overrides[id];
      }
    }
  }
};
function registerDefaults(item, scope, parentScope) {
  const itemDefaults = merge(/* @__PURE__ */ Object.create(null), [
    parentScope ? defaults.get(parentScope) : {},
    defaults.get(scope),
    item.defaults
  ]);
  defaults.set(scope, itemDefaults);
  if (item.defaultRoutes) {
    routeDefaults(scope, item.defaultRoutes);
  }
  if (item.descriptors) {
    defaults.describe(scope, item.descriptors);
  }
}
function routeDefaults(scope, routes) {
  Object.keys(routes).forEach((property) => {
    const propertyParts = property.split(".");
    const sourceName = propertyParts.pop();
    const sourceScope = [
      scope
    ].concat(propertyParts).join(".");
    const parts = routes[property].split(".");
    const targetName = parts.pop();
    const targetScope = parts.join(".");
    defaults.route(sourceScope, sourceName, targetScope, targetName);
  });
}
function isIChartComponent(proto) {
  return "id" in proto && "defaults" in proto;
}
var Registry = class {
  constructor() {
    this.controllers = new TypedRegistry(DatasetController, "datasets", true);
    this.elements = new TypedRegistry(Element2, "elements");
    this.plugins = new TypedRegistry(Object, "plugins");
    this.scales = new TypedRegistry(Scale, "scales");
    this._typedRegistries = [
      this.controllers,
      this.scales,
      this.elements
    ];
  }
  add(...args) {
    this._each("register", args);
  }
  remove(...args) {
    this._each("unregister", args);
  }
  addControllers(...args) {
    this._each("register", args, this.controllers);
  }
  addElements(...args) {
    this._each("register", args, this.elements);
  }
  addPlugins(...args) {
    this._each("register", args, this.plugins);
  }
  addScales(...args) {
    this._each("register", args, this.scales);
  }
  getController(id) {
    return this._get(id, this.controllers, "controller");
  }
  getElement(id) {
    return this._get(id, this.elements, "element");
  }
  getPlugin(id) {
    return this._get(id, this.plugins, "plugin");
  }
  getScale(id) {
    return this._get(id, this.scales, "scale");
  }
  removeControllers(...args) {
    this._each("unregister", args, this.controllers);
  }
  removeElements(...args) {
    this._each("unregister", args, this.elements);
  }
  removePlugins(...args) {
    this._each("unregister", args, this.plugins);
  }
  removeScales(...args) {
    this._each("unregister", args, this.scales);
  }
  _each(method, args, typedRegistry) {
    [
      ...args
    ].forEach((arg) => {
      const reg = typedRegistry || this._getRegistryForType(arg);
      if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
        this._exec(method, reg, arg);
      } else {
        each(arg, (item) => {
          const itemReg = typedRegistry || this._getRegistryForType(item);
          this._exec(method, itemReg, item);
        });
      }
    });
  }
  _exec(method, registry2, component) {
    const camelMethod = _capitalize(method);
    callback(component["before" + camelMethod], [], component);
    registry2[method](component);
    callback(component["after" + camelMethod], [], component);
  }
  _getRegistryForType(type) {
    for (let i2 = 0; i2 < this._typedRegistries.length; i2++) {
      const reg = this._typedRegistries[i2];
      if (reg.isForType(type)) {
        return reg;
      }
    }
    return this.plugins;
  }
  _get(id, typedRegistry, type) {
    const item = typedRegistry.get(id);
    if (item === void 0) {
      throw new Error('"' + id + '" is not a registered ' + type + ".");
    }
    return item;
  }
};
var registry = /* @__PURE__ */ new Registry();
var PluginService = class {
  constructor() {
    this._init = void 0;
  }
  notify(chart, hook, args, filter) {
    if (hook === "beforeInit") {
      this._init = this._createDescriptors(chart, true);
      this._notify(this._init, chart, "install");
    }
    if (this._init === void 0) {
      return;
    }
    const descriptors2 = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
    const result = this._notify(descriptors2, chart, hook, args);
    if (hook === "afterDestroy") {
      this._notify(descriptors2, chart, "stop");
      this._notify(this._init, chart, "uninstall");
      this._init = void 0;
    }
    return result;
  }
  _notify(descriptors2, chart, hook, args) {
    args = args || {};
    for (const descriptor of descriptors2) {
      const plugin = descriptor.plugin;
      const method = plugin[hook];
      const params = [
        chart,
        args,
        descriptor.options
      ];
      if (callback(method, params, plugin) === false && args.cancelable) {
        return false;
      }
    }
    return true;
  }
  invalidate() {
    if (!isNullOrUndef(this._cache)) {
      this._oldCache = this._cache;
      this._cache = void 0;
    }
  }
  _descriptors(chart) {
    if (this._cache) {
      return this._cache;
    }
    const descriptors2 = this._cache = this._createDescriptors(chart);
    this._notifyStateChanges(chart);
    return descriptors2;
  }
  _createDescriptors(chart, all) {
    const config = chart && chart.config;
    const options = valueOrDefault(config.options && config.options.plugins, {});
    const plugins2 = allPlugins(config);
    return options === false && !all ? [] : createDescriptors(chart, plugins2, options, all);
  }
  _notifyStateChanges(chart) {
    const previousDescriptors = this._oldCache || [];
    const descriptors2 = this._cache;
    const diff = (a2, b2) => a2.filter((x2) => !b2.some((y2) => x2.plugin.id === y2.plugin.id));
    this._notify(diff(previousDescriptors, descriptors2), chart, "stop");
    this._notify(diff(descriptors2, previousDescriptors), chart, "start");
  }
};
function allPlugins(config) {
  const localIds = {};
  const plugins2 = [];
  const keys = Object.keys(registry.plugins.items);
  for (let i2 = 0; i2 < keys.length; i2++) {
    plugins2.push(registry.getPlugin(keys[i2]));
  }
  const local = config.plugins || [];
  for (let i2 = 0; i2 < local.length; i2++) {
    const plugin = local[i2];
    if (plugins2.indexOf(plugin) === -1) {
      plugins2.push(plugin);
      localIds[plugin.id] = true;
    }
  }
  return {
    plugins: plugins2,
    localIds
  };
}
function getOpts(options, all) {
  if (!all && options === false) {
    return null;
  }
  if (options === true) {
    return {};
  }
  return options;
}
function createDescriptors(chart, { plugins: plugins2, localIds }, options, all) {
  const result = [];
  const context = chart.getContext();
  for (const plugin of plugins2) {
    const id = plugin.id;
    const opts = getOpts(options[id], all);
    if (opts === null) {
      continue;
    }
    result.push({
      plugin,
      options: pluginOpts(chart.config, {
        plugin,
        local: localIds[id]
      }, opts, context)
    });
  }
  return result;
}
function pluginOpts(config, { plugin, local }, opts, context) {
  const keys = config.pluginScopeKeys(plugin);
  const scopes = config.getOptionScopes(opts, keys);
  if (local && plugin.defaults) {
    scopes.push(plugin.defaults);
  }
  return config.createResolver(scopes, context, [
    ""
  ], {
    scriptable: false,
    indexable: false,
    allKeys: true
  });
}
function getIndexAxis(type, options) {
  const datasetDefaults = defaults.datasets[type] || {};
  const datasetOptions = (options.datasets || {})[type] || {};
  return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || "x";
}
function getAxisFromDefaultScaleID(id, indexAxis) {
  let axis = id;
  if (id === "_index_") {
    axis = indexAxis;
  } else if (id === "_value_") {
    axis = indexAxis === "x" ? "y" : "x";
  }
  return axis;
}
function getDefaultScaleIDFromAxis(axis, indexAxis) {
  return axis === indexAxis ? "_index_" : "_value_";
}
function idMatchesAxis(id) {
  if (id === "x" || id === "y" || id === "r") {
    return id;
  }
}
function axisFromPosition(position) {
  if (position === "top" || position === "bottom") {
    return "x";
  }
  if (position === "left" || position === "right") {
    return "y";
  }
}
function determineAxis(id, ...scaleOptions) {
  if (idMatchesAxis(id)) {
    return id;
  }
  for (const opts of scaleOptions) {
    const axis = opts.axis || axisFromPosition(opts.position) || id.length > 1 && idMatchesAxis(id[0].toLowerCase());
    if (axis) {
      return axis;
    }
  }
  throw new Error(`Cannot determine type of '${id}' axis. Please provide 'axis' or 'position' option.`);
}
function getAxisFromDataset(id, axis, dataset) {
  if (dataset[axis + "AxisID"] === id) {
    return {
      axis
    };
  }
}
function retrieveAxisFromDatasets(id, config) {
  if (config.data && config.data.datasets) {
    const boundDs = config.data.datasets.filter((d2) => d2.xAxisID === id || d2.yAxisID === id);
    if (boundDs.length) {
      return getAxisFromDataset(id, "x", boundDs[0]) || getAxisFromDataset(id, "y", boundDs[0]);
    }
  }
  return {};
}
function mergeScaleConfig(config, options) {
  const chartDefaults = overrides[config.type] || {
    scales: {}
  };
  const configScales = options.scales || {};
  const chartIndexAxis = getIndexAxis(config.type, options);
  const scales2 = /* @__PURE__ */ Object.create(null);
  Object.keys(configScales).forEach((id) => {
    const scaleConf = configScales[id];
    if (!isObject(scaleConf)) {
      return console.error(`Invalid scale configuration for scale: ${id}`);
    }
    if (scaleConf._proxy) {
      return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
    }
    const axis = determineAxis(id, scaleConf, retrieveAxisFromDatasets(id, config), defaults.scales[scaleConf.type]);
    const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
    const defaultScaleOptions = chartDefaults.scales || {};
    scales2[id] = mergeIf(/* @__PURE__ */ Object.create(null), [
      {
        axis
      },
      scaleConf,
      defaultScaleOptions[axis],
      defaultScaleOptions[defaultId]
    ]);
  });
  config.data.datasets.forEach((dataset) => {
    const type = dataset.type || config.type;
    const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
    const datasetDefaults = overrides[type] || {};
    const defaultScaleOptions = datasetDefaults.scales || {};
    Object.keys(defaultScaleOptions).forEach((defaultID) => {
      const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
      const id = dataset[axis + "AxisID"] || axis;
      scales2[id] = scales2[id] || /* @__PURE__ */ Object.create(null);
      mergeIf(scales2[id], [
        {
          axis
        },
        configScales[id],
        defaultScaleOptions[defaultID]
      ]);
    });
  });
  Object.keys(scales2).forEach((key) => {
    const scale = scales2[key];
    mergeIf(scale, [
      defaults.scales[scale.type],
      defaults.scale
    ]);
  });
  return scales2;
}
function initOptions(config) {
  const options = config.options || (config.options = {});
  options.plugins = valueOrDefault(options.plugins, {});
  options.scales = mergeScaleConfig(config, options);
}
function initData(data) {
  data = data || {};
  data.datasets = data.datasets || [];
  data.labels = data.labels || [];
  return data;
}
function initConfig(config) {
  config = config || {};
  config.data = initData(config.data);
  initOptions(config);
  return config;
}
var keyCache = /* @__PURE__ */ new Map();
var keysCached = /* @__PURE__ */ new Set();
function cachedKeys(cacheKey, generate) {
  let keys = keyCache.get(cacheKey);
  if (!keys) {
    keys = generate();
    keyCache.set(cacheKey, keys);
    keysCached.add(keys);
  }
  return keys;
}
var addIfFound = (set2, obj, key) => {
  const opts = resolveObjectKey(obj, key);
  if (opts !== void 0) {
    set2.add(opts);
  }
};
var Config = class {
  constructor(config) {
    this._config = initConfig(config);
    this._scopeCache = /* @__PURE__ */ new Map();
    this._resolverCache = /* @__PURE__ */ new Map();
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(type) {
    this._config.type = type;
  }
  get data() {
    return this._config.data;
  }
  set data(data) {
    this._config.data = initData(data);
  }
  get options() {
    return this._config.options;
  }
  set options(options) {
    this._config.options = options;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const config = this._config;
    this.clearCache();
    initOptions(config);
  }
  clearCache() {
    this._scopeCache.clear();
    this._resolverCache.clear();
  }
  datasetScopeKeys(datasetType) {
    return cachedKeys(datasetType, () => [
      [
        `datasets.${datasetType}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(datasetType, transition) {
    return cachedKeys(`${datasetType}.transition.${transition}`, () => [
      [
        `datasets.${datasetType}.transitions.${transition}`,
        `transitions.${transition}`
      ],
      [
        `datasets.${datasetType}`,
        ""
      ]
    ]);
  }
  datasetElementScopeKeys(datasetType, elementType) {
    return cachedKeys(`${datasetType}-${elementType}`, () => [
      [
        `datasets.${datasetType}.elements.${elementType}`,
        `datasets.${datasetType}`,
        `elements.${elementType}`,
        ""
      ]
    ]);
  }
  pluginScopeKeys(plugin) {
    const id = plugin.id;
    const type = this.type;
    return cachedKeys(`${type}-plugin-${id}`, () => [
      [
        `plugins.${id}`,
        ...plugin.additionalOptionScopes || []
      ]
    ]);
  }
  _cachedScopes(mainScope, resetCache) {
    const _scopeCache = this._scopeCache;
    let cache = _scopeCache.get(mainScope);
    if (!cache || resetCache) {
      cache = /* @__PURE__ */ new Map();
      _scopeCache.set(mainScope, cache);
    }
    return cache;
  }
  getOptionScopes(mainScope, keyLists, resetCache) {
    const { options, type } = this;
    const cache = this._cachedScopes(mainScope, resetCache);
    const cached = cache.get(keyLists);
    if (cached) {
      return cached;
    }
    const scopes = /* @__PURE__ */ new Set();
    keyLists.forEach((keys) => {
      if (mainScope) {
        scopes.add(mainScope);
        keys.forEach((key) => addIfFound(scopes, mainScope, key));
      }
      keys.forEach((key) => addIfFound(scopes, options, key));
      keys.forEach((key) => addIfFound(scopes, overrides[type] || {}, key));
      keys.forEach((key) => addIfFound(scopes, defaults, key));
      keys.forEach((key) => addIfFound(scopes, descriptors, key));
    });
    const array = Array.from(scopes);
    if (array.length === 0) {
      array.push(/* @__PURE__ */ Object.create(null));
    }
    if (keysCached.has(keyLists)) {
      cache.set(keyLists, array);
    }
    return array;
  }
  chartOptionScopes() {
    const { options, type } = this;
    return [
      options,
      overrides[type] || {},
      defaults.datasets[type] || {},
      {
        type
      },
      defaults,
      descriptors
    ];
  }
  resolveNamedOptions(scopes, names2, context, prefixes = [
    ""
  ]) {
    const result = {
      $shared: true
    };
    const { resolver, subPrefixes } = getResolver(this._resolverCache, scopes, prefixes);
    let options = resolver;
    if (needContext(resolver, names2)) {
      result.$shared = false;
      context = isFunction(context) ? context() : context;
      const subResolver = this.createResolver(scopes, context, subPrefixes);
      options = _attachContext(resolver, context, subResolver);
    }
    for (const prop of names2) {
      result[prop] = options[prop];
    }
    return result;
  }
  createResolver(scopes, context, prefixes = [
    ""
  ], descriptorDefaults) {
    const { resolver } = getResolver(this._resolverCache, scopes, prefixes);
    return isObject(context) ? _attachContext(resolver, context, void 0, descriptorDefaults) : resolver;
  }
};
function getResolver(resolverCache, scopes, prefixes) {
  let cache = resolverCache.get(scopes);
  if (!cache) {
    cache = /* @__PURE__ */ new Map();
    resolverCache.set(scopes, cache);
  }
  const cacheKey = prefixes.join();
  let cached = cache.get(cacheKey);
  if (!cached) {
    const resolver = _createResolver(scopes, prefixes);
    cached = {
      resolver,
      subPrefixes: prefixes.filter((p2) => !p2.toLowerCase().includes("hover"))
    };
    cache.set(cacheKey, cached);
  }
  return cached;
}
var hasFunction = (value) => isObject(value) && Object.getOwnPropertyNames(value).some((key) => isFunction(value[key]));
function needContext(proxy, names2) {
  const { isScriptable, isIndexable } = _descriptors(proxy);
  for (const prop of names2) {
    const scriptable = isScriptable(prop);
    const indexable = isIndexable(prop);
    const value = (indexable || scriptable) && proxy[prop];
    if (scriptable && (isFunction(value) || hasFunction(value)) || indexable && isArray(value)) {
      return true;
    }
  }
  return false;
}
var version = "4.5.1";
var KNOWN_POSITIONS = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function positionIsHorizontal(position, axis) {
  return position === "top" || position === "bottom" || KNOWN_POSITIONS.indexOf(position) === -1 && axis === "x";
}
function compare2Level(l1, l2) {
  return function(a2, b2) {
    return a2[l1] === b2[l1] ? a2[l2] - b2[l2] : a2[l1] - b2[l1];
  };
}
function onAnimationsComplete(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  chart.notifyPlugins("afterRender");
  callback(animationOptions && animationOptions.onComplete, [
    context
  ], chart);
}
function onAnimationProgress(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  callback(animationOptions && animationOptions.onProgress, [
    context
  ], chart);
}
function getCanvas(item) {
  if (_isDomSupported() && typeof item === "string") {
    item = document.getElementById(item);
  } else if (item && item.length) {
    item = item[0];
  }
  if (item && item.canvas) {
    item = item.canvas;
  }
  return item;
}
var instances = {};
var getChart = (key) => {
  const canvas = getCanvas(key);
  return Object.values(instances).filter((c2) => c2.canvas === canvas).pop();
};
function moveNumericKeys(obj, start, move) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    const intKey = +key;
    if (intKey >= start) {
      const value = obj[key];
      delete obj[key];
      if (move > 0 || intKey > start) {
        obj[intKey + move] = value;
      }
    }
  }
}
function determineLastEvent(e2, lastEvent, inChartArea, isClick) {
  if (!inChartArea || e2.type === "mouseout") {
    return null;
  }
  if (isClick) {
    return lastEvent;
  }
  return e2;
}
var Chart = class {
  static defaults = defaults;
  static instances = instances;
  static overrides = overrides;
  static registry = registry;
  static version = version;
  static getChart = getChart;
  static register(...items) {
    registry.add(...items);
    invalidatePlugins();
  }
  static unregister(...items) {
    registry.remove(...items);
    invalidatePlugins();
  }
  constructor(item, userConfig) {
    const config = this.config = new Config(userConfig);
    const initialCanvas = getCanvas(item);
    const existingChart = getChart(initialCanvas);
    if (existingChart) {
      throw new Error("Canvas is already in use. Chart with ID '" + existingChart.id + "' must be destroyed before the canvas with ID '" + existingChart.canvas.id + "' can be reused.");
    }
    const options = config.createResolver(config.chartOptionScopes(), this.getContext());
    this.platform = new (config.platform || _detectPlatform(initialCanvas))();
    this.platform.updateConfig(config);
    const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
    const canvas = context && context.canvas;
    const height = canvas && canvas.height;
    const width = canvas && canvas.width;
    this.id = uid();
    this.ctx = context;
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this._options = options;
    this._aspectRatio = this.aspectRatio;
    this._layers = [];
    this._metasets = [];
    this._stacks = void 0;
    this.boxes = [];
    this.currentDevicePixelRatio = void 0;
    this.chartArea = void 0;
    this._active = [];
    this._lastEvent = void 0;
    this._listeners = {};
    this._responsiveListeners = void 0;
    this._sortedMetasets = [];
    this.scales = {};
    this._plugins = new PluginService();
    this.$proxies = {};
    this._hiddenIndices = {};
    this.attached = false;
    this._animationsDisabled = void 0;
    this.$context = void 0;
    this._doResize = debounce((mode) => this.update(mode), options.resizeDelay || 0);
    this._dataChanges = [];
    instances[this.id] = this;
    if (!context || !canvas) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    animator.listen(this, "complete", onAnimationsComplete);
    animator.listen(this, "progress", onAnimationProgress);
    this._initialize();
    if (this.attached) {
      this.update();
    }
  }
  get aspectRatio() {
    const { options: { aspectRatio, maintainAspectRatio }, width, height, _aspectRatio } = this;
    if (!isNullOrUndef(aspectRatio)) {
      return aspectRatio;
    }
    if (maintainAspectRatio && _aspectRatio) {
      return _aspectRatio;
    }
    return height ? width / height : null;
  }
  get data() {
    return this.config.data;
  }
  set data(data) {
    this.config.data = data;
  }
  get options() {
    return this._options;
  }
  set options(options) {
    this.config.options = options;
  }
  get registry() {
    return registry;
  }
  _initialize() {
    this.notifyPlugins("beforeInit");
    if (this.options.responsive) {
      this.resize();
    } else {
      retinaScale(this, this.options.devicePixelRatio);
    }
    this.bindEvents();
    this.notifyPlugins("afterInit");
    return this;
  }
  clear() {
    clearCanvas(this.canvas, this.ctx);
    return this;
  }
  stop() {
    animator.stop(this);
    return this;
  }
  resize(width, height) {
    if (!animator.running(this)) {
      this._resize(width, height);
    } else {
      this._resizeBeforeDraw = {
        width,
        height
      };
    }
  }
  _resize(width, height) {
    const options = this.options;
    const canvas = this.canvas;
    const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
    const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
    const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
    const mode = this.width ? "resize" : "attach";
    this.width = newSize.width;
    this.height = newSize.height;
    this._aspectRatio = this.aspectRatio;
    if (!retinaScale(this, newRatio, true)) {
      return;
    }
    this.notifyPlugins("resize", {
      size: newSize
    });
    callback(options.onResize, [
      this,
      newSize
    ], this);
    if (this.attached) {
      if (this._doResize(mode)) {
        this.render();
      }
    }
  }
  ensureScalesHaveIDs() {
    const options = this.options;
    const scalesOptions = options.scales || {};
    each(scalesOptions, (axisOptions, axisID) => {
      axisOptions.id = axisID;
    });
  }
  buildOrUpdateScales() {
    const options = this.options;
    const scaleOpts = options.scales;
    const scales2 = this.scales;
    const updated = Object.keys(scales2).reduce((obj, id) => {
      obj[id] = false;
      return obj;
    }, {});
    let items = [];
    if (scaleOpts) {
      items = items.concat(Object.keys(scaleOpts).map((id) => {
        const scaleOptions = scaleOpts[id];
        const axis = determineAxis(id, scaleOptions);
        const isRadial = axis === "r";
        const isHorizontal = axis === "x";
        return {
          options: scaleOptions,
          dposition: isRadial ? "chartArea" : isHorizontal ? "bottom" : "left",
          dtype: isRadial ? "radialLinear" : isHorizontal ? "category" : "linear"
        };
      }));
    }
    each(items, (item) => {
      const scaleOptions = item.options;
      const id = scaleOptions.id;
      const axis = determineAxis(id, scaleOptions);
      const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
      if (scaleOptions.position === void 0 || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
        scaleOptions.position = item.dposition;
      }
      updated[id] = true;
      let scale = null;
      if (id in scales2 && scales2[id].type === scaleType) {
        scale = scales2[id];
      } else {
        const scaleClass = registry.getScale(scaleType);
        scale = new scaleClass({
          id,
          type: scaleType,
          ctx: this.ctx,
          chart: this
        });
        scales2[scale.id] = scale;
      }
      scale.init(scaleOptions, options);
    });
    each(updated, (hasUpdated, id) => {
      if (!hasUpdated) {
        delete scales2[id];
      }
    });
    each(scales2, (scale) => {
      layouts.configure(this, scale, scale.options);
      layouts.addBox(this, scale);
    });
  }
  _updateMetasets() {
    const metasets = this._metasets;
    const numData = this.data.datasets.length;
    const numMeta = metasets.length;
    metasets.sort((a2, b2) => a2.index - b2.index);
    if (numMeta > numData) {
      for (let i2 = numData; i2 < numMeta; ++i2) {
        this._destroyDatasetMeta(i2);
      }
      metasets.splice(numData, numMeta - numData);
    }
    this._sortedMetasets = metasets.slice(0).sort(compare2Level("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const { _metasets: metasets, data: { datasets } } = this;
    if (metasets.length > datasets.length) {
      delete this._stacks;
    }
    metasets.forEach((meta, index2) => {
      if (datasets.filter((x2) => x2 === meta._dataset).length === 0) {
        this._destroyDatasetMeta(index2);
      }
    });
  }
  buildOrUpdateControllers() {
    const newControllers = [];
    const datasets = this.data.datasets;
    let i2, ilen;
    this._removeUnreferencedMetasets();
    for (i2 = 0, ilen = datasets.length; i2 < ilen; i2++) {
      const dataset = datasets[i2];
      let meta = this.getDatasetMeta(i2);
      const type = dataset.type || this.config.type;
      if (meta.type && meta.type !== type) {
        this._destroyDatasetMeta(i2);
        meta = this.getDatasetMeta(i2);
      }
      meta.type = type;
      meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
      meta.order = dataset.order || 0;
      meta.index = i2;
      meta.label = "" + dataset.label;
      meta.visible = this.isDatasetVisible(i2);
      if (meta.controller) {
        meta.controller.updateIndex(i2);
        meta.controller.linkScales();
      } else {
        const ControllerClass = registry.getController(type);
        const { datasetElementType, dataElementType } = defaults.datasets[type];
        Object.assign(ControllerClass, {
          dataElementType: registry.getElement(dataElementType),
          datasetElementType: datasetElementType && registry.getElement(datasetElementType)
        });
        meta.controller = new ControllerClass(this, i2);
        newControllers.push(meta.controller);
      }
    }
    this._updateMetasets();
    return newControllers;
  }
  _resetElements() {
    each(this.data.datasets, (dataset, datasetIndex) => {
      this.getDatasetMeta(datasetIndex).controller.reset();
    }, this);
  }
  reset() {
    this._resetElements();
    this.notifyPlugins("reset");
  }
  update(mode) {
    const config = this.config;
    config.update();
    const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
    const animsDisabled = this._animationsDisabled = !options.animation;
    this._updateScales();
    this._checkEventBindings();
    this._updateHiddenIndices();
    this._plugins.invalidate();
    if (this.notifyPlugins("beforeUpdate", {
      mode,
      cancelable: true
    }) === false) {
      return;
    }
    const newControllers = this.buildOrUpdateControllers();
    this.notifyPlugins("beforeElementsUpdate");
    let minPadding = 0;
    for (let i2 = 0, ilen = this.data.datasets.length; i2 < ilen; i2++) {
      const { controller } = this.getDatasetMeta(i2);
      const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
      controller.buildOrUpdateElements(reset);
      minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
    }
    minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
    this._updateLayout(minPadding);
    if (!animsDisabled) {
      each(newControllers, (controller) => {
        controller.reset();
      });
    }
    this._updateDatasets(mode);
    this.notifyPlugins("afterUpdate", {
      mode
    });
    this._layers.sort(compare2Level("z", "_idx"));
    const { _active, _lastEvent } = this;
    if (_lastEvent) {
      this._eventHandler(_lastEvent, true);
    } else if (_active.length) {
      this._updateHoverStyles(_active, _active, true);
    }
    this.render();
  }
  _updateScales() {
    each(this.scales, (scale) => {
      layouts.removeBox(this, scale);
    });
    this.ensureScalesHaveIDs();
    this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const options = this.options;
    const existingEvents = new Set(Object.keys(this._listeners));
    const newEvents = new Set(options.events);
    if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
      this.unbindEvents();
      this.bindEvents();
    }
  }
  _updateHiddenIndices() {
    const { _hiddenIndices } = this;
    const changes = this._getUniformDataChanges() || [];
    for (const { method, start, count } of changes) {
      const move = method === "_removeElements" ? -count : count;
      moveNumericKeys(_hiddenIndices, start, move);
    }
  }
  _getUniformDataChanges() {
    const _dataChanges = this._dataChanges;
    if (!_dataChanges || !_dataChanges.length) {
      return;
    }
    this._dataChanges = [];
    const datasetCount = this.data.datasets.length;
    const makeSet = (idx) => new Set(_dataChanges.filter((c2) => c2[0] === idx).map((c2, i2) => i2 + "," + c2.splice(1).join(",")));
    const changeSet = makeSet(0);
    for (let i2 = 1; i2 < datasetCount; i2++) {
      if (!setsEqual(changeSet, makeSet(i2))) {
        return;
      }
    }
    return Array.from(changeSet).map((c2) => c2.split(",")).map((a2) => ({
      method: a2[1],
      start: +a2[2],
      count: +a2[3]
    }));
  }
  _updateLayout(minPadding) {
    if (this.notifyPlugins("beforeLayout", {
      cancelable: true
    }) === false) {
      return;
    }
    layouts.update(this, this.width, this.height, minPadding);
    const area = this.chartArea;
    const noArea = area.width <= 0 || area.height <= 0;
    this._layers = [];
    each(this.boxes, (box) => {
      if (noArea && box.position === "chartArea") {
        return;
      }
      if (box.configure) {
        box.configure();
      }
      this._layers.push(...box._layers());
    }, this);
    this._layers.forEach((item, index2) => {
      item._idx = index2;
    });
    this.notifyPlugins("afterLayout");
  }
  _updateDatasets(mode) {
    if (this.notifyPlugins("beforeDatasetsUpdate", {
      mode,
      cancelable: true
    }) === false) {
      return;
    }
    for (let i2 = 0, ilen = this.data.datasets.length; i2 < ilen; ++i2) {
      this.getDatasetMeta(i2).controller.configure();
    }
    for (let i2 = 0, ilen = this.data.datasets.length; i2 < ilen; ++i2) {
      this._updateDataset(i2, isFunction(mode) ? mode({
        datasetIndex: i2
      }) : mode);
    }
    this.notifyPlugins("afterDatasetsUpdate", {
      mode
    });
  }
  _updateDataset(index2, mode) {
    const meta = this.getDatasetMeta(index2);
    const args = {
      meta,
      index: index2,
      mode,
      cancelable: true
    };
    if (this.notifyPlugins("beforeDatasetUpdate", args) === false) {
      return;
    }
    meta.controller._update(mode);
    args.cancelable = false;
    this.notifyPlugins("afterDatasetUpdate", args);
  }
  render() {
    if (this.notifyPlugins("beforeRender", {
      cancelable: true
    }) === false) {
      return;
    }
    if (animator.has(this)) {
      if (this.attached && !animator.running(this)) {
        animator.start(this);
      }
    } else {
      this.draw();
      onAnimationsComplete({
        chart: this
      });
    }
  }
  draw() {
    let i2;
    if (this._resizeBeforeDraw) {
      const { width, height } = this._resizeBeforeDraw;
      this._resizeBeforeDraw = null;
      this._resize(width, height);
    }
    this.clear();
    if (this.width <= 0 || this.height <= 0) {
      return;
    }
    if (this.notifyPlugins("beforeDraw", {
      cancelable: true
    }) === false) {
      return;
    }
    const layers = this._layers;
    for (i2 = 0; i2 < layers.length && layers[i2].z <= 0; ++i2) {
      layers[i2].draw(this.chartArea);
    }
    this._drawDatasets();
    for (; i2 < layers.length; ++i2) {
      layers[i2].draw(this.chartArea);
    }
    this.notifyPlugins("afterDraw");
  }
  _getSortedDatasetMetas(filterVisible) {
    const metasets = this._sortedMetasets;
    const result = [];
    let i2, ilen;
    for (i2 = 0, ilen = metasets.length; i2 < ilen; ++i2) {
      const meta = metasets[i2];
      if (!filterVisible || meta.visible) {
        result.push(meta);
      }
    }
    return result;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(true);
  }
  _drawDatasets() {
    if (this.notifyPlugins("beforeDatasetsDraw", {
      cancelable: true
    }) === false) {
      return;
    }
    const metasets = this.getSortedVisibleDatasetMetas();
    for (let i2 = metasets.length - 1; i2 >= 0; --i2) {
      this._drawDataset(metasets[i2]);
    }
    this.notifyPlugins("afterDatasetsDraw");
  }
  _drawDataset(meta) {
    const ctx = this.ctx;
    const args = {
      meta,
      index: meta.index,
      cancelable: true
    };
    const clip = getDatasetClipArea(this, meta);
    if (this.notifyPlugins("beforeDatasetDraw", args) === false) {
      return;
    }
    if (clip) {
      clipArea(ctx, clip);
    }
    meta.controller.draw();
    if (clip) {
      unclipArea(ctx);
    }
    args.cancelable = false;
    this.notifyPlugins("afterDatasetDraw", args);
  }
  isPointInArea(point) {
    return _isPointInArea(point, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(e2, mode, options, useFinalPosition) {
    const method = Interaction.modes[mode];
    if (typeof method === "function") {
      return method(this, e2, options, useFinalPosition);
    }
    return [];
  }
  getDatasetMeta(datasetIndex) {
    const dataset = this.data.datasets[datasetIndex];
    const metasets = this._metasets;
    let meta = metasets.filter((x2) => x2 && x2._dataset === dataset).pop();
    if (!meta) {
      meta = {
        type: null,
        data: [],
        dataset: null,
        controller: null,
        hidden: null,
        xAxisID: null,
        yAxisID: null,
        order: dataset && dataset.order || 0,
        index: datasetIndex,
        _dataset: dataset,
        _parsed: [],
        _sorted: false
      };
      metasets.push(meta);
    }
    return meta;
  }
  getContext() {
    return this.$context || (this.$context = createContext(null, {
      chart: this,
      type: "chart"
    }));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(datasetIndex) {
    const dataset = this.data.datasets[datasetIndex];
    if (!dataset) {
      return false;
    }
    const meta = this.getDatasetMeta(datasetIndex);
    return typeof meta.hidden === "boolean" ? !meta.hidden : !dataset.hidden;
  }
  setDatasetVisibility(datasetIndex, visible) {
    const meta = this.getDatasetMeta(datasetIndex);
    meta.hidden = !visible;
  }
  toggleDataVisibility(index2) {
    this._hiddenIndices[index2] = !this._hiddenIndices[index2];
  }
  getDataVisibility(index2) {
    return !this._hiddenIndices[index2];
  }
  _updateVisibility(datasetIndex, dataIndex, visible) {
    const mode = visible ? "show" : "hide";
    const meta = this.getDatasetMeta(datasetIndex);
    const anims = meta.controller._resolveAnimations(void 0, mode);
    if (defined(dataIndex)) {
      meta.data[dataIndex].hidden = !visible;
      this.update();
    } else {
      this.setDatasetVisibility(datasetIndex, visible);
      anims.update(meta, {
        visible
      });
      this.update((ctx) => ctx.datasetIndex === datasetIndex ? mode : void 0);
    }
  }
  hide(datasetIndex, dataIndex) {
    this._updateVisibility(datasetIndex, dataIndex, false);
  }
  show(datasetIndex, dataIndex) {
    this._updateVisibility(datasetIndex, dataIndex, true);
  }
  _destroyDatasetMeta(datasetIndex) {
    const meta = this._metasets[datasetIndex];
    if (meta && meta.controller) {
      meta.controller._destroy();
    }
    delete this._metasets[datasetIndex];
  }
  _stop() {
    let i2, ilen;
    this.stop();
    animator.remove(this);
    for (i2 = 0, ilen = this.data.datasets.length; i2 < ilen; ++i2) {
      this._destroyDatasetMeta(i2);
    }
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas, ctx } = this;
    this._stop();
    this.config.clearCache();
    if (canvas) {
      this.unbindEvents();
      clearCanvas(canvas, ctx);
      this.platform.releaseContext(ctx);
      this.canvas = null;
      this.ctx = null;
    }
    delete instances[this.id];
    this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...args) {
    return this.canvas.toDataURL(...args);
  }
  bindEvents() {
    this.bindUserEvents();
    if (this.options.responsive) {
      this.bindResponsiveEvents();
    } else {
      this.attached = true;
    }
  }
  bindUserEvents() {
    const listeners = this._listeners;
    const platform = this.platform;
    const _add = (type, listener2) => {
      platform.addEventListener(this, type, listener2);
      listeners[type] = listener2;
    };
    const listener = (e2, x2, y2) => {
      e2.offsetX = x2;
      e2.offsetY = y2;
      this._eventHandler(e2);
    };
    each(this.options.events, (type) => _add(type, listener));
  }
  bindResponsiveEvents() {
    if (!this._responsiveListeners) {
      this._responsiveListeners = {};
    }
    const listeners = this._responsiveListeners;
    const platform = this.platform;
    const _add = (type, listener2) => {
      platform.addEventListener(this, type, listener2);
      listeners[type] = listener2;
    };
    const _remove = (type, listener2) => {
      if (listeners[type]) {
        platform.removeEventListener(this, type, listener2);
        delete listeners[type];
      }
    };
    const listener = (width, height) => {
      if (this.canvas) {
        this.resize(width, height);
      }
    };
    let detached;
    const attached = () => {
      _remove("attach", attached);
      this.attached = true;
      this.resize();
      _add("resize", listener);
      _add("detach", detached);
    };
    detached = () => {
      this.attached = false;
      _remove("resize", listener);
      this._stop();
      this._resize(0, 0);
      _add("attach", attached);
    };
    if (platform.isAttached(this.canvas)) {
      attached();
    } else {
      detached();
    }
  }
  unbindEvents() {
    each(this._listeners, (listener, type) => {
      this.platform.removeEventListener(this, type, listener);
    });
    this._listeners = {};
    each(this._responsiveListeners, (listener, type) => {
      this.platform.removeEventListener(this, type, listener);
    });
    this._responsiveListeners = void 0;
  }
  updateHoverStyle(items, mode, enabled) {
    const prefix = enabled ? "set" : "remove";
    let meta, item, i2, ilen;
    if (mode === "dataset") {
      meta = this.getDatasetMeta(items[0].datasetIndex);
      meta.controller["_" + prefix + "DatasetHoverStyle"]();
    }
    for (i2 = 0, ilen = items.length; i2 < ilen; ++i2) {
      item = items[i2];
      const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
      if (controller) {
        controller[prefix + "HoverStyle"](item.element, item.datasetIndex, item.index);
      }
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(activeElements) {
    const lastActive = this._active || [];
    const active = activeElements.map(({ datasetIndex, index: index2 }) => {
      const meta = this.getDatasetMeta(datasetIndex);
      if (!meta) {
        throw new Error("No dataset found at index " + datasetIndex);
      }
      return {
        datasetIndex,
        element: meta.data[index2],
        index: index2
      };
    });
    const changed = !_elementsEqual(active, lastActive);
    if (changed) {
      this._active = active;
      this._lastEvent = null;
      this._updateHoverStyles(active, lastActive);
    }
  }
  notifyPlugins(hook, args, filter) {
    return this._plugins.notify(this, hook, args, filter);
  }
  isPluginEnabled(pluginId) {
    return this._plugins._cache.filter((p2) => p2.plugin.id === pluginId).length === 1;
  }
  _updateHoverStyles(active, lastActive, replay) {
    const hoverOptions = this.options.hover;
    const diff = (a2, b2) => a2.filter((x2) => !b2.some((y2) => x2.datasetIndex === y2.datasetIndex && x2.index === y2.index));
    const deactivated = diff(lastActive, active);
    const activated = replay ? active : diff(active, lastActive);
    if (deactivated.length) {
      this.updateHoverStyle(deactivated, hoverOptions.mode, false);
    }
    if (activated.length && hoverOptions.mode) {
      this.updateHoverStyle(activated, hoverOptions.mode, true);
    }
  }
  _eventHandler(e2, replay) {
    const args = {
      event: e2,
      replay,
      cancelable: true,
      inChartArea: this.isPointInArea(e2)
    };
    const eventFilter = (plugin) => (plugin.options.events || this.options.events).includes(e2.native.type);
    if (this.notifyPlugins("beforeEvent", args, eventFilter) === false) {
      return;
    }
    const changed = this._handleEvent(e2, replay, args.inChartArea);
    args.cancelable = false;
    this.notifyPlugins("afterEvent", args, eventFilter);
    if (changed || args.changed) {
      this.render();
    }
    return this;
  }
  _handleEvent(e2, replay, inChartArea) {
    const { _active: lastActive = [], options } = this;
    const useFinalPosition = replay;
    const active = this._getActiveElements(e2, lastActive, inChartArea, useFinalPosition);
    const isClick = _isClickEvent(e2);
    const lastEvent = determineLastEvent(e2, this._lastEvent, inChartArea, isClick);
    if (inChartArea) {
      this._lastEvent = null;
      callback(options.onHover, [
        e2,
        active,
        this
      ], this);
      if (isClick) {
        callback(options.onClick, [
          e2,
          active,
          this
        ], this);
      }
    }
    const changed = !_elementsEqual(active, lastActive);
    if (changed || replay) {
      this._active = active;
      this._updateHoverStyles(active, lastActive, replay);
    }
    this._lastEvent = lastEvent;
    return changed;
  }
  _getActiveElements(e2, lastActive, inChartArea, useFinalPosition) {
    if (e2.type === "mouseout") {
      return [];
    }
    if (!inChartArea) {
      return lastActive;
    }
    const hoverOptions = this.options.hover;
    return this.getElementsAtEventForMode(e2, hoverOptions.mode, hoverOptions, useFinalPosition);
  }
};
function invalidatePlugins() {
  return each(Chart.instances, (chart) => chart._plugins.invalidate());
}
function clipSelf(ctx, element, endAngle) {
  const { startAngle, x: x2, y: y2, outerRadius, innerRadius, options } = element;
  const { borderWidth, borderJoinStyle } = options;
  const outerAngleClip = Math.min(borderWidth / outerRadius, _normalizeAngle(startAngle - endAngle));
  ctx.beginPath();
  ctx.arc(x2, y2, outerRadius - borderWidth / 2, startAngle + outerAngleClip / 2, endAngle - outerAngleClip / 2);
  if (innerRadius > 0) {
    const innerAngleClip = Math.min(borderWidth / innerRadius, _normalizeAngle(startAngle - endAngle));
    ctx.arc(x2, y2, innerRadius + borderWidth / 2, endAngle - innerAngleClip / 2, startAngle + innerAngleClip / 2, true);
  } else {
    const clipWidth = Math.min(borderWidth / 2, outerRadius * _normalizeAngle(startAngle - endAngle));
    if (borderJoinStyle === "round") {
      ctx.arc(x2, y2, clipWidth, endAngle - PI / 2, startAngle + PI / 2, true);
    } else if (borderJoinStyle === "bevel") {
      const r2 = 2 * clipWidth * clipWidth;
      const endX = -r2 * Math.cos(endAngle + PI / 2) + x2;
      const endY = -r2 * Math.sin(endAngle + PI / 2) + y2;
      const startX = r2 * Math.cos(startAngle + PI / 2) + x2;
      const startY = r2 * Math.sin(startAngle + PI / 2) + y2;
      ctx.lineTo(endX, endY);
      ctx.lineTo(startX, startY);
    }
  }
  ctx.closePath();
  ctx.moveTo(0, 0);
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.clip("evenodd");
}
function clipArc(ctx, element, endAngle) {
  const { startAngle, pixelMargin, x: x2, y: y2, outerRadius, innerRadius } = element;
  let angleMargin = pixelMargin / outerRadius;
  ctx.beginPath();
  ctx.arc(x2, y2, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
  if (innerRadius > pixelMargin) {
    angleMargin = pixelMargin / innerRadius;
    ctx.arc(x2, y2, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
  } else {
    ctx.arc(x2, y2, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
  }
  ctx.closePath();
  ctx.clip();
}
function toRadiusCorners(value) {
  return _readValueToProps(value, [
    "outerStart",
    "outerEnd",
    "innerStart",
    "innerEnd"
  ]);
}
function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
  const o2 = toRadiusCorners(arc.options.borderRadius);
  const halfThickness = (outerRadius - innerRadius) / 2;
  const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
  const computeOuterLimit = (val) => {
    const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
    return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
  };
  return {
    outerStart: computeOuterLimit(o2.outerStart),
    outerEnd: computeOuterLimit(o2.outerEnd),
    innerStart: _limitValue(o2.innerStart, 0, innerLimit),
    innerEnd: _limitValue(o2.innerEnd, 0, innerLimit)
  };
}
function rThetaToXY(r2, theta, x2, y2) {
  return {
    x: x2 + r2 * Math.cos(theta),
    y: y2 + r2 * Math.sin(theta)
  };
}
function pathArc(ctx, element, offset, spacing, end, circular) {
  const { x: x2, y: y2, startAngle: start, pixelMargin, innerRadius: innerR } = element;
  const outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
  const innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
  let spacingOffset = 0;
  const alpha2 = end - start;
  if (spacing) {
    const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
    const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
    const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
    const adjustedAngle = avNogSpacingRadius !== 0 ? alpha2 * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha2;
    spacingOffset = (alpha2 - adjustedAngle) / 2;
  }
  const beta = Math.max(1e-3, alpha2 * outerRadius - offset / PI) / outerRadius;
  const angleOffset = (alpha2 - beta) / 2;
  const startAngle = start + angleOffset + spacingOffset;
  const endAngle = end - angleOffset - spacingOffset;
  const { outerStart, outerEnd, innerStart, innerEnd } = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
  const outerStartAdjustedRadius = outerRadius - outerStart;
  const outerEndAdjustedRadius = outerRadius - outerEnd;
  const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
  const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
  const innerStartAdjustedRadius = innerRadius + innerStart;
  const innerEndAdjustedRadius = innerRadius + innerEnd;
  const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
  const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
  ctx.beginPath();
  if (circular) {
    const outerMidAdjustedAngle = (outerStartAdjustedAngle + outerEndAdjustedAngle) / 2;
    ctx.arc(x2, y2, outerRadius, outerStartAdjustedAngle, outerMidAdjustedAngle);
    ctx.arc(x2, y2, outerRadius, outerMidAdjustedAngle, outerEndAdjustedAngle);
    if (outerEnd > 0) {
      const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x2, y2);
      ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
    }
    const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x2, y2);
    ctx.lineTo(p4.x, p4.y);
    if (innerEnd > 0) {
      const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x2, y2);
      ctx.arc(pCenter.x, pCenter.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
    }
    const innerMidAdjustedAngle = (endAngle - innerEnd / innerRadius + (startAngle + innerStart / innerRadius)) / 2;
    ctx.arc(x2, y2, innerRadius, endAngle - innerEnd / innerRadius, innerMidAdjustedAngle, true);
    ctx.arc(x2, y2, innerRadius, innerMidAdjustedAngle, startAngle + innerStart / innerRadius, true);
    if (innerStart > 0) {
      const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x2, y2);
      ctx.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
    }
    const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x2, y2);
    ctx.lineTo(p8.x, p8.y);
    if (outerStart > 0) {
      const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x2, y2);
      ctx.arc(pCenter.x, pCenter.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
    }
  } else {
    ctx.moveTo(x2, y2);
    const outerStartX = Math.cos(outerStartAdjustedAngle) * outerRadius + x2;
    const outerStartY = Math.sin(outerStartAdjustedAngle) * outerRadius + y2;
    ctx.lineTo(outerStartX, outerStartY);
    const outerEndX = Math.cos(outerEndAdjustedAngle) * outerRadius + x2;
    const outerEndY = Math.sin(outerEndAdjustedAngle) * outerRadius + y2;
    ctx.lineTo(outerEndX, outerEndY);
  }
  ctx.closePath();
}
function drawArc(ctx, element, offset, spacing, circular) {
  const { fullCircles, startAngle, circumference } = element;
  let endAngle = element.endAngle;
  if (fullCircles) {
    pathArc(ctx, element, offset, spacing, endAngle, circular);
    for (let i2 = 0; i2 < fullCircles; ++i2) {
      ctx.fill();
    }
    if (!isNaN(circumference)) {
      endAngle = startAngle + (circumference % TAU || TAU);
    }
  }
  pathArc(ctx, element, offset, spacing, endAngle, circular);
  ctx.fill();
  return endAngle;
}
function drawBorder(ctx, element, offset, spacing, circular) {
  const { fullCircles, startAngle, circumference, options } = element;
  const { borderWidth, borderJoinStyle, borderDash, borderDashOffset, borderRadius } = options;
  const inner = options.borderAlign === "inner";
  if (!borderWidth) {
    return;
  }
  ctx.setLineDash(borderDash || []);
  ctx.lineDashOffset = borderDashOffset;
  if (inner) {
    ctx.lineWidth = borderWidth * 2;
    ctx.lineJoin = borderJoinStyle || "round";
  } else {
    ctx.lineWidth = borderWidth;
    ctx.lineJoin = borderJoinStyle || "bevel";
  }
  let endAngle = element.endAngle;
  if (fullCircles) {
    pathArc(ctx, element, offset, spacing, endAngle, circular);
    for (let i2 = 0; i2 < fullCircles; ++i2) {
      ctx.stroke();
    }
    if (!isNaN(circumference)) {
      endAngle = startAngle + (circumference % TAU || TAU);
    }
  }
  if (inner) {
    clipArc(ctx, element, endAngle);
  }
  if (options.selfJoin && endAngle - startAngle >= PI && borderRadius === 0 && borderJoinStyle !== "miter") {
    clipSelf(ctx, element, endAngle);
  }
  if (!fullCircles) {
    pathArc(ctx, element, offset, spacing, endAngle, circular);
    ctx.stroke();
  }
}
var ArcElement = class extends Element2 {
  static id = "arc";
  static defaults = {
    borderAlign: "center",
    borderColor: "#fff",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: void 0,
    borderRadius: 0,
    borderWidth: 2,
    offset: 0,
    spacing: 0,
    angle: void 0,
    circular: true,
    selfJoin: false
  };
  static defaultRoutes = {
    backgroundColor: "backgroundColor"
  };
  static descriptors = {
    _scriptable: true,
    _indexable: (name) => name !== "borderDash"
  };
  circumference;
  endAngle;
  fullCircles;
  innerRadius;
  outerRadius;
  pixelMargin;
  startAngle;
  constructor(cfg) {
    super();
    this.options = void 0;
    this.circumference = void 0;
    this.startAngle = void 0;
    this.endAngle = void 0;
    this.innerRadius = void 0;
    this.outerRadius = void 0;
    this.pixelMargin = 0;
    this.fullCircles = 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  inRange(chartX, chartY, useFinalPosition) {
    const point = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    const { angle, distance } = getAngleFromPoint(point, {
      x: chartX,
      y: chartY
    });
    const { startAngle, endAngle, innerRadius, outerRadius, circumference } = this.getProps([
      "startAngle",
      "endAngle",
      "innerRadius",
      "outerRadius",
      "circumference"
    ], useFinalPosition);
    const rAdjust = (this.options.spacing + this.options.borderWidth) / 2;
    const _circumference = valueOrDefault(circumference, endAngle - startAngle);
    const nonZeroBetween = _angleBetween(angle, startAngle, endAngle) && startAngle !== endAngle;
    const betweenAngles = _circumference >= TAU || nonZeroBetween;
    const withinRadius = _isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
    return betweenAngles && withinRadius;
  }
  getCenterPoint(useFinalPosition) {
    const { x: x2, y: y2, startAngle, endAngle, innerRadius, outerRadius } = this.getProps([
      "x",
      "y",
      "startAngle",
      "endAngle",
      "innerRadius",
      "outerRadius"
    ], useFinalPosition);
    const { offset, spacing } = this.options;
    const halfAngle = (startAngle + endAngle) / 2;
    const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
    return {
      x: x2 + Math.cos(halfAngle) * halfRadius,
      y: y2 + Math.sin(halfAngle) * halfRadius
    };
  }
  tooltipPosition(useFinalPosition) {
    return this.getCenterPoint(useFinalPosition);
  }
  draw(ctx) {
    const { options, circumference } = this;
    const offset = (options.offset || 0) / 4;
    const spacing = (options.spacing || 0) / 2;
    const circular = options.circular;
    this.pixelMargin = options.borderAlign === "inner" ? 0.33 : 0;
    this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
    if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
      return;
    }
    ctx.save();
    const halfAngle = (this.startAngle + this.endAngle) / 2;
    ctx.translate(Math.cos(halfAngle) * offset, Math.sin(halfAngle) * offset);
    const fix = 1 - Math.sin(Math.min(PI, circumference || 0));
    const radiusOffset = offset * fix;
    ctx.fillStyle = options.backgroundColor;
    ctx.strokeStyle = options.borderColor;
    drawArc(ctx, this, radiusOffset, spacing, circular);
    drawBorder(ctx, this, radiusOffset, spacing, circular);
    ctx.restore();
  }
};
function setStyle(ctx, options, style = options) {
  ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
  ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
  ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
  ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
  ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
  ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
}
function lineTo(ctx, previous, target) {
  ctx.lineTo(target.x, target.y);
}
function getLineMethod(options) {
  if (options.stepped) {
    return _steppedLineTo;
  }
  if (options.tension || options.cubicInterpolationMode === "monotone") {
    return _bezierCurveTo;
  }
  return lineTo;
}
function pathVars(points, segment, params = {}) {
  const count = points.length;
  const { start: paramsStart = 0, end: paramsEnd = count - 1 } = params;
  const { start: segmentStart, end: segmentEnd } = segment;
  const start = Math.max(paramsStart, segmentStart);
  const end = Math.min(paramsEnd, segmentEnd);
  const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
  return {
    count,
    start,
    loop: segment.loop,
    ilen: end < start && !outside ? count + end - start : end - start
  };
}
function pathSegment(ctx, line, segment, params) {
  const { points, options } = line;
  const { count, start, loop, ilen } = pathVars(points, segment, params);
  const lineMethod = getLineMethod(options);
  let { move = true, reverse } = params || {};
  let i2, point, prev;
  for (i2 = 0; i2 <= ilen; ++i2) {
    point = points[(start + (reverse ? ilen - i2 : i2)) % count];
    if (point.skip) {
      continue;
    } else if (move) {
      ctx.moveTo(point.x, point.y);
      move = false;
    } else {
      lineMethod(ctx, prev, point, reverse, options.stepped);
    }
    prev = point;
  }
  if (loop) {
    point = points[(start + (reverse ? ilen : 0)) % count];
    lineMethod(ctx, prev, point, reverse, options.stepped);
  }
  return !!loop;
}
function fastPathSegment(ctx, line, segment, params) {
  const points = line.points;
  const { count, start, ilen } = pathVars(points, segment, params);
  const { move = true, reverse } = params || {};
  let avgX = 0;
  let countX = 0;
  let i2, point, prevX, minY, maxY, lastY;
  const pointIndex = (index2) => (start + (reverse ? ilen - index2 : index2)) % count;
  const drawX = () => {
    if (minY !== maxY) {
      ctx.lineTo(avgX, maxY);
      ctx.lineTo(avgX, minY);
      ctx.lineTo(avgX, lastY);
    }
  };
  if (move) {
    point = points[pointIndex(0)];
    ctx.moveTo(point.x, point.y);
  }
  for (i2 = 0; i2 <= ilen; ++i2) {
    point = points[pointIndex(i2)];
    if (point.skip) {
      continue;
    }
    const x2 = point.x;
    const y2 = point.y;
    const truncX = x2 | 0;
    if (truncX === prevX) {
      if (y2 < minY) {
        minY = y2;
      } else if (y2 > maxY) {
        maxY = y2;
      }
      avgX = (countX * avgX + x2) / ++countX;
    } else {
      drawX();
      ctx.lineTo(x2, y2);
      prevX = truncX;
      countX = 0;
      minY = maxY = y2;
    }
    lastY = y2;
  }
  drawX();
}
function _getSegmentMethod(line) {
  const opts = line.options;
  const borderDash = opts.borderDash && opts.borderDash.length;
  const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== "monotone" && !opts.stepped && !borderDash;
  return useFastPath ? fastPathSegment : pathSegment;
}
function _getInterpolationMethod(options) {
  if (options.stepped) {
    return _steppedInterpolation;
  }
  if (options.tension || options.cubicInterpolationMode === "monotone") {
    return _bezierInterpolation;
  }
  return _pointInLine;
}
function strokePathWithCache(ctx, line, start, count) {
  let path = line._path;
  if (!path) {
    path = line._path = new Path2D();
    if (line.path(path, start, count)) {
      path.closePath();
    }
  }
  setStyle(ctx, line.options);
  ctx.stroke(path);
}
function strokePathDirect(ctx, line, start, count) {
  const { segments, options } = line;
  const segmentMethod = _getSegmentMethod(line);
  for (const segment of segments) {
    setStyle(ctx, options, segment.style);
    ctx.beginPath();
    if (segmentMethod(ctx, line, segment, {
      start,
      end: start + count - 1
    })) {
      ctx.closePath();
    }
    ctx.stroke();
  }
}
var usePath2D = typeof Path2D === "function";
function draw(ctx, line, start, count) {
  if (usePath2D && !line.options.segment) {
    strokePathWithCache(ctx, line, start, count);
  } else {
    strokePathDirect(ctx, line, start, count);
  }
}
var LineElement = class extends Element2 {
  static id = "line";
  static defaults = {
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderWidth: 3,
    capBezierPoints: true,
    cubicInterpolationMode: "default",
    fill: false,
    spanGaps: false,
    stepped: false,
    tension: 0
  };
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  static descriptors = {
    _scriptable: true,
    _indexable: (name) => name !== "borderDash" && name !== "fill"
  };
  constructor(cfg) {
    super();
    this.animated = true;
    this.options = void 0;
    this._chart = void 0;
    this._loop = void 0;
    this._fullLoop = void 0;
    this._path = void 0;
    this._points = void 0;
    this._segments = void 0;
    this._decimated = false;
    this._pointsUpdated = false;
    this._datasetIndex = void 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  updateControlPoints(chartArea, indexAxis) {
    const options = this.options;
    if ((options.tension || options.cubicInterpolationMode === "monotone") && !options.stepped && !this._pointsUpdated) {
      const loop = options.spanGaps ? this._loop : this._fullLoop;
      _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
      this._pointsUpdated = true;
    }
  }
  set points(points) {
    this._points = points;
    delete this._segments;
    delete this._path;
    this._pointsUpdated = false;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = _computeSegments(this, this.options.segment));
  }
  first() {
    const segments = this.segments;
    const points = this.points;
    return segments.length && points[segments[0].start];
  }
  last() {
    const segments = this.segments;
    const points = this.points;
    const count = segments.length;
    return count && points[segments[count - 1].end];
  }
  interpolate(point, property) {
    const options = this.options;
    const value = point[property];
    const points = this.points;
    const segments = _boundSegments(this, {
      property,
      start: value,
      end: value
    });
    if (!segments.length) {
      return;
    }
    const result = [];
    const _interpolate = _getInterpolationMethod(options);
    let i2, ilen;
    for (i2 = 0, ilen = segments.length; i2 < ilen; ++i2) {
      const { start, end } = segments[i2];
      const p1 = points[start];
      const p2 = points[end];
      if (p1 === p2) {
        result.push(p1);
        continue;
      }
      const t2 = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
      const interpolated = _interpolate(p1, p2, t2, options.stepped);
      interpolated[property] = point[property];
      result.push(interpolated);
    }
    return result.length === 1 ? result[0] : result;
  }
  pathSegment(ctx, segment, params) {
    const segmentMethod = _getSegmentMethod(this);
    return segmentMethod(ctx, this, segment, params);
  }
  path(ctx, start, count) {
    const segments = this.segments;
    const segmentMethod = _getSegmentMethod(this);
    let loop = this._loop;
    start = start || 0;
    count = count || this.points.length - start;
    for (const segment of segments) {
      loop &= segmentMethod(ctx, this, segment, {
        start,
        end: start + count - 1
      });
    }
    return !!loop;
  }
  draw(ctx, chartArea, start, count) {
    const options = this.options || {};
    const points = this.points || [];
    if (points.length && options.borderWidth) {
      ctx.save();
      draw(ctx, this, start, count);
      ctx.restore();
    }
    if (this.animated) {
      this._pointsUpdated = false;
      this._path = void 0;
    }
  }
};
function inRange$1(el, pos, axis, useFinalPosition) {
  const options = el.options;
  const { [axis]: value } = el.getProps([
    axis
  ], useFinalPosition);
  return Math.abs(pos - value) < options.radius + options.hitRadius;
}
var PointElement = class extends Element2 {
  static id = "point";
  parsed;
  skip;
  stop;
  /**
  * @type {any}
  */
  static defaults = {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: "circle",
    radius: 3,
    rotation: 0
  };
  /**
  * @type {any}
  */
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  constructor(cfg) {
    super();
    this.options = void 0;
    this.parsed = void 0;
    this.skip = void 0;
    this.stop = void 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  inRange(mouseX, mouseY, useFinalPosition) {
    const options = this.options;
    const { x: x2, y: y2 } = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    return Math.pow(mouseX - x2, 2) + Math.pow(mouseY - y2, 2) < Math.pow(options.hitRadius + options.radius, 2);
  }
  inXRange(mouseX, useFinalPosition) {
    return inRange$1(this, mouseX, "x", useFinalPosition);
  }
  inYRange(mouseY, useFinalPosition) {
    return inRange$1(this, mouseY, "y", useFinalPosition);
  }
  getCenterPoint(useFinalPosition) {
    const { x: x2, y: y2 } = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    return {
      x: x2,
      y: y2
    };
  }
  size(options) {
    options = options || this.options || {};
    let radius = options.radius || 0;
    radius = Math.max(radius, radius && options.hoverRadius || 0);
    const borderWidth = radius && options.borderWidth || 0;
    return (radius + borderWidth) * 2;
  }
  draw(ctx, area) {
    const options = this.options;
    if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
      return;
    }
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.fillStyle = options.backgroundColor;
    drawPoint(ctx, options, this.x, this.y);
  }
  getRange() {
    const options = this.options || {};
    return options.radius + options.hitRadius;
  }
};
function getBarBounds(bar, useFinalPosition) {
  const { x: x2, y: y2, base, width, height } = bar.getProps([
    "x",
    "y",
    "base",
    "width",
    "height"
  ], useFinalPosition);
  let left, right, top, bottom, half;
  if (bar.horizontal) {
    half = height / 2;
    left = Math.min(x2, base);
    right = Math.max(x2, base);
    top = y2 - half;
    bottom = y2 + half;
  } else {
    half = width / 2;
    left = x2 - half;
    right = x2 + half;
    top = Math.min(y2, base);
    bottom = Math.max(y2, base);
  }
  return {
    left,
    top,
    right,
    bottom
  };
}
function skipOrLimit(skip2, value, min, max) {
  return skip2 ? 0 : _limitValue(value, min, max);
}
function parseBorderWidth(bar, maxW, maxH) {
  const value = bar.options.borderWidth;
  const skip2 = bar.borderSkipped;
  const o2 = toTRBL(value);
  return {
    t: skipOrLimit(skip2.top, o2.top, 0, maxH),
    r: skipOrLimit(skip2.right, o2.right, 0, maxW),
    b: skipOrLimit(skip2.bottom, o2.bottom, 0, maxH),
    l: skipOrLimit(skip2.left, o2.left, 0, maxW)
  };
}
function parseBorderRadius(bar, maxW, maxH) {
  const { enableBorderRadius } = bar.getProps([
    "enableBorderRadius"
  ]);
  const value = bar.options.borderRadius;
  const o2 = toTRBLCorners(value);
  const maxR = Math.min(maxW, maxH);
  const skip2 = bar.borderSkipped;
  const enableBorder = enableBorderRadius || isObject(value);
  return {
    topLeft: skipOrLimit(!enableBorder || skip2.top || skip2.left, o2.topLeft, 0, maxR),
    topRight: skipOrLimit(!enableBorder || skip2.top || skip2.right, o2.topRight, 0, maxR),
    bottomLeft: skipOrLimit(!enableBorder || skip2.bottom || skip2.left, o2.bottomLeft, 0, maxR),
    bottomRight: skipOrLimit(!enableBorder || skip2.bottom || skip2.right, o2.bottomRight, 0, maxR)
  };
}
function boundingRects(bar) {
  const bounds = getBarBounds(bar);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const border = parseBorderWidth(bar, width / 2, height / 2);
  const radius = parseBorderRadius(bar, width / 2, height / 2);
  return {
    outer: {
      x: bounds.left,
      y: bounds.top,
      w: width,
      h: height,
      radius
    },
    inner: {
      x: bounds.left + border.l,
      y: bounds.top + border.t,
      w: width - border.l - border.r,
      h: height - border.t - border.b,
      radius: {
        topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
        topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
        bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
        bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r))
      }
    }
  };
}
function inRange(bar, x2, y2, useFinalPosition) {
  const skipX = x2 === null;
  const skipY = y2 === null;
  const skipBoth = skipX && skipY;
  const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
  return bounds && (skipX || _isBetween(x2, bounds.left, bounds.right)) && (skipY || _isBetween(y2, bounds.top, bounds.bottom));
}
function hasRadius(radius) {
  return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
}
function addNormalRectPath(ctx, rect) {
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
}
function inflateRect(rect, amount, refRect = {}) {
  const x2 = rect.x !== refRect.x ? -amount : 0;
  const y2 = rect.y !== refRect.y ? -amount : 0;
  const w2 = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x2;
  const h3 = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y2;
  return {
    x: rect.x + x2,
    y: rect.y + y2,
    w: rect.w + w2,
    h: rect.h + h3,
    radius: rect.radius
  };
}
var BarElement = class extends Element2 {
  static id = "bar";
  static defaults = {
    borderSkipped: "start",
    borderWidth: 0,
    borderRadius: 0,
    inflateAmount: "auto",
    pointStyle: void 0
  };
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  constructor(cfg) {
    super();
    this.options = void 0;
    this.horizontal = void 0;
    this.base = void 0;
    this.width = void 0;
    this.height = void 0;
    this.inflateAmount = void 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  draw(ctx) {
    const { inflateAmount, options: { borderColor, backgroundColor } } = this;
    const { inner, outer } = boundingRects(this);
    const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
    ctx.save();
    if (outer.w !== inner.w || outer.h !== inner.h) {
      ctx.beginPath();
      addRectPath(ctx, inflateRect(outer, inflateAmount, inner));
      ctx.clip();
      addRectPath(ctx, inflateRect(inner, -inflateAmount, outer));
      ctx.fillStyle = borderColor;
      ctx.fill("evenodd");
    }
    ctx.beginPath();
    addRectPath(ctx, inflateRect(inner, inflateAmount));
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.restore();
  }
  inRange(mouseX, mouseY, useFinalPosition) {
    return inRange(this, mouseX, mouseY, useFinalPosition);
  }
  inXRange(mouseX, useFinalPosition) {
    return inRange(this, mouseX, null, useFinalPosition);
  }
  inYRange(mouseY, useFinalPosition) {
    return inRange(this, null, mouseY, useFinalPosition);
  }
  getCenterPoint(useFinalPosition) {
    const { x: x2, y: y2, base, horizontal } = this.getProps([
      "x",
      "y",
      "base",
      "horizontal"
    ], useFinalPosition);
    return {
      x: horizontal ? (x2 + base) / 2 : x2,
      y: horizontal ? y2 : (y2 + base) / 2
    };
  }
  getRange(axis) {
    return axis === "x" ? this.width / 2 : this.height / 2;
  }
};
var elements = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ArcElement,
  BarElement,
  LineElement,
  PointElement
});
var BORDER_COLORS = [
  "rgb(54, 162, 235)",
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)"
  // grey
];
var BACKGROUND_COLORS = /* @__PURE__ */ BORDER_COLORS.map((color2) => color2.replace("rgb(", "rgba(").replace(")", ", 0.5)"));
function getBorderColor(i2) {
  return BORDER_COLORS[i2 % BORDER_COLORS.length];
}
function getBackgroundColor(i2) {
  return BACKGROUND_COLORS[i2 % BACKGROUND_COLORS.length];
}
function colorizeDefaultDataset(dataset, i2) {
  dataset.borderColor = getBorderColor(i2);
  dataset.backgroundColor = getBackgroundColor(i2);
  return ++i2;
}
function colorizeDoughnutDataset(dataset, i2) {
  dataset.backgroundColor = dataset.data.map(() => getBorderColor(i2++));
  return i2;
}
function colorizePolarAreaDataset(dataset, i2) {
  dataset.backgroundColor = dataset.data.map(() => getBackgroundColor(i2++));
  return i2;
}
function getColorizer(chart) {
  let i2 = 0;
  return (dataset, datasetIndex) => {
    const controller = chart.getDatasetMeta(datasetIndex).controller;
    if (controller instanceof DoughnutController) {
      i2 = colorizeDoughnutDataset(dataset, i2);
    } else if (controller instanceof PolarAreaController) {
      i2 = colorizePolarAreaDataset(dataset, i2);
    } else if (controller) {
      i2 = colorizeDefaultDataset(dataset, i2);
    }
  };
}
function containsColorsDefinitions(descriptors2) {
  let k2;
  for (k2 in descriptors2) {
    if (descriptors2[k2].borderColor || descriptors2[k2].backgroundColor) {
      return true;
    }
  }
  return false;
}
function containsColorsDefinition(descriptor) {
  return descriptor && (descriptor.borderColor || descriptor.backgroundColor);
}
function containsDefaultColorsDefenitions() {
  return defaults.borderColor !== "rgba(0,0,0,0.1)" || defaults.backgroundColor !== "rgba(0,0,0,0.1)";
}
var plugin_colors = {
  id: "colors",
  defaults: {
    enabled: true,
    forceOverride: false
  },
  beforeLayout(chart, _args, options) {
    if (!options.enabled) {
      return;
    }
    const { data: { datasets }, options: chartOptions } = chart.config;
    const { elements: elements2 } = chartOptions;
    const containsColorDefenition = containsColorsDefinitions(datasets) || containsColorsDefinition(chartOptions) || elements2 && containsColorsDefinitions(elements2) || containsDefaultColorsDefenitions();
    if (!options.forceOverride && containsColorDefenition) {
      return;
    }
    const colorizer = getColorizer(chart);
    datasets.forEach(colorizer);
  }
};
function lttbDecimation(data, start, count, availableWidth, options) {
  const samples = options.samples || availableWidth;
  if (samples >= count) {
    return data.slice(start, start + count);
  }
  const decimated = [];
  const bucketWidth = (count - 2) / (samples - 2);
  let sampledIndex = 0;
  const endIndex = start + count - 1;
  let a2 = start;
  let i2, maxAreaPoint, maxArea, area, nextA;
  decimated[sampledIndex++] = data[a2];
  for (i2 = 0; i2 < samples - 2; i2++) {
    let avgX = 0;
    let avgY = 0;
    let j2;
    const avgRangeStart = Math.floor((i2 + 1) * bucketWidth) + 1 + start;
    const avgRangeEnd = Math.min(Math.floor((i2 + 2) * bucketWidth) + 1, count) + start;
    const avgRangeLength = avgRangeEnd - avgRangeStart;
    for (j2 = avgRangeStart; j2 < avgRangeEnd; j2++) {
      avgX += data[j2].x;
      avgY += data[j2].y;
    }
    avgX /= avgRangeLength;
    avgY /= avgRangeLength;
    const rangeOffs = Math.floor(i2 * bucketWidth) + 1 + start;
    const rangeTo = Math.min(Math.floor((i2 + 1) * bucketWidth) + 1, count) + start;
    const { x: pointAx, y: pointAy } = data[a2];
    maxArea = area = -1;
    for (j2 = rangeOffs; j2 < rangeTo; j2++) {
      area = 0.5 * Math.abs((pointAx - avgX) * (data[j2].y - pointAy) - (pointAx - data[j2].x) * (avgY - pointAy));
      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = data[j2];
        nextA = j2;
      }
    }
    decimated[sampledIndex++] = maxAreaPoint;
    a2 = nextA;
  }
  decimated[sampledIndex++] = data[endIndex];
  return decimated;
}
function minMaxDecimation(data, start, count, availableWidth) {
  let avgX = 0;
  let countX = 0;
  let i2, point, x2, y2, prevX, minIndex, maxIndex, startIndex, minY, maxY;
  const decimated = [];
  const endIndex = start + count - 1;
  const xMin = data[start].x;
  const xMax = data[endIndex].x;
  const dx = xMax - xMin;
  for (i2 = start; i2 < start + count; ++i2) {
    point = data[i2];
    x2 = (point.x - xMin) / dx * availableWidth;
    y2 = point.y;
    const truncX = x2 | 0;
    if (truncX === prevX) {
      if (y2 < minY) {
        minY = y2;
        minIndex = i2;
      } else if (y2 > maxY) {
        maxY = y2;
        maxIndex = i2;
      }
      avgX = (countX * avgX + point.x) / ++countX;
    } else {
      const lastIndex = i2 - 1;
      if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
        const intermediateIndex1 = Math.min(minIndex, maxIndex);
        const intermediateIndex2 = Math.max(minIndex, maxIndex);
        if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
          decimated.push(__spreadProps(__spreadValues({}, data[intermediateIndex1]), {
            x: avgX
          }));
        }
        if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
          decimated.push(__spreadProps(__spreadValues({}, data[intermediateIndex2]), {
            x: avgX
          }));
        }
      }
      if (i2 > 0 && lastIndex !== startIndex) {
        decimated.push(data[lastIndex]);
      }
      decimated.push(point);
      prevX = truncX;
      countX = 0;
      minY = maxY = y2;
      minIndex = maxIndex = startIndex = i2;
    }
  }
  return decimated;
}
function cleanDecimatedDataset(dataset) {
  if (dataset._decimated) {
    const data = dataset._data;
    delete dataset._decimated;
    delete dataset._data;
    Object.defineProperty(dataset, "data", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: data
    });
  }
}
function cleanDecimatedData(chart) {
  chart.data.datasets.forEach((dataset) => {
    cleanDecimatedDataset(dataset);
  });
}
function getStartAndCountOfVisiblePointsSimplified(meta, points) {
  const pointCount = points.length;
  let start = 0;
  let count;
  const { iScale } = meta;
  const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
  if (minDefined) {
    start = _limitValue(_lookupByKey(points, iScale.axis, min).lo, 0, pointCount - 1);
  }
  if (maxDefined) {
    count = _limitValue(_lookupByKey(points, iScale.axis, max).hi + 1, start, pointCount) - start;
  } else {
    count = pointCount - start;
  }
  return {
    start,
    count
  };
}
var plugin_decimation = {
  id: "decimation",
  defaults: {
    algorithm: "min-max",
    enabled: false
  },
  beforeElementsUpdate: (chart, args, options) => {
    if (!options.enabled) {
      cleanDecimatedData(chart);
      return;
    }
    const availableWidth = chart.width;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const { _data, indexAxis } = dataset;
      const meta = chart.getDatasetMeta(datasetIndex);
      const data = _data || dataset.data;
      if (resolve([
        indexAxis,
        chart.options.indexAxis
      ]) === "y") {
        return;
      }
      if (!meta.controller.supportsDecimation) {
        return;
      }
      const xAxis = chart.scales[meta.xAxisID];
      if (xAxis.type !== "linear" && xAxis.type !== "time") {
        return;
      }
      if (chart.options.parsing) {
        return;
      }
      let { start, count } = getStartAndCountOfVisiblePointsSimplified(meta, data);
      const threshold = options.threshold || 4 * availableWidth;
      if (count <= threshold) {
        cleanDecimatedDataset(dataset);
        return;
      }
      if (isNullOrUndef(_data)) {
        dataset._data = data;
        delete dataset.data;
        Object.defineProperty(dataset, "data", {
          configurable: true,
          enumerable: true,
          get: function() {
            return this._decimated;
          },
          set: function(d2) {
            this._data = d2;
          }
        });
      }
      let decimated;
      switch (options.algorithm) {
        case "lttb":
          decimated = lttbDecimation(data, start, count, availableWidth, options);
          break;
        case "min-max":
          decimated = minMaxDecimation(data, start, count, availableWidth);
          break;
        default:
          throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
      }
      dataset._decimated = decimated;
    });
  },
  destroy(chart) {
    cleanDecimatedData(chart);
  }
};
function _segments(line, target, property) {
  const segments = line.segments;
  const points = line.points;
  const tpoints = target.points;
  const parts = [];
  for (const segment of segments) {
    let { start, end } = segment;
    end = _findSegmentEnd(start, end, points);
    const bounds = _getBounds(property, points[start], points[end], segment.loop);
    if (!target.segments) {
      parts.push({
        source: segment,
        target: bounds,
        start: points[start],
        end: points[end]
      });
      continue;
    }
    const targetSegments = _boundSegments(target, bounds);
    for (const tgt of targetSegments) {
      const subBounds = _getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
      const fillSources = _boundSegment(segment, points, subBounds);
      for (const fillSource of fillSources) {
        parts.push({
          source: fillSource,
          target: tgt,
          start: {
            [property]: _getEdge(bounds, subBounds, "start", Math.max)
          },
          end: {
            [property]: _getEdge(bounds, subBounds, "end", Math.min)
          }
        });
      }
    }
  }
  return parts;
}
function _getBounds(property, first, last, loop) {
  if (loop) {
    return;
  }
  let start = first[property];
  let end = last[property];
  if (property === "angle") {
    start = _normalizeAngle(start);
    end = _normalizeAngle(end);
  }
  return {
    property,
    start,
    end
  };
}
function _pointsFromSegments(boundary, line) {
  const { x: x2 = null, y: y2 = null } = boundary || {};
  const linePoints = line.points;
  const points = [];
  line.segments.forEach(({ start, end }) => {
    end = _findSegmentEnd(start, end, linePoints);
    const first = linePoints[start];
    const last = linePoints[end];
    if (y2 !== null) {
      points.push({
        x: first.x,
        y: y2
      });
      points.push({
        x: last.x,
        y: y2
      });
    } else if (x2 !== null) {
      points.push({
        x: x2,
        y: first.y
      });
      points.push({
        x: x2,
        y: last.y
      });
    }
  });
  return points;
}
function _findSegmentEnd(start, end, points) {
  for (; end > start; end--) {
    const point = points[end];
    if (!isNaN(point.x) && !isNaN(point.y)) {
      break;
    }
  }
  return end;
}
function _getEdge(a2, b2, prop, fn2) {
  if (a2 && b2) {
    return fn2(a2[prop], b2[prop]);
  }
  return a2 ? a2[prop] : b2 ? b2[prop] : 0;
}
function _createBoundaryLine(boundary, line) {
  let points = [];
  let _loop = false;
  if (isArray(boundary)) {
    _loop = true;
    points = boundary;
  } else {
    points = _pointsFromSegments(boundary, line);
  }
  return points.length ? new LineElement({
    points,
    options: {
      tension: 0
    },
    _loop,
    _fullLoop: _loop
  }) : null;
}
function _shouldApplyFill(source) {
  return source && source.fill !== false;
}
function _resolveTarget(sources, index2, propagate) {
  const source = sources[index2];
  let fill2 = source.fill;
  const visited = [
    index2
  ];
  let target;
  if (!propagate) {
    return fill2;
  }
  while (fill2 !== false && visited.indexOf(fill2) === -1) {
    if (!isNumberFinite(fill2)) {
      return fill2;
    }
    target = sources[fill2];
    if (!target) {
      return false;
    }
    if (target.visible) {
      return fill2;
    }
    visited.push(fill2);
    fill2 = target.fill;
  }
  return false;
}
function _decodeFill(line, index2, count) {
  const fill2 = parseFillOption(line);
  if (isObject(fill2)) {
    return isNaN(fill2.value) ? false : fill2;
  }
  let target = parseFloat(fill2);
  if (isNumberFinite(target) && Math.floor(target) === target) {
    return decodeTargetIndex(fill2[0], index2, target, count);
  }
  return [
    "origin",
    "start",
    "end",
    "stack",
    "shape"
  ].indexOf(fill2) >= 0 && fill2;
}
function decodeTargetIndex(firstCh, index2, target, count) {
  if (firstCh === "-" || firstCh === "+") {
    target = index2 + target;
  }
  if (target === index2 || target < 0 || target >= count) {
    return false;
  }
  return target;
}
function _getTargetPixel(fill2, scale) {
  let pixel = null;
  if (fill2 === "start") {
    pixel = scale.bottom;
  } else if (fill2 === "end") {
    pixel = scale.top;
  } else if (isObject(fill2)) {
    pixel = scale.getPixelForValue(fill2.value);
  } else if (scale.getBasePixel) {
    pixel = scale.getBasePixel();
  }
  return pixel;
}
function _getTargetValue(fill2, scale, startValue) {
  let value;
  if (fill2 === "start") {
    value = startValue;
  } else if (fill2 === "end") {
    value = scale.options.reverse ? scale.min : scale.max;
  } else if (isObject(fill2)) {
    value = fill2.value;
  } else {
    value = scale.getBaseValue();
  }
  return value;
}
function parseFillOption(line) {
  const options = line.options;
  const fillOption = options.fill;
  let fill2 = valueOrDefault(fillOption && fillOption.target, fillOption);
  if (fill2 === void 0) {
    fill2 = !!options.backgroundColor;
  }
  if (fill2 === false || fill2 === null) {
    return false;
  }
  if (fill2 === true) {
    return "origin";
  }
  return fill2;
}
function _buildStackLine(source) {
  const { scale, index: index2, line } = source;
  const points = [];
  const segments = line.segments;
  const sourcePoints = line.points;
  const linesBelow = getLinesBelow(scale, index2);
  linesBelow.push(_createBoundaryLine({
    x: null,
    y: scale.bottom
  }, line));
  for (let i2 = 0; i2 < segments.length; i2++) {
    const segment = segments[i2];
    for (let j2 = segment.start; j2 <= segment.end; j2++) {
      addPointsBelow(points, sourcePoints[j2], linesBelow);
    }
  }
  return new LineElement({
    points,
    options: {}
  });
}
function getLinesBelow(scale, index2) {
  const below = [];
  const metas = scale.getMatchingVisibleMetas("line");
  for (let i2 = 0; i2 < metas.length; i2++) {
    const meta = metas[i2];
    if (meta.index === index2) {
      break;
    }
    if (!meta.hidden) {
      below.unshift(meta.dataset);
    }
  }
  return below;
}
function addPointsBelow(points, sourcePoint, linesBelow) {
  const postponed = [];
  for (let j2 = 0; j2 < linesBelow.length; j2++) {
    const line = linesBelow[j2];
    const { first, last, point } = findPoint(line, sourcePoint, "x");
    if (!point || first && last) {
      continue;
    }
    if (first) {
      postponed.unshift(point);
    } else {
      points.push(point);
      if (!last) {
        break;
      }
    }
  }
  points.push(...postponed);
}
function findPoint(line, sourcePoint, property) {
  const point = line.interpolate(sourcePoint, property);
  if (!point) {
    return {};
  }
  const pointValue = point[property];
  const segments = line.segments;
  const linePoints = line.points;
  let first = false;
  let last = false;
  for (let i2 = 0; i2 < segments.length; i2++) {
    const segment = segments[i2];
    const firstValue = linePoints[segment.start][property];
    const lastValue = linePoints[segment.end][property];
    if (_isBetween(pointValue, firstValue, lastValue)) {
      first = pointValue === firstValue;
      last = pointValue === lastValue;
      break;
    }
  }
  return {
    first,
    last,
    point
  };
}
var simpleArc = class {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.radius = opts.radius;
  }
  pathSegment(ctx, bounds, opts) {
    const { x: x2, y: y2, radius } = this;
    bounds = bounds || {
      start: 0,
      end: TAU
    };
    ctx.arc(x2, y2, radius, bounds.end, bounds.start, true);
    return !opts.bounds;
  }
  interpolate(point) {
    const { x: x2, y: y2, radius } = this;
    const angle = point.angle;
    return {
      x: x2 + Math.cos(angle) * radius,
      y: y2 + Math.sin(angle) * radius,
      angle
    };
  }
};
function _getTarget(source) {
  const { chart, fill: fill2, line } = source;
  if (isNumberFinite(fill2)) {
    return getLineByIndex(chart, fill2);
  }
  if (fill2 === "stack") {
    return _buildStackLine(source);
  }
  if (fill2 === "shape") {
    return true;
  }
  const boundary = computeBoundary(source);
  if (boundary instanceof simpleArc) {
    return boundary;
  }
  return _createBoundaryLine(boundary, line);
}
function getLineByIndex(chart, index2) {
  const meta = chart.getDatasetMeta(index2);
  const visible = meta && chart.isDatasetVisible(index2);
  return visible ? meta.dataset : null;
}
function computeBoundary(source) {
  const scale = source.scale || {};
  if (scale.getPointPositionForValue) {
    return computeCircularBoundary(source);
  }
  return computeLinearBoundary(source);
}
function computeLinearBoundary(source) {
  const { scale = {}, fill: fill2 } = source;
  const pixel = _getTargetPixel(fill2, scale);
  if (isNumberFinite(pixel)) {
    const horizontal = scale.isHorizontal();
    return {
      x: horizontal ? pixel : null,
      y: horizontal ? null : pixel
    };
  }
  return null;
}
function computeCircularBoundary(source) {
  const { scale, fill: fill2 } = source;
  const options = scale.options;
  const length = scale.getLabels().length;
  const start = options.reverse ? scale.max : scale.min;
  const value = _getTargetValue(fill2, scale, start);
  const target = [];
  if (options.grid.circular) {
    const center = scale.getPointPositionForValue(0, start);
    return new simpleArc({
      x: center.x,
      y: center.y,
      radius: scale.getDistanceFromCenterForValue(value)
    });
  }
  for (let i2 = 0; i2 < length; ++i2) {
    target.push(scale.getPointPositionForValue(i2, value));
  }
  return target;
}
function _drawfill(ctx, source, area) {
  const target = _getTarget(source);
  const { chart, index: index2, line, scale, axis } = source;
  const lineOpts = line.options;
  const fillOption = lineOpts.fill;
  const color2 = lineOpts.backgroundColor;
  const { above = color2, below = color2 } = fillOption || {};
  const meta = chart.getDatasetMeta(index2);
  const clip = getDatasetClipArea(chart, meta);
  if (target && line.points.length) {
    clipArea(ctx, area);
    doFill(ctx, {
      line,
      target,
      above,
      below,
      area,
      scale,
      axis,
      clip
    });
    unclipArea(ctx);
  }
}
function doFill(ctx, cfg) {
  const { line, target, above, below, area, scale, clip } = cfg;
  const property = line._loop ? "angle" : cfg.axis;
  ctx.save();
  let fillColor = below;
  if (below !== above) {
    if (property === "x") {
      clipVertical(ctx, target, area.top);
      fill(ctx, {
        line,
        target,
        color: above,
        scale,
        property,
        clip
      });
      ctx.restore();
      ctx.save();
      clipVertical(ctx, target, area.bottom);
    } else if (property === "y") {
      clipHorizontal(ctx, target, area.left);
      fill(ctx, {
        line,
        target,
        color: below,
        scale,
        property,
        clip
      });
      ctx.restore();
      ctx.save();
      clipHorizontal(ctx, target, area.right);
      fillColor = above;
    }
  }
  fill(ctx, {
    line,
    target,
    color: fillColor,
    scale,
    property,
    clip
  });
  ctx.restore();
}
function clipVertical(ctx, target, clipY) {
  const { segments, points } = target;
  let first = true;
  let lineLoop = false;
  ctx.beginPath();
  for (const segment of segments) {
    const { start, end } = segment;
    const firstPoint = points[start];
    const lastPoint = points[_findSegmentEnd(start, end, points)];
    if (first) {
      ctx.moveTo(firstPoint.x, firstPoint.y);
      first = false;
    } else {
      ctx.lineTo(firstPoint.x, clipY);
      ctx.lineTo(firstPoint.x, firstPoint.y);
    }
    lineLoop = !!target.pathSegment(ctx, segment, {
      move: lineLoop
    });
    if (lineLoop) {
      ctx.closePath();
    } else {
      ctx.lineTo(lastPoint.x, clipY);
    }
  }
  ctx.lineTo(target.first().x, clipY);
  ctx.closePath();
  ctx.clip();
}
function clipHorizontal(ctx, target, clipX) {
  const { segments, points } = target;
  let first = true;
  let lineLoop = false;
  ctx.beginPath();
  for (const segment of segments) {
    const { start, end } = segment;
    const firstPoint = points[start];
    const lastPoint = points[_findSegmentEnd(start, end, points)];
    if (first) {
      ctx.moveTo(firstPoint.x, firstPoint.y);
      first = false;
    } else {
      ctx.lineTo(clipX, firstPoint.y);
      ctx.lineTo(firstPoint.x, firstPoint.y);
    }
    lineLoop = !!target.pathSegment(ctx, segment, {
      move: lineLoop
    });
    if (lineLoop) {
      ctx.closePath();
    } else {
      ctx.lineTo(clipX, lastPoint.y);
    }
  }
  ctx.lineTo(clipX, target.first().y);
  ctx.closePath();
  ctx.clip();
}
function fill(ctx, cfg) {
  const { line, target, property, color: color2, scale, clip } = cfg;
  const segments = _segments(line, target, property);
  for (const { source: src, target: tgt, start, end } of segments) {
    const { style: { backgroundColor = color2 } = {} } = src;
    const notShape = target !== true;
    ctx.save();
    ctx.fillStyle = backgroundColor;
    clipBounds(ctx, scale, clip, notShape && _getBounds(property, start, end));
    ctx.beginPath();
    const lineLoop = !!line.pathSegment(ctx, src);
    let loop;
    if (notShape) {
      if (lineLoop) {
        ctx.closePath();
      } else {
        interpolatedLineTo(ctx, target, end, property);
      }
      const targetLoop = !!target.pathSegment(ctx, tgt, {
        move: lineLoop,
        reverse: true
      });
      loop = lineLoop && targetLoop;
      if (!loop) {
        interpolatedLineTo(ctx, target, start, property);
      }
    }
    ctx.closePath();
    ctx.fill(loop ? "evenodd" : "nonzero");
    ctx.restore();
  }
}
function clipBounds(ctx, scale, clip, bounds) {
  const chartArea = scale.chart.chartArea;
  const { property, start, end } = bounds || {};
  if (property === "x" || property === "y") {
    let left, top, right, bottom;
    if (property === "x") {
      left = start;
      top = chartArea.top;
      right = end;
      bottom = chartArea.bottom;
    } else {
      left = chartArea.left;
      top = start;
      right = chartArea.right;
      bottom = end;
    }
    ctx.beginPath();
    if (clip) {
      left = Math.max(left, clip.left);
      right = Math.min(right, clip.right);
      top = Math.max(top, clip.top);
      bottom = Math.min(bottom, clip.bottom);
    }
    ctx.rect(left, top, right - left, bottom - top);
    ctx.clip();
  }
}
function interpolatedLineTo(ctx, target, point, property) {
  const interpolatedPoint = target.interpolate(point, property);
  if (interpolatedPoint) {
    ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
  }
}
var index = {
  id: "filler",
  afterDatasetsUpdate(chart, _args, options) {
    const count = (chart.data.datasets || []).length;
    const sources = [];
    let meta, i2, line, source;
    for (i2 = 0; i2 < count; ++i2) {
      meta = chart.getDatasetMeta(i2);
      line = meta.dataset;
      source = null;
      if (line && line.options && line instanceof LineElement) {
        source = {
          visible: chart.isDatasetVisible(i2),
          index: i2,
          fill: _decodeFill(line, i2, count),
          chart,
          axis: meta.controller.options.indexAxis,
          scale: meta.vScale,
          line
        };
      }
      meta.$filler = source;
      sources.push(source);
    }
    for (i2 = 0; i2 < count; ++i2) {
      source = sources[i2];
      if (!source || source.fill === false) {
        continue;
      }
      source.fill = _resolveTarget(sources, i2, options.propagate);
    }
  },
  beforeDraw(chart, _args, options) {
    const draw2 = options.drawTime === "beforeDraw";
    const metasets = chart.getSortedVisibleDatasetMetas();
    const area = chart.chartArea;
    for (let i2 = metasets.length - 1; i2 >= 0; --i2) {
      const source = metasets[i2].$filler;
      if (!source) {
        continue;
      }
      source.line.updateControlPoints(area, source.axis);
      if (draw2 && source.fill) {
        _drawfill(chart.ctx, source, area);
      }
    }
  },
  beforeDatasetsDraw(chart, _args, options) {
    if (options.drawTime !== "beforeDatasetsDraw") {
      return;
    }
    const metasets = chart.getSortedVisibleDatasetMetas();
    for (let i2 = metasets.length - 1; i2 >= 0; --i2) {
      const source = metasets[i2].$filler;
      if (_shouldApplyFill(source)) {
        _drawfill(chart.ctx, source, chart.chartArea);
      }
    }
  },
  beforeDatasetDraw(chart, args, options) {
    const source = args.meta.$filler;
    if (!_shouldApplyFill(source) || options.drawTime !== "beforeDatasetDraw") {
      return;
    }
    _drawfill(chart.ctx, source, chart.chartArea);
  },
  defaults: {
    propagate: true,
    drawTime: "beforeDatasetDraw"
  }
};
var getBoxSize = (labelOpts, fontSize) => {
  let { boxHeight = fontSize, boxWidth = fontSize } = labelOpts;
  if (labelOpts.usePointStyle) {
    boxHeight = Math.min(boxHeight, fontSize);
    boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize);
  }
  return {
    boxWidth,
    boxHeight,
    itemHeight: Math.max(fontSize, boxHeight)
  };
};
var itemsEqual = (a2, b2) => a2 !== null && b2 !== null && a2.datasetIndex === b2.datasetIndex && a2.index === b2.index;
var Legend = class extends Element2 {
  constructor(config) {
    super();
    this._added = false;
    this.legendHitBoxes = [];
    this._hoveredItem = null;
    this.doughnutMode = false;
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this.legendItems = void 0;
    this.columnSizes = void 0;
    this.lineWidths = void 0;
    this.maxHeight = void 0;
    this.maxWidth = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.right = void 0;
    this.height = void 0;
    this.width = void 0;
    this._margins = void 0;
    this.position = void 0;
    this.weight = void 0;
    this.fullSize = void 0;
  }
  update(maxWidth, maxHeight, margins) {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this._margins = margins;
    this.setDimensions();
    this.buildLabels();
    this.fit();
  }
  setDimensions() {
    if (this.isHorizontal()) {
      this.width = this.maxWidth;
      this.left = this._margins.left;
      this.right = this.width;
    } else {
      this.height = this.maxHeight;
      this.top = this._margins.top;
      this.bottom = this.height;
    }
  }
  buildLabels() {
    const labelOpts = this.options.labels || {};
    let legendItems = callback(labelOpts.generateLabels, [
      this.chart
    ], this) || [];
    if (labelOpts.filter) {
      legendItems = legendItems.filter((item) => labelOpts.filter(item, this.chart.data));
    }
    if (labelOpts.sort) {
      legendItems = legendItems.sort((a2, b2) => labelOpts.sort(a2, b2, this.chart.data));
    }
    if (this.options.reverse) {
      legendItems.reverse();
    }
    this.legendItems = legendItems;
  }
  fit() {
    const { options, ctx } = this;
    if (!options.display) {
      this.width = this.height = 0;
      return;
    }
    const labelOpts = options.labels;
    const labelFont = toFont(labelOpts.font);
    const fontSize = labelFont.size;
    const titleHeight = this._computeTitleHeight();
    const { boxWidth, itemHeight } = getBoxSize(labelOpts, fontSize);
    let width, height;
    ctx.font = labelFont.string;
    if (this.isHorizontal()) {
      width = this.maxWidth;
      height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
    } else {
      height = this.maxHeight;
      width = this._fitCols(titleHeight, labelFont, boxWidth, itemHeight) + 10;
    }
    this.width = Math.min(width, options.maxWidth || this.maxWidth);
    this.height = Math.min(height, options.maxHeight || this.maxHeight);
  }
  _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
    const { ctx, maxWidth, options: { labels: { padding } } } = this;
    const hitboxes = this.legendHitBoxes = [];
    const lineWidths = this.lineWidths = [
      0
    ];
    const lineHeight = itemHeight + padding;
    let totalHeight = titleHeight;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    let row = -1;
    let top = -lineHeight;
    this.legendItems.forEach((legendItem, i2) => {
      const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
      if (i2 === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
        totalHeight += lineHeight;
        lineWidths[lineWidths.length - (i2 > 0 ? 0 : 1)] = 0;
        top += lineHeight;
        row++;
      }
      hitboxes[i2] = {
        left: 0,
        top,
        row,
        width: itemWidth,
        height: itemHeight
      };
      lineWidths[lineWidths.length - 1] += itemWidth + padding;
    });
    return totalHeight;
  }
  _fitCols(titleHeight, labelFont, boxWidth, _itemHeight) {
    const { ctx, maxHeight, options: { labels: { padding } } } = this;
    const hitboxes = this.legendHitBoxes = [];
    const columnSizes = this.columnSizes = [];
    const heightLimit = maxHeight - titleHeight;
    let totalWidth = padding;
    let currentColWidth = 0;
    let currentColHeight = 0;
    let left = 0;
    let col = 0;
    this.legendItems.forEach((legendItem, i2) => {
      const { itemWidth, itemHeight } = calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight);
      if (i2 > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
        totalWidth += currentColWidth + padding;
        columnSizes.push({
          width: currentColWidth,
          height: currentColHeight
        });
        left += currentColWidth + padding;
        col++;
        currentColWidth = currentColHeight = 0;
      }
      hitboxes[i2] = {
        left,
        top: currentColHeight,
        col,
        width: itemWidth,
        height: itemHeight
      };
      currentColWidth = Math.max(currentColWidth, itemWidth);
      currentColHeight += itemHeight + padding;
    });
    totalWidth += currentColWidth;
    columnSizes.push({
      width: currentColWidth,
      height: currentColHeight
    });
    return totalWidth;
  }
  adjustHitBoxes() {
    if (!this.options.display) {
      return;
    }
    const titleHeight = this._computeTitleHeight();
    const { legendHitBoxes: hitboxes, options: { align, labels: { padding }, rtl } } = this;
    const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
    if (this.isHorizontal()) {
      let row = 0;
      let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
      for (const hitbox of hitboxes) {
        if (row !== hitbox.row) {
          row = hitbox.row;
          left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
        }
        hitbox.top += this.top + titleHeight + padding;
        hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
        left += hitbox.width + padding;
      }
    } else {
      let col = 0;
      let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
      for (const hitbox of hitboxes) {
        if (hitbox.col !== col) {
          col = hitbox.col;
          top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
        }
        hitbox.top = top;
        hitbox.left += this.left + padding;
        hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
        top += hitbox.height + padding;
      }
    }
  }
  isHorizontal() {
    return this.options.position === "top" || this.options.position === "bottom";
  }
  draw() {
    if (this.options.display) {
      const ctx = this.ctx;
      clipArea(ctx, this);
      this._draw();
      unclipArea(ctx);
    }
  }
  _draw() {
    const { options: opts, columnSizes, lineWidths, ctx } = this;
    const { align, labels: labelOpts } = opts;
    const defaultColor = defaults.color;
    const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
    const labelFont = toFont(labelOpts.font);
    const { padding } = labelOpts;
    const fontSize = labelFont.size;
    const halfFontSize = fontSize / 2;
    let cursor;
    this.drawTitle();
    ctx.textAlign = rtlHelper.textAlign("left");
    ctx.textBaseline = "middle";
    ctx.lineWidth = 0.5;
    ctx.font = labelFont.string;
    const { boxWidth, boxHeight, itemHeight } = getBoxSize(labelOpts, fontSize);
    const drawLegendBox = function(x2, y2, legendItem) {
      if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
        return;
      }
      ctx.save();
      const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
      ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
      ctx.lineCap = valueOrDefault(legendItem.lineCap, "butt");
      ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
      ctx.lineJoin = valueOrDefault(legendItem.lineJoin, "miter");
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
      ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
      if (labelOpts.usePointStyle) {
        const drawOptions = {
          radius: boxHeight * Math.SQRT2 / 2,
          pointStyle: legendItem.pointStyle,
          rotation: legendItem.rotation,
          borderWidth: lineWidth
        };
        const centerX = rtlHelper.xPlus(x2, boxWidth / 2);
        const centerY = y2 + halfFontSize;
        drawPointLegend(ctx, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && boxWidth);
      } else {
        const yBoxTop = y2 + Math.max((fontSize - boxHeight) / 2, 0);
        const xBoxLeft = rtlHelper.leftForLtr(x2, boxWidth);
        const borderRadius = toTRBLCorners(legendItem.borderRadius);
        ctx.beginPath();
        if (Object.values(borderRadius).some((v2) => v2 !== 0)) {
          addRoundedRectPath(ctx, {
            x: xBoxLeft,
            y: yBoxTop,
            w: boxWidth,
            h: boxHeight,
            radius: borderRadius
          });
        } else {
          ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
        }
        ctx.fill();
        if (lineWidth !== 0) {
          ctx.stroke();
        }
      }
      ctx.restore();
    };
    const fillText = function(x2, y2, legendItem) {
      renderText(ctx, legendItem.text, x2, y2 + itemHeight / 2, labelFont, {
        strikethrough: legendItem.hidden,
        textAlign: rtlHelper.textAlign(legendItem.textAlign)
      });
    };
    const isHorizontal = this.isHorizontal();
    const titleHeight = this._computeTitleHeight();
    if (isHorizontal) {
      cursor = {
        x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
        y: this.top + padding + titleHeight,
        line: 0
      };
    } else {
      cursor = {
        x: this.left + padding,
        y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
        line: 0
      };
    }
    overrideTextDirection(this.ctx, opts.textDirection);
    const lineHeight = itemHeight + padding;
    this.legendItems.forEach((legendItem, i2) => {
      ctx.strokeStyle = legendItem.fontColor;
      ctx.fillStyle = legendItem.fontColor;
      const textWidth = ctx.measureText(legendItem.text).width;
      const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
      const width = boxWidth + halfFontSize + textWidth;
      let x2 = cursor.x;
      let y2 = cursor.y;
      rtlHelper.setWidth(this.width);
      if (isHorizontal) {
        if (i2 > 0 && x2 + width + padding > this.right) {
          y2 = cursor.y += lineHeight;
          cursor.line++;
          x2 = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
        }
      } else if (i2 > 0 && y2 + lineHeight > this.bottom) {
        x2 = cursor.x = x2 + columnSizes[cursor.line].width + padding;
        cursor.line++;
        y2 = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
      }
      const realX = rtlHelper.x(x2);
      drawLegendBox(realX, y2, legendItem);
      x2 = _textX(textAlign, x2 + boxWidth + halfFontSize, isHorizontal ? x2 + width : this.right, opts.rtl);
      fillText(rtlHelper.x(x2), y2, legendItem);
      if (isHorizontal) {
        cursor.x += width + padding;
      } else if (typeof legendItem.text !== "string") {
        const fontLineHeight = labelFont.lineHeight;
        cursor.y += calculateLegendItemHeight(legendItem, fontLineHeight) + padding;
      } else {
        cursor.y += lineHeight;
      }
    });
    restoreTextDirection(this.ctx, opts.textDirection);
  }
  drawTitle() {
    const opts = this.options;
    const titleOpts = opts.title;
    const titleFont = toFont(titleOpts.font);
    const titlePadding = toPadding(titleOpts.padding);
    if (!titleOpts.display) {
      return;
    }
    const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
    const ctx = this.ctx;
    const position = titleOpts.position;
    const halfFontSize = titleFont.size / 2;
    const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
    let y2;
    let left = this.left;
    let maxWidth = this.width;
    if (this.isHorizontal()) {
      maxWidth = Math.max(...this.lineWidths);
      y2 = this.top + topPaddingPlusHalfFontSize;
      left = _alignStartEnd(opts.align, left, this.right - maxWidth);
    } else {
      const maxHeight = this.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
      y2 = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
    }
    const x2 = _alignStartEnd(position, left, left + maxWidth);
    ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
    ctx.textBaseline = "middle";
    ctx.strokeStyle = titleOpts.color;
    ctx.fillStyle = titleOpts.color;
    ctx.font = titleFont.string;
    renderText(ctx, titleOpts.text, x2, y2, titleFont);
  }
  _computeTitleHeight() {
    const titleOpts = this.options.title;
    const titleFont = toFont(titleOpts.font);
    const titlePadding = toPadding(titleOpts.padding);
    return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
  }
  _getLegendItemAt(x2, y2) {
    let i2, hitBox, lh;
    if (_isBetween(x2, this.left, this.right) && _isBetween(y2, this.top, this.bottom)) {
      lh = this.legendHitBoxes;
      for (i2 = 0; i2 < lh.length; ++i2) {
        hitBox = lh[i2];
        if (_isBetween(x2, hitBox.left, hitBox.left + hitBox.width) && _isBetween(y2, hitBox.top, hitBox.top + hitBox.height)) {
          return this.legendItems[i2];
        }
      }
    }
    return null;
  }
  handleEvent(e2) {
    const opts = this.options;
    if (!isListened(e2.type, opts)) {
      return;
    }
    const hoveredItem = this._getLegendItemAt(e2.x, e2.y);
    if (e2.type === "mousemove" || e2.type === "mouseout") {
      const previous = this._hoveredItem;
      const sameItem = itemsEqual(previous, hoveredItem);
      if (previous && !sameItem) {
        callback(opts.onLeave, [
          e2,
          previous,
          this
        ], this);
      }
      this._hoveredItem = hoveredItem;
      if (hoveredItem && !sameItem) {
        callback(opts.onHover, [
          e2,
          hoveredItem,
          this
        ], this);
      }
    } else if (hoveredItem) {
      callback(opts.onClick, [
        e2,
        hoveredItem,
        this
      ], this);
    }
  }
};
function calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight) {
  const itemWidth = calculateItemWidth(legendItem, boxWidth, labelFont, ctx);
  const itemHeight = calculateItemHeight(_itemHeight, legendItem, labelFont.lineHeight);
  return {
    itemWidth,
    itemHeight
  };
}
function calculateItemWidth(legendItem, boxWidth, labelFont, ctx) {
  let legendItemText = legendItem.text;
  if (legendItemText && typeof legendItemText !== "string") {
    legendItemText = legendItemText.reduce((a2, b2) => a2.length > b2.length ? a2 : b2);
  }
  return boxWidth + labelFont.size / 2 + ctx.measureText(legendItemText).width;
}
function calculateItemHeight(_itemHeight, legendItem, fontLineHeight) {
  let itemHeight = _itemHeight;
  if (typeof legendItem.text !== "string") {
    itemHeight = calculateLegendItemHeight(legendItem, fontLineHeight);
  }
  return itemHeight;
}
function calculateLegendItemHeight(legendItem, fontLineHeight) {
  const labelHeight = legendItem.text ? legendItem.text.length : 0;
  return fontLineHeight * labelHeight;
}
function isListened(type, opts) {
  if ((type === "mousemove" || type === "mouseout") && (opts.onHover || opts.onLeave)) {
    return true;
  }
  if (opts.onClick && (type === "click" || type === "mouseup")) {
    return true;
  }
  return false;
}
var plugin_legend = {
  id: "legend",
  _element: Legend,
  start(chart, _args, options) {
    const legend = chart.legend = new Legend({
      ctx: chart.ctx,
      options,
      chart
    });
    layouts.configure(chart, legend, options);
    layouts.addBox(chart, legend);
  },
  stop(chart) {
    layouts.removeBox(chart, chart.legend);
    delete chart.legend;
  },
  beforeUpdate(chart, _args, options) {
    const legend = chart.legend;
    layouts.configure(chart, legend, options);
    legend.options = options;
  },
  afterUpdate(chart) {
    const legend = chart.legend;
    legend.buildLabels();
    legend.adjustHitBoxes();
  },
  afterEvent(chart, args) {
    if (!args.replay) {
      chart.legend.handleEvent(args.event);
    }
  },
  defaults: {
    display: true,
    position: "top",
    align: "center",
    fullSize: true,
    reverse: false,
    weight: 1e3,
    onClick(e2, legendItem, legend) {
      const index2 = legendItem.datasetIndex;
      const ci2 = legend.chart;
      if (ci2.isDatasetVisible(index2)) {
        ci2.hide(index2);
        legendItem.hidden = true;
      } else {
        ci2.show(index2);
        legendItem.hidden = false;
      }
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (ctx) => ctx.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(chart) {
        const datasets = chart.data.datasets;
        const { labels: { usePointStyle, pointStyle, textAlign, color: color2, useBorderRadius, borderRadius } } = chart.legend.options;
        return chart._getSortedDatasetMetas().map((meta) => {
          const style = meta.controller.getStyle(usePointStyle ? 0 : void 0);
          const borderWidth = toPadding(style.borderWidth);
          return {
            text: datasets[meta.index].label,
            fillStyle: style.backgroundColor,
            fontColor: color2,
            hidden: !meta.visible,
            lineCap: style.borderCapStyle,
            lineDash: style.borderDash,
            lineDashOffset: style.borderDashOffset,
            lineJoin: style.borderJoinStyle,
            lineWidth: (borderWidth.width + borderWidth.height) / 4,
            strokeStyle: style.borderColor,
            pointStyle: pointStyle || style.pointStyle,
            rotation: style.rotation,
            textAlign: textAlign || style.textAlign,
            borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
            datasetIndex: meta.index
          };
        }, this);
      }
    },
    title: {
      color: (ctx) => ctx.chart.options.color,
      display: false,
      position: "center",
      text: ""
    }
  },
  descriptors: {
    _scriptable: (name) => !name.startsWith("on"),
    labels: {
      _scriptable: (name) => ![
        "generateLabels",
        "filter",
        "sort"
      ].includes(name)
    }
  }
};
var Title = class extends Element2 {
  constructor(config) {
    super();
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this._padding = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.right = void 0;
    this.width = void 0;
    this.height = void 0;
    this.position = void 0;
    this.weight = void 0;
    this.fullSize = void 0;
  }
  update(maxWidth, maxHeight) {
    const opts = this.options;
    this.left = 0;
    this.top = 0;
    if (!opts.display) {
      this.width = this.height = this.right = this.bottom = 0;
      return;
    }
    this.width = this.right = maxWidth;
    this.height = this.bottom = maxHeight;
    const lineCount = isArray(opts.text) ? opts.text.length : 1;
    this._padding = toPadding(opts.padding);
    const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
    if (this.isHorizontal()) {
      this.height = textSize;
    } else {
      this.width = textSize;
    }
  }
  isHorizontal() {
    const pos = this.options.position;
    return pos === "top" || pos === "bottom";
  }
  _drawArgs(offset) {
    const { top, left, bottom, right, options } = this;
    const align = options.align;
    let rotation = 0;
    let maxWidth, titleX, titleY;
    if (this.isHorizontal()) {
      titleX = _alignStartEnd(align, left, right);
      titleY = top + offset;
      maxWidth = right - left;
    } else {
      if (options.position === "left") {
        titleX = left + offset;
        titleY = _alignStartEnd(align, bottom, top);
        rotation = PI * -0.5;
      } else {
        titleX = right - offset;
        titleY = _alignStartEnd(align, top, bottom);
        rotation = PI * 0.5;
      }
      maxWidth = bottom - top;
    }
    return {
      titleX,
      titleY,
      maxWidth,
      rotation
    };
  }
  draw() {
    const ctx = this.ctx;
    const opts = this.options;
    if (!opts.display) {
      return;
    }
    const fontOpts = toFont(opts.font);
    const lineHeight = fontOpts.lineHeight;
    const offset = lineHeight / 2 + this._padding.top;
    const { titleX, titleY, maxWidth, rotation } = this._drawArgs(offset);
    renderText(ctx, opts.text, 0, 0, fontOpts, {
      color: opts.color,
      maxWidth,
      rotation,
      textAlign: _toLeftRightCenter(opts.align),
      textBaseline: "middle",
      translation: [
        titleX,
        titleY
      ]
    });
  }
};
function createTitle(chart, titleOpts) {
  const title = new Title({
    ctx: chart.ctx,
    options: titleOpts,
    chart
  });
  layouts.configure(chart, title, titleOpts);
  layouts.addBox(chart, title);
  chart.titleBlock = title;
}
var plugin_title = {
  id: "title",
  _element: Title,
  start(chart, _args, options) {
    createTitle(chart, options);
  },
  stop(chart) {
    const titleBlock = chart.titleBlock;
    layouts.removeBox(chart, titleBlock);
    delete chart.titleBlock;
  },
  beforeUpdate(chart, _args, options) {
    const title = chart.titleBlock;
    layouts.configure(chart, title, options);
    title.options = options;
  },
  defaults: {
    align: "center",
    display: false,
    font: {
      weight: "bold"
    },
    fullSize: true,
    padding: 10,
    position: "top",
    text: "",
    weight: 2e3
  },
  defaultRoutes: {
    color: "color"
  },
  descriptors: {
    _scriptable: true,
    _indexable: false
  }
};
var map2 = /* @__PURE__ */ new WeakMap();
var plugin_subtitle = {
  id: "subtitle",
  start(chart, _args, options) {
    const title = new Title({
      ctx: chart.ctx,
      options,
      chart
    });
    layouts.configure(chart, title, options);
    layouts.addBox(chart, title);
    map2.set(chart, title);
  },
  stop(chart) {
    layouts.removeBox(chart, map2.get(chart));
    map2.delete(chart);
  },
  beforeUpdate(chart, _args, options) {
    const title = map2.get(chart);
    layouts.configure(chart, title, options);
    title.options = options;
  },
  defaults: {
    align: "center",
    display: false,
    font: {
      weight: "normal"
    },
    fullSize: true,
    padding: 0,
    position: "top",
    text: "",
    weight: 1500
  },
  defaultRoutes: {
    color: "color"
  },
  descriptors: {
    _scriptable: true,
    _indexable: false
  }
};
var positioners = {
  average(items) {
    if (!items.length) {
      return false;
    }
    let i2, len;
    let xSet = /* @__PURE__ */ new Set();
    let y2 = 0;
    let count = 0;
    for (i2 = 0, len = items.length; i2 < len; ++i2) {
      const el = items[i2].element;
      if (el && el.hasValue()) {
        const pos = el.tooltipPosition();
        xSet.add(pos.x);
        y2 += pos.y;
        ++count;
      }
    }
    if (count === 0 || xSet.size === 0) {
      return false;
    }
    const xAverage = [
      ...xSet
    ].reduce((a2, b2) => a2 + b2) / xSet.size;
    return {
      x: xAverage,
      y: y2 / count
    };
  },
  nearest(items, eventPosition) {
    if (!items.length) {
      return false;
    }
    let x2 = eventPosition.x;
    let y2 = eventPosition.y;
    let minDistance = Number.POSITIVE_INFINITY;
    let i2, len, nearestElement;
    for (i2 = 0, len = items.length; i2 < len; ++i2) {
      const el = items[i2].element;
      if (el && el.hasValue()) {
        const center = el.getCenterPoint();
        const d2 = distanceBetweenPoints(eventPosition, center);
        if (d2 < minDistance) {
          minDistance = d2;
          nearestElement = el;
        }
      }
    }
    if (nearestElement) {
      const tp = nearestElement.tooltipPosition();
      x2 = tp.x;
      y2 = tp.y;
    }
    return {
      x: x2,
      y: y2
    };
  }
};
function pushOrConcat(base, toPush) {
  if (toPush) {
    if (isArray(toPush)) {
      Array.prototype.push.apply(base, toPush);
    } else {
      base.push(toPush);
    }
  }
  return base;
}
function splitNewlines(str) {
  if ((typeof str === "string" || str instanceof String) && str.indexOf("\n") > -1) {
    return str.split("\n");
  }
  return str;
}
function createTooltipItem(chart, item) {
  const { element, datasetIndex, index: index2 } = item;
  const controller = chart.getDatasetMeta(datasetIndex).controller;
  const { label, value } = controller.getLabelAndValue(index2);
  return {
    chart,
    label,
    parsed: controller.getParsed(index2),
    raw: chart.data.datasets[datasetIndex].data[index2],
    formattedValue: value,
    dataset: controller.getDataset(),
    dataIndex: index2,
    datasetIndex,
    element
  };
}
function getTooltipSize(tooltip, options) {
  const ctx = tooltip.chart.ctx;
  const { body, footer, title } = tooltip;
  const { boxWidth, boxHeight } = options;
  const bodyFont = toFont(options.bodyFont);
  const titleFont = toFont(options.titleFont);
  const footerFont = toFont(options.footerFont);
  const titleLineCount = title.length;
  const footerLineCount = footer.length;
  const bodyLineItemCount = body.length;
  const padding = toPadding(options.padding);
  let height = padding.height;
  let width = 0;
  let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
  combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
  if (titleLineCount) {
    height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
  }
  if (combinedBodyLength) {
    const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
    height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
  }
  if (footerLineCount) {
    height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
  }
  let widthPadding = 0;
  const maxLineWidth = function(line) {
    width = Math.max(width, ctx.measureText(line).width + widthPadding);
  };
  ctx.save();
  ctx.font = titleFont.string;
  each(tooltip.title, maxLineWidth);
  ctx.font = bodyFont.string;
  each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
  widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0;
  each(body, (bodyItem) => {
    each(bodyItem.before, maxLineWidth);
    each(bodyItem.lines, maxLineWidth);
    each(bodyItem.after, maxLineWidth);
  });
  widthPadding = 0;
  ctx.font = footerFont.string;
  each(tooltip.footer, maxLineWidth);
  ctx.restore();
  width += padding.width;
  return {
    width,
    height
  };
}
function determineYAlign(chart, size) {
  const { y: y2, height } = size;
  if (y2 < height / 2) {
    return "top";
  } else if (y2 > chart.height - height / 2) {
    return "bottom";
  }
  return "center";
}
function doesNotFitWithAlign(xAlign, chart, options, size) {
  const { x: x2, width } = size;
  const caret = options.caretSize + options.caretPadding;
  if (xAlign === "left" && x2 + width + caret > chart.width) {
    return true;
  }
  if (xAlign === "right" && x2 - width - caret < 0) {
    return true;
  }
}
function determineXAlign(chart, options, size, yAlign) {
  const { x: x2, width } = size;
  const { width: chartWidth, chartArea: { left, right } } = chart;
  let xAlign = "center";
  if (yAlign === "center") {
    xAlign = x2 <= (left + right) / 2 ? "left" : "right";
  } else if (x2 <= width / 2) {
    xAlign = "left";
  } else if (x2 >= chartWidth - width / 2) {
    xAlign = "right";
  }
  if (doesNotFitWithAlign(xAlign, chart, options, size)) {
    xAlign = "center";
  }
  return xAlign;
}
function determineAlignment(chart, options, size) {
  const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
  return {
    xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
    yAlign
  };
}
function alignX(size, xAlign) {
  let { x: x2, width } = size;
  if (xAlign === "right") {
    x2 -= width;
  } else if (xAlign === "center") {
    x2 -= width / 2;
  }
  return x2;
}
function alignY(size, yAlign, paddingAndSize) {
  let { y: y2, height } = size;
  if (yAlign === "top") {
    y2 += paddingAndSize;
  } else if (yAlign === "bottom") {
    y2 -= height + paddingAndSize;
  } else {
    y2 -= height / 2;
  }
  return y2;
}
function getBackgroundPoint(options, size, alignment, chart) {
  const { caretSize, caretPadding, cornerRadius } = options;
  const { xAlign, yAlign } = alignment;
  const paddingAndSize = caretSize + caretPadding;
  const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
  let x2 = alignX(size, xAlign);
  const y2 = alignY(size, yAlign, paddingAndSize);
  if (yAlign === "center") {
    if (xAlign === "left") {
      x2 += paddingAndSize;
    } else if (xAlign === "right") {
      x2 -= paddingAndSize;
    }
  } else if (xAlign === "left") {
    x2 -= Math.max(topLeft, bottomLeft) + caretSize;
  } else if (xAlign === "right") {
    x2 += Math.max(topRight, bottomRight) + caretSize;
  }
  return {
    x: _limitValue(x2, 0, chart.width - size.width),
    y: _limitValue(y2, 0, chart.height - size.height)
  };
}
function getAlignedX(tooltip, align, options) {
  const padding = toPadding(options.padding);
  return align === "center" ? tooltip.x + tooltip.width / 2 : align === "right" ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
}
function getBeforeAfterBodyLines(callback2) {
  return pushOrConcat([], splitNewlines(callback2));
}
function createTooltipContext(parent, tooltip, tooltipItems) {
  return createContext(parent, {
    tooltip,
    tooltipItems,
    type: "tooltip"
  });
}
function overrideCallbacks(callbacks, context) {
  const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
  return override ? callbacks.override(override) : callbacks;
}
var defaultCallbacks = {
  beforeTitle: noop,
  title(tooltipItems) {
    if (tooltipItems.length > 0) {
      const item = tooltipItems[0];
      const labels = item.chart.data.labels;
      const labelCount = labels ? labels.length : 0;
      if (this && this.options && this.options.mode === "dataset") {
        return item.dataset.label || "";
      } else if (item.label) {
        return item.label;
      } else if (labelCount > 0 && item.dataIndex < labelCount) {
        return labels[item.dataIndex];
      }
    }
    return "";
  },
  afterTitle: noop,
  beforeBody: noop,
  beforeLabel: noop,
  label(tooltipItem) {
    if (this && this.options && this.options.mode === "dataset") {
      return tooltipItem.label + ": " + tooltipItem.formattedValue || tooltipItem.formattedValue;
    }
    let label = tooltipItem.dataset.label || "";
    if (label) {
      label += ": ";
    }
    const value = tooltipItem.formattedValue;
    if (!isNullOrUndef(value)) {
      label += value;
    }
    return label;
  },
  labelColor(tooltipItem) {
    const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
    const options = meta.controller.getStyle(tooltipItem.dataIndex);
    return {
      borderColor: options.borderColor,
      backgroundColor: options.backgroundColor,
      borderWidth: options.borderWidth,
      borderDash: options.borderDash,
      borderDashOffset: options.borderDashOffset,
      borderRadius: 0
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(tooltipItem) {
    const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
    const options = meta.controller.getStyle(tooltipItem.dataIndex);
    return {
      pointStyle: options.pointStyle,
      rotation: options.rotation
    };
  },
  afterLabel: noop,
  afterBody: noop,
  beforeFooter: noop,
  footer: noop,
  afterFooter: noop
};
function invokeCallbackWithFallback(callbacks, name, ctx, arg) {
  const result = callbacks[name].call(ctx, arg);
  if (typeof result === "undefined") {
    return defaultCallbacks[name].call(ctx, arg);
  }
  return result;
}
var Tooltip = class extends Element2 {
  static positioners = positioners;
  constructor(config) {
    super();
    this.opacity = 0;
    this._active = [];
    this._eventPosition = void 0;
    this._size = void 0;
    this._cachedAnimations = void 0;
    this._tooltipItems = [];
    this.$animations = void 0;
    this.$context = void 0;
    this.chart = config.chart;
    this.options = config.options;
    this.dataPoints = void 0;
    this.title = void 0;
    this.beforeBody = void 0;
    this.body = void 0;
    this.afterBody = void 0;
    this.footer = void 0;
    this.xAlign = void 0;
    this.yAlign = void 0;
    this.x = void 0;
    this.y = void 0;
    this.height = void 0;
    this.width = void 0;
    this.caretX = void 0;
    this.caretY = void 0;
    this.labelColors = void 0;
    this.labelPointStyles = void 0;
    this.labelTextColors = void 0;
  }
  initialize(options) {
    this.options = options;
    this._cachedAnimations = void 0;
    this.$context = void 0;
  }
  _resolveAnimations() {
    const cached = this._cachedAnimations;
    if (cached) {
      return cached;
    }
    const chart = this.chart;
    const options = this.options.setContext(this.getContext());
    const opts = options.enabled && chart.options.animation && options.animations;
    const animations = new Animations(this.chart, opts);
    if (opts._cacheable) {
      this._cachedAnimations = Object.freeze(animations);
    }
    return animations;
  }
  getContext() {
    return this.$context || (this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(context, options) {
    const { callbacks } = options;
    const beforeTitle = invokeCallbackWithFallback(callbacks, "beforeTitle", this, context);
    const title = invokeCallbackWithFallback(callbacks, "title", this, context);
    const afterTitle = invokeCallbackWithFallback(callbacks, "afterTitle", this, context);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeTitle));
    lines = pushOrConcat(lines, splitNewlines(title));
    lines = pushOrConcat(lines, splitNewlines(afterTitle));
    return lines;
  }
  getBeforeBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, "beforeBody", this, tooltipItems));
  }
  getBody(tooltipItems, options) {
    const { callbacks } = options;
    const bodyItems = [];
    each(tooltipItems, (context) => {
      const bodyItem = {
        before: [],
        lines: [],
        after: []
      };
      const scoped = overrideCallbacks(callbacks, context);
      pushOrConcat(bodyItem.before, splitNewlines(invokeCallbackWithFallback(scoped, "beforeLabel", this, context)));
      pushOrConcat(bodyItem.lines, invokeCallbackWithFallback(scoped, "label", this, context));
      pushOrConcat(bodyItem.after, splitNewlines(invokeCallbackWithFallback(scoped, "afterLabel", this, context)));
      bodyItems.push(bodyItem);
    });
    return bodyItems;
  }
  getAfterBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, "afterBody", this, tooltipItems));
  }
  getFooter(tooltipItems, options) {
    const { callbacks } = options;
    const beforeFooter = invokeCallbackWithFallback(callbacks, "beforeFooter", this, tooltipItems);
    const footer = invokeCallbackWithFallback(callbacks, "footer", this, tooltipItems);
    const afterFooter = invokeCallbackWithFallback(callbacks, "afterFooter", this, tooltipItems);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeFooter));
    lines = pushOrConcat(lines, splitNewlines(footer));
    lines = pushOrConcat(lines, splitNewlines(afterFooter));
    return lines;
  }
  _createItems(options) {
    const active = this._active;
    const data = this.chart.data;
    const labelColors = [];
    const labelPointStyles = [];
    const labelTextColors = [];
    let tooltipItems = [];
    let i2, len;
    for (i2 = 0, len = active.length; i2 < len; ++i2) {
      tooltipItems.push(createTooltipItem(this.chart, active[i2]));
    }
    if (options.filter) {
      tooltipItems = tooltipItems.filter((element, index2, array) => options.filter(element, index2, array, data));
    }
    if (options.itemSort) {
      tooltipItems = tooltipItems.sort((a2, b2) => options.itemSort(a2, b2, data));
    }
    each(tooltipItems, (context) => {
      const scoped = overrideCallbacks(options.callbacks, context);
      labelColors.push(invokeCallbackWithFallback(scoped, "labelColor", this, context));
      labelPointStyles.push(invokeCallbackWithFallback(scoped, "labelPointStyle", this, context));
      labelTextColors.push(invokeCallbackWithFallback(scoped, "labelTextColor", this, context));
    });
    this.labelColors = labelColors;
    this.labelPointStyles = labelPointStyles;
    this.labelTextColors = labelTextColors;
    this.dataPoints = tooltipItems;
    return tooltipItems;
  }
  update(changed, replay) {
    const options = this.options.setContext(this.getContext());
    const active = this._active;
    let properties;
    let tooltipItems = [];
    if (!active.length) {
      if (this.opacity !== 0) {
        properties = {
          opacity: 0
        };
      }
    } else {
      const position = positioners[options.position].call(this, active, this._eventPosition);
      tooltipItems = this._createItems(options);
      this.title = this.getTitle(tooltipItems, options);
      this.beforeBody = this.getBeforeBody(tooltipItems, options);
      this.body = this.getBody(tooltipItems, options);
      this.afterBody = this.getAfterBody(tooltipItems, options);
      this.footer = this.getFooter(tooltipItems, options);
      const size = this._size = getTooltipSize(this, options);
      const positionAndSize = Object.assign({}, position, size);
      const alignment = determineAlignment(this.chart, options, positionAndSize);
      const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
      this.xAlign = alignment.xAlign;
      this.yAlign = alignment.yAlign;
      properties = {
        opacity: 1,
        x: backgroundPoint.x,
        y: backgroundPoint.y,
        width: size.width,
        height: size.height,
        caretX: position.x,
        caretY: position.y
      };
    }
    this._tooltipItems = tooltipItems;
    this.$context = void 0;
    if (properties) {
      this._resolveAnimations().update(this, properties);
    }
    if (changed && options.external) {
      options.external.call(this, {
        chart: this.chart,
        tooltip: this,
        replay
      });
    }
  }
  drawCaret(tooltipPoint, ctx, size, options) {
    const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
    ctx.lineTo(caretPosition.x1, caretPosition.y1);
    ctx.lineTo(caretPosition.x2, caretPosition.y2);
    ctx.lineTo(caretPosition.x3, caretPosition.y3);
  }
  getCaretPosition(tooltipPoint, size, options) {
    const { xAlign, yAlign } = this;
    const { caretSize, cornerRadius } = options;
    const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
    const { x: ptX, y: ptY } = tooltipPoint;
    const { width, height } = size;
    let x1, x2, x3, y1, y2, y3;
    if (yAlign === "center") {
      y2 = ptY + height / 2;
      if (xAlign === "left") {
        x1 = ptX;
        x2 = x1 - caretSize;
        y1 = y2 + caretSize;
        y3 = y2 - caretSize;
      } else {
        x1 = ptX + width;
        x2 = x1 + caretSize;
        y1 = y2 - caretSize;
        y3 = y2 + caretSize;
      }
      x3 = x1;
    } else {
      if (xAlign === "left") {
        x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize;
      } else if (xAlign === "right") {
        x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
      } else {
        x2 = this.caretX;
      }
      if (yAlign === "top") {
        y1 = ptY;
        y2 = y1 - caretSize;
        x1 = x2 - caretSize;
        x3 = x2 + caretSize;
      } else {
        y1 = ptY + height;
        y2 = y1 + caretSize;
        x1 = x2 + caretSize;
        x3 = x2 - caretSize;
      }
      y3 = y1;
    }
    return {
      x1,
      x2,
      x3,
      y1,
      y2,
      y3
    };
  }
  drawTitle(pt2, ctx, options) {
    const title = this.title;
    const length = title.length;
    let titleFont, titleSpacing, i2;
    if (length) {
      const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
      pt2.x = getAlignedX(this, options.titleAlign, options);
      ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
      ctx.textBaseline = "middle";
      titleFont = toFont(options.titleFont);
      titleSpacing = options.titleSpacing;
      ctx.fillStyle = options.titleColor;
      ctx.font = titleFont.string;
      for (i2 = 0; i2 < length; ++i2) {
        ctx.fillText(title[i2], rtlHelper.x(pt2.x), pt2.y + titleFont.lineHeight / 2);
        pt2.y += titleFont.lineHeight + titleSpacing;
        if (i2 + 1 === length) {
          pt2.y += options.titleMarginBottom - titleSpacing;
        }
      }
    }
  }
  _drawColorBox(ctx, pt2, i2, rtlHelper, options) {
    const labelColor = this.labelColors[i2];
    const labelPointStyle = this.labelPointStyles[i2];
    const { boxHeight, boxWidth } = options;
    const bodyFont = toFont(options.bodyFont);
    const colorX = getAlignedX(this, "left", options);
    const rtlColorX = rtlHelper.x(colorX);
    const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
    const colorY = pt2.y + yOffSet;
    if (options.usePointStyle) {
      const drawOptions = {
        radius: Math.min(boxWidth, boxHeight) / 2,
        pointStyle: labelPointStyle.pointStyle,
        rotation: labelPointStyle.rotation,
        borderWidth: 1
      };
      const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
      const centerY = colorY + boxHeight / 2;
      ctx.strokeStyle = options.multiKeyBackground;
      ctx.fillStyle = options.multiKeyBackground;
      drawPoint(ctx, drawOptions, centerX, centerY);
      ctx.strokeStyle = labelColor.borderColor;
      ctx.fillStyle = labelColor.backgroundColor;
      drawPoint(ctx, drawOptions, centerX, centerY);
    } else {
      ctx.lineWidth = isObject(labelColor.borderWidth) ? Math.max(...Object.values(labelColor.borderWidth)) : labelColor.borderWidth || 1;
      ctx.strokeStyle = labelColor.borderColor;
      ctx.setLineDash(labelColor.borderDash || []);
      ctx.lineDashOffset = labelColor.borderDashOffset || 0;
      const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth);
      const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - 2);
      const borderRadius = toTRBLCorners(labelColor.borderRadius);
      if (Object.values(borderRadius).some((v2) => v2 !== 0)) {
        ctx.beginPath();
        ctx.fillStyle = options.multiKeyBackground;
        addRoundedRectPath(ctx, {
          x: outerX,
          y: colorY,
          w: boxWidth,
          h: boxHeight,
          radius: borderRadius
        });
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = labelColor.backgroundColor;
        ctx.beginPath();
        addRoundedRectPath(ctx, {
          x: innerX,
          y: colorY + 1,
          w: boxWidth - 2,
          h: boxHeight - 2,
          radius: borderRadius
        });
        ctx.fill();
      } else {
        ctx.fillStyle = options.multiKeyBackground;
        ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
        ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
        ctx.fillStyle = labelColor.backgroundColor;
        ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
      }
    }
    ctx.fillStyle = this.labelTextColors[i2];
  }
  drawBody(pt2, ctx, options) {
    const { body } = this;
    const { bodySpacing, bodyAlign, displayColors, boxHeight, boxWidth, boxPadding } = options;
    const bodyFont = toFont(options.bodyFont);
    let bodyLineHeight = bodyFont.lineHeight;
    let xLinePadding = 0;
    const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
    const fillLineOfText = function(line) {
      ctx.fillText(line, rtlHelper.x(pt2.x + xLinePadding), pt2.y + bodyLineHeight / 2);
      pt2.y += bodyLineHeight + bodySpacing;
    };
    const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
    let bodyItem, textColor, lines, i2, j2, ilen, jlen;
    ctx.textAlign = bodyAlign;
    ctx.textBaseline = "middle";
    ctx.font = bodyFont.string;
    pt2.x = getAlignedX(this, bodyAlignForCalculation, options);
    ctx.fillStyle = options.bodyColor;
    each(this.beforeBody, fillLineOfText);
    xLinePadding = displayColors && bodyAlignForCalculation !== "right" ? bodyAlign === "center" ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0;
    for (i2 = 0, ilen = body.length; i2 < ilen; ++i2) {
      bodyItem = body[i2];
      textColor = this.labelTextColors[i2];
      ctx.fillStyle = textColor;
      each(bodyItem.before, fillLineOfText);
      lines = bodyItem.lines;
      if (displayColors && lines.length) {
        this._drawColorBox(ctx, pt2, i2, rtlHelper, options);
        bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
      }
      for (j2 = 0, jlen = lines.length; j2 < jlen; ++j2) {
        fillLineOfText(lines[j2]);
        bodyLineHeight = bodyFont.lineHeight;
      }
      each(bodyItem.after, fillLineOfText);
    }
    xLinePadding = 0;
    bodyLineHeight = bodyFont.lineHeight;
    each(this.afterBody, fillLineOfText);
    pt2.y -= bodySpacing;
  }
  drawFooter(pt2, ctx, options) {
    const footer = this.footer;
    const length = footer.length;
    let footerFont, i2;
    if (length) {
      const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
      pt2.x = getAlignedX(this, options.footerAlign, options);
      pt2.y += options.footerMarginTop;
      ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
      ctx.textBaseline = "middle";
      footerFont = toFont(options.footerFont);
      ctx.fillStyle = options.footerColor;
      ctx.font = footerFont.string;
      for (i2 = 0; i2 < length; ++i2) {
        ctx.fillText(footer[i2], rtlHelper.x(pt2.x), pt2.y + footerFont.lineHeight / 2);
        pt2.y += footerFont.lineHeight + options.footerSpacing;
      }
    }
  }
  drawBackground(pt2, ctx, tooltipSize, options) {
    const { xAlign, yAlign } = this;
    const { x: x2, y: y2 } = pt2;
    const { width, height } = tooltipSize;
    const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(options.cornerRadius);
    ctx.fillStyle = options.backgroundColor;
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.beginPath();
    ctx.moveTo(x2 + topLeft, y2);
    if (yAlign === "top") {
      this.drawCaret(pt2, ctx, tooltipSize, options);
    }
    ctx.lineTo(x2 + width - topRight, y2);
    ctx.quadraticCurveTo(x2 + width, y2, x2 + width, y2 + topRight);
    if (yAlign === "center" && xAlign === "right") {
      this.drawCaret(pt2, ctx, tooltipSize, options);
    }
    ctx.lineTo(x2 + width, y2 + height - bottomRight);
    ctx.quadraticCurveTo(x2 + width, y2 + height, x2 + width - bottomRight, y2 + height);
    if (yAlign === "bottom") {
      this.drawCaret(pt2, ctx, tooltipSize, options);
    }
    ctx.lineTo(x2 + bottomLeft, y2 + height);
    ctx.quadraticCurveTo(x2, y2 + height, x2, y2 + height - bottomLeft);
    if (yAlign === "center" && xAlign === "left") {
      this.drawCaret(pt2, ctx, tooltipSize, options);
    }
    ctx.lineTo(x2, y2 + topLeft);
    ctx.quadraticCurveTo(x2, y2, x2 + topLeft, y2);
    ctx.closePath();
    ctx.fill();
    if (options.borderWidth > 0) {
      ctx.stroke();
    }
  }
  _updateAnimationTarget(options) {
    const chart = this.chart;
    const anims = this.$animations;
    const animX = anims && anims.x;
    const animY = anims && anims.y;
    if (animX || animY) {
      const position = positioners[options.position].call(this, this._active, this._eventPosition);
      if (!position) {
        return;
      }
      const size = this._size = getTooltipSize(this, options);
      const positionAndSize = Object.assign({}, position, this._size);
      const alignment = determineAlignment(chart, options, positionAndSize);
      const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
      if (animX._to !== point.x || animY._to !== point.y) {
        this.xAlign = alignment.xAlign;
        this.yAlign = alignment.yAlign;
        this.width = size.width;
        this.height = size.height;
        this.caretX = position.x;
        this.caretY = position.y;
        this._resolveAnimations().update(this, point);
      }
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(ctx) {
    const options = this.options.setContext(this.getContext());
    let opacity = this.opacity;
    if (!opacity) {
      return;
    }
    this._updateAnimationTarget(options);
    const tooltipSize = {
      width: this.width,
      height: this.height
    };
    const pt2 = {
      x: this.x,
      y: this.y
    };
    opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
    const padding = toPadding(options.padding);
    const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    if (options.enabled && hasTooltipContent) {
      ctx.save();
      ctx.globalAlpha = opacity;
      this.drawBackground(pt2, ctx, tooltipSize, options);
      overrideTextDirection(ctx, options.textDirection);
      pt2.y += padding.top;
      this.drawTitle(pt2, ctx, options);
      this.drawBody(pt2, ctx, options);
      this.drawFooter(pt2, ctx, options);
      restoreTextDirection(ctx, options.textDirection);
      ctx.restore();
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(activeElements, eventPosition) {
    const lastActive = this._active;
    const active = activeElements.map(({ datasetIndex, index: index2 }) => {
      const meta = this.chart.getDatasetMeta(datasetIndex);
      if (!meta) {
        throw new Error("Cannot find a dataset at index " + datasetIndex);
      }
      return {
        datasetIndex,
        element: meta.data[index2],
        index: index2
      };
    });
    const changed = !_elementsEqual(lastActive, active);
    const positionChanged = this._positionChanged(active, eventPosition);
    if (changed || positionChanged) {
      this._active = active;
      this._eventPosition = eventPosition;
      this._ignoreReplayEvents = true;
      this.update(true);
    }
  }
  handleEvent(e2, replay, inChartArea = true) {
    if (replay && this._ignoreReplayEvents) {
      return false;
    }
    this._ignoreReplayEvents = false;
    const options = this.options;
    const lastActive = this._active || [];
    const active = this._getActiveElements(e2, lastActive, replay, inChartArea);
    const positionChanged = this._positionChanged(active, e2);
    const changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
    if (changed) {
      this._active = active;
      if (options.enabled || options.external) {
        this._eventPosition = {
          x: e2.x,
          y: e2.y
        };
        this.update(true, replay);
      }
    }
    return changed;
  }
  _getActiveElements(e2, lastActive, replay, inChartArea) {
    const options = this.options;
    if (e2.type === "mouseout") {
      return [];
    }
    if (!inChartArea) {
      return lastActive.filter((i2) => this.chart.data.datasets[i2.datasetIndex] && this.chart.getDatasetMeta(i2.datasetIndex).controller.getParsed(i2.index) !== void 0);
    }
    const active = this.chart.getElementsAtEventForMode(e2, options.mode, options, replay);
    if (options.reverse) {
      active.reverse();
    }
    return active;
  }
  _positionChanged(active, e2) {
    const { caretX, caretY, options } = this;
    const position = positioners[options.position].call(this, active, e2);
    return position !== false && (caretX !== position.x || caretY !== position.y);
  }
};
var plugin_tooltip = {
  id: "tooltip",
  _element: Tooltip,
  positioners,
  afterInit(chart, _args, options) {
    if (options) {
      chart.tooltip = new Tooltip({
        chart,
        options
      });
    }
  },
  beforeUpdate(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },
  reset(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },
  afterDraw(chart) {
    const tooltip = chart.tooltip;
    if (tooltip && tooltip._willRender()) {
      const args = {
        tooltip
      };
      if (chart.notifyPlugins("beforeTooltipDraw", __spreadProps(__spreadValues({}, args), {
        cancelable: true
      })) === false) {
        return;
      }
      tooltip.draw(chart.ctx);
      chart.notifyPlugins("afterTooltipDraw", args);
    }
  },
  afterEvent(chart, args) {
    if (chart.tooltip) {
      const useFinalPosition = args.replay;
      if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
        args.changed = true;
      }
    }
  },
  defaults: {
    enabled: true,
    external: null,
    position: "average",
    backgroundColor: "rgba(0,0,0,0.8)",
    titleColor: "#fff",
    titleFont: {
      weight: "bold"
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: "left",
    bodyColor: "#fff",
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: "left",
    footerColor: "#fff",
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: "bold"
    },
    footerAlign: "left",
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (ctx, opts) => opts.bodyFont.size,
    boxWidth: (ctx, opts) => opts.bodyFont.size,
    multiKeyBackground: "#fff",
    displayColors: true,
    boxPadding: 0,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: "easeOutQuart"
    },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "width",
          "height",
          "caretX",
          "caretY"
        ]
      },
      opacity: {
        easing: "linear",
        duration: 200
      }
    },
    callbacks: defaultCallbacks
  },
  defaultRoutes: {
    bodyFont: "font",
    footerFont: "font",
    titleFont: "font"
  },
  descriptors: {
    _scriptable: (name) => name !== "filter" && name !== "itemSort" && name !== "external",
    _indexable: false,
    callbacks: {
      _scriptable: false,
      _indexable: false
    },
    animation: {
      _fallback: false
    },
    animations: {
      _fallback: "animation"
    }
  },
  additionalOptionScopes: [
    "interaction"
  ]
};
var plugins = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Colors: plugin_colors,
  Decimation: plugin_decimation,
  Filler: index,
  Legend: plugin_legend,
  SubTitle: plugin_subtitle,
  Title: plugin_title,
  Tooltip: plugin_tooltip
});
var addIfString = (labels, raw, index2, addedLabels) => {
  if (typeof raw === "string") {
    index2 = labels.push(raw) - 1;
    addedLabels.unshift({
      index: index2,
      label: raw
    });
  } else if (isNaN(raw)) {
    index2 = null;
  }
  return index2;
};
function findOrAddLabel(labels, raw, index2, addedLabels) {
  const first = labels.indexOf(raw);
  if (first === -1) {
    return addIfString(labels, raw, index2, addedLabels);
  }
  const last = labels.lastIndexOf(raw);
  return first !== last ? index2 : first;
}
var validIndex = (index2, max) => index2 === null ? null : _limitValue(Math.round(index2), 0, max);
function _getLabelForValue(value) {
  const labels = this.getLabels();
  if (value >= 0 && value < labels.length) {
    return labels[value];
  }
  return value;
}
var CategoryScale = class extends Scale {
  static id = "category";
  static defaults = {
    ticks: {
      callback: _getLabelForValue
    }
  };
  constructor(cfg) {
    super(cfg);
    this._startValue = void 0;
    this._valueRange = 0;
    this._addedLabels = [];
  }
  init(scaleOptions) {
    const added = this._addedLabels;
    if (added.length) {
      const labels = this.getLabels();
      for (const { index: index2, label } of added) {
        if (labels[index2] === label) {
          labels.splice(index2, 1);
        }
      }
      this._addedLabels = [];
    }
    super.init(scaleOptions);
  }
  parse(raw, index2) {
    if (isNullOrUndef(raw)) {
      return null;
    }
    const labels = this.getLabels();
    index2 = isFinite(index2) && labels[index2] === raw ? index2 : findOrAddLabel(labels, raw, valueOrDefault(index2, raw), this._addedLabels);
    return validIndex(index2, labels.length - 1);
  }
  determineDataLimits() {
    const { minDefined, maxDefined } = this.getUserBounds();
    let { min, max } = this.getMinMax(true);
    if (this.options.bounds === "ticks") {
      if (!minDefined) {
        min = 0;
      }
      if (!maxDefined) {
        max = this.getLabels().length - 1;
      }
    }
    this.min = min;
    this.max = max;
  }
  buildTicks() {
    const min = this.min;
    const max = this.max;
    const offset = this.options.offset;
    const ticks = [];
    let labels = this.getLabels();
    labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
    this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
    this._startValue = this.min - (offset ? 0.5 : 0);
    for (let value = min; value <= max; value++) {
      ticks.push({
        value
      });
    }
    return ticks;
  }
  getLabelForValue(value) {
    return _getLabelForValue.call(this, value);
  }
  configure() {
    super.configure();
    if (!this.isHorizontal()) {
      this._reversePixels = !this._reversePixels;
    }
  }
  getPixelForValue(value) {
    if (typeof value !== "number") {
      value = this.parse(value);
    }
    return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
  }
  getPixelForTick(index2) {
    const ticks = this.ticks;
    if (index2 < 0 || index2 > ticks.length - 1) {
      return null;
    }
    return this.getPixelForValue(ticks[index2].value);
  }
  getValueForPixel(pixel) {
    return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
};
function generateTicks$1(generationOptions, dataRange) {
  const ticks = [];
  const MIN_SPACING = 1e-14;
  const { bounds, step, min, max, precision, count, maxTicks, maxDigits, includeBounds } = generationOptions;
  const unit = step || 1;
  const maxSpaces = maxTicks - 1;
  const { min: rmin, max: rmax } = dataRange;
  const minDefined = !isNullOrUndef(min);
  const maxDefined = !isNullOrUndef(max);
  const countDefined = !isNullOrUndef(count);
  const minSpacing = (rmax - rmin) / (maxDigits + 1);
  let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
  let factor, niceMin, niceMax, numSpaces;
  if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
    return [
      {
        value: rmin
      },
      {
        value: rmax
      }
    ];
  }
  numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
  if (numSpaces > maxSpaces) {
    spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
  }
  if (!isNullOrUndef(precision)) {
    factor = Math.pow(10, precision);
    spacing = Math.ceil(spacing * factor) / factor;
  }
  if (bounds === "ticks") {
    niceMin = Math.floor(rmin / spacing) * spacing;
    niceMax = Math.ceil(rmax / spacing) * spacing;
  } else {
    niceMin = rmin;
    niceMax = rmax;
  }
  if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1e3)) {
    numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
    spacing = (max - min) / numSpaces;
    niceMin = min;
    niceMax = max;
  } else if (countDefined) {
    niceMin = minDefined ? min : niceMin;
    niceMax = maxDefined ? max : niceMax;
    numSpaces = count - 1;
    spacing = (niceMax - niceMin) / numSpaces;
  } else {
    numSpaces = (niceMax - niceMin) / spacing;
    if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1e3)) {
      numSpaces = Math.round(numSpaces);
    } else {
      numSpaces = Math.ceil(numSpaces);
    }
  }
  const decimalPlaces = Math.max(_decimalPlaces(spacing), _decimalPlaces(niceMin));
  factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
  niceMin = Math.round(niceMin * factor) / factor;
  niceMax = Math.round(niceMax * factor) / factor;
  let j2 = 0;
  if (minDefined) {
    if (includeBounds && niceMin !== min) {
      ticks.push({
        value: min
      });
      if (niceMin < min) {
        j2++;
      }
      if (almostEquals(Math.round((niceMin + j2 * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
        j2++;
      }
    } else if (niceMin < min) {
      j2++;
    }
  }
  for (; j2 < numSpaces; ++j2) {
    const tickValue = Math.round((niceMin + j2 * spacing) * factor) / factor;
    if (maxDefined && tickValue > max) {
      break;
    }
    ticks.push({
      value: tickValue
    });
  }
  if (maxDefined && includeBounds && niceMax !== max) {
    if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
      ticks[ticks.length - 1].value = max;
    } else {
      ticks.push({
        value: max
      });
    }
  } else if (!maxDefined || niceMax === max) {
    ticks.push({
      value: niceMax
    });
  }
  return ticks;
}
function relativeLabelSize(value, minSpacing, { horizontal, minRotation }) {
  const rad = toRadians(minRotation);
  const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 1e-3;
  const length = 0.75 * minSpacing * ("" + value).length;
  return Math.min(minSpacing / ratio, length);
}
var LinearScaleBase = class extends Scale {
  constructor(cfg) {
    super(cfg);
    this.start = void 0;
    this.end = void 0;
    this._startValue = void 0;
    this._endValue = void 0;
    this._valueRange = 0;
  }
  parse(raw, index2) {
    if (isNullOrUndef(raw)) {
      return null;
    }
    if ((typeof raw === "number" || raw instanceof Number) && !isFinite(+raw)) {
      return null;
    }
    return +raw;
  }
  handleTickRangeOptions() {
    const { beginAtZero } = this.options;
    const { minDefined, maxDefined } = this.getUserBounds();
    let { min, max } = this;
    const setMin = (v2) => min = minDefined ? min : v2;
    const setMax = (v2) => max = maxDefined ? max : v2;
    if (beginAtZero) {
      const minSign = sign(min);
      const maxSign = sign(max);
      if (minSign < 0 && maxSign < 0) {
        setMax(0);
      } else if (minSign > 0 && maxSign > 0) {
        setMin(0);
      }
    }
    if (min === max) {
      let offset = max === 0 ? 1 : Math.abs(max * 0.05);
      setMax(max + offset);
      if (!beginAtZero) {
        setMin(min - offset);
      }
    }
    this.min = min;
    this.max = max;
  }
  getTickLimit() {
    const tickOpts = this.options.ticks;
    let { maxTicksLimit, stepSize } = tickOpts;
    let maxTicks;
    if (stepSize) {
      maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
      if (maxTicks > 1e3) {
        console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
        maxTicks = 1e3;
      }
    } else {
      maxTicks = this.computeTickLimit();
      maxTicksLimit = maxTicksLimit || 11;
    }
    if (maxTicksLimit) {
      maxTicks = Math.min(maxTicksLimit, maxTicks);
    }
    return maxTicks;
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const opts = this.options;
    const tickOpts = opts.ticks;
    let maxTicks = this.getTickLimit();
    maxTicks = Math.max(2, maxTicks);
    const numericGeneratorOptions = {
      maxTicks,
      bounds: opts.bounds,
      min: opts.min,
      max: opts.max,
      precision: tickOpts.precision,
      step: tickOpts.stepSize,
      count: tickOpts.count,
      maxDigits: this._maxDigits(),
      horizontal: this.isHorizontal(),
      minRotation: tickOpts.minRotation || 0,
      includeBounds: tickOpts.includeBounds !== false
    };
    const dataRange = this._range || this;
    const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
    if (opts.bounds === "ticks") {
      _setMinAndMaxByKey(ticks, this, "value");
    }
    if (opts.reverse) {
      ticks.reverse();
      this.start = this.max;
      this.end = this.min;
    } else {
      this.start = this.min;
      this.end = this.max;
    }
    return ticks;
  }
  configure() {
    const ticks = this.ticks;
    let start = this.min;
    let end = this.max;
    super.configure();
    if (this.options.offset && ticks.length) {
      const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
      start -= offset;
      end += offset;
    }
    this._startValue = start;
    this._endValue = end;
    this._valueRange = end - start;
  }
  getLabelForValue(value) {
    return formatNumber(value, this.chart.options.locale, this.options.ticks.format);
  }
};
var LinearScale = class extends LinearScaleBase {
  static id = "linear";
  static defaults = {
    ticks: {
      callback: Ticks.formatters.numeric
    }
  };
  determineDataLimits() {
    const { min, max } = this.getMinMax(true);
    this.min = isNumberFinite(min) ? min : 0;
    this.max = isNumberFinite(max) ? max : 1;
    this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const horizontal = this.isHorizontal();
    const length = horizontal ? this.width : this.height;
    const minRotation = toRadians(this.options.ticks.minRotation);
    const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 1e-3;
    const tickFont = this._resolveTickFontOptions(0);
    return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
  }
  getPixelForValue(value) {
    return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
  }
  getValueForPixel(pixel) {
    return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
  }
};
var log10Floor = (v2) => Math.floor(log10(v2));
var changeExponent = (v2, m2) => Math.pow(10, log10Floor(v2) + m2);
function isMajor(tickVal) {
  const remain = tickVal / Math.pow(10, log10Floor(tickVal));
  return remain === 1;
}
function steps(min, max, rangeExp) {
  const rangeStep = Math.pow(10, rangeExp);
  const start = Math.floor(min / rangeStep);
  const end = Math.ceil(max / rangeStep);
  return end - start;
}
function startExp(min, max) {
  const range = max - min;
  let rangeExp = log10Floor(range);
  while (steps(min, max, rangeExp) > 10) {
    rangeExp++;
  }
  while (steps(min, max, rangeExp) < 10) {
    rangeExp--;
  }
  return Math.min(rangeExp, log10Floor(min));
}
function generateTicks(generationOptions, { min, max }) {
  min = finiteOrDefault(generationOptions.min, min);
  const ticks = [];
  const minExp = log10Floor(min);
  let exp = startExp(min, max);
  let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
  const stepSize = Math.pow(10, exp);
  const base = minExp > exp ? Math.pow(10, minExp) : 0;
  const start = Math.round((min - base) * precision) / precision;
  const offset = Math.floor((min - base) / stepSize / 10) * stepSize * 10;
  let significand = Math.floor((start - offset) / Math.pow(10, exp));
  let value = finiteOrDefault(generationOptions.min, Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision);
  while (value < max) {
    ticks.push({
      value,
      major: isMajor(value),
      significand
    });
    if (significand >= 10) {
      significand = significand < 15 ? 15 : 20;
    } else {
      significand++;
    }
    if (significand >= 20) {
      exp++;
      significand = 2;
      precision = exp >= 0 ? 1 : precision;
    }
    value = Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision;
  }
  const lastTick = finiteOrDefault(generationOptions.max, value);
  ticks.push({
    value: lastTick,
    major: isMajor(lastTick),
    significand
  });
  return ticks;
}
var LogarithmicScale = class extends Scale {
  static id = "logarithmic";
  static defaults = {
    ticks: {
      callback: Ticks.formatters.logarithmic,
      major: {
        enabled: true
      }
    }
  };
  constructor(cfg) {
    super(cfg);
    this.start = void 0;
    this.end = void 0;
    this._startValue = void 0;
    this._valueRange = 0;
  }
  parse(raw, index2) {
    const value = LinearScaleBase.prototype.parse.apply(this, [
      raw,
      index2
    ]);
    if (value === 0) {
      this._zero = true;
      return void 0;
    }
    return isNumberFinite(value) && value > 0 ? value : null;
  }
  determineDataLimits() {
    const { min, max } = this.getMinMax(true);
    this.min = isNumberFinite(min) ? Math.max(0, min) : null;
    this.max = isNumberFinite(max) ? Math.max(0, max) : null;
    if (this.options.beginAtZero) {
      this._zero = true;
    }
    if (this._zero && this.min !== this._suggestedMin && !isNumberFinite(this._userMin)) {
      this.min = min === changeExponent(this.min, 0) ? changeExponent(this.min, -1) : changeExponent(this.min, 0);
    }
    this.handleTickRangeOptions();
  }
  handleTickRangeOptions() {
    const { minDefined, maxDefined } = this.getUserBounds();
    let min = this.min;
    let max = this.max;
    const setMin = (v2) => min = minDefined ? min : v2;
    const setMax = (v2) => max = maxDefined ? max : v2;
    if (min === max) {
      if (min <= 0) {
        setMin(1);
        setMax(10);
      } else {
        setMin(changeExponent(min, -1));
        setMax(changeExponent(max, 1));
      }
    }
    if (min <= 0) {
      setMin(changeExponent(max, -1));
    }
    if (max <= 0) {
      setMax(changeExponent(min, 1));
    }
    this.min = min;
    this.max = max;
  }
  buildTicks() {
    const opts = this.options;
    const generationOptions = {
      min: this._userMin,
      max: this._userMax
    };
    const ticks = generateTicks(generationOptions, this);
    if (opts.bounds === "ticks") {
      _setMinAndMaxByKey(ticks, this, "value");
    }
    if (opts.reverse) {
      ticks.reverse();
      this.start = this.max;
      this.end = this.min;
    } else {
      this.start = this.min;
      this.end = this.max;
    }
    return ticks;
  }
  getLabelForValue(value) {
    return value === void 0 ? "0" : formatNumber(value, this.chart.options.locale, this.options.ticks.format);
  }
  configure() {
    const start = this.min;
    super.configure();
    this._startValue = log10(start);
    this._valueRange = log10(this.max) - log10(start);
  }
  getPixelForValue(value) {
    if (value === void 0 || value === 0) {
      value = this.min;
    }
    if (value === null || isNaN(value)) {
      return NaN;
    }
    return this.getPixelForDecimal(value === this.min ? 0 : (log10(value) - this._startValue) / this._valueRange);
  }
  getValueForPixel(pixel) {
    const decimal = this.getDecimalForPixel(pixel);
    return Math.pow(10, this._startValue + decimal * this._valueRange);
  }
};
function getTickBackdropHeight(opts) {
  const tickOpts = opts.ticks;
  if (tickOpts.display && opts.display) {
    const padding = toPadding(tickOpts.backdropPadding);
    return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
  }
  return 0;
}
function measureLabelSize(ctx, font, label) {
  label = isArray(label) ? label : [
    label
  ];
  return {
    w: _longestText(ctx, font.string, label),
    h: label.length * font.lineHeight
  };
}
function determineLimits(angle, pos, size, min, max) {
  if (angle === min || angle === max) {
    return {
      start: pos - size / 2,
      end: pos + size / 2
    };
  } else if (angle < min || angle > max) {
    return {
      start: pos - size,
      end: pos
    };
  }
  return {
    start: pos,
    end: pos + size
  };
}
function fitWithPointLabels(scale) {
  const orig = {
    l: scale.left + scale._padding.left,
    r: scale.right - scale._padding.right,
    t: scale.top + scale._padding.top,
    b: scale.bottom - scale._padding.bottom
  };
  const limits = Object.assign({}, orig);
  const labelSizes = [];
  const padding = [];
  const valueCount = scale._pointLabels.length;
  const pointLabelOpts = scale.options.pointLabels;
  const additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0;
  for (let i2 = 0; i2 < valueCount; i2++) {
    const opts = pointLabelOpts.setContext(scale.getPointLabelContext(i2));
    padding[i2] = opts.padding;
    const pointPosition = scale.getPointPosition(i2, scale.drawingArea + padding[i2], additionalAngle);
    const plFont = toFont(opts.font);
    const textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i2]);
    labelSizes[i2] = textSize;
    const angleRadians = _normalizeAngle(scale.getIndexAngle(i2) + additionalAngle);
    const angle = Math.round(toDegrees(angleRadians));
    const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
    const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
    updateLimits(limits, orig, angleRadians, hLimits, vLimits);
  }
  scale.setCenterPoint(orig.l - limits.l, limits.r - orig.r, orig.t - limits.t, limits.b - orig.b);
  scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
}
function updateLimits(limits, orig, angle, hLimits, vLimits) {
  const sin = Math.abs(Math.sin(angle));
  const cos = Math.abs(Math.cos(angle));
  let x2 = 0;
  let y2 = 0;
  if (hLimits.start < orig.l) {
    x2 = (orig.l - hLimits.start) / sin;
    limits.l = Math.min(limits.l, orig.l - x2);
  } else if (hLimits.end > orig.r) {
    x2 = (hLimits.end - orig.r) / sin;
    limits.r = Math.max(limits.r, orig.r + x2);
  }
  if (vLimits.start < orig.t) {
    y2 = (orig.t - vLimits.start) / cos;
    limits.t = Math.min(limits.t, orig.t - y2);
  } else if (vLimits.end > orig.b) {
    y2 = (vLimits.end - orig.b) / cos;
    limits.b = Math.max(limits.b, orig.b + y2);
  }
}
function createPointLabelItem(scale, index2, itemOpts) {
  const outerDistance = scale.drawingArea;
  const { extra, additionalAngle, padding, size } = itemOpts;
  const pointLabelPosition = scale.getPointPosition(index2, outerDistance + extra + padding, additionalAngle);
  const angle = Math.round(toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)));
  const y2 = yForAngle(pointLabelPosition.y, size.h, angle);
  const textAlign = getTextAlignForAngle(angle);
  const left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
  return {
    visible: true,
    x: pointLabelPosition.x,
    y: y2,
    textAlign,
    left,
    top: y2,
    right: left + size.w,
    bottom: y2 + size.h
  };
}
function isNotOverlapped(item, area) {
  if (!area) {
    return true;
  }
  const { left, top, right, bottom } = item;
  const apexesInArea = _isPointInArea({
    x: left,
    y: top
  }, area) || _isPointInArea({
    x: left,
    y: bottom
  }, area) || _isPointInArea({
    x: right,
    y: top
  }, area) || _isPointInArea({
    x: right,
    y: bottom
  }, area);
  return !apexesInArea;
}
function buildPointLabelItems(scale, labelSizes, padding) {
  const items = [];
  const valueCount = scale._pointLabels.length;
  const opts = scale.options;
  const { centerPointLabels, display } = opts.pointLabels;
  const itemOpts = {
    extra: getTickBackdropHeight(opts) / 2,
    additionalAngle: centerPointLabels ? PI / valueCount : 0
  };
  let area;
  for (let i2 = 0; i2 < valueCount; i2++) {
    itemOpts.padding = padding[i2];
    itemOpts.size = labelSizes[i2];
    const item = createPointLabelItem(scale, i2, itemOpts);
    items.push(item);
    if (display === "auto") {
      item.visible = isNotOverlapped(item, area);
      if (item.visible) {
        area = item;
      }
    }
  }
  return items;
}
function getTextAlignForAngle(angle) {
  if (angle === 0 || angle === 180) {
    return "center";
  } else if (angle < 180) {
    return "left";
  }
  return "right";
}
function leftForTextAlign(x2, w2, align) {
  if (align === "right") {
    x2 -= w2;
  } else if (align === "center") {
    x2 -= w2 / 2;
  }
  return x2;
}
function yForAngle(y2, h3, angle) {
  if (angle === 90 || angle === 270) {
    y2 -= h3 / 2;
  } else if (angle > 270 || angle < 90) {
    y2 -= h3;
  }
  return y2;
}
function drawPointLabelBox(ctx, opts, item) {
  const { left, top, right, bottom } = item;
  const { backdropColor } = opts;
  if (!isNullOrUndef(backdropColor)) {
    const borderRadius = toTRBLCorners(opts.borderRadius);
    const padding = toPadding(opts.backdropPadding);
    ctx.fillStyle = backdropColor;
    const backdropLeft = left - padding.left;
    const backdropTop = top - padding.top;
    const backdropWidth = right - left + padding.width;
    const backdropHeight = bottom - top + padding.height;
    if (Object.values(borderRadius).some((v2) => v2 !== 0)) {
      ctx.beginPath();
      addRoundedRectPath(ctx, {
        x: backdropLeft,
        y: backdropTop,
        w: backdropWidth,
        h: backdropHeight,
        radius: borderRadius
      });
      ctx.fill();
    } else {
      ctx.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
    }
  }
}
function drawPointLabels(scale, labelCount) {
  const { ctx, options: { pointLabels } } = scale;
  for (let i2 = labelCount - 1; i2 >= 0; i2--) {
    const item = scale._pointLabelItems[i2];
    if (!item.visible) {
      continue;
    }
    const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i2));
    drawPointLabelBox(ctx, optsAtIndex, item);
    const plFont = toFont(optsAtIndex.font);
    const { x: x2, y: y2, textAlign } = item;
    renderText(ctx, scale._pointLabels[i2], x2, y2 + plFont.lineHeight / 2, plFont, {
      color: optsAtIndex.color,
      textAlign,
      textBaseline: "middle"
    });
  }
}
function pathRadiusLine(scale, radius, circular, labelCount) {
  const { ctx } = scale;
  if (circular) {
    ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
  } else {
    let pointPosition = scale.getPointPosition(0, radius);
    ctx.moveTo(pointPosition.x, pointPosition.y);
    for (let i2 = 1; i2 < labelCount; i2++) {
      pointPosition = scale.getPointPosition(i2, radius);
      ctx.lineTo(pointPosition.x, pointPosition.y);
    }
  }
}
function drawRadiusLine(scale, gridLineOpts, radius, labelCount, borderOpts) {
  const ctx = scale.ctx;
  const circular = gridLineOpts.circular;
  const { color: color2, lineWidth } = gridLineOpts;
  if (!circular && !labelCount || !color2 || !lineWidth || radius < 0) {
    return;
  }
  ctx.save();
  ctx.strokeStyle = color2;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(borderOpts.dash || []);
  ctx.lineDashOffset = borderOpts.dashOffset;
  ctx.beginPath();
  pathRadiusLine(scale, radius, circular, labelCount);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
function createPointLabelContext(parent, index2, label) {
  return createContext(parent, {
    label,
    index: index2,
    type: "pointLabel"
  });
}
var RadialLinearScale = class extends LinearScaleBase {
  static id = "radialLinear";
  static defaults = {
    display: true,
    animate: true,
    position: "chartArea",
    angleLines: {
      display: true,
      lineWidth: 1,
      borderDash: [],
      borderDashOffset: 0
    },
    grid: {
      circular: false
    },
    startAngle: 0,
    ticks: {
      showLabelBackdrop: true,
      callback: Ticks.formatters.numeric
    },
    pointLabels: {
      backdropColor: void 0,
      backdropPadding: 2,
      display: true,
      font: {
        size: 10
      },
      callback(label) {
        return label;
      },
      padding: 5,
      centerPointLabels: false
    }
  };
  static defaultRoutes = {
    "angleLines.color": "borderColor",
    "pointLabels.color": "color",
    "ticks.color": "color"
  };
  static descriptors = {
    angleLines: {
      _fallback: "grid"
    }
  };
  constructor(cfg) {
    super(cfg);
    this.xCenter = void 0;
    this.yCenter = void 0;
    this.drawingArea = void 0;
    this._pointLabels = [];
    this._pointLabelItems = [];
  }
  setDimensions() {
    const padding = this._padding = toPadding(getTickBackdropHeight(this.options) / 2);
    const w2 = this.width = this.maxWidth - padding.width;
    const h3 = this.height = this.maxHeight - padding.height;
    this.xCenter = Math.floor(this.left + w2 / 2 + padding.left);
    this.yCenter = Math.floor(this.top + h3 / 2 + padding.top);
    this.drawingArea = Math.floor(Math.min(w2, h3) / 2);
  }
  determineDataLimits() {
    const { min, max } = this.getMinMax(false);
    this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
    this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
    this.handleTickRangeOptions();
  }
  computeTickLimit() {
    return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
  }
  generateTickLabels(ticks) {
    LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
    this._pointLabels = this.getLabels().map((value, index2) => {
      const label = callback(this.options.pointLabels.callback, [
        value,
        index2
      ], this);
      return label || label === 0 ? label : "";
    }).filter((v2, i2) => this.chart.getDataVisibility(i2));
  }
  fit() {
    const opts = this.options;
    if (opts.display && opts.pointLabels.display) {
      fitWithPointLabels(this);
    } else {
      this.setCenterPoint(0, 0, 0, 0);
    }
  }
  setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
    this.xCenter += Math.floor((leftMovement - rightMovement) / 2);
    this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
    this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
  }
  getIndexAngle(index2) {
    const angleMultiplier = TAU / (this._pointLabels.length || 1);
    const startAngle = this.options.startAngle || 0;
    return _normalizeAngle(index2 * angleMultiplier + toRadians(startAngle));
  }
  getDistanceFromCenterForValue(value) {
    if (isNullOrUndef(value)) {
      return NaN;
    }
    const scalingFactor = this.drawingArea / (this.max - this.min);
    if (this.options.reverse) {
      return (this.max - value) * scalingFactor;
    }
    return (value - this.min) * scalingFactor;
  }
  getValueForDistanceFromCenter(distance) {
    if (isNullOrUndef(distance)) {
      return NaN;
    }
    const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
    return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
  }
  getPointLabelContext(index2) {
    const pointLabels = this._pointLabels || [];
    if (index2 >= 0 && index2 < pointLabels.length) {
      const pointLabel = pointLabels[index2];
      return createPointLabelContext(this.getContext(), index2, pointLabel);
    }
  }
  getPointPosition(index2, distanceFromCenter, additionalAngle = 0) {
    const angle = this.getIndexAngle(index2) - HALF_PI + additionalAngle;
    return {
      x: Math.cos(angle) * distanceFromCenter + this.xCenter,
      y: Math.sin(angle) * distanceFromCenter + this.yCenter,
      angle
    };
  }
  getPointPositionForValue(index2, value) {
    return this.getPointPosition(index2, this.getDistanceFromCenterForValue(value));
  }
  getBasePosition(index2) {
    return this.getPointPositionForValue(index2 || 0, this.getBaseValue());
  }
  getPointLabelPosition(index2) {
    const { left, top, right, bottom } = this._pointLabelItems[index2];
    return {
      left,
      top,
      right,
      bottom
    };
  }
  drawBackground() {
    const { backgroundColor, grid: { circular } } = this.options;
    if (backgroundColor) {
      const ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
      ctx.closePath();
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      ctx.restore();
    }
  }
  drawGrid() {
    const ctx = this.ctx;
    const opts = this.options;
    const { angleLines, grid, border } = opts;
    const labelCount = this._pointLabels.length;
    let i2, offset, position;
    if (opts.pointLabels.display) {
      drawPointLabels(this, labelCount);
    }
    if (grid.display) {
      this.ticks.forEach((tick, index2) => {
        if (index2 !== 0 || index2 === 0 && this.min < 0) {
          offset = this.getDistanceFromCenterForValue(tick.value);
          const context = this.getContext(index2);
          const optsAtIndex = grid.setContext(context);
          const optsAtIndexBorder = border.setContext(context);
          drawRadiusLine(this, optsAtIndex, offset, labelCount, optsAtIndexBorder);
        }
      });
    }
    if (angleLines.display) {
      ctx.save();
      for (i2 = labelCount - 1; i2 >= 0; i2--) {
        const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i2));
        const { color: color2, lineWidth } = optsAtIndex;
        if (!lineWidth || !color2) {
          continue;
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color2;
        ctx.setLineDash(optsAtIndex.borderDash);
        ctx.lineDashOffset = optsAtIndex.borderDashOffset;
        offset = this.getDistanceFromCenterForValue(opts.reverse ? this.min : this.max);
        position = this.getPointPosition(i2, offset);
        ctx.beginPath();
        ctx.moveTo(this.xCenter, this.yCenter);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  drawBorder() {
  }
  drawLabels() {
    const ctx = this.ctx;
    const opts = this.options;
    const tickOpts = opts.ticks;
    if (!tickOpts.display) {
      return;
    }
    const startAngle = this.getIndexAngle(0);
    let offset, width;
    ctx.save();
    ctx.translate(this.xCenter, this.yCenter);
    ctx.rotate(startAngle);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    this.ticks.forEach((tick, index2) => {
      if (index2 === 0 && this.min >= 0 && !opts.reverse) {
        return;
      }
      const optsAtIndex = tickOpts.setContext(this.getContext(index2));
      const tickFont = toFont(optsAtIndex.font);
      offset = this.getDistanceFromCenterForValue(this.ticks[index2].value);
      if (optsAtIndex.showLabelBackdrop) {
        ctx.font = tickFont.string;
        width = ctx.measureText(tick.label).width;
        ctx.fillStyle = optsAtIndex.backdropColor;
        const padding = toPadding(optsAtIndex.backdropPadding);
        ctx.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
      }
      renderText(ctx, tick.label, 0, -offset, tickFont, {
        color: optsAtIndex.color,
        strokeColor: optsAtIndex.textStrokeColor,
        strokeWidth: optsAtIndex.textStrokeWidth
      });
    });
    ctx.restore();
  }
  drawTitle() {
  }
};
var INTERVALS = {
  millisecond: {
    common: true,
    size: 1,
    steps: 1e3
  },
  second: {
    common: true,
    size: 1e3,
    steps: 60
  },
  minute: {
    common: true,
    size: 6e4,
    steps: 60
  },
  hour: {
    common: true,
    size: 36e5,
    steps: 24
  },
  day: {
    common: true,
    size: 864e5,
    steps: 30
  },
  week: {
    common: false,
    size: 6048e5,
    steps: 4
  },
  month: {
    common: true,
    size: 2628e6,
    steps: 12
  },
  quarter: {
    common: false,
    size: 7884e6,
    steps: 4
  },
  year: {
    common: true,
    size: 3154e7
  }
};
var UNITS = /* @__PURE__ */ Object.keys(INTERVALS);
function sorter(a2, b2) {
  return a2 - b2;
}
function parse(scale, input) {
  if (isNullOrUndef(input)) {
    return null;
  }
  const adapter = scale._adapter;
  const { parser, round: round2, isoWeekday } = scale._parseOpts;
  let value = input;
  if (typeof parser === "function") {
    value = parser(value);
  }
  if (!isNumberFinite(value)) {
    value = typeof parser === "string" ? adapter.parse(value, parser) : adapter.parse(value);
  }
  if (value === null) {
    return null;
  }
  if (round2) {
    value = round2 === "week" && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, "isoWeek", isoWeekday) : adapter.startOf(value, round2);
  }
  return +value;
}
function determineUnitForAutoTicks(minUnit, min, max, capacity) {
  const ilen = UNITS.length;
  for (let i2 = UNITS.indexOf(minUnit); i2 < ilen - 1; ++i2) {
    const interval = INTERVALS[UNITS[i2]];
    const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
    if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
      return UNITS[i2];
    }
  }
  return UNITS[ilen - 1];
}
function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
  for (let i2 = UNITS.length - 1; i2 >= UNITS.indexOf(minUnit); i2--) {
    const unit = UNITS[i2];
    if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
      return unit;
    }
  }
  return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
}
function determineMajorUnit(unit) {
  for (let i2 = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i2 < ilen; ++i2) {
    if (INTERVALS[UNITS[i2]].common) {
      return UNITS[i2];
    }
  }
}
function addTick(ticks, time, timestamps) {
  if (!timestamps) {
    ticks[time] = true;
  } else if (timestamps.length) {
    const { lo: lo2, hi: hi2 } = _lookup(timestamps, time);
    const timestamp = timestamps[lo2] >= time ? timestamps[lo2] : timestamps[hi2];
    ticks[timestamp] = true;
  }
}
function setMajorTicks(scale, ticks, map3, majorUnit) {
  const adapter = scale._adapter;
  const first = +adapter.startOf(ticks[0].value, majorUnit);
  const last = ticks[ticks.length - 1].value;
  let major, index2;
  for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
    index2 = map3[major];
    if (index2 >= 0) {
      ticks[index2].major = true;
    }
  }
  return ticks;
}
function ticksFromTimestamps(scale, values, majorUnit) {
  const ticks = [];
  const map3 = {};
  const ilen = values.length;
  let i2, value;
  for (i2 = 0; i2 < ilen; ++i2) {
    value = values[i2];
    map3[value] = i2;
    ticks.push({
      value,
      major: false
    });
  }
  return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map3, majorUnit);
}
var TimeScale = class extends Scale {
  static id = "time";
  static defaults = {
    bounds: "data",
    adapters: {},
    time: {
      parser: false,
      unit: false,
      round: false,
      isoWeekday: false,
      minUnit: "millisecond",
      displayFormats: {}
    },
    ticks: {
      source: "auto",
      callback: false,
      major: {
        enabled: false
      }
    }
  };
  constructor(props) {
    super(props);
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
    this._unit = "day";
    this._majorUnit = void 0;
    this._offsets = {};
    this._normalized = false;
    this._parseOpts = void 0;
  }
  init(scaleOpts, opts = {}) {
    const time = scaleOpts.time || (scaleOpts.time = {});
    const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
    adapter.init(opts);
    mergeIf(time.displayFormats, adapter.formats());
    this._parseOpts = {
      parser: time.parser,
      round: time.round,
      isoWeekday: time.isoWeekday
    };
    super.init(scaleOpts);
    this._normalized = opts.normalized;
  }
  parse(raw, index2) {
    if (raw === void 0) {
      return null;
    }
    return parse(this, raw);
  }
  beforeLayout() {
    super.beforeLayout();
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }
  determineDataLimits() {
    const options = this.options;
    const adapter = this._adapter;
    const unit = options.time.unit || "day";
    let { min, max, minDefined, maxDefined } = this.getUserBounds();
    function _applyBounds(bounds) {
      if (!minDefined && !isNaN(bounds.min)) {
        min = Math.min(min, bounds.min);
      }
      if (!maxDefined && !isNaN(bounds.max)) {
        max = Math.max(max, bounds.max);
      }
    }
    if (!minDefined || !maxDefined) {
      _applyBounds(this._getLabelBounds());
      if (options.bounds !== "ticks" || options.ticks.source !== "labels") {
        _applyBounds(this.getMinMax(false));
      }
    }
    min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
    max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
    this.min = Math.min(min, max - 1);
    this.max = Math.max(min + 1, max);
  }
  _getLabelBounds() {
    const arr = this.getLabelTimestamps();
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    if (arr.length) {
      min = arr[0];
      max = arr[arr.length - 1];
    }
    return {
      min,
      max
    };
  }
  buildTicks() {
    const options = this.options;
    const timeOpts = options.time;
    const tickOpts = options.ticks;
    const timestamps = tickOpts.source === "labels" ? this.getLabelTimestamps() : this._generate();
    if (options.bounds === "ticks" && timestamps.length) {
      this.min = this._userMin || timestamps[0];
      this.max = this._userMax || timestamps[timestamps.length - 1];
    }
    const min = this.min;
    const max = this.max;
    const ticks = _filterBetween(timestamps, min, max);
    this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
    this._majorUnit = !tickOpts.major.enabled || this._unit === "year" ? void 0 : determineMajorUnit(this._unit);
    this.initOffsets(timestamps);
    if (options.reverse) {
      ticks.reverse();
    }
    return ticksFromTimestamps(this, ticks, this._majorUnit);
  }
  afterAutoSkip() {
    if (this.options.offsetAfterAutoskip) {
      this.initOffsets(this.ticks.map((tick) => +tick.value));
    }
  }
  initOffsets(timestamps = []) {
    let start = 0;
    let end = 0;
    let first, last;
    if (this.options.offset && timestamps.length) {
      first = this.getDecimalForValue(timestamps[0]);
      if (timestamps.length === 1) {
        start = 1 - first;
      } else {
        start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
      }
      last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
      if (timestamps.length === 1) {
        end = last;
      } else {
        end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
      }
    }
    const limit = timestamps.length < 3 ? 0.5 : 0.25;
    start = _limitValue(start, 0, limit);
    end = _limitValue(end, 0, limit);
    this._offsets = {
      start,
      end,
      factor: 1 / (start + 1 + end)
    };
  }
  _generate() {
    const adapter = this._adapter;
    const min = this.min;
    const max = this.max;
    const options = this.options;
    const timeOpts = options.time;
    const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
    const stepSize = valueOrDefault(options.ticks.stepSize, 1);
    const weekday = minor === "week" ? timeOpts.isoWeekday : false;
    const hasWeekday = isNumber(weekday) || weekday === true;
    const ticks = {};
    let first = min;
    let time, count;
    if (hasWeekday) {
      first = +adapter.startOf(first, "isoWeek", weekday);
    }
    first = +adapter.startOf(first, hasWeekday ? "day" : minor);
    if (adapter.diff(max, min, minor) > 1e5 * stepSize) {
      throw new Error(min + " and " + max + " are too far apart with stepSize of " + stepSize + " " + minor);
    }
    const timestamps = options.ticks.source === "data" && this.getDataTimestamps();
    for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
      addTick(ticks, time, timestamps);
    }
    if (time === max || options.bounds === "ticks" || count === 1) {
      addTick(ticks, time, timestamps);
    }
    return Object.keys(ticks).sort(sorter).map((x2) => +x2);
  }
  getLabelForValue(value) {
    const adapter = this._adapter;
    const timeOpts = this.options.time;
    if (timeOpts.tooltipFormat) {
      return adapter.format(value, timeOpts.tooltipFormat);
    }
    return adapter.format(value, timeOpts.displayFormats.datetime);
  }
  format(value, format) {
    const options = this.options;
    const formats = options.time.displayFormats;
    const unit = this._unit;
    const fmt = format || formats[unit];
    return this._adapter.format(value, fmt);
  }
  _tickFormatFunction(time, index2, ticks, format) {
    const options = this.options;
    const formatter = options.ticks.callback;
    if (formatter) {
      return callback(formatter, [
        time,
        index2,
        ticks
      ], this);
    }
    const formats = options.time.displayFormats;
    const unit = this._unit;
    const majorUnit = this._majorUnit;
    const minorFormat = unit && formats[unit];
    const majorFormat = majorUnit && formats[majorUnit];
    const tick = ticks[index2];
    const major = majorUnit && majorFormat && tick && tick.major;
    return this._adapter.format(time, format || (major ? majorFormat : minorFormat));
  }
  generateTickLabels(ticks) {
    let i2, ilen, tick;
    for (i2 = 0, ilen = ticks.length; i2 < ilen; ++i2) {
      tick = ticks[i2];
      tick.label = this._tickFormatFunction(tick.value, i2, ticks);
    }
  }
  getDecimalForValue(value) {
    return value === null ? NaN : (value - this.min) / (this.max - this.min);
  }
  getPixelForValue(value) {
    const offsets = this._offsets;
    const pos = this.getDecimalForValue(value);
    return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
  }
  getValueForPixel(pixel) {
    const offsets = this._offsets;
    const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return this.min + pos * (this.max - this.min);
  }
  _getLabelSize(label) {
    const ticksOpts = this.options.ticks;
    const tickLabelWidth = this.ctx.measureText(label).width;
    const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
    const cosRotation = Math.cos(angle);
    const sinRotation = Math.sin(angle);
    const tickFontSize = this._resolveTickFontOptions(0).size;
    return {
      w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
      h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
    };
  }
  _getLabelCapacity(exampleTime) {
    const timeOpts = this.options.time;
    const displayFormats = timeOpts.displayFormats;
    const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
    const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [
      exampleTime
    ], this._majorUnit), format);
    const size = this._getLabelSize(exampleLabel);
    const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
    return capacity > 0 ? capacity : 1;
  }
  getDataTimestamps() {
    let timestamps = this._cache.data || [];
    let i2, ilen;
    if (timestamps.length) {
      return timestamps;
    }
    const metas = this.getMatchingVisibleMetas();
    if (this._normalized && metas.length) {
      return this._cache.data = metas[0].controller.getAllParsedValues(this);
    }
    for (i2 = 0, ilen = metas.length; i2 < ilen; ++i2) {
      timestamps = timestamps.concat(metas[i2].controller.getAllParsedValues(this));
    }
    return this._cache.data = this.normalize(timestamps);
  }
  getLabelTimestamps() {
    const timestamps = this._cache.labels || [];
    let i2, ilen;
    if (timestamps.length) {
      return timestamps;
    }
    const labels = this.getLabels();
    for (i2 = 0, ilen = labels.length; i2 < ilen; ++i2) {
      timestamps.push(parse(this, labels[i2]));
    }
    return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
  }
  normalize(values) {
    return _arrayUnique(values.sort(sorter));
  }
};
function interpolate2(table, val, reverse) {
  let lo2 = 0;
  let hi2 = table.length - 1;
  let prevSource, nextSource, prevTarget, nextTarget;
  if (reverse) {
    if (val >= table[lo2].pos && val <= table[hi2].pos) {
      ({ lo: lo2, hi: hi2 } = _lookupByKey(table, "pos", val));
    }
    ({ pos: prevSource, time: prevTarget } = table[lo2]);
    ({ pos: nextSource, time: nextTarget } = table[hi2]);
  } else {
    if (val >= table[lo2].time && val <= table[hi2].time) {
      ({ lo: lo2, hi: hi2 } = _lookupByKey(table, "time", val));
    }
    ({ time: prevSource, pos: prevTarget } = table[lo2]);
    ({ time: nextSource, pos: nextTarget } = table[hi2]);
  }
  const span = nextSource - prevSource;
  return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
}
var TimeSeriesScale = class extends TimeScale {
  static id = "timeseries";
  static defaults = TimeScale.defaults;
  constructor(props) {
    super(props);
    this._table = [];
    this._minPos = void 0;
    this._tableRange = void 0;
  }
  initOffsets() {
    const timestamps = this._getTimestampsForTable();
    const table = this._table = this.buildLookupTable(timestamps);
    this._minPos = interpolate2(table, this.min);
    this._tableRange = interpolate2(table, this.max) - this._minPos;
    super.initOffsets(timestamps);
  }
  buildLookupTable(timestamps) {
    const { min, max } = this;
    const items = [];
    const table = [];
    let i2, ilen, prev, curr, next;
    for (i2 = 0, ilen = timestamps.length; i2 < ilen; ++i2) {
      curr = timestamps[i2];
      if (curr >= min && curr <= max) {
        items.push(curr);
      }
    }
    if (items.length < 2) {
      return [
        {
          time: min,
          pos: 0
        },
        {
          time: max,
          pos: 1
        }
      ];
    }
    for (i2 = 0, ilen = items.length; i2 < ilen; ++i2) {
      next = items[i2 + 1];
      prev = items[i2 - 1];
      curr = items[i2];
      if (Math.round((next + prev) / 2) !== curr) {
        table.push({
          time: curr,
          pos: i2 / (ilen - 1)
        });
      }
    }
    return table;
  }
  _generate() {
    const min = this.min;
    const max = this.max;
    let timestamps = super.getDataTimestamps();
    if (!timestamps.includes(min) || !timestamps.length) {
      timestamps.splice(0, 0, min);
    }
    if (!timestamps.includes(max) || timestamps.length === 1) {
      timestamps.push(max);
    }
    return timestamps.sort((a2, b2) => a2 - b2);
  }
  _getTimestampsForTable() {
    let timestamps = this._cache.all || [];
    if (timestamps.length) {
      return timestamps;
    }
    const data = this.getDataTimestamps();
    const label = this.getLabelTimestamps();
    if (data.length && label.length) {
      timestamps = this.normalize(data.concat(label));
    } else {
      timestamps = data.length ? data : label;
    }
    timestamps = this._cache.all = timestamps;
    return timestamps;
  }
  getDecimalForValue(value) {
    return (interpolate2(this._table, value) - this._minPos) / this._tableRange;
  }
  getValueForPixel(pixel) {
    const offsets = this._offsets;
    const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return interpolate2(this._table, decimal * this._tableRange + this._minPos, true);
  }
};
var scales = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale
});
var registerables = [
  controllers,
  elements,
  plugins,
  scales
];

// node_modules/lodash-es/_freeGlobal.js
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal_default = freeGlobal;

// node_modules/lodash-es/_root.js
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal_default || freeSelf || Function("return this")();
var root_default = root;

// node_modules/lodash-es/_Symbol.js
var Symbol2 = root_default.Symbol;
var Symbol_default = Symbol2;

// node_modules/lodash-es/_getRawTag.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e2) {
  }
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
var getRawTag_default = getRawTag;

// node_modules/lodash-es/_objectToString.js
var objectProto2 = Object.prototype;
var nativeObjectToString2 = objectProto2.toString;
function objectToString(value) {
  return nativeObjectToString2.call(value);
}
var objectToString_default = objectToString;

// node_modules/lodash-es/_baseGetTag.js
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
}
var baseGetTag_default = baseGetTag;

// node_modules/lodash-es/isObjectLike.js
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_default = isObjectLike;

// node_modules/lodash-es/isArray.js
var isArray2 = Array.isArray;
var isArray_default = isArray2;

// node_modules/lodash-es/isObject.js
function isObject2(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_default = isObject2;

// node_modules/lodash-es/identity.js
function identity(value) {
  return value;
}
var identity_default = identity;

// node_modules/lodash-es/isFunction.js
var asyncTag = "[object AsyncFunction]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
function isFunction2(value) {
  if (!isObject_default(value)) {
    return false;
  }
  var tag = baseGetTag_default(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_default = isFunction2;

// node_modules/lodash-es/_coreJsData.js
var coreJsData = root_default["__core-js_shared__"];
var coreJsData_default = coreJsData;

// node_modules/lodash-es/_isMasked.js
var maskSrcKey = (function() {
  var uid2 = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
  return uid2 ? "Symbol(src)_1." + uid2 : "";
})();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var isMasked_default = isMasked;

// node_modules/lodash-es/_toSource.js
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e2) {
    }
    try {
      return func + "";
    } catch (e2) {
    }
  }
  return "";
}
var toSource_default = toSource;

// node_modules/lodash-es/_baseIsNative.js
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto2 = Function.prototype;
var objectProto3 = Object.prototype;
var funcToString2 = funcProto2.toString;
var hasOwnProperty2 = objectProto3.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject_default(value) || isMasked_default(value)) {
    return false;
  }
  var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value));
}
var baseIsNative_default = baseIsNative;

// node_modules/lodash-es/_getValue.js
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
var getValue_default = getValue;

// node_modules/lodash-es/_getNative.js
function getNative(object, key) {
  var value = getValue_default(object, key);
  return baseIsNative_default(value) ? value : void 0;
}
var getNative_default = getNative;

// node_modules/lodash-es/_baseCreate.js
var objectCreate = Object.create;
var baseCreate = /* @__PURE__ */ (function() {
  function object() {
  }
  return function(proto) {
    if (!isObject_default(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
})();
var baseCreate_default = baseCreate;

// node_modules/lodash-es/_apply.js
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var apply_default = apply;

// node_modules/lodash-es/_copyArray.js
function copyArray(source, array) {
  var index2 = -1, length = source.length;
  array || (array = Array(length));
  while (++index2 < length) {
    array[index2] = source[index2];
  }
  return array;
}
var copyArray_default = copyArray;

// node_modules/lodash-es/_shortOut.js
var HOT_COUNT = 800;
var HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var shortOut_default = shortOut;

// node_modules/lodash-es/constant.js
function constant(value) {
  return function() {
    return value;
  };
}
var constant_default = constant;

// node_modules/lodash-es/_defineProperty.js
var defineProperty = (function() {
  try {
    var func = getNative_default(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e2) {
  }
})();
var defineProperty_default = defineProperty;

// node_modules/lodash-es/_baseSetToString.js
var baseSetToString = !defineProperty_default ? identity_default : function(func, string) {
  return defineProperty_default(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant_default(string),
    "writable": true
  });
};
var baseSetToString_default = baseSetToString;

// node_modules/lodash-es/_setToString.js
var setToString = shortOut_default(baseSetToString_default);
var setToString_default = setToString;

// node_modules/lodash-es/_isIndex.js
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var isIndex_default = isIndex;

// node_modules/lodash-es/_baseAssignValue.js
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty_default) {
    defineProperty_default(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var baseAssignValue_default = baseAssignValue;

// node_modules/lodash-es/eq.js
function eq2(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_default = eq2;

// node_modules/lodash-es/_assignValue.js
var objectProto4 = Object.prototype;
var hasOwnProperty3 = objectProto4.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty3.call(object, key) && eq_default(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value);
  }
}
var assignValue_default = assignValue;

// node_modules/lodash-es/_copyObject.js
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index2 = -1, length = props.length;
  while (++index2 < length) {
    var key = props[index2];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue_default(object, key, newValue);
    } else {
      assignValue_default(object, key, newValue);
    }
  }
  return object;
}
var copyObject_default = copyObject;

// node_modules/lodash-es/_overRest.js
var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index2 = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index2 < length) {
      array[index2] = args[start + index2];
    }
    index2 = -1;
    var otherArgs = Array(start + 1);
    while (++index2 < start) {
      otherArgs[index2] = args[index2];
    }
    otherArgs[start] = transform(array);
    return apply_default(func, this, otherArgs);
  };
}
var overRest_default = overRest;

// node_modules/lodash-es/_baseRest.js
function baseRest(func, start) {
  return setToString_default(overRest_default(func, start, identity_default), func + "");
}
var baseRest_default = baseRest;

// node_modules/lodash-es/isLength.js
var MAX_SAFE_INTEGER2 = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
}
var isLength_default = isLength;

// node_modules/lodash-es/isArrayLike.js
function isArrayLike(value) {
  return value != null && isLength_default(value.length) && !isFunction_default(value);
}
var isArrayLike_default = isArrayLike;

// node_modules/lodash-es/_isIterateeCall.js
function isIterateeCall(value, index2, object) {
  if (!isObject_default(object)) {
    return false;
  }
  var type = typeof index2;
  if (type == "number" ? isArrayLike_default(object) && isIndex_default(index2, object.length) : type == "string" && index2 in object) {
    return eq_default(object[index2], value);
  }
  return false;
}
var isIterateeCall_default = isIterateeCall;

// node_modules/lodash-es/_createAssigner.js
function createAssigner(assigner) {
  return baseRest_default(function(object, sources) {
    var index2 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index2 < length) {
      var source = sources[index2];
      if (source) {
        assigner(object, source, index2, customizer);
      }
    }
    return object;
  });
}
var createAssigner_default = createAssigner;

// node_modules/lodash-es/_isPrototype.js
var objectProto5 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto5;
  return value === proto;
}
var isPrototype_default = isPrototype;

// node_modules/lodash-es/_baseTimes.js
function baseTimes(n2, iteratee) {
  var index2 = -1, result = Array(n2);
  while (++index2 < n2) {
    result[index2] = iteratee(index2);
  }
  return result;
}
var baseTimes_default = baseTimes;

// node_modules/lodash-es/_baseIsArguments.js
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
}
var baseIsArguments_default = baseIsArguments;

// node_modules/lodash-es/isArguments.js
var objectProto6 = Object.prototype;
var hasOwnProperty4 = objectProto6.hasOwnProperty;
var propertyIsEnumerable = objectProto6.propertyIsEnumerable;
var isArguments = baseIsArguments_default(/* @__PURE__ */ (function() {
  return arguments;
})()) ? baseIsArguments_default : function(value) {
  return isObjectLike_default(value) && hasOwnProperty4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_default = isArguments;

// node_modules/lodash-es/stubFalse.js
function stubFalse() {
  return false;
}
var stubFalse_default = stubFalse;

// node_modules/lodash-es/isBuffer.js
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? root_default.Buffer : void 0;
var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse_default;
var isBuffer_default = isBuffer;

// node_modules/lodash-es/_baseIsTypedArray.js
var argsTag2 = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag2 = "[object Function]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
}
var baseIsTypedArray_default = baseIsTypedArray;

// node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var baseUnary_default = baseUnary;

// node_modules/lodash-es/_nodeUtil.js
var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
var freeProcess = moduleExports2 && freeGlobal_default.process;
var nodeUtil = (function() {
  try {
    var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e2) {
  }
})();
var nodeUtil_default = nodeUtil;

// node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
var isTypedArray_default = isTypedArray;

// node_modules/lodash-es/_arrayLikeKeys.js
var objectProto7 = Object.prototype;
var hasOwnProperty5 = objectProto7.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty5.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex_default(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var arrayLikeKeys_default = arrayLikeKeys;

// node_modules/lodash-es/_overArg.js
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var overArg_default = overArg;

// node_modules/lodash-es/_nativeKeysIn.js
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var nativeKeysIn_default = nativeKeysIn;

// node_modules/lodash-es/_baseKeysIn.js
var objectProto8 = Object.prototype;
var hasOwnProperty6 = objectProto8.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject_default(object)) {
    return nativeKeysIn_default(object);
  }
  var isProto = isPrototype_default(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty6.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
var baseKeysIn_default = baseKeysIn;

// node_modules/lodash-es/keysIn.js
function keysIn(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object, true) : baseKeysIn_default(object);
}
var keysIn_default = keysIn;

// node_modules/lodash-es/_nativeCreate.js
var nativeCreate = getNative_default(Object, "create");
var nativeCreate_default = nativeCreate;

// node_modules/lodash-es/_hashClear.js
function hashClear() {
  this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
  this.size = 0;
}
var hashClear_default = hashClear;

// node_modules/lodash-es/_hashDelete.js
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var hashDelete_default = hashDelete;

// node_modules/lodash-es/_hashGet.js
var HASH_UNDEFINED = "__lodash_hash_undefined__";
var objectProto9 = Object.prototype;
var hasOwnProperty7 = objectProto9.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate_default) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty7.call(data, key) ? data[key] : void 0;
}
var hashGet_default = hashGet;

// node_modules/lodash-es/_hashHas.js
var objectProto10 = Object.prototype;
var hasOwnProperty8 = objectProto10.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty8.call(data, key);
}
var hashHas_default = hashHas;

// node_modules/lodash-es/_hashSet.js
var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
  return this;
}
var hashSet_default = hashSet;

// node_modules/lodash-es/_Hash.js
function Hash(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear_default;
Hash.prototype["delete"] = hashDelete_default;
Hash.prototype.get = hashGet_default;
Hash.prototype.has = hashHas_default;
Hash.prototype.set = hashSet_default;
var Hash_default = Hash;

// node_modules/lodash-es/_listCacheClear.js
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
var listCacheClear_default = listCacheClear;

// node_modules/lodash-es/_assocIndexOf.js
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_default(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var assocIndexOf_default = assocIndexOf;

// node_modules/lodash-es/_listCacheDelete.js
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index2 = assocIndexOf_default(data, key);
  if (index2 < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index2 == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index2, 1);
  }
  --this.size;
  return true;
}
var listCacheDelete_default = listCacheDelete;

// node_modules/lodash-es/_listCacheGet.js
function listCacheGet(key) {
  var data = this.__data__, index2 = assocIndexOf_default(data, key);
  return index2 < 0 ? void 0 : data[index2][1];
}
var listCacheGet_default = listCacheGet;

// node_modules/lodash-es/_listCacheHas.js
function listCacheHas(key) {
  return assocIndexOf_default(this.__data__, key) > -1;
}
var listCacheHas_default = listCacheHas;

// node_modules/lodash-es/_listCacheSet.js
function listCacheSet(key, value) {
  var data = this.__data__, index2 = assocIndexOf_default(data, key);
  if (index2 < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index2][1] = value;
  }
  return this;
}
var listCacheSet_default = listCacheSet;

// node_modules/lodash-es/_ListCache.js
function ListCache(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear_default;
ListCache.prototype["delete"] = listCacheDelete_default;
ListCache.prototype.get = listCacheGet_default;
ListCache.prototype.has = listCacheHas_default;
ListCache.prototype.set = listCacheSet_default;
var ListCache_default = ListCache;

// node_modules/lodash-es/_Map.js
var Map2 = getNative_default(root_default, "Map");
var Map_default = Map2;

// node_modules/lodash-es/_mapCacheClear.js
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash_default(),
    "map": new (Map_default || ListCache_default)(),
    "string": new Hash_default()
  };
}
var mapCacheClear_default = mapCacheClear;

// node_modules/lodash-es/_isKeyable.js
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var isKeyable_default = isKeyable;

// node_modules/lodash-es/_getMapData.js
function getMapData(map3, key) {
  var data = map3.__data__;
  return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var getMapData_default = getMapData;

// node_modules/lodash-es/_mapCacheDelete.js
function mapCacheDelete(key) {
  var result = getMapData_default(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var mapCacheDelete_default = mapCacheDelete;

// node_modules/lodash-es/_mapCacheGet.js
function mapCacheGet(key) {
  return getMapData_default(this, key).get(key);
}
var mapCacheGet_default = mapCacheGet;

// node_modules/lodash-es/_mapCacheHas.js
function mapCacheHas(key) {
  return getMapData_default(this, key).has(key);
}
var mapCacheHas_default = mapCacheHas;

// node_modules/lodash-es/_mapCacheSet.js
function mapCacheSet(key, value) {
  var data = getMapData_default(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
var mapCacheSet_default = mapCacheSet;

// node_modules/lodash-es/_MapCache.js
function MapCache(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear_default;
MapCache.prototype["delete"] = mapCacheDelete_default;
MapCache.prototype.get = mapCacheGet_default;
MapCache.prototype.has = mapCacheHas_default;
MapCache.prototype.set = mapCacheSet_default;
var MapCache_default = MapCache;

// node_modules/lodash-es/_getPrototype.js
var getPrototype = overArg_default(Object.getPrototypeOf, Object);
var getPrototype_default = getPrototype;

// node_modules/lodash-es/isPlainObject.js
var objectTag2 = "[object Object]";
var funcProto3 = Function.prototype;
var objectProto11 = Object.prototype;
var funcToString3 = funcProto3.toString;
var hasOwnProperty9 = objectProto11.hasOwnProperty;
var objectCtorString = funcToString3.call(Object);
function isPlainObject(value) {
  if (!isObjectLike_default(value) || baseGetTag_default(value) != objectTag2) {
    return false;
  }
  var proto = getPrototype_default(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty9.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString3.call(Ctor) == objectCtorString;
}
var isPlainObject_default = isPlainObject;

// node_modules/lodash-es/_stackClear.js
function stackClear() {
  this.__data__ = new ListCache_default();
  this.size = 0;
}
var stackClear_default = stackClear;

// node_modules/lodash-es/_stackDelete.js
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
var stackDelete_default = stackDelete;

// node_modules/lodash-es/_stackGet.js
function stackGet(key) {
  return this.__data__.get(key);
}
var stackGet_default = stackGet;

// node_modules/lodash-es/_stackHas.js
function stackHas(key) {
  return this.__data__.has(key);
}
var stackHas_default = stackHas;

// node_modules/lodash-es/_stackSet.js
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache_default) {
    var pairs = data.__data__;
    if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache_default(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
var stackSet_default = stackSet;

// node_modules/lodash-es/_Stack.js
function Stack(entries) {
  var data = this.__data__ = new ListCache_default(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear_default;
Stack.prototype["delete"] = stackDelete_default;
Stack.prototype.get = stackGet_default;
Stack.prototype.has = stackHas_default;
Stack.prototype.set = stackSet_default;
var Stack_default = Stack;

// node_modules/lodash-es/_cloneBuffer.js
var freeExports3 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule3 = freeExports3 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports3 = freeModule3 && freeModule3.exports === freeExports3;
var Buffer2 = moduleExports3 ? root_default.Buffer : void 0;
var allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
var cloneBuffer_default = cloneBuffer;

// node_modules/lodash-es/_Uint8Array.js
var Uint8Array2 = root_default.Uint8Array;
var Uint8Array_default = Uint8Array2;

// node_modules/lodash-es/_cloneArrayBuffer.js
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array_default(result).set(new Uint8Array_default(arrayBuffer));
  return result;
}
var cloneArrayBuffer_default = cloneArrayBuffer;

// node_modules/lodash-es/_cloneTypedArray.js
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var cloneTypedArray_default = cloneTypedArray;

// node_modules/lodash-es/_initCloneObject.js
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype_default(object) ? baseCreate_default(getPrototype_default(object)) : {};
}
var initCloneObject_default = initCloneObject;

// node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index2 = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index2];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var createBaseFor_default = createBaseFor;

// node_modules/lodash-es/_baseFor.js
var baseFor = createBaseFor_default();
var baseFor_default = baseFor;

// node_modules/lodash-es/_assignMergeValue.js
function assignMergeValue(object, key, value) {
  if (value !== void 0 && !eq_default(object[key], value) || value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value);
  }
}
var assignMergeValue_default = assignMergeValue;

// node_modules/lodash-es/isArrayLikeObject.js
function isArrayLikeObject(value) {
  return isObjectLike_default(value) && isArrayLike_default(value);
}
var isArrayLikeObject_default = isArrayLikeObject;

// node_modules/lodash-es/_safeGet.js
function safeGet(object, key) {
  if (key === "constructor" && typeof object[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object[key];
}
var safeGet_default = safeGet;

// node_modules/lodash-es/toPlainObject.js
function toPlainObject(value) {
  return copyObject_default(value, keysIn_default(value));
}
var toPlainObject_default = toPlainObject;

// node_modules/lodash-es/_baseMergeDeep.js
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet_default(object, key), srcValue = safeGet_default(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue_default(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray_default(srcValue), isBuff = !isArr && isBuffer_default(srcValue), isTyped = !isArr && !isBuff && isTypedArray_default(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_default(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject_default(objValue)) {
        newValue = copyArray_default(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer_default(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray_default(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject_default(srcValue) || isArguments_default(srcValue)) {
      newValue = objValue;
      if (isArguments_default(objValue)) {
        newValue = toPlainObject_default(objValue);
      } else if (!isObject_default(objValue) || isFunction_default(objValue)) {
        newValue = initCloneObject_default(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack["delete"](srcValue);
  }
  assignMergeValue_default(object, key, newValue);
}
var baseMergeDeep_default = baseMergeDeep;

// node_modules/lodash-es/_baseMerge.js
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor_default(source, function(srcValue, key) {
    stack || (stack = new Stack_default());
    if (isObject_default(srcValue)) {
      baseMergeDeep_default(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet_default(object, key), srcValue, key + "", object, source, stack) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue_default(object, key, newValue);
    }
  }, keysIn_default);
}
var baseMerge_default = baseMerge;

// node_modules/lodash-es/merge.js
var merge2 = createAssigner_default(function(object, source, srcIndex) {
  baseMerge_default(object, source, srcIndex);
});
var merge_default = merge2;

// node_modules/ng2-charts/fesm2022/ng2-charts.mjs
var NG_CHARTS_CONFIGURATION = new InjectionToken("Configuration for ngCharts");
function withDefaultRegisterables(...registerables$1) {
  return {
    registerables: [...registerables, ...registerables$1]
  };
}
function provideCharts(...configurations) {
  const config = merge_default({}, ...configurations);
  return {
    provide: NG_CHARTS_CONFIGURATION,
    useValue: config
  };
}
var ThemeService = class _ThemeService {
  constructor() {
    this.colorschemesOptions = new BehaviorSubject(void 0);
  }
  setColorschemesOptions(options) {
    this.pColorschemesOptions = options;
    this.colorschemesOptions.next(options);
  }
  getColorschemesOptions() {
    return this.pColorschemesOptions;
  }
  static {
    this.\u0275fac = function ThemeService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ThemeService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _ThemeService,
      factory: _ThemeService.\u0275fac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var BaseChartDirective = class _BaseChartDirective {
  constructor(element, zone, themeService, config) {
    this.zone = zone;
    this.themeService = themeService;
    this.type = "bar";
    this.plugins = [];
    this.chartClick = new EventEmitter();
    this.chartHover = new EventEmitter();
    this.subs = [];
    this.themeOverrides = {};
    if (config?.registerables) {
      Chart.register(...config.registerables);
    }
    if (config?.defaults) {
      defaults.set(config.defaults);
    }
    this.ctx = element.nativeElement.getContext("2d");
    this.subs.push(this.themeService.colorschemesOptions.pipe(distinctUntilChanged()).subscribe((r2) => this.themeChanged(r2)));
  }
  ngOnChanges(changes) {
    const requireRender = ["type"];
    const propertyNames = Object.getOwnPropertyNames(changes);
    if (propertyNames.some((key) => requireRender.includes(key)) || propertyNames.every((key) => changes[key].isFirstChange())) {
      this.render();
    } else {
      const config = this.getChartConfiguration();
      if (this.chart) {
        Object.assign(this.chart.config.data, config.data);
        if (this.chart.config.plugins) {
          Object.assign(this.chart.config.plugins, config.plugins);
        }
        if (this.chart.config.options) {
          Object.assign(this.chart.config.options, config.options);
        }
      }
      this.update();
    }
  }
  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = void 0;
    }
    this.subs.forEach((s2) => s2.unsubscribe());
  }
  render() {
    if (this.chart) {
      this.chart.destroy();
    }
    return this.zone.runOutsideAngular(() => this.chart = new Chart(this.ctx, this.getChartConfiguration()));
  }
  update(mode) {
    if (this.chart) {
      this.zone.runOutsideAngular(() => this.chart?.update(mode));
    }
  }
  hideDataset(index2, hidden) {
    if (this.chart) {
      this.chart.getDatasetMeta(index2).hidden = hidden;
      this.update();
    }
  }
  isDatasetHidden(index2) {
    return this.chart?.getDatasetMeta(index2)?.hidden;
  }
  toBase64Image() {
    return this.chart?.toBase64Image();
  }
  themeChanged(options) {
    this.themeOverrides = options;
    if (this.chart) {
      if (this.chart.config.options) {
        Object.assign(this.chart.config.options, this.getChartOptions());
      }
      this.update();
    }
  }
  getChartOptions() {
    return merge_default({
      onHover: (event, active) => {
        if (!this.chartHover.observed && !this.chartHover.observers?.length) {
          return;
        }
        this.zone.run(() => this.chartHover.emit({
          event,
          active
        }));
      },
      onClick: (event, active) => {
        if (!this.chartClick.observed && !this.chartClick.observers?.length) {
          return;
        }
        this.zone.run(() => this.chartClick.emit({
          event,
          active
        }));
      }
    }, this.themeOverrides, this.options, {
      plugins: {
        legend: {
          display: this.legend
        }
      }
    });
  }
  getChartConfiguration() {
    return {
      type: this.type,
      data: this.getChartData(),
      options: this.getChartOptions(),
      plugins: this.plugins
    };
  }
  getChartData() {
    return this.data ? this.data : {
      labels: this.labels || [],
      datasets: this.datasets || []
    };
  }
  static {
    this.\u0275fac = function BaseChartDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _BaseChartDirective)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(ThemeService), \u0275\u0275directiveInject(NG_CHARTS_CONFIGURATION, 8));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _BaseChartDirective,
      selectors: [["canvas", "baseChart", ""]],
      inputs: {
        type: "type",
        legend: "legend",
        data: "data",
        options: "options",
        plugins: "plugins",
        labels: "labels",
        datasets: "datasets"
      },
      outputs: {
        chartClick: "chartClick",
        chartHover: "chartHover"
      },
      exportAs: ["base-chart"],
      features: [\u0275\u0275NgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseChartDirective, [{
    type: Directive,
    args: [{
      // eslint-disable-next-line @angular-eslint/directive-selector
      selector: "canvas[baseChart]",
      exportAs: "base-chart",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: NgZone
  }, {
    type: ThemeService
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NG_CHARTS_CONFIGURATION]
    }]
  }], {
    type: [{
      type: Input
    }],
    legend: [{
      type: Input
    }],
    data: [{
      type: Input
    }],
    options: [{
      type: Input
    }],
    plugins: [{
      type: Input
    }],
    labels: [{
      type: Input
    }],
    datasets: [{
      type: Input
    }],
    chartClick: [{
      type: Output
    }],
    chartHover: [{
      type: Output
    }]
  });
})();

export {
  Jo,
  withDefaultRegisterables,
  provideCharts,
  BaseChartDirective
};
/*! Bundled license information:

@kurkle/color/dist/color.esm.js:
  (*!
   * @kurkle/color v0.3.4
   * https://github.com/kurkle/color#readme
   * (c) 2024 Jukka Kurkela
   * Released under the MIT License
   *)

chart.js/dist/chunks/helpers.dataset.js:
chart.js/dist/chart.js:
  (*!
   * Chart.js v4.5.1
   * https://www.chartjs.org
   * (c) 2025 Chart.js Contributors
   * Released under the MIT License
   *)

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
//# sourceMappingURL=chunk-WGFPDZMQ.js.map
