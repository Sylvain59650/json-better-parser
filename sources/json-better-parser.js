/* eslint no-loop-func: 0 */
/* eslint-disable complexity */


;
(function(moduleName, root, factory) {
  if (typeof exports === "object") {
    module.exports = factory();
  } else {
    /* global Path */
    factory();
  }
}("JSonExModule", this, function() {
  "use strict";

  class JONExParseError extends Error {

  }

  const __internal = {
    isLetter: ch => ch.match(/[A-Za-z]/),
    isNumber: ch => ch.match(/[0-9]/),
    isWhitespace: ch => ch.match(/\s/),
    isNewline: ch => ch.match(/\n/),

    lexical: function({ state, numLine, lineErrorPos, pos, head, ch, insert, remove, removePreviousComma, replace, push, pop }) {
      if (ch === "\n") {
        numLine++;
        lineErrorPos = pos;
      }
      switch (state) {
        case "start":
          if (__internal.isWhitespace(ch)) {
            remove();
          }
          if (ch === "{") {
            push("obj");
            return "obj_awaiting_key";
          }
          break;

        case "obj_awaiting_key":
          if (__internal.isWhitespace(ch)) {
            remove();
          }
          if (ch === "}") {
            removePreviousComma();
            pop();
            return "obj_complete";
          }
          if (ch === "\"") { return "obj_key_str"; }
          if (ch === "'") {
            replace("\"");
            return "obj_key_str_incorrect_quotes";
          }
          if (__internal.isLetter(ch) || __internal.isNumber(ch) || ch === "-") {
            insert("\"");
            return "obj_key_str_missing_quotes";
          }
          break;

        case "obj_key_str_missing_quotes":
          if (ch === ":") {
            insert("\"");
            return "obj_awaiting_value";
          }
          break;

        case "obj_key_str_incorrect_quotes":
          if (ch === "'") {
            replace("\"");
            return "obj_awaiting_colon";
          }
          break;

        case "obj_key_str":
          if (ch === "\"") { return "obj_awaiting_colon"; }
          break;

        case "obj_awaiting_colon":
          if (ch === ":") { return "obj_awaiting_value"; }
          break;

        case "obj_awaiting_value":
          if (__internal.isWhitespace(ch)) {
            remove();
          }
          if (ch === "'") {
            replace("\"");
            return "obj_value_str_incorrect_quotes";
          }
          if (ch === "{") {
            push("obj");
            return "obj_awaiting_key";
          }
          if (ch === "[") {
            push("arr");
            return "arr_stable";
          }
          if (ch === "\"") { return "obj_value_str"; }
          if (__internal.isNumber(ch)) { return "obj_value_num"; }
          if (ch === "-") { return "obj_value_num"; }

          if (ch === "t") { return "obj_value_true_t"; }
          if (ch === "f") { return "obj_value_false_f"; }
          if (ch === "n") { return "obj_value_null_n"; }
          break;

        case "obj_value_true_t":
          if (ch === "r") { return "obj_value_true_r"; }
          break;
        case "obj_value_true_r":
          if (ch === "u") { return "obj_value_true_u"; }
          break;
        case "obj_value_true_u":
          if (ch === "e") { return "obj_stable"; }
          break;

        case "obj_value_false_f":
          if (ch === "a") { return "obj_value_false_a"; }
          break;
        case "obj_value_false_a":
          if (ch === "l") { return "obj_value_false_l"; }
          break;
        case "obj_value_false_l":
          if (ch === "s") { return "obj_value_false_s"; }
          break;
        case "obj_value_false_s":
          if (ch === "e") { return "obj_stable"; }
          break;

        case "obj_value_null_n":
          if (ch === "u") { return "obj_value_null_u"; }
          break;
        case "obj_value_null_u":
          if (ch === "l") { return "obj_value_null_l"; }
          break;
        case "obj_value_null_l":
          if (ch === "l") { return "obj_stable"; }
          break;

        case "obj_value_str":
          if (ch === "\"") { return "obj_stable"; }
          break;

        case "obj_value_str_incorrect_quotes":
          if (ch === "'") {
            replace("\"");
            return "obj_stable";
          }
          break;

        case "obj_value_num":
          // if (__internal.isNewline(ch)) {
          //   replace(",");
          //   return "obj_awaiting_key";
          // }
          if (__internal.isWhitespace(ch)) {
            remove();
          }
          if (ch === "}") {
            pop();
            return "obj_complete";
          }
          if (ch === ",") { return "obj_awaiting_key"; }
          break;

        case "obj_stable":
          // if (__internal.isNewline(ch)) {
          //   replace(",");
          //   return "obj_awaiting_key";
          // }
          if (__internal.isWhitespace(ch)) {
            remove();
          }
          if (ch === "}") {
            pop();
            return "obj_complete";
          }
          if (ch === ",") { return "obj_awaiting_key"; }
          break;

        case "obj_complete":
          if (ch === "]") {
            pop();
            return "arr_complete";
          }
          if (__internal.isNewline(ch)) {
            replace(",");
            if (head === "obj") {
              return "obj_awaiting_key";
            }
            return "arr_awaiting_value";
          }
          if (ch === ",") {
            if (head === "obj") {
              return "obj_awaiting_key";
            }
            return "arr_awaiting_value";

          }
          break;

        case "arr_stable":
          if (__internal.isWhitespace(ch)) {
            remove();
          }
          if (ch === "'") {
            replace("\"");
            return "arr_value_str_incorrect_quotes";
          }
          if (ch === "{") {
            push("obj");
            return "obj_awaiting_key";
          }
          if (ch === "[") {
            push("arr");
            return "arr_stable";
          }
          if (ch === "]") {
            pop();
            return "arr_complete";
          }

          if (ch === "\"") { return "arr_value_str"; }
          if (__internal.isNumber(ch)) { return "arr_value_num"; }
          if (ch === "-") { return "arr_value_num"; }
          if (ch === "t") { return "arr_value_true_t"; }
          if (ch === "f") { return "arr_value_false_f"; }
          if (ch === "n") { return "arr_value_null_n"; }
          break;

        case "arr_awaiting_value":
          if (__internal.isWhitespace(ch)) {
            remove();
          }
          if (ch === "'") {
            replace("\"");
            return "arr_value_str_incorrect_quotes";
          }
          if (ch === "{") {
            push("obj");
            return "obj_awaiting_key";
          }
          if (ch === "[") {
            push("arr");
            return "arr_stable";
          }
          if (ch === "]") {
            removePreviousComma();
            pop();
            return "arr_complete";
          }
          if (ch === "\"") { return "arr_value_str"; }
          if (__internal.isNumber(ch)) { return "arr_value_num"; }
          if (ch === "-") { return "arr_value_num"; }
          if (ch === "t") { return "arr_value_true_t"; }
          if (ch === "f") { return "arr_value_false_f"; }
          if (ch === "n") { return "arr_value_null_n"; }

          break;

        case "arr_complete":
          if (ch === "}") {
            pop();
            return "obj_complete";
          }
          if (__internal.isNewline(ch)) {
            // replace(",");
            if (head === "obj") {
              return "obj_awaiting_key";
            }
            return "arr_awaiting_value";

          }
          if (ch === ",") {
            if (head === "obj") {
              return "obj_awaiting_key";
            }
            return "arr_awaiting_value";
          }
          break;

        case "arr_value_str":
          if (ch === "\"") { return "arr_stable"; }
          break;

        case "arr_value_str_incorrect_quotes":
          if (ch === "'") {
            replace("\"");
            return "arr_stable";
          }
          break;

        case "arr_value_num":
          // if (__internal.isNewline(ch)) {
          //   replace(",");
          //   return "arr_awaiting_value";
          // }
          if (__internal.isWhitespace(ch)) {
            remove();
          }
          if (ch === "]") {
            pop();
            return "arr_complete";
          }
          if (ch === ",") {
            return "arr_awaiting_value";
          }
          break;

        case "arr_value_true_t":
          if (ch === "r") { return "arr_value_true_r"; }
          break;
        case "arr_value_true_r":
          if (ch === "u") { return "arr_value_true_u"; }
          break;
        case "arr_value_true_u":
          if (ch === "e") { return "arr_stable"; }
          break;

        case "arr_value_false_f":
          if (ch === "a") { return "arr_value_false_a"; }
          break;
        case "arr_value_false_a":
          if (ch === "l") { return "arr_value_false_l"; }
          break;
        case "arr_value_false_l":
          if (ch === "s") { return "arr_value_false_s"; }
          break;
        case "arr_value_false_s":
          if (ch === "e") { return "arr_stable"; }
          break;

        case "arr_value_null_n":
          if (ch === "u") { return "arr_value_null_u"; }
          break;
        case "arr_value_null_u":
          if (ch === "l") { return "arr_value_null_l"; }
          break;
        case "arr_value_null_l":
          if (ch === "l") { return "arr_stable"; }
          break;

        default:
          break;
      }

      return state;
    },


    error(e, txt) {
      let context = 20;
      if (typeof txt !== "string") {
        const isEmptyArray = Array.isArray(txt) && txt.length === 0
        const errorMessage = "Cannot parse " +
          (isEmptyArray ? "an empty array" : String(txt))
        throw new TypeError(errorMessage)
      }
      const syntaxErr = e.message.match(/^Unexpected token.*position\s+(\d+)/i);
      const pos = syntaxErr ? Number(syntaxErr[1]) : e.message.match(/^Unexpected end of JSON.*/i) ? txt.length - 1 : null;
      if (pos !== null) {
        const start = pos <= context ? 0 : pos - context;
        const end = pos + context >= txt.length ? txt.length : pos + context;
        var msg = txt.slice(start, end);
        e.message += " while parsing near \n" + msg + "\n" + "-".repeat(pos) + "^";
      } else {
        e.message += " while parsing " + txt.slice(0, context * 2);
      }
      throw e
    }
  }


  const JSONEx = {
    correct: function(json) {
      let state = "start";
      const stack = [];
      let text = json;
      let i = 0;
      let j = 0;
      let numLine = 1;
      let lineErrorPos = 1;
      for (i = 0, j = 0; i < text.length; i++, j++) {
        var ch = text[i];
        state = __internal.lexical({
          state,
          numLine,
          lineErrorPos,
          j,
          head: stack[stack.length - 1],
          ch,
          insert: (chToInsert) => {
            text = text.slice(0, i) + chToInsert + text.slice(i);
          },
          remove: () => {
            text = text.slice(0, i) + text.slice(i + 1);
            i--;
          },
          removePreviousComma: () => {
            if (text[i - 1] === ",") {
              text = text.slice(0, i - 1) + text.slice(i);
              i--;
            }
          },
          replace: (chToInsert) => {
            text = text.slice(0, i) + chToInsert + text.slice(i + 1);
          },
          push: (context) => {
            stack.push(context);
          },
          pop: () => {
            stack.pop();
          }
        });
      }
      if (state !== "obj_complete") {
        var near = text.substring(lineErrorPos, j - lineErrorPos) + "\n" + "-".repeat(j - lineErrorPos) + "^";
        throw new JONExParseError("parse error at position (" + i + "," + numLine + "):" + state + " near\n" + near);
      }
      return text;
    },

    parse: function(text) {
      try {
        return JSON.parse(text);
      } catch (e) {
        try {
          var correction = JSONEx.correct(text);
          return JSON.parse(correction);
        } catch (ee) {
          var msg = "";
          if (ee instanceof JONExParseError) {
            msg += e.message + "\n" + ee.message;
          } else {
            msg = __internal.error(e, text);
          }
          ee.message = msg;

          throw ee;
        }
      }
    },

    stringify: function(st) {
      return JSON.stringify(st);
    }
  }



  return JSONEx;
}));