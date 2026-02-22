import {
  RepairRepository
} from "./chunk-37JUCHEQ.js";
import {
  AuthService
} from "./chunk-MZTEREIC.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-R5Q6TR54.js";
import "./chunk-4WZKXYCH.js";
import {
  environment
} from "./chunk-TCBIYFRD.js";
import {
  ActivatedRoute,
  CommonModule,
  DatePipe,
  DecimalPipe,
  DomSanitizer,
  Router,
  RouterLink
} from "./chunk-3EP36GV6.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
  Renderer2,
  ViewChild,
  firstValueFrom,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElement,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-TQTEFGZE.js";
import {
  __commonJS,
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-46DXP6YY.js";

// node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/qrcode/lib/can-promise.js"(exports, module) {
    "use strict";
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    "use strict";
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    "use strict";
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    "use strict";
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    "use strict";
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    "use strict";
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    "use strict";
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    "use strict";
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    "use strict";
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    "use strict";
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    "use strict";
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    "use strict";
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    "use strict";
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    "use strict";
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    "use strict";
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString2(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    "use strict";
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/qrcode/lib/renderer/utils.js"(exports) {
    "use strict";
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    "use strict";
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    "use strict";
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/qrcode/lib/browser.js"(exports) {
    "use strict";
    var canPromise = require_can_promise();
    var QRCode = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// src/app/core/services/company.service.ts
var CompanyService = class _CompanyService {
  auth = inject(AuthService);
  supabase = this.auth.getSupabaseClient();
  async getSettings() {
    const { data, error } = await this.supabase.from("company_settings").select("*").maybeSingle();
    if (error)
      throw error;
    return data;
  }
  static \u0275fac = function CompanyService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CompanyService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CompanyService, factory: _CompanyService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompanyService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/repairs/application/services/admin-repair.service.ts
var AdminRepairService = class _AdminRepairService {
  repository = inject(RepairRepository);
  // Status IDs Mapping (Standardized)
  STATUS_COMPLETED = 4;
  STATUS_DELIVERED = 5;
  async getById(id) {
    return firstValueFrom(this.repository.getById(id));
  }
  async create(dto) {
    const payload = __spreadValues({}, dto);
    if (!payload.tracking_code) {
      payload.tracking_code = this.generateTrackingCode();
    }
    if (this.isFinalStatus(payload.current_status_id)) {
      payload.completed_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    return firstValueFrom(this.repository.create(payload));
  }
  async update(id, dto) {
    const payload = __spreadValues({}, dto);
    if (payload.current_status_id && this.isFinalStatus(payload.current_status_id)) {
      payload.completed_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    await firstValueFrom(this.repository.update(id, payload));
  }
  async uploadImage(file) {
    return this.repository.uploadImage(file);
  }
  generateTrackingCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
  }
  isFinalStatus(statusId) {
    return statusId === this.STATUS_COMPLETED || statusId === this.STATUS_DELIVERED;
  }
  static \u0275fac = function AdminRepairService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminRepairService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminRepairService, factory: _AdminRepairService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminRepairService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/repairs/domain/entities/repair.entity.ts
var RepairStatus;
(function(RepairStatus2) {
  RepairStatus2[RepairStatus2["PENDING"] = 1] = "PENDING";
  RepairStatus2[RepairStatus2["IN_PROGRESS"] = 2] = "IN_PROGRESS";
  RepairStatus2[RepairStatus2["WAITING_PARTS"] = 3] = "WAITING_PARTS";
  RepairStatus2[RepairStatus2["COMPLETED"] = 4] = "COMPLETED";
  RepairStatus2[RepairStatus2["DELIVERED"] = 5] = "DELIVERED";
  RepairStatus2[RepairStatus2["CANCELLED"] = 6] = "CANCELLED";
})(RepairStatus || (RepairStatus = {}));

// node_modules/angularx-qrcode/fesm2022/angularx-qrcode.mjs
var import_qrcode = __toESM(require_browser(), 1);
var _c0 = ["qrcElement"];
var QRCodeComponent = class _QRCodeComponent {
  allowEmptyString = false;
  colorDark = "#000000ff";
  colorLight = "#ffffffff";
  cssClass = "qrcode";
  elementType = "canvas";
  errorCorrectionLevel = "M";
  imageSrc;
  imageHeight;
  imageWidth;
  margin = 4;
  qrdata = "";
  scale = 4;
  version;
  width = 10;
  // Accessibility features introduced in 13.0.4+
  alt;
  ariaLabel;
  title;
  qrCodeURL = new EventEmitter();
  qrcElement;
  context = null;
  centerImage;
  renderer = inject(Renderer2);
  sanitizer = inject(DomSanitizer);
  async ngOnChanges() {
    await this.createQRCode();
  }
  isValidQrCodeText(data) {
    if (this.allowEmptyString === false) {
      return !(typeof data === "undefined" || data === "" || data === "null" || data === null);
    }
    return !(typeof data === "undefined");
  }
  toDataURL(qrCodeConfig) {
    return new Promise((resolve, reject) => {
      (0, import_qrcode.toDataURL)(this.qrdata, qrCodeConfig, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }
  toCanvas(canvas, qrCodeConfig) {
    return new Promise((resolve, reject) => {
      (0, import_qrcode.toCanvas)(canvas, this.qrdata, qrCodeConfig, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve("success");
        }
      });
    });
  }
  toSVG(qrCodeConfig) {
    return new Promise((resolve, reject) => {
      (0, import_qrcode.toString)(this.qrdata, qrCodeConfig, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }
  renderElement(element) {
    for (const node of this.qrcElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcElement.nativeElement, node);
    }
    this.renderer.appendChild(this.qrcElement.nativeElement, element);
  }
  async createQRCode() {
    if (this.version && this.version > 40) {
      console.warn("[angularx-qrcode] max value for `version` is 40");
      this.version = 40;
    } else if (this.version && this.version < 1) {
      console.warn("[angularx-qrcode]`min value for `version` is 1");
      this.version = 1;
    } else if (this.version !== void 0 && isNaN(this.version)) {
      console.warn("[angularx-qrcode] version should be a number, defaulting to auto.");
      this.version = void 0;
    }
    try {
      if (!this.isValidQrCodeText(this.qrdata)) {
        throw new Error("[angularx-qrcode] Field `qrdata` is empty, set 'allowEmptyString=\"true\"' to overwrite this behaviour.");
      }
      if (this.isValidQrCodeText(this.qrdata) && this.qrdata === "") {
        this.qrdata = " ";
      }
      const config = {
        color: {
          dark: this.colorDark,
          light: this.colorLight
        },
        errorCorrectionLevel: this.errorCorrectionLevel,
        margin: this.margin,
        scale: this.scale,
        version: this.version,
        width: this.width
      };
      const centerImageSrc = this.imageSrc;
      const centerImageHeight = this.imageHeight ? +this.imageHeight : 40;
      const centerImageWidth = this.imageWidth ? +this.imageWidth : 40;
      switch (this.elementType) {
        case "canvas": {
          const canvasElement = this.renderer.createElement("canvas");
          this.context = canvasElement.getContext("2d");
          this.toCanvas(canvasElement, config).then(() => {
            if (this.ariaLabel) {
              this.renderer.setAttribute(canvasElement, "aria-label", `${this.ariaLabel}`);
            }
            if (this.title) {
              this.renderer.setAttribute(canvasElement, "title", `${this.title}`);
            }
            if (centerImageSrc && this.context) {
              this.centerImage = new Image(centerImageWidth, centerImageHeight);
              if (centerImageSrc !== this.centerImage.src) {
                this.centerImage.crossOrigin = "anonymous";
                this.centerImage.src = centerImageSrc;
              }
              if (centerImageHeight !== this.centerImage.height) {
                this.centerImage.height = centerImageHeight;
              }
              if (centerImageWidth !== this.centerImage.width) {
                this.centerImage.width = centerImageWidth;
              }
              const centerImage = this.centerImage;
              if (centerImage) {
                centerImage.onload = () => {
                  this.context?.drawImage(centerImage, canvasElement.width / 2 - centerImageWidth / 2, canvasElement.height / 2 - centerImageHeight / 2, centerImageWidth, centerImageHeight);
                };
              }
            }
            this.renderElement(canvasElement);
            this.emitQRCodeURL(canvasElement);
          }).catch((e) => {
            console.error("[angularx-qrcode] canvas error:", e);
          });
          break;
        }
        case "svg": {
          const svgParentElement = this.renderer.createElement("div");
          this.toSVG(config).then((svgString) => {
            this.renderer.setProperty(svgParentElement, "innerHTML", svgString);
            const svgElement = svgParentElement.firstChild;
            this.renderer.setAttribute(svgElement, "height", `${this.width}`);
            this.renderer.setAttribute(svgElement, "width", `${this.width}`);
            this.renderElement(svgElement);
            this.emitQRCodeURL(svgElement);
          }).catch((e) => {
            console.error("[angularx-qrcode] svg error:", e);
          });
          break;
        }
        case "url":
        case "img":
        default: {
          const imgElement = this.renderer.createElement("img");
          this.toDataURL(config).then((dataUrl) => {
            if (this.alt) {
              imgElement.setAttribute("alt", this.alt);
            }
            if (this.ariaLabel) {
              imgElement.setAttribute("aria-label", this.ariaLabel);
            }
            imgElement.setAttribute("src", dataUrl);
            if (this.title) {
              imgElement.setAttribute("title", this.title);
            }
            this.renderElement(imgElement);
            this.emitQRCodeURL(imgElement);
          }).catch((e) => {
            console.error("[angularx-qrcode] img/url error:", e);
          });
        }
      }
    } catch (e) {
      console.error("[angularx-qrcode] Error generating QR Code:", e.message);
    }
  }
  convertBase64ImageUrlToBlob(base64ImageUrl) {
    const parts = base64ImageUrl.split(";base64,");
    const imageType = parts[0].split(":")[1];
    const decodedData = atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
      type: imageType
    });
  }
  emitQRCodeURL(element) {
    const className = element.constructor.name;
    if (className === SVGSVGElement.name) {
      const svgHTML = element.outerHTML;
      const blob = new Blob([svgHTML], {
        type: "image/svg+xml"
      });
      const urlSvg = URL.createObjectURL(blob);
      const urlSanitized2 = this.sanitizer.bypassSecurityTrustUrl(urlSvg);
      this.qrCodeURL.emit(urlSanitized2);
      return;
    }
    let urlImage = "";
    if (className === HTMLCanvasElement.name) {
      urlImage = element.toDataURL("image/png");
    }
    if (className === HTMLImageElement.name) {
      urlImage = element.src;
    }
    const blobData = this.convertBase64ImageUrlToBlob(urlImage);
    const urlBlob = URL.createObjectURL(blobData);
    const urlSanitized = this.sanitizer.bypassSecurityTrustUrl(urlBlob);
    this.qrCodeURL.emit(urlSanitized);
  }
  static \u0275fac = function QRCodeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _QRCodeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _QRCodeComponent,
    selectors: [["qrcode"]],
    viewQuery: function QRCodeComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 7);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.qrcElement = _t.first);
      }
    },
    inputs: {
      allowEmptyString: "allowEmptyString",
      colorDark: "colorDark",
      colorLight: "colorLight",
      cssClass: "cssClass",
      elementType: "elementType",
      errorCorrectionLevel: "errorCorrectionLevel",
      imageSrc: "imageSrc",
      imageHeight: "imageHeight",
      imageWidth: "imageWidth",
      margin: "margin",
      qrdata: "qrdata",
      scale: "scale",
      version: "version",
      width: "width",
      alt: "alt",
      ariaLabel: "ariaLabel",
      title: "title"
    },
    outputs: {
      qrCodeURL: "qrCodeURL"
    },
    features: [\u0275\u0275NgOnChangesFeature],
    decls: 2,
    vars: 2,
    consts: [["qrcElement", ""]],
    template: function QRCodeComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275domElement(0, "div", null, 0);
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.cssClass);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QRCodeComponent, [{
    type: Component,
    args: [{
      // eslint-disable-next-line @angular-eslint/component-selector
      selector: "qrcode",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<div #qrcElement [class]="cssClass"></div>`
    }]
  }], null, {
    allowEmptyString: [{
      type: Input
    }],
    colorDark: [{
      type: Input
    }],
    colorLight: [{
      type: Input
    }],
    cssClass: [{
      type: Input
    }],
    elementType: [{
      type: Input
    }],
    errorCorrectionLevel: [{
      type: Input
    }],
    imageSrc: [{
      type: Input
    }],
    imageHeight: [{
      type: Input
    }],
    imageWidth: [{
      type: Input
    }],
    margin: [{
      type: Input
    }],
    qrdata: [{
      type: Input
    }],
    scale: [{
      type: Input
    }],
    version: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    alt: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    qrCodeURL: [{
      type: Output
    }],
    qrcElement: [{
      type: ViewChild,
      args: ["qrcElement", {
        static: true
      }]
    }]
  });
})();

