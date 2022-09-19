(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/fast-diff/diff.js
  var require_diff = __commonJS({
    "node_modules/fast-diff/diff.js"(exports, module) {
      var DIFF_DELETE = -1;
      var DIFF_INSERT = 1;
      var DIFF_EQUAL = 0;
      function diff_main(text1, text2, cursor_pos) {
        if (text1 == text2) {
          if (text1) {
            return [[DIFF_EQUAL, text1]];
          }
          return [];
        }
        if (cursor_pos < 0 || text1.length < cursor_pos) {
          cursor_pos = null;
        }
        var commonlength = diff_commonPrefix(text1, text2);
        var commonprefix = text1.substring(0, commonlength);
        text1 = text1.substring(commonlength);
        text2 = text2.substring(commonlength);
        commonlength = diff_commonSuffix(text1, text2);
        var commonsuffix = text1.substring(text1.length - commonlength);
        text1 = text1.substring(0, text1.length - commonlength);
        text2 = text2.substring(0, text2.length - commonlength);
        var diffs = diff_compute_(text1, text2);
        if (commonprefix) {
          diffs.unshift([DIFF_EQUAL, commonprefix]);
        }
        if (commonsuffix) {
          diffs.push([DIFF_EQUAL, commonsuffix]);
        }
        diff_cleanupMerge(diffs);
        if (cursor_pos != null) {
          diffs = fix_cursor(diffs, cursor_pos);
        }
        diffs = fix_emoji(diffs);
        return diffs;
      }
      function diff_compute_(text1, text2) {
        var diffs;
        if (!text1) {
          return [[DIFF_INSERT, text2]];
        }
        if (!text2) {
          return [[DIFF_DELETE, text1]];
        }
        var longtext = text1.length > text2.length ? text1 : text2;
        var shorttext = text1.length > text2.length ? text2 : text1;
        var i = longtext.indexOf(shorttext);
        if (i != -1) {
          diffs = [
            [DIFF_INSERT, longtext.substring(0, i)],
            [DIFF_EQUAL, shorttext],
            [DIFF_INSERT, longtext.substring(i + shorttext.length)]
          ];
          if (text1.length > text2.length) {
            diffs[0][0] = diffs[2][0] = DIFF_DELETE;
          }
          return diffs;
        }
        if (shorttext.length == 1) {
          return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
        }
        var hm = diff_halfMatch_(text1, text2);
        if (hm) {
          var text1_a = hm[0];
          var text1_b = hm[1];
          var text2_a = hm[2];
          var text2_b = hm[3];
          var mid_common = hm[4];
          var diffs_a = diff_main(text1_a, text2_a);
          var diffs_b = diff_main(text1_b, text2_b);
          return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
        }
        return diff_bisect_(text1, text2);
      }
      function diff_bisect_(text1, text2) {
        var text1_length = text1.length;
        var text2_length = text2.length;
        var max_d = Math.ceil((text1_length + text2_length) / 2);
        var v_offset = max_d;
        var v_length = 2 * max_d;
        var v1 = new Array(v_length);
        var v2 = new Array(v_length);
        for (var x = 0; x < v_length; x++) {
          v1[x] = -1;
          v2[x] = -1;
        }
        v1[v_offset + 1] = 0;
        v2[v_offset + 1] = 0;
        var delta = text1_length - text2_length;
        var front = delta % 2 != 0;
        var k1start = 0;
        var k1end = 0;
        var k2start = 0;
        var k2end = 0;
        for (var d = 0; d < max_d; d++) {
          for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
            var k1_offset = v_offset + k1;
            var x1;
            if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
              x1 = v1[k1_offset + 1];
            } else {
              x1 = v1[k1_offset - 1] + 1;
            }
            var y1 = x1 - k1;
            while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
              x1++;
              y1++;
            }
            v1[k1_offset] = x1;
            if (x1 > text1_length) {
              k1end += 2;
            } else if (y1 > text2_length) {
              k1start += 2;
            } else if (front) {
              var k2_offset = v_offset + delta - k1;
              if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
                var x2 = text1_length - v2[k2_offset];
                if (x1 >= x2) {
                  return diff_bisectSplit_(text1, text2, x1, y1);
                }
              }
            }
          }
          for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
            var k2_offset = v_offset + k2;
            var x2;
            if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
              x2 = v2[k2_offset + 1];
            } else {
              x2 = v2[k2_offset - 1] + 1;
            }
            var y2 = x2 - k2;
            while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
              x2++;
              y2++;
            }
            v2[k2_offset] = x2;
            if (x2 > text1_length) {
              k2end += 2;
            } else if (y2 > text2_length) {
              k2start += 2;
            } else if (!front) {
              var k1_offset = v_offset + delta - k2;
              if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
                var x1 = v1[k1_offset];
                var y1 = v_offset + x1 - k1_offset;
                x2 = text1_length - x2;
                if (x1 >= x2) {
                  return diff_bisectSplit_(text1, text2, x1, y1);
                }
              }
            }
          }
        }
        return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
      }
      function diff_bisectSplit_(text1, text2, x, y) {
        var text1a = text1.substring(0, x);
        var text2a = text2.substring(0, y);
        var text1b = text1.substring(x);
        var text2b = text2.substring(y);
        var diffs = diff_main(text1a, text2a);
        var diffsb = diff_main(text1b, text2b);
        return diffs.concat(diffsb);
      }
      function diff_commonPrefix(text1, text2) {
        if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
          return 0;
        }
        var pointermin = 0;
        var pointermax = Math.min(text1.length, text2.length);
        var pointermid = pointermax;
        var pointerstart = 0;
        while (pointermin < pointermid) {
          if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
            pointermin = pointermid;
            pointerstart = pointermin;
          } else {
            pointermax = pointermid;
          }
          pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
        }
        return pointermid;
      }
      function diff_commonSuffix(text1, text2) {
        if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
          return 0;
        }
        var pointermin = 0;
        var pointermax = Math.min(text1.length, text2.length);
        var pointermid = pointermax;
        var pointerend = 0;
        while (pointermin < pointermid) {
          if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
            pointermin = pointermid;
            pointerend = pointermin;
          } else {
            pointermax = pointermid;
          }
          pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
        }
        return pointermid;
      }
      function diff_halfMatch_(text1, text2) {
        var longtext = text1.length > text2.length ? text1 : text2;
        var shorttext = text1.length > text2.length ? text2 : text1;
        if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
          return null;
        }
        function diff_halfMatchI_(longtext2, shorttext2, i) {
          var seed = longtext2.substring(i, i + Math.floor(longtext2.length / 4));
          var j = -1;
          var best_common = "";
          var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
          while ((j = shorttext2.indexOf(seed, j + 1)) != -1) {
            var prefixLength = diff_commonPrefix(
              longtext2.substring(i),
              shorttext2.substring(j)
            );
            var suffixLength = diff_commonSuffix(
              longtext2.substring(0, i),
              shorttext2.substring(0, j)
            );
            if (best_common.length < suffixLength + prefixLength) {
              best_common = shorttext2.substring(j - suffixLength, j) + shorttext2.substring(j, j + prefixLength);
              best_longtext_a = longtext2.substring(0, i - suffixLength);
              best_longtext_b = longtext2.substring(i + prefixLength);
              best_shorttext_a = shorttext2.substring(0, j - suffixLength);
              best_shorttext_b = shorttext2.substring(j + prefixLength);
            }
          }
          if (best_common.length * 2 >= longtext2.length) {
            return [
              best_longtext_a,
              best_longtext_b,
              best_shorttext_a,
              best_shorttext_b,
              best_common
            ];
          } else {
            return null;
          }
        }
        var hm1 = diff_halfMatchI_(
          longtext,
          shorttext,
          Math.ceil(longtext.length / 4)
        );
        var hm2 = diff_halfMatchI_(
          longtext,
          shorttext,
          Math.ceil(longtext.length / 2)
        );
        var hm;
        if (!hm1 && !hm2) {
          return null;
        } else if (!hm2) {
          hm = hm1;
        } else if (!hm1) {
          hm = hm2;
        } else {
          hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
        }
        var text1_a, text1_b, text2_a, text2_b;
        if (text1.length > text2.length) {
          text1_a = hm[0];
          text1_b = hm[1];
          text2_a = hm[2];
          text2_b = hm[3];
        } else {
          text2_a = hm[0];
          text2_b = hm[1];
          text1_a = hm[2];
          text1_b = hm[3];
        }
        var mid_common = hm[4];
        return [text1_a, text1_b, text2_a, text2_b, mid_common];
      }
      function diff_cleanupMerge(diffs) {
        diffs.push([DIFF_EQUAL, ""]);
        var pointer = 0;
        var count_delete = 0;
        var count_insert = 0;
        var text_delete = "";
        var text_insert = "";
        var commonlength;
        while (pointer < diffs.length) {
          switch (diffs[pointer][0]) {
            case DIFF_INSERT:
              count_insert++;
              text_insert += diffs[pointer][1];
              pointer++;
              break;
            case DIFF_DELETE:
              count_delete++;
              text_delete += diffs[pointer][1];
              pointer++;
              break;
            case DIFF_EQUAL:
              if (count_delete + count_insert > 1) {
                if (count_delete !== 0 && count_insert !== 0) {
                  commonlength = diff_commonPrefix(text_insert, text_delete);
                  if (commonlength !== 0) {
                    if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
                      diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
                    } else {
                      diffs.splice(0, 0, [
                        DIFF_EQUAL,
                        text_insert.substring(0, commonlength)
                      ]);
                      pointer++;
                    }
                    text_insert = text_insert.substring(commonlength);
                    text_delete = text_delete.substring(commonlength);
                  }
                  commonlength = diff_commonSuffix(text_insert, text_delete);
                  if (commonlength !== 0) {
                    diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
                    text_insert = text_insert.substring(0, text_insert.length - commonlength);
                    text_delete = text_delete.substring(0, text_delete.length - commonlength);
                  }
                }
                if (count_delete === 0) {
                  diffs.splice(
                    pointer - count_insert,
                    count_delete + count_insert,
                    [DIFF_INSERT, text_insert]
                  );
                } else if (count_insert === 0) {
                  diffs.splice(
                    pointer - count_delete,
                    count_delete + count_insert,
                    [DIFF_DELETE, text_delete]
                  );
                } else {
                  diffs.splice(
                    pointer - count_delete - count_insert,
                    count_delete + count_insert,
                    [DIFF_DELETE, text_delete],
                    [DIFF_INSERT, text_insert]
                  );
                }
                pointer = pointer - count_delete - count_insert + (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
              } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
                diffs[pointer - 1][1] += diffs[pointer][1];
                diffs.splice(pointer, 1);
              } else {
                pointer++;
              }
              count_insert = 0;
              count_delete = 0;
              text_delete = "";
              text_insert = "";
              break;
          }
        }
        if (diffs[diffs.length - 1][1] === "") {
          diffs.pop();
        }
        var changes = false;
        pointer = 1;
        while (pointer < diffs.length - 1) {
          if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
            if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
              diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
              diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
              diffs.splice(pointer - 1, 1);
              changes = true;
            } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
              diffs[pointer - 1][1] += diffs[pointer + 1][1];
              diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
              diffs.splice(pointer + 1, 1);
              changes = true;
            }
          }
          pointer++;
        }
        if (changes) {
          diff_cleanupMerge(diffs);
        }
      }
      var diff = diff_main;
      diff.INSERT = DIFF_INSERT;
      diff.DELETE = DIFF_DELETE;
      diff.EQUAL = DIFF_EQUAL;
      module.exports = diff;
      function cursor_normalize_diff(diffs, cursor_pos) {
        if (cursor_pos === 0) {
          return [DIFF_EQUAL, diffs];
        }
        for (var current_pos = 0, i = 0; i < diffs.length; i++) {
          var d = diffs[i];
          if (d[0] === DIFF_DELETE || d[0] === DIFF_EQUAL) {
            var next_pos = current_pos + d[1].length;
            if (cursor_pos === next_pos) {
              return [i + 1, diffs];
            } else if (cursor_pos < next_pos) {
              diffs = diffs.slice();
              var split_pos = cursor_pos - current_pos;
              var d_left = [d[0], d[1].slice(0, split_pos)];
              var d_right = [d[0], d[1].slice(split_pos)];
              diffs.splice(i, 1, d_left, d_right);
              return [i + 1, diffs];
            } else {
              current_pos = next_pos;
            }
          }
        }
        throw new Error("cursor_pos is out of bounds!");
      }
      function fix_cursor(diffs, cursor_pos) {
        var norm = cursor_normalize_diff(diffs, cursor_pos);
        var ndiffs = norm[1];
        var cursor_pointer = norm[0];
        var d = ndiffs[cursor_pointer];
        var d_next = ndiffs[cursor_pointer + 1];
        if (d == null) {
          return diffs;
        } else if (d[0] !== DIFF_EQUAL) {
          return diffs;
        } else {
          if (d_next != null && d[1] + d_next[1] === d_next[1] + d[1]) {
            ndiffs.splice(cursor_pointer, 2, d_next, d);
            return merge_tuples(ndiffs, cursor_pointer, 2);
          } else if (d_next != null && d_next[1].indexOf(d[1]) === 0) {
            ndiffs.splice(cursor_pointer, 2, [d_next[0], d[1]], [0, d[1]]);
            var suffix = d_next[1].slice(d[1].length);
            if (suffix.length > 0) {
              ndiffs.splice(cursor_pointer + 2, 0, [d_next[0], suffix]);
            }
            return merge_tuples(ndiffs, cursor_pointer, 3);
          } else {
            return diffs;
          }
        }
      }
      function fix_emoji(diffs) {
        var compact = false;
        var starts_with_pair_end = function(str) {
          return str.charCodeAt(0) >= 56320 && str.charCodeAt(0) <= 57343;
        };
        var ends_with_pair_start = function(str) {
          return str.charCodeAt(str.length - 1) >= 55296 && str.charCodeAt(str.length - 1) <= 56319;
        };
        for (var i = 2; i < diffs.length; i += 1) {
          if (diffs[i - 2][0] === DIFF_EQUAL && ends_with_pair_start(diffs[i - 2][1]) && diffs[i - 1][0] === DIFF_DELETE && starts_with_pair_end(diffs[i - 1][1]) && diffs[i][0] === DIFF_INSERT && starts_with_pair_end(diffs[i][1])) {
            compact = true;
            diffs[i - 1][1] = diffs[i - 2][1].slice(-1) + diffs[i - 1][1];
            diffs[i][1] = diffs[i - 2][1].slice(-1) + diffs[i][1];
            diffs[i - 2][1] = diffs[i - 2][1].slice(0, -1);
          }
        }
        if (!compact) {
          return diffs;
        }
        var fixed_diffs = [];
        for (var i = 0; i < diffs.length; i += 1) {
          if (diffs[i][1].length > 0) {
            fixed_diffs.push(diffs[i]);
          }
        }
        return fixed_diffs;
      }
      function merge_tuples(diffs, start, length) {
        for (var i = start + length - 1; i >= 0 && i >= start - 1; i--) {
          if (i + 1 < diffs.length) {
            var left_d = diffs[i];
            var right_d = diffs[i + 1];
            if (left_d[0] === right_d[1]) {
              diffs.splice(i, 2, [left_d[0], left_d[1] + right_d[1]]);
            }
          }
        }
        return diffs;
      }
    }
  });

  // node_modules/object-keys/isArguments.js
  var require_isArguments = __commonJS({
    "node_modules/object-keys/isArguments.js"(exports, module) {
      "use strict";
      var toStr = Object.prototype.toString;
      module.exports = function isArguments(value) {
        var str = toStr.call(value);
        var isArgs = str === "[object Arguments]";
        if (!isArgs) {
          isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
        }
        return isArgs;
      };
    }
  });

  // node_modules/object-keys/implementation.js
  var require_implementation = __commonJS({
    "node_modules/object-keys/implementation.js"(exports, module) {
      "use strict";
      var keysShim;
      if (!Object.keys) {
        has = Object.prototype.hasOwnProperty;
        toStr = Object.prototype.toString;
        isArgs = require_isArguments();
        isEnumerable = Object.prototype.propertyIsEnumerable;
        hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
        hasProtoEnumBug = isEnumerable.call(function() {
        }, "prototype");
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor"
        ];
        equalsConstructorPrototype = function(o) {
          var ctor = o.constructor;
          return ctor && ctor.prototype === o;
        };
        excludedKeys = {
          $applicationCache: true,
          $console: true,
          $external: true,
          $frame: true,
          $frameElement: true,
          $frames: true,
          $innerHeight: true,
          $innerWidth: true,
          $onmozfullscreenchange: true,
          $onmozfullscreenerror: true,
          $outerHeight: true,
          $outerWidth: true,
          $pageXOffset: true,
          $pageYOffset: true,
          $parent: true,
          $scrollLeft: true,
          $scrollTop: true,
          $scrollX: true,
          $scrollY: true,
          $self: true,
          $webkitIndexedDB: true,
          $webkitStorageInfo: true,
          $window: true
        };
        hasAutomationEqualityBug = function() {
          if (typeof window === "undefined") {
            return false;
          }
          for (var k in window) {
            try {
              if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
                try {
                  equalsConstructorPrototype(window[k]);
                } catch (e) {
                  return true;
                }
              }
            } catch (e) {
              return true;
            }
          }
          return false;
        }();
        equalsConstructorPrototypeIfNotBuggy = function(o) {
          if (typeof window === "undefined" || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(o);
          }
          try {
            return equalsConstructorPrototype(o);
          } catch (e) {
            return false;
          }
        };
        keysShim = function keys(object) {
          var isObject = object !== null && typeof object === "object";
          var isFunction = toStr.call(object) === "[object Function]";
          var isArguments = isArgs(object);
          var isString = isObject && toStr.call(object) === "[object String]";
          var theKeys = [];
          if (!isObject && !isFunction && !isArguments) {
            throw new TypeError("Object.keys called on a non-object");
          }
          var skipProto = hasProtoEnumBug && isFunction;
          if (isString && object.length > 0 && !has.call(object, 0)) {
            for (var i = 0; i < object.length; ++i) {
              theKeys.push(String(i));
            }
          }
          if (isArguments && object.length > 0) {
            for (var j = 0; j < object.length; ++j) {
              theKeys.push(String(j));
            }
          } else {
            for (var name in object) {
              if (!(skipProto && name === "prototype") && has.call(object, name)) {
                theKeys.push(String(name));
              }
            }
          }
          if (hasDontEnumBug) {
            var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
            for (var k = 0; k < dontEnums.length; ++k) {
              if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
                theKeys.push(dontEnums[k]);
              }
            }
          }
          return theKeys;
        };
      }
      var has;
      var toStr;
      var isArgs;
      var isEnumerable;
      var hasDontEnumBug;
      var hasProtoEnumBug;
      var dontEnums;
      var equalsConstructorPrototype;
      var excludedKeys;
      var hasAutomationEqualityBug;
      var equalsConstructorPrototypeIfNotBuggy;
      module.exports = keysShim;
    }
  });

  // node_modules/object-keys/index.js
  var require_object_keys = __commonJS({
    "node_modules/object-keys/index.js"(exports, module) {
      "use strict";
      var slice = Array.prototype.slice;
      var isArgs = require_isArguments();
      var origKeys = Object.keys;
      var keysShim = origKeys ? function keys(o) {
        return origKeys(o);
      } : require_implementation();
      var originalKeys = Object.keys;
      keysShim.shim = function shimObjectKeys() {
        if (Object.keys) {
          var keysWorksWithArguments = function() {
            var args = Object.keys(arguments);
            return args && args.length === arguments.length;
          }(1, 2);
          if (!keysWorksWithArguments) {
            Object.keys = function keys(object) {
              if (isArgs(object)) {
                return originalKeys(slice.call(object));
              }
              return originalKeys(object);
            };
          }
        } else {
          Object.keys = keysShim;
        }
        return Object.keys || keysShim;
      };
      module.exports = keysShim;
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (sym in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/has-tostringtag/shams.js
  var require_shams2 = __commonJS({
    "node_modules/has-tostringtag/shams.js"(exports, module) {
      "use strict";
      var hasSymbols = require_shams();
      module.exports = function hasToStringTagShams() {
        return hasSymbols() && !!Symbol.toStringTag;
      };
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation2 = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var slice = Array.prototype.slice;
      var toStr = Object.prototype.toString;
      var funcType = "[object Function]";
      module.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.call(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice.call(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          } else {
            return target.apply(
              that,
              args.concat(slice.call(arguments))
            );
          }
        };
        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs.push("$" + i);
        }
        bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      var implementation = require_implementation2();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/has/src/index.js
  var require_src = __commonJS({
    "node_modules/has/src/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      var undefined2;
      var $SyntaxError = SyntaxError;
      var $Function = Function;
      var $TypeError = TypeError;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = Object.getOwnPropertyDescriptor;
      if ($gOPD) {
        try {
          $gOPD({}, "");
        } catch (e) {
          $gOPD = null;
        }
      }
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = Object.getPrototypeOf || function(x) {
        return x.__proto__;
      };
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": Error,
        "%eval%": eval,
        "%EvalError%": EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": Object,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": RangeError,
        "%ReferenceError%": ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
      };
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_src();
      var $concat = bind.call(Function.call, Array.prototype.concat);
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
      var $replace = bind.call(Function.call, String.prototype.replace);
      var $strSlice = bind.call(Function.call, String.prototype.slice);
      var $exec = bind.call(Function.call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var GetIntrinsic = require_get_intrinsic();
      var $apply = GetIntrinsic("%Function.prototype.apply%");
      var $call = GetIntrinsic("%Function.prototype.call%");
      var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
      var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
      var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
      var $max = GetIntrinsic("%Math.max%");
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = null;
        }
      }
      module.exports = function callBind(originalFunction) {
        var func = $reflectApply(bind, $call, arguments);
        if ($gOPD && $defineProperty) {
          var desc = $gOPD(func, "length");
          if (desc.configurable) {
            $defineProperty(
              func,
              "length",
              { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
            );
          }
        }
        return func;
      };
      var applyBind = function applyBind2() {
        return $reflectApply(bind, $apply, arguments);
      };
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // node_modules/call-bind/callBound.js
  var require_callBound = __commonJS({
    "node_modules/call-bind/callBound.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBind = require_call_bind();
      var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBind(intrinsic);
        }
        return intrinsic;
      };
    }
  });

  // node_modules/is-arguments/index.js
  var require_is_arguments = __commonJS({
    "node_modules/is-arguments/index.js"(exports, module) {
      "use strict";
      var hasToStringTag = require_shams2()();
      var callBound = require_callBound();
      var $toString = callBound("Object.prototype.toString");
      var isStandardArguments = function isArguments(value) {
        if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
          return false;
        }
        return $toString(value) === "[object Arguments]";
      };
      var isLegacyArguments = function isArguments(value) {
        if (isStandardArguments(value)) {
          return true;
        }
        return value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && $toString(value.callee) === "[object Function]";
      };
      var supportsStandardArguments = function() {
        return isStandardArguments(arguments);
      }();
      isStandardArguments.isLegacyArguments = isLegacyArguments;
      module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
    }
  });

  // node_modules/has-property-descriptors/index.js
  var require_has_property_descriptors = __commonJS({
    "node_modules/has-property-descriptors/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
      var hasPropertyDescriptors = function hasPropertyDescriptors2() {
        if ($defineProperty) {
          try {
            $defineProperty({}, "a", { value: 1 });
            return true;
          } catch (e) {
            return false;
          }
        }
        return false;
      };
      hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
        if (!hasPropertyDescriptors()) {
          return null;
        }
        try {
          return $defineProperty([], "length", { value: 1 }).length !== 1;
        } catch (e) {
          return true;
        }
      };
      module.exports = hasPropertyDescriptors;
    }
  });

  // node_modules/define-properties/index.js
  var require_define_properties = __commonJS({
    "node_modules/define-properties/index.js"(exports, module) {
      "use strict";
      var keys = require_object_keys();
      var hasSymbols = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
      var toStr = Object.prototype.toString;
      var concat = Array.prototype.concat;
      var origDefineProperty = Object.defineProperty;
      var isFunction = function(fn) {
        return typeof fn === "function" && toStr.call(fn) === "[object Function]";
      };
      var hasPropertyDescriptors = require_has_property_descriptors()();
      var supportsDescriptors = origDefineProperty && hasPropertyDescriptors;
      var defineProperty = function(object, name, value, predicate) {
        if (name in object && (!isFunction(predicate) || !predicate())) {
          return;
        }
        if (supportsDescriptors) {
          origDefineProperty(object, name, {
            configurable: true,
            enumerable: false,
            value,
            writable: true
          });
        } else {
          object[name] = value;
        }
      };
      var defineProperties = function(object, map) {
        var predicates = arguments.length > 2 ? arguments[2] : {};
        var props = keys(map);
        if (hasSymbols) {
          props = concat.call(props, Object.getOwnPropertySymbols(map));
        }
        for (var i = 0; i < props.length; i += 1) {
          defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
        }
      };
      defineProperties.supportsDescriptors = !!supportsDescriptors;
      module.exports = defineProperties;
    }
  });

  // node_modules/object-is/implementation.js
  var require_implementation3 = __commonJS({
    "node_modules/object-is/implementation.js"(exports, module) {
      "use strict";
      var numberIsNaN = function(value) {
        return value !== value;
      };
      module.exports = function is(a, b) {
        if (a === 0 && b === 0) {
          return 1 / a === 1 / b;
        }
        if (a === b) {
          return true;
        }
        if (numberIsNaN(a) && numberIsNaN(b)) {
          return true;
        }
        return false;
      };
    }
  });

  // node_modules/object-is/polyfill.js
  var require_polyfill = __commonJS({
    "node_modules/object-is/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation3();
      module.exports = function getPolyfill() {
        return typeof Object.is === "function" ? Object.is : implementation;
      };
    }
  });

  // node_modules/object-is/shim.js
  var require_shim = __commonJS({
    "node_modules/object-is/shim.js"(exports, module) {
      "use strict";
      var getPolyfill = require_polyfill();
      var define2 = require_define_properties();
      module.exports = function shimObjectIs() {
        var polyfill = getPolyfill();
        define2(Object, { is: polyfill }, {
          is: function testObjectIs() {
            return Object.is !== polyfill;
          }
        });
        return polyfill;
      };
    }
  });

  // node_modules/object-is/index.js
  var require_object_is = __commonJS({
    "node_modules/object-is/index.js"(exports, module) {
      "use strict";
      var define2 = require_define_properties();
      var callBind = require_call_bind();
      var implementation = require_implementation3();
      var getPolyfill = require_polyfill();
      var shim = require_shim();
      var polyfill = callBind(getPolyfill(), Object);
      define2(polyfill, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = polyfill;
    }
  });

  // node_modules/is-regex/index.js
  var require_is_regex = __commonJS({
    "node_modules/is-regex/index.js"(exports, module) {
      "use strict";
      var callBound = require_callBound();
      var hasToStringTag = require_shams2()();
      var has;
      var $exec;
      var isRegexMarker;
      var badStringifier;
      if (hasToStringTag) {
        has = callBound("Object.prototype.hasOwnProperty");
        $exec = callBound("RegExp.prototype.exec");
        isRegexMarker = {};
        throwRegexMarker = function() {
          throw isRegexMarker;
        };
        badStringifier = {
          toString: throwRegexMarker,
          valueOf: throwRegexMarker
        };
        if (typeof Symbol.toPrimitive === "symbol") {
          badStringifier[Symbol.toPrimitive] = throwRegexMarker;
        }
      }
      var throwRegexMarker;
      var $toString = callBound("Object.prototype.toString");
      var gOPD = Object.getOwnPropertyDescriptor;
      var regexClass = "[object RegExp]";
      module.exports = hasToStringTag ? function isRegex(value) {
        if (!value || typeof value !== "object") {
          return false;
        }
        var descriptor = gOPD(value, "lastIndex");
        var hasLastIndexDataProperty = descriptor && has(descriptor, "value");
        if (!hasLastIndexDataProperty) {
          return false;
        }
        try {
          $exec(value, badStringifier);
        } catch (e) {
          return e === isRegexMarker;
        }
      } : function isRegex(value) {
        if (!value || typeof value !== "object" && typeof value !== "function") {
          return false;
        }
        return $toString(value) === regexClass;
      };
    }
  });

  // node_modules/functions-have-names/index.js
  var require_functions_have_names = __commonJS({
    "node_modules/functions-have-names/index.js"(exports, module) {
      "use strict";
      var functionsHaveNames = function functionsHaveNames2() {
        return typeof function f() {
        }.name === "string";
      };
      var gOPD = Object.getOwnPropertyDescriptor;
      if (gOPD) {
        try {
          gOPD([], "length");
        } catch (e) {
          gOPD = null;
        }
      }
      functionsHaveNames.functionsHaveConfigurableNames = function functionsHaveConfigurableNames() {
        if (!functionsHaveNames() || !gOPD) {
          return false;
        }
        var desc = gOPD(function() {
        }, "name");
        return !!desc && !!desc.configurable;
      };
      var $bind = Function.prototype.bind;
      functionsHaveNames.boundFunctionsHaveNames = function boundFunctionsHaveNames() {
        return functionsHaveNames() && typeof $bind === "function" && function f() {
        }.bind().name !== "";
      };
      module.exports = functionsHaveNames;
    }
  });

  // node_modules/regexp.prototype.flags/implementation.js
  var require_implementation4 = __commonJS({
    "node_modules/regexp.prototype.flags/implementation.js"(exports, module) {
      "use strict";
      var functionsHaveConfigurableNames = require_functions_have_names().functionsHaveConfigurableNames();
      var $Object = Object;
      var $TypeError = TypeError;
      module.exports = function flags() {
        if (this != null && this !== $Object(this)) {
          throw new $TypeError("RegExp.prototype.flags getter called on non-object");
        }
        var result = "";
        if (this.hasIndices) {
          result += "d";
        }
        if (this.global) {
          result += "g";
        }
        if (this.ignoreCase) {
          result += "i";
        }
        if (this.multiline) {
          result += "m";
        }
        if (this.dotAll) {
          result += "s";
        }
        if (this.unicode) {
          result += "u";
        }
        if (this.sticky) {
          result += "y";
        }
        return result;
      };
      if (functionsHaveConfigurableNames && Object.defineProperty) {
        Object.defineProperty(module.exports, "name", { value: "get flags" });
      }
    }
  });

  // node_modules/regexp.prototype.flags/polyfill.js
  var require_polyfill2 = __commonJS({
    "node_modules/regexp.prototype.flags/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation4();
      var supportsDescriptors = require_define_properties().supportsDescriptors;
      var $gOPD = Object.getOwnPropertyDescriptor;
      module.exports = function getPolyfill() {
        if (supportsDescriptors && /a/mig.flags === "gim") {
          var descriptor = $gOPD(RegExp.prototype, "flags");
          if (descriptor && typeof descriptor.get === "function" && typeof RegExp.prototype.dotAll === "boolean" && typeof RegExp.prototype.hasIndices === "boolean") {
            var calls = "";
            var o = {};
            Object.defineProperty(o, "hasIndices", {
              get: function() {
                calls += "d";
              }
            });
            Object.defineProperty(o, "sticky", {
              get: function() {
                calls += "y";
              }
            });
            if (calls === "dy") {
              return descriptor.get;
            }
          }
        }
        return implementation;
      };
    }
  });

  // node_modules/regexp.prototype.flags/shim.js
  var require_shim2 = __commonJS({
    "node_modules/regexp.prototype.flags/shim.js"(exports, module) {
      "use strict";
      var supportsDescriptors = require_define_properties().supportsDescriptors;
      var getPolyfill = require_polyfill2();
      var gOPD = Object.getOwnPropertyDescriptor;
      var defineProperty = Object.defineProperty;
      var TypeErr = TypeError;
      var getProto = Object.getPrototypeOf;
      var regex = /a/;
      module.exports = function shimFlags() {
        if (!supportsDescriptors || !getProto) {
          throw new TypeErr("RegExp.prototype.flags requires a true ES5 environment that supports property descriptors");
        }
        var polyfill = getPolyfill();
        var proto = getProto(regex);
        var descriptor = gOPD(proto, "flags");
        if (!descriptor || descriptor.get !== polyfill) {
          defineProperty(proto, "flags", {
            configurable: true,
            enumerable: false,
            get: polyfill
          });
        }
        return polyfill;
      };
    }
  });

  // node_modules/regexp.prototype.flags/index.js
  var require_regexp_prototype = __commonJS({
    "node_modules/regexp.prototype.flags/index.js"(exports, module) {
      "use strict";
      var define2 = require_define_properties();
      var callBind = require_call_bind();
      var implementation = require_implementation4();
      var getPolyfill = require_polyfill2();
      var shim = require_shim2();
      var flagsBound = callBind(getPolyfill());
      define2(flagsBound, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = flagsBound;
    }
  });

  // node_modules/is-date-object/index.js
  var require_is_date_object = __commonJS({
    "node_modules/is-date-object/index.js"(exports, module) {
      "use strict";
      var getDay = Date.prototype.getDay;
      var tryDateObject = function tryDateGetDayCall(value) {
        try {
          getDay.call(value);
          return true;
        } catch (e) {
          return false;
        }
      };
      var toStr = Object.prototype.toString;
      var dateClass = "[object Date]";
      var hasToStringTag = require_shams2()();
      module.exports = function isDateObject(value) {
        if (typeof value !== "object" || value === null) {
          return false;
        }
        return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
      };
    }
  });

  // node_modules/deep-equal/index.js
  var require_deep_equal = __commonJS({
    "node_modules/deep-equal/index.js"(exports, module) {
      var objectKeys = require_object_keys();
      var isArguments = require_is_arguments();
      var is = require_object_is();
      var isRegex = require_is_regex();
      var flags = require_regexp_prototype();
      var isDate = require_is_date_object();
      var getTime = Date.prototype.getTime;
      function deepEqual(actual, expected, options) {
        var opts = options || {};
        if (opts.strict ? is(actual, expected) : actual === expected) {
          return true;
        }
        if (!actual || !expected || typeof actual !== "object" && typeof expected !== "object") {
          return opts.strict ? is(actual, expected) : actual == expected;
        }
        return objEquiv(actual, expected, opts);
      }
      function isUndefinedOrNull(value) {
        return value === null || value === void 0;
      }
      function isBuffer(x) {
        if (!x || typeof x !== "object" || typeof x.length !== "number") {
          return false;
        }
        if (typeof x.copy !== "function" || typeof x.slice !== "function") {
          return false;
        }
        if (x.length > 0 && typeof x[0] !== "number") {
          return false;
        }
        return true;
      }
      function objEquiv(a, b, opts) {
        var i, key;
        if (typeof a !== typeof b) {
          return false;
        }
        if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
          return false;
        }
        if (a.prototype !== b.prototype) {
          return false;
        }
        if (isArguments(a) !== isArguments(b)) {
          return false;
        }
        var aIsRegex = isRegex(a);
        var bIsRegex = isRegex(b);
        if (aIsRegex !== bIsRegex) {
          return false;
        }
        if (aIsRegex || bIsRegex) {
          return a.source === b.source && flags(a) === flags(b);
        }
        if (isDate(a) && isDate(b)) {
          return getTime.call(a) === getTime.call(b);
        }
        var aIsBuffer = isBuffer(a);
        var bIsBuffer = isBuffer(b);
        if (aIsBuffer !== bIsBuffer) {
          return false;
        }
        if (aIsBuffer || bIsBuffer) {
          if (a.length !== b.length) {
            return false;
          }
          for (i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
              return false;
            }
          }
          return true;
        }
        if (typeof a !== typeof b) {
          return false;
        }
        try {
          var ka = objectKeys(a);
          var kb = objectKeys(b);
        } catch (e) {
          return false;
        }
        if (ka.length !== kb.length) {
          return false;
        }
        ka.sort();
        kb.sort();
        for (i = ka.length - 1; i >= 0; i--) {
          if (ka[i] != kb[i]) {
            return false;
          }
        }
        for (i = ka.length - 1; i >= 0; i--) {
          key = ka[i];
          if (!deepEqual(a[key], b[key], opts)) {
            return false;
          }
        }
        return true;
      }
      module.exports = deepEqual;
    }
  });

  // node_modules/extend/index.js
  var require_extend = __commonJS({
    "node_modules/extend/index.js"(exports, module) {
      "use strict";
      var hasOwn = Object.prototype.hasOwnProperty;
      var toStr = Object.prototype.toString;
      var defineProperty = Object.defineProperty;
      var gOPD = Object.getOwnPropertyDescriptor;
      var isArray = function isArray2(arr) {
        if (typeof Array.isArray === "function") {
          return Array.isArray(arr);
        }
        return toStr.call(arr) === "[object Array]";
      };
      var isPlainObject = function isPlainObject2(obj) {
        if (!obj || toStr.call(obj) !== "[object Object]") {
          return false;
        }
        var hasOwnConstructor = hasOwn.call(obj, "constructor");
        var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
        if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
          return false;
        }
        var key;
        for (key in obj) {
        }
        return typeof key === "undefined" || hasOwn.call(obj, key);
      };
      var setProperty = function setProperty2(target, options) {
        if (defineProperty && options.name === "__proto__") {
          defineProperty(target, options.name, {
            enumerable: true,
            configurable: true,
            value: options.newValue,
            writable: true
          });
        } else {
          target[options.name] = options.newValue;
        }
      };
      var getProperty = function getProperty2(obj, name) {
        if (name === "__proto__") {
          if (!hasOwn.call(obj, name)) {
            return void 0;
          } else if (gOPD) {
            return gOPD(obj, name).value;
          }
        }
        return obj[name];
      };
      module.exports = function extend4() {
        var options, name, src, copy, copyIsArray, clone3;
        var target = arguments[0];
        var i = 1;
        var length = arguments.length;
        var deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[1] || {};
          i = 2;
        }
        if (target == null || typeof target !== "object" && typeof target !== "function") {
          target = {};
        }
        for (; i < length; ++i) {
          options = arguments[i];
          if (options != null) {
            for (name in options) {
              src = getProperty(target, name);
              copy = getProperty(options, name);
              if (target !== copy) {
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                  if (copyIsArray) {
                    copyIsArray = false;
                    clone3 = src && isArray(src) ? src : [];
                  } else {
                    clone3 = src && isPlainObject(src) ? src : {};
                  }
                  setProperty(target, { name, newValue: extend4(deep, clone3, copy) });
                } else if (typeof copy !== "undefined") {
                  setProperty(target, { name, newValue: copy });
                }
              }
            }
          }
        }
        return target;
      };
    }
  });

  // node_modules/quill-delta/lib/op.js
  var require_op = __commonJS({
    "node_modules/quill-delta/lib/op.js"(exports, module) {
      var equal3 = require_deep_equal();
      var extend4 = require_extend();
      var lib = {
        attributes: {
          compose: function(a, b, keepNull) {
            if (typeof a !== "object")
              a = {};
            if (typeof b !== "object")
              b = {};
            var attributes = extend4(true, {}, b);
            if (!keepNull) {
              attributes = Object.keys(attributes).reduce(function(copy, key2) {
                if (attributes[key2] != null) {
                  copy[key2] = attributes[key2];
                }
                return copy;
              }, {});
            }
            for (var key in a) {
              if (a[key] !== void 0 && b[key] === void 0) {
                attributes[key] = a[key];
              }
            }
            return Object.keys(attributes).length > 0 ? attributes : void 0;
          },
          diff: function(a, b) {
            if (typeof a !== "object")
              a = {};
            if (typeof b !== "object")
              b = {};
            var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function(attributes2, key) {
              if (!equal3(a[key], b[key])) {
                attributes2[key] = b[key] === void 0 ? null : b[key];
              }
              return attributes2;
            }, {});
            return Object.keys(attributes).length > 0 ? attributes : void 0;
          },
          transform: function(a, b, priority) {
            if (typeof a !== "object")
              return b;
            if (typeof b !== "object")
              return void 0;
            if (!priority)
              return b;
            var attributes = Object.keys(b).reduce(function(attributes2, key) {
              if (a[key] === void 0)
                attributes2[key] = b[key];
              return attributes2;
            }, {});
            return Object.keys(attributes).length > 0 ? attributes : void 0;
          }
        },
        iterator: function(ops) {
          return new Iterator(ops);
        },
        length: function(op) {
          if (typeof op["delete"] === "number") {
            return op["delete"];
          } else if (typeof op.retain === "number") {
            return op.retain;
          } else {
            return typeof op.insert === "string" ? op.insert.length : 1;
          }
        }
      };
      function Iterator(ops) {
        this.ops = ops;
        this.index = 0;
        this.offset = 0;
      }
      Iterator.prototype.hasNext = function() {
        return this.peekLength() < Infinity;
      };
      Iterator.prototype.next = function(length) {
        if (!length)
          length = Infinity;
        var nextOp = this.ops[this.index];
        if (nextOp) {
          var offset = this.offset;
          var opLength = lib.length(nextOp);
          if (length >= opLength - offset) {
            length = opLength - offset;
            this.index += 1;
            this.offset = 0;
          } else {
            this.offset += length;
          }
          if (typeof nextOp["delete"] === "number") {
            return { "delete": length };
          } else {
            var retOp = {};
            if (nextOp.attributes) {
              retOp.attributes = nextOp.attributes;
            }
            if (typeof nextOp.retain === "number") {
              retOp.retain = length;
            } else if (typeof nextOp.insert === "string") {
              retOp.insert = nextOp.insert.substr(offset, length);
            } else {
              retOp.insert = nextOp.insert;
            }
            return retOp;
          }
        } else {
          return { retain: Infinity };
        }
      };
      Iterator.prototype.peek = function() {
        return this.ops[this.index];
      };
      Iterator.prototype.peekLength = function() {
        if (this.ops[this.index]) {
          return lib.length(this.ops[this.index]) - this.offset;
        } else {
          return Infinity;
        }
      };
      Iterator.prototype.peekType = function() {
        if (this.ops[this.index]) {
          if (typeof this.ops[this.index]["delete"] === "number") {
            return "delete";
          } else if (typeof this.ops[this.index].retain === "number") {
            return "retain";
          } else {
            return "insert";
          }
        }
        return "retain";
      };
      Iterator.prototype.rest = function() {
        if (!this.hasNext()) {
          return [];
        } else if (this.offset === 0) {
          return this.ops.slice(this.index);
        } else {
          var offset = this.offset;
          var index = this.index;
          var next = this.next();
          var rest = this.ops.slice(this.index);
          this.offset = offset;
          this.index = index;
          return [next].concat(rest);
        }
      };
      module.exports = lib;
    }
  });

  // node_modules/quill-delta/lib/delta.js
  var require_delta = __commonJS({
    "node_modules/quill-delta/lib/delta.js"(exports, module) {
      var diff = require_diff();
      var equal3 = require_deep_equal();
      var extend4 = require_extend();
      var op = require_op();
      var NULL_CHARACTER = String.fromCharCode(0);
      var Delta5 = function(ops) {
        if (Array.isArray(ops)) {
          this.ops = ops;
        } else if (ops != null && Array.isArray(ops.ops)) {
          this.ops = ops.ops;
        } else {
          this.ops = [];
        }
      };
      Delta5.prototype.insert = function(text, attributes) {
        var newOp = {};
        if (text.length === 0)
          return this;
        newOp.insert = text;
        if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
          newOp.attributes = attributes;
        }
        return this.push(newOp);
      };
      Delta5.prototype["delete"] = function(length) {
        if (length <= 0)
          return this;
        return this.push({ "delete": length });
      };
      Delta5.prototype.retain = function(length, attributes) {
        if (length <= 0)
          return this;
        var newOp = { retain: length };
        if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
          newOp.attributes = attributes;
        }
        return this.push(newOp);
      };
      Delta5.prototype.push = function(newOp) {
        var index = this.ops.length;
        var lastOp = this.ops[index - 1];
        newOp = extend4(true, {}, newOp);
        if (typeof lastOp === "object") {
          if (typeof newOp["delete"] === "number" && typeof lastOp["delete"] === "number") {
            this.ops[index - 1] = { "delete": lastOp["delete"] + newOp["delete"] };
            return this;
          }
          if (typeof lastOp["delete"] === "number" && newOp.insert != null) {
            index -= 1;
            lastOp = this.ops[index - 1];
            if (typeof lastOp !== "object") {
              this.ops.unshift(newOp);
              return this;
            }
          }
          if (equal3(newOp.attributes, lastOp.attributes)) {
            if (typeof newOp.insert === "string" && typeof lastOp.insert === "string") {
              this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
              if (typeof newOp.attributes === "object")
                this.ops[index - 1].attributes = newOp.attributes;
              return this;
            } else if (typeof newOp.retain === "number" && typeof lastOp.retain === "number") {
              this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
              if (typeof newOp.attributes === "object")
                this.ops[index - 1].attributes = newOp.attributes;
              return this;
            }
          }
        }
        if (index === this.ops.length) {
          this.ops.push(newOp);
        } else {
          this.ops.splice(index, 0, newOp);
        }
        return this;
      };
      Delta5.prototype.chop = function() {
        var lastOp = this.ops[this.ops.length - 1];
        if (lastOp && lastOp.retain && !lastOp.attributes) {
          this.ops.pop();
        }
        return this;
      };
      Delta5.prototype.filter = function(predicate) {
        return this.ops.filter(predicate);
      };
      Delta5.prototype.forEach = function(predicate) {
        this.ops.forEach(predicate);
      };
      Delta5.prototype.map = function(predicate) {
        return this.ops.map(predicate);
      };
      Delta5.prototype.partition = function(predicate) {
        var passed = [], failed = [];
        this.forEach(function(op2) {
          var target = predicate(op2) ? passed : failed;
          target.push(op2);
        });
        return [passed, failed];
      };
      Delta5.prototype.reduce = function(predicate, initial) {
        return this.ops.reduce(predicate, initial);
      };
      Delta5.prototype.changeLength = function() {
        return this.reduce(function(length, elem2) {
          if (elem2.insert) {
            return length + op.length(elem2);
          } else if (elem2.delete) {
            return length - elem2.delete;
          }
          return length;
        }, 0);
      };
      Delta5.prototype.length = function() {
        return this.reduce(function(length, elem2) {
          return length + op.length(elem2);
        }, 0);
      };
      Delta5.prototype.slice = function(start, end) {
        start = start || 0;
        if (typeof end !== "number")
          end = Infinity;
        var ops = [];
        var iter = op.iterator(this.ops);
        var index = 0;
        while (index < end && iter.hasNext()) {
          var nextOp;
          if (index < start) {
            nextOp = iter.next(start - index);
          } else {
            nextOp = iter.next(end - index);
            ops.push(nextOp);
          }
          index += op.length(nextOp);
        }
        return new Delta5(ops);
      };
      Delta5.prototype.compose = function(other) {
        var thisIter = op.iterator(this.ops);
        var otherIter = op.iterator(other.ops);
        var ops = [];
        var firstOther = otherIter.peek();
        if (firstOther != null && typeof firstOther.retain === "number" && firstOther.attributes == null) {
          var firstLeft = firstOther.retain;
          while (thisIter.peekType() === "insert" && thisIter.peekLength() <= firstLeft) {
            firstLeft -= thisIter.peekLength();
            ops.push(thisIter.next());
          }
          if (firstOther.retain - firstLeft > 0) {
            otherIter.next(firstOther.retain - firstLeft);
          }
        }
        var delta = new Delta5(ops);
        while (thisIter.hasNext() || otherIter.hasNext()) {
          if (otherIter.peekType() === "insert") {
            delta.push(otherIter.next());
          } else if (thisIter.peekType() === "delete") {
            delta.push(thisIter.next());
          } else {
            var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
            var thisOp = thisIter.next(length);
            var otherOp = otherIter.next(length);
            if (typeof otherOp.retain === "number") {
              var newOp = {};
              if (typeof thisOp.retain === "number") {
                newOp.retain = length;
              } else {
                newOp.insert = thisOp.insert;
              }
              var attributes = op.attributes.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === "number");
              if (attributes)
                newOp.attributes = attributes;
              delta.push(newOp);
              if (!otherIter.hasNext() && equal3(delta.ops[delta.ops.length - 1], newOp)) {
                var rest = new Delta5(thisIter.rest());
                return delta.concat(rest).chop();
              }
            } else if (typeof otherOp["delete"] === "number" && typeof thisOp.retain === "number") {
              delta.push(otherOp);
            }
          }
        }
        return delta.chop();
      };
      Delta5.prototype.concat = function(other) {
        var delta = new Delta5(this.ops.slice());
        if (other.ops.length > 0) {
          delta.push(other.ops[0]);
          delta.ops = delta.ops.concat(other.ops.slice(1));
        }
        return delta;
      };
      Delta5.prototype.diff = function(other, index) {
        if (this.ops === other.ops) {
          return new Delta5();
        }
        var strings = [this, other].map(function(delta2) {
          return delta2.map(function(op2) {
            if (op2.insert != null) {
              return typeof op2.insert === "string" ? op2.insert : NULL_CHARACTER;
            }
            var prep = delta2 === other ? "on" : "with";
            throw new Error("diff() called " + prep + " non-document");
          }).join("");
        });
        var delta = new Delta5();
        var diffResult = diff(strings[0], strings[1], index);
        var thisIter = op.iterator(this.ops);
        var otherIter = op.iterator(other.ops);
        diffResult.forEach(function(component) {
          var length = component[1].length;
          while (length > 0) {
            var opLength = 0;
            switch (component[0]) {
              case diff.INSERT:
                opLength = Math.min(otherIter.peekLength(), length);
                delta.push(otherIter.next(opLength));
                break;
              case diff.DELETE:
                opLength = Math.min(length, thisIter.peekLength());
                thisIter.next(opLength);
                delta["delete"](opLength);
                break;
              case diff.EQUAL:
                opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
                var thisOp = thisIter.next(opLength);
                var otherOp = otherIter.next(opLength);
                if (equal3(thisOp.insert, otherOp.insert)) {
                  delta.retain(opLength, op.attributes.diff(thisOp.attributes, otherOp.attributes));
                } else {
                  delta.push(otherOp)["delete"](opLength);
                }
                break;
            }
            length -= opLength;
          }
        });
        return delta.chop();
      };
      Delta5.prototype.eachLine = function(predicate, newline) {
        newline = newline || "\n";
        var iter = op.iterator(this.ops);
        var line = new Delta5();
        var i = 0;
        while (iter.hasNext()) {
          if (iter.peekType() !== "insert")
            return;
          var thisOp = iter.peek();
          var start = op.length(thisOp) - iter.peekLength();
          var index = typeof thisOp.insert === "string" ? thisOp.insert.indexOf(newline, start) - start : -1;
          if (index < 0) {
            line.push(iter.next());
          } else if (index > 0) {
            line.push(iter.next(index));
          } else {
            if (predicate(line, iter.next(1).attributes || {}, i) === false) {
              return;
            }
            i += 1;
            line = new Delta5();
          }
        }
        if (line.length() > 0) {
          predicate(line, {}, i);
        }
      };
      Delta5.prototype.transform = function(other, priority) {
        priority = !!priority;
        if (typeof other === "number") {
          return this.transformPosition(other, priority);
        }
        var thisIter = op.iterator(this.ops);
        var otherIter = op.iterator(other.ops);
        var delta = new Delta5();
        while (thisIter.hasNext() || otherIter.hasNext()) {
          if (thisIter.peekType() === "insert" && (priority || otherIter.peekType() !== "insert")) {
            delta.retain(op.length(thisIter.next()));
          } else if (otherIter.peekType() === "insert") {
            delta.push(otherIter.next());
          } else {
            var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
            var thisOp = thisIter.next(length);
            var otherOp = otherIter.next(length);
            if (thisOp["delete"]) {
              continue;
            } else if (otherOp["delete"]) {
              delta.push(otherOp);
            } else {
              delta.retain(length, op.attributes.transform(thisOp.attributes, otherOp.attributes, priority));
            }
          }
        }
        return delta.chop();
      };
      Delta5.prototype.transformPosition = function(index, priority) {
        priority = !!priority;
        var thisIter = op.iterator(this.ops);
        var offset = 0;
        while (thisIter.hasNext() && offset <= index) {
          var length = thisIter.peekLength();
          var nextType = thisIter.peekType();
          thisIter.next();
          if (nextType === "delete") {
            index -= Math.min(length, index - offset);
            continue;
          } else if (nextType === "insert" && (offset < index || !priority)) {
            index += length;
          }
          offset += length;
        }
        return index;
      };
      module.exports = Delta5;
    }
  });

  // node_modules/parchment/dist/parchment.js
  var require_parchment = __commonJS({
    "node_modules/parchment/dist/parchment.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else if (typeof exports === "object")
          exports["Parchment"] = factory();
        else
          root["Parchment"] = factory();
      })(typeof self !== "undefined" ? self : exports, function() {
        return function(modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
              return installedModules[moduleId].exports;
            }
            var module2 = installedModules[moduleId] = {
              i: moduleId,
              l: false,
              exports: {}
            };
            modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
            module2.l = true;
            return module2.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.d = function(exports2, name, getter) {
            if (!__webpack_require__.o(exports2, name)) {
              Object.defineProperty(exports2, name, {
                configurable: false,
                enumerable: true,
                get: getter
              });
            }
          };
          __webpack_require__.n = function(module2) {
            var getter = module2 && module2.__esModule ? function getDefault() {
              return module2["default"];
            } : function getModuleExports() {
              return module2;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
          };
          __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          };
          __webpack_require__.p = "";
          return __webpack_require__(__webpack_require__.s = 9);
        }([
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var ParchmentError = function(_super) {
              __extends(ParchmentError2, _super);
              function ParchmentError2(message) {
                var _this = this;
                message = "[Parchment] " + message;
                _this = _super.call(this, message) || this;
                _this.message = message;
                _this.name = _this.constructor.name;
                return _this;
              }
              return ParchmentError2;
            }(Error);
            exports2.ParchmentError = ParchmentError;
            var attributes = {};
            var classes = {};
            var tags = {};
            var types = {};
            exports2.DATA_KEY = "__blot";
            var Scope;
            (function(Scope2) {
              Scope2[Scope2["TYPE"] = 3] = "TYPE";
              Scope2[Scope2["LEVEL"] = 12] = "LEVEL";
              Scope2[Scope2["ATTRIBUTE"] = 13] = "ATTRIBUTE";
              Scope2[Scope2["BLOT"] = 14] = "BLOT";
              Scope2[Scope2["INLINE"] = 7] = "INLINE";
              Scope2[Scope2["BLOCK"] = 11] = "BLOCK";
              Scope2[Scope2["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
              Scope2[Scope2["INLINE_BLOT"] = 6] = "INLINE_BLOT";
              Scope2[Scope2["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
              Scope2[Scope2["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
              Scope2[Scope2["ANY"] = 15] = "ANY";
            })(Scope = exports2.Scope || (exports2.Scope = {}));
            function create(input, value) {
              var match = query(input);
              if (match == null) {
                throw new ParchmentError("Unable to create " + input + " blot");
              }
              var BlotClass = match;
              var node = input instanceof Node || input["nodeType"] === Node.TEXT_NODE ? input : BlotClass.create(value);
              return new BlotClass(node, value);
            }
            exports2.create = create;
            function find(node, bubble) {
              if (bubble === void 0) {
                bubble = false;
              }
              if (node == null)
                return null;
              if (node[exports2.DATA_KEY] != null)
                return node[exports2.DATA_KEY].blot;
              if (bubble)
                return find(node.parentNode, bubble);
              return null;
            }
            exports2.find = find;
            function query(query2, scope) {
              if (scope === void 0) {
                scope = Scope.ANY;
              }
              var match;
              if (typeof query2 === "string") {
                match = types[query2] || attributes[query2];
              } else if (query2 instanceof Text || query2["nodeType"] === Node.TEXT_NODE) {
                match = types["text"];
              } else if (typeof query2 === "number") {
                if (query2 & Scope.LEVEL & Scope.BLOCK) {
                  match = types["block"];
                } else if (query2 & Scope.LEVEL & Scope.INLINE) {
                  match = types["inline"];
                }
              } else if (query2 instanceof HTMLElement) {
                var names = (query2.getAttribute("class") || "").split(/\s+/);
                for (var i in names) {
                  match = classes[names[i]];
                  if (match)
                    break;
                }
                match = match || tags[query2.tagName];
              }
              if (match == null)
                return null;
              if (scope & Scope.LEVEL & match.scope && scope & Scope.TYPE & match.scope)
                return match;
              return null;
            }
            exports2.query = query;
            function register() {
              var Definitions = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                Definitions[_i] = arguments[_i];
              }
              if (Definitions.length > 1) {
                return Definitions.map(function(d) {
                  return register(d);
                });
              }
              var Definition = Definitions[0];
              if (typeof Definition.blotName !== "string" && typeof Definition.attrName !== "string") {
                throw new ParchmentError("Invalid definition");
              } else if (Definition.blotName === "abstract") {
                throw new ParchmentError("Cannot register abstract class");
              }
              types[Definition.blotName || Definition.attrName] = Definition;
              if (typeof Definition.keyName === "string") {
                attributes[Definition.keyName] = Definition;
              } else {
                if (Definition.className != null) {
                  classes[Definition.className] = Definition;
                }
                if (Definition.tagName != null) {
                  if (Array.isArray(Definition.tagName)) {
                    Definition.tagName = Definition.tagName.map(function(tagName) {
                      return tagName.toUpperCase();
                    });
                  } else {
                    Definition.tagName = Definition.tagName.toUpperCase();
                  }
                  var tagNames = Array.isArray(Definition.tagName) ? Definition.tagName : [Definition.tagName];
                  tagNames.forEach(function(tag) {
                    if (tags[tag] == null || Definition.className == null) {
                      tags[tag] = Definition;
                    }
                  });
                }
              }
              return Definition;
            }
            exports2.register = register;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var Registry = __webpack_require__(0);
            var Attributor = function() {
              function Attributor2(attrName, keyName, options) {
                if (options === void 0) {
                  options = {};
                }
                this.attrName = attrName;
                this.keyName = keyName;
                var attributeBit = Registry.Scope.TYPE & Registry.Scope.ATTRIBUTE;
                if (options.scope != null) {
                  this.scope = options.scope & Registry.Scope.LEVEL | attributeBit;
                } else {
                  this.scope = Registry.Scope.ATTRIBUTE;
                }
                if (options.whitelist != null)
                  this.whitelist = options.whitelist;
              }
              Attributor2.keys = function(node) {
                return [].map.call(node.attributes, function(item) {
                  return item.name;
                });
              };
              Attributor2.prototype.add = function(node, value) {
                if (!this.canAdd(node, value))
                  return false;
                node.setAttribute(this.keyName, value);
                return true;
              };
              Attributor2.prototype.canAdd = function(node, value) {
                var match = Registry.query(node, Registry.Scope.BLOT & (this.scope | Registry.Scope.TYPE));
                if (match == null)
                  return false;
                if (this.whitelist == null)
                  return true;
                if (typeof value === "string") {
                  return this.whitelist.indexOf(value.replace(/["']/g, "")) > -1;
                } else {
                  return this.whitelist.indexOf(value) > -1;
                }
              };
              Attributor2.prototype.remove = function(node) {
                node.removeAttribute(this.keyName);
              };
              Attributor2.prototype.value = function(node) {
                var value = node.getAttribute(this.keyName);
                if (this.canAdd(node, value) && value) {
                  return value;
                }
                return "";
              };
              return Attributor2;
            }();
            exports2.default = Attributor;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var linked_list_1 = __webpack_require__(11);
            var shadow_1 = __webpack_require__(5);
            var Registry = __webpack_require__(0);
            var ContainerBlot = function(_super) {
              __extends(ContainerBlot2, _super);
              function ContainerBlot2(domNode) {
                var _this = _super.call(this, domNode) || this;
                _this.build();
                return _this;
              }
              ContainerBlot2.prototype.appendChild = function(other) {
                this.insertBefore(other);
              };
              ContainerBlot2.prototype.attach = function() {
                _super.prototype.attach.call(this);
                this.children.forEach(function(child) {
                  child.attach();
                });
              };
              ContainerBlot2.prototype.build = function() {
                var _this = this;
                this.children = new linked_list_1.default();
                [].slice.call(this.domNode.childNodes).reverse().forEach(function(node) {
                  try {
                    var child = makeBlot(node);
                    _this.insertBefore(child, _this.children.head || void 0);
                  } catch (err) {
                    if (err instanceof Registry.ParchmentError)
                      return;
                    else
                      throw err;
                  }
                });
              };
              ContainerBlot2.prototype.deleteAt = function(index, length) {
                if (index === 0 && length === this.length()) {
                  return this.remove();
                }
                this.children.forEachAt(index, length, function(child, offset, length2) {
                  child.deleteAt(offset, length2);
                });
              };
              ContainerBlot2.prototype.descendant = function(criteria, index) {
                var _a = this.children.find(index), child = _a[0], offset = _a[1];
                if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
                  return [child, offset];
                } else if (child instanceof ContainerBlot2) {
                  return child.descendant(criteria, offset);
                } else {
                  return [null, -1];
                }
              };
              ContainerBlot2.prototype.descendants = function(criteria, index, length) {
                if (index === void 0) {
                  index = 0;
                }
                if (length === void 0) {
                  length = Number.MAX_VALUE;
                }
                var descendants = [];
                var lengthLeft = length;
                this.children.forEachAt(index, length, function(child, index2, length2) {
                  if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
                    descendants.push(child);
                  }
                  if (child instanceof ContainerBlot2) {
                    descendants = descendants.concat(child.descendants(criteria, index2, lengthLeft));
                  }
                  lengthLeft -= length2;
                });
                return descendants;
              };
              ContainerBlot2.prototype.detach = function() {
                this.children.forEach(function(child) {
                  child.detach();
                });
                _super.prototype.detach.call(this);
              };
              ContainerBlot2.prototype.formatAt = function(index, length, name, value) {
                this.children.forEachAt(index, length, function(child, offset, length2) {
                  child.formatAt(offset, length2, name, value);
                });
              };
              ContainerBlot2.prototype.insertAt = function(index, value, def) {
                var _a = this.children.find(index), child = _a[0], offset = _a[1];
                if (child) {
                  child.insertAt(offset, value, def);
                } else {
                  var blot = def == null ? Registry.create("text", value) : Registry.create(value, def);
                  this.appendChild(blot);
                }
              };
              ContainerBlot2.prototype.insertBefore = function(childBlot, refBlot) {
                if (this.statics.allowedChildren != null && !this.statics.allowedChildren.some(function(child) {
                  return childBlot instanceof child;
                })) {
                  throw new Registry.ParchmentError("Cannot insert " + childBlot.statics.blotName + " into " + this.statics.blotName);
                }
                childBlot.insertInto(this, refBlot);
              };
              ContainerBlot2.prototype.length = function() {
                return this.children.reduce(function(memo, child) {
                  return memo + child.length();
                }, 0);
              };
              ContainerBlot2.prototype.moveChildren = function(targetParent, refNode) {
                this.children.forEach(function(child) {
                  targetParent.insertBefore(child, refNode);
                });
              };
              ContainerBlot2.prototype.optimize = function(context) {
                _super.prototype.optimize.call(this, context);
                if (this.children.length === 0) {
                  if (this.statics.defaultChild != null) {
                    var child = Registry.create(this.statics.defaultChild);
                    this.appendChild(child);
                    child.optimize(context);
                  } else {
                    this.remove();
                  }
                }
              };
              ContainerBlot2.prototype.path = function(index, inclusive) {
                if (inclusive === void 0) {
                  inclusive = false;
                }
                var _a = this.children.find(index, inclusive), child = _a[0], offset = _a[1];
                var position = [[this, index]];
                if (child instanceof ContainerBlot2) {
                  return position.concat(child.path(offset, inclusive));
                } else if (child != null) {
                  position.push([child, offset]);
                }
                return position;
              };
              ContainerBlot2.prototype.removeChild = function(child) {
                this.children.remove(child);
              };
              ContainerBlot2.prototype.replace = function(target) {
                if (target instanceof ContainerBlot2) {
                  target.moveChildren(this);
                }
                _super.prototype.replace.call(this, target);
              };
              ContainerBlot2.prototype.split = function(index, force) {
                if (force === void 0) {
                  force = false;
                }
                if (!force) {
                  if (index === 0)
                    return this;
                  if (index === this.length())
                    return this.next;
                }
                var after = this.clone();
                this.parent.insertBefore(after, this.next);
                this.children.forEachAt(index, this.length(), function(child, offset, length) {
                  child = child.split(offset, force);
                  after.appendChild(child);
                });
                return after;
              };
              ContainerBlot2.prototype.unwrap = function() {
                this.moveChildren(this.parent, this.next);
                this.remove();
              };
              ContainerBlot2.prototype.update = function(mutations, context) {
                var _this = this;
                var addedNodes = [];
                var removedNodes = [];
                mutations.forEach(function(mutation) {
                  if (mutation.target === _this.domNode && mutation.type === "childList") {
                    addedNodes.push.apply(addedNodes, mutation.addedNodes);
                    removedNodes.push.apply(removedNodes, mutation.removedNodes);
                  }
                });
                removedNodes.forEach(function(node) {
                  if (node.parentNode != null && node.tagName !== "IFRAME" && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                    return;
                  }
                  var blot = Registry.find(node);
                  if (blot == null)
                    return;
                  if (blot.domNode.parentNode == null || blot.domNode.parentNode === _this.domNode) {
                    blot.detach();
                  }
                });
                addedNodes.filter(function(node) {
                  return node.parentNode == _this.domNode;
                }).sort(function(a, b) {
                  if (a === b)
                    return 0;
                  if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
                    return 1;
                  }
                  return -1;
                }).forEach(function(node) {
                  var refBlot = null;
                  if (node.nextSibling != null) {
                    refBlot = Registry.find(node.nextSibling);
                  }
                  var blot = makeBlot(node);
                  if (blot.next != refBlot || blot.next == null) {
                    if (blot.parent != null) {
                      blot.parent.removeChild(_this);
                    }
                    _this.insertBefore(blot, refBlot || void 0);
                  }
                });
              };
              return ContainerBlot2;
            }(shadow_1.default);
            function makeBlot(node) {
              var blot = Registry.find(node);
              if (blot == null) {
                try {
                  blot = Registry.create(node);
                } catch (e) {
                  blot = Registry.create(Registry.Scope.INLINE);
                  [].slice.call(node.childNodes).forEach(function(child) {
                    blot.domNode.appendChild(child);
                  });
                  if (node.parentNode) {
                    node.parentNode.replaceChild(blot.domNode, node);
                  }
                  blot.attach();
                }
              }
              return blot;
            }
            exports2.default = ContainerBlot;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var attributor_1 = __webpack_require__(1);
            var store_1 = __webpack_require__(6);
            var container_1 = __webpack_require__(2);
            var Registry = __webpack_require__(0);
            var FormatBlot = function(_super) {
              __extends(FormatBlot2, _super);
              function FormatBlot2(domNode) {
                var _this = _super.call(this, domNode) || this;
                _this.attributes = new store_1.default(_this.domNode);
                return _this;
              }
              FormatBlot2.formats = function(domNode) {
                if (typeof this.tagName === "string") {
                  return true;
                } else if (Array.isArray(this.tagName)) {
                  return domNode.tagName.toLowerCase();
                }
                return void 0;
              };
              FormatBlot2.prototype.format = function(name, value) {
                var format = Registry.query(name);
                if (format instanceof attributor_1.default) {
                  this.attributes.attribute(format, value);
                } else if (value) {
                  if (format != null && (name !== this.statics.blotName || this.formats()[name] !== value)) {
                    this.replaceWith(name, value);
                  }
                }
              };
              FormatBlot2.prototype.formats = function() {
                var formats = this.attributes.values();
                var format = this.statics.formats(this.domNode);
                if (format != null) {
                  formats[this.statics.blotName] = format;
                }
                return formats;
              };
              FormatBlot2.prototype.replaceWith = function(name, value) {
                var replacement = _super.prototype.replaceWith.call(this, name, value);
                this.attributes.copy(replacement);
                return replacement;
              };
              FormatBlot2.prototype.update = function(mutations, context) {
                var _this = this;
                _super.prototype.update.call(this, mutations, context);
                if (mutations.some(function(mutation) {
                  return mutation.target === _this.domNode && mutation.type === "attributes";
                })) {
                  this.attributes.build();
                }
              };
              FormatBlot2.prototype.wrap = function(name, value) {
                var wrapper = _super.prototype.wrap.call(this, name, value);
                if (wrapper instanceof FormatBlot2 && wrapper.statics.scope === this.statics.scope) {
                  this.attributes.move(wrapper);
                }
                return wrapper;
              };
              return FormatBlot2;
            }(container_1.default);
            exports2.default = FormatBlot;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var shadow_1 = __webpack_require__(5);
            var Registry = __webpack_require__(0);
            var LeafBlot = function(_super) {
              __extends(LeafBlot2, _super);
              function LeafBlot2() {
                return _super !== null && _super.apply(this, arguments) || this;
              }
              LeafBlot2.value = function(domNode) {
                return true;
              };
              LeafBlot2.prototype.index = function(node, offset) {
                if (this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                  return Math.min(offset, 1);
                }
                return -1;
              };
              LeafBlot2.prototype.position = function(index, inclusive) {
                var offset = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
                if (index > 0)
                  offset += 1;
                return [this.parent.domNode, offset];
              };
              LeafBlot2.prototype.value = function() {
                return _a = {}, _a[this.statics.blotName] = this.statics.value(this.domNode) || true, _a;
                var _a;
              };
              LeafBlot2.scope = Registry.Scope.INLINE_BLOT;
              return LeafBlot2;
            }(shadow_1.default);
            exports2.default = LeafBlot;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var Registry = __webpack_require__(0);
            var ShadowBlot = function() {
              function ShadowBlot2(domNode) {
                this.domNode = domNode;
                this.domNode[Registry.DATA_KEY] = { blot: this };
              }
              Object.defineProperty(ShadowBlot2.prototype, "statics", {
                get: function() {
                  return this.constructor;
                },
                enumerable: true,
                configurable: true
              });
              ShadowBlot2.create = function(value) {
                if (this.tagName == null) {
                  throw new Registry.ParchmentError("Blot definition missing tagName");
                }
                var node;
                if (Array.isArray(this.tagName)) {
                  if (typeof value === "string") {
                    value = value.toUpperCase();
                    if (parseInt(value).toString() === value) {
                      value = parseInt(value);
                    }
                  }
                  if (typeof value === "number") {
                    node = document.createElement(this.tagName[value - 1]);
                  } else if (this.tagName.indexOf(value) > -1) {
                    node = document.createElement(value);
                  } else {
                    node = document.createElement(this.tagName[0]);
                  }
                } else {
                  node = document.createElement(this.tagName);
                }
                if (this.className) {
                  node.classList.add(this.className);
                }
                return node;
              };
              ShadowBlot2.prototype.attach = function() {
                if (this.parent != null) {
                  this.scroll = this.parent.scroll;
                }
              };
              ShadowBlot2.prototype.clone = function() {
                var domNode = this.domNode.cloneNode(false);
                return Registry.create(domNode);
              };
              ShadowBlot2.prototype.detach = function() {
                if (this.parent != null)
                  this.parent.removeChild(this);
                delete this.domNode[Registry.DATA_KEY];
              };
              ShadowBlot2.prototype.deleteAt = function(index, length) {
                var blot = this.isolate(index, length);
                blot.remove();
              };
              ShadowBlot2.prototype.formatAt = function(index, length, name, value) {
                var blot = this.isolate(index, length);
                if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
                  blot.wrap(name, value);
                } else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
                  var parent_1 = Registry.create(this.statics.scope);
                  blot.wrap(parent_1);
                  parent_1.format(name, value);
                }
              };
              ShadowBlot2.prototype.insertAt = function(index, value, def) {
                var blot = def == null ? Registry.create("text", value) : Registry.create(value, def);
                var ref = this.split(index);
                this.parent.insertBefore(blot, ref);
              };
              ShadowBlot2.prototype.insertInto = function(parentBlot, refBlot) {
                if (refBlot === void 0) {
                  refBlot = null;
                }
                if (this.parent != null) {
                  this.parent.children.remove(this);
                }
                var refDomNode = null;
                parentBlot.children.insertBefore(this, refBlot);
                if (refBlot != null) {
                  refDomNode = refBlot.domNode;
                }
                if (this.domNode.parentNode != parentBlot.domNode || this.domNode.nextSibling != refDomNode) {
                  parentBlot.domNode.insertBefore(this.domNode, refDomNode);
                }
                this.parent = parentBlot;
                this.attach();
              };
              ShadowBlot2.prototype.isolate = function(index, length) {
                var target = this.split(index);
                target.split(length);
                return target;
              };
              ShadowBlot2.prototype.length = function() {
                return 1;
              };
              ShadowBlot2.prototype.offset = function(root) {
                if (root === void 0) {
                  root = this.parent;
                }
                if (this.parent == null || this == root)
                  return 0;
                return this.parent.children.offset(this) + this.parent.offset(root);
              };
              ShadowBlot2.prototype.optimize = function(context) {
                if (this.domNode[Registry.DATA_KEY] != null) {
                  delete this.domNode[Registry.DATA_KEY].mutations;
                }
              };
              ShadowBlot2.prototype.remove = function() {
                if (this.domNode.parentNode != null) {
                  this.domNode.parentNode.removeChild(this.domNode);
                }
                this.detach();
              };
              ShadowBlot2.prototype.replace = function(target) {
                if (target.parent == null)
                  return;
                target.parent.insertBefore(this, target.next);
                target.remove();
              };
              ShadowBlot2.prototype.replaceWith = function(name, value) {
                var replacement = typeof name === "string" ? Registry.create(name, value) : name;
                replacement.replace(this);
                return replacement;
              };
              ShadowBlot2.prototype.split = function(index, force) {
                return index === 0 ? this : this.next;
              };
              ShadowBlot2.prototype.update = function(mutations, context) {
              };
              ShadowBlot2.prototype.wrap = function(name, value) {
                var wrapper = typeof name === "string" ? Registry.create(name, value) : name;
                if (this.parent != null) {
                  this.parent.insertBefore(wrapper, this.next);
                }
                wrapper.appendChild(this);
                return wrapper;
              };
              ShadowBlot2.blotName = "abstract";
              return ShadowBlot2;
            }();
            exports2.default = ShadowBlot;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var attributor_1 = __webpack_require__(1);
            var class_1 = __webpack_require__(7);
            var style_1 = __webpack_require__(8);
            var Registry = __webpack_require__(0);
            var AttributorStore = function() {
              function AttributorStore2(domNode) {
                this.attributes = {};
                this.domNode = domNode;
                this.build();
              }
              AttributorStore2.prototype.attribute = function(attribute, value) {
                if (value) {
                  if (attribute.add(this.domNode, value)) {
                    if (attribute.value(this.domNode) != null) {
                      this.attributes[attribute.attrName] = attribute;
                    } else {
                      delete this.attributes[attribute.attrName];
                    }
                  }
                } else {
                  attribute.remove(this.domNode);
                  delete this.attributes[attribute.attrName];
                }
              };
              AttributorStore2.prototype.build = function() {
                var _this = this;
                this.attributes = {};
                var attributes = attributor_1.default.keys(this.domNode);
                var classes = class_1.default.keys(this.domNode);
                var styles = style_1.default.keys(this.domNode);
                attributes.concat(classes).concat(styles).forEach(function(name) {
                  var attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
                  if (attr instanceof attributor_1.default) {
                    _this.attributes[attr.attrName] = attr;
                  }
                });
              };
              AttributorStore2.prototype.copy = function(target) {
                var _this = this;
                Object.keys(this.attributes).forEach(function(key) {
                  var value = _this.attributes[key].value(_this.domNode);
                  target.format(key, value);
                });
              };
              AttributorStore2.prototype.move = function(target) {
                var _this = this;
                this.copy(target);
                Object.keys(this.attributes).forEach(function(key) {
                  _this.attributes[key].remove(_this.domNode);
                });
                this.attributes = {};
              };
              AttributorStore2.prototype.values = function() {
                var _this = this;
                return Object.keys(this.attributes).reduce(function(attributes, name) {
                  attributes[name] = _this.attributes[name].value(_this.domNode);
                  return attributes;
                }, {});
              };
              return AttributorStore2;
            }();
            exports2.default = AttributorStore;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var attributor_1 = __webpack_require__(1);
            function match(node, prefix) {
              var className = node.getAttribute("class") || "";
              return className.split(/\s+/).filter(function(name) {
                return name.indexOf(prefix + "-") === 0;
              });
            }
            var ClassAttributor = function(_super) {
              __extends(ClassAttributor2, _super);
              function ClassAttributor2() {
                return _super !== null && _super.apply(this, arguments) || this;
              }
              ClassAttributor2.keys = function(node) {
                return (node.getAttribute("class") || "").split(/\s+/).map(function(name) {
                  return name.split("-").slice(0, -1).join("-");
                });
              };
              ClassAttributor2.prototype.add = function(node, value) {
                if (!this.canAdd(node, value))
                  return false;
                this.remove(node);
                node.classList.add(this.keyName + "-" + value);
                return true;
              };
              ClassAttributor2.prototype.remove = function(node) {
                var matches = match(node, this.keyName);
                matches.forEach(function(name) {
                  node.classList.remove(name);
                });
                if (node.classList.length === 0) {
                  node.removeAttribute("class");
                }
              };
              ClassAttributor2.prototype.value = function(node) {
                var result = match(node, this.keyName)[0] || "";
                var value = result.slice(this.keyName.length + 1);
                return this.canAdd(node, value) ? value : "";
              };
              return ClassAttributor2;
            }(attributor_1.default);
            exports2.default = ClassAttributor;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var attributor_1 = __webpack_require__(1);
            function camelize(name) {
              var parts = name.split("-");
              var rest = parts.slice(1).map(function(part) {
                return part[0].toUpperCase() + part.slice(1);
              }).join("");
              return parts[0] + rest;
            }
            var StyleAttributor = function(_super) {
              __extends(StyleAttributor2, _super);
              function StyleAttributor2() {
                return _super !== null && _super.apply(this, arguments) || this;
              }
              StyleAttributor2.keys = function(node) {
                return (node.getAttribute("style") || "").split(";").map(function(value) {
                  var arr = value.split(":");
                  return arr[0].trim();
                });
              };
              StyleAttributor2.prototype.add = function(node, value) {
                if (!this.canAdd(node, value))
                  return false;
                node.style[camelize(this.keyName)] = value;
                return true;
              };
              StyleAttributor2.prototype.remove = function(node) {
                node.style[camelize(this.keyName)] = "";
                if (!node.getAttribute("style")) {
                  node.removeAttribute("style");
                }
              };
              StyleAttributor2.prototype.value = function(node) {
                var value = node.style[camelize(this.keyName)];
                return this.canAdd(node, value) ? value : "";
              };
              return StyleAttributor2;
            }(attributor_1.default);
            exports2.default = StyleAttributor;
          },
          function(module2, exports2, __webpack_require__) {
            module2.exports = __webpack_require__(10);
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var container_1 = __webpack_require__(2);
            var format_1 = __webpack_require__(3);
            var leaf_1 = __webpack_require__(4);
            var scroll_1 = __webpack_require__(12);
            var inline_1 = __webpack_require__(13);
            var block_1 = __webpack_require__(14);
            var embed_1 = __webpack_require__(15);
            var text_1 = __webpack_require__(16);
            var attributor_1 = __webpack_require__(1);
            var class_1 = __webpack_require__(7);
            var style_1 = __webpack_require__(8);
            var store_1 = __webpack_require__(6);
            var Registry = __webpack_require__(0);
            var Parchment10 = {
              Scope: Registry.Scope,
              create: Registry.create,
              find: Registry.find,
              query: Registry.query,
              register: Registry.register,
              Container: container_1.default,
              Format: format_1.default,
              Leaf: leaf_1.default,
              Embed: embed_1.default,
              Scroll: scroll_1.default,
              Block: block_1.default,
              Inline: inline_1.default,
              Text: text_1.default,
              Attributor: {
                Attribute: attributor_1.default,
                Class: class_1.default,
                Style: style_1.default,
                Store: store_1.default
              }
            };
            exports2.default = Parchment10;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var LinkedList = function() {
              function LinkedList2() {
                this.head = this.tail = null;
                this.length = 0;
              }
              LinkedList2.prototype.append = function() {
                var nodes = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  nodes[_i] = arguments[_i];
                }
                this.insertBefore(nodes[0], null);
                if (nodes.length > 1) {
                  this.append.apply(this, nodes.slice(1));
                }
              };
              LinkedList2.prototype.contains = function(node) {
                var cur, next = this.iterator();
                while (cur = next()) {
                  if (cur === node)
                    return true;
                }
                return false;
              };
              LinkedList2.prototype.insertBefore = function(node, refNode) {
                if (!node)
                  return;
                node.next = refNode;
                if (refNode != null) {
                  node.prev = refNode.prev;
                  if (refNode.prev != null) {
                    refNode.prev.next = node;
                  }
                  refNode.prev = node;
                  if (refNode === this.head) {
                    this.head = node;
                  }
                } else if (this.tail != null) {
                  this.tail.next = node;
                  node.prev = this.tail;
                  this.tail = node;
                } else {
                  node.prev = null;
                  this.head = this.tail = node;
                }
                this.length += 1;
              };
              LinkedList2.prototype.offset = function(target) {
                var index = 0, cur = this.head;
                while (cur != null) {
                  if (cur === target)
                    return index;
                  index += cur.length();
                  cur = cur.next;
                }
                return -1;
              };
              LinkedList2.prototype.remove = function(node) {
                if (!this.contains(node))
                  return;
                if (node.prev != null)
                  node.prev.next = node.next;
                if (node.next != null)
                  node.next.prev = node.prev;
                if (node === this.head)
                  this.head = node.next;
                if (node === this.tail)
                  this.tail = node.prev;
                this.length -= 1;
              };
              LinkedList2.prototype.iterator = function(curNode) {
                if (curNode === void 0) {
                  curNode = this.head;
                }
                return function() {
                  var ret = curNode;
                  if (curNode != null)
                    curNode = curNode.next;
                  return ret;
                };
              };
              LinkedList2.prototype.find = function(index, inclusive) {
                if (inclusive === void 0) {
                  inclusive = false;
                }
                var cur, next = this.iterator();
                while (cur = next()) {
                  var length_1 = cur.length();
                  if (index < length_1 || inclusive && index === length_1 && (cur.next == null || cur.next.length() !== 0)) {
                    return [cur, index];
                  }
                  index -= length_1;
                }
                return [null, 0];
              };
              LinkedList2.prototype.forEach = function(callback) {
                var cur, next = this.iterator();
                while (cur = next()) {
                  callback(cur);
                }
              };
              LinkedList2.prototype.forEachAt = function(index, length, callback) {
                if (length <= 0)
                  return;
                var _a = this.find(index), startNode = _a[0], offset = _a[1];
                var cur, curIndex = index - offset, next = this.iterator(startNode);
                while ((cur = next()) && curIndex < index + length) {
                  var curLength = cur.length();
                  if (index > curIndex) {
                    callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
                  } else {
                    callback(cur, 0, Math.min(curLength, index + length - curIndex));
                  }
                  curIndex += curLength;
                }
              };
              LinkedList2.prototype.map = function(callback) {
                return this.reduce(function(memo, cur) {
                  memo.push(callback(cur));
                  return memo;
                }, []);
              };
              LinkedList2.prototype.reduce = function(callback, memo) {
                var cur, next = this.iterator();
                while (cur = next()) {
                  memo = callback(memo, cur);
                }
                return memo;
              };
              return LinkedList2;
            }();
            exports2.default = LinkedList;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var container_1 = __webpack_require__(2);
            var Registry = __webpack_require__(0);
            var OBSERVER_CONFIG = {
              attributes: true,
              characterData: true,
              characterDataOldValue: true,
              childList: true,
              subtree: true
            };
            var MAX_OPTIMIZE_ITERATIONS = 100;
            var ScrollBlot = function(_super) {
              __extends(ScrollBlot2, _super);
              function ScrollBlot2(node) {
                var _this = _super.call(this, node) || this;
                _this.scroll = _this;
                _this.observer = new MutationObserver(function(mutations) {
                  _this.update(mutations);
                });
                _this.observer.observe(_this.domNode, OBSERVER_CONFIG);
                _this.attach();
                return _this;
              }
              ScrollBlot2.prototype.detach = function() {
                _super.prototype.detach.call(this);
                this.observer.disconnect();
              };
              ScrollBlot2.prototype.deleteAt = function(index, length) {
                this.update();
                if (index === 0 && length === this.length()) {
                  this.children.forEach(function(child) {
                    child.remove();
                  });
                } else {
                  _super.prototype.deleteAt.call(this, index, length);
                }
              };
              ScrollBlot2.prototype.formatAt = function(index, length, name, value) {
                this.update();
                _super.prototype.formatAt.call(this, index, length, name, value);
              };
              ScrollBlot2.prototype.insertAt = function(index, value, def) {
                this.update();
                _super.prototype.insertAt.call(this, index, value, def);
              };
              ScrollBlot2.prototype.optimize = function(mutations, context) {
                var _this = this;
                if (mutations === void 0) {
                  mutations = [];
                }
                if (context === void 0) {
                  context = {};
                }
                _super.prototype.optimize.call(this, context);
                var records = [].slice.call(this.observer.takeRecords());
                while (records.length > 0)
                  mutations.push(records.pop());
                var mark = function(blot, markParent) {
                  if (markParent === void 0) {
                    markParent = true;
                  }
                  if (blot == null || blot === _this)
                    return;
                  if (blot.domNode.parentNode == null)
                    return;
                  if (blot.domNode[Registry.DATA_KEY].mutations == null) {
                    blot.domNode[Registry.DATA_KEY].mutations = [];
                  }
                  if (markParent)
                    mark(blot.parent);
                };
                var optimize = function(blot) {
                  if (blot.domNode[Registry.DATA_KEY] == null || blot.domNode[Registry.DATA_KEY].mutations == null) {
                    return;
                  }
                  if (blot instanceof container_1.default) {
                    blot.children.forEach(optimize);
                  }
                  blot.optimize(context);
                };
                var remaining = mutations;
                for (var i = 0; remaining.length > 0; i += 1) {
                  if (i >= MAX_OPTIMIZE_ITERATIONS) {
                    throw new Error("[Parchment] Maximum optimize iterations reached");
                  }
                  remaining.forEach(function(mutation) {
                    var blot = Registry.find(mutation.target, true);
                    if (blot == null)
                      return;
                    if (blot.domNode === mutation.target) {
                      if (mutation.type === "childList") {
                        mark(Registry.find(mutation.previousSibling, false));
                        [].forEach.call(mutation.addedNodes, function(node) {
                          var child = Registry.find(node, false);
                          mark(child, false);
                          if (child instanceof container_1.default) {
                            child.children.forEach(function(grandChild) {
                              mark(grandChild, false);
                            });
                          }
                        });
                      } else if (mutation.type === "attributes") {
                        mark(blot.prev);
                      }
                    }
                    mark(blot);
                  });
                  this.children.forEach(optimize);
                  remaining = [].slice.call(this.observer.takeRecords());
                  records = remaining.slice();
                  while (records.length > 0)
                    mutations.push(records.pop());
                }
              };
              ScrollBlot2.prototype.update = function(mutations, context) {
                var _this = this;
                if (context === void 0) {
                  context = {};
                }
                mutations = mutations || this.observer.takeRecords();
                mutations.map(function(mutation) {
                  var blot = Registry.find(mutation.target, true);
                  if (blot == null)
                    return null;
                  if (blot.domNode[Registry.DATA_KEY].mutations == null) {
                    blot.domNode[Registry.DATA_KEY].mutations = [mutation];
                    return blot;
                  } else {
                    blot.domNode[Registry.DATA_KEY].mutations.push(mutation);
                    return null;
                  }
                }).forEach(function(blot) {
                  if (blot == null || blot === _this || blot.domNode[Registry.DATA_KEY] == null)
                    return;
                  blot.update(blot.domNode[Registry.DATA_KEY].mutations || [], context);
                });
                if (this.domNode[Registry.DATA_KEY].mutations != null) {
                  _super.prototype.update.call(this, this.domNode[Registry.DATA_KEY].mutations, context);
                }
                this.optimize(mutations, context);
              };
              ScrollBlot2.blotName = "scroll";
              ScrollBlot2.defaultChild = "block";
              ScrollBlot2.scope = Registry.Scope.BLOCK_BLOT;
              ScrollBlot2.tagName = "DIV";
              return ScrollBlot2;
            }(container_1.default);
            exports2.default = ScrollBlot;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var format_1 = __webpack_require__(3);
            var Registry = __webpack_require__(0);
            function isEqual(obj1, obj2) {
              if (Object.keys(obj1).length !== Object.keys(obj2).length)
                return false;
              for (var prop in obj1) {
                if (obj1[prop] !== obj2[prop])
                  return false;
              }
              return true;
            }
            var InlineBlot = function(_super) {
              __extends(InlineBlot2, _super);
              function InlineBlot2() {
                return _super !== null && _super.apply(this, arguments) || this;
              }
              InlineBlot2.formats = function(domNode) {
                if (domNode.tagName === InlineBlot2.tagName)
                  return void 0;
                return _super.formats.call(this, domNode);
              };
              InlineBlot2.prototype.format = function(name, value) {
                var _this = this;
                if (name === this.statics.blotName && !value) {
                  this.children.forEach(function(child) {
                    if (!(child instanceof format_1.default)) {
                      child = child.wrap(InlineBlot2.blotName, true);
                    }
                    _this.attributes.copy(child);
                  });
                  this.unwrap();
                } else {
                  _super.prototype.format.call(this, name, value);
                }
              };
              InlineBlot2.prototype.formatAt = function(index, length, name, value) {
                if (this.formats()[name] != null || Registry.query(name, Registry.Scope.ATTRIBUTE)) {
                  var blot = this.isolate(index, length);
                  blot.format(name, value);
                } else {
                  _super.prototype.formatAt.call(this, index, length, name, value);
                }
              };
              InlineBlot2.prototype.optimize = function(context) {
                _super.prototype.optimize.call(this, context);
                var formats = this.formats();
                if (Object.keys(formats).length === 0) {
                  return this.unwrap();
                }
                var next = this.next;
                if (next instanceof InlineBlot2 && next.prev === this && isEqual(formats, next.formats())) {
                  next.moveChildren(this);
                  next.remove();
                }
              };
              InlineBlot2.blotName = "inline";
              InlineBlot2.scope = Registry.Scope.INLINE_BLOT;
              InlineBlot2.tagName = "SPAN";
              return InlineBlot2;
            }(format_1.default);
            exports2.default = InlineBlot;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var format_1 = __webpack_require__(3);
            var Registry = __webpack_require__(0);
            var BlockBlot = function(_super) {
              __extends(BlockBlot2, _super);
              function BlockBlot2() {
                return _super !== null && _super.apply(this, arguments) || this;
              }
              BlockBlot2.formats = function(domNode) {
                var tagName = Registry.query(BlockBlot2.blotName).tagName;
                if (domNode.tagName === tagName)
                  return void 0;
                return _super.formats.call(this, domNode);
              };
              BlockBlot2.prototype.format = function(name, value) {
                if (Registry.query(name, Registry.Scope.BLOCK) == null) {
                  return;
                } else if (name === this.statics.blotName && !value) {
                  this.replaceWith(BlockBlot2.blotName);
                } else {
                  _super.prototype.format.call(this, name, value);
                }
              };
              BlockBlot2.prototype.formatAt = function(index, length, name, value) {
                if (Registry.query(name, Registry.Scope.BLOCK) != null) {
                  this.format(name, value);
                } else {
                  _super.prototype.formatAt.call(this, index, length, name, value);
                }
              };
              BlockBlot2.prototype.insertAt = function(index, value, def) {
                if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
                  _super.prototype.insertAt.call(this, index, value, def);
                } else {
                  var after = this.split(index);
                  var blot = Registry.create(value, def);
                  after.parent.insertBefore(blot, after);
                }
              };
              BlockBlot2.prototype.update = function(mutations, context) {
                if (navigator.userAgent.match(/Trident/)) {
                  this.build();
                } else {
                  _super.prototype.update.call(this, mutations, context);
                }
              };
              BlockBlot2.blotName = "block";
              BlockBlot2.scope = Registry.Scope.BLOCK_BLOT;
              BlockBlot2.tagName = "P";
              return BlockBlot2;
            }(format_1.default);
            exports2.default = BlockBlot;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var leaf_1 = __webpack_require__(4);
            var EmbedBlot = function(_super) {
              __extends(EmbedBlot2, _super);
              function EmbedBlot2() {
                return _super !== null && _super.apply(this, arguments) || this;
              }
              EmbedBlot2.formats = function(domNode) {
                return void 0;
              };
              EmbedBlot2.prototype.format = function(name, value) {
                _super.prototype.formatAt.call(this, 0, this.length(), name, value);
              };
              EmbedBlot2.prototype.formatAt = function(index, length, name, value) {
                if (index === 0 && length === this.length()) {
                  this.format(name, value);
                } else {
                  _super.prototype.formatAt.call(this, index, length, name, value);
                }
              };
              EmbedBlot2.prototype.formats = function() {
                return this.statics.formats(this.domNode);
              };
              return EmbedBlot2;
            }(leaf_1.default);
            exports2.default = EmbedBlot;
          },
          function(module2, exports2, __webpack_require__) {
            "use strict";
            var __extends = this && this.__extends || function() {
              var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
                d.__proto__ = b;
              } || function(d, b) {
                for (var p in b)
                  if (b.hasOwnProperty(p))
                    d[p] = b[p];
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
              };
            }();
            Object.defineProperty(exports2, "__esModule", { value: true });
            var leaf_1 = __webpack_require__(4);
            var Registry = __webpack_require__(0);
            var TextBlot2 = function(_super) {
              __extends(TextBlot3, _super);
              function TextBlot3(node) {
                var _this = _super.call(this, node) || this;
                _this.text = _this.statics.value(_this.domNode);
                return _this;
              }
              TextBlot3.create = function(value) {
                return document.createTextNode(value);
              };
              TextBlot3.value = function(domNode) {
                var text = domNode.data;
                if (text["normalize"])
                  text = text["normalize"]();
                return text;
              };
              TextBlot3.prototype.deleteAt = function(index, length) {
                this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
              };
              TextBlot3.prototype.index = function(node, offset) {
                if (this.domNode === node) {
                  return offset;
                }
                return -1;
              };
              TextBlot3.prototype.insertAt = function(index, value, def) {
                if (def == null) {
                  this.text = this.text.slice(0, index) + value + this.text.slice(index);
                  this.domNode.data = this.text;
                } else {
                  _super.prototype.insertAt.call(this, index, value, def);
                }
              };
              TextBlot3.prototype.length = function() {
                return this.text.length;
              };
              TextBlot3.prototype.optimize = function(context) {
                _super.prototype.optimize.call(this, context);
                this.text = this.statics.value(this.domNode);
                if (this.text.length === 0) {
                  this.remove();
                } else if (this.next instanceof TextBlot3 && this.next.prev === this) {
                  this.insertAt(this.length(), this.next.value());
                  this.next.remove();
                }
              };
              TextBlot3.prototype.position = function(index, inclusive) {
                if (inclusive === void 0) {
                  inclusive = false;
                }
                return [this.domNode, index];
              };
              TextBlot3.prototype.split = function(index, force) {
                if (force === void 0) {
                  force = false;
                }
                if (!force) {
                  if (index === 0)
                    return this;
                  if (index === this.length())
                    return this.next;
                }
                var after = Registry.create(this.domNode.splitText(index));
                this.parent.insertBefore(after, this.next);
                this.text = this.statics.value(this.domNode);
                return after;
              };
              TextBlot3.prototype.update = function(mutations, context) {
                var _this = this;
                if (mutations.some(function(mutation) {
                  return mutation.type === "characterData" && mutation.target === _this.domNode;
                })) {
                  this.text = this.statics.value(this.domNode);
                }
              };
              TextBlot3.prototype.value = function() {
                return this.text;
              };
              TextBlot3.blotName = "text";
              TextBlot3.scope = Registry.Scope.INLINE_BLOT;
              return TextBlot3;
            }(leaf_1.default);
            exports2.default = TextBlot2;
          }
        ]);
      });
    }
  });

  // node_modules/clone/clone.js
  var require_clone = __commonJS({
    "node_modules/clone/clone.js"(exports, module) {
      var clone3 = function() {
        "use strict";
        function _instanceof(obj, type) {
          return type != null && obj instanceof type;
        }
        var nativeMap;
        try {
          nativeMap = Map;
        } catch (_) {
          nativeMap = function() {
          };
        }
        var nativeSet;
        try {
          nativeSet = Set;
        } catch (_) {
          nativeSet = function() {
          };
        }
        var nativePromise;
        try {
          nativePromise = Promise;
        } catch (_) {
          nativePromise = function() {
          };
        }
        function clone4(parent, circular, depth, prototype, includeNonEnumerable) {
          if (typeof circular === "object") {
            depth = circular.depth;
            prototype = circular.prototype;
            includeNonEnumerable = circular.includeNonEnumerable;
            circular = circular.circular;
          }
          var allParents = [];
          var allChildren = [];
          var useBuffer = typeof Buffer != "undefined";
          if (typeof circular == "undefined")
            circular = true;
          if (typeof depth == "undefined")
            depth = Infinity;
          function _clone(parent2, depth2) {
            if (parent2 === null)
              return null;
            if (depth2 === 0)
              return parent2;
            var child;
            var proto;
            if (typeof parent2 != "object") {
              return parent2;
            }
            if (_instanceof(parent2, nativeMap)) {
              child = new nativeMap();
            } else if (_instanceof(parent2, nativeSet)) {
              child = new nativeSet();
            } else if (_instanceof(parent2, nativePromise)) {
              child = new nativePromise(function(resolve, reject) {
                parent2.then(function(value) {
                  resolve(_clone(value, depth2 - 1));
                }, function(err) {
                  reject(_clone(err, depth2 - 1));
                });
              });
            } else if (clone4.__isArray(parent2)) {
              child = [];
            } else if (clone4.__isRegExp(parent2)) {
              child = new RegExp(parent2.source, __getRegExpFlags(parent2));
              if (parent2.lastIndex)
                child.lastIndex = parent2.lastIndex;
            } else if (clone4.__isDate(parent2)) {
              child = new Date(parent2.getTime());
            } else if (useBuffer && Buffer.isBuffer(parent2)) {
              if (Buffer.allocUnsafe) {
                child = Buffer.allocUnsafe(parent2.length);
              } else {
                child = new Buffer(parent2.length);
              }
              parent2.copy(child);
              return child;
            } else if (_instanceof(parent2, Error)) {
              child = Object.create(parent2);
            } else {
              if (typeof prototype == "undefined") {
                proto = Object.getPrototypeOf(parent2);
                child = Object.create(proto);
              } else {
                child = Object.create(prototype);
                proto = prototype;
              }
            }
            if (circular) {
              var index = allParents.indexOf(parent2);
              if (index != -1) {
                return allChildren[index];
              }
              allParents.push(parent2);
              allChildren.push(child);
            }
            if (_instanceof(parent2, nativeMap)) {
              parent2.forEach(function(value, key) {
                var keyChild = _clone(key, depth2 - 1);
                var valueChild = _clone(value, depth2 - 1);
                child.set(keyChild, valueChild);
              });
            }
            if (_instanceof(parent2, nativeSet)) {
              parent2.forEach(function(value) {
                var entryChild = _clone(value, depth2 - 1);
                child.add(entryChild);
              });
            }
            for (var i in parent2) {
              var attrs;
              if (proto) {
                attrs = Object.getOwnPropertyDescriptor(proto, i);
              }
              if (attrs && attrs.set == null) {
                continue;
              }
              child[i] = _clone(parent2[i], depth2 - 1);
            }
            if (Object.getOwnPropertySymbols) {
              var symbols = Object.getOwnPropertySymbols(parent2);
              for (var i = 0; i < symbols.length; i++) {
                var symbol = symbols[i];
                var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
                if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
                  continue;
                }
                child[symbol] = _clone(parent2[symbol], depth2 - 1);
                if (!descriptor.enumerable) {
                  Object.defineProperty(child, symbol, {
                    enumerable: false
                  });
                }
              }
            }
            if (includeNonEnumerable) {
              var allPropertyNames = Object.getOwnPropertyNames(parent2);
              for (var i = 0; i < allPropertyNames.length; i++) {
                var propertyName = allPropertyNames[i];
                var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
                if (descriptor && descriptor.enumerable) {
                  continue;
                }
                child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
                Object.defineProperty(child, propertyName, {
                  enumerable: false
                });
              }
            }
            return child;
          }
          return _clone(parent, depth);
        }
        clone4.clonePrototype = function clonePrototype(parent) {
          if (parent === null)
            return null;
          var c = function() {
          };
          c.prototype = parent;
          return new c();
        };
        function __objToStr(o) {
          return Object.prototype.toString.call(o);
        }
        clone4.__objToStr = __objToStr;
        function __isDate(o) {
          return typeof o === "object" && __objToStr(o) === "[object Date]";
        }
        clone4.__isDate = __isDate;
        function __isArray(o) {
          return typeof o === "object" && __objToStr(o) === "[object Array]";
        }
        clone4.__isArray = __isArray;
        function __isRegExp(o) {
          return typeof o === "object" && __objToStr(o) === "[object RegExp]";
        }
        clone4.__isRegExp = __isRegExp;
        function __getRegExpFlags(re) {
          var flags = "";
          if (re.global)
            flags += "g";
          if (re.ignoreCase)
            flags += "i";
          if (re.multiline)
            flags += "m";
          return flags;
        }
        clone4.__getRegExpFlags = __getRegExpFlags;
        return clone4;
      }();
      if (typeof module === "object" && module.exports) {
        module.exports = clone3;
      }
    }
  });

  // node_modules/eventemitter3/index.js
  var require_eventemitter3 = __commonJS({
    "node_modules/eventemitter3/index.js"(exports, module) {
      "use strict";
      var has = Object.prototype.hasOwnProperty;
      var prefix = "~";
      function Events() {
      }
      if (Object.create) {
        Events.prototype = /* @__PURE__ */ Object.create(null);
        if (!new Events().__proto__)
          prefix = false;
      }
      function EE(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
      }
      function EventEmitter2() {
        this._events = new Events();
        this._eventsCount = 0;
      }
      EventEmitter2.prototype.eventNames = function eventNames() {
        var names = [], events, name;
        if (this._eventsCount === 0)
          return names;
        for (name in events = this._events) {
          if (has.call(events, name))
            names.push(prefix ? name.slice(1) : name);
        }
        if (Object.getOwnPropertySymbols) {
          return names.concat(Object.getOwnPropertySymbols(events));
        }
        return names;
      };
      EventEmitter2.prototype.listeners = function listeners(event, exists) {
        var evt = prefix ? prefix + event : event, available = this._events[evt];
        if (exists)
          return !!available;
        if (!available)
          return [];
        if (available.fn)
          return [available.fn];
        for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
          ee[i] = available[i].fn;
        }
        return ee;
      };
      EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt])
          return false;
        var listeners = this._events[evt], len = arguments.length, args, i;
        if (listeners.fn) {
          if (listeners.once)
            this.removeListener(event, listeners.fn, void 0, true);
          switch (len) {
            case 1:
              return listeners.fn.call(listeners.context), true;
            case 2:
              return listeners.fn.call(listeners.context, a1), true;
            case 3:
              return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
              return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
          }
          for (i = 1, args = new Array(len - 1); i < len; i++) {
            args[i - 1] = arguments[i];
          }
          listeners.fn.apply(listeners.context, args);
        } else {
          var length = listeners.length, j;
          for (i = 0; i < length; i++) {
            if (listeners[i].once)
              this.removeListener(event, listeners[i].fn, void 0, true);
            switch (len) {
              case 1:
                listeners[i].fn.call(listeners[i].context);
                break;
              case 2:
                listeners[i].fn.call(listeners[i].context, a1);
                break;
              case 3:
                listeners[i].fn.call(listeners[i].context, a1, a2);
                break;
              case 4:
                listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                break;
              default:
                if (!args)
                  for (j = 1, args = new Array(len - 1); j < len; j++) {
                    args[j - 1] = arguments[j];
                  }
                listeners[i].fn.apply(listeners[i].context, args);
            }
          }
        }
        return true;
      };
      EventEmitter2.prototype.on = function on(event, fn, context) {
        var listener = new EE(fn, context || this), evt = prefix ? prefix + event : event;
        if (!this._events[evt])
          this._events[evt] = listener, this._eventsCount++;
        else if (!this._events[evt].fn)
          this._events[evt].push(listener);
        else
          this._events[evt] = [this._events[evt], listener];
        return this;
      };
      EventEmitter2.prototype.once = function once(event, fn, context) {
        var listener = new EE(fn, context || this, true), evt = prefix ? prefix + event : event;
        if (!this._events[evt])
          this._events[evt] = listener, this._eventsCount++;
        else if (!this._events[evt].fn)
          this._events[evt].push(listener);
        else
          this._events[evt] = [this._events[evt], listener];
        return this;
      };
      EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt])
          return this;
        if (!fn) {
          if (--this._eventsCount === 0)
            this._events = new Events();
          else
            delete this._events[evt];
          return this;
        }
        var listeners = this._events[evt];
        if (listeners.fn) {
          if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            if (--this._eventsCount === 0)
              this._events = new Events();
            else
              delete this._events[evt];
          }
        } else {
          for (var i = 0, events = [], length = listeners.length; i < length; i++) {
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
              events.push(listeners[i]);
            }
          }
          if (events.length)
            this._events[evt] = events.length === 1 ? events[0] : events;
          else if (--this._eventsCount === 0)
            this._events = new Events();
          else
            delete this._events[evt];
        }
        return this;
      };
      EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
        var evt;
        if (event) {
          evt = prefix ? prefix + event : event;
          if (this._events[evt]) {
            if (--this._eventsCount === 0)
              this._events = new Events();
            else
              delete this._events[evt];
          }
        } else {
          this._events = new Events();
          this._eventsCount = 0;
        }
        return this;
      };
      EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
      EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
      EventEmitter2.prototype.setMaxListeners = function setMaxListeners() {
        return this;
      };
      EventEmitter2.prefixed = prefix;
      EventEmitter2.EventEmitter = EventEmitter2;
      if ("undefined" !== typeof module) {
        module.exports = EventEmitter2;
      }
    }
  });

  // node_modules/quill/core/polyfill.js
  var elem = document.createElement("div");
  elem.classList.toggle("test-class", false);
  if (elem.classList.contains("test-class")) {
    let _toggle = DOMTokenList.prototype.toggle;
    DOMTokenList.prototype.toggle = function(token, force) {
      if (arguments.length > 1 && !this.contains(token) === !force) {
        return force;
      } else {
        return _toggle.call(this, token);
      }
    };
  }
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== "number" || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
      value: function(predicate) {
        if (this === null) {
          throw new TypeError("Array.prototype.find called on null or undefined");
        }
        if (typeof predicate !== "function") {
          throw new TypeError("predicate must be a function");
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return void 0;
      }
    });
  }
  document.addEventListener("DOMContentLoaded", function() {
    document.execCommand("enableObjectResizing", false, false);
    document.execCommand("autoUrlDetect", false, false);
  });

  // node_modules/quill/core/quill.js
  var import_quill_delta4 = __toESM(require_delta());

  // node_modules/quill/core/editor.js
  var import_quill_delta3 = __toESM(require_delta());
  var import_op = __toESM(require_op());
  var import_parchment7 = __toESM(require_parchment());

  // node_modules/quill/formats/code.js
  var import_quill_delta2 = __toESM(require_delta());
  var import_parchment5 = __toESM(require_parchment());

  // node_modules/quill/blots/block.js
  var import_extend = __toESM(require_extend());
  var import_quill_delta = __toESM(require_delta());
  var import_parchment4 = __toESM(require_parchment());

  // node_modules/quill/blots/break.js
  var import_parchment = __toESM(require_parchment());
  var Break = class extends import_parchment.default.Embed {
    static value() {
      return void 0;
    }
    insertInto(parent, ref) {
      if (parent.children.length === 0) {
        super.insertInto(parent, ref);
      } else {
        this.remove();
      }
    }
    length() {
      return 0;
    }
    value() {
      return "";
    }
  };
  Break.blotName = "break";
  Break.tagName = "BR";
  var break_default = Break;

  // node_modules/quill/blots/text.js
  var import_parchment2 = __toESM(require_parchment());
  var TextBlot = class extends import_parchment2.default.Text {
  };
  var text_default = TextBlot;

  // node_modules/quill/blots/inline.js
  var import_parchment3 = __toESM(require_parchment());
  var Inline = class extends import_parchment3.default.Inline {
    static compare(self2, other) {
      let selfIndex = Inline.order.indexOf(self2);
      let otherIndex = Inline.order.indexOf(other);
      if (selfIndex >= 0 || otherIndex >= 0) {
        return selfIndex - otherIndex;
      } else if (self2 === other) {
        return 0;
      } else if (self2 < other) {
        return -1;
      } else {
        return 1;
      }
    }
    formatAt(index, length, name, value) {
      if (Inline.compare(this.statics.blotName, name) < 0 && import_parchment3.default.query(name, import_parchment3.default.Scope.BLOT)) {
        let blot = this.isolate(index, length);
        if (value) {
          blot.wrap(name, value);
        }
      } else {
        super.formatAt(index, length, name, value);
      }
    }
    optimize(context) {
      super.optimize(context);
      if (this.parent instanceof Inline && Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
        let parent = this.parent.isolate(this.offset(), this.length());
        this.moveChildren(parent);
        parent.wrap(this);
      }
    }
  };
  Inline.allowedChildren = [Inline, import_parchment3.default.Embed, text_default];
  Inline.order = [
    "cursor",
    "inline",
    "underline",
    "strike",
    "italic",
    "bold",
    "script",
    "link",
    "code"
  ];
  var inline_default = Inline;

  // node_modules/quill/blots/block.js
  var NEWLINE_LENGTH = 1;
  var BlockEmbed = class extends import_parchment4.default.Embed {
    attach() {
      super.attach();
      this.attributes = new import_parchment4.default.Attributor.Store(this.domNode);
    }
    delta() {
      return new import_quill_delta.default().insert(this.value(), (0, import_extend.default)(this.formats(), this.attributes.values()));
    }
    format(name, value) {
      let attribute = import_parchment4.default.query(name, import_parchment4.default.Scope.BLOCK_ATTRIBUTE);
      if (attribute != null) {
        this.attributes.attribute(attribute, value);
      }
    }
    formatAt(index, length, name, value) {
      this.format(name, value);
    }
    insertAt(index, value, def) {
      if (typeof value === "string" && value.endsWith("\n")) {
        let block = import_parchment4.default.create(Block.blotName);
        this.parent.insertBefore(block, index === 0 ? this : this.next);
        block.insertAt(0, value.slice(0, -1));
      } else {
        super.insertAt(index, value, def);
      }
    }
  };
  BlockEmbed.scope = import_parchment4.default.Scope.BLOCK_BLOT;
  var Block = class extends import_parchment4.default.Block {
    constructor(domNode) {
      super(domNode);
      this.cache = {};
    }
    delta() {
      if (this.cache.delta == null) {
        this.cache.delta = this.descendants(import_parchment4.default.Leaf).reduce((delta, leaf) => {
          if (leaf.length() === 0) {
            return delta;
          } else {
            return delta.insert(leaf.value(), bubbleFormats(leaf));
          }
        }, new import_quill_delta.default()).insert("\n", bubbleFormats(this));
      }
      return this.cache.delta;
    }
    deleteAt(index, length) {
      super.deleteAt(index, length);
      this.cache = {};
    }
    formatAt(index, length, name, value) {
      if (length <= 0)
        return;
      if (import_parchment4.default.query(name, import_parchment4.default.Scope.BLOCK)) {
        if (index + length === this.length()) {
          this.format(name, value);
        }
      } else {
        super.formatAt(index, Math.min(length, this.length() - index - 1), name, value);
      }
      this.cache = {};
    }
    insertAt(index, value, def) {
      if (def != null)
        return super.insertAt(index, value, def);
      if (value.length === 0)
        return;
      let lines = value.split("\n");
      let text = lines.shift();
      if (text.length > 0) {
        if (index < this.length() - 1 || this.children.tail == null) {
          super.insertAt(Math.min(index, this.length() - 1), text);
        } else {
          this.children.tail.insertAt(this.children.tail.length(), text);
        }
        this.cache = {};
      }
      let block = this;
      lines.reduce(function(index2, line) {
        block = block.split(index2, true);
        block.insertAt(0, line);
        return line.length;
      }, index + text.length);
    }
    insertBefore(blot, ref) {
      let head = this.children.head;
      super.insertBefore(blot, ref);
      if (head instanceof break_default) {
        head.remove();
      }
      this.cache = {};
    }
    length() {
      if (this.cache.length == null) {
        this.cache.length = super.length() + NEWLINE_LENGTH;
      }
      return this.cache.length;
    }
    moveChildren(target, ref) {
      super.moveChildren(target, ref);
      this.cache = {};
    }
    optimize(context) {
      super.optimize(context);
      this.cache = {};
    }
    path(index) {
      return super.path(index, true);
    }
    removeChild(child) {
      super.removeChild(child);
      this.cache = {};
    }
    split(index, force = false) {
      if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
        let clone3 = this.clone();
        if (index === 0) {
          this.parent.insertBefore(clone3, this);
          return this;
        } else {
          this.parent.insertBefore(clone3, this.next);
          return clone3;
        }
      } else {
        let next = super.split(index, force);
        this.cache = {};
        return next;
      }
    }
  };
  Block.blotName = "block";
  Block.tagName = "P";
  Block.defaultChild = "break";
  Block.allowedChildren = [inline_default, import_parchment4.default.Embed, text_default];
  function bubbleFormats(blot, formats = {}) {
    if (blot == null)
      return formats;
    if (typeof blot.formats === "function") {
      formats = (0, import_extend.default)(formats, blot.formats());
    }
    if (blot.parent == null || blot.parent.blotName == "scroll" || blot.parent.statics.scope !== blot.statics.scope) {
      return formats;
    }
    return bubbleFormats(blot.parent, formats);
  }

  // node_modules/quill/formats/code.js
  var Code = class extends inline_default {
  };
  Code.blotName = "code";
  Code.tagName = "CODE";
  var CodeBlock = class extends Block {
    static create(value) {
      let domNode = super.create(value);
      domNode.setAttribute("spellcheck", false);
      return domNode;
    }
    static formats() {
      return true;
    }
    delta() {
      let text = this.domNode.textContent;
      if (text.endsWith("\n")) {
        text = text.slice(0, -1);
      }
      return text.split("\n").reduce((delta, frag) => {
        return delta.insert(frag).insert("\n", this.formats());
      }, new import_quill_delta2.default());
    }
    format(name, value) {
      if (name === this.statics.blotName && value)
        return;
      let [text] = this.descendant(text_default, this.length() - 1);
      if (text != null) {
        text.deleteAt(text.length() - 1, 1);
      }
      super.format(name, value);
    }
    formatAt(index, length, name, value) {
      if (length === 0)
        return;
      if (import_parchment5.default.query(name, import_parchment5.default.Scope.BLOCK) == null || name === this.statics.blotName && value === this.statics.formats(this.domNode)) {
        return;
      }
      let nextNewline = this.newlineIndex(index);
      if (nextNewline < 0 || nextNewline >= index + length)
        return;
      let prevNewline = this.newlineIndex(index, true) + 1;
      let isolateLength = nextNewline - prevNewline + 1;
      let blot = this.isolate(prevNewline, isolateLength);
      let next = blot.next;
      blot.format(name, value);
      if (next instanceof CodeBlock) {
        next.formatAt(0, index - prevNewline + length - isolateLength, name, value);
      }
    }
    insertAt(index, value, def) {
      if (def != null)
        return;
      let [text, offset] = this.descendant(text_default, index);
      text.insertAt(offset, value);
    }
    length() {
      let length = this.domNode.textContent.length;
      if (!this.domNode.textContent.endsWith("\n")) {
        return length + 1;
      }
      return length;
    }
    newlineIndex(searchIndex, reverse = false) {
      if (!reverse) {
        let offset = this.domNode.textContent.slice(searchIndex).indexOf("\n");
        return offset > -1 ? searchIndex + offset : -1;
      } else {
        return this.domNode.textContent.slice(0, searchIndex).lastIndexOf("\n");
      }
    }
    optimize(context) {
      if (!this.domNode.textContent.endsWith("\n")) {
        this.appendChild(import_parchment5.default.create("text", "\n"));
      }
      super.optimize(context);
      let next = this.next;
      if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && this.statics.formats(this.domNode) === next.statics.formats(next.domNode)) {
        next.optimize(context);
        next.moveChildren(this);
        next.remove();
      }
    }
    replace(target) {
      super.replace(target);
      [].slice.call(this.domNode.querySelectorAll("*")).forEach(function(node) {
        let blot = import_parchment5.default.find(node);
        if (blot == null) {
          node.parentNode.removeChild(node);
        } else if (blot instanceof import_parchment5.default.Embed) {
          blot.remove();
        } else {
          blot.unwrap();
        }
      });
    }
  };
  CodeBlock.blotName = "code-block";
  CodeBlock.tagName = "PRE";
  CodeBlock.TAB = "  ";

  // node_modules/quill/blots/cursor.js
  var import_parchment6 = __toESM(require_parchment());
  var Cursor = class extends import_parchment6.default.Embed {
    static value() {
      return void 0;
    }
    constructor(domNode, selection) {
      super(domNode);
      this.selection = selection;
      this.textNode = document.createTextNode(Cursor.CONTENTS);
      this.domNode.appendChild(this.textNode);
      this._length = 0;
    }
    detach() {
      if (this.parent != null)
        this.parent.removeChild(this);
    }
    format(name, value) {
      if (this._length !== 0) {
        return super.format(name, value);
      }
      let target = this, index = 0;
      while (target != null && target.statics.scope !== import_parchment6.default.Scope.BLOCK_BLOT) {
        index += target.offset(target.parent);
        target = target.parent;
      }
      if (target != null) {
        this._length = Cursor.CONTENTS.length;
        target.optimize();
        target.formatAt(index, Cursor.CONTENTS.length, name, value);
        this._length = 0;
      }
    }
    index(node, offset) {
      if (node === this.textNode)
        return 0;
      return super.index(node, offset);
    }
    length() {
      return this._length;
    }
    position() {
      return [this.textNode, this.textNode.data.length];
    }
    remove() {
      super.remove();
      this.parent = null;
    }
    restore() {
      if (this.selection.composing || this.parent == null)
        return;
      let textNode = this.textNode;
      let range = this.selection.getNativeRange();
      let restoreText, start, end;
      if (range != null && range.start.node === textNode && range.end.node === textNode) {
        [restoreText, start, end] = [textNode, range.start.offset, range.end.offset];
      }
      while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
        this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
      }
      if (this.textNode.data !== Cursor.CONTENTS) {
        let text = this.textNode.data.split(Cursor.CONTENTS).join("");
        if (this.next instanceof text_default) {
          restoreText = this.next.domNode;
          this.next.insertAt(0, text);
          this.textNode.data = Cursor.CONTENTS;
        } else {
          this.textNode.data = text;
          this.parent.insertBefore(import_parchment6.default.create(this.textNode), this);
          this.textNode = document.createTextNode(Cursor.CONTENTS);
          this.domNode.appendChild(this.textNode);
        }
      }
      this.remove();
      if (start != null) {
        [start, end] = [start, end].map(function(offset) {
          return Math.max(0, Math.min(restoreText.data.length, offset - 1));
        });
        return {
          startNode: restoreText,
          startOffset: start,
          endNode: restoreText,
          endOffset: end
        };
      }
    }
    update(mutations, context) {
      if (mutations.some((mutation) => {
        return mutation.type === "characterData" && mutation.target === this.textNode;
      })) {
        let range = this.restore();
        if (range)
          context.range = range;
      }
    }
    value() {
      return "";
    }
  };
  Cursor.blotName = "cursor";
  Cursor.className = "ql-cursor";
  Cursor.tagName = "span";
  Cursor.CONTENTS = "\uFEFF";
  var cursor_default = Cursor;

  // node_modules/quill/core/editor.js
  var import_clone = __toESM(require_clone());
  var import_deep_equal = __toESM(require_deep_equal());
  var import_extend2 = __toESM(require_extend());
  var ASCII = /^[ -~]*$/;
  var Editor = class {
    constructor(scroll) {
      this.scroll = scroll;
      this.delta = this.getDelta();
    }
    applyDelta(delta) {
      let consumeNextNewline = false;
      this.scroll.update();
      let scrollLength = this.scroll.length();
      this.scroll.batchStart();
      delta = normalizeDelta(delta);
      delta.reduce((index, op) => {
        let length = op.retain || op.delete || op.insert.length || 1;
        let attributes = op.attributes || {};
        if (op.insert != null) {
          if (typeof op.insert === "string") {
            let text = op.insert;
            if (text.endsWith("\n") && consumeNextNewline) {
              consumeNextNewline = false;
              text = text.slice(0, -1);
            }
            if (index >= scrollLength && !text.endsWith("\n")) {
              consumeNextNewline = true;
            }
            this.scroll.insertAt(index, text);
            let [line, offset] = this.scroll.line(index);
            let formats = (0, import_extend2.default)({}, bubbleFormats(line));
            if (line instanceof Block) {
              let [leaf] = line.descendant(import_parchment7.default.Leaf, offset);
              formats = (0, import_extend2.default)(formats, bubbleFormats(leaf));
            }
            attributes = import_op.default.attributes.diff(formats, attributes) || {};
          } else if (typeof op.insert === "object") {
            let key = Object.keys(op.insert)[0];
            if (key == null)
              return index;
            this.scroll.insertAt(index, key, op.insert[key]);
          }
          scrollLength += length;
        }
        Object.keys(attributes).forEach((name) => {
          this.scroll.formatAt(index, length, name, attributes[name]);
        });
        return index + length;
      }, 0);
      delta.reduce((index, op) => {
        if (typeof op.delete === "number") {
          this.scroll.deleteAt(index, op.delete);
          return index;
        }
        return index + (op.retain || op.insert.length || 1);
      }, 0);
      this.scroll.batchEnd();
      return this.update(delta);
    }
    deleteText(index, length) {
      this.scroll.deleteAt(index, length);
      return this.update(new import_quill_delta3.default().retain(index).delete(length));
    }
    formatLine(index, length, formats = {}) {
      this.scroll.update();
      Object.keys(formats).forEach((format) => {
        if (this.scroll.whitelist != null && !this.scroll.whitelist[format])
          return;
        let lines = this.scroll.lines(index, Math.max(length, 1));
        let lengthRemaining = length;
        lines.forEach((line) => {
          let lineLength = line.length();
          if (!(line instanceof CodeBlock)) {
            line.format(format, formats[format]);
          } else {
            let codeIndex = index - line.offset(this.scroll);
            let codeLength = line.newlineIndex(codeIndex + lengthRemaining) - codeIndex + 1;
            line.formatAt(codeIndex, codeLength, format, formats[format]);
          }
          lengthRemaining -= lineLength;
        });
      });
      this.scroll.optimize();
      return this.update(new import_quill_delta3.default().retain(index).retain(length, (0, import_clone.default)(formats)));
    }
    formatText(index, length, formats = {}) {
      Object.keys(formats).forEach((format) => {
        this.scroll.formatAt(index, length, format, formats[format]);
      });
      return this.update(new import_quill_delta3.default().retain(index).retain(length, (0, import_clone.default)(formats)));
    }
    getContents(index, length) {
      return this.delta.slice(index, index + length);
    }
    getDelta() {
      return this.scroll.lines().reduce((delta, line) => {
        return delta.concat(line.delta());
      }, new import_quill_delta3.default());
    }
    getFormat(index, length = 0) {
      let lines = [], leaves = [];
      if (length === 0) {
        this.scroll.path(index).forEach(function(path) {
          let [blot] = path;
          if (blot instanceof Block) {
            lines.push(blot);
          } else if (blot instanceof import_parchment7.default.Leaf) {
            leaves.push(blot);
          }
        });
      } else {
        lines = this.scroll.lines(index, length);
        leaves = this.scroll.descendants(import_parchment7.default.Leaf, index, length);
      }
      let formatsArr = [lines, leaves].map(function(blots) {
        if (blots.length === 0)
          return {};
        let formats = bubbleFormats(blots.shift());
        while (Object.keys(formats).length > 0) {
          let blot = blots.shift();
          if (blot == null)
            return formats;
          formats = combineFormats(bubbleFormats(blot), formats);
        }
        return formats;
      });
      return import_extend2.default.apply(import_extend2.default, formatsArr);
    }
    getText(index, length) {
      return this.getContents(index, length).filter(function(op) {
        return typeof op.insert === "string";
      }).map(function(op) {
        return op.insert;
      }).join("");
    }
    insertEmbed(index, embed, value) {
      this.scroll.insertAt(index, embed, value);
      return this.update(new import_quill_delta3.default().retain(index).insert({ [embed]: value }));
    }
    insertText(index, text, formats = {}) {
      text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      this.scroll.insertAt(index, text);
      Object.keys(formats).forEach((format) => {
        this.scroll.formatAt(index, text.length, format, formats[format]);
      });
      return this.update(new import_quill_delta3.default().retain(index).insert(text, (0, import_clone.default)(formats)));
    }
    isBlank() {
      if (this.scroll.children.length == 0)
        return true;
      if (this.scroll.children.length > 1)
        return false;
      let block = this.scroll.children.head;
      if (block.statics.blotName !== Block.blotName)
        return false;
      if (block.children.length > 1)
        return false;
      return block.children.head instanceof break_default;
    }
    removeFormat(index, length) {
      let text = this.getText(index, length);
      let [line, offset] = this.scroll.line(index + length);
      let suffixLength = 0, suffix = new import_quill_delta3.default();
      if (line != null) {
        if (!(line instanceof CodeBlock)) {
          suffixLength = line.length() - offset;
        } else {
          suffixLength = line.newlineIndex(offset) - offset + 1;
        }
        suffix = line.delta().slice(offset, offset + suffixLength - 1).insert("\n");
      }
      let contents = this.getContents(index, length + suffixLength);
      let diff = contents.diff(new import_quill_delta3.default().insert(text).concat(suffix));
      let delta = new import_quill_delta3.default().retain(index).concat(diff);
      return this.applyDelta(delta);
    }
    update(change, mutations = [], cursorIndex = void 0) {
      let oldDelta = this.delta;
      if (mutations.length === 1 && mutations[0].type === "characterData" && mutations[0].target.data.match(ASCII) && import_parchment7.default.find(mutations[0].target)) {
        let textBlot = import_parchment7.default.find(mutations[0].target);
        let formats = bubbleFormats(textBlot);
        let index = textBlot.offset(this.scroll);
        let oldValue = mutations[0].oldValue.replace(cursor_default.CONTENTS, "");
        let oldText = new import_quill_delta3.default().insert(oldValue);
        let newText = new import_quill_delta3.default().insert(textBlot.value());
        let diffDelta = new import_quill_delta3.default().retain(index).concat(oldText.diff(newText, cursorIndex));
        change = diffDelta.reduce(function(delta, op) {
          if (op.insert) {
            return delta.insert(op.insert, formats);
          } else {
            return delta.push(op);
          }
        }, new import_quill_delta3.default());
        this.delta = oldDelta.compose(change);
      } else {
        this.delta = this.getDelta();
        if (!change || !(0, import_deep_equal.default)(oldDelta.compose(change), this.delta)) {
          change = oldDelta.diff(this.delta, cursorIndex);
        }
      }
      return change;
    }
  };
  function combineFormats(formats, combined) {
    return Object.keys(combined).reduce(function(merged, name) {
      if (formats[name] == null)
        return merged;
      if (combined[name] === formats[name]) {
        merged[name] = combined[name];
      } else if (Array.isArray(combined[name])) {
        if (combined[name].indexOf(formats[name]) < 0) {
          merged[name] = combined[name].concat([formats[name]]);
        }
      } else {
        merged[name] = [combined[name], formats[name]];
      }
      return merged;
    }, {});
  }
  function normalizeDelta(delta) {
    return delta.reduce(function(delta2, op) {
      if (op.insert === 1) {
        let attributes = (0, import_clone.default)(op.attributes);
        delete attributes["image"];
        return delta2.insert({ image: op.attributes.image }, attributes);
      }
      if (op.attributes != null && (op.attributes.list === true || op.attributes.bullet === true)) {
        op = (0, import_clone.default)(op);
        if (op.attributes.list) {
          op.attributes.list = "ordered";
        } else {
          op.attributes.list = "bullet";
          delete op.attributes.bullet;
        }
      }
      if (typeof op.insert === "string") {
        let text = op.insert.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        return delta2.insert(text, op.attributes);
      }
      return delta2.push(op);
    }, new import_quill_delta3.default());
  }
  var editor_default = Editor;

  // node_modules/quill/core/emitter.js
  var import_eventemitter3 = __toESM(require_eventemitter3());

  // node_modules/quill/core/logger.js
  var levels = ["error", "warn", "log", "info"];
  var level = "warn";
  function debug(method, ...args) {
    if (levels.indexOf(method) <= levels.indexOf(level)) {
      console[method](...args);
    }
  }
  function namespace(ns) {
    return levels.reduce(function(logger, method) {
      logger[method] = debug.bind(console, method, ns);
      return logger;
    }, {});
  }
  debug.level = namespace.level = function(newLevel) {
    level = newLevel;
  };
  var logger_default = namespace;

  // node_modules/quill/core/emitter.js
  var debug2 = logger_default("quill:events");
  var EVENTS = ["selectionchange", "mousedown", "mouseup", "click"];
  EVENTS.forEach(function(eventName) {
    document.addEventListener(eventName, (...args) => {
      [].slice.call(document.querySelectorAll(".ql-container")).forEach((node) => {
        if (node.__quill && node.__quill.emitter) {
          node.__quill.emitter.handleDOM(...args);
        }
      });
    });
  });
  var Emitter = class extends import_eventemitter3.default {
    constructor() {
      super();
      this.listeners = {};
      this.on("error", debug2.error);
    }
    emit() {
      debug2.log.apply(debug2, arguments);
      super.emit.apply(this, arguments);
    }
    handleDOM(event, ...args) {
      (this.listeners[event.type] || []).forEach(function({ node, handler }) {
        if (event.target === node || node.contains(event.target)) {
          handler(event, ...args);
        }
      });
    }
    listenDOM(eventName, node, handler) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push({ node, handler });
    }
  };
  Emitter.events = {
    EDITOR_CHANGE: "editor-change",
    SCROLL_BEFORE_UPDATE: "scroll-before-update",
    SCROLL_OPTIMIZE: "scroll-optimize",
    SCROLL_UPDATE: "scroll-update",
    SELECTION_CHANGE: "selection-change",
    TEXT_CHANGE: "text-change"
  };
  Emitter.sources = {
    API: "api",
    SILENT: "silent",
    USER: "user"
  };
  var emitter_default = Emitter;

  // node_modules/quill/core/module.js
  var Module = class {
    constructor(quill2, options = {}) {
      this.quill = quill2;
      this.options = options;
    }
  };
  Module.DEFAULTS = {};
  var module_default = Module;

  // node_modules/quill/core/quill.js
  var import_parchment9 = __toESM(require_parchment());

  // node_modules/quill/core/selection.js
  var import_parchment8 = __toESM(require_parchment());
  var import_clone2 = __toESM(require_clone());
  var import_deep_equal2 = __toESM(require_deep_equal());
  var debug3 = logger_default("quill:selection");
  var Range = class {
    constructor(index, length = 0) {
      this.index = index;
      this.length = length;
    }
  };
  var Selection = class {
    constructor(scroll, emitter) {
      this.emitter = emitter;
      this.scroll = scroll;
      this.composing = false;
      this.mouseDown = false;
      this.root = this.scroll.domNode;
      this.cursor = import_parchment8.default.create("cursor", this);
      this.lastRange = this.savedRange = new Range(0, 0);
      this.handleComposition();
      this.handleDragging();
      this.emitter.listenDOM("selectionchange", document, () => {
        if (!this.mouseDown) {
          setTimeout(this.update.bind(this, emitter_default.sources.USER), 1);
        }
      });
      this.emitter.on(emitter_default.events.EDITOR_CHANGE, (type, delta) => {
        if (type === emitter_default.events.TEXT_CHANGE && delta.length() > 0) {
          this.update(emitter_default.sources.SILENT);
        }
      });
      this.emitter.on(emitter_default.events.SCROLL_BEFORE_UPDATE, () => {
        if (!this.hasFocus())
          return;
        let native = this.getNativeRange();
        if (native == null)
          return;
        if (native.start.node === this.cursor.textNode)
          return;
        this.emitter.once(emitter_default.events.SCROLL_UPDATE, () => {
          try {
            this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
          } catch (ignored) {
          }
        });
      });
      this.emitter.on(emitter_default.events.SCROLL_OPTIMIZE, (mutations, context) => {
        if (context.range) {
          const { startNode, startOffset, endNode, endOffset } = context.range;
          this.setNativeRange(startNode, startOffset, endNode, endOffset);
        }
      });
      this.update(emitter_default.sources.SILENT);
    }
    handleComposition() {
      this.root.addEventListener("compositionstart", () => {
        this.composing = true;
      });
      this.root.addEventListener("compositionend", () => {
        this.composing = false;
        if (this.cursor.parent) {
          const range = this.cursor.restore();
          if (!range)
            return;
          setTimeout(() => {
            this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
          }, 1);
        }
      });
    }
    handleDragging() {
      this.emitter.listenDOM("mousedown", document.body, () => {
        this.mouseDown = true;
      });
      this.emitter.listenDOM("mouseup", document.body, () => {
        this.mouseDown = false;
        this.update(emitter_default.sources.USER);
      });
    }
    focus() {
      if (this.hasFocus())
        return;
      this.root.focus();
      this.setRange(this.savedRange);
    }
    format(format, value) {
      if (this.scroll.whitelist != null && !this.scroll.whitelist[format])
        return;
      this.scroll.update();
      let nativeRange = this.getNativeRange();
      if (nativeRange == null || !nativeRange.native.collapsed || import_parchment8.default.query(format, import_parchment8.default.Scope.BLOCK))
        return;
      if (nativeRange.start.node !== this.cursor.textNode) {
        let blot = import_parchment8.default.find(nativeRange.start.node, false);
        if (blot == null)
          return;
        if (blot instanceof import_parchment8.default.Leaf) {
          let after = blot.split(nativeRange.start.offset);
          blot.parent.insertBefore(this.cursor, after);
        } else {
          blot.insertBefore(this.cursor, nativeRange.start.node);
        }
        this.cursor.attach();
      }
      this.cursor.format(format, value);
      this.scroll.optimize();
      this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
      this.update();
    }
    getBounds(index, length = 0) {
      let scrollLength = this.scroll.length();
      index = Math.min(index, scrollLength - 1);
      length = Math.min(index + length, scrollLength - 1) - index;
      let node, [leaf, offset] = this.scroll.leaf(index);
      if (leaf == null)
        return null;
      [node, offset] = leaf.position(offset, true);
      let range = document.createRange();
      if (length > 0) {
        range.setStart(node, offset);
        [leaf, offset] = this.scroll.leaf(index + length);
        if (leaf == null)
          return null;
        [node, offset] = leaf.position(offset, true);
        range.setEnd(node, offset);
        return range.getBoundingClientRect();
      } else {
        let side = "left";
        let rect;
        if (node instanceof Text) {
          if (offset < node.data.length) {
            range.setStart(node, offset);
            range.setEnd(node, offset + 1);
          } else {
            range.setStart(node, offset - 1);
            range.setEnd(node, offset);
            side = "right";
          }
          rect = range.getBoundingClientRect();
        } else {
          rect = leaf.domNode.getBoundingClientRect();
          if (offset > 0)
            side = "right";
        }
        return {
          bottom: rect.top + rect.height,
          height: rect.height,
          left: rect[side],
          right: rect[side],
          top: rect.top,
          width: 0
        };
      }
    }
    getNativeRange() {
      let selection = document.getSelection();
      if (selection == null || selection.rangeCount <= 0)
        return null;
      let nativeRange = selection.getRangeAt(0);
      if (nativeRange == null)
        return null;
      let range = this.normalizeNative(nativeRange);
      debug3.info("getNativeRange", range);
      return range;
    }
    getRange() {
      let normalized = this.getNativeRange();
      if (normalized == null)
        return [null, null];
      let range = this.normalizedToRange(normalized);
      return [range, normalized];
    }
    hasFocus() {
      return document.activeElement === this.root;
    }
    normalizedToRange(range) {
      let positions = [[range.start.node, range.start.offset]];
      if (!range.native.collapsed) {
        positions.push([range.end.node, range.end.offset]);
      }
      let indexes = positions.map((position) => {
        let [node, offset] = position;
        let blot = import_parchment8.default.find(node, true);
        let index = blot.offset(this.scroll);
        if (offset === 0) {
          return index;
        } else if (blot instanceof import_parchment8.default.Container) {
          return index + blot.length();
        } else {
          return index + blot.index(node, offset);
        }
      });
      let end = Math.min(Math.max(...indexes), this.scroll.length() - 1);
      let start = Math.min(end, ...indexes);
      return new Range(start, end - start);
    }
    normalizeNative(nativeRange) {
      if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
        return null;
      }
      let range = {
        start: { node: nativeRange.startContainer, offset: nativeRange.startOffset },
        end: { node: nativeRange.endContainer, offset: nativeRange.endOffset },
        native: nativeRange
      };
      [range.start, range.end].forEach(function(position) {
        let node = position.node, offset = position.offset;
        while (!(node instanceof Text) && node.childNodes.length > 0) {
          if (node.childNodes.length > offset) {
            node = node.childNodes[offset];
            offset = 0;
          } else if (node.childNodes.length === offset) {
            node = node.lastChild;
            offset = node instanceof Text ? node.data.length : node.childNodes.length + 1;
          } else {
            break;
          }
        }
        position.node = node, position.offset = offset;
      });
      return range;
    }
    rangeToNative(range) {
      let indexes = range.collapsed ? [range.index] : [range.index, range.index + range.length];
      let args = [];
      let scrollLength = this.scroll.length();
      indexes.forEach((index, i) => {
        index = Math.min(scrollLength - 1, index);
        let node, [leaf, offset] = this.scroll.leaf(index);
        [node, offset] = leaf.position(offset, i !== 0);
        args.push(node, offset);
      });
      if (args.length < 2) {
        args = args.concat(args);
      }
      return args;
    }
    scrollIntoView(scrollingContainer) {
      let range = this.lastRange;
      if (range == null)
        return;
      let bounds = this.getBounds(range.index, range.length);
      if (bounds == null)
        return;
      let limit = this.scroll.length() - 1;
      let [first] = this.scroll.line(Math.min(range.index, limit));
      let last = first;
      if (range.length > 0) {
        [last] = this.scroll.line(Math.min(range.index + range.length, limit));
      }
      if (first == null || last == null)
        return;
      let scrollBounds = scrollingContainer.getBoundingClientRect();
      if (bounds.top < scrollBounds.top) {
        scrollingContainer.scrollTop -= scrollBounds.top - bounds.top;
      } else if (bounds.bottom > scrollBounds.bottom) {
        scrollingContainer.scrollTop += bounds.bottom - scrollBounds.bottom;
      }
    }
    setNativeRange(startNode, startOffset, endNode = startNode, endOffset = startOffset, force = false) {
      debug3.info("setNativeRange", startNode, startOffset, endNode, endOffset);
      if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) {
        return;
      }
      let selection = document.getSelection();
      if (selection == null)
        return;
      if (startNode != null) {
        if (!this.hasFocus())
          this.root.focus();
        let native = (this.getNativeRange() || {}).native;
        if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
          if (startNode.tagName == "BR") {
            startOffset = [].indexOf.call(startNode.parentNode.childNodes, startNode);
            startNode = startNode.parentNode;
          }
          if (endNode.tagName == "BR") {
            endOffset = [].indexOf.call(endNode.parentNode.childNodes, endNode);
            endNode = endNode.parentNode;
          }
          let range = document.createRange();
          range.setStart(startNode, startOffset);
          range.setEnd(endNode, endOffset);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        selection.removeAllRanges();
        this.root.blur();
        document.body.focus();
      }
    }
    setRange(range, force = false, source = emitter_default.sources.API) {
      if (typeof force === "string") {
        source = force;
        force = false;
      }
      debug3.info("setRange", range);
      if (range != null) {
        let args = this.rangeToNative(range);
        this.setNativeRange(...args, force);
      } else {
        this.setNativeRange(null);
      }
      this.update(source);
    }
    update(source = emitter_default.sources.USER) {
      let oldRange = this.lastRange;
      let [lastRange, nativeRange] = this.getRange();
      this.lastRange = lastRange;
      if (this.lastRange != null) {
        this.savedRange = this.lastRange;
      }
      if (!(0, import_deep_equal2.default)(oldRange, this.lastRange)) {
        if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
          this.cursor.restore();
        }
        let args = [emitter_default.events.SELECTION_CHANGE, (0, import_clone2.default)(this.lastRange), (0, import_clone2.default)(oldRange), source];
        this.emitter.emit(emitter_default.events.EDITOR_CHANGE, ...args);
        if (source !== emitter_default.sources.SILENT) {
          this.emitter.emit(...args);
        }
      }
    }
  };
  function contains(parent, descendant) {
    try {
      descendant.parentNode;
    } catch (e) {
      return false;
    }
    if (descendant instanceof Text) {
      descendant = descendant.parentNode;
    }
    return parent.contains(descendant);
  }

  // node_modules/quill/core/quill.js
  var import_extend3 = __toESM(require_extend());

  // node_modules/quill/core/theme.js
  var Theme = class {
    constructor(quill2, options) {
      this.quill = quill2;
      this.options = options;
      this.modules = {};
    }
    init() {
      Object.keys(this.options.modules).forEach((name) => {
        if (this.modules[name] == null) {
          this.addModule(name);
        }
      });
    }
    addModule(name) {
      let moduleClass = this.quill.constructor.import(`modules/${name}`);
      this.modules[name] = new moduleClass(this.quill, this.options.modules[name] || {});
      return this.modules[name];
    }
  };
  Theme.DEFAULTS = {
    modules: {}
  };
  Theme.themes = {
    "default": Theme
  };
  var theme_default = Theme;

  // node_modules/quill/core/quill.js
  var debug4 = logger_default("quill");
  var Quill = class {
    static debug(limit) {
      if (limit === true) {
        limit = "log";
      }
      logger_default.level(limit);
    }
    static find(node) {
      return node.__quill || import_parchment9.default.find(node);
    }
    static import(name) {
      if (this.imports[name] == null) {
        debug4.error(`Cannot import ${name}. Are you sure it was registered?`);
      }
      return this.imports[name];
    }
    static register(path, target, overwrite = false) {
      if (typeof path !== "string") {
        let name = path.attrName || path.blotName;
        if (typeof name === "string") {
          this.register("formats/" + name, path, target);
        } else {
          Object.keys(path).forEach((key) => {
            this.register(key, path[key], target);
          });
        }
      } else {
        if (this.imports[path] != null && !overwrite) {
          debug4.warn(`Overwriting ${path} with`, target);
        }
        this.imports[path] = target;
        if ((path.startsWith("blots/") || path.startsWith("formats/")) && target.blotName !== "abstract") {
          import_parchment9.default.register(target);
        } else if (path.startsWith("modules") && typeof target.register === "function") {
          target.register();
        }
      }
    }
    constructor(container, options = {}) {
      this.options = expandConfig(container, options);
      this.container = this.options.container;
      if (this.container == null) {
        return debug4.error("Invalid Quill container", container);
      }
      if (this.options.debug) {
        Quill.debug(this.options.debug);
      }
      let html = this.container.innerHTML.trim();
      this.container.classList.add("ql-container");
      this.container.innerHTML = "";
      this.container.__quill = this;
      this.root = this.addContainer("ql-editor");
      this.root.classList.add("ql-blank");
      this.root.setAttribute("data-gramm", false);
      this.scrollingContainer = this.options.scrollingContainer || this.root;
      this.emitter = new emitter_default();
      this.scroll = import_parchment9.default.create(this.root, {
        emitter: this.emitter,
        whitelist: this.options.formats
      });
      this.editor = new editor_default(this.scroll);
      this.selection = new Selection(this.scroll, this.emitter);
      this.theme = new this.options.theme(this, this.options);
      this.keyboard = this.theme.addModule("keyboard");
      this.clipboard = this.theme.addModule("clipboard");
      this.history = this.theme.addModule("history");
      this.theme.init();
      this.emitter.on(emitter_default.events.EDITOR_CHANGE, (type) => {
        if (type === emitter_default.events.TEXT_CHANGE) {
          this.root.classList.toggle("ql-blank", this.editor.isBlank());
        }
      });
      this.emitter.on(emitter_default.events.SCROLL_UPDATE, (source, mutations) => {
        let range = this.selection.lastRange;
        let index = range && range.length === 0 ? range.index : void 0;
        modify.call(this, () => {
          return this.editor.update(null, mutations, index);
        }, source);
      });
      let contents = this.clipboard.convert(`<div class='ql-editor' style="white-space: normal;">${html}<p><br></p></div>`);
      this.setContents(contents);
      this.history.clear();
      if (this.options.placeholder) {
        this.root.setAttribute("data-placeholder", this.options.placeholder);
      }
      if (this.options.readOnly) {
        this.disable();
      }
    }
    addContainer(container, refNode = null) {
      if (typeof container === "string") {
        let className = container;
        container = document.createElement("div");
        container.classList.add(className);
      }
      this.container.insertBefore(container, refNode);
      return container;
    }
    blur() {
      this.selection.setRange(null);
    }
    deleteText(index, length, source) {
      [index, length, , source] = overload(index, length, source);
      return modify.call(this, () => {
        return this.editor.deleteText(index, length);
      }, source, index, -1 * length);
    }
    disable() {
      this.enable(false);
    }
    enable(enabled = true) {
      this.scroll.enable(enabled);
      this.container.classList.toggle("ql-disabled", !enabled);
    }
    focus() {
      let scrollTop = this.scrollingContainer.scrollTop;
      this.selection.focus();
      this.scrollingContainer.scrollTop = scrollTop;
      this.scrollIntoView();
    }
    format(name, value, source = emitter_default.sources.API) {
      return modify.call(this, () => {
        let range = this.getSelection(true);
        let change = new import_quill_delta4.default();
        if (range == null) {
          return change;
        } else if (import_parchment9.default.query(name, import_parchment9.default.Scope.BLOCK)) {
          change = this.editor.formatLine(range.index, range.length, { [name]: value });
        } else if (range.length === 0) {
          this.selection.format(name, value);
          return change;
        } else {
          change = this.editor.formatText(range.index, range.length, { [name]: value });
        }
        this.setSelection(range, emitter_default.sources.SILENT);
        return change;
      }, source);
    }
    formatLine(index, length, name, value, source) {
      let formats;
      [index, length, formats, source] = overload(index, length, name, value, source);
      return modify.call(this, () => {
        return this.editor.formatLine(index, length, formats);
      }, source, index, 0);
    }
    formatText(index, length, name, value, source) {
      let formats;
      [index, length, formats, source] = overload(index, length, name, value, source);
      return modify.call(this, () => {
        return this.editor.formatText(index, length, formats);
      }, source, index, 0);
    }
    getBounds(index, length = 0) {
      let bounds;
      if (typeof index === "number") {
        bounds = this.selection.getBounds(index, length);
      } else {
        bounds = this.selection.getBounds(index.index, index.length);
      }
      let containerBounds = this.container.getBoundingClientRect();
      return {
        bottom: bounds.bottom - containerBounds.top,
        height: bounds.height,
        left: bounds.left - containerBounds.left,
        right: bounds.right - containerBounds.left,
        top: bounds.top - containerBounds.top,
        width: bounds.width
      };
    }
    getContents(index = 0, length = this.getLength() - index) {
      [index, length] = overload(index, length);
      return this.editor.getContents(index, length);
    }
    getFormat(index = this.getSelection(true), length = 0) {
      if (typeof index === "number") {
        return this.editor.getFormat(index, length);
      } else {
        return this.editor.getFormat(index.index, index.length);
      }
    }
    getIndex(blot) {
      return blot.offset(this.scroll);
    }
    getLength() {
      return this.scroll.length();
    }
    getLeaf(index) {
      return this.scroll.leaf(index);
    }
    getLine(index) {
      return this.scroll.line(index);
    }
    getLines(index = 0, length = Number.MAX_VALUE) {
      if (typeof index !== "number") {
        return this.scroll.lines(index.index, index.length);
      } else {
        return this.scroll.lines(index, length);
      }
    }
    getModule(name) {
      return this.theme.modules[name];
    }
    getSelection(focus = false) {
      if (focus)
        this.focus();
      this.update();
      return this.selection.getRange()[0];
    }
    getText(index = 0, length = this.getLength() - index) {
      [index, length] = overload(index, length);
      return this.editor.getText(index, length);
    }
    hasFocus() {
      return this.selection.hasFocus();
    }
    insertEmbed(index, embed, value, source = Quill.sources.API) {
      return modify.call(this, () => {
        return this.editor.insertEmbed(index, embed, value);
      }, source, index);
    }
    insertText(index, text, name, value, source) {
      let formats;
      [index, , formats, source] = overload(index, 0, name, value, source);
      return modify.call(this, () => {
        return this.editor.insertText(index, text, formats);
      }, source, index, text.length);
    }
    isEnabled() {
      return !this.container.classList.contains("ql-disabled");
    }
    off() {
      return this.emitter.off.apply(this.emitter, arguments);
    }
    on() {
      return this.emitter.on.apply(this.emitter, arguments);
    }
    once() {
      return this.emitter.once.apply(this.emitter, arguments);
    }
    pasteHTML(index, html, source) {
      this.clipboard.dangerouslyPasteHTML(index, html, source);
    }
    removeFormat(index, length, source) {
      [index, length, , source] = overload(index, length, source);
      return modify.call(this, () => {
        return this.editor.removeFormat(index, length);
      }, source, index);
    }
    scrollIntoView() {
      this.selection.scrollIntoView(this.scrollingContainer);
    }
    setContents(delta, source = emitter_default.sources.API) {
      return modify.call(this, () => {
        delta = new import_quill_delta4.default(delta);
        let length = this.getLength();
        let deleted = this.editor.deleteText(0, length);
        let applied = this.editor.applyDelta(delta);
        let lastOp = applied.ops[applied.ops.length - 1];
        if (lastOp != null && typeof lastOp.insert === "string" && lastOp.insert[lastOp.insert.length - 1] === "\n") {
          this.editor.deleteText(this.getLength() - 1, 1);
          applied.delete(1);
        }
        let ret = deleted.compose(applied);
        return ret;
      }, source);
    }
    setSelection(index, length, source) {
      if (index == null) {
        this.selection.setRange(null, length || Quill.sources.API);
      } else {
        [index, length, , source] = overload(index, length, source);
        this.selection.setRange(new Range(index, length), source);
        if (source !== emitter_default.sources.SILENT) {
          this.selection.scrollIntoView(this.scrollingContainer);
        }
      }
    }
    setText(text, source = emitter_default.sources.API) {
      let delta = new import_quill_delta4.default().insert(text);
      return this.setContents(delta, source);
    }
    update(source = emitter_default.sources.USER) {
      let change = this.scroll.update(source);
      this.selection.update(source);
      return change;
    }
    updateContents(delta, source = emitter_default.sources.API) {
      return modify.call(this, () => {
        delta = new import_quill_delta4.default(delta);
        return this.editor.applyDelta(delta, source);
      }, source, true);
    }
  };
  Quill.DEFAULTS = {
    bounds: null,
    formats: null,
    modules: {},
    placeholder: "",
    readOnly: false,
    scrollingContainer: null,
    strict: true,
    theme: "default"
  };
  Quill.events = emitter_default.events;
  Quill.sources = emitter_default.sources;
  Quill.version = typeof QUILL_VERSION === "undefined" ? "dev" : QUILL_VERSION;
  Quill.imports = {
    "delta": import_quill_delta4.default,
    "parchment": import_parchment9.default,
    "core/module": module_default,
    "core/theme": theme_default
  };
  function expandConfig(container, userConfig) {
    userConfig = (0, import_extend3.default)(true, {
      container,
      modules: {
        clipboard: true,
        keyboard: true,
        history: true
      }
    }, userConfig);
    if (!userConfig.theme || userConfig.theme === Quill.DEFAULTS.theme) {
      userConfig.theme = theme_default;
    } else {
      userConfig.theme = Quill.import(`themes/${userConfig.theme}`);
      if (userConfig.theme == null) {
        throw new Error(`Invalid theme ${userConfig.theme}. Did you register it?`);
      }
    }
    let themeConfig = (0, import_extend3.default)(true, {}, userConfig.theme.DEFAULTS);
    [themeConfig, userConfig].forEach(function(config) {
      config.modules = config.modules || {};
      Object.keys(config.modules).forEach(function(module) {
        if (config.modules[module] === true) {
          config.modules[module] = {};
        }
      });
    });
    let moduleNames = Object.keys(themeConfig.modules).concat(Object.keys(userConfig.modules));
    let moduleConfig = moduleNames.reduce(function(config, name) {
      let moduleClass = Quill.import(`modules/${name}`);
      if (moduleClass == null) {
        debug4.error(`Cannot load ${name} module. Are you sure you registered it?`);
      } else {
        config[name] = moduleClass.DEFAULTS || {};
      }
      return config;
    }, {});
    if (userConfig.modules != null && userConfig.modules.toolbar && userConfig.modules.toolbar.constructor !== Object) {
      userConfig.modules.toolbar = {
        container: userConfig.modules.toolbar
      };
    }
    userConfig = (0, import_extend3.default)(true, {}, Quill.DEFAULTS, { modules: moduleConfig }, themeConfig, userConfig);
    ["bounds", "container", "scrollingContainer"].forEach(function(key) {
      if (typeof userConfig[key] === "string") {
        userConfig[key] = document.querySelector(userConfig[key]);
      }
    });
    userConfig.modules = Object.keys(userConfig.modules).reduce(function(config, name) {
      if (userConfig.modules[name]) {
        config[name] = userConfig.modules[name];
      }
      return config;
    }, {});
    return userConfig;
  }
  function modify(modifier, source, index, shift) {
    if (this.options.strict && !this.isEnabled() && source === emitter_default.sources.USER) {
      return new import_quill_delta4.default();
    }
    let range = index == null ? null : this.getSelection();
    let oldDelta = this.editor.delta;
    let change = modifier();
    if (range != null) {
      if (index === true)
        index = range.index;
      if (shift == null) {
        range = shiftRange(range, change, source);
      } else if (shift !== 0) {
        range = shiftRange(range, index, shift, source);
      }
      this.setSelection(range, emitter_default.sources.SILENT);
    }
    if (change.length() > 0) {
      let args = [emitter_default.events.TEXT_CHANGE, change, oldDelta, source];
      this.emitter.emit(emitter_default.events.EDITOR_CHANGE, ...args);
      if (source !== emitter_default.sources.SILENT) {
        this.emitter.emit(...args);
      }
    }
    return change;
  }
  function overload(index, length, name, value, source) {
    let formats = {};
    if (typeof index.index === "number" && typeof index.length === "number") {
      if (typeof length !== "number") {
        source = value, value = name, name = length, length = index.length, index = index.index;
      } else {
        length = index.length, index = index.index;
      }
    } else if (typeof length !== "number") {
      source = value, value = name, name = length, length = 0;
    }
    if (typeof name === "object") {
      formats = name;
      source = value;
    } else if (typeof name === "string") {
      if (value != null) {
        formats[name] = value;
      } else {
        source = name;
      }
    }
    source = source || emitter_default.sources.API;
    return [index, length, formats, source];
  }
  function shiftRange(range, index, length, source) {
    if (range == null)
      return null;
    let start, end;
    if (index instanceof import_quill_delta4.default) {
      [start, end] = [range.index, range.index + range.length].map(function(pos) {
        return index.transformPosition(pos, source !== emitter_default.sources.USER);
      });
    } else {
      [start, end] = [range.index, range.index + range.length].map(function(pos) {
        if (pos < index || pos === index && source === emitter_default.sources.USER)
          return pos;
        if (length >= 0) {
          return pos + length;
        } else {
          return Math.max(index, pos + length);
        }
      });
    }
    return new Range(start, end - start);
  }

  // resources/js/components/quill-editor.js
  var quill_editor_default = (Alpine) => {
    Alpine.data("quillEditorComponent", ({
      state
    }) => {
      return {
        state,
        init: function() {
          this.render();
        },
        render() {
          this.editor = null;
          this.editor = new Quill(this.$refs.quill, {
            theme: "snow",
            modules: {
              imageUploader: {
                upload: (file) => {
                  return new Promise((resolve) => {
                    this.$wire.upload(
                      `componentFileAttachments.${statePath}`,
                      file,
                      (uploadedFilename) => {
                        this.$wire.getComponentFileAttachmentUrl(statePath).then((url) => {
                          if (!url) {
                            return resolve({
                              success: 0
                            });
                          }
                          return resolve({
                            success: 1,
                            file: {
                              url
                            }
                          });
                        });
                      }
                    );
                  });
                }
              }
            }
          });
          Quill.register("modules/imageUploader", ImageUploader);
          quill.setContents(this.state);
          this.instance = quill;
          quill.on("editor-change", function(eventName, ...args) {
            if (eventName === "text-change") {
              console.log("args", args);
            } else if (eventName === "selection-change") {
            }
          });
        }
      };
    });
  };

  // resources/js/index.js
  document.addEventListener("alpine:init", () => {
    window.Alpine.plugin(quill_editor_default);
  });
})();
