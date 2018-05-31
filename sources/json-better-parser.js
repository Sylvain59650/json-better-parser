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



  var JSONEx = {
    parse(text, reviver) {
      try {
        return JSON.parse(text, reviver);
      } catch (e) {
        var correction = JSONEx.correct(text);
        return JSON.parse(correction, reviver);
      }
    },

    correct(st) {
      debugger;
      var posStart = st.indexOf("{");
      var posStartArray = st.indexOf("[");

      if (posStart >= 0 && posStart < posStartArray) {
        let posEnd = st.lastIndexOf("}");
        let sub = st.substring(posStart + 1, posEnd - 1);
        return "{" + JSONEx.correctObject(sub) + "}";
      }
      if (posStartArray >= 0) {
        let posEnd = st.lastIndexOf("]");
        let sub = st.substring(posStart + 1, posEnd - 1);
        return "[" + JSONEx.correctArray(sub) + "]";
      }
      return st;
    },

    correctObject(st) {
      var tokens = st.split(",");
      for (var i = 0; i < tokens.length; i++) {
        var line = tokens[i];
        tokens[i] = JSONEx.correctToken(line);
      }
      return tokens.join(",");
    },

    correctArray(st) {
      var poStart = st.indexOf("[");
      var posEnd = st.lastIndexOf("]");
      var sub = st.substring(poStart + 1, posEnd - 1);
      return "[" + JSONEx.correctObject(sub) + "]";
    },

    getFirstLetter(str) {
      var i = 0;
      var found = false;
      while (i < str.length && !found) {
        var c = str.charAt(i);
        if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) { found = true; }
        i++;
      }
      return found ? i - 1 : -1;
    },

    correctToken(token) {
      var gui = "\"";
      var posDot = token.indexOf(":");
      if (posDot > 0) {
        var prop = token.substring(0, posDot).trim();
        prop = prop.replace("'", gui);
        var value = token.substring(posDot + 1);
        var beginG = prop.indexOf("\"", 0);
        if (beginG >= 0) {
          var endG = prop.indexOf("\"", beginG + 1);
          if (endG === -1) {
            var firstLetter = JSONEx.getFirstLetter(prop);
            if (firstLetter > beginG) {
              prop += gui;
            } else {
              prop = gui + prop;
            }
          }
        } else {
          prop = gui + prop.trim() + gui;
        }
        token = prop + ":" + value;
      }
      return token;
    },

    stringify() {
      return JSON.stringify(arguments);
    }

  }



  return JSONEx;
}));