// src/app/admin/repairs/admin-repair-form-page.ts
function AdminRepairFormPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "span", 53);
    \u0275\u0275elementEnd();
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70);
    \u0275\u0275element(1, "span", 103);
    \u0275\u0275text(2, " Subiendo im\xE1genes... ");
    \u0275\u0275elementEnd();
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_38_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 104);
    \u0275\u0275element(1, "img", 105);
    \u0275\u0275elementStart(2, "button", 106);
    \u0275\u0275listener("click", function AdminRepairFormPage_Conditional_9_Conditional_38_For_2_Template_button_click_2_listener() {
      const \u0275$index_100_r4 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeImage(\u0275$index_100_r4));
    });
    \u0275\u0275element(3, "i", 107);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const img_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", img_r5, \u0275\u0275sanitizeUrl);
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 71);
    \u0275\u0275repeaterCreate(1, AdminRepairFormPage_Conditional_9_Conditional_38_For_2_Template, 4, 1, "div", 104, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.form().images);
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_132_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 96);
    \u0275\u0275element(1, "i", 108);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_134_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 109);
    \u0275\u0275listener("click", function AdminRepairFormPage_Conditional_9_Conditional_134_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.shareWhatsApp());
    });
    \u0275\u0275element(1, "i", 110);
    \u0275\u0275text(2, " Compartir ");
    \u0275\u0275elementEnd();
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_141_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 103);
  }
}
function AdminRepairFormPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 54);
    \u0275\u0275listener("ngSubmit", function AdminRepairFormPage_Conditional_9_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.save());
    });
    \u0275\u0275elementStart(1, "div", 55)(2, "div", 56)(3, "label", 57)(4, "span", 58);
    \u0275\u0275text(5, "Nombre del Cliente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "label", 59);
    \u0275\u0275element(7, "i", 60);
    \u0275\u0275elementStart(8, "input", 61);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().customer_name, $event) || (ctx_r1.form().customer_name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 56)(10, "label", 57)(11, "span", 58);
    \u0275\u0275text(12, "Tel\xE9fono");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "label", 59);
    \u0275\u0275element(14, "i", 62);
    \u0275\u0275elementStart(15, "input", 63);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().customer_phone, $event) || (ctx_r1.form().customer_phone = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(16, "div", 55)(17, "div", 56)(18, "label", 57)(19, "span", 58);
    \u0275\u0275text(20, "Modelo del Dispositivo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "label", 59);
    \u0275\u0275element(22, "i", 64);
    \u0275\u0275elementStart(23, "input", 65);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().device_model, $event) || (ctx_r1.form().device_model = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 56)(25, "label", 57)(26, "span", 58);
    \u0275\u0275text(27, "IMEI / Serie");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "label", 59);
    \u0275\u0275element(29, "i", 66);
    \u0275\u0275elementStart(30, "input", 67);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().imei, $event) || (ctx_r1.form().imei = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(31, "div", 56)(32, "label", 57)(33, "span", 58);
    \u0275\u0275text(34, "Im\xE1genes del Equipo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 68)(36, "input", 69);
    \u0275\u0275listener("change", function AdminRepairFormPage_Conditional_9_Template_input_change_36_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFileSelected($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(37, AdminRepairFormPage_Conditional_9_Conditional_37_Template, 3, 0, "div", 70);
    \u0275\u0275conditionalCreate(38, AdminRepairFormPage_Conditional_9_Conditional_38_Template, 3, 0, "div", 71);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div", 56)(40, "label", 57)(41, "span", 58);
    \u0275\u0275text(42, "Descripci\xF3n del Problema");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "textarea", 72);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_textarea_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().issue_description, $event) || (ctx_r1.form().issue_description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div", 73);
    \u0275\u0275text(45, "Detalles del Equipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 56)(47, "label", 57)(48, "span", 58);
    \u0275\u0275text(49, "Accesorios Recibidos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 74)(51, "label", 75)(52, "input", 76);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_52_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.charger, $event) || (ctx_r1.form().checklist.charger = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 77);
    \u0275\u0275text(54, "Cargador");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "label", 75)(56, "input", 78);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_56_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.battery, $event) || (ctx_r1.form().checklist.battery = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "span", 77);
    \u0275\u0275text(58, "Bater\xEDa");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "label", 75)(60, "input", 79);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_60_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.chip, $event) || (ctx_r1.form().checklist.chip = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "span", 77);
    \u0275\u0275text(62, "Chip");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "label", 75)(64, "input", 80);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_64_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.sd, $event) || (ctx_r1.form().checklist.sd = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "span", 77);
    \u0275\u0275text(66, "Tarjeta SD");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "label", 75)(68, "input", 81);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_68_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.case, $event) || (ctx_r1.form().checklist.case = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "span", 77);
    \u0275\u0275text(70, "Funda");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(71, "div", 55)(72, "div", 56)(73, "label", 57)(74, "span", 58);
    \u0275\u0275text(75, "PIN / Contrase\xF1a");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "label", 59);
    \u0275\u0275element(77, "i", 82);
    \u0275\u0275elementStart(78, "input", 83);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_78_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().security_pin, $event) || (ctx_r1.form().security_pin = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(79, "div", 56)(80, "label", 57)(81, "span", 58);
    \u0275\u0275text(82, "Patr\xF3n de Desbloqueo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(83, "label", 59);
    \u0275\u0275element(84, "i", 84);
    \u0275\u0275elementStart(85, "input", 85);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_85_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().security_pattern, $event) || (ctx_r1.form().security_pattern = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(86, "div", 73);
    \u0275\u0275text(87, "Estado y Costos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "div", 86)(89, "div", 56)(90, "label", 57)(91, "span", 58);
    \u0275\u0275text(92, "Estado");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(93, "select", 87);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_select_ngModelChange_93_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().current_status_id, $event) || (ctx_r1.form().current_status_id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(94, "option", 88);
    \u0275\u0275text(95, "Pendiente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "option", 88);
    \u0275\u0275text(97, "En Progreso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "option", 88);
    \u0275\u0275text(99, "Esperando Repuestos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "option", 88);
    \u0275\u0275text(101, "Completado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "option", 88);
    \u0275\u0275text(103, "Entregado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "option", 88);
    \u0275\u0275text(105, "Cancelado");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(106, "div", 56)(107, "label", 57)(108, "span", 58);
    \u0275\u0275text(109, "Costo Estimado");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(110, "label", 59);
    \u0275\u0275element(111, "i", 89);
    \u0275\u0275elementStart(112, "input", 90);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_112_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().estimated_cost, $event) || (ctx_r1.form().estimated_cost = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(113, "div", 56)(114, "label", 57)(115, "span", 58);
    \u0275\u0275text(116, "Se\xF1a / Adelanto");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(117, "label", 59);
    \u0275\u0275element(118, "i", 91);
    \u0275\u0275elementStart(119, "input", 92);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_119_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().deposit_amount, $event) || (ctx_r1.form().deposit_amount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(120, "div", 56)(121, "label", 57)(122, "span", 58);
    \u0275\u0275text(123, "Costo Final");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(124, "label", 59);
    \u0275\u0275element(125, "i", 93);
    \u0275\u0275elementStart(126, "input", 94);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_126_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().final_cost, $event) || (ctx_r1.form().final_cost = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(127, "div", 56)(128, "label", 57)(129, "span", 58);
    \u0275\u0275text(130, "Notas del T\xE9cnico (Interno)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(131, "textarea", 95);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_textarea_ngModelChange_131_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().technician_notes, $event) || (ctx_r1.form().technician_notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(132, AdminRepairFormPage_Conditional_9_Conditional_132_Template, 4, 1, "div", 96);
    \u0275\u0275elementStart(133, "div", 97);
    \u0275\u0275conditionalCreate(134, AdminRepairFormPage_Conditional_9_Conditional_134_Template, 3, 0, "button", 98);
    \u0275\u0275elementStart(135, "button", 99);
    \u0275\u0275listener("click", function AdminRepairFormPage_Conditional_9_Template_button_click_135_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.printOrder());
    });
    \u0275\u0275element(136, "i", 100);
    \u0275\u0275text(137, " Imprimir Orden ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "a", 101);
    \u0275\u0275text(139, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(140, "button", 102);
    \u0275\u0275conditionalCreate(141, AdminRepairFormPage_Conditional_9_Conditional_141_Template, 1, 0, "span", 103);
    \u0275\u0275text(142, " Guardar Reparaci\xF3n ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().customer_name);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().customer_phone);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().device_model);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().imei);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.uploadingImages());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.uploadingImages() ? 37 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.form().images.length > 0 ? 38 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().issue_description);
    \u0275\u0275advance(8);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.charger)("border-primary", ctx_r1.form().checklist.charger)("text-primary", ctx_r1.form().checklist.charger)("bg-gray-100", !ctx_r1.form().checklist.charger)("border-gray-300", !ctx_r1.form().checklist.charger)("text-gray-700", !ctx_r1.form().checklist.charger);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.charger);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.battery)("border-primary", ctx_r1.form().checklist.battery)("text-primary", ctx_r1.form().checklist.battery)("bg-gray-100", !ctx_r1.form().checklist.battery)("border-gray-300", !ctx_r1.form().checklist.battery)("text-gray-700", !ctx_r1.form().checklist.battery);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.battery);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.chip)("border-primary", ctx_r1.form().checklist.chip)("text-primary", ctx_r1.form().checklist.chip)("bg-gray-100", !ctx_r1.form().checklist.chip)("border-gray-300", !ctx_r1.form().checklist.chip)("text-gray-700", !ctx_r1.form().checklist.chip);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.chip);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.sd)("border-primary", ctx_r1.form().checklist.sd)("text-primary", ctx_r1.form().checklist.sd)("bg-gray-100", !ctx_r1.form().checklist.sd)("border-gray-300", !ctx_r1.form().checklist.sd)("text-gray-700", !ctx_r1.form().checklist.sd);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.sd);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.case)("border-primary", ctx_r1.form().checklist.case)("text-primary", ctx_r1.form().checklist.case)("bg-gray-100", !ctx_r1.form().checklist.case)("border-gray-300", !ctx_r1.form().checklist.case)("text-gray-700", !ctx_r1.form().checklist.case);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.case);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().security_pin);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().security_pattern);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().current_status_id);
    \u0275\u0275advance();
    \u0275\u0275property("value", 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 2);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 3);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 4);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 5);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 6);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().estimated_cost);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().deposit_amount);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().final_cost);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().technician_notes);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.error() ? 132 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.id && ctx_r1.form().tracking_code ? 134 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.saving());
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r1.saving() || !ctx_r1.form().customer_name || !ctx_r1.form().device_model);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.saving() ? 141 : -1);
  }
}
function AdminRepairFormPage_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 14);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r1.company().logo_url, \u0275\u0275sanitizeUrl);
  }
}
function AdminRepairFormPage_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "qrcode", 19);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("qrdata", ctx_r1.getTrackingUrl())("width", 60)("margin", 0)("errorCorrectionLevel", "M");
  }
}
var AdminRepairFormPage = class _AdminRepairFormPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  companyService = inject(CompanyService);
  repairService = inject(AdminRepairService);
  id = null;
  date = /* @__PURE__ */ new Date();
  // Initial form state matching entity structure
  initialFormState = {
    customer_name: "",
    customer_phone: "",
    device_model: "",
    device_type: "smartphone",
    // Default
    device_brand: "generic",
    // Default
    imei: "",
    issue_description: "",
    current_status_id: RepairStatus.PENDING,
    estimated_cost: 0,
    final_cost: 0,
    technician_notes: "",
    checklist: {
      charger: false,
      battery: false,
      chip: false,
      sd: false,
      case: false
    },
    security_pin: "",
    security_pattern: "",
    deposit_amount: 0,
    tracking_code: "",
    repair_number: 0,
    images: []
  };
  form = signal(__spreadValues({}, this.initialFormState), ...ngDevMode ? [{ debugName: "form" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  company = signal(null, ...ngDevMode ? [{ debugName: "company" }] : []);
  uploadingImages = signal(false, ...ngDevMode ? [{ debugName: "uploadingImages" }] : []);
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    await this.loadCompanySettings();
    if (this.id) {
      await this.loadRepair();
    }
    this.loading.set(false);
  }
  async onFileSelected(event) {
    const input = event.target;
    const files = input.files;
    if (!files || files.length === 0)
      return;
    this.uploadingImages.set(true);
    const uploadedUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const url = await this.repairService.uploadImage(file);
          uploadedUrls.push(url);
        }
      }
      this.form.update((f) => __spreadProps(__spreadValues({}, f), {
        images: [...f.images, ...uploadedUrls]
      }));
    } catch (e) {
      console.error("Error uploading images:", e);
      const message = e instanceof Error ? e.message : "Unknown error";
      this.error.set("Error al subir im\xE1genes: " + message);
    } finally {
      this.uploadingImages.set(false);
      input.value = "";
    }
  }
  removeImage(index) {
    this.form.update((f) => {
      const newImages = [...f.images];
      newImages.splice(index, 1);
      return __spreadProps(__spreadValues({}, f), { images: newImages });
    });
  }
  async loadCompanySettings() {
    try {
      const data = await this.companyService.getSettings();
      if (data) {
        this.company.set(data);
      }
    } catch (error) {
      console.error("Error loading company settings", error);
    }
  }
  async loadRepair() {
    if (!this.id)
      return;
    try {
      const data = await this.repairService.getById(this.id);
      if (data) {
        this.form.set({
          customer_name: data.customer_name || "",
          customer_phone: data.customer_phone || "",
          device_model: data.device_model || "",
          device_type: data.device_type || "smartphone",
          device_brand: data.device_brand || "generic",
          imei: data.imei || "",
          issue_description: data.issue_description || "",
          current_status_id: data.current_status_id,
          estimated_cost: data.estimated_cost || 0,
          final_cost: data.final_cost || 0,
          technician_notes: data.technician_notes || "",
          checklist: data.checklist || this.initialFormState.checklist,
          security_pin: data.security_pin || "",
          security_pattern: data.security_pattern || "",
          deposit_amount: data.deposit_amount || 0,
          tracking_code: data.tracking_code,
          repair_number: data.repair_number || 0,
          images: data.images || []
        });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      this.error.set("Error cargando reparaci\xF3n: " + message);
    }
  }
  async save() {
    this.saving.set(true);
    this.error.set(null);
    try {
      const formData = this.form();
      const baseDto = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        device_model: formData.device_model,
        device_type: formData.device_type,
        device_brand: formData.device_brand,
        imei: formData.imei,
        issue_description: formData.issue_description,
        estimated_cost: formData.estimated_cost,
        notes: "",
        // Optional notes field
        images: formData.images,
        checklist: formData.checklist,
        security_pin: formData.security_pin,
        security_pattern: formData.security_pattern
      };
      const extendedDto = __spreadProps(__spreadValues({}, baseDto), {
        current_status_id: formData.current_status_id,
        final_cost: formData.final_cost,
        technician_notes: formData.technician_notes,
        deposit_amount: formData.deposit_amount,
        tracking_code: formData.tracking_code
      });
      if (this.id) {
        await this.repairService.update(this.id, extendedDto);
      } else {
        await this.repairService.create(extendedDto);
      }
      this.router.navigate(["/admin/repairs"]);
    } catch (e) {
      console.error("Error saving repair:", e);
      const message = e.message || e.error_description || (e instanceof Error ? e.message : "Unknown error");
      this.error.set(message);
    } finally {
      this.saving.set(false);
    }
  }
  printOrder() {
    document.body.classList.add("printing-repair-order");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("printing-repair-order");
    }, 100);
  }
  shareWhatsApp() {
    if (!this.form().tracking_code)
      return;
    const customerName = this.form().customer_name;
    const device = this.form().device_model;
    const url = this.getTrackingUrl();
    let message = `Hola ${customerName}, tu ${device} est\xE1 en reparaci\xF3n. Pod\xE9s seguir el estado en tiempo real aqu\xED: ${url}`;
    if (this.form().current_status_id === RepairStatus.COMPLETED) {
      const reviewLink = environment.contact.socialMedia.googleMaps;
      message = `Hola ${customerName}, su reparaci\xF3n del ${device} ya est\xE1 lista. Agradecemos su rese\xF1a en el siguiente enlace: ${reviewLink}`;
    }
    const whatsappUrl = `https://wa.me/${this.form().customer_phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }
  getTrackingUrl() {
    if (!this.form().tracking_code)
      return "";
    return `${window.location.origin}/#/tracking/${this.form().tracking_code}`;
  }
  static \u0275fac = function AdminRepairFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminRepairFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminRepairFormPage, selectors: [["app-admin-repair-form-page"]], decls: 166, vars: 43, consts: [[1, "container", "mx-auto", "p-4", "max-w-5xl", "no-print"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/repairs", 1, "btn", "btn-circle", "btn-ghost", "text-base-content"], [1, "fas", "fa-arrow-left"], [1, "card", "bg-base-100", "shadow-lg"], [1, "card-body", "p-6"], [1, "flex", "justify-center", "py-12"], [1, "space-y-6"], [1, "print-container", "font-sans", "text-xs", "leading-tight", "hidden"], [1, "flex", "flex-col", "h-full"], [1, "w-full", "pb-4", "border-b-2", "border-dashed", "border-gray-400", "mb-4", "flex", "flex-col"], [1, "flex", "justify-between", "items-start", "mb-2", "border-b", "border-gray-300", "pb-2"], [1, "flex", "items-center"], ["alt", "Logo", 1, "h-10", "w-auto", "mr-3", "object-contain", 3, "src"], [1, "text-lg", "font-bold", "uppercase", "mb-0"], [1, "text-[9px]", "text-gray-600"], [1, "text-right", "flex", "items-center", "gap-2"], [1, "flex", "flex-col", "items-center"], [3, "qrdata", "width", "margin", "errorCorrectionLevel"], [1, "text-right"], [1, "font-bold", "text-base", "text-green-700", "uppercase"], [1, "text-[9px]", "text-gray-600", "leading-tight"], [1, "grid", "grid-cols-2", "gap-3", "mb-2", "grow"], [1, "flex", "flex-col", "gap-2"], [1, "border", "border-gray-300", "rounded", "p-1"], [1, "font-bold", "bg-gray-100", "px-1", "text-[9px]", "mb-0.5"], [1, "px-1", "text-[9px]"], [1, "flex", "justify-between"], [1, "font-bold"], [1, "truncate", "ml-1"], [1, "border-t", "border-gray-200", "my-0.5"], [1, "mt-1", "pt-1", "border-t", "border-gray-200"], [1, "grid", "grid-cols-3", "gap-0.5", "text-[8px]"], [1, "flex", "justify-between", "border-t", "border-gray-300", "pt-0.5", "mt-0.5", "font-bold"], [1, "border", "border-gray-300", "rounded", "p-1", "grow"], [1, "px-1", "text-[9px]", "h-full", "overflow-hidden", "leading-tight"], [1, "mt-auto"], [1, "flex", "justify-between", "items-end", "text-[9px]"], [1, "w-5/12", "text-center", "border-t", "border-black", "pt-1"], [1, "w-full", "pt-2", "flex", "flex-col", "justify-between"], [1, "grid", "grid-cols-2", "gap-4"], [1, "text-center", "mb-3"], [1, "font-bold", "text-xs", "uppercase", "border-b", "border-black", "pb-1", "mb-1"], [1, "text-[10px]", "font-bold", "truncate"], [1, "mb-3"], [1, "text-sm", "font-bold", "mb-0.5", "text-center", "border", "border-gray-300", "rounded", "bg-gray-50"], [1, "text-[9px]", "text-center", "text-gray-600"], [1, "space-y-2"], [1, "text-[9px]"], [1, "mt-2", "pt-2", "border-t", "border-gray-300"], [1, "text-[8px]", "text-gray-500", "text-justify", "leading-tight", "mb-2"], [1, "text-center", "font-bold", "text-[10px]"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "space-y-6", 3, "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "form-control"], [1, "label"], [1, "label-text", "font-medium"], [1, "input", "input-bordered", "flex", "items-center", "gap-2"], [1, "fas", "fa-user", "text-gray-400"], ["type", "text", "name", "customer_name", "required", "", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-phone", "text-gray-400"], ["type", "tel", "name", "customer_phone", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-mobile-alt", "text-gray-400"], ["type", "text", "name", "device_model", "required", "", "placeholder", "Ej: iPhone 11, Samsung A52...", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-barcode", "text-gray-400"], ["type", "text", "name", "imei", "placeholder", "Opcional", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-col", "gap-4"], ["type", "file", "multiple", "", "accept", "image/*", 1, "file-input", "file-input-bordered", "w-full", 3, "change", "disabled"], [1, "flex", "items-center", "gap-2", "text-sm", "text-gray-500"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-4"], ["name", "issue_description", "placeholder", "Describe la falla reportada por el cliente...", 1, "textarea", "textarea-bordered", "h-24", "leading-relaxed", 3, "ngModelChange", "ngModel"], [1, "divider", "text-sm", "font-medium", "text-gray-500"], [1, "flex", "flex-wrap", "gap-3"], [1, "cursor-pointer", "select-none", "transition-all", "duration-200", "border", "rounded-lg", "px-4", "py-2", "flex", "items-center", "gap-3", "hover:bg-gray-200"], ["type", "checkbox", "name", "check_charger", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], [1, "font-medium"], ["type", "checkbox", "name", "check_battery", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "name", "check_chip", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "name", "check_sd", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "name", "check_case", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-lock", "text-gray-400"], ["type", "text", "name", "security_pin", "placeholder", "1234", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-draw-polygon", "text-gray-400"], ["type", "text", "name", "security_pattern", "placeholder", "Descripci\xF3n del patr\xF3n (ej: Z, L, etc)", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-6"], ["name", "current_status_id", 1, "select", "select-bordered", "w-full", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "fas", "fa-dollar-sign", "text-gray-400"], ["type", "number", "name", "estimated_cost", "min", "0", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-hand-holding-usd", "text-gray-400"], ["type", "number", "name", "deposit_amount", "min", "0", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-cash-register", "text-gray-400"], ["type", "number", "name", "final_cost", "min", "0", 1, "grow", 3, "ngModelChange", "ngModel"], ["name", "technician_notes", "placeholder", "Detalles de la reparaci\xF3n realizada...", 1, "textarea", "textarea-bordered", "h-24", "leading-relaxed", 3, "ngModelChange", "ngModel"], [1, "alert", "alert-error", "mb-6", "shadow-sm"], [1, "flex", "flex-col", "sm:flex-row", "justify-end", "gap-4", "pt-6", "border-t", "border-base-200"], ["type", "button", 1, "btn", "bg-green-600", "hover:bg-green-700", "text-white", "border-none", "w-full", "sm:w-auto"], ["type", "button", 1, "btn", "btn-outline", "w-full", "sm:w-auto", 3, "click", "disabled"], [1, "fas", "fa-print", "mr-2"], ["routerLink", "/admin/repairs", 1, "btn", "btn-error", "text-white", "w-full", "sm:w-auto"], ["type", "submit", 1, "btn", "btn-primary", "w-full", "sm:w-auto", 3, "disabled"], [1, "loading", "loading-spinner", "loading-xs"], [1, "relative", "group", "aspect-square", "bg-base-200", "rounded-lg", "overflow-hidden", "border", "border-base-300"], ["alt", "Repair image", 1, "w-full", "h-full", "object-cover", 3, "src"], ["type", "button", 1, "absolute", "top-1", "right-1", "btn", "btn-circle", "btn-xs", "btn-error", "opacity-0", "group-hover:opacity-100", "transition-opacity", 3, "click"], [1, "fas", "fa-times"], [1, "fas", "fa-exclamation-circle"], ["type", "button", 1, "btn", "bg-green-600", "hover:bg-green-700", "text-white", "border-none", "w-full", "sm:w-auto", 3, "click"], [1, "fab", "fa-whatsapp", "mr-2"]], template: function AdminRepairFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "a", 3);
      \u0275\u0275element(5, "i", 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 5)(7, "div", 6);
      \u0275\u0275conditionalCreate(8, AdminRepairFormPage_Conditional_8_Template, 2, 0, "div", 7)(9, AdminRepairFormPage_Conditional_9_Template, 143, 91, "form", 8);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "div", 9)(11, "div", 10)(12, "div", 11)(13, "div", 12)(14, "div", 13);
      \u0275\u0275conditionalCreate(15, AdminRepairFormPage_Conditional_15_Template, 1, 1, "img", 14);
      \u0275\u0275elementStart(16, "div")(17, "h1", 15);
      \u0275\u0275text(18);
      \u0275\u0275pipe(19, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "div", 16)(21, "span");
      \u0275\u0275text(22);
      \u0275\u0275pipe(23, "date");
      \u0275\u0275elementEnd();
      \u0275\u0275text(24, " | ");
      \u0275\u0275elementStart(25, "span");
      \u0275\u0275text(26);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(27, "div", 17)(28, "div", 18);
      \u0275\u0275conditionalCreate(29, AdminRepairFormPage_Conditional_29_Template, 1, 4, "qrcode", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "div", 20)(31, "h2", 21);
      \u0275\u0275text(32);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 22)(34, "p");
      \u0275\u0275text(35);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "p");
      \u0275\u0275text(37);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(38, "div", 23)(39, "div", 24)(40, "div", 25)(41, "h3", 26);
      \u0275\u0275text(42, "CLIENTE & EQUIPO");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "div", 27)(44, "div", 28)(45, "span", 29);
      \u0275\u0275text(46, "Nombre:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "span", 30);
      \u0275\u0275text(48);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div", 28)(50, "span", 29);
      \u0275\u0275text(51, "Tel:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "span", 30);
      \u0275\u0275text(53);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(54, "div", 31);
      \u0275\u0275elementStart(55, "div", 28)(56, "span", 29);
      \u0275\u0275text(57, "Modelo:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "span", 30);
      \u0275\u0275text(59);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "div", 28)(61, "span", 29);
      \u0275\u0275text(62, "IMEI:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(63, "span", 30);
      \u0275\u0275text(64);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(65, "div", 25)(66, "h3", 26);
      \u0275\u0275text(67, "SEGURIDAD");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "div", 27)(69, "div", 28)(70, "span", 29);
      \u0275\u0275text(71, "PIN:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "span");
      \u0275\u0275text(73);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(74, "div", 28)(75, "span", 29);
      \u0275\u0275text(76, "Patr\xF3n:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(77, "span");
      \u0275\u0275text(78);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(79, "div", 32)(80, "div", 33)(81, "span");
      \u0275\u0275text(82);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(83, "span");
      \u0275\u0275text(84);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "span");
      \u0275\u0275text(86);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(87, "span");
      \u0275\u0275text(88);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(89, "span");
      \u0275\u0275text(90);
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(91, "div", 24)(92, "div", 25)(93, "h3", 26);
      \u0275\u0275text(94, "PRECIOS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(95, "div", 27)(96, "div", 28)(97, "span", 29);
      \u0275\u0275text(98, "Presupuesto:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(99, "span");
      \u0275\u0275text(100);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(101, "div", 28)(102, "span", 29);
      \u0275\u0275text(103, "Se\xF1a:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(104, "span");
      \u0275\u0275text(105);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(106, "div", 34)(107, "span");
      \u0275\u0275text(108, "Total:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(109, "span");
      \u0275\u0275text(110);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(111, "div", 35)(112, "h3", 26);
      \u0275\u0275text(113, "FALLA / NOTAS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(114, "div", 36);
      \u0275\u0275text(115);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275element(116, "hr")(117, "br");
      \u0275\u0275elementStart(118, "div", 37)(119, "div", 38)(120, "div", 39);
      \u0275\u0275text(121, "FIRMA CLIENTE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(122, "div", 39);
      \u0275\u0275text(123, "FIRMA T\xC9CNICO");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(124, "div", 40)(125, "div", 41)(126, "div")(127, "div", 42)(128, "h2", 43);
      \u0275\u0275text(129, "TAL\xD3N DE RETIRO");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(130, "div", 44);
      \u0275\u0275text(131);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(132, "div", 45)(133, "div", 46);
      \u0275\u0275text(134);
      \u0275\u0275pipe(135, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(136, "div", 47);
      \u0275\u0275text(137);
      \u0275\u0275pipe(138, "date");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(139, "div", 48)(140, "div", 25)(141, "div", 49)(142, "div", 28)(143, "span", 29);
      \u0275\u0275text(144, "Cliente:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(145, "span", 30);
      \u0275\u0275text(146);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(147, "div", 28)(148, "span", 29);
      \u0275\u0275text(149, "Equipo:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(150, "span", 30);
      \u0275\u0275text(151);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(152, "div", 25)(153, "div", 49)(154, "div", 28)(155, "span", 29);
      \u0275\u0275text(156, "Presupuesto:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(157, "span");
      \u0275\u0275text(158);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(159, "div", 28);
      \u0275\u0275element(160, "span", 29);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(161, "div", 50)(162, "div", 51);
      \u0275\u0275text(163, " CONDICIONES: La empresa no se responsabiliza por la p\xE9rdida de informaci\xF3n. Pasados los 90 d\xEDas el equipo se considerar\xE1 abandonado. La garant\xEDa cubre \xFAnicamente la reparaci\xF3n realizada y por un plazo de 30 d\xEDas. No cubre da\xF1os por mal uso, golpes o humedad. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(164, "div", 52);
      \u0275\u0275text(165, " Este tal\xF3n deber\xE1 ser presentado indefectiblemente para retirar el equipo. ");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_7_0;
      let tmp_8_0;
      let tmp_9_0;
      let tmp_25_0;
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.id ? "Editar Reparaci\xF3n" : "Nueva Reparaci\xF3n");
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.loading() ? 8 : 9);
      \u0275\u0275advance(7);
      \u0275\u0275conditional(((tmp_2_0 = ctx.company()) == null ? null : tmp_2_0.logo_url) ? 15 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("Orden #", \u0275\u0275pipeBind2(19, 31, ctx.form().repair_number, "3.0-0") || "---");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(23, 34, ctx.date, "dd/MM/yyyy"));
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1("ID: ", ctx.form().tracking_code);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.form().tracking_code ? 29 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(((tmp_7_0 = ctx.company()) == null ? null : tmp_7_0.name) || "ARECOFIX");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate((tmp_8_0 = ctx.company()) == null ? null : tmp_8_0.address);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate((tmp_9_0 = ctx.company()) == null ? null : tmp_9_0.phone);
      \u0275\u0275advance(11);
      \u0275\u0275textInterpolate(ctx.form().customer_name);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.form().customer_phone);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.form().device_model);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.form().imei);
      \u0275\u0275advance(9);
      \u0275\u0275textInterpolate(ctx.form().security_pin);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.form().security_pattern);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.charger ? "X" : " ", "] Carg");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.battery ? "X" : " ", "] Bat");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.chip ? "X" : " ", "] Chip");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.sd ? "X" : " ", "] SD");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.case ? "X" : " ", "] Funda");
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate1("$ ", ctx.form().estimated_cost);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("$ ", ctx.form().deposit_amount);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("$ ", ctx.form().final_cost || ctx.form().estimated_cost);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1(" ", ctx.form().issue_description, " ");
      \u0275\u0275advance(16);
      \u0275\u0275textInterpolate(((tmp_25_0 = ctx.company()) == null ? null : tmp_25_0.name) || "ARECOFIX");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("#", \u0275\u0275pipeBind2(135, 37, ctx.form().repair_number, "3.0-0") || "---");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(138, 40, ctx.date, "dd/MM/yyyy"));
      \u0275\u0275advance(9);
      \u0275\u0275textInterpolate(ctx.form().customer_name);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.form().device_model);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1("$ ", ctx.form().estimated_cost);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, NgModel, NgForm, RouterLink, QRCodeComponent, DecimalPipe, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminRepairFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-repair-form-page", standalone: true, imports: [CommonModule, FormsModule, RouterLink, QRCodeComponent], template: `<div class="container mx-auto p-4 max-w-5xl no-print">\r
    <div class="flex justify-between items-center mb-6">\r
        <h1 class="text-2xl font-bold text-green-600">{{ id ? 'Editar Reparaci\xF3n' : 'Nueva Reparaci\xF3n' }}</h1>\r
        <a routerLink="/admin/repairs" class="btn btn-circle btn-ghost text-base-content">\r
            <i class="fas fa-arrow-left"></i>\r
        </a>\r
    </div>\r
\r
    <div class="card bg-base-100 shadow-lg">\r
        <div class="card-body p-6">\r
            @if (loading()) {\r
            <div class="flex justify-center py-12">\r
                <span class="loading loading-spinner loading-lg text-primary"></span>\r
            </div>\r
            } @else {\r
            <form (ngSubmit)="save()" class="space-y-6">\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <!-- Customer Info -->\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Nombre del Cliente</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-user text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().customer_name" name="customer_name" class="grow" required />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Tel\xE9fono</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-phone text-gray-400"></i>\r
                            <input type="tel" [(ngModel)]="form().customer_phone" name="customer_phone" class="grow" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <!-- Device Info -->\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Modelo del Dispositivo</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-mobile-alt text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().device_model" name="device_model" class="grow" required\r
                                placeholder="Ej: iPhone 11, Samsung A52..." />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">IMEI / Serie</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-barcode text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().imei" name="imei" class="grow" placeholder="Opcional" />\r
                        </label>\r
                    </div>\r
                </div>\r
                \r
                <!-- Images -->\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Im\xE1genes del Equipo</span>\r
                    </label>\r
                    <div class="flex flex-col gap-4">\r
                        <input type="file" (change)="onFileSelected($event)" multiple accept="image/*" \r
                            class="file-input file-input-bordered w-full" \r
                            [disabled]="uploadingImages()" />\r
                        \r
                        @if (uploadingImages()) {\r
                            <div class="flex items-center gap-2 text-sm text-gray-500">\r
                                <span class="loading loading-spinner loading-xs"></span>\r
                                Subiendo im\xE1genes...\r
                            </div>\r
                        }\r
\r
                        @if (form().images.length > 0) {\r
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">\r
                                @for (img of form().images; track img; let i = $index) {\r
                                    <div class="relative group aspect-square bg-base-200 rounded-lg overflow-hidden border border-base-300">\r
                                        <img [src]="img" class="w-full h-full object-cover" alt="Repair image" />\r
                                        <button type="button" (click)="removeImage(i)" \r
                                            class="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity">\r
                                            <i class="fas fa-times"></i>\r
                                        </button>\r
                                    </div>\r
                                }\r
                            </div>\r
                        }\r
                    </div>\r
                </div>\r
\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Descripci\xF3n del Problema</span>\r
                    </label>\r
                    <textarea [(ngModel)]="form().issue_description" name="issue_description"\r
                        class="textarea textarea-bordered h-24 leading-relaxed"\r
                        placeholder="Describe la falla reportada por el cliente..."></textarea>\r
                </div>\r
\r
                <div class="divider text-sm font-medium text-gray-500">Detalles del Equipo</div>\r
\r
                <!-- Checklist -->\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Accesorios Recibidos</span>\r
                    </label>\r
                    <div class="flex flex-wrap gap-3">\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.charger"\r
                            [class.border-primary]="form().checklist.charger"\r
                            [class.text-primary]="form().checklist.charger"\r
                            [class.bg-gray-100]="!form().checklist.charger"\r
                            [class.border-gray-300]="!form().checklist.charger"\r
                            [class.text-gray-700]="!form().checklist.charger">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.charger" name="check_charger" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Cargador</span>\r
                        </label>\r
\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.battery"\r
                            [class.border-primary]="form().checklist.battery"\r
                            [class.text-primary]="form().checklist.battery"\r
                            [class.bg-gray-100]="!form().checklist.battery"\r
                            [class.border-gray-300]="!form().checklist.battery"\r
                            [class.text-gray-700]="!form().checklist.battery">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.battery" name="check_battery" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Bater\xEDa</span>\r
                        </label>\r
\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.chip"\r
                            [class.border-primary]="form().checklist.chip"\r
                            [class.text-primary]="form().checklist.chip"\r
                            [class.bg-gray-100]="!form().checklist.chip"\r
                            [class.border-gray-300]="!form().checklist.chip"\r
                            [class.text-gray-700]="!form().checklist.chip">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.chip" name="check_chip" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Chip</span>\r
                        </label>\r
\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.sd"\r
                            [class.border-primary]="form().checklist.sd"\r
                            [class.text-primary]="form().checklist.sd"\r
                            [class.bg-gray-100]="!form().checklist.sd"\r
                            [class.border-gray-300]="!form().checklist.sd"\r
                            [class.text-gray-700]="!form().checklist.sd">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.sd" name="check_sd" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Tarjeta SD</span>\r
                        </label>\r
\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.case"\r
                            [class.border-primary]="form().checklist.case"\r
                            [class.text-primary]="form().checklist.case"\r
                            [class.bg-gray-100]="!form().checklist.case"\r
                            [class.border-gray-300]="!form().checklist.case"\r
                            [class.text-gray-700]="!form().checklist.case">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.case" name="check_case" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Funda</span>\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <!-- Security -->\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">PIN / Contrase\xF1a</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-lock text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().security_pin" name="security_pin" class="grow" placeholder="1234" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Patr\xF3n de Desbloqueo</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-draw-polygon text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().security_pattern" name="security_pattern" class="grow"\r
                                placeholder="Descripci\xF3n del patr\xF3n (ej: Z, L, etc)" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <div class="divider text-sm font-medium text-gray-500">Estado y Costos</div>\r
\r
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Estado</span>\r
                        </label>\r
                        <select [(ngModel)]="form().current_status_id" name="current_status_id" class="select select-bordered w-full">\r
                            <option [value]="1">Pendiente</option>\r
                            <option [value]="2">En Progreso</option>\r
                            <option [value]="3">Esperando Repuestos</option>\r
                            <option [value]="4">Completado</option>\r
                            <option [value]="5">Entregado</option>\r
                            <option [value]="6">Cancelado</option>\r
                        </select>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Costo Estimado</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-dollar-sign text-gray-400"></i>\r
                            <input type="number" [(ngModel)]="form().estimated_cost" name="estimated_cost" class="grow" min="0" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Se\xF1a / Adelanto</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-hand-holding-usd text-gray-400"></i>\r
                            <input type="number" [(ngModel)]="form().deposit_amount" name="deposit_amount" class="grow" min="0" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Costo Final</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-cash-register text-gray-400"></i>\r
                            <input type="number" [(ngModel)]="form().final_cost" name="final_cost" class="grow" min="0" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Notas del T\xE9cnico (Interno)</span>\r
                    </label>\r
                    <textarea [(ngModel)]="form().technician_notes" name="technician_notes"\r
                        class="textarea textarea-bordered h-24 leading-relaxed"\r
                        placeholder="Detalles de la reparaci\xF3n realizada..."></textarea>\r
                </div>\r
\r
                <!-- Error Message -->\r
                @if (error()) {\r
                <div class="alert alert-error mb-6 shadow-sm">\r
                    <i class="fas fa-exclamation-circle"></i>\r
                    <span>{{ error() }}</span>\r
                </div>\r
                }\r
\r
                <!-- Actions -->\r
                <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-base-200">\r
                    @if (id && form().tracking_code) {\r
                    <button type="button" (click)="shareWhatsApp()"\r
                        class="btn bg-green-600 hover:bg-green-700 text-white border-none w-full sm:w-auto">\r
                        <i class="fab fa-whatsapp mr-2"></i> Compartir\r
                    </button>\r
                    }\r
\r
                    <button type="button" (click)="printOrder()" class="btn btn-outline w-full sm:w-auto"\r
                        [disabled]="saving()">\r
                        <i class="fas fa-print mr-2"></i> Imprimir Orden\r
                    </button>\r
                    <a routerLink="/admin/repairs" class="btn btn-error text-white w-full sm:w-auto">Cancelar</a>\r
                    <button type="submit" class="btn btn-primary w-full sm:w-auto"\r
                        [disabled]="saving() || !form().customer_name || !form().device_model">\r
                        @if (saving()) {\r
                        <span class="loading loading-spinner loading-xs"></span>\r
                        }\r
                        Guardar Reparaci\xF3n\r
                    </button>\r
                </div>\r
            </form>\r
            }\r
        </div>\r
    </div>\r
</div>\r
\r
<!-- Print Layout (Hidden on screen via CSS, visible on print via CSS) -->\r
<div class="print-container font-sans text-xs leading-tight hidden">\r
    <div class="flex flex-col h-full">\r
        <!-- Main Ticket (Top) -->\r
        <div class="w-full pb-4 border-b-2 border-dashed border-gray-400 mb-4 flex flex-col">\r
            <!-- Header -->\r
            <div class="flex justify-between items-start mb-2 border-b border-gray-300 pb-2">\r
                <div class="flex items-center">\r
                    @if (company()?.logo_url) {\r
                        <img [src]="company().logo_url" alt="Logo" class="h-10 w-auto mr-3 object-contain">\r
                    }\r
                    <div>\r
                        <h1 class="text-lg font-bold uppercase mb-0">Orden #{{ (form().repair_number | number:'3.0-0') || '---' }}</h1>\r
                        <div class="text-[9px] text-gray-600">\r
                            <span>{{ date | date:'dd/MM/yyyy' }}</span> |\r
                            <span>ID: {{ form().tracking_code }}</span>\r
                        </div>\r
                    </div>\r
                </div>\r
                <!-- QR Code for tracking -->\r
                <div class="text-right flex items-center gap-2">\r
                    <div class="flex flex-col items-center">\r
                         @if (form().tracking_code) {\r
                            <qrcode [qrdata]="getTrackingUrl()" [width]="60" [margin]="0" [errorCorrectionLevel]="'M'"></qrcode>\r
                         }\r
                    </div>\r
                    <div class="text-right">\r
                        <h2 class="font-bold text-base text-green-700 uppercase">{{ company()?.name || 'ARECOFIX' }}</h2>\r
                        <div class="text-[9px] text-gray-600 leading-tight">\r
                            <p>{{ company()?.address }}</p>\r
                            <p>{{ company()?.phone }}</p>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- Content Grid (2 Columns) -->\r
            <div class="grid grid-cols-2 gap-3 mb-2 grow">\r
                <!-- Col 1: Customer, Device, Security -->\r
                <div class="flex flex-col gap-2">\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <h3 class="font-bold bg-gray-100 px-1 text-[9px] mb-0.5">CLIENTE & EQUIPO</h3>\r
                        <div class="px-1 text-[9px]">\r
                            <div class="flex justify-between"><span class="font-bold">Nombre:</span> <span class="truncate ml-1">{{ form().customer_name }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold">Tel:</span> <span class="truncate ml-1">{{ form().customer_phone }}</span></div>\r
                            <div class="border-t border-gray-200 my-0.5"></div>\r
                            <div class="flex justify-between"><span class="font-bold">Modelo:</span> <span class="truncate ml-1">{{ form().device_model }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold">IMEI:</span> <span class="truncate ml-1">{{ form().imei }}</span></div>\r
                        </div>\r
                    </div>\r
\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <h3 class="font-bold bg-gray-100 px-1 text-[9px] mb-0.5">SEGURIDAD</h3>\r
                        <div class="px-1 text-[9px]">\r
                            <div class="flex justify-between"><span class="font-bold">PIN:</span> <span>{{ form().security_pin }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold">Patr\xF3n:</span> <span>{{ form().security_pattern }}</span></div>\r
                            <div class="mt-1 pt-1 border-t border-gray-200">\r
                                <div class="grid grid-cols-3 gap-0.5 text-[8px]">\r
                                    <span>[{{ form().checklist.charger ? 'X' : ' ' }}] Carg</span>\r
                                    <span>[{{ form().checklist.battery ? 'X' : ' ' }}] Bat</span>\r
                                    <span>[{{ form().checklist.chip ? 'X' : ' ' }}] Chip</span>\r
                                    <span>[{{ form().checklist.sd ? 'X' : ' ' }}] SD</span>\r
                                    <span>[{{ form().checklist.case ? 'X' : ' ' }}] Funda</span>\r
                                </div>\r
                            </div>\r
                        </div>\r
                    </div>\r
                </div>\r
\r
                <!-- Col 2: Costs, Fault -->\r
                <div class="flex flex-col gap-2">\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <h3 class="font-bold bg-gray-100 px-1 text-[9px] mb-0.5">PRECIOS</h3>\r
                        <div class="px-1 text-[9px]">\r
                            <div class="flex justify-between">\r
                                <span class="font-bold">Presupuesto:</span>\r
                                <span>$ {{ form().estimated_cost }}</span>\r
                            </div>\r
                            <div class="flex justify-between">\r
                                <span class="font-bold">Se\xF1a:</span>\r
                                <span>$ {{ form().deposit_amount }}</span>\r
                            </div>\r
                            <div class="flex justify-between border-t border-gray-300 pt-0.5 mt-0.5 font-bold">\r
                                <span>Total:</span>\r
                                <span>$ {{ form().final_cost || form().estimated_cost }}</span>\r
                            </div>\r
                        </div>\r
                    </div>\r
                    <div class="border border-gray-300 rounded p-1 grow">\r
                        <h3 class="font-bold bg-gray-100 px-1 text-[9px] mb-0.5">FALLA / NOTAS</h3>\r
                        <div class="px-1 text-[9px] h-full overflow-hidden leading-tight">\r
                            {{ form().issue_description }}\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
            \r
            <hr>\r
            <br>\r
\r
            <div class="mt-auto">\r
                <div class="flex justify-between items-end text-[9px]">\r
                    <div class="w-5/12 text-center border-t border-black pt-1">FIRMA CLIENTE</div>\r
                    <div class="w-5/12 text-center border-t border-black pt-1">FIRMA T\xC9CNICO</div>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Stub (Bottom) -->\r
        <div class="w-full pt-2 flex flex-col justify-between">\r
            <div class="grid grid-cols-2 gap-4">\r
                <div>\r
                    <div class="text-center mb-3">\r
                        <h2 class="font-bold text-xs uppercase border-b border-black pb-1 mb-1">TAL\xD3N DE RETIRO</h2>\r
                        <div class="text-[10px] font-bold truncate">{{ company()?.name || 'ARECOFIX' }}</div>\r
                    </div>\r
                    \r
                    <div class="mb-3">\r
                        <div class="text-sm font-bold mb-0.5 text-center border border-gray-300 rounded bg-gray-50">#{{ (form().repair_number | number:'3.0-0') || '---' }}</div>\r
                        <div class="text-[9px] text-center text-gray-600">{{ date | date:'dd/MM/yyyy' }}</div>\r
                    </div>\r
                </div>\r
\r
                <div class="space-y-2">\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <div class="text-[9px]">\r
                            <div class="flex justify-between"><span class="font-bold">Cliente:</span> <span class="truncate ml-1">{{ form().customer_name }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold">Equipo:</span> <span class="truncate ml-1">{{ form().device_model }}</span></div>\r
                        </div>\r
                    </div>\r
\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <div class="text-[9px]">\r
                            <div class="flex justify-between"><span class="font-bold">Presupuesto:</span> <span>$ {{ form().estimated_cost }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold"></span></div>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- Conditions & Footer -->\r
            <div class="mt-2 pt-2 border-t border-gray-300">\r
                <div class="text-[8px] text-gray-500 text-justify leading-tight mb-2">\r
                    CONDICIONES: La empresa no se responsabiliza por la p\xE9rdida de informaci\xF3n. Pasados los 90 d\xEDas el equipo se considerar\xE1 abandonado. La garant\xEDa cubre \xFAnicamente la reparaci\xF3n realizada y por un plazo de 30 d\xEDas. No cubre da\xF1os por mal uso, golpes o humedad.\r
                </div>\r
                <div class="text-center font-bold text-[10px]">\r
                    Este tal\xF3n deber\xE1 ser presentado indefectiblemente para retirar el equipo.\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminRepairFormPage, { className: "AdminRepairFormPage", filePath: "src/app/admin/repairs/admin-repair-form-page.ts", lineNumber: 19 });
})();
export {
  AdminRepairFormPage
};
//# sourceMappingURL=chunk-624YZTZZ.js.map
