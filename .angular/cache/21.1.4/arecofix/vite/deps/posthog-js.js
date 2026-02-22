import "./chunk-46DXP6YY.js";

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
var c = { DEBUG: false, LIB_VERSION: "1.352.0" };
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
function _() {
  return _ = Object.assign ? Object.assign.bind() : function(t2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var e2 = arguments[i2];
      for (var r2 in e2) ({}).hasOwnProperty.call(e2, r2) && (t2[r2] = e2[r2]);
    }
    return t2;
  }, _.apply(null, arguments);
}
function g(t2, i2) {
  if (null == t2) return {};
  var e2 = {};
  for (var r2 in t2) if ({}.hasOwnProperty.call(t2, r2)) {
    if (-1 !== i2.indexOf(r2)) continue;
    e2[r2] = t2[r2];
  }
  return e2;
}
var m = ["$snapshot", "$pageview", "$pageleave", "$set", "survey dismissed", "survey sent", "survey shown", "$identify", "$groupidentify", "$create_alias", "$$client_ingestion_warning", "$web_experiment_applied", "$feature_enrollment_update", "$feature_flag_called"];
var b = ["amazonbot", "amazonproductbot", "app.hypefactors.com", "applebot", "archive.org_bot", "awariobot", "backlinksextendedbot", "baiduspider", "bingbot", "bingpreview", "chrome-lighthouse", "dataforseobot", "deepscan", "duckduckbot", "facebookexternal", "facebookcatalog", "http://yandex.com/bots", "hubspot", "ia_archiver", "leikibot", "linkedinbot", "meta-externalagent", "mj12bot", "msnbot", "nessus", "petalbot", "pinterest", "prerender", "rogerbot", "screaming frog", "sebot-wa", "sitebulb", "slackbot", "slurp", "trendictionbot", "turnitin", "twitterbot", "vercel-screenshot", "vercelbot", "yahoo! slurp", "yandexbot", "zoombot", "bot.htm", "bot.php", "(bot;", "bot/", "crawler", "ahrefsbot", "ahrefssiteaudit", "semrushbot", "siteauditbot", "splitsignalbot", "gptbot", "oai-searchbot", "chatgpt-user", "perplexitybot", "better uptime bot", "sentryuptimebot", "uptimerobot", "headlesschrome", "cypress", "google-hoteladsverifier", "adsbot-google", "apis-google", "duplexweb-google", "feedfetcher-google", "google favicon", "google web preview", "google-read-aloud", "googlebot", "googleother", "google-cloudvertexbot", "googleweblight", "mediapartners-google", "storebot-google", "google-inspectiontool", "bytespider"];
var y = function(t2, i2) {
  if (void 0 === i2 && (i2 = []), !t2) return false;
  var e2 = t2.toLowerCase();
  return b.concat(i2).some(((t3) => {
    var i3 = t3.toLowerCase();
    return -1 !== e2.indexOf(i3);
  }));
};
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
var O = (t2) => void 0 === t2;
var M = (t2) => "[object String]" == T.call(t2);
var A = (t2) => M(t2) && 0 === t2.trim().length;
var j = (t2) => null === t2;
var D = (t2) => O(t2) || j(t2);
var L = (t2) => "[object Number]" == T.call(t2) && t2 == t2;
var N = (t2) => L(t2) && t2 > 0;
var U = (t2) => "[object Boolean]" === T.call(t2);
var z = (t2) => t2 instanceof FormData;
var H = (t2) => w(m, t2);
function B(t2) {
  return null === t2 || "object" != typeof t2;
}
function q(t2, i2) {
  return Object.prototype.toString.call(t2) === "[object " + i2 + "]";
}
function W(t2) {
  return !O(Event) && (function(t3, i2) {
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
var _t = pt + " Mini";
var gt = "Edge";
var mt = "Microsoft " + gt;
var bt = "Firefox";
var yt = bt + " " + Q;
var wt = "Nintendo";
var xt = "PlayStation";
var $t = "Xbox";
var Et = Z + " " + X;
var St = X + " " + nt;
var kt = "Windows";
var Pt = kt + " Phone";
var Tt = "Nokia";
var It = "Ouya";
var Ct = "Generic";
var Rt = Ct + " " + X.toLowerCase();
var Ft = Ct + " " + tt.toLowerCase();
var Ot = "Konqueror";
var Mt = "(\\d+(\\.\\d+)?)";
var At = new RegExp("Version/" + Mt);
var jt = new RegExp($t, "i");
var Dt = new RegExp(xt + " \\w+", "i");
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
  return i2 = i2 || "", w(t2, " OPR/") && w(t2, "Mini") ? _t : w(t2, " OPR/") ? pt : Nt.test(t2) ? ot : w(t2, "IE" + X) || w(t2, "WPDesktop") ? ft : w(t2, lt) ? ut : w(t2, gt) || w(t2, "Edg/") ? mt : w(t2, "FBIOS") ? "Facebook " + X : w(t2, "UCWEB") || w(t2, "UCBrowser") ? "UC Browser" : w(t2, "CriOS") ? vt : w(t2, "CrMo") || w(t2, ht) ? ht : w(t2, Z) && w(t2, nt) ? Et : w(t2, "FxiOS") ? yt : w(t2.toLowerCase(), Ot.toLowerCase()) ? Ot : qt(t2, i2) ? w(t2, X) ? St : nt : w(t2, bt) ? bt : w(t2, "MSIE") || w(t2, "Trident/") ? ct : w(t2, "Gecko") ? bt : "";
};
var Gt = { [ft]: [new RegExp("rv:" + Mt)], [mt]: [new RegExp(gt + "?\\/" + Mt)], [ht]: [new RegExp("(" + ht + "|CrMo)\\/" + Mt)], [vt]: [new RegExp("CriOS\\/" + Mt)], "UC Browser": [new RegExp("(UCBrowser|UCWEB)\\/" + Mt)], [nt]: [At], [St]: [At], [pt]: [new RegExp("(Opera|OPR)\\/" + Mt)], [bt]: [new RegExp(bt + "\\/" + Mt)], [yt]: [new RegExp("FxiOS\\/" + Mt)], [Ot]: [new RegExp("Konqueror[:/]?" + Mt, "i")], [ot]: [new RegExp(ot + " " + Mt), At], [Et]: [new RegExp("android\\s" + Mt, "i")], [ut]: [new RegExp(lt + "\\/" + Mt)], [ct]: [new RegExp("(rv:|MSIE )" + Mt)], Mozilla: [new RegExp("rv:" + Mt)] };
var Vt = function(t2, i2) {
  var e2 = Wt(t2, i2), r2 = Gt[e2];
  if (O(r2)) return null;
  for (var s2 = 0; s2 < r2.length; s2++) {
    var n2 = r2[s2], o2 = t2.match(n2);
    if (o2) return parseFloat(o2[o2.length - 2]);
  }
  return null;
};
var Jt = [[new RegExp($t + "; " + $t + " (.*?)[);]", "i"), (t2) => [$t, t2 && t2[1] || ""]], [new RegExp(wt, "i"), [wt, ""]], [new RegExp(xt, "i"), [xt, ""]], [Nt, [ot, ""]], [new RegExp(kt, "i"), (t2, i2) => {
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
  return t2 && t2.length >= 3 && (i2 = O(t2[2]) ? t2[3] : t2[2]), ["watchOS", i2];
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
  return Lt.test(t2) ? wt : Dt.test(t2) ? xt : jt.test(t2) ? $t : new RegExp(It, "i").test(t2) ? It : new RegExp("(" + Pt + "|WPDesktop)", "i").test(t2) ? Pt : /iPad/.test(t2) ? et : /iPod/.test(t2) ? "iPod Touch" : /iPhone/.test(t2) ? "iPhone" : /(watch)(?: ?os[,/]|\d,\d\/)[\d.]+/i.test(t2) ? st : Nt.test(t2) ? ot : /(kobo)\s(ereader|touch)/i.test(t2) ? "Kobo" : new RegExp(Tt, "i").test(t2) ? Tt : /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i.test(t2) || /(kf[a-z]+)( bui|\)).+silk\//i.test(t2) ? "Kindle Fire" : /(Android|ZTE)/i.test(t2) ? new RegExp(X).test(t2) && !/(9138B|TB782B|Nexus [97]|pixel c|HUAWEISHT|BTV|noble nook|smart ultra 6)/i.test(t2) || /pixel[\daxl ]{1,6}/i.test(t2) && !/pixel c/i.test(t2) || /(huaweimed-al00|tah-|APA|SM-G92|i980|zte|U304AA)/i.test(t2) || /lmy47v/i.test(t2) && !/QTAQZ3/i.test(t2) ? Z : it : new RegExp("(pda|" + X + ")", "i").test(t2) ? Rt : new RegExp(tt, "i").test(t2) && !new RegExp(tt + " pc", "i").test(t2) ? Ft : "";
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
    var e2 = i2 && i2.mechanism || { handled: true, type: "generic" }, r2 = this.buildCoercingContext(e2, i2, 0).apply(t2), s2 = this.buildParsingContext(i2), n2 = this.parseStacktrace(r2, s2);
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
    return null != t2.cause && (e2 = this.parseStacktrace(t2.cause, i2)), "" != t2.stack && null != t2.stack && (r2 = this.applyChunkIds(this.stackParser(t2.stack, t2.synthetic ? i2.skipFirstLines : 0), i2.chunkIdMap)), _({}, t2, { cause: e2, stack: r2 });
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
    return null != t2.cause && o2.push(...this.convertToExceptionList(t2.cause, _({}, i2, { handled: true }))), o2;
  }
  buildParsingContext(t2) {
    var i2;
    return { chunkIdMap: Xt(this.stackParser), skipFirstLines: null !== (i2 = t2.skipFirstLines) && void 0 !== i2 ? i2 : 1 };
  }
  buildCoercingContext(t2, i2, e2) {
    void 0 === e2 && (e2 = 0);
    var r2 = (e3, r3) => {
      if (r3 <= 4) {
        var s2 = this.buildCoercingContext(t2, i2, r3);
        return this.applyCoercers(e3, s2);
      }
    };
    return _({}, i2, { syntheticException: 0 == e2 ? i2.syntheticException : void 0, mechanism: t2, apply: (t3) => r2(t3, e2), next: (t3) => r2(t3, e2 + 1) });
  }
};
var Zt = "?";
function ti(t2, i2, e2, r2, s2) {
  var n2 = { platform: t2, filename: i2, function: "<anonymous>" === e2 ? Zt : e2, in_app: true };
  return O(r2) || (n2.lineno = r2), O(s2) || (n2.colno = s2), n2;
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
              var h2 = u2(l2, t2);
              if (h2) {
                s2.push(h2);
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
          return _({}, t4, { filename: t4.filename || (e3 = i4, e3[e3.length - 1] || {}).filename, function: t4.function || Zt });
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
    var e2 = M(t2.stack);
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
var _i = class {
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
var gi = ["fatal", "error", "warning", "log", "info", "debug"];
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
var bi = class {
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
    return M(t2) && !A(t2) && gi.indexOf(t2) >= 0;
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
var yi = class {
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
var $i = function(i2, e2) {
  var { debugEnabled: r2 } = void 0 === e2 ? {} : e2, s2 = { k: function(e3) {
    if (t && (c.DEBUG || v.POSTHOG_DEBUG || r2) && !O(t.console) && t.console) {
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
  }, createLogger: (t2, e3) => $i(i2 + " " + t2, e3) };
  return s2;
};
var Ei = $i("[PostHog.js]");
var Si = Ei.createLogger;
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
    if ("head" === t2.config.external_scripts_inject_target) o.head.appendChild(r3);
    else {
      var s3, n3 = o.querySelectorAll("body > script");
      if (n3.length > 0) null == (s3 = n3[0].parentNode) || s3.insertBefore(r3, n3[0]);
      else o.body.appendChild(r3);
    }
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
  if (!D(t2)) {
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
function Oi(t2) {
  for (var i2 = Object.keys(t2), e2 = i2.length, r2 = new Array(e2); e2--; ) r2[e2] = [i2[e2], t2[i2[e2]]];
  return r2;
}
var Mi = function(t2) {
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
      Ei.critical("Implementation error. Please turn on debug mode and open a ticket on https://app.posthog.com/home#panel=support%3Asupport%3A."), Ei.critical(t3);
    }
  };
};
var ji = function(t2) {
  var i2 = {};
  return Ci(t2, (function(t3, e2) {
    (M(t3) && t3.length > 0 || L(t3)) && (i2[e2] = t3);
  })), i2;
};
function Di(t2, i2) {
  return e2 = t2, r2 = (t3) => M(t3) && !j(i2) ? t3.slice(0, i2) : t3, s2 = /* @__PURE__ */ new Set(), (function t3(i3, e3) {
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
  if (!M(i2)) return false;
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
var he = "$feature_flag_errors";
var de = "$user_state";
var ve = "$client_session_props";
var ce = "$capture_rate_limit";
var fe = "$initial_campaign_params";
var pe = "$initial_referrer_info";
var _e = "$initial_person_info";
var ge = "$epp";
var me = "__POSTHOG_TOOLBAR__";
var be = "$posthog_cookieless";
var ye = [Hi, Bi, "__cmpns", qi, "$session_recording_enabled_server_side", Gi, ie, re, Ji, de, se, ne, ae, oe, le, ue, he, ve, ce, fe, pe, ge, _e];
function we(t2) {
  return t2 instanceof Element && (t2.id === me || !(null == t2.closest || !t2.closest(".toolbar-global-fade-container")));
}
function xe(t2) {
  return !!t2 && 1 === t2.nodeType;
}
function $e(t2, i2) {
  return !!t2 && !!t2.tagName && t2.tagName.toLowerCase() === i2.toLowerCase();
}
function Ee(t2) {
  return !!t2 && 3 === t2.nodeType;
}
function Se(t2) {
  return !!t2 && 11 === t2.nodeType;
}
function ke(t2) {
  return t2 ? x(t2).split(/\s+/) : [];
}
function Pe(i2) {
  var e2 = null == t ? void 0 : t.location.href;
  return !!(e2 && i2 && i2.some(((t2) => e2.match(t2))));
}
function Te(t2) {
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
  return ke(i2);
}
function Ie(t2) {
  return D(t2) ? null : x(t2).split(/(\s+)/).filter(((t3) => Ye(t3))).join("").replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255);
}
function Ce(t2) {
  var i2 = "";
  return He(t2) && !Be(t2) && t2.childNodes && t2.childNodes.length && Ci(t2.childNodes, (function(t3) {
    var e2;
    Ee(t3) && t3.textContent && (i2 += null !== (e2 = Ie(t3.textContent)) && void 0 !== e2 ? e2 : "");
  })), x(i2);
}
function Re(t2) {
  return O(t2.target) ? t2.srcElement || null : null != (i2 = t2.target) && i2.shadowRoot ? t2.composedPath()[0] || null : t2.target || null;
  var i2;
}
var Fe = ["a", "button", "form", "input", "select", "textarea", "label"];
function Oe(t2, i2) {
  if (O(i2)) return true;
  var e2, r2 = function(t3) {
    if (i2.some(((i3) => t3.matches(i3)))) return { v: true };
  };
  for (var s2 of t2) if (e2 = r2(s2)) return e2.v;
  return false;
}
function Me(t2) {
  var i2 = t2.parentNode;
  return !(!i2 || !xe(i2)) && i2;
}
var Ae = ["next", "previous", "prev", ">", "<"];
var je = 10;
var De = [".ph-no-rageclick", ".ph-no-capture"];
function Le(i2, e2) {
  if (!t || Ne(i2)) return false;
  var r2, s2, n2;
  U(e2) ? (r2 = !!e2 && De, s2 = void 0) : (r2 = null !== (n2 = null == e2 ? void 0 : e2.css_selector_ignorelist) && void 0 !== n2 ? n2 : De, s2 = null == e2 ? void 0 : e2.content_ignorelist);
  if (false === r2) return false;
  var { targetElementList: o2 } = Ue(i2, false);
  return !(function(t2, i3) {
    if (false === t2 || O(t2)) return false;
    var e3;
    if (true === t2) e3 = Ae;
    else {
      if (!I(t2)) return false;
      if (t2.length > je) return Ei.error("[PostHog] content_ignorelist array cannot exceed " + je + " items. Use css_selector_ignorelist for more complex matching."), false;
      e3 = t2.map(((t3) => t3.toLowerCase()));
    }
    return i3.some(((t3) => {
      var { safeText: i4, ariaLabel: r3 } = t3;
      return e3.some(((t4) => i4.includes(t4) || r3.includes(t4)));
    }));
  })(s2, o2.map(((t2) => {
    var i3;
    return { safeText: Ce(t2).toLowerCase(), ariaLabel: (null == (i3 = t2.getAttribute("aria-label")) ? void 0 : i3.toLowerCase().trim()) || "" };
  }))) && !Oe(o2, r2);
}
var Ne = (t2) => !t2 || $e(t2, "html") || !xe(t2);
var Ue = (i2, e2) => {
  if (!t || Ne(i2)) return { parentIsUsefulElement: false, targetElementList: [] };
  for (var r2 = false, s2 = [i2], n2 = i2; n2.parentNode && !$e(n2, "body"); ) if (Se(n2.parentNode)) s2.push(n2.parentNode.host), n2 = n2.parentNode.host;
  else {
    var o2 = Me(n2);
    if (!o2) break;
    if (e2 || Fe.indexOf(o2.tagName.toLowerCase()) > -1) r2 = true;
    else {
      var a2 = t.getComputedStyle(o2);
      a2 && "pointer" === a2.getPropertyValue("cursor") && (r2 = true);
    }
    s2.push(o2), n2 = o2;
  }
  return { parentIsUsefulElement: r2, targetElementList: s2 };
};
function ze(i2, e2, r2, s2, n2) {
  var o2, a2, l2, u2;
  if (void 0 === r2 && (r2 = void 0), !t || Ne(i2)) return false;
  if (null != (o2 = r2) && o2.url_allowlist && !Pe(r2.url_allowlist)) return false;
  if (null != (a2 = r2) && a2.url_ignorelist && Pe(r2.url_ignorelist)) return false;
  if (null != (l2 = r2) && l2.dom_event_allowlist) {
    var h2 = r2.dom_event_allowlist;
    if (h2 && !h2.some(((t2) => e2.type === t2))) return false;
  }
  var { parentIsUsefulElement: d2, targetElementList: v2 } = Ue(i2, s2);
  if (!(function(t2, i3) {
    var e3 = null == i3 ? void 0 : i3.element_allowlist;
    if (O(e3)) return true;
    var r3, s3 = function(t3) {
      if (e3.some(((i4) => t3.tagName.toLowerCase() === i4))) return { v: true };
    };
    for (var n3 of t2) if (r3 = s3(n3)) return r3.v;
    return false;
  })(v2, r2)) return false;
  if (!Oe(v2, null == (u2 = r2) ? void 0 : u2.css_selector_allowlist)) return false;
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
      return d2 ? (n2 || ["click"]).indexOf(e2.type) >= 0 : (n2 || ["click"]).indexOf(e2.type) >= 0 && (Fe.indexOf(f2) > -1 || "true" === i2.getAttribute("contenteditable"));
  }
}
function He(t2) {
  for (var i2 = t2; i2.parentNode && !$e(i2, "body"); i2 = i2.parentNode) {
    var e2 = Te(i2);
    if (w(e2, "ph-sensitive") || w(e2, "ph-no-capture")) return false;
  }
  if (w(Te(t2), "ph-include")) return true;
  var r2 = t2.type || "";
  if (M(r2)) switch (r2.toLowerCase()) {
    case "hidden":
    case "password":
      return false;
  }
  var s2 = t2.name || t2.id || "";
  if (M(s2)) {
    if (/^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i.test(s2.replace(/[^a-zA-Z0-9]/g, ""))) return false;
  }
  return true;
}
function Be(t2) {
  return !!($e(t2, "input") && !["button", "checkbox", "submit", "reset"].includes(t2.type) || $e(t2, "select") || $e(t2, "textarea") || "true" === t2.getAttribute("contenteditable"));
}
var qe = "(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11})";
var We = new RegExp("^(?:" + qe + ")$");
var Ge = new RegExp(qe);
var Ve = "\\d{3}-?\\d{2}-?\\d{4}";
var Je = new RegExp("^(" + Ve + ")$");
var Ke = new RegExp("(" + Ve + ")");
function Ye(t2, i2) {
  if (void 0 === i2 && (i2 = true), D(t2)) return false;
  if (M(t2)) {
    if (t2 = x(t2), (i2 ? We : Ge).test((t2 || "").replace(/[- ]/g, ""))) return false;
    if ((i2 ? Je : Ke).test(t2)) return false;
  }
  return true;
}
function Xe(t2) {
  var i2 = Ce(t2);
  return Ye(i2 = (i2 + " " + Qe(t2)).trim()) ? i2 : "";
}
function Qe(t2) {
  var i2 = "";
  return t2 && t2.childNodes && t2.childNodes.length && Ci(t2.childNodes, (function(t3) {
    var e2;
    if (t3 && "span" === (null == (e2 = t3.tagName) ? void 0 : e2.toLowerCase())) try {
      var r2 = Ce(t3);
      i2 = (i2 + " " + r2).trim(), t3.childNodes && t3.childNodes.length && (i2 = (i2 + " " + Qe(t3)).trim());
    } catch (t4) {
      Ei.error("[AutoCapture]", t4);
    }
  })), i2;
}
function Ze(t2) {
  return (function(t3) {
    var i2 = t3.map(((t4) => {
      var i3, e2, r2 = "";
      if (t4.tag_name && (r2 += t4.tag_name), t4.attr_class) for (var s2 of (t4.attr_class.sort(), t4.attr_class)) r2 += "." + s2.replace(/"/g, "");
      var n2 = _({}, t4.text ? { text: t4.text } : {}, { "nth-child": null !== (i3 = t4.nth_child) && void 0 !== i3 ? i3 : 0, "nth-of-type": null !== (e2 = t4.nth_of_type) && void 0 !== e2 ? e2 : 0 }, t4.href ? { href: t4.href } : {}, t4.attr_id ? { attr_id: t4.attr_id } : {}, t4.attributes), o2 = {};
      return Oi(n2).sort(((t5, i4) => {
        var [e3] = t5, [r3] = i4;
        return e3.localeCompare(r3);
      })).forEach(((t5) => {
        var [i4, e3] = t5;
        return o2[tr(i4.toString())] = tr(e3.toString());
      })), r2 += ":", r2 += Oi(o2).map(((t5) => {
        var [i4, e3] = t5;
        return i4 + '="' + e3 + '"';
      })).join("");
    }));
    return i2.join(";");
  })((function(t3) {
    return t3.map(((t4) => {
      var i2, e2, r2 = { text: null == (i2 = t4.$el_text) ? void 0 : i2.slice(0, 400), tag_name: t4.tag_name, href: null == (e2 = t4.attr__href) ? void 0 : e2.slice(0, 2048), attr_class: ir(t4), attr_id: t4.attr__id, nth_child: t4.nth_child, nth_of_type: t4.nth_of_type, attributes: {} };
      return Oi(t4).filter(((t5) => {
        var [i3] = t5;
        return 0 === i3.indexOf("attr__");
      })).forEach(((t5) => {
        var [i3, e3] = t5;
        return r2.attributes[i3] = e3;
      })), r2;
    }));
  })(t2));
}
function tr(t2) {
  return t2.replace(/"|\\"/g, '\\"');
}
function ir(t2) {
  var i2 = t2.attr__class;
  return i2 ? I(i2) ? i2 : ke(i2) : void 0;
}
var er = class {
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
var rr = (t2) => {
  var i2 = null == o ? void 0 : o.createElement("a");
  return O(i2) ? null : (i2.href = t2, i2);
};
var sr = function(t2, i2) {
  var e2, r2;
  void 0 === i2 && (i2 = "&");
  var s2 = [];
  return Ci(t2, (function(t3, i3) {
    O(t3) || O(i3) || "undefined" === i3 || (e2 = encodeURIComponent(((t4) => t4 instanceof File)(t3) ? t3.name : t3.toString()), r2 = encodeURIComponent(i3), s2[s2.length] = r2 + "=" + e2);
  })), s2.join(i2);
};
var nr = function(t2, i2) {
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
    Ei.error("Skipping decoding for malformed query param: " + o2);
  }
  return o2.replace(/\+/g, " ");
};
var or = function(t2, i2, e2) {
  if (!t2 || !i2 || !i2.length) return t2;
  for (var r2 = t2.split("#"), s2 = r2[0] || "", n2 = r2[1], o2 = s2.split("?"), a2 = o2[1], l2 = o2[0], u2 = (a2 || "").split("&"), h2 = [], d2 = 0; d2 < u2.length; d2++) {
    var v2 = u2[d2].split("=");
    I(v2) && (i2.includes(v2[0]) ? h2.push(v2[0] + "=" + e2) : h2.push(u2[d2]));
  }
  var c2 = l2;
  return null != a2 && (c2 += "?" + h2.join("&")), null != n2 && (c2 += "#" + n2), c2;
};
var ar = function(t2, i2) {
  var e2 = t2.match(new RegExp(i2 + "=([^&]*)"));
  return e2 ? e2[1] : null;
};
var lr = "$copy_autocapture";
var ur = Si("[AutoCapture]");
function hr(t2, i2) {
  return i2.length > t2 ? i2.slice(0, t2) + "..." : i2;
}
function dr(t2) {
  if (t2.previousElementSibling) return t2.previousElementSibling;
  var i2 = t2;
  do {
    i2 = i2.previousSibling;
  } while (i2 && !xe(i2));
  return i2;
}
function vr(t2, i2, e2, r2) {
  var s2 = t2.tagName.toLowerCase(), n2 = { tag_name: s2 };
  Fe.indexOf(s2) > -1 && !e2 && ("a" === s2.toLowerCase() || "button" === s2.toLowerCase() ? n2.$el_text = hr(1024, Xe(t2)) : n2.$el_text = hr(1024, Ce(t2)));
  var o2 = Te(t2);
  o2.length > 0 && (n2.classes = o2.filter((function(t3) {
    return "" !== t3;
  }))), Ci(t2.attributes, (function(e3) {
    var s3;
    if ((!Be(t2) || -1 !== ["name", "id", "class", "aria-label"].indexOf(e3.name)) && ((null == r2 || !r2.includes(e3.name)) && !i2 && Ye(e3.value) && (s3 = e3.name, !M(s3) || "_ngcontent" !== s3.substring(0, 10) && "_nghost" !== s3.substring(0, 7)))) {
      var o3 = e3.value;
      "class" === e3.name && (o3 = ke(o3).join(" ")), n2["attr__" + e3.name] = hr(1024, o3);
    }
  }));
  for (var a2 = 1, l2 = 1, u2 = t2; u2 = dr(u2); ) a2++, u2.tagName === t2.tagName && l2++;
  return n2.nth_child = a2, n2.nth_of_type = l2, n2;
}
function cr(i2, e2) {
  for (var r2, s2, { e: n2, maskAllElementAttributes: o2, maskAllText: a2, elementAttributeIgnoreList: l2, elementsChainAsString: u2 } = e2, h2 = [i2], d2 = i2; d2.parentNode && !$e(d2, "body"); ) Se(d2.parentNode) ? (h2.push(d2.parentNode.host), d2 = d2.parentNode.host) : (h2.push(d2.parentNode), d2 = d2.parentNode);
  var v2, c2 = [], f2 = {}, p2 = false, _2 = false;
  if (Ci(h2, ((t2) => {
    var i3 = He(t2);
    "a" === t2.tagName.toLowerCase() && (p2 = t2.getAttribute("href"), p2 = i3 && p2 && Ye(p2) && p2), w(Te(t2), "ph-no-capture") && (_2 = true), c2.push(vr(t2, o2, a2, l2));
    var e3 = (function(t3) {
      if (!He(t3)) return {};
      var i4 = {};
      return Ci(t3.attributes, (function(t4) {
        if (t4.name && 0 === t4.name.indexOf("data-ph-capture-attribute")) {
          var e4 = t4.name.replace("data-ph-capture-attribute-", ""), r3 = t4.value;
          e4 && r3 && Ye(r3) && (i4[e4] = r3);
        }
      })), i4;
    })(t2);
    Ri(f2, e3);
  })), _2) return { props: {}, explicitNoCapture: _2 };
  if (a2 || ("a" === i2.tagName.toLowerCase() || "button" === i2.tagName.toLowerCase() ? c2[0].$el_text = Xe(i2) : c2[0].$el_text = Ce(i2)), p2) {
    var g2, m2;
    c2[0].attr__href = p2;
    var b2 = null == (g2 = rr(p2)) ? void 0 : g2.host, y2 = null == t || null == (m2 = t.location) ? void 0 : m2.host;
    b2 && y2 && b2 !== y2 && (v2 = p2);
  }
  return { props: Ri({ $event_type: n2.type, $ce_version: 1 }, u2 ? {} : { $elements: c2 }, { $elements_chain: Ze(c2) }, null != (r2 = c2[0]) && r2.$el_text ? { $el_text: null == (s2 = c2[0]) ? void 0 : s2.$el_text } : {}, v2 && "click" === n2.type ? { $external_click_url: v2 } : {}, f2) };
}
var fr = class {
  constructor(t2) {
    this.P = false, this.T = null, this.I = false, this.instance = t2, this.rageclicks = new er(t2.config.rageclick), this.C = null;
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
            this.O(i3);
          } catch (t2) {
            ur.error("Failed to capture event", t2);
          }
        };
        if (zi(o, "submit", i2, { capture: true }), zi(o, "change", i2, { capture: true }), zi(o, "click", i2, { capture: true }), this.R.capture_copied_text) {
          var e2 = (i3) => {
            i3 = i3 || (null == t ? void 0 : t.event), this.O(i3, lr);
          };
          zi(o, "copy", e2, { capture: true }), zi(o, "cut", e2, { capture: true });
        }
      }
    } else ur.info("Disabling Automatic Event Collection because this browser is not supported");
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
    if (j(r2) && !U(e2) && !this.instance.M()) return false;
    var s2 = null !== (i2 = this.T) && void 0 !== i2 ? i2 : !!e2;
    return !!this.instance.config.autocapture && !s2;
  }
  O(i2, e2) {
    if (void 0 === e2 && (e2 = "$autocapture"), this.isEnabled) {
      var r2, s2 = Re(i2);
      if (Ee(s2) && (s2 = s2.parentNode || null), "$autocapture" === e2 && "click" === i2.type && i2 instanceof MouseEvent) this.instance.config.rageclick && null != (r2 = this.rageclicks) && r2.isRageClick(i2.clientX, i2.clientY, i2.timeStamp || (/* @__PURE__ */ new Date()).getTime()) && Le(s2, this.instance.config.rageclick) && this.O(i2, "$rageclick");
      var n2 = e2 === lr;
      if (s2 && ze(s2, i2, this.R, n2, n2 ? ["copy", "cut"] : void 0)) {
        var { props: o2, explicitNoCapture: a2 } = cr(s2, { e: i2, maskAllElementAttributes: this.instance.config.mask_all_element_attributes, maskAllText: this.instance.config.mask_all_text, elementAttributeIgnoreList: this.R.element_attribute_ignorelist, elementsChainAsString: this.I });
        if (a2) return false;
        var l2 = this.getElementSelectors(s2);
        if (l2 && l2.length > 0 && (o2.$element_selectors = l2), e2 === lr) {
          var u2, h2 = Ie(null == t || null == (u2 = t.getSelection()) ? void 0 : u2.toString()), d2 = i2.type || "clipboard";
          if (!h2) return false;
          o2.$selected_content = h2, o2.$copy_type = d2;
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
var pr = "0123456789abcdef";
var _r = class __r {
  constructor(t2) {
    if (this.bytes = t2, 16 !== t2.length) throw new TypeError("not 128-bit length");
  }
  static fromFieldsV7(t2, i2, e2, r2) {
    if (!Number.isInteger(t2) || !Number.isInteger(i2) || !Number.isInteger(e2) || !Number.isInteger(r2) || t2 < 0 || i2 < 0 || e2 < 0 || r2 < 0 || t2 > 281474976710655 || i2 > 4095 || e2 > 1073741823 || r2 > 4294967295) throw new RangeError("invalid field value");
    var s2 = new Uint8Array(16);
    return s2[0] = t2 / Math.pow(2, 40), s2[1] = t2 / Math.pow(2, 32), s2[2] = t2 / Math.pow(2, 24), s2[3] = t2 / Math.pow(2, 16), s2[4] = t2 / Math.pow(2, 8), s2[5] = t2, s2[6] = 112 | i2 >>> 8, s2[7] = i2, s2[8] = 128 | e2 >>> 24, s2[9] = e2 >>> 16, s2[10] = e2 >>> 8, s2[11] = e2, s2[12] = r2 >>> 24, s2[13] = r2 >>> 16, s2[14] = r2 >>> 8, s2[15] = r2, new __r(s2);
  }
  toString() {
    for (var t2 = "", i2 = 0; i2 < this.bytes.length; i2++) t2 = t2 + pr.charAt(this.bytes[i2] >>> 4) + pr.charAt(15 & this.bytes[i2]), 3 !== i2 && 5 !== i2 && 7 !== i2 && 9 !== i2 || (t2 += "-");
    if (36 !== t2.length) throw new Error("Invalid UUIDv7 was generated");
    return t2;
  }
  clone() {
    return new __r(this.bytes.slice(0));
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
    this.A = 0, this.j = 0, this.D = new yr();
  }
  generate() {
    var t2 = this.generateOrAbort();
    if (O(t2)) {
      this.A = 0;
      var i2 = this.generateOrAbort();
      if (O(i2)) throw new Error("Could not generate UUID after timestamp reset");
      return i2;
    }
    return t2;
  }
  generateOrAbort() {
    var t2 = Date.now();
    if (t2 > this.A) this.A = t2, this.L();
    else {
      if (!(t2 + 1e4 > this.A)) return;
      this.j++, this.j > 4398046511103 && (this.A++, this.L());
    }
    return _r.fromFieldsV7(this.A, Math.trunc(this.j / Math.pow(2, 30)), this.j & Math.pow(2, 30) - 1, this.D.nextUint32());
  }
  L() {
    this.j = 1024 * this.D.nextUint32() + (1023 & this.D.nextUint32());
  }
};
var mr;
var br = (t2) => {
  if ("undefined" != typeof UUIDV7_DENY_WEAK_RNG && UUIDV7_DENY_WEAK_RNG) throw new Error("no cryptographically strong RNG available");
  for (var i2 = 0; i2 < t2.length; i2++) t2[i2] = 65536 * Math.trunc(65536 * Math.random()) + Math.trunc(65536 * Math.random());
  return t2;
};
t && !O(t.crypto) && crypto.getRandomValues && (br = (t2) => crypto.getRandomValues(t2));
var yr = class {
  constructor() {
    this.N = new Uint32Array(8), this.U = 1 / 0;
  }
  nextUint32() {
    return this.U >= this.N.length && (br(this.N), this.U = 0), this.N[this.U++];
  }
};
var wr = () => xr().toString();
var xr = () => (mr || (mr = new gr())).generate();
var $r = "";
var Er = /[a-z0-9][a-z0-9-]+\.[a-z]{2,}$/i;
function Sr(t2, i2) {
  if (i2) {
    var e2 = (function(t3, i3) {
      if (void 0 === i3 && (i3 = o), $r) return $r;
      if (!i3) return "";
      if (["localhost", "127.0.0.1"].includes(t3)) return "";
      for (var e3 = t3.split("."), r3 = Math.min(e3.length, 8), s2 = "dmn_chk_" + wr(); !$r && r3--; ) {
        var n2 = e3.slice(r3).join("."), a2 = s2 + "=1;domain=." + n2 + ";path=/";
        i3.cookie = a2 + ";max-age=3", i3.cookie.includes(s2) && (i3.cookie = a2 + ";max-age=0", $r = n2);
      }
      return $r;
    })(t2);
    if (!e2) {
      var r2 = ((t3) => {
        var i3 = t3.match(Er);
        return i3 ? i3[0] : "";
      })(t2);
      r2 !== e2 && Ei.info("Warning: cookie subdomain discovery mismatch", r2, e2), e2 = r2;
    }
    return e2 ? "; domain=." + e2 : "";
  }
  return "";
}
var kr = { H: () => !!o, B: function(t2) {
  Ei.error("cookieStore error: " + t2);
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
    i2 = JSON.parse(kr.q(t2)) || {};
  } catch (t3) {
  }
  return i2;
}, G: function(t2, i2, e2, r2, s2) {
  if (o) try {
    var n2 = "", a2 = "", l2 = Sr(o.location.hostname, r2);
    if (e2) {
      var u2 = /* @__PURE__ */ new Date();
      u2.setTime(u2.getTime() + 24 * e2 * 60 * 60 * 1e3), n2 = "; expires=" + u2.toUTCString();
    }
    s2 && (a2 = "; secure");
    var h2 = t2 + "=" + encodeURIComponent(JSON.stringify(i2)) + n2 + "; SameSite=Lax; path=/" + l2 + a2;
    return h2.length > 3686.4 && Ei.warn("cookieStore warning: large cookie, len=" + h2.length), o.cookie = h2, h2;
  } catch (t3) {
    return;
  }
}, V: function(t2, i2) {
  if (null != o && o.cookie) try {
    kr.G(t2, "", -1, i2);
  } catch (t3) {
    return;
  }
} };
var Pr = null;
var Tr = { H: function() {
  if (!j(Pr)) return Pr;
  var i2 = true;
  if (O(t)) i2 = false;
  else try {
    var e2 = "__mplssupport__";
    Tr.G(e2, "xyz"), '"xyz"' !== Tr.q(e2) && (i2 = false), Tr.V(e2);
  } catch (t2) {
    i2 = false;
  }
  return i2 || Ei.error("localStorage unsupported; falling back to cookie store"), Pr = i2, i2;
}, B: function(t2) {
  Ei.error("localStorage error: " + t2);
}, q: function(i2) {
  try {
    return null == t ? void 0 : t.localStorage.getItem(i2);
  } catch (t2) {
    Tr.B(t2);
  }
  return null;
}, W: function(t2) {
  try {
    return JSON.parse(Tr.q(t2)) || {};
  } catch (t3) {
  }
  return null;
}, G: function(i2, e2) {
  try {
    null == t || t.localStorage.setItem(i2, JSON.stringify(e2));
  } catch (t2) {
    Tr.B(t2);
  }
}, V: function(i2) {
  try {
    null == t || t.localStorage.removeItem(i2);
  } catch (t2) {
    Tr.B(t2);
  }
} };
var Ir = ["$device_id", "distinct_id", ie, ee, ge, _e];
var Cr = {};
var Rr = { H: function() {
  return true;
}, B: function(t2) {
  Ei.error("memoryStorage error: " + t2);
}, q: function(t2) {
  return Cr[t2] || null;
}, W: function(t2) {
  return Cr[t2] || null;
}, G: function(t2, i2) {
  Cr[t2] = i2;
}, V: function(t2) {
  delete Cr[t2];
} };
var Fr = null;
var Or = { H: function() {
  if (!j(Fr)) return Fr;
  if (Fr = true, O(t)) Fr = false;
  else try {
    var i2 = "__support__";
    Or.G(i2, "xyz"), '"xyz"' !== Or.q(i2) && (Fr = false), Or.V(i2);
  } catch (t2) {
    Fr = false;
  }
  return Fr;
}, B: function(t2) {
  Ei.error("sessionStorage error: ", t2);
}, q: function(i2) {
  try {
    return null == t ? void 0 : t.sessionStorage.getItem(i2);
  } catch (t2) {
    Or.B(t2);
  }
  return null;
}, W: function(t2) {
  try {
    return JSON.parse(Or.q(t2)) || null;
  } catch (t3) {
  }
  return null;
}, G: function(i2, e2) {
  try {
    null == t || t.sessionStorage.setItem(i2, JSON.stringify(e2));
  } catch (t2) {
    Or.B(t2);
  }
}, V: function(i2) {
  try {
    null == t || t.sessionStorage.removeItem(i2);
  } catch (t2) {
    Or.B(t2);
  }
} };
var Mr = (function(t2) {
  return t2[t2.PENDING = -1] = "PENDING", t2[t2.DENIED = 0] = "DENIED", t2[t2.GRANTED = 1] = "GRANTED", t2;
})({});
var Ar = class {
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
      this.Z = "localStorage" === t2 ? Tr : kr;
      var i2 = "localStorage" === t2 ? kr : Tr;
      i2.q(this.X) && (this.Z.q(this.X) || this.optInOut(V(i2.q(this.X))), i2.V(this.X, this.R.cross_subdomain_cookie));
    }
    return this.Z;
  }
  J() {
    return !!this.R.respect_dnt && !!Ui([null == n ? void 0 : n.doNotTrack, null == n ? void 0 : n.msDoNotTrack, v.doNotTrack], ((t2) => V(t2)));
  }
};
var jr = Si("[Dead Clicks]");
var Dr = () => true;
var Lr = (t2) => {
  var i2, e2 = !(null == (i2 = t2.instance.persistence) || !i2.get_property(Xi)), r2 = t2.instance.config.capture_dead_clicks;
  return U(r2) ? r2 : !!R(r2) || e2;
};
var Nr = class {
  get lazyLoadedDeadClicksAutocapture() {
    return this.tt;
  }
  constructor(t2, i2, e2) {
    this.instance = t2, this.isEnabled = i2, this.onCapture = e2, this.startIfEnabledOrStop();
  }
  onRemoteConfig(t2) {
    "captureDeadClicks" in t2 && (this.instance.persistence && this.instance.persistence.register({ [Xi]: t2.captureDeadClicks }), this.startIfEnabledOrStop());
  }
  startIfEnabledOrStop() {
    this.isEnabled(this) ? this.it((() => {
      this.et();
    })) : this.stop();
  }
  it(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.initDeadClicksAutocapture && t2(), null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this.instance, "dead-clicks-autocapture", ((i3) => {
      i3 ? jr.error("failed to load script", i3) : t2();
    }));
  }
  et() {
    var t2;
    if (o) {
      if (!this.tt && null != (t2 = v.__PosthogExtensions__) && t2.initDeadClicksAutocapture) {
        var i2 = R(this.instance.config.capture_dead_clicks) ? this.instance.config.capture_dead_clicks : {};
        i2.__onCapture = this.onCapture, this.tt = v.__PosthogExtensions__.initDeadClicksAutocapture(this.instance, i2), this.tt.start(o), jr.info("starting...");
      }
    } else jr.error("`document` not found. Cannot start.");
  }
  stop() {
    this.tt && (this.tt.stop(), this.tt = void 0, jr.info("stopping..."));
  }
};
var Ur = Si("[ExceptionAutocapture]");
var zr = class {
  constructor(i2) {
    var e2, r2, s2;
    this.rt = () => {
      var i3;
      if (t && this.isEnabled && null != (i3 = v.__PosthogExtensions__) && i3.errorWrappingFunctions) {
        var e3 = v.__PosthogExtensions__.errorWrappingFunctions.wrapOnError, r3 = v.__PosthogExtensions__.errorWrappingFunctions.wrapUnhandledRejection, s3 = v.__PosthogExtensions__.errorWrappingFunctions.wrapConsoleError;
        try {
          !this.st && this.R.capture_unhandled_errors && (this.st = e3(this.captureException.bind(this))), !this.nt && this.R.capture_unhandled_rejections && (this.nt = r3(this.captureException.bind(this))), !this.ot && this.R.capture_console_errors && (this.ot = s3(this.captureException.bind(this)));
        } catch (t2) {
          Ur.error("failed to start", t2), this.ut();
        }
      }
    }, this._instance = i2, this.ht = !(null == (e2 = this._instance.persistence) || !e2.props[Vi]), this.dt = new Y({ refillRate: null !== (r2 = this._instance.config.error_tracking.__exceptionRateLimiterRefillRate) && void 0 !== r2 ? r2 : 1, bucketSize: null !== (s2 = this._instance.config.error_tracking.__exceptionRateLimiterBucketSize) && void 0 !== s2 ? s2 : 10, refillInterval: 1e4, h: Ur }), this.R = this.vt(), this.startIfEnabledOrStop();
  }
  vt() {
    var t2 = this._instance.config.capture_exceptions, i2 = { capture_unhandled_errors: false, capture_unhandled_rejections: false, capture_console_errors: false };
    return R(t2) ? i2 = _({}, i2, t2) : (O(t2) ? this.ht : t2) && (i2 = _({}, i2, { capture_unhandled_errors: true, capture_unhandled_rejections: true })), i2;
  }
  get isEnabled() {
    return this.R.capture_console_errors || this.R.capture_unhandled_errors || this.R.capture_unhandled_rejections;
  }
  startIfEnabledOrStop() {
    this.isEnabled ? (Ur.info("enabled"), this.ut(), this.it(this.rt)) : this.ut();
  }
  it(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.errorWrappingFunctions && t2(), null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, "exception-autocapture", ((i3) => {
      if (i3) return Ur.error("failed to load script", i3);
      t2();
    }));
  }
  ut() {
    var t2, i2, e2;
    null == (t2 = this.st) || t2.call(this), this.st = void 0, null == (i2 = this.nt) || i2.call(this), this.nt = void 0, null == (e2 = this.ot) || e2.call(this), this.ot = void 0;
  }
  onRemoteConfig(t2) {
    if ("autocaptureExceptions" in t2) {
      var i2 = t2.autocaptureExceptions;
      this.ht = !!i2 || false, this._instance.persistence && this._instance.persistence.register({ [Vi]: this.ht }), this.R = this.vt(), this.startIfEnabledOrStop();
    }
  }
  onConfigChange() {
    this.R = this.vt();
  }
  captureException(t2) {
    var i2, e2, r2 = null !== (i2 = null == t2 || null == (e2 = t2.$exception_list) || null == (e2 = e2[0]) ? void 0 : e2.type) && void 0 !== i2 ? i2 : "Exception";
    this.dt.consumeRateLimit(r2) ? Ur.info("Skipping exception capture because of client rate limiting.", { exception: r2 }) : this._instance.exceptions.sendExceptionEvent(t2);
  }
};
function Hr(t2, i2, e2) {
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
var Br = class {
  constructor(i2) {
    var e2;
    this._instance = i2, this.ct = (null == t || null == (e2 = t.location) ? void 0 : e2.pathname) || "";
  }
  get isEnabled() {
    return "history_change" === this._instance.config.capture_pageview;
  }
  startIfEnabled() {
    this.isEnabled && (Ei.info("History API monitoring enabled, starting..."), this.monitorHistoryChanges());
  }
  stop() {
    this.ft && this.ft(), this.ft = void 0, Ei.info("History API monitoring stopped");
  }
  monitorHistoryChanges() {
    var i2, e2;
    if (t && t.history) {
      var r2 = this;
      null != (i2 = t.history.pushState) && i2.__posthog_wrapped__ || Hr(t.history, "pushState", ((t2) => function(i3, e3, s2) {
        t2.call(this, i3, e3, s2), r2._t("pushState");
      })), null != (e2 = t.history.replaceState) && e2.__posthog_wrapped__ || Hr(t.history, "replaceState", ((t2) => function(i3, e3, s2) {
        t2.call(this, i3, e3, s2), r2._t("replaceState");
      })), this.bt();
    }
  }
  _t(i2) {
    try {
      var e2, r2 = null == t || null == (e2 = t.location) ? void 0 : e2.pathname;
      if (!r2) return;
      r2 !== this.ct && this.isEnabled && this._instance.capture("$pageview", { navigation_type: i2 }), this.ct = r2;
    } catch (t2) {
      Ei.error("Error capturing " + i2 + " pageview", t2);
    }
  }
  bt() {
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
var qr = Si("[SegmentIntegration]");
function Wr(t2, i2) {
  var e2 = t2.config.segment;
  if (!e2) return i2();
  !(function(t3, i3) {
    var e3 = t3.config.segment;
    if (!e3) return i3();
    var r2 = (e4) => {
      var r3 = () => e4.anonymousId() || wr();
      t3.config.get_device_id = r3, e4.id() && (t3.register({ distinct_id: e4.id(), $device_id: r3() }), t3.persistence.set_property(de, "identified")), i3();
    }, s2 = e3.user();
    "then" in s2 && C(s2.then) ? s2.then(r2) : r2(s2);
  })(t2, (() => {
    e2.register(((t3) => {
      Promise && Promise.resolve || qr.warn("This browser does not have Promise support, and can not use the segment integration");
      var i3 = (i4, e3) => {
        if (!e3) return i4;
        i4.event.userId || i4.event.anonymousId === t3.get_distinct_id() || (qr.info("No userId set, resetting PostHog"), t3.reset()), i4.event.userId && i4.event.userId !== t3.get_distinct_id() && (qr.info("UserId set, identifying with PostHog"), t3.identify(i4.event.userId));
        var r2 = t3.calculateEventProperties(e3, i4.event.properties);
        return i4.event.properties = Object.assign({}, r2, i4.event.properties), i4;
      };
      return { name: "PostHog JS", type: "enrichment", version: "1.0.0", isLoaded: () => true, load: () => Promise.resolve(), track: (t4) => i3(t4, t4.event.event), page: (t4) => i3(t4, "$pageview"), identify: (t4) => i3(t4, "$identify"), screen: (t4) => i3(t4, "$screen") };
    })(t2)).then((() => {
      i2();
    }));
  }));
}
var Gr = "posthog-js";
function Vr(t2, i2) {
  var { organization: e2, projectId: r2, prefix: s2, severityAllowList: n2 = ["error"], sendExceptionsToPostHog: o2 = true } = void 0 === i2 ? {} : i2;
  return (i3) => {
    var a2, l2, u2, h2, d2;
    if (!("*" === n2 || n2.includes(i3.level)) || !t2.__loaded) return i3;
    i3.tags || (i3.tags = {});
    var v2 = t2.requestRouter.endpointFor("ui", "/project/" + t2.config.token + "/person/" + t2.get_distinct_id());
    i3.tags["PostHog Person URL"] = v2, t2.sessionRecordingStarted() && (i3.tags["PostHog Recording URL"] = t2.get_session_replay_url({ withTimestamp: true }));
    var c2 = (null == (a2 = i3.exception) ? void 0 : a2.values) || [], f2 = c2.map(((t3) => _({}, t3, { stacktrace: t3.stacktrace ? _({}, t3.stacktrace, { type: "raw", frames: (t3.stacktrace.frames || []).map(((t4) => _({}, t4, { platform: "web:javascript" }))) }) : void 0 }))), p2 = { $exception_message: (null == (l2 = c2[0]) ? void 0 : l2.value) || i3.message, $exception_type: null == (u2 = c2[0]) ? void 0 : u2.type, $exception_level: i3.level, $exception_list: f2, $sentry_event_id: i3.event_id, $sentry_exception: i3.exception, $sentry_exception_message: (null == (h2 = c2[0]) ? void 0 : h2.value) || i3.message, $sentry_exception_type: null == (d2 = c2[0]) ? void 0 : d2.type, $sentry_tags: i3.tags };
    return e2 && r2 && (p2.$sentry_url = (s2 || "https://sentry.io/organizations/") + e2 + "/issues/?project=" + r2 + "&query=" + i3.event_id), o2 && t2.exceptions.sendExceptionEvent(p2), i3;
  };
}
var Jr = class {
  constructor(t2, i2, e2, r2, s2, n2) {
    this.name = Gr, this.setupOnce = function(o2) {
      o2(Vr(t2, { organization: i2, projectId: e2, prefix: r2, severityAllowList: s2, sendExceptionsToPostHog: null == n2 || n2 }));
    };
  }
};
var Kr = null != t && t.location ? ar(t.location.hash, "__posthog") || ar(location.hash, "state") : null;
var Yr = "_postHogToolbarParams";
var Xr = Si("[Toolbar]");
var Qr = (function(t2) {
  return t2[t2.UNINITIALIZED = 0] = "UNINITIALIZED", t2[t2.LOADING = 1] = "LOADING", t2[t2.LOADED = 2] = "LOADED", t2;
})(Qr || {});
var Zr = class {
  constructor(t2) {
    this.instance = t2;
  }
  yt(t2) {
    v.ph_toolbar_state = t2;
  }
  wt() {
    var t2;
    return null !== (t2 = v.ph_toolbar_state) && void 0 !== t2 ? t2 : Qr.UNINITIALIZED;
  }
  maybeLoadToolbar(i2, e2, r2) {
    if (void 0 === i2 && (i2 = void 0), void 0 === e2 && (e2 = void 0), void 0 === r2 && (r2 = void 0), this.instance.config.name && "ph_toolbar_internal" === this.instance.config.name) return false;
    if (!t || !o) return false;
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
      var s2, n2 = Kr || ar(i2.hash, "__posthog") || ar(i2.hash, "state"), a2 = n2 ? Mi((() => JSON.parse(atob(decodeURIComponent(n2))))) || Mi((() => JSON.parse(decodeURIComponent(n2)))) : null;
      return a2 && "ph_authorize" === a2.action ? ((s2 = a2).source = "url", s2 && Object.keys(s2).length > 0 && (a2.desiredHash ? i2.hash = a2.desiredHash : r2 ? r2.replaceState(r2.state, "", i2.pathname + i2.search) : i2.hash = "")) : ((s2 = JSON.parse(e2.getItem(Yr) || "{}")).source = "localstorage", delete s2.userIntent), !(!s2.token || this.instance.config.token !== s2.token) && (this.loadToolbar(s2), true);
    } catch (t2) {
      return false;
    }
  }
  xt(t2) {
    var i2 = v.ph_load_toolbar || v.ph_load_editor;
    !D(i2) && C(i2) ? i2(t2, this.instance) : Xr.warn("No toolbar load function found");
  }
  loadToolbar(i2) {
    var e2 = !(null == o || !o.getElementById(me));
    if (!t || e2) return false;
    var r2 = "custom" === this.instance.requestRouter.region && this.instance.config.advanced_disable_toolbar_metrics, s2 = _({ token: this.instance.config.token }, i2, { apiURL: this.instance.requestRouter.endpointFor("ui") }, r2 ? { instrument: false } : {});
    if (t.localStorage.setItem(Yr, JSON.stringify(_({}, s2, { source: void 0 }))), this.wt() === Qr.LOADED) this.xt(s2);
    else if (this.wt() === Qr.UNINITIALIZED) {
      var n2;
      this.yt(Qr.LOADING), null == (n2 = v.__PosthogExtensions__) || null == n2.loadExternalDependency || n2.loadExternalDependency(this.instance, "toolbar", ((t2) => {
        if (t2) return Xr.error("[Toolbar] Failed to load", t2), void this.yt(Qr.UNINITIALIZED);
        this.yt(Qr.LOADED), this.xt(s2);
      })), zi(t, "turbolinks:load", (() => {
        this.yt(Qr.UNINITIALIZED), this.loadToolbar(s2);
      }));
    }
    return true;
  }
  $t(t2) {
    return this.loadToolbar(t2);
  }
  maybeLoadEditor(t2, i2, e2) {
    return void 0 === t2 && (t2 = void 0), void 0 === i2 && (i2 = void 0), void 0 === e2 && (e2 = void 0), this.maybeLoadToolbar(t2, i2, e2);
  }
};
var ts = Si("[TracingHeaders]");
var is = class {
  constructor(t2) {
    this.Et = void 0, this.St = void 0, this.rt = () => {
      var t3, i2;
      O(this.Et) && (null == (t3 = v.__PosthogExtensions__) || null == (t3 = t3.tracingHeadersPatchFns) || t3._patchXHR(this._instance.config.__add_tracing_headers || [], this._instance.get_distinct_id(), this._instance.sessionManager));
      O(this.St) && (null == (i2 = v.__PosthogExtensions__) || null == (i2 = i2.tracingHeadersPatchFns) || i2._patchFetch(this._instance.config.__add_tracing_headers || [], this._instance.get_distinct_id(), this._instance.sessionManager));
    }, this._instance = t2;
  }
  it(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.tracingHeadersPatchFns && t2(), null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, "tracing-headers", ((i3) => {
      if (i3) return ts.error("failed to load script", i3);
      t2();
    }));
  }
  startIfEnabledOrStop() {
    var t2, i2;
    this._instance.config.__add_tracing_headers ? this.it(this.rt) : (null == (t2 = this.Et) || t2.call(this), null == (i2 = this.St) || i2.call(this), this.Et = void 0, this.St = void 0);
  }
};
var es = "https?://(.*)";
var rs = ["gclid", "gclsrc", "dclid", "gbraid", "wbraid", "fbclid", "msclkid", "twclid", "li_fat_id", "igshid", "ttclid", "rdt_cid", "epik", "qclid", "sccid", "irclid", "_kx"];
var ss = Fi(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source", "mc_cid"], rs);
var ns = "<masked>";
var os = ["li_fat_id"];
function as(t2, i2, e2) {
  if (!o) return {};
  var r2, s2 = i2 ? Fi([], rs, e2 || []) : [], n2 = ls(or(o.URL, s2, ns), t2), a2 = (r2 = {}, Ci(os, (function(t3) {
    var i3 = kr.q(t3);
    r2[t3] = i3 || null;
  })), r2);
  return Ri(a2, n2);
}
function ls(t2, i2) {
  var e2 = ss.concat(i2 || []), r2 = {};
  return Ci(e2, (function(i3) {
    var e3 = nr(t2, i3);
    r2[i3] = e3 || null;
  })), r2;
}
function us(t2) {
  var i2 = (function(t3) {
    return t3 ? 0 === t3.search(es + "google.([^/?]*)") ? "google" : 0 === t3.search(es + "bing.com") ? "bing" : 0 === t3.search(es + "yahoo.com") ? "yahoo" : 0 === t3.search(es + "duckduckgo.com") ? "duckduckgo" : null : null;
  })(t2), e2 = "yahoo" != i2 ? "q" : "p", r2 = {};
  if (!j(i2)) {
    r2.$search_engine = i2;
    var s2 = o ? nr(o.referrer, e2) : "";
    s2.length && (r2.ph_keyword = s2);
  }
  return r2;
}
function hs() {
  return navigator.language || navigator.userLanguage;
}
function ds() {
  return (null == o ? void 0 : o.referrer) || "$direct";
}
function vs(t2, i2) {
  var e2 = t2 ? Fi([], rs, i2 || []) : [], r2 = null == a ? void 0 : a.href.substring(0, 1e3);
  return { r: ds().substring(0, 1e3), u: r2 ? or(r2, e2, ns) : void 0 };
}
function cs(t2) {
  var i2, { r: e2, u: r2 } = t2, s2 = { $referrer: e2, $referring_domain: null == e2 ? void 0 : "$direct" == e2 ? "$direct" : null == (i2 = rr(e2)) ? void 0 : i2.host };
  if (r2) {
    s2.$current_url = r2;
    var n2 = rr(r2);
    s2.$host = null == n2 ? void 0 : n2.host, s2.$pathname = null == n2 ? void 0 : n2.pathname;
    var o2 = ls(r2);
    Ri(s2, o2);
  }
  if (e2) {
    var a2 = us(e2);
    Ri(s2, a2);
  }
  return s2;
}
function fs() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (t2) {
    return;
  }
}
function ps() {
  try {
    return (/* @__PURE__ */ new Date()).getTimezoneOffset();
  } catch (t2) {
    return;
  }
}
function _s(i2, e2) {
  if (!d) return {};
  var r2, s2, n2, o2 = i2 ? Fi([], rs, e2 || []) : [], [l2, u2] = (function(t2) {
    for (var i3 = 0; i3 < Jt.length; i3++) {
      var [e3, r3] = Jt[i3], s3 = e3.exec(t2), n3 = s3 && (C(r3) ? r3(s3, t2) : r3);
      if (n3) return n3;
    }
    return ["", ""];
  })(d);
  return Ri(ji({ $os: l2, $os_version: u2, $browser: Wt(d, navigator.vendor), $device: Kt(d), $device_type: (s2 = d, n2 = Kt(s2), n2 === et || n2 === it || "Kobo" === n2 || "Kindle Fire" === n2 || n2 === Ft ? tt : n2 === wt || n2 === $t || n2 === xt || n2 === It ? "Console" : n2 === st ? "Wearable" : n2 ? X : "Desktop"), $timezone: fs(), $timezone_offset: ps() }), { $current_url: or(null == a ? void 0 : a.href, o2, ns), $host: null == a ? void 0 : a.host, $pathname: null == a ? void 0 : a.pathname, $raw_user_agent: d.length > 1e3 ? d.substring(0, 997) + "..." : d, $browser_version: Vt(d, navigator.vendor), $browser_language: hs(), $browser_language_prefix: (r2 = hs(), "string" == typeof r2 ? r2.split("-")[0] : void 0), $screen_height: null == t ? void 0 : t.screen.height, $screen_width: null == t ? void 0 : t.screen.width, $viewport_height: null == t ? void 0 : t.innerHeight, $viewport_width: null == t ? void 0 : t.innerWidth, $lib: "web", $lib_version: c.LIB_VERSION, $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10), $time: Date.now() / 1e3 });
}
var gs = Si("[Web Vitals]");
var ms = 9e5;
var bs = class {
  constructor(t2) {
    var i2;
    this.kt = false, this.P = false, this.N = { url: void 0, metrics: [], firstMetricTimestamp: void 0 }, this.Pt = () => {
      clearTimeout(this.Tt), 0 !== this.N.metrics.length && (this._instance.capture("$web_vitals", this.N.metrics.reduce(((t3, i3) => _({}, t3, { ["$web_vitals_" + i3.name + "_event"]: _({}, i3), ["$web_vitals_" + i3.name + "_value"]: i3.value })), {})), this.N = { url: void 0, metrics: [], firstMetricTimestamp: void 0 });
    }, this.It = (t3) => {
      var i3, e2 = null == (i3 = this._instance.sessionManager) ? void 0 : i3.checkAndGetSessionAndWindowId(true);
      if (O(e2)) gs.error("Could not read session ID. Dropping metrics!");
      else {
        this.N = this.N || { url: void 0, metrics: [], firstMetricTimestamp: void 0 };
        var r2 = this.Ct();
        if (!O(r2)) if (D(null == t3 ? void 0 : t3.name) || D(null == t3 ? void 0 : t3.value)) gs.error("Invalid metric received", t3);
        else if (this.Rt && t3.value >= this.Rt) gs.error("Ignoring metric with value >= " + this.Rt, t3);
        else this.N.url !== r2 && (this.Pt(), this.Tt = setTimeout(this.Pt, this.flushToCaptureTimeoutMs)), O(this.N.url) && (this.N.url = r2), this.N.firstMetricTimestamp = O(this.N.firstMetricTimestamp) ? Date.now() : this.N.firstMetricTimestamp, t3.attribution && t3.attribution.interactionTargetElement && (t3.attribution.interactionTargetElement = void 0), this.N.metrics.push(_({}, t3, { $current_url: r2, $session_id: e2.sessionId, $window_id: e2.windowId, timestamp: Date.now() })), this.N.metrics.length === this.allowedMetrics.length && this.Pt();
      }
    }, this.rt = () => {
      if (!this.P) {
        var t3, i3, e2, r2, s2 = v.__PosthogExtensions__;
        O(s2) || O(s2.postHogWebVitalsCallbacks) || ({ onLCP: t3, onCLS: i3, onFCP: e2, onINP: r2 } = s2.postHogWebVitalsCallbacks), t3 && i3 && e2 && r2 ? (this.allowedMetrics.indexOf("LCP") > -1 && t3(this.It.bind(this)), this.allowedMetrics.indexOf("CLS") > -1 && i3(this.It.bind(this)), this.allowedMetrics.indexOf("FCP") > -1 && e2(this.It.bind(this)), this.allowedMetrics.indexOf("INP") > -1 && r2(this.It.bind(this)), this.P = true) : gs.error("web vitals callbacks not loaded - not starting");
      }
    }, this._instance = t2, this.kt = !(null == (i2 = this._instance.persistence) || !i2.props[Yi]), this.startIfEnabled();
  }
  get allowedMetrics() {
    var t2, i2, e2 = R(this._instance.config.capture_performance) ? null == (t2 = this._instance.config.capture_performance) ? void 0 : t2.web_vitals_allowed_metrics : void 0;
    return D(e2) ? (null == (i2 = this._instance.persistence) ? void 0 : i2.props[Zi]) || ["CLS", "FCP", "INP", "LCP"] : e2;
  }
  get flushToCaptureTimeoutMs() {
    return (R(this._instance.config.capture_performance) ? this._instance.config.capture_performance.web_vitals_delayed_flush_ms : void 0) || 5e3;
  }
  get useAttribution() {
    var t2 = R(this._instance.config.capture_performance) ? this._instance.config.capture_performance.web_vitals_attribution : void 0;
    return null != t2 && t2;
  }
  get Rt() {
    var t2 = R(this._instance.config.capture_performance) && L(this._instance.config.capture_performance.__web_vitals_max_value) ? this._instance.config.capture_performance.__web_vitals_max_value : ms;
    return 0 < t2 && t2 <= 6e4 ? ms : t2;
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
    if ("capturePerformance" in t2) {
      var i2 = R(t2.capturePerformance) && !!t2.capturePerformance.web_vitals, e2 = R(t2.capturePerformance) ? t2.capturePerformance.web_vitals_allowed_metrics : void 0;
      this._instance.persistence && (this._instance.persistence.register({ [Yi]: i2 }), this._instance.persistence.register({ [Zi]: e2 })), this.kt = i2, this.startIfEnabled();
    }
  }
  it(t2) {
    var i2, e2;
    if (null != (i2 = v.__PosthogExtensions__) && i2.postHogWebVitalsCallbacks) t2();
    else {
      var r2 = this.useAttribution ? "web-vitals-with-attribution" : "web-vitals";
      null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, r2, ((i3) => {
        i3 ? gs.error("failed to load script", i3) : t2();
      }));
    }
  }
  Ct() {
    var i2 = t ? t.location.href : void 0;
    if (i2) {
      var e2 = this._instance.config.mask_personal_data_properties, r2 = this._instance.config.custom_personal_data_properties, s2 = e2 ? Fi([], rs, r2 || []) : [];
      return or(i2, s2, ns);
    }
    gs.error("Could not determine current URL");
  }
};
var ys = Si("[Heatmaps]");
function ws(t2) {
  return R(t2) && "clientX" in t2 && "clientY" in t2 && L(t2.clientX) && L(t2.clientY);
}
var xs = class {
  constructor(t2) {
    var i2;
    this.kt = false, this.P = false, this.Ft = null, this.instance = t2, this.kt = !(null == (i2 = this.instance.persistence) || !i2.props[Gi]), this.rageclicks = new er(t2.config.rageclick);
  }
  get flushIntervalMilliseconds() {
    var t2 = 5e3;
    return R(this.instance.config.capture_heatmaps) && this.instance.config.capture_heatmaps.flush_interval_milliseconds && (t2 = this.instance.config.capture_heatmaps.flush_interval_milliseconds), t2;
  }
  get isEnabled() {
    return D(this.instance.config.capture_heatmaps) ? D(this.instance.config.enable_heatmaps) ? this.kt : this.instance.config.enable_heatmaps : false !== this.instance.config.capture_heatmaps;
  }
  startIfEnabled() {
    if (this.isEnabled) {
      if (this.P) return;
      ys.info("starting..."), this.Ot(), this.Mt();
    } else {
      var t2;
      clearInterval(null !== (t2 = this.Ft) && void 0 !== t2 ? t2 : void 0), this.At(), this.getAndClearBuffer();
    }
  }
  onRemoteConfig(t2) {
    if ("heatmaps" in t2) {
      var i2 = !!t2.heatmaps;
      this.instance.persistence && this.instance.persistence.register({ [Gi]: i2 }), this.kt = i2, this.startIfEnabled();
    }
  }
  getAndClearBuffer() {
    var t2 = this.N;
    return this.N = void 0, t2;
  }
  jt(t2) {
    this.Dt(t2.originalEvent, "deadclick");
  }
  Mt() {
    this.Ft && clearInterval(this.Ft), this.Ft = (function(t2) {
      return "visible" === (null == t2 ? void 0 : t2.visibilityState);
    })(o) ? setInterval(this.Lt.bind(this), this.flushIntervalMilliseconds) : null;
  }
  Ot() {
    t && o && (this.Nt = this.Lt.bind(this), zi(t, "beforeunload", this.Nt), this.Ut = (i2) => this.Dt(i2 || (null == t ? void 0 : t.event)), zi(o, "click", this.Ut, { capture: true }), this.zt = (i2) => this.Ht(i2 || (null == t ? void 0 : t.event)), zi(o, "mousemove", this.zt, { capture: true }), this.Bt = new Nr(this.instance, Dr, this.jt.bind(this)), this.Bt.startIfEnabledOrStop(), this.qt = this.Mt.bind(this), zi(o, "visibilitychange", this.qt), this.P = true);
  }
  At() {
    var i2;
    t && o && (this.Nt && t.removeEventListener("beforeunload", this.Nt), this.Ut && o.removeEventListener("click", this.Ut, { capture: true }), this.zt && o.removeEventListener("mousemove", this.zt, { capture: true }), this.qt && o.removeEventListener("visibilitychange", this.qt), clearTimeout(this.Wt), null == (i2 = this.Bt) || i2.stop(), this.P = false);
  }
  Gt(i2, e2) {
    var r2 = this.instance.scrollManager.scrollY(), s2 = this.instance.scrollManager.scrollX(), n2 = this.instance.scrollManager.scrollElement(), o2 = (function(i3, e3, r3) {
      for (var s3 = i3; s3 && xe(s3) && !$e(s3, "body"); ) {
        if (s3 === r3) return false;
        if (w(e3, null == t ? void 0 : t.getComputedStyle(s3).position)) return true;
        s3 = Me(s3);
      }
      return false;
    })(Re(i2), ["fixed", "sticky"], n2);
    return { x: i2.clientX + (o2 ? 0 : s2), y: i2.clientY + (o2 ? 0 : r2), target_fixed: o2, type: e2 };
  }
  Dt(t2, i2) {
    var e2;
    if (void 0 === i2 && (i2 = "click"), !we(t2.target) && ws(t2)) {
      var r2 = this.Gt(t2, i2);
      null != (e2 = this.rageclicks) && e2.isRageClick(t2.clientX, t2.clientY, (/* @__PURE__ */ new Date()).getTime()) && this.Vt(_({}, r2, { type: "rageclick" })), this.Vt(r2);
    }
  }
  Ht(t2) {
    !we(t2.target) && ws(t2) && (clearTimeout(this.Wt), this.Wt = setTimeout((() => {
      this.Vt(this.Gt(t2, "mousemove"));
    }), 500));
  }
  Vt(i2) {
    if (t) {
      var e2 = t.location.href, r2 = this.instance.config.mask_personal_data_properties, s2 = this.instance.config.custom_personal_data_properties, n2 = r2 ? Fi([], rs, s2 || []) : [], o2 = or(e2, n2, ns);
      this.N = this.N || {}, this.N[o2] || (this.N[o2] = []), this.N[o2].push(i2);
    }
  }
  Lt() {
    this.N && !F(this.N) && this.instance.capture("$$heatmap", { $heatmap_data: this.getAndClearBuffer() });
  }
};
var $s = class {
  constructor(t2) {
    this.Jt = (t3, i2, e2) => {
      e2 && (e2.noSessionId || e2.activityTimeout || e2.sessionPastMaximumLength) && (Ei.info("[PageViewManager] Session rotated, clearing pageview state", { sessionId: t3, changeReason: e2 }), this.Kt = void 0, this._instance.scrollManager.resetContext());
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
      var { maxScrollHeight: n2, lastScrollY: o2, maxScrollY: a2, maxContentHeight: l2, lastContentY: u2, maxContentY: h2 } = s2;
      if (!(O(n2) || O(o2) || O(a2) || O(l2) || O(u2) || O(h2))) {
        n2 = Math.ceil(n2), o2 = Math.ceil(o2), a2 = Math.ceil(a2), l2 = Math.ceil(l2), u2 = Math.ceil(u2), h2 = Math.ceil(h2);
        var d2 = n2 <= 1 ? 1 : K(o2 / n2, 0, 1, Ei), v2 = n2 <= 1 ? 1 : K(a2 / n2, 0, 1, Ei), c2 = l2 <= 1 ? 1 : K(u2 / l2, 0, 1, Ei), f2 = l2 <= 1 ? 1 : K(h2 / l2, 0, 1, Ei);
        r2 = Ri(r2, { $prev_pageview_last_scroll: o2, $prev_pageview_last_scroll_percentage: d2, $prev_pageview_max_scroll: a2, $prev_pageview_max_scroll_percentage: v2, $prev_pageview_last_content: u2, $prev_pageview_last_content_percentage: c2, $prev_pageview_max_content: h2, $prev_pageview_max_content_percentage: f2 });
      }
    }
    return e2.pathname && (r2.$prev_pageview_pathname = e2.pathname), e2.timestamp && (r2.$prev_pageview_duration = (t2.getTime() - e2.timestamp.getTime()) / 1e3), r2;
  }
};
var Es = ["fatal", "error", "warning", "log", "info", "debug"];
var Ss = (function(t2) {
  return t2.GZipJS = "gzip-js", t2.Base64 = "base64", t2;
})({});
var ks = Uint8Array;
var Ps = Uint16Array;
var Ts = Uint32Array;
var Is = new ks([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]);
var Cs = new ks([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]);
var Rs = new ks([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var Fs = function(t2, i2) {
  for (var e2 = new Ps(31), r2 = 0; r2 < 31; ++r2) e2[r2] = i2 += 1 << t2[r2 - 1];
  var s2 = new Ts(e2[30]);
  for (r2 = 1; r2 < 30; ++r2) for (var n2 = e2[r2]; n2 < e2[r2 + 1]; ++n2) s2[n2] = n2 - e2[r2] << 5 | r2;
  return [e2, s2];
};
var Os = Fs(Is, 2);
var Ms = Os[0];
var As = Os[1];
Ms[28] = 258, As[258] = 28;
for (js = Fs(Cs, 0)[1], Ds = new Ps(32768), Ls = 0; Ls < 32768; ++Ls) {
  Ns = (43690 & Ls) >>> 1 | (21845 & Ls) << 1;
  Ns = (61680 & (Ns = (52428 & Ns) >>> 2 | (13107 & Ns) << 2)) >>> 4 | (3855 & Ns) << 4, Ds[Ls] = ((65280 & Ns) >>> 8 | (255 & Ns) << 8) >>> 1;
}
var Ns;
var js;
var Ds;
var Ls;
var Us = function(t2, i2, e2) {
  for (var r2 = t2.length, s2 = 0, n2 = new Ps(i2); s2 < r2; ++s2) ++n2[t2[s2] - 1];
  var o2, a2 = new Ps(i2);
  for (s2 = 0; s2 < i2; ++s2) a2[s2] = a2[s2 - 1] + n2[s2 - 1] << 1;
  if (e2) {
    o2 = new Ps(1 << i2);
    var l2 = 15 - i2;
    for (s2 = 0; s2 < r2; ++s2) if (t2[s2]) for (var u2 = s2 << 4 | t2[s2], h2 = i2 - t2[s2], d2 = a2[t2[s2] - 1]++ << h2, v2 = d2 | (1 << h2) - 1; d2 <= v2; ++d2) o2[Ds[d2] >>> l2] = u2;
  } else for (o2 = new Ps(r2), s2 = 0; s2 < r2; ++s2) o2[s2] = Ds[a2[t2[s2] - 1]++] >>> 15 - t2[s2];
  return o2;
};
var zs = new ks(288);
for (Ls = 0; Ls < 144; ++Ls) zs[Ls] = 8;
for (Ls = 144; Ls < 256; ++Ls) zs[Ls] = 9;
for (Ls = 256; Ls < 280; ++Ls) zs[Ls] = 7;
for (Ls = 280; Ls < 288; ++Ls) zs[Ls] = 8;
var Hs = new ks(32);
for (Ls = 0; Ls < 32; ++Ls) Hs[Ls] = 5;
var Bs = Us(zs, 9, 0);
var qs = Us(Hs, 5, 0);
var Ws = function(t2) {
  return (t2 / 8 >> 0) + (7 & t2 && 1);
};
var Gs = function(t2, i2, e2) {
  (null == e2 || e2 > t2.length) && (e2 = t2.length);
  var r2 = new (t2 instanceof Ps ? Ps : t2 instanceof Ts ? Ts : ks)(e2 - i2);
  return r2.set(t2.subarray(i2, e2)), r2;
};
var Vs = function(t2, i2, e2) {
  e2 <<= 7 & i2;
  var r2 = i2 / 8 >> 0;
  t2[r2] |= e2, t2[r2 + 1] |= e2 >>> 8;
};
var Js = function(t2, i2, e2) {
  e2 <<= 7 & i2;
  var r2 = i2 / 8 >> 0;
  t2[r2] |= e2, t2[r2 + 1] |= e2 >>> 8, t2[r2 + 2] |= e2 >>> 16;
};
var Ks = function(t2, i2) {
  for (var e2 = [], r2 = 0; r2 < t2.length; ++r2) t2[r2] && e2.push({ s: r2, f: t2[r2] });
  var s2 = e2.length, n2 = e2.slice();
  if (!s2) return [new ks(0), 0];
  if (1 == s2) {
    var o2 = new ks(e2[0].s + 1);
    return o2[e2[0].s] = 1, [o2, 1];
  }
  e2.sort((function(t3, i3) {
    return t3.f - i3.f;
  })), e2.push({ s: -1, f: 25001 });
  var a2 = e2[0], l2 = e2[1], u2 = 0, h2 = 1, d2 = 2;
  for (e2[0] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 }; h2 != s2 - 1; ) a2 = e2[e2[u2].f < e2[d2].f ? u2++ : d2++], l2 = e2[u2 != h2 && e2[u2].f < e2[d2].f ? u2++ : d2++], e2[h2++] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 };
  var v2 = n2[0].s;
  for (r2 = 1; r2 < s2; ++r2) n2[r2].s > v2 && (v2 = n2[r2].s);
  var c2 = new Ps(v2 + 1), f2 = Ys(e2[h2 - 1], c2, 0);
  if (f2 > i2) {
    r2 = 0;
    var p2 = 0, _2 = f2 - i2, g2 = 1 << _2;
    for (n2.sort((function(t3, i3) {
      return c2[i3.s] - c2[t3.s] || t3.f - i3.f;
    })); r2 < s2; ++r2) {
      var m2 = n2[r2].s;
      if (!(c2[m2] > i2)) break;
      p2 += g2 - (1 << f2 - c2[m2]), c2[m2] = i2;
    }
    for (p2 >>>= _2; p2 > 0; ) {
      var b2 = n2[r2].s;
      c2[b2] < i2 ? p2 -= 1 << i2 - c2[b2]++ - 1 : ++r2;
    }
    for (; r2 >= 0 && p2; --r2) {
      var y2 = n2[r2].s;
      c2[y2] == i2 && (--c2[y2], ++p2);
    }
    f2 = i2;
  }
  return [new ks(c2), f2];
};
var Ys = function(t2, i2, e2) {
  return -1 == t2.s ? Math.max(Ys(t2.l, i2, e2 + 1), Ys(t2.r, i2, e2 + 1)) : i2[t2.s] = e2;
};
var Xs = function(t2) {
  for (var i2 = t2.length; i2 && !t2[--i2]; ) ;
  for (var e2 = new Ps(++i2), r2 = 0, s2 = t2[0], n2 = 1, o2 = function(t3) {
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
var Qs = function(t2, i2) {
  for (var e2 = 0, r2 = 0; r2 < i2.length; ++r2) e2 += t2[r2] * i2[r2];
  return e2;
};
var Zs = function(t2, i2, e2) {
  var r2 = e2.length, s2 = Ws(i2 + 2);
  t2[s2] = 255 & r2, t2[s2 + 1] = r2 >>> 8, t2[s2 + 2] = 255 ^ t2[s2], t2[s2 + 3] = 255 ^ t2[s2 + 1];
  for (var n2 = 0; n2 < r2; ++n2) t2[s2 + n2 + 4] = e2[n2];
  return 8 * (s2 + 4 + r2);
};
var tn = function(t2, i2, e2, r2, s2, n2, o2, a2, l2, u2, h2) {
  Vs(i2, h2++, e2), ++s2[256];
  for (var d2 = Ks(s2, 15), v2 = d2[0], c2 = d2[1], f2 = Ks(n2, 15), p2 = f2[0], _2 = f2[1], g2 = Xs(v2), m2 = g2[0], b2 = g2[1], y2 = Xs(p2), w2 = y2[0], x2 = y2[1], E2 = new Ps(19), S2 = 0; S2 < m2.length; ++S2) E2[31 & m2[S2]]++;
  for (S2 = 0; S2 < w2.length; ++S2) E2[31 & w2[S2]]++;
  for (var k2 = Ks(E2, 7), P2 = k2[0], T2 = k2[1], I2 = 19; I2 > 4 && !P2[Rs[I2 - 1]]; --I2) ;
  var C2, R2, F2, O2, M2 = u2 + 5 << 3, A2 = Qs(s2, zs) + Qs(n2, Hs) + o2, j2 = Qs(s2, v2) + Qs(n2, p2) + o2 + 14 + 3 * I2 + Qs(E2, P2) + (2 * E2[16] + 3 * E2[17] + 7 * E2[18]);
  if (M2 <= A2 && M2 <= j2) return Zs(i2, h2, t2.subarray(l2, l2 + u2));
  if (Vs(i2, h2, 1 + (j2 < A2)), h2 += 2, j2 < A2) {
    C2 = Us(v2, c2, 0), R2 = v2, F2 = Us(p2, _2, 0), O2 = p2;
    var D2 = Us(P2, T2, 0);
    Vs(i2, h2, b2 - 257), Vs(i2, h2 + 5, x2 - 1), Vs(i2, h2 + 10, I2 - 4), h2 += 14;
    for (S2 = 0; S2 < I2; ++S2) Vs(i2, h2 + 3 * S2, P2[Rs[S2]]);
    h2 += 3 * I2;
    for (var L2 = [m2, w2], N2 = 0; N2 < 2; ++N2) {
      var U2 = L2[N2];
      for (S2 = 0; S2 < U2.length; ++S2) {
        var z2 = 31 & U2[S2];
        Vs(i2, h2, D2[z2]), h2 += P2[z2], z2 > 15 && (Vs(i2, h2, U2[S2] >>> 5 & 127), h2 += U2[S2] >>> 12);
      }
    }
  } else C2 = Bs, R2 = zs, F2 = qs, O2 = Hs;
  for (S2 = 0; S2 < a2; ++S2) if (r2[S2] > 255) {
    z2 = r2[S2] >>> 18 & 31;
    Js(i2, h2, C2[z2 + 257]), h2 += R2[z2 + 257], z2 > 7 && (Vs(i2, h2, r2[S2] >>> 23 & 31), h2 += Is[z2]);
    var H2 = 31 & r2[S2];
    Js(i2, h2, F2[H2]), h2 += O2[H2], H2 > 3 && (Js(i2, h2, r2[S2] >>> 5 & 8191), h2 += Cs[H2]);
  } else Js(i2, h2, C2[r2[S2]]), h2 += R2[r2[S2]];
  return Js(i2, h2, C2[256]), h2 + R2[256];
};
var en = new Ts([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var rn = (function() {
  for (var t2 = new Ts(256), i2 = 0; i2 < 256; ++i2) {
    for (var e2 = i2, r2 = 9; --r2; ) e2 = (1 & e2 && 3988292384) ^ e2 >>> 1;
    t2[i2] = e2;
  }
  return t2;
})();
var sn = function(t2, i2, e2, r2, s2) {
  return (function(t3, i3, e3, r3, s3, n2) {
    var o2 = t3.length, a2 = new ks(r3 + o2 + 5 * (1 + Math.floor(o2 / 7e3)) + s3), l2 = a2.subarray(r3, a2.length - s3), u2 = 0;
    if (!i3 || o2 < 8) for (var h2 = 0; h2 <= o2; h2 += 65535) {
      var d2 = h2 + 65535;
      d2 < o2 ? u2 = Zs(l2, u2, t3.subarray(h2, d2)) : (l2[h2] = n2, u2 = Zs(l2, u2, t3.subarray(h2, o2)));
    }
    else {
      for (var v2 = en[i3 - 1], c2 = v2 >>> 13, f2 = 8191 & v2, p2 = (1 << e3) - 1, _2 = new Ps(32768), g2 = new Ps(p2 + 1), m2 = Math.ceil(e3 / 3), b2 = 2 * m2, y2 = function(i4) {
        return (t3[i4] ^ t3[i4 + 1] << m2 ^ t3[i4 + 2] << b2) & p2;
      }, w2 = new Ts(25e3), x2 = new Ps(288), E2 = new Ps(32), S2 = 0, k2 = 0, P2 = (h2 = 0, 0), T2 = 0, I2 = 0; h2 < o2; ++h2) {
        var C2 = y2(h2), R2 = 32767 & h2, F2 = g2[C2];
        if (_2[R2] = F2, g2[C2] = R2, T2 <= h2) {
          var O2 = o2 - h2;
          if ((S2 > 7e3 || P2 > 24576) && O2 > 423) {
            u2 = tn(t3, l2, 0, w2, x2, E2, k2, P2, I2, h2 - I2, u2), P2 = S2 = k2 = 0, I2 = h2;
            for (var M2 = 0; M2 < 286; ++M2) x2[M2] = 0;
            for (M2 = 0; M2 < 30; ++M2) E2[M2] = 0;
          }
          var A2 = 2, j2 = 0, D2 = f2, L2 = R2 - F2 & 32767;
          if (O2 > 2 && C2 == y2(h2 - L2)) for (var N2 = Math.min(c2, O2) - 1, U2 = Math.min(32767, h2), z2 = Math.min(258, O2); L2 <= U2 && --D2 && R2 != F2; ) {
            if (t3[h2 + A2] == t3[h2 + A2 - L2]) {
              for (var H2 = 0; H2 < z2 && t3[h2 + H2] == t3[h2 + H2 - L2]; ++H2) ;
              if (H2 > A2) {
                if (A2 = H2, j2 = L2, H2 > N2) break;
                var B2 = Math.min(L2, H2 - 2), q2 = 0;
                for (M2 = 0; M2 < B2; ++M2) {
                  var W2 = h2 - L2 + M2 + 32768 & 32767, G2 = W2 - _2[W2] + 32768 & 32767;
                  G2 > q2 && (q2 = G2, F2 = W2);
                }
              }
            }
            L2 += (R2 = F2) - (F2 = _2[R2]) + 32768 & 32767;
          }
          if (j2) {
            w2[P2++] = 268435456 | As[A2] << 18 | js[j2];
            var V2 = 31 & As[A2], J2 = 31 & js[j2];
            k2 += Is[V2] + Cs[J2], ++x2[257 + V2], ++E2[J2], T2 = h2 + A2, ++S2;
          } else w2[P2++] = t3[h2], ++x2[t3[h2]];
        }
      }
      u2 = tn(t3, l2, n2, w2, x2, E2, k2, P2, I2, h2 - I2, u2);
    }
    return Gs(a2, 0, r3 + Ws(u2) + s3);
  })(t2, null == i2.level ? 6 : i2.level, null == i2.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(t2.length)))) : 12 + i2.mem, e2, r2, true);
};
var nn = function(t2, i2, e2) {
  for (; e2; ++i2) t2[i2] = e2, e2 >>>= 8;
};
function on(t2, i2) {
  void 0 === i2 && (i2 = {});
  var e2 = /* @__PURE__ */ (function() {
    var t3 = 4294967295;
    return { p: function(i3) {
      for (var e3 = t3, r3 = 0; r3 < i3.length; ++r3) e3 = rn[255 & e3 ^ i3[r3]] ^ e3 >>> 8;
      t3 = e3;
    }, d: function() {
      return 4294967295 ^ t3;
    } };
  })(), r2 = t2.length;
  e2.p(t2);
  var s2, n2 = sn(t2, i2, 10 + ((s2 = i2).filename && s2.filename.length + 1 || 0), 8), o2 = n2.length;
  return (function(t3, i3) {
    var e3 = i3.filename;
    if (t3[0] = 31, t3[1] = 139, t3[2] = 8, t3[8] = i3.level < 2 ? 4 : 9 == i3.level ? 2 : 0, t3[9] = 3, 0 != i3.mtime && nn(t3, 4, Math.floor(new Date(i3.mtime || Date.now()) / 1e3)), e3) {
      t3[3] = 8;
      for (var r3 = 0; r3 <= e3.length; ++r3) t3[r3 + 10] = e3.charCodeAt(r3);
    }
  })(n2, i2), nn(n2, o2 - 8, e2.d()), nn(n2, o2 - 4, r2), n2;
}
var an = function(t2) {
  var i2, e2, r2, s2, n2 = "";
  for (i2 = e2 = 0, r2 = (t2 = (t2 + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")).length, s2 = 0; s2 < r2; s2++) {
    var o2 = t2.charCodeAt(s2), a2 = null;
    o2 < 128 ? e2++ : a2 = o2 > 127 && o2 < 2048 ? String.fromCharCode(o2 >> 6 | 192, 63 & o2 | 128) : String.fromCharCode(o2 >> 12 | 224, o2 >> 6 & 63 | 128, 63 & o2 | 128), j(a2) || (e2 > i2 && (n2 += t2.substring(i2, e2)), n2 += a2, i2 = e2 = s2 + 1);
  }
  return e2 > i2 && (n2 += t2.substring(i2, t2.length)), n2;
};
var ln = !!u || !!l;
var un = "text/plain";
var hn = function(t2, i2, e2) {
  var r2;
  void 0 === e2 && (e2 = true);
  var [s2, n2] = t2.split("?"), o2 = _({}, i2), a2 = null !== (r2 = null == n2 ? void 0 : n2.split("&").map(((t3) => {
    var i3, [r3, s3] = t3.split("="), n3 = e2 && null !== (i3 = o2[r3]) && void 0 !== i3 ? i3 : s3;
    return delete o2[r3], r3 + "=" + n3;
  }))) && void 0 !== r2 ? r2 : [], l2 = sr(o2);
  return l2 && a2.push(l2), s2 + "?" + a2.join("&");
};
var dn = (t2, i2) => JSON.stringify(t2, ((t3, i3) => "bigint" == typeof i3 ? i3.toString() : i3), i2);
var vn = (t2) => {
  var { data: i2, compression: e2 } = t2;
  if (i2) {
    if (e2 === Ss.GZipJS) {
      var r2 = on((function(t3, i3) {
        var e3 = t3.length;
        if ("undefined" != typeof TextEncoder) return new TextEncoder().encode(t3);
        for (var r3 = new ks(t3.length + (t3.length >>> 1)), s3 = 0, n3 = function(t4) {
          r3[s3++] = t4;
        }, o3 = 0; o3 < e3; ++o3) {
          if (s3 + 5 > r3.length) {
            var a3 = new ks(s3 + 8 + (e3 - o3 << 1));
            a3.set(r3), r3 = a3;
          }
          var l2 = t3.charCodeAt(o3);
          l2 < 128 || i3 ? n3(l2) : l2 < 2048 ? (n3(192 | l2 >>> 6), n3(128 | 63 & l2)) : l2 > 55295 && l2 < 57344 ? (n3(240 | (l2 = 65536 + (1047552 & l2) | 1023 & t3.charCodeAt(++o3)) >>> 18), n3(128 | l2 >>> 12 & 63), n3(128 | l2 >>> 6 & 63), n3(128 | 63 & l2)) : (n3(224 | l2 >>> 12), n3(128 | l2 >>> 6 & 63), n3(128 | 63 & l2));
        }
        return Gs(r3, 0, s3);
      })(dn(i2)), { mtime: 0 }), s2 = new Blob([r2], { type: un });
      return { contentType: un, body: s2, estimatedSize: s2.size };
    }
    if (e2 === Ss.Base64) {
      var n2 = (function(t3) {
        var i3, e3, r3, s3, n3, o3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", a3 = 0, l2 = 0, u2 = "", h2 = [];
        if (!t3) return t3;
        t3 = an(t3);
        do {
          i3 = (n3 = t3.charCodeAt(a3++) << 16 | t3.charCodeAt(a3++) << 8 | t3.charCodeAt(a3++)) >> 18 & 63, e3 = n3 >> 12 & 63, r3 = n3 >> 6 & 63, s3 = 63 & n3, h2[l2++] = o3.charAt(i3) + o3.charAt(e3) + o3.charAt(r3) + o3.charAt(s3);
        } while (a3 < t3.length);
        switch (u2 = h2.join(""), t3.length % 3) {
          case 1:
            u2 = u2.slice(0, -2) + "==";
            break;
          case 2:
            u2 = u2.slice(0, -1) + "=";
        }
        return u2;
      })(dn(i2)), o2 = ((t3) => "data=" + encodeURIComponent("string" == typeof t3 ? t3 : dn(t3)))(n2);
      return { contentType: "application/x-www-form-urlencoded", body: o2, estimatedSize: new Blob([o2]).size };
    }
    var a2 = dn(i2);
    return { contentType: "application/json", body: a2, estimatedSize: new Blob([a2]).size };
  }
};
var cn = [];
l && cn.push({ transport: "fetch", method: (t2) => {
  var i2, e2, { contentType: r2, body: s2, estimatedSize: n2 } = null !== (i2 = vn(t2)) && void 0 !== i2 ? i2 : {}, o2 = new Headers();
  Ci(t2.headers, (function(t3, i3) {
    o2.append(i3, t3);
  })), r2 && o2.append("Content-Type", r2);
  var a2 = t2.url, u2 = null;
  if (h) {
    var d2 = new h();
    u2 = { signal: d2.signal, timeout: setTimeout((() => d2.abort()), t2.timeout) };
  }
  l(a2, _({ method: (null == t2 ? void 0 : t2.method) || "GET", headers: o2, keepalive: "POST" === t2.method && (n2 || 0) < 52428.8, body: s2, signal: null == (e2 = u2) ? void 0 : e2.signal }, t2.fetchOptions)).then(((i3) => i3.text().then(((e3) => {
    var r3 = { statusCode: i3.status, text: e3 };
    if (200 === i3.status) try {
      r3.json = JSON.parse(e3);
    } catch (t3) {
      Ei.error(t3);
    }
    null == t2.callback || t2.callback(r3);
  })))).catch(((i3) => {
    Ei.error(i3), null == t2.callback || t2.callback({ statusCode: 0, error: i3 });
  })).finally((() => u2 ? clearTimeout(u2.timeout) : null));
} }), u && cn.push({ transport: "XHR", method: (t2) => {
  var i2, e2 = new u();
  e2.open(t2.method || "GET", t2.url, true);
  var { contentType: r2, body: s2 } = null !== (i2 = vn(t2)) && void 0 !== i2 ? i2 : {};
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
} }), null != n && n.sendBeacon && cn.push({ transport: "sendBeacon", method: (t2) => {
  var i2 = hn(t2.url, { beacon: "1" });
  try {
    var e2, { contentType: r2, body: s2 } = null !== (e2 = vn(t2)) && void 0 !== e2 ? e2 : {}, o2 = "string" == typeof s2 ? new Blob([s2], { type: r2 }) : s2;
    n.sendBeacon(i2, o2);
  } catch (t3) {
  }
} });
var fn = function(t2, i2) {
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
function pn(t2, i2, e2) {
  return dn({ distinct_id: t2, userPropertiesToSet: i2, userPropertiesToSetOnce: e2 });
}
var _n = { exact: (t2, i2) => i2.some(((i3) => t2.some(((t3) => i3 === t3)))), is_not: (t2, i2) => i2.every(((i3) => t2.every(((t3) => i3 !== t3)))), regex: (t2, i2) => i2.some(((i3) => t2.some(((t3) => fn(i3, t3))))), not_regex: (t2, i2) => i2.every(((i3) => t2.every(((t3) => !fn(i3, t3))))), icontains: (t2, i2) => i2.map(gn).some(((i3) => t2.map(gn).some(((t3) => i3.includes(t3))))), not_icontains: (t2, i2) => i2.map(gn).every(((i3) => t2.map(gn).every(((t3) => !i3.includes(t3))))), gt: (t2, i2) => i2.some(((i3) => {
  var e2 = parseFloat(i3);
  return !isNaN(e2) && t2.some(((t3) => e2 > parseFloat(t3)));
})), lt: (t2, i2) => i2.some(((i3) => {
  var e2 = parseFloat(i3);
  return !isNaN(e2) && t2.some(((t3) => e2 < parseFloat(t3)));
})) };
var gn = (t2) => t2.toLowerCase();
function mn(t2, i2) {
  return !t2 || Object.entries(t2).every(((t3) => {
    var [e2, r2] = t3, s2 = null == i2 ? void 0 : i2[e2];
    if (O(s2) || j(s2)) return false;
    var n2 = [String(s2)], o2 = _n[r2.operator];
    return !!o2 && o2(r2.values, n2);
  }));
}
var bn = Si("[Error tracking]");
var yn = class {
  constructor(t2) {
    var i2, e2;
    this.Zt = [], this.ti = new Qt([new vi(), new xi(), new fi(), new ci(), new yi(), new bi(), new _i(), new wi()], di()), this._instance = t2, this.Zt = null !== (i2 = null == (e2 = this._instance.persistence) ? void 0 : e2.get_property(Ji)) && void 0 !== i2 ? i2 : [];
  }
  onRemoteConfig(t2) {
    var i2, e2, r2;
    if ("errorTracking" in t2) {
      var s2 = null !== (i2 = null == (e2 = t2.errorTracking) ? void 0 : e2.suppressionRules) && void 0 !== i2 ? i2 : [], n2 = null == (r2 = t2.errorTracking) ? void 0 : r2.captureExtensionExceptions;
      this.Zt = s2, this._instance.persistence && this._instance.persistence.register({ [Ji]: this.Zt, [Ki]: n2 });
    }
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
      if (this.ri(i2)) return void bn.info("Skipping exception capture because a suppression rule matched");
      if (!this.ii && this.si(i2)) return void bn.info("Skipping exception capture because it was thrown by an extension");
      if (!this._instance.config.error_tracking.__capturePostHogExceptions && this.ni(i2)) return void bn.info("Skipping exception capture because it was thrown by the PostHog SDK");
    }
    return this._instance.capture("$exception", t2, { _noTruncate: true, _batchKey: "exceptionEvent", oi: true });
  }
  ri(t2) {
    if (0 === t2.length) return false;
    var i2 = t2.reduce(((t3, i3) => {
      var { type: e2, value: r2 } = i3;
      return M(e2) && e2.length > 0 && t3.$exception_types.push(e2), M(r2) && r2.length > 0 && t3.$exception_values.push(r2), t3;
    }), { $exception_types: [], $exception_values: [] });
    return this.Zt.some(((t3) => {
      var e2 = t3.values.map(((t4) => {
        var e3, r2 = _n[t4.operator], s2 = I(t4.value) ? t4.value : [t4.value], n2 = null !== (e3 = i2[t4.key]) && void 0 !== e3 ? e3 : [];
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
    return !D(t2) && I(t2);
  }
};
var wn = Si("[FeatureFlags]");
var xn = Si("[FeatureFlags]", { debugEnabled: true });
var $n = "errors_while_computing_flags";
var En = "flag_missing";
var Sn = "quota_limited";
var kn = "timeout";
var Pn = "connection_error";
var Tn = "unknown_error";
var In = (t2) => "api_error_" + t2;
var Cn = "$active_feature_flags";
var Rn = "$override_feature_flags";
var Fn = "$feature_flag_payloads";
var On = "$override_feature_flag_payloads";
var Mn = "$feature_flag_request_id";
var An = "$feature_flag_evaluated_at";
var jn = (t2) => {
  var i2 = {};
  for (var [e2, r2] of Oi(t2 || {})) r2 && (i2[e2] = r2);
  return i2;
};
var Dn = (t2) => {
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
  })))) : wn.warn("Using an older version of the feature flags endpoint. Please upgrade your PostHog server to the latest version"), t2;
};
var Ln = (function(t2) {
  return t2.FeatureFlags = "feature_flags", t2.Recordings = "recordings", t2;
})({});
var Nn = class {
  constructor(t2) {
    this.ai = false, this.li = false, this.ui = false, this.hi = false, this.di = false, this.vi = false, this.ci = false, this._instance = t2, this.featureFlagEventHandlers = [];
  }
  fi() {
    var t2, i2 = null !== (t2 = this._instance.config.evaluation_contexts) && void 0 !== t2 ? t2 : this._instance.config.evaluation_environments;
    return !this._instance.config.evaluation_environments || this._instance.config.evaluation_contexts || this.ci || (wn.warn("evaluation_environments is deprecated. Use evaluation_contexts instead. evaluation_environments will be removed in a future version."), this.ci = true), null != i2 && i2.length ? i2.filter(((t3) => {
      var i3 = t3 && "string" == typeof t3 && t3.trim().length > 0;
      return i3 || wn.error("Invalid evaluation context found:", t3, "Expected non-empty string"), i3;
    })) : [];
  }
  pi() {
    return this.fi().length > 0;
  }
  get hasLoadedFlags() {
    return this.li;
  }
  getFlags() {
    return Object.keys(this.getFlagVariants());
  }
  getFlagsWithDetails() {
    var t2 = this._instance.get_property(ne), i2 = this._instance.get_property(Rn), e2 = this._instance.get_property(On);
    if (!e2 && !i2) return t2 || {};
    var r2 = Ri({}, t2 || {}), s2 = [.../* @__PURE__ */ new Set([...Object.keys(e2 || {}), ...Object.keys(i2 || {})])];
    for (var n2 of s2) {
      var o2, a2, l2 = r2[n2], u2 = null == i2 ? void 0 : i2[n2], h2 = O(u2) ? null !== (o2 = null == l2 ? void 0 : l2.enabled) && void 0 !== o2 && o2 : !!u2, d2 = O(u2) ? l2.variant : "string" == typeof u2 ? u2 : void 0, v2 = null == e2 ? void 0 : e2[n2], c2 = _({}, l2, { enabled: h2, variant: h2 ? null != d2 ? d2 : null == l2 ? void 0 : l2.variant : void 0 });
      if (h2 !== (null == l2 ? void 0 : l2.enabled) && (c2.original_enabled = null == l2 ? void 0 : l2.enabled), d2 !== (null == l2 ? void 0 : l2.variant) && (c2.original_variant = null == l2 ? void 0 : l2.variant), v2) c2.metadata = _({}, null == l2 ? void 0 : l2.metadata, { payload: v2, original_payload: null == l2 || null == (a2 = l2.metadata) ? void 0 : a2.payload });
      r2[n2] = c2;
    }
    return this.ai || (wn.warn(" Overriding feature flag details!", { flagDetails: t2, overriddenPayloads: e2, finalDetails: r2 }), this.ai = true), r2;
  }
  getFlagVariants() {
    var t2 = this._instance.get_property(re), i2 = this._instance.get_property(Rn);
    if (!i2) return t2 || {};
    for (var e2 = Ri({}, t2), r2 = Object.keys(i2), s2 = 0; s2 < r2.length; s2++) e2[r2[s2]] = i2[r2[s2]];
    return this.ai || (wn.warn(" Overriding feature flags!", { enabledFlags: t2, overriddenFlags: i2, finalFlags: e2 }), this.ai = true), e2;
  }
  getFlagPayloads() {
    var t2 = this._instance.get_property(Fn), i2 = this._instance.get_property(On);
    if (!i2) return t2 || {};
    for (var e2 = Ri({}, t2 || {}), r2 = Object.keys(i2), s2 = 0; s2 < r2.length; s2++) e2[r2[s2]] = i2[r2[s2]];
    return this.ai || (wn.warn(" Overriding feature flag payloads!", { flagPayloads: t2, overriddenPayloads: i2, finalPayloads: e2 }), this.ai = true), e2;
  }
  reloadFeatureFlags() {
    this.hi || this._instance.config.advanced_disable_feature_flags || this.gi || (this._instance.mi.emit("featureFlagsReloading", true), this.gi = setTimeout((() => {
      this.bi();
    }), 5));
  }
  yi() {
    clearTimeout(this.gi), this.gi = void 0;
  }
  ensureFlagsLoaded() {
    this.li || this.ui || this.gi || this.reloadFeatureFlags();
  }
  setAnonymousDistinctId(t2) {
    this.$anon_distinct_id = t2;
  }
  setReloadingPaused(t2) {
    this.hi = t2;
  }
  bi(t2) {
    var i2;
    if (this.yi(), !this._instance.M()) if (this.ui) this.di = true;
    else {
      var e2 = this._instance.config.token, r2 = this._instance.get_property("$device_id"), s2 = { token: e2, distinct_id: this._instance.get_distinct_id(), groups: this._instance.getGroups(), $anon_distinct_id: this.$anon_distinct_id, person_properties: _({}, (null == (i2 = this._instance.persistence) ? void 0 : i2.get_initial_props()) || {}, this._instance.get_property(oe) || {}), group_properties: this._instance.get_property(ae), timezone: fs() };
      j(r2) || O(r2) || (s2.$device_id = r2), (null != t2 && t2.disableFlags || this._instance.config.advanced_disable_feature_flags) && (s2.disable_flags = true), this.pi() && (s2.evaluation_contexts = this.fi());
      var n2 = this._instance.config.advanced_only_evaluate_survey_feature_flags ? "&only_evaluate_survey_feature_flags=true" : "", o2 = this._instance.requestRouter.endpointFor("flags", "/flags/?v=2" + n2);
      this.ui = true, this._instance._send_request({ method: "POST", url: o2, data: s2, compression: this._instance.config.disable_compression ? void 0 : Ss.Base64, timeout: this._instance.config.feature_flag_request_timeout_ms, callback: (t3) => {
        var i3, e3, r3, n3 = true;
        if (200 === t3.statusCode && (this.di || (this.$anon_distinct_id = void 0), n3 = false), this.ui = false, !s2.disable_flags || this.di) {
          this.vi = !n3;
          var o3 = [];
          t3.error ? t3.error instanceof Error ? o3.push("AbortError" === t3.error.name ? kn : Pn) : o3.push(Tn) : 200 !== t3.statusCode && o3.push(In(t3.statusCode)), null != (i3 = t3.json) && i3.errorsWhileComputingFlags && o3.push($n);
          var a2 = !(null == (e3 = t3.json) || null == (e3 = e3.quotaLimited) || !e3.includes(Ln.FeatureFlags));
          if (a2 && o3.push(Sn), null == (r3 = this._instance.persistence) || r3.register({ [he]: o3 }), a2) wn.warn("You have hit your feature flags quota limit, and will not be able to load feature flags until the quota is reset.  Please visit https://posthog.com/docs/billing/limits-alerts to learn more.");
          else {
            var l2;
            if (!s2.disable_flags) this.receivedFeatureFlags(null !== (l2 = t3.json) && void 0 !== l2 ? l2 : {}, n3);
            this.di && (this.di = false, this.bi());
          }
        }
      } });
    }
  }
  getFeatureFlag(t2, i2) {
    var e2;
    if (void 0 === i2 && (i2 = {}), !i2.fresh || this.vi) {
      if (this.li || this.getFlags() && this.getFlags().length > 0) {
        var r2 = this.getFeatureFlagResult(t2, i2);
        return null !== (e2 = null == r2 ? void 0 : r2.variant) && void 0 !== e2 ? e2 : null == r2 ? void 0 : r2.enabled;
      }
      wn.warn('getFeatureFlag for key "' + t2 + `" failed. Feature flags didn't load in time.`);
    }
  }
  getFeatureFlagDetails(t2) {
    return this.getFlagsWithDetails()[t2];
  }
  getFeatureFlagPayload(t2) {
    var i2 = this.getFeatureFlagResult(t2, { send_event: false });
    return null == i2 ? void 0 : i2.payload;
  }
  getFeatureFlagResult(t2, i2) {
    if (void 0 === i2 && (i2 = {}), !i2.fresh || this.vi) if (this.li || this.getFlags() && this.getFlags().length > 0) {
      var e2 = this.getFlagVariants(), r2 = t2 in e2, s2 = e2[t2], n2 = this.getFlagPayloads()[t2], o2 = String(s2), a2 = this._instance.get_property(Mn) || void 0, l2 = this._instance.get_property(An) || void 0, u2 = this._instance.get_property(ue) || {};
      if ((i2.send_event || !("send_event" in i2)) && (!(t2 in u2) || !u2[t2].includes(o2))) {
        var h2, d2, v2, c2, f2, p2, _2, g2, m2, b2;
        I(u2[t2]) ? u2[t2].push(o2) : u2[t2] = [o2], null == (h2 = this._instance.persistence) || h2.register({ [ue]: u2 });
        var y2 = this.getFeatureFlagDetails(t2), w2 = [...null !== (d2 = this._instance.get_property(he)) && void 0 !== d2 ? d2 : []];
        O(s2) && w2.push(En);
        var x2 = { $feature_flag: t2, $feature_flag_response: s2, $feature_flag_payload: n2 || null, $feature_flag_request_id: a2, $feature_flag_evaluated_at: l2, $feature_flag_bootstrapped_response: (null == (v2 = this._instance.config.bootstrap) || null == (v2 = v2.featureFlags) ? void 0 : v2[t2]) || null, $feature_flag_bootstrapped_payload: (null == (c2 = this._instance.config.bootstrap) || null == (c2 = c2.featureFlagPayloads) ? void 0 : c2[t2]) || null, $used_bootstrap_value: !this.vi };
        O(null == y2 || null == (f2 = y2.metadata) ? void 0 : f2.version) || (x2.$feature_flag_version = y2.metadata.version);
        var E2, S2 = null !== (p2 = null == y2 || null == (_2 = y2.reason) ? void 0 : _2.description) && void 0 !== p2 ? p2 : null == y2 || null == (g2 = y2.reason) ? void 0 : g2.code;
        if (S2 && (x2.$feature_flag_reason = S2), null != y2 && null != (m2 = y2.metadata) && m2.id && (x2.$feature_flag_id = y2.metadata.id), O(null == y2 ? void 0 : y2.original_variant) && O(null == y2 ? void 0 : y2.original_enabled) || (x2.$feature_flag_original_response = O(y2.original_variant) ? y2.original_enabled : y2.original_variant), null != y2 && null != (b2 = y2.metadata) && b2.original_payload) x2.$feature_flag_original_payload = null == y2 || null == (E2 = y2.metadata) ? void 0 : E2.original_payload;
        w2.length && (x2.$feature_flag_error = w2.join(",")), this._instance.capture("$feature_flag_called", x2);
      }
      if (r2) {
        var k2 = n2;
        if (!O(n2)) try {
          k2 = JSON.parse(n2);
        } catch (t3) {
        }
        return { key: t2, enabled: !!s2, variant: "string" == typeof s2 ? s2 : void 0, payload: k2 };
      }
    } else wn.warn('getFeatureFlagResult for key "' + t2 + `" failed. Feature flags didn't load in time.`);
  }
  getRemoteConfigPayload(t2, i2) {
    var e2 = this._instance.config.token, r2 = { distinct_id: this._instance.get_distinct_id(), token: e2 };
    this.pi() && (r2.evaluation_contexts = this.fi()), this._instance._send_request({ method: "POST", url: this._instance.requestRouter.endpointFor("flags", "/flags/?v=2"), data: r2, compression: this._instance.config.disable_compression ? void 0 : Ss.Base64, timeout: this._instance.config.feature_flag_request_timeout_ms, callback: (e3) => {
      var r3, s2 = null == (r3 = e3.json) ? void 0 : r3.featureFlagPayloads;
      i2((null == s2 ? void 0 : s2[t2]) || void 0);
    } });
  }
  isFeatureEnabled(t2, i2) {
    if (void 0 === i2 && (i2 = {}), !i2.fresh || this.vi) {
      if (this.li || this.getFlags() && this.getFlags().length > 0) {
        var e2 = this.getFeatureFlag(t2, i2);
        return O(e2) ? void 0 : !!e2;
      }
      wn.warn('isFeatureEnabled for key "' + t2 + `" failed. Feature flags didn't load in time.`);
    }
  }
  addFeatureFlagsHandler(t2) {
    this.featureFlagEventHandlers.push(t2);
  }
  removeFeatureFlagsHandler(t2) {
    this.featureFlagEventHandlers = this.featureFlagEventHandlers.filter(((i2) => i2 !== t2));
  }
  receivedFeatureFlags(t2, i2) {
    if (this._instance.persistence) {
      this.li = true;
      var e2 = this.getFlagVariants(), r2 = this.getFlagPayloads(), s2 = this.getFlagsWithDetails();
      !(function(t3, i3, e3, r3, s3) {
        void 0 === e3 && (e3 = {}), void 0 === r3 && (r3 = {}), void 0 === s3 && (s3 = {});
        var n2 = Dn(t3), o2 = n2.flags, a2 = n2.featureFlags, l2 = n2.featureFlagPayloads;
        if (a2) {
          var u2 = t3.requestId, h2 = t3.evaluatedAt;
          if (I(a2)) {
            wn.warn("v1 of the feature flags endpoint is deprecated. Please use the latest version.");
            var d2 = {};
            if (a2) for (var v2 = 0; v2 < a2.length; v2++) d2[a2[v2]] = true;
            i3 && i3.register({ [Cn]: a2, [re]: d2 });
          } else {
            var c2 = a2, f2 = l2, p2 = o2;
            if (t3.errorsWhileComputingFlags) if (o2) {
              var g2 = new Set(Object.keys(o2).filter(((t4) => {
                var i4;
                return !(null != (i4 = o2[t4]) && i4.failed);
              })));
              c2 = _({}, e3, Object.fromEntries(Object.entries(c2).filter(((t4) => {
                var [i4] = t4;
                return g2.has(i4);
              })))), f2 = _({}, r3, Object.fromEntries(Object.entries(f2 || {}).filter(((t4) => {
                var [i4] = t4;
                return g2.has(i4);
              })))), p2 = _({}, s3, Object.fromEntries(Object.entries(p2 || {}).filter(((t4) => {
                var [i4] = t4;
                return g2.has(i4);
              }))));
            } else c2 = _({}, e3, c2), f2 = _({}, r3, f2), p2 = _({}, s3, p2);
            i3 && i3.register(_({ [Cn]: Object.keys(jn(c2)), [re]: c2 || {}, [Fn]: f2 || {}, [ne]: p2 || {} }, u2 ? { [Mn]: u2 } : {}, h2 ? { [An]: h2 } : {}));
          }
        }
      })(t2, this._instance.persistence, e2, r2, s2), this.wi(i2);
    }
  }
  override(t2, i2) {
    void 0 === i2 && (i2 = false), wn.warn("override is deprecated. Please use overrideFeatureFlags instead."), this.overrideFeatureFlags({ flags: t2, suppressWarning: i2 });
  }
  overrideFeatureFlags(t2) {
    if (!this._instance.__loaded || !this._instance.persistence) return wn.uninitializedWarning("posthog.featureFlags.overrideFeatureFlags");
    if (false === t2) return this._instance.persistence.unregister(Rn), this._instance.persistence.unregister(On), this.wi(), xn.info("All overrides cleared");
    if (t2 && "object" == typeof t2 && ("flags" in t2 || "payloads" in t2)) {
      var i2, e2 = t2;
      if (this.ai = Boolean(null !== (i2 = e2.suppressWarning) && void 0 !== i2 && i2), "flags" in e2) {
        if (false === e2.flags) this._instance.persistence.unregister(Rn), xn.info("Flag overrides cleared");
        else if (e2.flags) {
          if (I(e2.flags)) {
            for (var r2 = {}, s2 = 0; s2 < e2.flags.length; s2++) r2[e2.flags[s2]] = true;
            this._instance.persistence.register({ [Rn]: r2 });
          } else this._instance.persistence.register({ [Rn]: e2.flags });
          xn.info("Flag overrides set", { flags: e2.flags });
        }
      }
      return "payloads" in e2 && (false === e2.payloads ? (this._instance.persistence.unregister(On), xn.info("Payload overrides cleared")) : e2.payloads && (this._instance.persistence.register({ [On]: e2.payloads }), xn.info("Payload overrides set", { payloads: e2.payloads }))), void this.wi();
    }
    this.wi();
  }
  onFeatureFlags(t2) {
    if (this.addFeatureFlagsHandler(t2), this.li) {
      var { flags: i2, flagVariants: e2 } = this.xi();
      t2(i2, e2);
    }
    return () => this.removeFeatureFlagsHandler(t2);
  }
  updateEarlyAccessFeatureEnrollment(t2, i2, e2) {
    var r2, s2 = (this._instance.get_property(se) || []).find(((i3) => i3.flagKey === t2)), n2 = { ["$feature_enrollment/" + t2]: i2 }, o2 = { $feature_flag: t2, $feature_enrollment: i2, $set: n2 };
    s2 && (o2.$early_access_feature_name = s2.name), e2 && (o2.$feature_enrollment_stage = e2), this._instance.capture("$feature_enrollment_update", o2), this.setPersonPropertiesForFlags(n2, false);
    var a2 = _({}, this.getFlagVariants(), { [t2]: i2 });
    null == (r2 = this._instance.persistence) || r2.register({ [Cn]: Object.keys(jn(a2)), [re]: a2 }), this.wi();
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
    this._instance.register({ [oe]: _({}, e2, t2) }), i2 && this._instance.reloadFeatureFlags();
  }
  resetPersonPropertiesForFlags() {
    this._instance.unregister(oe);
  }
  setGroupPropertiesForFlags(t2, i2) {
    void 0 === i2 && (i2 = true);
    var e2 = this._instance.get_property(ae) || {};
    0 !== Object.keys(e2).length && Object.keys(e2).forEach(((i3) => {
      e2[i3] = _({}, e2[i3], t2[i3]), delete t2[i3];
    })), this._instance.register({ [ae]: _({}, e2, t2) }), i2 && this._instance.reloadFeatureFlags();
  }
  resetGroupPropertiesForFlags(t2) {
    if (t2) {
      var i2 = this._instance.get_property(ae) || {};
      this._instance.register({ [ae]: _({}, i2, { [t2]: {} }) });
    } else this._instance.unregister(ae);
  }
  reset() {
    this.li = false, this.ui = false, this.hi = false, this.di = false, this.vi = false, this.$anon_distinct_id = void 0, this.yi(), this.ai = false;
  }
};
var Un = ["cookie", "localstorage", "localstorage+cookie", "sessionstorage", "memory"];
var zn = class {
  constructor(t2, i2) {
    this.R = t2, this.props = {}, this.$i = false, this.Ei = ((t3) => {
      var i3 = "";
      return t3.token && (i3 = t3.token.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")), t3.persistence_name ? "ph_" + t3.persistence_name : "ph_" + i3 + "_posthog";
    })(t2), this.Y = this.Si(t2), this.load(), t2.debug && Ei.info("Persistence loaded", t2.persistence, _({}, this.props)), this.update_config(t2, t2, i2), this.save();
  }
  isDisabled() {
    return !!this.ki;
  }
  Si(i2) {
    -1 === Un.indexOf(i2.persistence.toLowerCase()) && (Ei.critical("Unknown persistence type " + i2.persistence + "; falling back to localStorage+cookie"), i2.persistence = "localStorage+cookie");
    var e2 = (function(i3) {
      void 0 === i3 && (i3 = []);
      var e3 = [...Ir, ...i3];
      return _({}, Tr, { W: function(t2) {
        try {
          var i4 = {};
          try {
            i4 = kr.W(t2) || {};
          } catch (t3) {
          }
          var e4 = Ri(i4, JSON.parse(Tr.q(t2) || "{}"));
          return Tr.G(t2, e4), e4;
        } catch (t3) {
        }
        return null;
      }, G: function(t2, i4, r3, s2, n2, o2) {
        try {
          Tr.G(t2, i4, void 0, void 0, o2);
          var a2 = {};
          e3.forEach(((t3) => {
            i4[t3] && (a2[t3] = i4[t3]);
          })), Object.keys(a2).length && kr.G(t2, a2, r3, s2, n2, o2);
        } catch (t3) {
          Tr.B(t3);
        }
      }, V: function(i4, e4) {
        try {
          null == t || t.localStorage.removeItem(i4), kr.V(i4, e4);
        } catch (t2) {
          Tr.B(t2);
        }
      } });
    })(i2.cookie_persisted_properties || []), r2 = i2.persistence.toLowerCase();
    return "localstorage" === r2 && Tr.H() ? Tr : "localstorage+cookie" === r2 && e2.H() ? e2 : "sessionstorage" === r2 && Or.H() ? Or : "memory" === r2 ? Rr : "cookie" === r2 ? kr : e2.H() ? e2 : kr;
  }
  properties() {
    var t2 = {};
    return Ci(this.props, (function(i2, e2) {
      if (e2 === re && R(i2)) for (var r2 = Object.keys(i2), n2 = 0; n2 < r2.length; n2++) t2["$feature/" + r2[n2]] = i2[r2[n2]];
      else a2 = e2, l2 = false, (j(o2 = ye) ? l2 : s && o2.indexOf === s ? -1 != o2.indexOf(a2) : (Ci(o2, (function(t3) {
        if (l2 || (l2 = t3 === a2)) return Ti;
      })), l2)) || (t2[e2] = i2);
      var o2, a2, l2;
    })), t2;
  }
  load() {
    if (!this.ki) {
      var t2 = this.Y.W(this.Ei);
      t2 && (this.props = Ri({}, t2));
    }
  }
  save() {
    this.ki || this.Y.G(this.Ei, this.props, this.Pi, this.Ti, this.Ii, this.R.debug);
  }
  remove() {
    this.Y.V(this.Ei, false), this.Y.V(this.Ei, true);
  }
  clear() {
    this.remove(), this.props = {};
  }
  register_once(t2, i2, e2) {
    if (R(t2)) {
      O(i2) && (i2 = "None"), this.Pi = O(e2) ? this.Ci : e2;
      var r2 = false;
      if (Ci(t2, ((t3, e3) => {
        this.props.hasOwnProperty(e3) && this.props[e3] !== i2 || (this.props[e3] = t3, r2 = true);
      })), r2) return this.save(), true;
    }
    return false;
  }
  register(t2, i2) {
    if (R(t2)) {
      this.Pi = O(i2) ? this.Ci : i2;
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
    if (!this.$i) {
      var t2 = as(this.R.custom_campaign_params, this.R.mask_personal_data_properties, this.R.custom_personal_data_properties);
      F(ji(t2)) || this.register(t2), this.$i = true;
    }
  }
  update_search_keyword() {
    var t2;
    this.register((t2 = null == o ? void 0 : o.referrer) ? us(t2) : {});
  }
  update_referrer_info() {
    var t2;
    this.register_once({ $referrer: ds(), $referring_domain: null != o && o.referrer && (null == (t2 = rr(o.referrer)) ? void 0 : t2.host) || "$direct" }, void 0);
  }
  set_initial_person_info() {
    this.props[fe] || this.props[pe] || this.register_once({ [_e]: vs(this.R.mask_personal_data_properties, this.R.custom_personal_data_properties) }, void 0);
  }
  get_initial_props() {
    var t2 = {};
    Ci([pe, fe], ((i3) => {
      var e3 = this.props[i3];
      e3 && Ci(e3, (function(i4, e4) {
        t2["$initial_" + E(e4)] = i4;
      }));
    }));
    var i2, e2, r2 = this.props[_e];
    if (r2) {
      var s2 = (i2 = cs(r2), e2 = {}, Ci(i2, (function(t3, i3) {
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
    return O(i2) || (delete this.props[qi][t2], this.save()), i2;
  }
  get_property(t2) {
    return this.props[t2];
  }
  set_property(t2, i2) {
    this.props[t2] = i2, this.save();
  }
};
var Hn = Si("[Product Tours]");
var Bn = "ph_product_tours";
var qn = class {
  constructor(t2) {
    this.Ri = null, this.Fi = null, this._instance = t2;
  }
  onRemoteConfig(t2) {
    "productTours" in t2 && (this._instance.persistence && this._instance.persistence.register({ [Qi]: !!t2.productTours }), this.loadIfEnabled());
  }
  loadIfEnabled() {
    var t2, i2;
    this.Ri || ((t2 = this._instance).config.disable_product_tours || null == (i2 = t2.persistence) || !i2.get_property(Qi)) || this.it((() => this.Oi()));
  }
  it(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.generateProductTours ? t2() : null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, "product-tours", ((i3) => {
      i3 ? Hn.error("Could not load product tours script", i3) : t2();
    }));
  }
  Oi() {
    var t2;
    !this.Ri && null != (t2 = v.__PosthogExtensions__) && t2.generateProductTours && (this.Ri = v.__PosthogExtensions__.generateProductTours(this._instance, true));
  }
  getProductTours(t2, i2) {
    if (void 0 === i2 && (i2 = false), !I(this.Fi) || i2) {
      var e2 = this._instance.persistence;
      if (e2) {
        var r2 = e2.props[Bn];
        if (I(r2) && !i2) return this.Fi = r2, void t2(r2, { isLoaded: true });
      }
      this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/product_tours/?token=" + this._instance.config.token), method: "GET", callback: (i3) => {
        var r3 = i3.statusCode;
        if (200 !== r3 || !i3.json) {
          var s2 = "Product Tours API could not be loaded, status: " + r3;
          return Hn.error(s2), void t2([], { isLoaded: false, error: s2 });
        }
        var n2 = I(i3.json.product_tours) ? i3.json.product_tours : [];
        this.Fi = n2, e2 && e2.register({ [Bn]: n2 }), t2(n2, { isLoaded: true });
      } });
    } else t2(this.Fi, { isLoaded: true });
  }
  getActiveProductTours(t2) {
    D(this.Ri) ? t2([], { isLoaded: false, error: "Product tours not loaded" }) : this.Ri.getActiveProductTours(t2);
  }
  showProductTour(t2) {
    var i2;
    null == (i2 = this.Ri) || i2.showTourById(t2);
  }
  previewTour(t2) {
    this.Ri ? this.Ri.previewTour(t2) : this.it((() => {
      var i2;
      this.Oi(), null == (i2 = this.Ri) || i2.previewTour(t2);
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
    this.Fi = null, null == (t2 = this._instance.persistence) || t2.unregister(Bn);
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
var Wn = (function(t2) {
  return t2.Activation = "events", t2.Cancellation = "cancelEvents", t2;
})({});
var Gn = (function(t2) {
  return t2.Button = "button", t2.Tab = "tab", t2.Selector = "selector", t2;
})({});
var Vn = (function(t2) {
  return t2.TopLeft = "top_left", t2.TopRight = "top_right", t2.TopCenter = "top_center", t2.MiddleLeft = "middle_left", t2.MiddleRight = "middle_right", t2.MiddleCenter = "middle_center", t2.Left = "left", t2.Center = "center", t2.Right = "right", t2.NextToTrigger = "next_to_trigger", t2;
})({});
var Jn = (function(t2) {
  return t2.Top = "top", t2.Left = "left", t2.Right = "right", t2.Bottom = "bottom", t2;
})({});
var Kn = (function(t2) {
  return t2.Popover = "popover", t2.API = "api", t2.Widget = "widget", t2.ExternalSurvey = "external_survey", t2;
})({});
var Yn = (function(t2) {
  return t2.Open = "open", t2.MultipleChoice = "multiple_choice", t2.SingleChoice = "single_choice", t2.Rating = "rating", t2.Link = "link", t2;
})({});
var Xn = (function(t2) {
  return t2.NextQuestion = "next_question", t2.End = "end", t2.ResponseBased = "response_based", t2.SpecificQuestion = "specific_question", t2;
})({});
var Qn = (function(t2) {
  return t2.Once = "once", t2.Recurring = "recurring", t2.Always = "always", t2;
})({});
var Zn = (function(t2) {
  return t2.SHOWN = "survey shown", t2.DISMISSED = "survey dismissed", t2.SENT = "survey sent", t2.ABANDONED = "survey abandoned", t2;
})({});
var to = (function(t2) {
  return t2.SURVEY_ID = "$survey_id", t2.SURVEY_NAME = "$survey_name", t2.SURVEY_RESPONSE = "$survey_response", t2.SURVEY_ITERATION = "$survey_iteration", t2.SURVEY_ITERATION_START_DATE = "$survey_iteration_start_date", t2.SURVEY_PARTIALLY_COMPLETED = "$survey_partially_completed", t2.SURVEY_SUBMISSION_ID = "$survey_submission_id", t2.SURVEY_QUESTIONS = "$survey_questions", t2.SURVEY_COMPLETED = "$survey_completed", t2.PRODUCT_TOUR_ID = "$product_tour_id", t2.SURVEY_LAST_SEEN_DATE = "$survey_last_seen_date", t2;
})({});
var io = (function(t2) {
  return t2.Popover = "popover", t2.Inline = "inline", t2;
})({});
var eo = Si("[Surveys]");
var ro = "seenSurvey_";
var so = (t2, i2) => {
  var e2 = "$survey_" + i2 + "/" + t2.id;
  return t2.current_iteration && t2.current_iteration > 0 && (e2 = "$survey_" + i2 + "/" + t2.id + "/" + t2.current_iteration), e2;
};
var no = (t2) => ((t3, i2) => {
  var e2 = "" + t3 + i2.id;
  return i2.current_iteration && i2.current_iteration > 0 && (e2 = "" + t3 + i2.id + "_" + i2.current_iteration), e2;
})(ro, t2);
var oo = [Kn.Popover, Kn.Widget, Kn.API];
var ao = { ignoreConditions: false, ignoreDelay: false, displayType: io.Popover };
var lo = class {
  constructor() {
    this.Mi = {}, this.Mi = {};
  }
  on(t2, i2) {
    return this.Mi[t2] || (this.Mi[t2] = []), this.Mi[t2].push(i2), () => {
      this.Mi[t2] = this.Mi[t2].filter(((t3) => t3 !== i2));
    };
  }
  emit(t2, i2) {
    for (var e2 of this.Mi[t2] || []) e2(i2);
    for (var r2 of this.Mi["*"] || []) r2(t2, i2);
  }
};
function uo(t2, i2, e2) {
  if (D(t2)) return false;
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
var ho = class {
  constructor(t2) {
    this.Ai = new lo(), this.ji = (t3, i2) => this.Di(t3, i2) && this.Li(t3, i2) && this.Ni(t3, i2) && this.Ui(t3, i2), this.Di = (t3, i2) => null == i2 || !i2.event || (null == t3 ? void 0 : t3.event) === (null == i2 ? void 0 : i2.event), this._instance = t2, this.zi = /* @__PURE__ */ new Set(), this.Hi = /* @__PURE__ */ new Set();
  }
  init() {
    var t2;
    if (!O(null == (t2 = this._instance) ? void 0 : t2._addCaptureHook)) {
      var i2;
      null == (i2 = this._instance) || i2._addCaptureHook(((t3, i3) => {
        this.on(t3, i3);
      }));
    }
  }
  register(t2) {
    var i2, e2;
    if (!O(null == (i2 = this._instance) ? void 0 : i2._addCaptureHook) && (t2.forEach(((t3) => {
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
      this.Bi(i2, t3) && this.Ai.emit("actionCaptured", t3.name);
    }));
  }
  qi(t2) {
    this.onAction("actionCaptured", ((i2) => t2(i2)));
  }
  Bi(t2, i2) {
    if (null == (null == i2 ? void 0 : i2.steps)) return false;
    for (var e2 of i2.steps) if (this.ji(t2, e2)) return true;
    return false;
  }
  onAction(t2, i2) {
    return this.Ai.on(t2, i2);
  }
  Li(t2, i2) {
    if (null != i2 && i2.url) {
      var e2, r2 = null == t2 || null == (e2 = t2.properties) ? void 0 : e2.$current_url;
      if (!r2 || "string" != typeof r2) return false;
      if (!uo(r2, i2.url, i2.url_matching || "contains")) return false;
    }
    return true;
  }
  Ni(t2, i2) {
    return !!this.Wi(t2, i2) && (!!this.Gi(t2, i2) && !!this.Vi(t2, i2));
  }
  Wi(t2, i2) {
    var e2;
    if (null == i2 || !i2.href) return true;
    var r2 = this.Ji(t2);
    if (r2.length > 0) return r2.some(((t3) => uo(t3.href, i2.href, i2.href_matching || "exact")));
    var s2, n2 = (null == t2 || null == (e2 = t2.properties) ? void 0 : e2.$elements_chain) || "";
    return !!n2 && uo((s2 = n2.match(/(?::|")href="(.*?)"/)) ? s2[1] : "", i2.href, i2.href_matching || "exact");
  }
  Gi(t2, i2) {
    var e2;
    if (null == i2 || !i2.text) return true;
    var r2 = this.Ji(t2);
    if (r2.length > 0) return r2.some(((t3) => uo(t3.text, i2.text, i2.text_matching || "exact") || uo(t3.$el_text, i2.text, i2.text_matching || "exact")));
    var s2, n2, o2, a2 = (null == t2 || null == (e2 = t2.properties) ? void 0 : e2.$elements_chain) || "";
    return !!a2 && (s2 = (function(t3) {
      for (var i3, e3 = [], r3 = /(?::|")text="(.*?)"/g; !D(i3 = r3.exec(t3)); ) e3.includes(i3[1]) || e3.push(i3[1]);
      return e3;
    })(a2), n2 = i2.text, o2 = i2.text_matching || "exact", s2.some(((t3) => uo(t3, n2, o2))));
  }
  Vi(t2, i2) {
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
  Ji(t2) {
    var i2;
    return null == (null == t2 || null == (i2 = t2.properties) ? void 0 : i2.$elements) ? [] : null == t2 ? void 0 : t2.properties.$elements;
  }
  Ui(t2, i2) {
    return null == i2 || !i2.properties || 0 === i2.properties.length || mn(i2.properties.reduce(((t3, i3) => {
      var e2 = I(i3.value) ? i3.value.map(String) : null != i3.value ? [String(i3.value)] : [];
      return t3[i3.key] = { values: e2, operator: i3.operator || "exact" }, t3;
    }), {}), null == t2 ? void 0 : t2.properties);
  }
};
var vo = class {
  constructor(t2) {
    this._instance = t2, this.Ki = /* @__PURE__ */ new Map(), this.Yi = /* @__PURE__ */ new Map(), this.Xi = /* @__PURE__ */ new Map();
  }
  Qi(t2, i2) {
    return !!t2 && mn(t2.propertyFilters, null == i2 ? void 0 : i2.properties);
  }
  Zi(t2, i2) {
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
  te(t2, i2, e2) {
    var r2 = (e2 === Wn.Activation ? this.Ki : this.Yi).get(t2), s2 = [];
    return this.ie(((t3) => {
      s2 = t3.filter(((t4) => null == r2 ? void 0 : r2.includes(t4.id)));
    })), s2.filter(((r3) => {
      var s3, n2 = null == (s3 = r3.conditions) || null == (s3 = s3[e2]) || null == (s3 = s3.values) ? void 0 : s3.find(((i3) => i3.name === t2));
      return this.Qi(n2, i2);
    }));
  }
  register(t2) {
    var i2;
    O(null == (i2 = this._instance) ? void 0 : i2._addCaptureHook) || (this.ee(t2), this.re(t2));
  }
  re(t2) {
    var i2 = t2.filter(((t3) => {
      var i3, e2;
      return (null == (i3 = t3.conditions) ? void 0 : i3.actions) && (null == (e2 = t3.conditions) || null == (e2 = e2.actions) || null == (e2 = e2.values) ? void 0 : e2.length) > 0;
    }));
    if (0 !== i2.length) {
      if (null == this.se) {
        this.se = new ho(this._instance), this.se.init();
        this.se.qi(((t3) => {
          this.onAction(t3);
        }));
      }
      i2.forEach(((t3) => {
        var i3, e2, r2, s2, n2;
        t3.conditions && null != (i3 = t3.conditions) && i3.actions && null != (e2 = t3.conditions) && null != (e2 = e2.actions) && e2.values && (null == (r2 = t3.conditions) || null == (r2 = r2.actions) || null == (r2 = r2.values) ? void 0 : r2.length) > 0 && (null == (s2 = this.se) || s2.register(t3.conditions.actions.values), null == (n2 = t3.conditions) || null == (n2 = n2.actions) || null == (n2 = n2.values) || n2.forEach(((i4) => {
          if (i4 && i4.name) {
            var e3 = this.Xi.get(i4.name);
            e3 && e3.push(t3.id), this.Xi.set(i4.name, e3 || [t3.id]);
          }
        })));
      }));
    }
  }
  ee(t2) {
    var i2, e2 = t2.filter(((t3) => {
      var i3, e3;
      return (null == (i3 = t3.conditions) ? void 0 : i3.events) && (null == (e3 = t3.conditions) || null == (e3 = e3.events) || null == (e3 = e3.values) ? void 0 : e3.length) > 0;
    })), r2 = t2.filter(((t3) => {
      var i3, e3;
      return (null == (i3 = t3.conditions) ? void 0 : i3.cancelEvents) && (null == (e3 = t3.conditions) || null == (e3 = e3.cancelEvents) || null == (e3 = e3.values) ? void 0 : e3.length) > 0;
    }));
    if (0 !== e2.length || 0 !== r2.length) {
      null == (i2 = this._instance) || i2._addCaptureHook(((t3, i3) => {
        this.onEvent(t3, i3);
      })), this.Ki = this.Zi(t2, Wn.Activation), this.Yi = this.Zi(t2, Wn.Cancellation);
    }
  }
  onEvent(t2, i2) {
    var e2, r2 = this.ne(), s2 = this.oe(), n2 = this.ae(), o2 = (null == (e2 = this._instance) || null == (e2 = e2.persistence) ? void 0 : e2.props[s2]) || [];
    if (n2 === t2 && i2 && o2.length > 0) {
      var a2, l2;
      r2.info("event matched, removing item from activated items", { event: t2, eventPayload: i2, existingActivatedItems: o2 });
      var u2 = (null == i2 || null == (a2 = i2.properties) ? void 0 : a2.$survey_id) || (null == i2 || null == (l2 = i2.properties) ? void 0 : l2.$product_tour_id);
      if (u2) {
        var h2 = o2.indexOf(u2);
        h2 >= 0 && (o2.splice(h2, 1), this.le(o2));
      }
    } else {
      if (this.Yi.has(t2)) {
        var d2 = this.te(t2, i2, Wn.Cancellation);
        d2.length > 0 && (r2.info("cancel event matched, cancelling items", { event: t2, itemsToCancel: d2.map(((t3) => t3.id)) }), d2.forEach(((t3) => {
          var i3 = o2.indexOf(t3.id);
          i3 >= 0 && o2.splice(i3, 1), this.ue(t3.id);
        })), this.le(o2));
      }
      if (this.Ki.has(t2)) {
        r2.info("event name matched", { event: t2, eventPayload: i2, items: this.Ki.get(t2) });
        var v2 = this.te(t2, i2, Wn.Activation);
        this.le(o2.concat(v2.map(((t3) => t3.id)) || []));
      }
    }
  }
  onAction(t2) {
    var i2, e2 = this.oe(), r2 = (null == (i2 = this._instance) || null == (i2 = i2.persistence) ? void 0 : i2.props[e2]) || [];
    this.Xi.has(t2) && this.le(r2.concat(this.Xi.get(t2) || []));
  }
  le(t2) {
    var i2, e2 = this.ne(), r2 = this.oe(), s2 = [...new Set(t2)].filter(((t3) => !this.he(t3)));
    e2.info("updating activated items", { activatedItems: s2 }), null == (i2 = this._instance) || null == (i2 = i2.persistence) || i2.register({ [r2]: s2 });
  }
  getActivatedIds() {
    var t2, i2 = this.oe(), e2 = null == (t2 = this._instance) || null == (t2 = t2.persistence) ? void 0 : t2.props[i2];
    return e2 || [];
  }
  getEventToItemsMap() {
    return this.Ki;
  }
  de() {
    return this.se;
  }
};
var co = class extends vo {
  constructor(t2) {
    super(t2);
  }
  oe() {
    return "$surveys_activated";
  }
  ae() {
    return Zn.SHOWN;
  }
  ie(t2) {
    var i2;
    null == (i2 = this._instance) || i2.getSurveys(t2);
  }
  ue(t2) {
    var i2;
    null == (i2 = this._instance) || i2.cancelPendingSurvey(t2);
  }
  ne() {
    return eo;
  }
  he() {
    return false;
  }
  getSurveys() {
    return this.getActivatedIds();
  }
  getEventToSurveys() {
    return this.getEventToItemsMap();
  }
};
var fo = class {
  constructor(t2) {
    this.ve = void 0, this._surveyManager = null, this.ce = false, this.fe = [], this.pe = null, this._instance = t2, this._surveyEventReceiver = null;
  }
  onRemoteConfig(t2) {
    if (!this._instance.config.disable_surveys) {
      var i2 = t2.surveys;
      if (D(i2)) return eo.warn("Flags not loaded yet. Not loading surveys.");
      var e2 = I(i2);
      this.ve = e2 ? i2.length > 0 : i2, eo.info("flags response received, isSurveysEnabled: " + this.ve), this.loadIfEnabled();
    }
  }
  reset() {
    localStorage.removeItem("lastSeenSurveyDate");
    for (var t2 = [], i2 = 0; i2 < localStorage.length; i2++) {
      var e2 = localStorage.key(i2);
      (null != e2 && e2.startsWith(ro) || null != e2 && e2.startsWith("inProgressSurvey_")) && t2.push(e2);
    }
    t2.forEach(((t3) => localStorage.removeItem(t3)));
  }
  loadIfEnabled() {
    if (!this._surveyManager) if (this.ce) eo.info("Already initializing surveys, skipping...");
    else if (this._instance.config.disable_surveys) eo.info("Disabled. Not loading surveys.");
    else if (this._instance.config.cookieless_mode && this._instance.consent.isOptedOut()) eo.info("Not loading surveys in cookieless mode without consent.");
    else {
      var t2 = null == v ? void 0 : v.__PosthogExtensions__;
      if (t2) {
        if (!O(this.ve) || this._instance.config.advanced_enable_surveys) {
          var i2 = this.ve || this._instance.config.advanced_enable_surveys;
          this.ce = true;
          try {
            var e2 = t2.generateSurveys;
            if (e2) return void this._e(e2, i2);
            var r2 = t2.loadExternalDependency;
            if (!r2) return void this.ge("PostHog loadExternalDependency extension not found.");
            r2(this._instance, "surveys", ((e3) => {
              e3 || !t2.generateSurveys ? this.ge("Could not load surveys script", e3) : this._e(t2.generateSurveys, i2);
            }));
          } catch (t3) {
            throw this.ge("Error initializing surveys", t3), t3;
          } finally {
            this.ce = false;
          }
        }
      } else eo.error("PostHog Extensions not found.");
    }
  }
  _e(t2, i2) {
    this._surveyManager = t2(this._instance, i2), this._surveyEventReceiver = new co(this._instance), eo.info("Surveys loaded successfully"), this.me({ isLoaded: true });
  }
  ge(t2, i2) {
    eo.error(t2, i2), this.me({ isLoaded: false, error: t2 });
  }
  onSurveysLoaded(t2) {
    return this.fe.push(t2), this._surveyManager && this.me({ isLoaded: true }), () => {
      this.fe = this.fe.filter(((i2) => i2 !== t2));
    };
  }
  getSurveys(t2, i2) {
    if (void 0 === i2 && (i2 = false), this._instance.config.disable_surveys) return eo.info("Disabled. Not loading surveys."), t2([]);
    var e2, r2 = this._instance.get_property(le);
    if (r2 && !i2) return t2(r2, { isLoaded: true });
    "undefined" != typeof Promise && this.pe ? this.pe.then(((i3) => {
      var { surveys: e3, context: r3 } = i3;
      return t2(e3, r3);
    })) : ("undefined" != typeof Promise && (this.pe = new Promise(((t3) => {
      e2 = t3;
    }))), this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/surveys/?token=" + this._instance.config.token), method: "GET", timeout: this._instance.config.surveys_request_timeout_ms, callback: (i3) => {
      var r3;
      this.pe = null;
      var s2 = i3.statusCode;
      if (200 !== s2 || !i3.json) {
        var n2 = "Surveys API could not be loaded, status: " + s2;
        eo.error(n2);
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
      var h2 = { isLoaded: true };
      t2(l2, h2), null == e2 || e2({ surveys: l2, context: h2 });
    } }));
  }
  me(t2) {
    for (var i2 of this.fe) try {
      if (!t2.isLoaded) return i2([], t2);
      this.getSurveys(i2);
    } catch (t3) {
      eo.error("Error in survey callback", t3);
    }
  }
  getActiveMatchingSurveys(t2, i2) {
    if (void 0 === i2 && (i2 = false), !D(this._surveyManager)) return this._surveyManager.getActiveMatchingSurveys(t2, i2);
    eo.warn("init was not called");
  }
  be(t2) {
    var i2 = null;
    return this.getSurveys(((e2) => {
      var r2;
      i2 = null !== (r2 = e2.find(((i3) => i3.id === t2))) && void 0 !== r2 ? r2 : null;
    })), i2;
  }
  ye(t2) {
    if (D(this._surveyManager)) return { eligible: false, reason: "SDK is not enabled or survey functionality is not yet loaded" };
    var i2 = "string" == typeof t2 ? this.be(t2) : t2;
    return i2 ? this._surveyManager.checkSurveyEligibility(i2) : { eligible: false, reason: "Survey not found" };
  }
  canRenderSurvey(t2) {
    if (D(this._surveyManager)) return eo.warn("init was not called"), { visible: false, disabledReason: "SDK is not enabled or survey functionality is not yet loaded" };
    var i2 = this.ye(t2);
    return { visible: i2.eligible, disabledReason: i2.reason };
  }
  canRenderSurveyAsync(t2, i2) {
    return D(this._surveyManager) ? (eo.warn("init was not called"), Promise.resolve({ visible: false, disabledReason: "SDK is not enabled or survey functionality is not yet loaded" })) : new Promise(((e2) => {
      this.getSurveys(((i3) => {
        var r2, s2 = null !== (r2 = i3.find(((i4) => i4.id === t2))) && void 0 !== r2 ? r2 : null;
        if (s2) {
          var n2 = this.ye(s2);
          e2({ visible: n2.eligible, disabledReason: n2.reason });
        } else e2({ visible: false, disabledReason: "Survey not found" });
      }), i2);
    }));
  }
  renderSurvey(t2, i2, e2) {
    var r2;
    if (D(this._surveyManager)) eo.warn("init was not called");
    else {
      var s2 = "string" == typeof t2 ? this.be(t2) : t2;
      if (null != s2 && s2.id) if (oo.includes(s2.type)) {
        var n2 = null == o ? void 0 : o.querySelector(i2);
        if (n2) return null != (r2 = s2.appearance) && r2.surveyPopupDelaySeconds ? (eo.info("Rendering survey " + s2.id + " with delay of " + s2.appearance.surveyPopupDelaySeconds + " seconds"), void setTimeout((() => {
          var t3, i3;
          eo.info("Rendering survey " + s2.id + " with delay of " + (null == (t3 = s2.appearance) ? void 0 : t3.surveyPopupDelaySeconds) + " seconds"), null == (i3 = this._surveyManager) || i3.renderSurvey(s2, n2, e2), eo.info("Survey " + s2.id + " rendered");
        }), 1e3 * s2.appearance.surveyPopupDelaySeconds)) : void this._surveyManager.renderSurvey(s2, n2, e2);
        eo.warn("Survey element not found");
      } else eo.warn("Surveys of type " + s2.type + " cannot be rendered in the app");
      else eo.warn("Survey not found");
    }
  }
  displaySurvey(t2, i2) {
    var e2;
    if (D(this._surveyManager)) eo.warn("init was not called");
    else {
      var r2 = this.be(t2);
      if (r2) {
        var s2 = r2;
        if (null != (e2 = r2.appearance) && e2.surveyPopupDelaySeconds && i2.ignoreDelay && (s2 = _({}, r2, { appearance: _({}, r2.appearance, { surveyPopupDelaySeconds: 0 }) })), i2.displayType !== io.Popover && i2.initialResponses && eo.warn("initialResponses is only supported for popover surveys. prefill will not be applied."), false === i2.ignoreConditions) {
          var n2 = this.canRenderSurvey(r2);
          if (!n2.visible) return void eo.warn("Survey is not eligible to be displayed: ", n2.disabledReason);
        }
        i2.displayType !== io.Inline ? this._surveyManager.handlePopoverSurvey(s2, i2) : this.renderSurvey(s2, i2.selector, i2.properties);
      } else eo.warn("Survey not found");
    }
  }
  cancelPendingSurvey(t2) {
    D(this._surveyManager) ? eo.warn("init was not called") : this._surveyManager.cancelSurvey(t2);
  }
  handlePageUnload() {
    var t2;
    null == (t2 = this._surveyManager) || t2.handlePageUnload();
  }
};
var po = Si("[Conversations]");
var _o = class {
  constructor(t2) {
    this.we = void 0, this._conversationsManager = null, this.xe = false, this.$e = null, this._instance = t2;
  }
  onRemoteConfig(t2) {
    if (!this._instance.config.disable_conversations) {
      var i2 = t2.conversations;
      D(i2) || (U(i2) ? this.we = i2 : (this.we = i2.enabled, this.$e = i2), this.loadIfEnabled());
    }
  }
  reset() {
    var t2;
    null == (t2 = this._conversationsManager) || t2.reset(), this._conversationsManager = null, this.we = void 0, this.$e = null;
  }
  loadIfEnabled() {
    if (!this._conversationsManager && !this.xe && !(this._instance.config.disable_conversations || this._instance.config.cookieless_mode && this._instance.consent.isOptedOut())) {
      var t2 = null == v ? void 0 : v.__PosthogExtensions__;
      if (t2 && !O(this.we) && this.we) if (this.$e && this.$e.token) {
        this.xe = true;
        try {
          var i2 = t2.initConversations;
          if (i2) return this.Ee(i2), void (this.xe = false);
          var e2 = t2.loadExternalDependency;
          if (!e2) return void this.Se("PostHog loadExternalDependency extension not found.");
          e2(this._instance, "conversations", ((i3) => {
            i3 || !t2.initConversations ? this.Se("Could not load conversations script", i3) : this.Ee(t2.initConversations), this.xe = false;
          }));
        } catch (t3) {
          this.Se("Error initializing conversations", t3), this.xe = false;
        }
      } else po.error("Conversations enabled but missing token in remote config.");
    }
  }
  Ee(t2) {
    if (this.$e) try {
      this._conversationsManager = t2(this.$e, this._instance), po.info("Conversations loaded successfully");
    } catch (t3) {
      this.Se("Error completing conversations initialization", t3);
    }
    else po.error("Cannot complete initialization: remote config is null");
  }
  Se(t2, i2) {
    po.error(t2, i2), this._conversationsManager = null, this.xe = false;
  }
  show() {
    this._conversationsManager ? this._conversationsManager.show() : po.warn("Conversations not loaded yet.");
  }
  hide() {
    this._conversationsManager && this._conversationsManager.hide();
  }
  isAvailable() {
    return true === this.we && !j(this._conversationsManager);
  }
  isVisible() {
    var t2, i2;
    return null !== (t2 = null == (i2 = this._conversationsManager) ? void 0 : i2.isVisible()) && void 0 !== t2 && t2;
  }
  sendMessage(t2, i2, e2) {
    var r2 = this;
    return p((function* () {
      return r2._conversationsManager ? r2._conversationsManager.sendMessage(t2, i2, e2) : (po.warn("Conversations not available yet."), null);
    }))();
  }
  getMessages(t2, i2) {
    var e2 = this;
    return p((function* () {
      return e2._conversationsManager ? e2._conversationsManager.getMessages(t2, i2) : (po.warn("Conversations not available yet."), null);
    }))();
  }
  markAsRead(t2) {
    var i2 = this;
    return p((function* () {
      return i2._conversationsManager ? i2._conversationsManager.markAsRead(t2) : (po.warn("Conversations not available yet."), null);
    }))();
  }
  getTickets(t2) {
    var i2 = this;
    return p((function* () {
      return i2._conversationsManager ? i2._conversationsManager.getTickets(t2) : (po.warn("Conversations not available yet."), null);
    }))();
  }
  requestRestoreLink(t2) {
    var i2 = this;
    return p((function* () {
      return i2._conversationsManager ? i2._conversationsManager.requestRestoreLink(t2) : (po.warn("Conversations not available yet."), null);
    }))();
  }
  restoreFromToken(t2) {
    var i2 = this;
    return p((function* () {
      return i2._conversationsManager ? i2._conversationsManager.restoreFromToken(t2) : (po.warn("Conversations not available yet."), null);
    }))();
  }
  restoreFromUrlToken() {
    var t2 = this;
    return p((function* () {
      return t2._conversationsManager ? t2._conversationsManager.restoreFromUrlToken() : (po.warn("Conversations not available yet."), null);
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
var go = class {
  constructor(t2) {
    var i2;
    this.ke = false, this.Pe = false, this._instance = t2, this._instance && null != (i2 = this._instance.config.logs) && i2.captureConsoleLogs && (this.ke = true);
  }
  onRemoteConfig(t2) {
    var i2, e2 = null == (i2 = t2.logs) ? void 0 : i2.captureConsoleLogs;
    !D(e2) && e2 && (this.ke = true, this.loadIfEnabled());
  }
  reset() {
  }
  loadIfEnabled() {
    if (this.ke && !this.Pe) {
      var t2 = Si("[logs]"), i2 = null == v ? void 0 : v.__PosthogExtensions__;
      if (i2) {
        var e2 = i2.loadExternalDependency;
        e2 ? e2(this._instance, "logs", ((e3) => {
          var r2;
          e3 || null == (r2 = i2.logs) || !r2.initializeLogs ? t2.error("Could not load logs script", e3) : (i2.logs.initializeLogs(this._instance), this.Pe = true);
        })) : t2.error("PostHog loadExternalDependency extension not found.");
      } else t2.error("PostHog Extensions not found.");
    }
  }
};
var mo = Si("[RateLimiter]");
var bo = class {
  constructor(t2) {
    this.serverLimits = {}, this.lastEventRateLimited = false, this.checkForLimiting = (t3) => {
      var i2 = t3.text;
      if (i2 && i2.length) try {
        (JSON.parse(i2).quota_limited || []).forEach(((t4) => {
          mo.info((t4 || "events") + " is quota limited."), this.serverLimits[t4] = (/* @__PURE__ */ new Date()).getTime() + 6e4;
        }));
      } catch (t4) {
        return void mo.warn('could not rate limit - continuing. Error: "' + (null == t4 ? void 0 : t4.message) + '"', { text: i2 });
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
    var { captureEventsBurstLimit: s2, captureEventsPerSecond: n2 } = this, o2 = (/* @__PURE__ */ new Date()).getTime(), a2 = null !== (i2 = null == (e2 = this.instance.persistence) ? void 0 : e2.get_property(ce)) && void 0 !== i2 ? i2 : { tokens: s2, last: o2 };
    a2.tokens += (o2 - a2.last) / 1e3 * n2, a2.last = o2, a2.tokens > s2 && (a2.tokens = s2);
    var l2 = a2.tokens < 1;
    return l2 || t2 || (a2.tokens = Math.max(0, a2.tokens - 1)), !l2 || this.lastEventRateLimited || t2 || this.instance.capture("$$client_ingestion_warning", { $$client_ingestion_warning_message: "posthog-js client rate limited. Config is set to " + n2 + " events per second and " + s2 + " events burst limit." }, { skip_client_rate_limiting: true }), this.lastEventRateLimited = l2, null == (r2 = this.instance.persistence) || r2.set_property(ce, a2), { isRateLimited: l2, remainingTokens: a2.tokens };
  }
  isServerRateLimited(t2) {
    var i2 = this.serverLimits[t2 || "events"] || false;
    return false !== i2 && (/* @__PURE__ */ new Date()).getTime() < i2;
  }
};
var yo = Si("[RemoteConfig]");
var wo = class {
  constructor(t2) {
    this._instance = t2;
  }
  get remoteConfig() {
    var t2;
    return null == (t2 = v._POSTHOG_REMOTE_CONFIG) || null == (t2 = t2[this._instance.config.token]) ? void 0 : t2.config;
  }
  Te(t2) {
    var i2, e2;
    null != (i2 = v.__PosthogExtensions__) && i2.loadExternalDependency ? null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, "remote-config", (() => t2(this.remoteConfig))) : t2();
  }
  Ie(t2) {
    this._instance._send_request({ method: "GET", url: this._instance.requestRouter.endpointFor("assets", "/array/" + this._instance.config.token + "/config"), callback: (i2) => {
      t2(i2.json);
    } });
  }
  load() {
    try {
      if (this.remoteConfig) return yo.info("Using preloaded remote config", this.remoteConfig), this.Ce(this.remoteConfig), void this.Re();
      if (this._instance.M()) return void yo.warn("Remote config is disabled. Falling back to local config.");
      this.Te(((t2) => {
        if (!t2) return yo.info("No config found after loading remote JS config. Falling back to JSON."), void this.Ie(((t3) => {
          this.Ce(t3), this.Re();
        }));
        this.Ce(t2), this.Re();
      }));
    } catch (t2) {
      yo.error("Error loading remote config", t2);
    }
  }
  stop() {
    this.Fe && (clearInterval(this.Fe), this.Fe = void 0);
  }
  refresh() {
    this._instance.M() || "hidden" === (null == o ? void 0 : o.visibilityState) || this._instance.featureFlags.reloadFeatureFlags();
  }
  Re() {
    this.Fe || (this.Fe = setInterval((() => {
      this.refresh();
    }), 3e5));
  }
  Ce(t2) {
    t2 || yo.error("Failed to fetch remote config from PostHog."), this._instance.Ce(null != t2 ? t2 : {}), false !== (null == t2 ? void 0 : t2.hasFeatureFlags) && (this._instance.config.advanced_disable_feature_flags_on_first_load || this._instance.featureFlags.ensureFlagsLoaded());
  }
};
var xo = 3e3;
var $o = class {
  constructor(t2, i2) {
    this.Oe = true, this.Me = [], this.Ae = K((null == i2 ? void 0 : i2.flush_interval_ms) || xo, 250, 5e3, Ei.createLogger("flush interval"), xo), this.je = t2;
  }
  enqueue(t2) {
    this.Me.push(t2), this.De || this.Le();
  }
  unload() {
    this.Ne();
    var t2 = this.Me.length > 0 ? this.Ue() : {}, i2 = Object.values(t2);
    [...i2.filter(((t3) => 0 === t3.url.indexOf("/e"))), ...i2.filter(((t3) => 0 !== t3.url.indexOf("/e")))].map(((t3) => {
      this.je(_({}, t3, { transport: "sendBeacon" }));
    }));
  }
  enable() {
    this.Oe = false, this.Le();
  }
  Le() {
    var t2 = this;
    this.Oe || (this.De = setTimeout((() => {
      if (this.Ne(), this.Me.length > 0) {
        var i2 = this.Ue(), e2 = function() {
          var e3 = i2[r2], s2 = (/* @__PURE__ */ new Date()).getTime();
          e3.data && I(e3.data) && Ci(e3.data, ((t3) => {
            t3.offset = Math.abs(t3.timestamp - s2), delete t3.timestamp;
          })), t2.je(e3);
        };
        for (var r2 in i2) e2();
      }
    }), this.Ae));
  }
  Ne() {
    clearTimeout(this.De), this.De = void 0;
  }
  Ue() {
    var t2 = {};
    return Ci(this.Me, ((i2) => {
      var e2, r2 = i2, s2 = (r2 ? r2.batchKey : null) || r2.url;
      O(t2[s2]) && (t2[s2] = _({}, r2, { data: [] })), null == (e2 = t2[s2].data) || e2.push(r2.data);
    })), this.Me = [], t2;
  }
};
var Eo = ["retriesPerformedSoFar"];
var So = class {
  constructor(i2) {
    this.ze = false, this.He = 3e3, this.Me = [], this._instance = i2, this.Me = [], this.Be = true, !O(t) && "onLine" in t.navigator && (this.Be = t.navigator.onLine, this.qe = () => {
      this.Be = true, this.Lt();
    }, this.We = () => {
      this.Be = false;
    }, zi(t, "online", this.qe), zi(t, "offline", this.We));
  }
  get length() {
    return this.Me.length;
  }
  retriableRequest(t2) {
    var { retriesPerformedSoFar: i2 } = t2, e2 = g(t2, Eo);
    N(i2) && (e2.url = hn(e2.url, { retry_count: i2 })), this._instance._send_request(_({}, e2, { callback: (t3) => {
      200 !== t3.statusCode && (t3.statusCode < 400 || t3.statusCode >= 500) && (null != i2 ? i2 : 0) < 10 ? this.Ge(_({ retriesPerformedSoFar: i2 }, e2)) : null == e2.callback || e2.callback(t3);
    } }));
  }
  Ge(t2) {
    var i2 = t2.retriesPerformedSoFar || 0;
    t2.retriesPerformedSoFar = i2 + 1;
    var e2 = (function(t3) {
      var i3 = 3e3 * Math.pow(2, t3), e3 = i3 / 2, r3 = Math.min(18e5, i3), s3 = (Math.random() - 0.5) * (r3 - e3);
      return Math.ceil(r3 + s3);
    })(i2), r2 = Date.now() + e2;
    this.Me.push({ retryAt: r2, requestOptions: t2 });
    var s2 = "Enqueued failed request for retry in " + e2;
    navigator.onLine || (s2 += " (Browser is offline)"), Ei.warn(s2), this.ze || (this.ze = true, this.Ve());
  }
  Ve() {
    if (this.Je && clearTimeout(this.Je), 0 === this.Me.length) return this.ze = false, void (this.Je = void 0);
    this.Je = setTimeout((() => {
      this.Be && this.Me.length > 0 && this.Lt(), this.Ve();
    }), this.He);
  }
  Lt() {
    var t2 = Date.now(), i2 = [], e2 = this.Me.filter(((e3) => e3.retryAt < t2 || (i2.push(e3), false)));
    if (this.Me = i2, e2.length > 0) for (var { requestOptions: r2 } of e2) this.retriableRequest(r2);
  }
  unload() {
    for (var { requestOptions: i2 } of (this.Je && (clearTimeout(this.Je), this.Je = void 0), this.ze = false, O(t) || (this.qe && (t.removeEventListener("online", this.qe), this.qe = void 0), this.We && (t.removeEventListener("offline", this.We), this.We = void 0)), this.Me)) try {
      this._instance._send_request(_({}, i2, { transport: "sendBeacon" }));
    } catch (t2) {
      Ei.error(t2);
    }
    this.Me = [];
  }
};
var ko = class {
  constructor(t2) {
    this.Ke = () => {
      var t3, i2, e2, r2;
      this.Ye || (this.Ye = {});
      var s2 = this.scrollElement(), n2 = this.scrollY(), o2 = s2 ? Math.max(0, s2.scrollHeight - s2.clientHeight) : 0, a2 = n2 + ((null == s2 ? void 0 : s2.clientHeight) || 0), l2 = (null == s2 ? void 0 : s2.scrollHeight) || 0;
      this.Ye.lastScrollY = Math.ceil(n2), this.Ye.maxScrollY = Math.max(n2, null !== (t3 = this.Ye.maxScrollY) && void 0 !== t3 ? t3 : 0), this.Ye.maxScrollHeight = Math.max(o2, null !== (i2 = this.Ye.maxScrollHeight) && void 0 !== i2 ? i2 : 0), this.Ye.lastContentY = a2, this.Ye.maxContentY = Math.max(a2, null !== (e2 = this.Ye.maxContentY) && void 0 !== e2 ? e2 : 0), this.Ye.maxContentHeight = Math.max(l2, null !== (r2 = this.Ye.maxContentHeight) && void 0 !== r2 ? r2 : 0);
    }, this._instance = t2;
  }
  getContext() {
    return this.Ye;
  }
  resetContext() {
    var t2 = this.Ye;
    return setTimeout(this.Ke, 0), t2;
  }
  startMeasuringScrollPosition() {
    zi(t, "scroll", this.Ke, { capture: true }), zi(t, "scrollend", this.Ke, { capture: true }), zi(t, "resize", this.Ke);
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
var Po = (t2) => vs(null == t2 ? void 0 : t2.config.mask_personal_data_properties, null == t2 ? void 0 : t2.config.custom_personal_data_properties);
var To = class {
  constructor(t2, i2, e2, r2) {
    this.Xe = (t3) => {
      var i3 = this.Qe();
      if (!i3 || i3.sessionId !== t3) {
        var e3 = { sessionId: t3, props: this.Ze(this._instance) };
        this.tr.register({ [ve]: e3 });
      }
    }, this._instance = t2, this.ir = i2, this.tr = e2, this.Ze = r2 || Po, this.ir.onSessionId(this.Xe);
  }
  Qe() {
    return this.tr.props[ve];
  }
  getSetOnceProps() {
    var t2, i2 = null == (t2 = this.Qe()) ? void 0 : t2.props;
    return i2 ? "r" in i2 ? cs(i2) : { $referring_domain: i2.referringDomain, $pathname: i2.initialPathName, utm_source: i2.utm_source, utm_campaign: i2.utm_campaign, utm_medium: i2.utm_medium, utm_content: i2.utm_content, utm_term: i2.utm_term } : {};
  }
  getSessionProps() {
    var t2 = {};
    return Ci(ji(this.getSetOnceProps()), ((i2, e2) => {
      "$current_url" === e2 && (e2 = "url"), t2["$session_entry_" + E(e2)] = i2;
    })), t2;
  }
};
var Io = Si("[SessionId]");
var Co = class {
  on(t2, i2) {
    return this.er.on(t2, i2);
  }
  constructor(t2, i2, e2) {
    var r2;
    if (this.rr = [], this.sr = void 0, this.er = new lo(), this.nr = (t3, i3) => !(!N(t3) || !N(i3)) && Math.abs(t3 - i3) > this.sessionTimeoutMs, !t2.persistence) throw new Error("SessionIdManager requires a PostHogPersistence instance");
    if ("always" === t2.config.cookieless_mode) throw new Error('SessionIdManager cannot be used with cookieless_mode="always"');
    this.R = t2.config, this.tr = t2.persistence, this.ar = void 0, this.lr = void 0, this._sessionStartTimestamp = null, this._sessionActivityTimestamp = null, this.ur = i2 || wr, this.hr = e2 || wr;
    var s2 = this.R.persistence_name || this.R.token, n2 = this.R.session_idle_timeout_seconds || 1800;
    if (this._sessionTimeoutMs = 1e3 * K(n2, 60, 36e3, Io.createLogger("session_idle_timeout_seconds"), 1800), t2.register({ $configured_session_timeout_ms: this._sessionTimeoutMs }), this.dr(), this.vr = "ph_" + s2 + "_window_id", this.cr = "ph_" + s2 + "_primary_window_exists", this.pr()) {
      var o2 = Or.W(this.vr), a2 = Or.W(this.cr);
      o2 && !a2 ? this.ar = o2 : Or.V(this.vr), Or.G(this.cr, true);
    }
    if (null != (r2 = this.R.bootstrap) && r2.sessionID) try {
      var l2 = ((t3) => {
        var i3 = t3.replace(/-/g, "");
        if (32 !== i3.length) throw new Error("Not a valid UUID");
        if ("7" !== i3[12]) throw new Error("Not a UUIDv7");
        return parseInt(i3.substring(0, 12), 16);
      })(this.R.bootstrap.sessionID);
      this._r(this.R.bootstrap.sessionID, (/* @__PURE__ */ new Date()).getTime(), l2);
    } catch (t3) {
      Io.error("Invalid sessionID in bootstrap", t3);
    }
    this.gr();
  }
  get sessionTimeoutMs() {
    return this._sessionTimeoutMs;
  }
  onSessionId(t2) {
    return O(this.rr) && (this.rr = []), this.rr.push(t2), this.lr && t2(this.lr, this.ar), () => {
      this.rr = this.rr.filter(((i2) => i2 !== t2));
    };
  }
  pr() {
    return "memory" !== this.R.persistence && !this.tr.ki && Or.H();
  }
  mr(t2) {
    t2 !== this.ar && (this.ar = t2, this.pr() && Or.G(this.vr, t2));
  }
  br() {
    return this.ar ? this.ar : this.pr() ? Or.W(this.vr) : null;
  }
  _r(t2, i2, e2) {
    t2 === this.lr && i2 === this._sessionActivityTimestamp && e2 === this._sessionStartTimestamp || (this._sessionStartTimestamp = e2, this._sessionActivityTimestamp = i2, this.lr = t2, this.tr.register({ [ie]: [i2, t2, e2] }));
  }
  yr() {
    var t2 = this.tr.props[ie];
    return I(t2) && 2 === t2.length && t2.push(t2[0]), t2 || [0, null, 0];
  }
  resetSessionId() {
    this._r(null, null, null);
  }
  destroy() {
    clearTimeout(this.wr), this.wr = void 0, this.sr && t && (t.removeEventListener("beforeunload", this.sr, { capture: false }), this.sr = void 0), this.rr = [];
  }
  gr() {
    this.sr = () => {
      this.pr() && Or.V(this.cr);
    }, zi(t, "beforeunload", this.sr, { capture: false });
  }
  checkAndGetSessionAndWindowId(t2, i2) {
    if (void 0 === t2 && (t2 = false), void 0 === i2 && (i2 = null), "always" === this.R.cookieless_mode) throw new Error('checkAndGetSessionAndWindowId should not be called with cookieless_mode="always"');
    var e2 = i2 || (/* @__PURE__ */ new Date()).getTime(), [r2, s2, n2] = this.yr(), o2 = this.br(), a2 = N(n2) && Math.abs(e2 - n2) > 864e5, l2 = false, u2 = !s2, h2 = !u2 && !t2 && this.nr(e2, r2);
    u2 || h2 || a2 ? (s2 = this.ur(), o2 = this.hr(), Io.info("new session ID generated", { sessionId: s2, windowId: o2, changeReason: { noSessionId: u2, activityTimeout: h2, sessionPastMaximumLength: a2 } }), n2 = e2, l2 = true) : o2 || (o2 = this.hr(), l2 = true);
    var d2 = !!N(r2) && t2 && !a2 ? r2 : e2, v2 = !N(n2) ? (/* @__PURE__ */ new Date()).getTime() : n2;
    return this.mr(o2), this._r(s2, d2, v2), t2 || this.dr(), l2 && this.rr.forEach(((t3) => t3(s2, o2, l2 ? { noSessionId: u2, activityTimeout: h2, sessionPastMaximumLength: a2 } : void 0))), { sessionId: s2, windowId: o2, sessionStartTimestamp: v2, changeReason: l2 ? { noSessionId: u2, activityTimeout: h2, sessionPastMaximumLength: a2 } : void 0, lastActivityTimestamp: r2 };
  }
  dr() {
    clearTimeout(this.wr), this.wr = setTimeout((() => {
      var [t2] = this.yr();
      if (this.nr((/* @__PURE__ */ new Date()).getTime(), t2)) {
        var i2 = this.lr;
        this.resetSessionId(), this.er.emit("forcedIdleReset", { idleSessionId: i2 });
      }
    }), 1.1 * this.sessionTimeoutMs);
  }
};
var Ro = ["$set_once", "$set"];
var Fo = Si("[SiteApps]");
var Oo = class {
  constructor(t2) {
    this._instance = t2, this.$r = [], this.apps = {};
  }
  get isEnabled() {
    return !!this._instance.config.opt_in_site_apps;
  }
  Er(t2, i2) {
    if (i2) {
      var e2 = this.globalsForEvent(i2);
      this.$r.push(e2), this.$r.length > 1e3 && (this.$r = this.$r.slice(10));
    }
  }
  get siteAppLoaders() {
    var t2;
    return null == (t2 = v._POSTHOG_REMOTE_CONFIG) || null == (t2 = t2[this._instance.config.token]) ? void 0 : t2.siteApps;
  }
  init() {
    if (this.isEnabled) {
      var t2 = this._instance._addCaptureHook(this.Er.bind(this));
      this.Sr = () => {
        t2(), this.$r = [], this.Sr = void 0;
      };
    }
  }
  globalsForEvent(t2) {
    var i2, e2, r2, s2, n2, o2, a2;
    if (!t2) throw new Error("Event payload is required");
    var l2 = {}, u2 = this._instance.get_property("$groups") || [], h2 = this._instance.get_property("$stored_group_properties") || {};
    for (var [d2, v2] of Object.entries(h2)) l2[d2] = { id: u2[d2], type: d2, properties: v2 };
    var { $set_once: c2, $set: f2 } = t2;
    return { event: _({}, g(t2, Ro), { properties: _({}, t2.properties, f2 ? { $set: _({}, null !== (i2 = null == (e2 = t2.properties) ? void 0 : e2.$set) && void 0 !== i2 ? i2 : {}, f2) } : {}, c2 ? { $set_once: _({}, null !== (r2 = null == (s2 = t2.properties) ? void 0 : s2.$set_once) && void 0 !== r2 ? r2 : {}, c2) } : {}), elements_chain: null !== (n2 = null == (o2 = t2.properties) ? void 0 : o2.$elements_chain) && void 0 !== n2 ? n2 : "", distinct_id: null == (a2 = t2.properties) ? void 0 : a2.distinct_id }), person: { properties: this._instance.get_property("$stored_person_properties") }, groups: l2 };
  }
  setupSiteApp(t2) {
    var i2 = this.apps[t2.id], e2 = () => {
      var e3;
      (!i2.errored && this.$r.length && (Fo.info("Processing " + this.$r.length + " events for site app with id " + t2.id), this.$r.forEach(((t3) => null == i2.processEvent ? void 0 : i2.processEvent(t3))), i2.processedBuffer = true), Object.values(this.apps).every(((t3) => t3.processedBuffer || t3.errored))) && (null == (e3 = this.Sr) || e3.call(this));
    }, r2 = false, s2 = (s3) => {
      i2.errored = !s3, i2.loaded = true, Fo.info("Site app with id " + t2.id + " " + (s3 ? "loaded" : "errored")), r2 && e2();
    };
    try {
      var { processEvent: n2 } = t2.init({ posthog: this._instance, callback: (t3) => {
        s2(t3);
      } });
      n2 && (i2.processEvent = n2), r2 = true;
    } catch (i3) {
      Fo.error("Error while initializing PostHog app with config id " + t2.id, i3), s2(false);
    }
    if (r2 && i2.loaded) try {
      e2();
    } catch (e3) {
      Fo.error("Error while processing buffered events PostHog app with config id " + t2.id, e3), i2.errored = true;
    }
  }
  kr() {
    var t2 = this.siteAppLoaders || [];
    for (var i2 of t2) this.apps[i2.id] = { id: i2.id, loaded: false, errored: false, processedBuffer: false };
    for (var e2 of t2) this.setupSiteApp(e2);
  }
  Pr(t2) {
    if (0 !== Object.keys(this.apps).length) {
      var i2 = this.globalsForEvent(t2);
      for (var e2 of Object.values(this.apps)) try {
        null == e2.processEvent || e2.processEvent(i2);
      } catch (i3) {
        Fo.error("Error while processing event " + t2.event + " for site app " + e2.id, i3);
      }
    }
  }
  onRemoteConfig(t2) {
    var i2, e2, r2, s2 = this;
    if (null != (i2 = this.siteAppLoaders) && i2.length) return this.isEnabled ? (this.kr(), void this._instance.on("eventCaptured", ((t3) => this.Pr(t3)))) : void Fo.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
    if (null == (e2 = this.Sr) || e2.call(this), null != (r2 = t2.siteApps) && r2.length) if (this.isEnabled) {
      var n2 = function(t3) {
        var i3;
        v["__$$ph_site_app_" + t3] = s2._instance, null == (i3 = v.__PosthogExtensions__) || null == i3.loadSiteApp || i3.loadSiteApp(s2._instance, a2, ((i4) => {
          if (i4) return Fo.error("Error while initializing PostHog app with config id " + t3, i4);
        }));
      };
      for (var { id: o2, url: a2 } of t2.siteApps) n2(o2);
    } else Fo.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
  }
};
var Mo = function(t2, i2) {
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
var Ao = (function(t2) {
  return t2.US = "us", t2.EU = "eu", t2.CUSTOM = "custom", t2;
})({});
var jo = "i.posthog.com";
var Do = class {
  constructor(t2) {
    this.Tr = {}, this.instance = t2;
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
    return i2 || (i2 = this.apiHost.replace("." + jo, ".posthog.com")), "https://app.posthog.com" === i2 ? "https://us.posthog.com" : i2;
  }
  get region() {
    return this.Tr[this.apiHost] || (/https:\/\/(app|us|us-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? this.Tr[this.apiHost] = Ao.US : /https:\/\/(eu|eu-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? this.Tr[this.apiHost] = Ao.EU : this.Tr[this.apiHost] = Ao.CUSTOM), this.Tr[this.apiHost];
  }
  endpointFor(t2, i2) {
    if (void 0 === i2 && (i2 = ""), i2 && (i2 = "/" === i2[0] ? i2 : "/" + i2), "ui" === t2) return this.uiHost + i2;
    if ("flags" === t2) return this.flagsApiHost + i2;
    if (this.region === Ao.CUSTOM) return this.apiHost + i2;
    var e2 = jo + i2;
    switch (t2) {
      case "assets":
        return "https://" + this.region + "-assets." + e2;
      case "api":
        return "https://" + this.region + "." + e2;
    }
  }
};
var Lo = { icontains: (i2, e2) => !!t && e2.href.toLowerCase().indexOf(i2.toLowerCase()) > -1, not_icontains: (i2, e2) => !!t && -1 === e2.href.toLowerCase().indexOf(i2.toLowerCase()), regex: (i2, e2) => !!t && fn(e2.href, i2), not_regex: (i2, e2) => !!t && !fn(e2.href, i2), exact: (t2, i2) => i2.href === t2, is_not: (t2, i2) => i2.href !== t2 };
var No = class _No {
  constructor(t2) {
    var i2 = this;
    this.getWebExperimentsAndEvaluateDisplayLogic = function(t3) {
      void 0 === t3 && (t3 = false), i2.getWebExperiments(((t4) => {
        _No.Ir("retrieved web experiments from the server"), i2.Cr = /* @__PURE__ */ new Map(), t4.forEach(((t5) => {
          if (t5.feature_flag_key) {
            var e2;
            if (i2.Cr) _No.Ir("setting flag key ", t5.feature_flag_key, " to web experiment ", t5), null == (e2 = i2.Cr) || e2.set(t5.feature_flag_key, t5);
            var r2 = i2._instance.getFeatureFlag(t5.feature_flag_key);
            M(r2) && t5.variants[r2] && i2.Rr(t5.name, r2, t5.variants[r2].transforms);
          } else if (t5.variants) for (var s2 in t5.variants) {
            var n2 = t5.variants[s2];
            _No.Fr(n2) && i2.Rr(t5.name, s2, n2.transforms);
          }
        }));
      }), t3);
    }, this._instance = t2, this._instance.onFeatureFlags(((t3) => {
      this.onFeatureFlags(t3);
    }));
  }
  onFeatureFlags(t2) {
    if (this._is_bot()) _No.Ir("Refusing to render web experiment since the viewer is a likely bot");
    else if (!this._instance.config.disable_web_experiments) {
      if (D(this.Cr)) return this.Cr = /* @__PURE__ */ new Map(), this.loadIfEnabled(), void this.previewWebExperiment();
      _No.Ir("applying feature flags", t2), t2.forEach(((t3) => {
        var i2;
        if (this.Cr && null != (i2 = this.Cr) && i2.has(t3)) {
          var e2, r2 = this._instance.getFeatureFlag(t3), s2 = null == (e2 = this.Cr) ? void 0 : e2.get(t3);
          r2 && null != s2 && s2.variants[r2] && this.Rr(s2.name, r2, s2.variants[r2].transforms);
        }
      }));
    }
  }
  previewWebExperiment() {
    var t2 = _No.getWindowLocation();
    if (null != t2 && t2.search) {
      var i2 = nr(null == t2 ? void 0 : t2.search, "__experiment_id"), e2 = nr(null == t2 ? void 0 : t2.search, "__experiment_variant");
      i2 && e2 && (_No.Ir("previewing web experiments " + i2 + " && " + e2), this.getWebExperiments(((t3) => {
        this.Or(parseInt(i2), e2, t3);
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
  Or(t2, i2, e2) {
    var r2 = e2.filter(((i3) => i3.id === t2));
    r2 && r2.length > 0 && (_No.Ir("Previewing web experiment [" + r2[0].name + "] with variant [" + i2 + "]"), this.Rr(r2[0].name, i2, r2[0].variants[i2].transforms));
  }
  static Fr(t2) {
    return !D(t2.conditions) && (_No.Mr(t2) && _No.Ar(t2));
  }
  static Mr(t2) {
    var i2;
    if (D(t2.conditions) || D(null == (i2 = t2.conditions) ? void 0 : i2.url)) return true;
    var e2, r2, s2, n2 = _No.getWindowLocation();
    return !!n2 && (null == (e2 = t2.conditions) || !e2.url || Lo[null !== (r2 = null == (s2 = t2.conditions) ? void 0 : s2.urlMatchType) && void 0 !== r2 ? r2 : "icontains"](t2.conditions.url, n2));
  }
  static getWindowLocation() {
    return null == t ? void 0 : t.location;
  }
  static Ar(t2) {
    var i2;
    if (D(t2.conditions) || D(null == (i2 = t2.conditions) ? void 0 : i2.utm)) return true;
    var e2 = as();
    if (e2.utm_source) {
      var r2, s2, n2, o2, a2, l2, u2, h2, d2 = null == (r2 = t2.conditions) || null == (r2 = r2.utm) || !r2.utm_campaign || (null == (s2 = t2.conditions) || null == (s2 = s2.utm) ? void 0 : s2.utm_campaign) == e2.utm_campaign, v2 = null == (n2 = t2.conditions) || null == (n2 = n2.utm) || !n2.utm_source || (null == (o2 = t2.conditions) || null == (o2 = o2.utm) ? void 0 : o2.utm_source) == e2.utm_source, c2 = null == (a2 = t2.conditions) || null == (a2 = a2.utm) || !a2.utm_medium || (null == (l2 = t2.conditions) || null == (l2 = l2.utm) ? void 0 : l2.utm_medium) == e2.utm_medium, f2 = null == (u2 = t2.conditions) || null == (u2 = u2.utm) || !u2.utm_term || (null == (h2 = t2.conditions) || null == (h2 = h2.utm) ? void 0 : h2.utm_term) == e2.utm_term;
      return d2 && c2 && f2 && v2;
    }
    return false;
  }
  static Ir(t2) {
    for (var i2 = arguments.length, e2 = new Array(i2 > 1 ? i2 - 1 : 0), r2 = 1; r2 < i2; r2++) e2[r2 - 1] = arguments[r2];
    Ei.info("[WebExperiments] " + t2, e2);
  }
  Rr(t2, i2, e2) {
    this._is_bot() ? _No.Ir("Refusing to render web experiment since the viewer is a likely bot") : "control" !== i2 ? e2.forEach(((e3) => {
      if (e3.selector) {
        var r2;
        _No.Ir("applying transform of variant " + i2 + " for experiment " + t2 + " ", e3);
        var s2 = null == (r2 = document) ? void 0 : r2.querySelectorAll(e3.selector);
        null == s2 || s2.forEach(((t3) => {
          var i3 = t3;
          e3.html && (i3.innerHTML = e3.html), e3.css && i3.setAttribute("style", e3.css);
        }));
      }
    })) : _No.Ir("Control variants leave the page unmodified.");
  }
  _is_bot() {
    return n && this._instance ? Mo(n, this._instance.config.custom_blocked_useragents) : void 0;
  }
};
var Uo = Si("[PostHog ExternalIntegrations]");
var zo = { intercom: "intercom-integration", crispChat: "crisp-chat-integration" };
var Ho = class {
  constructor(t2) {
    this._instance = t2;
  }
  it(t2, i2) {
    var e2;
    null == (e2 = v.__PosthogExtensions__) || null == e2.loadExternalDependency || e2.loadExternalDependency(this._instance, t2, ((t3) => {
      if (t3) return Uo.error("failed to load script", t3);
      i2();
    }));
  }
  startIfEnabledOrStop() {
    var t2 = this, i2 = function(i3) {
      var e3, s3, n2;
      (!r2 || null != (e3 = v.__PosthogExtensions__) && null != (e3 = e3.integrations) && e3[i3] || t2.it(zo[i3], (() => {
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
Si("[SessionRecording]");
var Bo = "[SessionRecording]";
var qo = Si(Bo);
var Wo = class {
  get started() {
    var t2;
    return !(null == (t2 = this.jr) || !t2.isStarted);
  }
  get status() {
    return this.jr ? this.jr.status : this.Dr && !this.Lr ? "disabled" : "lazy_loading";
  }
  constructor(t2) {
    if (this._forceAllowLocalhostNetworkCapture = false, this.Dr = false, this.Nr = false, this.Ur = void 0, this._instance = t2, !this._instance.sessionManager) throw qo.error("started without valid sessionManager"), new Error(Bo + " started without valid sessionManager. This is a bug.");
    if ("always" === this._instance.config.cookieless_mode) throw new Error(Bo + ' cannot be used with cookieless_mode="always"');
  }
  get Lr() {
    var i2, e2 = !(null == (i2 = this._instance.get_property(te)) || !i2.enabled), r2 = !this._instance.config.disable_session_recording, s2 = this._instance.config.disable_session_recording || this._instance.consent.isOptedOut();
    return t && e2 && r2 && !s2;
  }
  startIfEnabledOrStop(t2) {
    var i2;
    if (!this.Lr || null == (i2 = this.jr) || !i2.isStarted) {
      var e2 = !O(Object.assign) && !O(Array.from);
      this.Lr && e2 ? (this.zr(t2), qo.info("starting")) : this.stopRecording();
    }
  }
  zr(t2) {
    var i2, e2, r2;
    this.Lr && (null != v && null != (i2 = v.__PosthogExtensions__) && null != (i2 = i2.rrweb) && i2.record && null != (e2 = v.__PosthogExtensions__) && e2.initSessionRecording ? this.Hr(t2) : null == (r2 = v.__PosthogExtensions__) || null == r2.loadExternalDependency || r2.loadExternalDependency(this._instance, this.Br, ((i3) => {
      if (i3) return qo.error("could not load recorder", i3);
      this.Hr(t2);
    })));
  }
  stopRecording() {
    var t2, i2;
    null == (t2 = this.Ur) || t2.call(this), this.Ur = void 0, null == (i2 = this.jr) || i2.stop();
  }
  qr() {
    var t2;
    null == (t2 = this._instance.persistence) || t2.unregister(ee);
  }
  Wr(t2) {
    if (this._instance.persistence) {
      var i2, e2, r2 = this._instance.persistence, s2 = () => {
        var i3 = false === t2.sessionRecording ? void 0 : t2.sessionRecording, e3 = null == i3 ? void 0 : i3.sampleRate, s3 = D(e3) ? null : parseFloat(e3);
        D(s3) && this.qr();
        var n2 = null == i3 ? void 0 : i3.minimumDurationMilliseconds;
        r2.register({ [te]: _({ cache_timestamp: Date.now(), enabled: !!i3 }, i3, { networkPayloadCapture: _({ capturePerformance: t2.capturePerformance }, null == i3 ? void 0 : i3.networkPayloadCapture), canvasRecording: { enabled: null == i3 ? void 0 : i3.recordCanvas, fps: null == i3 ? void 0 : i3.canvasFps, quality: null == i3 ? void 0 : i3.canvasQuality }, sampleRate: s3, minimumDurationMilliseconds: O(n2) ? null : n2, endpoint: null == i3 ? void 0 : i3.endpoint, triggerMatchType: null == i3 ? void 0 : i3.triggerMatchType, masking: null == i3 ? void 0 : i3.masking, urlTriggers: null == i3 ? void 0 : i3.urlTriggers }) });
      };
      s2(), null == (i2 = this.Ur) || i2.call(this), this.Ur = null == (e2 = this._instance.sessionManager) ? void 0 : e2.onSessionId(s2);
    }
  }
  onRemoteConfig(t2) {
    "sessionRecording" in t2 ? false !== t2.sessionRecording ? (this.Nr = false, this.Wr(t2), this.Dr = true, this.startIfEnabledOrStop()) : this.Dr = true : qo.info("skipping remote config with no sessionRecording", t2);
  }
  log(t2, i2) {
    var e2;
    void 0 === i2 && (i2 = "log"), null != (e2 = this.jr) && e2.log ? this.jr.log(t2, i2) : qo.warn("log called before recorder was ready");
  }
  get Br() {
    var t2, i2, e2 = null == (t2 = this._instance) || null == (t2 = t2.persistence) ? void 0 : t2.get_property(te);
    return (null == e2 || null == (i2 = e2.scriptConfig) ? void 0 : i2.script) || "lazy-recorder";
  }
  Gr() {
    var t2, i2 = this._instance.get_property(te);
    if (!i2) return false;
    var e2 = null !== (t2 = ("object" == typeof i2 ? i2 : JSON.parse(i2)).cache_timestamp) && void 0 !== t2 ? t2 : Date.now();
    return Date.now() - e2 <= 3e5;
  }
  Hr(t2) {
    var i2, e2;
    if (null == (i2 = v.__PosthogExtensions__) || !i2.initSessionRecording) throw Error("Called on script loaded before session recording is available");
    this.jr || (this.jr = null == (e2 = v.__PosthogExtensions__) ? void 0 : e2.initSessionRecording(this._instance), this.jr._forceAllowLocalhostNetworkCapture = this._forceAllowLocalhostNetworkCapture);
    this.Gr() ? this.jr.start(t2) : this.Nr || (this.Nr = true, qo.info("persisted remote config is stale, requesting fresh config before starting"), new wo(this._instance).load());
  }
  onRRwebEmit(t2) {
    var i2;
    null == (i2 = this.jr) || null == i2.onRRwebEmit || i2.onRRwebEmit(t2);
  }
  overrideLinkedFlag() {
    var t2, i2;
    this.jr || (null == (i2 = this._instance.persistence) || i2.register({ $replay_override_linked_flag: true }));
    null == (t2 = this.jr) || t2.overrideLinkedFlag();
  }
  overrideSampling() {
    var t2, i2;
    this.jr || (null == (i2 = this._instance.persistence) || i2.register({ $replay_override_sampling: true }));
    null == (t2 = this.jr) || t2.overrideSampling();
  }
  overrideTrigger(t2) {
    var i2, e2;
    this.jr || (null == (e2 = this._instance.persistence) || e2.register({ ["url" === t2 ? "$replay_override_url_trigger" : "$replay_override_event_trigger"]: true }));
    null == (i2 = this.jr) || i2.overrideTrigger(t2);
  }
  get sdkDebugProperties() {
    var t2;
    return (null == (t2 = this.jr) ? void 0 : t2.sdkDebugProperties) || { $recording_status: this.status };
  }
  tryAddCustomEvent(t2, i2) {
    var e2;
    return !(null == (e2 = this.jr) || !e2.tryAddCustomEvent(t2, i2));
  }
};
var Go = {};
var Vo = 0;
var Jo = () => {
};
var Ko = "posthog";
var Yo = !ln && -1 === (null == d ? void 0 : d.indexOf("MSIE")) && -1 === (null == d ? void 0 : d.indexOf("Mozilla"));
var Xo = (i2) => {
  var e2;
  return _({ api_host: "https://us.i.posthog.com", flags_api_host: null, ui_host: null, token: "", autocapture: true, cross_subdomain_cookie: Ni(null == o ? void 0 : o.location), persistence: "localStorage+cookie", persistence_name: "", cookie_persisted_properties: [], loaded: Jo, save_campaign_params: true, custom_campaign_params: [], custom_blocked_useragents: [], save_referrer: true, capture_pageleave: "if_capture_pageview", defaults: null != i2 ? i2 : "unset", __preview_deferred_init_extensions: false, debug: a && M(null == a ? void 0 : a.search) && -1 !== a.search.indexOf("__posthog_debug=true") || false, cookie_expiration: 365, upgrade: false, disable_session_recording: false, disable_persistence: false, disable_web_experiments: true, disable_surveys: false, disable_surveys_automatic_display: false, disable_conversations: false, disable_product_tours: false, disable_external_dependency_loading: false, enable_recording_console_log: void 0, secure_cookie: "https:" === (null == t || null == (e2 = t.location) ? void 0 : e2.protocol), ip: false, opt_out_capturing_by_default: false, opt_out_persistence_by_default: false, opt_out_useragent_filter: false, opt_out_capturing_persistence_type: "localStorage", consent_persistence_name: null, opt_out_capturing_cookie_prefix: null, opt_in_site_apps: false, property_denylist: [], respect_dnt: false, sanitize_properties: null, request_headers: {}, request_batching: true, properties_string_max_length: 65535, mask_all_element_attributes: false, mask_all_text: false, mask_personal_data_properties: false, custom_personal_data_properties: [], advanced_disable_flags: false, advanced_disable_decide: false, advanced_disable_feature_flags: false, advanced_disable_feature_flags_on_first_load: false, advanced_only_evaluate_survey_feature_flags: false, advanced_enable_surveys: false, advanced_disable_toolbar_metrics: false, feature_flag_request_timeout_ms: 3e3, surveys_request_timeout_ms: 1e4, on_request_error: (t2) => {
    var i3 = "Bad HTTP status: " + t2.statusCode + " " + t2.text;
    Ei.error(i3);
  }, get_device_id: (t2) => t2, capture_performance: void 0, name: "posthog", bootstrap: {}, disable_compression: false, session_idle_timeout_seconds: 1800, person_profiles: "identified_only", before_send: void 0, request_queue_config: { flush_interval_ms: xo }, error_tracking: {}, _onCapture: Jo, __preview_eager_load_replay: false }, ((t2) => ({ rageclick: !(t2 && t2 >= "2025-11-30") || { content_ignorelist: true }, capture_pageview: !(t2 && t2 >= "2025-05-24") || "history_change", session_recording: t2 && t2 >= "2025-11-30" ? { strictMinimumDuration: true } : {}, external_scripts_inject_target: t2 && t2 >= "2026-01-30" ? "head" : "body", internal_or_test_user_hostname: t2 && t2 >= "2026-01-30" ? /^(localhost|127\.0\.0\.1)$/ : void 0 }))(i2));
};
var Qo = (t2) => {
  var i2 = {};
  O(t2.process_person) || (i2.person_profiles = t2.process_person), O(t2.xhr_headers) || (i2.request_headers = t2.xhr_headers), O(t2.cookie_name) || (i2.persistence_name = t2.cookie_name), O(t2.disable_cookie) || (i2.disable_persistence = t2.disable_cookie), O(t2.store_google) || (i2.save_campaign_params = t2.store_google), O(t2.verbose) || (i2.debug = t2.verbose);
  var e2 = Ri({}, i2, t2);
  return I(t2.property_blacklist) && (O(t2.property_denylist) ? e2.property_denylist = t2.property_blacklist : I(t2.property_denylist) ? e2.property_denylist = [...t2.property_blacklist, ...t2.property_denylist] : Ei.error("Invalid value for property_denylist config: " + t2.property_denylist)), e2;
};
var Zo = class {
  constructor() {
    this.__forceAllowLocalhost = false;
  }
  get Vr() {
    return this.__forceAllowLocalhost;
  }
  set Vr(t2) {
    Ei.error("WebPerformanceObserver is deprecated and has no impact on network capture. Use `_forceAllowLocalhostNetworkCapture` on `posthog.sessionRecording`"), this.__forceAllowLocalhost = t2;
  }
};
var ta = class _ta {
  get decideEndpointWasHit() {
    var t2, i2;
    return null !== (t2 = null == (i2 = this.featureFlags) ? void 0 : i2.hasLoadedFlags) && void 0 !== t2 && t2;
  }
  get flagsEndpointWasHit() {
    var t2, i2;
    return null !== (t2 = null == (i2 = this.featureFlags) ? void 0 : i2.hasLoadedFlags) && void 0 !== t2 && t2;
  }
  constructor() {
    this.webPerformance = new Zo(), this.Jr = false, this.version = c.LIB_VERSION, this.mi = new lo(), this._calculate_event_properties = this.calculateEventProperties.bind(this), this.config = Xo(), this.SentryIntegration = Jr, this.sentryIntegration = (t2) => (function(t3, i2) {
      var e2 = Vr(t3, i2);
      return { name: Gr, processEvent: (t4) => e2(t4) };
    })(this, t2), this.__request_queue = [], this.__loaded = false, this.analyticsDefaultEndpoint = "/e/", this.Kr = false, this.Yr = null, this.Xr = null, this.Qr = null, this.featureFlags = new Nn(this), this.toolbar = new Zr(this), this.scrollManager = new ko(this), this.pageViewManager = new $s(this), this.surveys = new fo(this), this.conversations = new _o(this), this.logs = new go(this), this.experiments = new No(this), this.exceptions = new yn(this), this.rateLimiter = new bo(this), this.requestRouter = new Do(this), this.consent = new Ar(this), this.externalIntegrations = new Ho(this), this.people = { set: (t2, i2, e2) => {
      var r2 = M(t2) ? { [t2]: i2 } : t2;
      this.setPersonProperties(r2), null == e2 || e2({});
    }, set_once: (t2, i2, e2) => {
      var r2 = M(t2) ? { [t2]: i2 } : t2;
      this.setPersonProperties(void 0, r2), null == e2 || e2({});
    } }, this.on("eventCaptured", ((t2) => Ei.info('send "' + (null == t2 ? void 0 : t2.event) + '"', t2)));
  }
  init(t2, i2, e2) {
    if (e2 && e2 !== Ko) {
      var r2, s2 = null !== (r2 = Go[e2]) && void 0 !== r2 ? r2 : new _ta();
      return s2._init(t2, i2, e2), Go[e2] = s2, Go[Ko][e2] = s2, s2;
    }
    return this._init(t2, i2, e2);
  }
  _init(i2, e2, r2) {
    var s2;
    if (void 0 === e2 && (e2 = {}), O(i2) || A(i2)) return Ei.critical("PostHog was initialized without a token. This likely indicates a misconfiguration. Please check the first argument passed to posthog.init()"), this;
    if (this.__loaded) return console.warn("[PostHog.js]", "You have already initialized PostHog! Re-initializing is a no-op"), this;
    this.__loaded = true, this.config = {}, e2.debug = this.Zr(e2.debug), this.ts = e2, this.es = [], e2.person_profiles ? this.Xr = e2.person_profiles : e2.process_person && (this.Xr = e2.process_person), this.set_config(Ri({}, Xo(e2.defaults), Qo(e2), { name: r2, token: i2 })), this.config.on_xhr_error && Ei.error("on_xhr_error is deprecated. Use on_request_error instead"), this.compression = e2.disable_compression ? void 0 : Ss.GZipJS;
    var n2 = this.rs();
    this.persistence = new zn(this.config, n2), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new zn(_({}, this.config, { persistence: "sessionStorage" }), n2);
    var o2 = _({}, this.persistence.props), a2 = _({}, this.sessionPersistence.props);
    this.register({ $initialization_time: (/* @__PURE__ */ new Date()).toISOString() }), this.ss = new $o(((t2) => this.ns(t2)), this.config.request_queue_config), this.os = new So(this), this.__request_queue = [];
    var l2 = "always" === this.config.cookieless_mode || "on_reject" === this.config.cookieless_mode && this.consent.isExplicitlyOptedOut();
    if (l2 || (this.sessionManager = new Co(this), this.sessionPropsManager = new To(this, this.sessionManager, this.persistence)), this.config.__preview_deferred_init_extensions ? (Ei.info("Deferring extension initialization to improve startup performance"), setTimeout((() => {
      this.ls(l2);
    }), 0)) : (Ei.info("Initializing extensions synchronously"), this.ls(l2)), c.DEBUG = c.DEBUG || this.config.debug, c.DEBUG && Ei.info("Starting in debug mode", { this: this, config: e2, thisC: _({}, this.config), p: o2, s: a2 }), void 0 !== (null == (s2 = e2.bootstrap) ? void 0 : s2.distinctID)) {
      var u2, h2, d2 = this.config.get_device_id(wr()), v2 = null != (u2 = e2.bootstrap) && u2.isIdentifiedID ? d2 : e2.bootstrap.distinctID;
      this.persistence.set_property(de, null != (h2 = e2.bootstrap) && h2.isIdentifiedID ? "identified" : "anonymous"), this.register({ distinct_id: e2.bootstrap.distinctID, $device_id: v2 });
    }
    if (this.us()) {
      var f2, p2, g2 = Object.keys((null == (f2 = e2.bootstrap) ? void 0 : f2.featureFlags) || {}).filter(((t2) => {
        var i3;
        return !(null == (i3 = e2.bootstrap) || null == (i3 = i3.featureFlags) || !i3[t2]);
      })).reduce(((t2, i3) => {
        var r3;
        return t2[i3] = (null == (r3 = e2.bootstrap) || null == (r3 = r3.featureFlags) ? void 0 : r3[i3]) || false, t2;
      }), {}), m2 = Object.keys((null == (p2 = e2.bootstrap) ? void 0 : p2.featureFlagPayloads) || {}).filter(((t2) => g2[t2])).reduce(((t2, i3) => {
        var r3, s3;
        null != (r3 = e2.bootstrap) && null != (r3 = r3.featureFlagPayloads) && r3[i3] && (t2[i3] = null == (s3 = e2.bootstrap) || null == (s3 = s3.featureFlagPayloads) ? void 0 : s3[i3]);
        return t2;
      }), {});
      this.featureFlags.receivedFeatureFlags({ featureFlags: g2, featureFlagPayloads: m2 });
    }
    if (l2) this.register_once({ distinct_id: be, $device_id: null }, "");
    else if (!this.get_distinct_id()) {
      var b2 = this.config.get_device_id(wr());
      this.register_once({ distinct_id: b2, $device_id: b2 }, ""), this.persistence.set_property(de, "anonymous");
    }
    return zi(t, "onpagehide" in self ? "pagehide" : "unload", this._handle_unload.bind(this), { passive: false }), this.toolbar.maybeLoadToolbar(), e2.segment ? Wr(this, (() => this.hs())) : this.hs(), C(this.config._onCapture) && this.config._onCapture !== Jo && (Ei.warn("onCapture is deprecated. Please use `before_send` instead"), this.on("eventCaptured", ((t2) => this.config._onCapture(t2.event, t2)))), this.config.ip && Ei.warn('The `ip` config option has NO EFFECT AT ALL and has been deprecated. Use a custom transformation or "Discard IP data" project setting instead. See https://posthog.com/tutorials/web-redact-properties#hiding-customer-ip-address for more information.'), this;
  }
  ls(t2) {
    var i2 = performance.now();
    this.historyAutocapture = new Br(this), this.historyAutocapture.startIfEnabled();
    var e2 = [];
    e2.push((() => {
      new is(this).startIfEnabledOrStop();
    })), e2.push((() => {
      var t3;
      this.siteApps = new Oo(this), null == (t3 = this.siteApps) || t3.init();
    })), t2 || e2.push((() => {
      this.sessionRecording = new Wo(this), this.sessionRecording.startIfEnabledOrStop();
    })), this.config.disable_scroll_properties || e2.push((() => {
      this.scrollManager.startMeasuringScrollPosition();
    })), e2.push((() => {
      this.autocapture = new fr(this), this.autocapture.startIfEnabled();
    })), e2.push((() => {
      this.surveys.loadIfEnabled();
    })), e2.push((() => {
      this.logs.loadIfEnabled();
    })), e2.push((() => {
      this.conversations.loadIfEnabled();
    })), e2.push((() => {
      this.productTours = new qn(this), this.productTours.loadIfEnabled();
    })), e2.push((() => {
      this.heatmaps = new xs(this), this.heatmaps.startIfEnabled();
    })), e2.push((() => {
      this.webVitalsAutocapture = new bs(this);
    })), e2.push((() => {
      this.exceptionObserver = new zr(this), this.exceptionObserver.startIfEnabledOrStop();
    })), e2.push((() => {
      this.deadClicksAutocapture = new Nr(this, Lr), this.deadClicksAutocapture.startIfEnabledOrStop();
    })), e2.push((() => {
      if (this.ds) {
        var t3 = this.ds;
        this.ds = void 0, this.Ce(t3);
      }
    })), this.vs(e2, i2);
  }
  vs(t2, i2) {
    for (; t2.length > 0; ) {
      if (this.config.__preview_deferred_init_extensions) {
        if (performance.now() - i2 >= 30 && t2.length > 0) return void setTimeout((() => {
          this.vs(t2, i2);
        }), 0);
      }
      var e2 = t2.shift();
      if (e2) try {
        e2();
      } catch (t3) {
        Ei.error("Error initializing extension:", t3);
      }
    }
    var r2 = Math.round(performance.now() - i2);
    this.register_for_session({ $sdk_debug_extensions_init_method: this.config.__preview_deferred_init_extensions ? "deferred" : "synchronous", $sdk_debug_extensions_init_time_ms: r2 }), this.config.__preview_deferred_init_extensions && Ei.info("PostHog extensions initialized (" + r2 + "ms)");
  }
  Ce(t2) {
    var i2, e2, r2, s2, n2, a2, l2, u2, h2;
    if (!o || !o.body) return Ei.info("document not ready yet, trying again in 500 milliseconds..."), void setTimeout((() => {
      this.Ce(t2);
    }), 500);
    this.config.__preview_deferred_init_extensions && (this.ds = t2), this.compression = void 0, t2.supportedCompression && !this.config.disable_compression && (this.compression = w(t2.supportedCompression, Ss.GZipJS) ? Ss.GZipJS : w(t2.supportedCompression, Ss.Base64) ? Ss.Base64 : void 0), null != (i2 = t2.analytics) && i2.endpoint && (this.analyticsDefaultEndpoint = t2.analytics.endpoint), this.set_config({ person_profiles: this.Xr ? this.Xr : "identified_only" }), null == (e2 = this.siteApps) || e2.onRemoteConfig(t2), null == (r2 = this.sessionRecording) || r2.onRemoteConfig(t2), null == (s2 = this.autocapture) || s2.onRemoteConfig(t2), null == (n2 = this.heatmaps) || n2.onRemoteConfig(t2), this.surveys.onRemoteConfig(t2), this.logs.onRemoteConfig(t2), this.conversations.onRemoteConfig(t2), null == (a2 = this.productTours) || a2.onRemoteConfig(t2), null == (l2 = this.webVitalsAutocapture) || l2.onRemoteConfig(t2), null == (u2 = this.exceptionObserver) || u2.onRemoteConfig(t2), this.exceptions.onRemoteConfig(t2), null == (h2 = this.deadClicksAutocapture) || h2.onRemoteConfig(t2);
  }
  hs() {
    try {
      this.config.loaded(this);
    } catch (t3) {
      Ei.critical("`loaded` function failed", t3);
    }
    if (this.cs(), this.config.internal_or_test_user_hostname && null != a && a.hostname) {
      var t2 = a.hostname, i2 = this.config.internal_or_test_user_hostname;
      ("string" == typeof i2 ? t2 === i2 : i2.test(t2)) && this.setInternalOrTestUser();
    }
    this.config.capture_pageview && setTimeout((() => {
      (this.consent.isOptedIn() || "always" === this.config.cookieless_mode) && this.fs();
    }), 1), this.ps = new wo(this), this.ps.load();
  }
  cs() {
    var t2;
    this.is_capturing() && (this.config.request_batching && (null == (t2 = this.ss) || t2.enable()));
  }
  _dom_loaded() {
    this.is_capturing() && Ii(this.__request_queue, ((t2) => this.ns(t2))), this.__request_queue = [], this.cs();
  }
  _handle_unload() {
    var t2, i2;
    this.surveys.handlePageUnload(), this.config.request_batching ? (this._s() && this.capture("$pageleave"), null == (t2 = this.ss) || t2.unload(), null == (i2 = this.os) || i2.unload()) : this._s() && this.capture("$pageleave", null, { transport: "sendBeacon" });
  }
  _send_request(t2) {
    this.__loaded && (Yo ? this.__request_queue.push(t2) : this.rateLimiter.isServerRateLimited(t2.batchKey) || (t2.transport = t2.transport || this.config.api_transport, t2.url = hn(t2.url, { ip: this.config.ip ? 1 : 0 }), t2.headers = _({}, this.config.request_headers, t2.headers), t2.compression = "best-available" === t2.compression ? this.compression : t2.compression, t2.disableXHRCredentials = this.config.__preview_disable_xhr_credentials, this.config.__preview_disable_beacon && (t2.disableTransport = ["sendBeacon"]), t2.fetchOptions = t2.fetchOptions || this.config.fetch_options, ((t3) => {
      var i2, e2, r2, s2 = _({}, t3);
      s2.timeout = s2.timeout || 6e4, s2.url = hn(s2.url, { _: (/* @__PURE__ */ new Date()).getTime().toString(), ver: c.LIB_VERSION, compression: s2.compression });
      var n2 = null !== (i2 = s2.transport) && void 0 !== i2 ? i2 : "fetch", o2 = cn.filter(((t4) => !s2.disableTransport || !t4.transport || !s2.disableTransport.includes(t4.transport))), a2 = null !== (e2 = null == (r2 = Ui(o2, ((t4) => t4.transport === n2))) ? void 0 : r2.method) && void 0 !== e2 ? e2 : o2[0].method;
      if (!a2) throw new Error("No available transport method");
      a2(s2);
    })(_({}, t2, { callback: (i2) => {
      var e2, r2;
      (this.rateLimiter.checkForLimiting(i2), i2.statusCode >= 400) && (null == (e2 = (r2 = this.config).on_request_error) || e2.call(r2, i2));
      null == t2.callback || t2.callback(i2);
    } }))));
  }
  ns(t2) {
    this.os ? this.os.retriableRequest(t2) : this._send_request(t2);
  }
  _execute_array(t2) {
    Vo++;
    try {
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
    } finally {
      Vo--;
    }
  }
  us() {
    var t2, i2;
    return (null == (t2 = this.config.bootstrap) ? void 0 : t2.featureFlags) && Object.keys(null == (i2 = this.config.bootstrap) ? void 0 : i2.featureFlags).length > 0 || false;
  }
  push(t2) {
    if (Vo > 0 && I(t2) && M(t2[0])) {
      var i2 = _ta.prototype[t2[0]];
      C(i2) && i2.apply(this, t2.slice(1));
    } else this._execute_array([t2]);
  }
  capture(t2, i2, e2) {
    var r2;
    if (this.__loaded && this.persistence && this.sessionPersistence && this.ss) {
      if (this.is_capturing()) if (!O(t2) && M(t2)) {
        var s2 = !this.config.opt_out_useragent_filter && this._is_bot();
        if (!(s2 && !this.config.__preview_capture_bot_pageviews)) {
          var n2 = null != e2 && e2.skip_client_rate_limiting ? void 0 : this.rateLimiter.clientRateLimitContext();
          if (null == n2 || !n2.isRateLimited) {
            null != i2 && i2.$current_url && !M(null == i2 ? void 0 : i2.$current_url) && (Ei.error("Invalid `$current_url` property provided to `posthog.capture`. Input must be a string. Ignoring provided value."), null == i2 || delete i2.$current_url), "$exception" !== t2 || null != e2 && e2.oi || Ei.warn("Using `posthog.capture('$exception')` is unreliable because it does not attach required metadata. Use `posthog.captureException(error)` instead, which attaches required metadata automatically."), this.sessionPersistence.update_search_keyword(), this.config.save_campaign_params && this.sessionPersistence.update_campaign_params(), this.config.save_referrer && this.sessionPersistence.update_referrer_info(), (this.config.save_campaign_params || this.config.save_referrer) && this.persistence.set_initial_person_info();
            var o2 = /* @__PURE__ */ new Date(), a2 = (null == e2 ? void 0 : e2.timestamp) || o2, l2 = wr(), u2 = { uuid: l2, event: t2, properties: this.calculateEventProperties(t2, i2 || {}, a2, l2) };
            "$pageview" === t2 && this.config.__preview_capture_bot_pageviews && s2 && (u2.event = "$bot_pageview", u2.properties.$browser_type = "bot"), n2 && (u2.properties.$lib_rate_limit_remaining_tokens = n2.remainingTokens), (null == e2 ? void 0 : e2.$set) && (u2.$set = null == e2 ? void 0 : e2.$set);
            var h2, d2 = "$groupidentify" !== t2, v2 = this.gs(null == e2 ? void 0 : e2.$set_once, d2);
            if (v2 && (u2.$set_once = v2), (u2 = Di(u2, null != e2 && e2._noTruncate ? null : this.config.properties_string_max_length)).timestamp = a2, O(null == e2 ? void 0 : e2.timestamp) || (u2.properties.$event_time_override_provided = true, u2.properties.$event_time_override_system_time = o2), t2 === Zn.DISMISSED || t2 === Zn.SENT) {
              var c2 = null == i2 ? void 0 : i2[to.SURVEY_ID], f2 = null == i2 ? void 0 : i2[to.SURVEY_ITERATION];
              h2 = { id: c2, current_iteration: f2 }, localStorage.getItem(no(h2)) || localStorage.setItem(no(h2), "true"), u2.$set = _({}, u2.$set, { [so({ id: c2, current_iteration: f2 }, t2 === Zn.SENT ? "responded" : "dismissed")]: true });
            } else t2 === Zn.SHOWN && (u2.$set = _({}, u2.$set, { [to.SURVEY_LAST_SEEN_DATE]: (/* @__PURE__ */ new Date()).toISOString() }));
            var p2 = _({}, u2.properties.$set, u2.$set);
            if (F(p2) || this.setPersonPropertiesForFlags(p2), !D(this.config.before_send)) {
              var g2 = this.bs(u2);
              if (!g2) return;
              u2 = g2;
            }
            this.mi.emit("eventCaptured", u2);
            var m2 = { method: "POST", url: null !== (r2 = null == e2 ? void 0 : e2._url) && void 0 !== r2 ? r2 : this.requestRouter.endpointFor("api", this.analyticsDefaultEndpoint), data: u2, compression: "best-available", batchKey: null == e2 ? void 0 : e2._batchKey };
            return !this.config.request_batching || e2 && (null == e2 || !e2._batchKey) || null != e2 && e2.send_instantly ? this.ns(m2) : this.ss.enqueue(m2), u2;
          }
          Ei.critical("This capture call is ignored due to client rate limiting.");
        }
      } else Ei.error("No event name provided to posthog.capture");
    } else Ei.uninitializedWarning("posthog.capture");
  }
  _addCaptureHook(t2) {
    return this.on("eventCaptured", ((i2) => t2(i2.event, i2)));
  }
  calculateEventProperties(t2, i2, e2, r2, s2) {
    if (e2 = e2 || /* @__PURE__ */ new Date(), !this.persistence || !this.sessionPersistence) return i2;
    var n2 = s2 ? void 0 : this.persistence.remove_event_timer(t2), a2 = _({}, i2);
    if (a2.token = this.config.token, a2.$config_defaults = this.config.defaults, ("always" == this.config.cookieless_mode || "on_reject" == this.config.cookieless_mode && this.consent.isExplicitlyOptedOut()) && (a2.$cookieless_mode = true), "$snapshot" === t2) {
      var l2 = _({}, this.persistence.properties(), this.sessionPersistence.properties());
      return a2.distinct_id = l2.distinct_id, (!M(a2.distinct_id) && !L(a2.distinct_id) || A(a2.distinct_id)) && Ei.error("Invalid distinct_id for replay event. This indicates a bug in your implementation"), a2;
    }
    var u2, h2 = _s(this.config.mask_personal_data_properties, this.config.custom_personal_data_properties);
    if (this.sessionManager) {
      var { sessionId: v2, windowId: c2 } = this.sessionManager.checkAndGetSessionAndWindowId(s2, e2.getTime());
      a2.$session_id = v2, a2.$window_id = c2;
    }
    this.sessionPropsManager && Ri(a2, this.sessionPropsManager.getSessionProps());
    try {
      var f2;
      this.sessionRecording && Ri(a2, this.sessionRecording.sdkDebugProperties), a2.$sdk_debug_retry_queue_size = null == (f2 = this.os) ? void 0 : f2.length;
    } catch (t3) {
      a2.$sdk_debug_error_capturing_properties = String(t3);
    }
    if (this.requestRouter.region === Ao.CUSTOM && (a2.$lib_custom_api_host = this.config.api_host), u2 = "$pageview" !== t2 || s2 ? "$pageleave" !== t2 || s2 ? this.pageViewManager.doEvent() : this.pageViewManager.doPageLeave(e2) : this.pageViewManager.doPageView(e2, r2), a2 = Ri(a2, u2), "$pageview" === t2 && o && (a2.title = o.title), !O(n2)) {
      var p2 = e2.getTime() - n2;
      a2.$duration = parseFloat((p2 / 1e3).toFixed(3));
    }
    d && this.config.opt_out_useragent_filter && (a2.$browser_type = this._is_bot() ? "bot" : "browser"), (a2 = Ri({}, h2, this.persistence.properties(), this.sessionPersistence.properties(), a2)).$is_identified = this._isIdentified(), I(this.config.property_denylist) ? Ci(this.config.property_denylist, (function(t3) {
      delete a2[t3];
    })) : Ei.error("Invalid value for property_denylist config: " + this.config.property_denylist + " or property_blacklist config: " + this.config.property_blacklist);
    var g2 = this.config.sanitize_properties;
    g2 && (Ei.error("sanitize_properties is deprecated. Use before_send instead"), a2 = g2(a2, t2));
    var m2 = this.ys();
    return a2.$process_person_profile = m2, m2 && !s2 && this.ws("_calculate_event_properties"), a2;
  }
  gs(t2, i2) {
    var e2;
    if (void 0 === i2 && (i2 = true), !this.persistence || !this.ys()) return t2;
    if (this.Jr) return t2;
    var r2 = this.persistence.get_initial_props(), s2 = null == (e2 = this.sessionPropsManager) ? void 0 : e2.getSetOnceProps(), n2 = Ri({}, r2, s2 || {}, t2 || {}), o2 = this.config.sanitize_properties;
    return o2 && (Ei.error("sanitize_properties is deprecated. Use before_send instead"), n2 = o2(n2, "$set_once")), i2 && (this.Jr = true), F(n2) ? void 0 : n2;
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
  xs(t2, i2) {
    this.register({ [t2]: i2 });
  }
  getFeatureFlag(t2, i2) {
    return this.featureFlags.getFeatureFlag(t2, i2);
  }
  getFeatureFlagPayload(t2) {
    return this.featureFlags.getFeatureFlagPayload(t2);
  }
  getFeatureFlagResult(t2, i2) {
    return this.featureFlags.getFeatureFlagResult(t2, i2);
  }
  isFeatureEnabled(t2, i2) {
    return this.featureFlags.isFeatureEnabled(t2, i2);
  }
  reloadFeatureFlags() {
    this.featureFlags.reloadFeatureFlags();
  }
  updateFlags(t2, i2, e2) {
    var r2 = null != e2 && e2.merge ? this.featureFlags.getFlagVariants() : {}, s2 = null != e2 && e2.merge ? this.featureFlags.getFlagPayloads() : {}, n2 = _({}, r2, t2), o2 = _({}, s2, i2), a2 = {};
    for (var [l2, u2] of Object.entries(n2)) {
      var h2 = "string" == typeof u2;
      a2[l2] = { key: l2, enabled: !!h2 || Boolean(u2), variant: h2 ? u2 : void 0, reason: void 0, metadata: O(null == o2 ? void 0 : o2[l2]) ? void 0 : { id: 0, version: void 0, description: void 0, payload: o2[l2] } };
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
    return this.mi.on(t2, i2);
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
    void 0 === i2 && (i2 = ao), this.surveys.displaySurvey(t2, i2);
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
    if (!this.__loaded || !this.persistence) return Ei.uninitializedWarning("posthog.identify");
    if (L(t2) && (t2 = t2.toString(), Ei.warn("The first argument to posthog.identify was a number, but it should be a string. It has been converted to a string.")), t2) if (["distinct_id", "distinctid"].includes(t2.toLowerCase())) Ei.critical('The string "' + t2 + '" was set in posthog.identify which indicates an error. This ID should be unique to the user and not a hardcoded string.');
    else if (t2 !== be) {
      if (this.ws("posthog.identify")) {
        var r2 = this.get_distinct_id();
        if (this.register({ $user_id: t2 }), !this.get_property("$device_id")) {
          var s2 = r2;
          this.register_once({ $had_persisted_distinct_id: true, $device_id: s2 }, "");
        }
        t2 !== r2 && t2 !== this.get_property(Bi) && (this.unregister(Bi), this.register({ distinct_id: t2 }));
        var n2 = "anonymous" === (this.persistence.get_property(de) || "anonymous");
        t2 !== r2 && n2 ? (this.persistence.set_property(de, "identified"), this.setPersonPropertiesForFlags(_({}, e2 || {}, i2 || {}), false), this.capture("$identify", { distinct_id: t2, $anon_distinct_id: r2 }, { $set: i2 || {}, $set_once: e2 || {} }), this.Qr = pn(t2, i2, e2), this.featureFlags.setAnonymousDistinctId(r2)) : (i2 || e2) && this.setPersonProperties(i2, e2), t2 !== r2 && (this.reloadFeatureFlags(), this.unregister(ue));
      }
    } else Ei.critical('The string "' + be + '" was set in posthog.identify which indicates an error. This ID is only used as a sentinel value.');
    else Ei.error("Unique user id has not been set in posthog.identify");
  }
  setPersonProperties(t2, i2) {
    if ((t2 || i2) && this.ws("posthog.setPersonProperties")) {
      var e2 = pn(this.get_distinct_id(), t2, i2);
      this.Qr !== e2 ? (this.setPersonPropertiesForFlags(_({}, i2 || {}, t2 || {})), this.capture("$set", { $set: t2 || {}, $set_once: i2 || {} }), this.Qr = e2) : Ei.info("A duplicate setPersonProperties call was made with the same properties. It has been ignored.");
    }
  }
  group(t2, i2, e2) {
    if (t2 && i2) {
      var r2 = this.getGroups();
      r2[t2] !== i2 && this.resetGroupPropertiesForFlags(t2), this.register({ $groups: _({}, r2, { [t2]: i2 }) }), e2 && (this.capture("$groupidentify", { $group_type: t2, $group_key: i2, $group_set: e2 }), this.setGroupPropertiesForFlags({ [t2]: e2 })), r2[t2] === i2 || e2 || this.reloadFeatureFlags();
    } else Ei.error("posthog.group requires a group type and group key");
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
    void 0 === i2 && (i2 = true), this.ws("posthog.setGroupPropertiesForFlags") && this.featureFlags.setGroupPropertiesForFlags(t2, i2);
  }
  resetGroupPropertiesForFlags(t2) {
    this.featureFlags.resetGroupPropertiesForFlags(t2);
  }
  reset(t2) {
    var i2, e2, r2, s2, n2;
    if (Ei.info("reset"), !this.__loaded) return Ei.uninitializedWarning("posthog.reset");
    var o2 = this.get_property("$device_id");
    if (this.consent.reset(), null == (i2 = this.persistence) || i2.clear(), null == (e2 = this.sessionPersistence) || e2.clear(), this.surveys.reset(), null == (r2 = this.ps) || r2.stop(), this.featureFlags.reset(), null == (s2 = this.persistence) || s2.set_property(de, "anonymous"), null == (n2 = this.sessionManager) || n2.resetSessionId(), this.Qr = null, "always" === this.config.cookieless_mode) this.register_once({ distinct_id: be, $device_id: null }, "");
    else {
      var a2 = this.config.get_device_id(wr());
      this.register_once({ distinct_id: a2, $device_id: t2 ? a2 : o2 }, "");
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
    return t2 === this.get_property(Hi) ? (Ei.critical("Attempting to create alias for existing People user - aborting."), -2) : this.ws("posthog.alias") ? (O(i2) && (i2 = this.get_distinct_id()), t2 !== i2 ? (this.xs(Bi, t2), this.capture("$create_alias", { alias: t2, distinct_id: i2 })) : (Ei.warn("alias matches current distinct_id - skipping api call."), this.identify(t2), -1)) : void 0;
  }
  set_config(t2) {
    var i2 = _({}, this.config);
    if (R(t2)) {
      var e2, r2, s2, n2, o2, a2, l2, u2;
      Ri(this.config, Qo(t2));
      var h2 = this.rs();
      null == (e2 = this.persistence) || e2.update_config(this.config, i2, h2), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new zn(_({}, this.config, { persistence: "sessionStorage" }), h2);
      var d2 = this.Zr(this.config.debug);
      U(d2) && (this.config.debug = d2), U(this.config.debug) && (this.config.debug ? (c.DEBUG = true, Tr.H() && Tr.G("ph_debug", "true"), Ei.info("set_config", { config: t2, oldConfig: i2, newConfig: _({}, this.config) })) : (c.DEBUG = false, Tr.H() && Tr.V("ph_debug"))), null == (r2 = this.exceptionObserver) || r2.onConfigChange(), null == (s2 = this.sessionRecording) || s2.startIfEnabledOrStop(), null == (n2 = this.autocapture) || n2.startIfEnabled(), null == (o2 = this.heatmaps) || o2.startIfEnabled(), null == (a2 = this.exceptionObserver) || a2.startIfEnabledOrStop(), null == (l2 = this.deadClicksAutocapture) || l2.startIfEnabledOrStop(), this.surveys.loadIfEnabled(), this.$s(), null == (u2 = this.externalIntegrations) || u2.startIfEnabledOrStop();
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
    return this.exceptions.sendExceptionEvent(_({}, r2, i2));
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
    var t2, i2 = null !== (t2 = this.config.name) && void 0 !== t2 ? t2 : Ko;
    return i2 !== Ko && (i2 = Ko + "." + i2), i2;
  }
  _isIdentified() {
    var t2, i2;
    return "identified" === (null == (t2 = this.persistence) ? void 0 : t2.get_property(de)) || "identified" === (null == (i2 = this.sessionPersistence) ? void 0 : i2.get_property(de));
  }
  ys() {
    var t2, i2;
    return !("never" === this.config.person_profiles || "identified_only" === this.config.person_profiles && !this._isIdentified() && F(this.getGroups()) && (null == (t2 = this.persistence) || null == (t2 = t2.props) || !t2[Bi]) && (null == (i2 = this.persistence) || null == (i2 = i2.props) || !i2[ge]));
  }
  _s() {
    return true === this.config.capture_pageleave || "if_capture_pageview" === this.config.capture_pageleave && (true === this.config.capture_pageview || "history_change" === this.config.capture_pageview);
  }
  createPersonProfile() {
    this.ys() || this.ws("posthog.createPersonProfile") && this.setPersonProperties({}, {});
  }
  setInternalOrTestUser() {
    this.ws("posthog.setInternalOrTestUser") && this.setPersonProperties({ $internal_or_test_user: true });
  }
  ws(t2) {
    return "never" === this.config.person_profiles ? (Ei.error(t2 + ' was called, but process_person is set to "never". This call will be ignored.'), false) : (this.xs(ge, true), true);
  }
  rs() {
    if ("always" === this.config.cookieless_mode) return true;
    var t2 = this.consent.isOptedOut(), i2 = this.config.opt_out_persistence_by_default || "on_reject" === this.config.cookieless_mode;
    return this.config.disable_persistence || t2 && !!i2;
  }
  $s() {
    var t2, i2, e2, r2, s2 = this.rs();
    (null == (t2 = this.persistence) ? void 0 : t2.ki) !== s2 && (null == (e2 = this.persistence) || e2.set_disabled(s2));
    (null == (i2 = this.sessionPersistence) ? void 0 : i2.ki) !== s2 && (null == (r2 = this.sessionPersistence) || r2.set_disabled(s2));
    return s2;
  }
  opt_in_capturing(t2) {
    var i2;
    if ("always" !== this.config.cookieless_mode) {
      var e2, r2, s2;
      if ("on_reject" === this.config.cookieless_mode && this.consent.isExplicitlyOptedOut()) this.reset(true), null == (e2 = this.sessionManager) || e2.destroy(), null == (r2 = this.pageViewManager) || r2.destroy(), this.sessionManager = new Co(this), this.pageViewManager = new $s(this), this.persistence && (this.sessionPropsManager = new To(this, this.sessionManager, this.persistence)), this.sessionRecording = new Wo(this), this.sessionRecording.startIfEnabledOrStop();
      if (this.consent.optInOut(true), this.$s(), this.cs(), null == (i2 = this.sessionRecording) || i2.startIfEnabledOrStop(), "on_reject" == this.config.cookieless_mode && this.surveys.loadIfEnabled(), O(null == t2 ? void 0 : t2.captureEventName) || null != t2 && t2.captureEventName) this.capture(null !== (s2 = null == t2 ? void 0 : t2.captureEventName) && void 0 !== s2 ? s2 : "$opt_in", null == t2 ? void 0 : t2.captureProperties, { send_instantly: true });
      this.config.capture_pageview && this.fs();
    } else Ei.warn('Consent opt in/out is not valid with cookieless_mode="always" and will be ignored');
  }
  opt_out_capturing() {
    var t2, i2, e2;
    "always" !== this.config.cookieless_mode ? ("on_reject" === this.config.cookieless_mode && this.consent.isOptedIn() && this.reset(true), this.consent.optInOut(false), this.$s(), "on_reject" === this.config.cookieless_mode && (this.register({ distinct_id: be, $device_id: null }), null == (t2 = this.sessionManager) || t2.destroy(), null == (i2 = this.pageViewManager) || i2.destroy(), this.sessionManager = void 0, this.sessionPropsManager = void 0, null == (e2 = this.sessionRecording) || e2.stopRecording(), this.sessionRecording = void 0, this.fs())) : Ei.warn('Consent opt in/out is not valid with cookieless_mode="always" and will be ignored');
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
    this.consent.reset(), this.$s();
  }
  _is_bot() {
    return n ? Mo(n, this.config.custom_blocked_useragents) : void 0;
  }
  fs() {
    o && ("visible" === o.visibilityState ? this.Kr || (this.Kr = true, this.capture("$pageview", { title: o.title }, { send_instantly: true }), this.Yr && (o.removeEventListener("visibilitychange", this.Yr), this.Yr = null)) : this.Yr || (this.Yr = this.fs.bind(this), zi(o, "visibilitychange", this.Yr)));
  }
  debug(i2) {
    false === i2 ? (null == t || t.console.log("You've disabled debug mode."), this.set_config({ debug: false })) : (null == t || t.console.log("You're now in debug mode. All calls to PostHog will be logged in your console.\nYou can disable this with `posthog.debug(false)`."), this.set_config({ debug: true }));
  }
  M() {
    var t2, i2, e2, r2, s2, n2, o2, a2 = this.ts || {};
    return "advanced_disable_flags" in a2 ? !!a2.advanced_disable_flags : false !== this.config.advanced_disable_flags ? !!this.config.advanced_disable_flags : true === this.config.advanced_disable_decide ? (Ei.warn("Config field 'advanced_disable_decide' is deprecated. Please use 'advanced_disable_flags' instead. The old field will be removed in a future major version."), true) : (e2 = "advanced_disable_decide", r2 = false, s2 = Ei, n2 = (i2 = "advanced_disable_flags") in (t2 = a2) && !D(t2[i2]), o2 = e2 in t2 && !D(t2[e2]), n2 ? t2[i2] : o2 ? (s2 && s2.warn("Config field '" + e2 + "' is deprecated. Please use '" + i2 + "' instead. The old field will be removed in a future major version."), t2[e2]) : r2);
  }
  bs(t2) {
    if (D(this.config.before_send)) return t2;
    var i2 = I(this.config.before_send) ? this.config.before_send : [this.config.before_send], e2 = t2;
    for (var r2 of i2) {
      if (e2 = r2(e2), D(e2)) {
        var s2 = "Event '" + t2.event + "' was rejected in beforeSend function";
        return H(t2.event) ? Ei.warn(s2 + ". This can cause unexpected behavior.") : Ei.info(s2), null;
      }
      e2.properties && !F(e2.properties) || Ei.warn("Event '" + t2.event + "' has no properties after beforeSend function, this is likely an error.");
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
  Zr(t2) {
    var i2 = U(t2) && !t2, e2 = Tr.H() && "true" === Tr.q("ph_debug");
    return !i2 && (!!e2 || t2);
  }
};
!(function(t2, i2) {
  for (var e2 = 0; e2 < i2.length; e2++) t2.prototype[i2[e2]] = Ai(t2.prototype[i2[e2]]);
})(ta, ["identify"]);
var ia;
var ea = { backgroundColor: "#ffffff", textColor: "#1d1f27", buttonColor: "#1d1f27", borderRadius: 8, buttonBorderRadius: 6, borderColor: "#e5e7eb", fontFamily: "system-ui", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", showOverlay: true, whiteLabel: false, dismissOnClickOutside: true, zIndex: 2147483646 };
var ra = (function(t2) {
  return t2.SHOWN = "product tour shown", t2.DISMISSED = "product tour dismissed", t2.COMPLETED = "product tour completed", t2.STEP_SHOWN = "product tour step shown", t2.STEP_COMPLETED = "product tour step completed", t2.BUTTON_CLICKED = "product tour button clicked", t2.STEP_SELECTOR_FAILED = "product tour step selector failed", t2.BANNER_CONTAINER_SELECTOR_FAILED = "product tour banner container selector failed", t2.BANNER_ACTION_CLICKED = "product tour banner action clicked", t2;
})({});
var sa = (function(t2) {
  return t2.TOUR_ID = "$product_tour_id", t2.TOUR_NAME = "$product_tour_name", t2.TOUR_ITERATION = "$product_tour_iteration", t2.TOUR_RENDER_REASON = "$product_tour_render_reason", t2.TOUR_STEP_ID = "$product_tour_step_id", t2.TOUR_STEP_ORDER = "$product_tour_step_order", t2.TOUR_STEP_TYPE = "$product_tour_step_type", t2.TOUR_DISMISS_REASON = "$product_tour_dismiss_reason", t2.TOUR_BUTTON_TEXT = "$product_tour_button_text", t2.TOUR_BUTTON_ACTION = "$product_tour_button_action", t2.TOUR_BUTTON_LINK = "$product_tour_button_link", t2.TOUR_BUTTON_TOUR_ID = "$product_tour_button_tour_id", t2.TOUR_STEPS_COUNT = "$product_tour_steps_count", t2.TOUR_STEP_SELECTOR = "$product_tour_step_selector", t2.TOUR_STEP_SELECTOR_FOUND = "$product_tour_step_selector_found", t2.TOUR_STEP_ELEMENT_TAG = "$product_tour_step_element_tag", t2.TOUR_STEP_ELEMENT_ID = "$product_tour_step_element_id", t2.TOUR_STEP_ELEMENT_CLASSES = "$product_tour_step_element_classes", t2.TOUR_STEP_ELEMENT_TEXT = "$product_tour_step_element_text", t2.TOUR_ERROR = "$product_tour_error", t2.TOUR_MATCHES_COUNT = "$product_tour_matches_count", t2.TOUR_FAILURE_PHASE = "$product_tour_failure_phase", t2.TOUR_WAITED_FOR_ELEMENT = "$product_tour_waited_for_element", t2.TOUR_WAIT_DURATION_MS = "$product_tour_wait_duration_ms", t2.TOUR_BANNER_SELECTOR = "$product_tour_banner_selector", t2.TOUR_LINKED_SURVEY_ID = "$product_tour_linked_survey_id", t2.USE_MANUAL_SELECTOR = "$use_manual_selector", t2.INFERENCE_DATA_PRESENT = "$inference_data_present", t2;
})({});
var na = (ia = Go[Ko] = new ta(), (function() {
  function i2() {
    i2.done || (i2.done = true, Yo = false, Ci(Go, (function(t2) {
      t2._dom_loaded();
    })));
  }
  null != o && o.addEventListener ? "complete" === o.readyState ? i2() : zi(o, "DOMContentLoaded", i2, { capture: false }) : t && Ei.error("Browser doesn't support `document.addEventListener` so PostHog couldn't be initialized");
})(), ia);
export {
  Ss as Compression,
  ea as DEFAULT_PRODUCT_TOUR_APPEARANCE,
  io as DisplaySurveyType,
  ta as PostHog,
  ra as ProductTourEventName,
  sa as ProductTourEventProperties,
  Zn as SurveyEventName,
  to as SurveyEventProperties,
  Wn as SurveyEventType,
  Vn as SurveyPosition,
  Xn as SurveyQuestionBranchingType,
  Yn as SurveyQuestionType,
  Qn as SurveySchedule,
  Jn as SurveyTabPosition,
  Kn as SurveyType,
  Gn as SurveyWidgetType,
  na as default,
  na as posthog,
  Es as severityLevels
};
//# sourceMappingURL=posthog-js.js.map
