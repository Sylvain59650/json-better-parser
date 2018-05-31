const JSONEx = {
  parse(text, reviver) {
    try {
      return JSON.parse(text, reviver);
    } catch (e) {
      var correction = JSONEx.correct(text);
      return JSON.parse(correction, reviver);
    }
  },

  correct(st) {
    var tokens = st.split(",");
    for (var i = 0; i < tokens.length; i++) {
      var line = tokens[i];
      tokens[i] = JSONEx.correctToken(line);
    }
    return tokens.join(",");
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

  stringify(arguments) {
    return JSON.stringify(arguments);
  }

}


var st = '{"a":1,"b":2}';
var l = ' {"Aabc:1,bc:"5","titi:"78",tata":"45,04",\'rr:56}';

//console.log(JSONEx.getFirstLetter(l));
var obj = JSONEx.parse(l);
console.log(JSONEx.stringify(obj));