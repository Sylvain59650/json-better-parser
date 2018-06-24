/* eslint no-loop-func: 0 */
/* eslint-disable complexity */


class JONExParseError extends Error {
  constructor(msg) {
    super(msg);
    this.type = "JONExParseError"
  }
}

var text = "";
var currentPos = 0;
var stack = [];
var beginWord = 0;
var stablePos = 0;

var __nativeJson = null;
var __nativeReplaced = false;

const __internal = {
  isLetter: ch => ch.match(/[A-Za-z]/),
  isDigit: ch => ch.match(/[0-9]/),
  isWhitespace: ch => ch.match(/\s/),
  isNewline: ch => ch.match(/\n/),

  insert: (chToInsert, avance) => {
    text = text.slice(0, currentPos) + chToInsert + text.slice(currentPos);
    if (avance) { currentPos += avance; }
  },
  replace: (chToInsert, avance) => {
    text = text.slice(0, currentPos) + chToInsert + text.slice(currentPos + 1);
    if (avance) { currentPos += avance; }
  },
  insertAtWord: (chToInsert) => {
    text = text.slice(0, beginWord) + chToInsert + text.slice(beginWord);
  },
  remove: () => {
    text = text.slice(0, currentPos) + text.slice(currentPos + 1);
    currentPos--;
  },
  removePreviousComma: () => {
    if (text[currentPos - 1] === ",") {
      text = text.slice(0, currentPos - 1) + text.slice(currentPos);
      currentPos--;
    }
  },
  removeSpace: () => {
    var l = text.length;
    while (currentPos < l && __internal.isWhitespace(text[currentPos])) { currentPos++; }
    var ch = text[currentPos];
    stablePos = currentPos;
    return ch;
  },

  pass(chars) {
    var pos = currentPos;
    while (chars.indexOf(text[pos]) >= 0) { pos++; }
    currentPos = pos;
    stablePos = currentPos;
    return text[pos];
  },
  push: (context) => {
    stack.push(context);
    stablePos = currentPos;
  },
  pop: () => {
    stack.pop();
    stablePos = currentPos;
  },
  check: (chars, stateSuccess, stateError) => {
    beginWord = currentPos;
    if (text.substr(currentPos, chars.length) === chars) {
      var next = text[currentPos + chars.length];
      if (next === "," || next === "}" || next === "]" || next === " ") {
        currentPos += chars.length - 1;
        return stateSuccess;
      }
      currentPos--;
      return stateError;
    }
    return stateError;
  },
  next: (chars) => {
    var l = text.length;
    while (currentPos < l && chars.indexOf(text[currentPos]) === -1) { currentPos++; }
    return text[currentPos];
  },
  insertAtEndWordPos: (chToInsert) => {
    var pos = currentPos - 1;
    while (pos >= 0 && __internal.isWhitespace(text[pos])) { pos--; }
    pos++;
    text = text.slice(0, pos) + chToInsert + text.slice(pos);
    currentPos++;
  },

  lexical: function(state, ch) {
    var head = stack[stack.length - 1];
    switch (state) {
      case "start":
        ch = __internal.removeSpace();
        if (ch === "{") {
          __internal.push("obj");
          return "obj_awaiting_key";
        }
        break;

      case "obj_awaiting_key":
        ch = __internal.removeSpace();
        if (ch === "}") {
          __internal.removePreviousComma();
          __internal.pop();
          return "obj_complete";
        }
        if (ch === "\"") { return "obj_key_str"; }
        if (ch === "'") {
          __internal.replace("\"");
          return "obj_key_str_incorrect_quotes";
        }
        if (__internal.isLetter(ch) || __internal.isDigit(ch) || ch === "-") {
          __internal.insert("\"", 1);
          return "obj_key_str_missing_left_quote";
        }
        break;

      case "obj_key_str_missing_left_quote":
        ch = __internal.next(":\"'");
        if (ch === ":") {
          stablePos = currentPos;
          __internal.insertAtEndWordPos("\"");
          return "obj_awaiting_value";
        }
        if (ch === "\"") {
          return "obj_awaiting_colon";
        }
        if (ch === "'") {
          __internal.replace("\"", 1);
          currentPos--;
          return "obj_awaiting_colon";
        }
        break;

      case "obj_key_str_incorrect_quotes":
        if (ch === "'") {
          __internal.replace("\"");
          return "obj_awaiting_colon";
        }
        break;

      case "obj_key_str":
        if (ch === "\"") { return "obj_awaiting_colon"; }
        break;

      case "obj_awaiting_colon":
        if (ch === ":") {
          stablePos = currentPos;
          return "obj_awaiting_value";
        }
        break;

      case "obj_awaiting_value":
        ch = __internal.removeSpace();
        if (ch === "'") {
          __internal.replace("\"");
          return "obj_value_str_incorrect_quotes";
        }
        if (ch === "{") {
          __internal.push("obj");
          return "obj_awaiting_key";
        }
        if (ch === "[") {
          __internal.push("arr");
          return "arr_stable";
        }
        if (ch === "\"") { return "obj_value_str"; }
        if (__internal.isDigit(ch)) { return "obj_value_num"; }
        if (ch === "-") { return "obj_value_num"; }

        if (ch === "t") { return __internal.check("true", "obj_stable", "obj_missing_left_quote"); }
        if (ch === "f") { return __internal.check("false", "obj_stable", "obj_missing_left_quote"); }
        if (ch === "n") { return __internal.check("null", "obj_stable", "obj_missing_left_quote"); }
        break;

      case "obj_missing_left_quote":
        __internal.insertAtWord("\"");
        return "obj_value_str_incorrect_quotes";

      case "obj_value_str":
        ch = __internal.next("\"}");
        if (ch === "\"") { return "obj_stable"; }
        if (ch === "}") {
          __internal.insert("\"");
          __internal.pop();
          if (head === "obj") {
            return "obj_complete";
          }
          return "obj_stable";
        }
        break;

      case "obj_value_str_incorrect_quotes":
        ch = __internal.next("',}");
        if (ch === "'") {
          __internal.replace("\"");
          return "obj_stable";
        }
        if (ch === ",") {
          __internal.insert("\"");
          return "obj_stable";
        }
        if (ch === "}") {
          __internal.replace("\"}");
          __internal.pop();
          return "obj_complete";
        }
        break;

      case "obj_value_num":
        ch = __internal.pass("0123456789.");
        ch = __internal.removeSpace();
        if (ch === "}") {
          __internal.pop();
          return "obj_complete";
        }
        if (ch === ",") { return "obj_awaiting_key"; }
        return "obj_value_num_error";

      case "obj_stable":
        stablePos = currentPos;
        ch = __internal.next("},");
        if (ch === "}") {
          __internal.pop();
          return "obj_complete";
        }
        if (ch === ",") { return "obj_awaiting_key"; }
        break;

      case "obj_complete":
        stablePos = currentPos;
        if (ch === "]") {
          __internal.pop();
          return "arr_complete";
        }
        if (__internal.isNewline(ch)) {
          __internal.replace(",");
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
        stablePos = currentPos;
        if (__internal.isWhitespace(ch)) {
          __internal.remove();
        }
        if (ch === "'") {
          __internal.replace("\"");
          return "arr_value_str_incorrect_quotes";
        }
        if (ch === "{") {
          __internal.push("obj");
          return "obj_awaiting_key";
        }
        if (ch === "[") {
          __internal.push("arr");
          return "arr_stable";
        }
        if (ch === "]") {
          __internal.pop();
          return "arr_complete";
        }
        if (ch === "\"") { return "arr_value_str"; }
        if (__internal.isDigit(ch)) { return "arr_value_num"; }
        if (ch === "-") { return "arr_value_num"; }
        if (ch === "t") { return __internal.check("true", "arr_stable", "arr_error"); }
        if (ch === "f") { return __internal.check("false", "arr_stable", "arr_error"); }
        if (ch === "n") { return __internal.check("null", "arr_stable", "arr_error"); }
        break;

      case "arr_awaiting_value":
        ch = __internal.removeSpace();
        if (ch === "'") {
          __internal.replace("\"");
          return "arr_value_str_incorrect_quotes";
        }
        if (ch === "{") {
          __internal.push("obj");
          return "obj_awaiting_key";
        }
        if (ch === "[") {
          __internal.push("arr");
          return "arr_stable";
        }
        if (ch === "]") {
          __internal.removePreviousComma();
          __internal.pop();
          return "arr_complete";
        }
        if (ch === "\"") { return "arr_value_str"; }
        if (__internal.isDigit(ch)) { return "arr_value_num"; }
        if (ch === "-") { return "arr_value_num"; }
        if (ch === "t") { return __internal.check("true", "arr_stable", "arr_error"); }
        if (ch === "f") { return __internal.check("false", "arr_stable", "arr_error"); }
        if (ch === "n") { return __internal.check("null", "arr_stable", "arr_error"); }
        break;

      case "arr_complete":
        stablePos = currentPos;
        if (ch === "}") {
          __internal.pop();
          return "obj_complete";
        }
        if (__internal.isNewline(ch)) {
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
          __internal.replace("\"");
          return "arr_stable";
        }
        break;

      case "arr_value_num":
        ch = __internal.pass("0123456789.");
        ch = __internal.removeSpace();
        if (ch === "]") {
          __internal.pop();
          return "arr_complete";
        }
        if (ch === ",") {
          return "arr_awaiting_value";
        }
        break;
      default:
        break;
    }

    return state;
  },


  error(e, txt) {
    let context = 20;
    const syntaxErr = e.message.match(/^Unexpected token.*position\s+(\d+)/i);
    const pos = syntaxErr ? Number(syntaxErr[1]) : e.message.match(/^Unexpected end of JSON.*/i) ? txt.length - 1 : null;
    var msgErr = e.message;
    if (pos !== null) {
      const start = pos <= context ? 0 : pos - context;
      const end = pos + context >= txt.length ? txt.length : pos + context;
      var msg = txt.slice(start, end);
      msgErr += " while parsing near \n" + msg + "\n" + "-".repeat(pos) + "^";
    } else {
      msgErr += " while parsing " + txt.slice(0, context * 2);
    }
    return msgErr;
  }
}


function correct(json) {
  let state = "start";
  stack = [];
  text = json;
  currentPos = 0;
  var ch = "";
  while (currentPos < text.length) {
    ch = text[currentPos];
    state = __internal.lexical(state, ch);
    currentPos++;
  }
  if (state !== "obj_complete") {
    var start = (stablePos - 20 < 0) ? 0 : (stablePos - 20);
    var end = (stablePos + 20) >= text.length ? text.length : (stablePos + 20);
    var near = text.substring(start, end) + "\n" + "-".repeat(20) + "^";
    throw new JONExParseError("Error: Second chance: parse error at position " + currentPos + " with state " + state + " after \n" + near);
  }
  return text;
}

function parse(text2) {
  try {
    return __nativeJson.parse(text2);
  } catch (e) {
    try {
      var correction = correct(text2);
      return __nativeJson.parse(correction);
    } catch (ee) {
      var msg = __internal.error(e, text2) + "\n";
      if (ee.type === "JONExParseError") {
        msg += ee.message;
      } else {
        msg += __internal.error(ee, correction || "");
      }
      throw new JONExParseError(msg);
    }
  }
}

function replaceNativeJson() {
  if (!__nativeReplaced) {
    __nativeJson = JSON;
    __nativeReplaced = true;
    JSON = this;
  }
}

function revertToNativeJson() {
  if (__nativeReplaced) {
    JSON = __nativeJson;
    __nativeReplaced = false;
  }
}

function stringify(st) {
  return __nativeJson.stringify(st);
}

__nativeJson = JSON;


export { parse, correct, stringify, revertToNativeJson, replaceNativeJson }