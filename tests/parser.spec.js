var JSONEx = require("../sources/json-better-parser.js");


function to(exp) {
  return JSONEx.stringify(JSONEx.parse(exp)).replace(" ", "");
}


function correct(exp) {
  return JSONEx.correct(exp);
}

var t = {
  deepEqual: function(e1, e2) {
    if (e1 != e2) {
      throw "not equals:\n" + e1 + "\n" + e2;
    }
  }
};



var st = '{"a":1,"b":2}';
var l = '{Aabc:1,bc:"5","titi:"78",tata":"45,04",\'rr\':56}';

//console.log(JSONEx.getFirstLecorrecter(l));
var ll = "{ll:[" + l + "," + l + "]}";

debugger;

JSONEx.parse('            {   abc   :   "1"    ,     bcd   :    \'25\'    ,   cde   :    3   }');
console.log(correct("{a:1\n,b':3\n,c:{e:4}}"));
debugger;
console.log(correct('{abc:"once upon a time",bcd:    "game of thrones"}'));
// console.log(JSONEx.correct(l));
// console.log(JSONEx.correct(ll));
// // var obj = JSONEx.parse(l);
// // console.log(JSONEx.stringify(obj));

// t.deepEqual(correct("{a:1\n,b:3\n,c:{e:4}}"), '{"a":1,"b":3,"c":{"e":4}}');

// var obj = JSONEx.parse("{a:1,b:2,\nc:4,d:{a:5}}");
// console.log(JSON.stringify(obj));



// t.deepEqual(to("{a:1\n,b:3\n,c:{e:4}}"), '{"a":1,"b":3,"c":{"e":4}}');

// t.deepEqual(correct("{a:'1}"), '{"a":"1"}');

// t.deepEqual(correct("{a:\"1}"), '{"a":"1"}');

//t.deepEqual(correct('{a:"1,b:2,c:"3}'), '{"a":"1","b":2,"c":"3"}');

//t.deepEqual(correct('{abc:"1",bcd:25,cde:3}'), '{"abc":"1","bcd":25,"cde":3}');
debugger;
console.log(correct('            {   abc   :   "1"    ,     bcd   :    \'25\'    ,   cde   :    3   }'));

console.log(correct("{abc:\"azerty uiop\",bcd:\"pou mlk jhg\"}"));

console.log(correct('{abc:"tr \" u",bcd:     \'fal\',    cde  :  \'nu\'}'));
debugger;
console.log(correct("{abc:\"azerty uiop\",bcd:\"pou mlk jhg\"}"));


t.deepEqual(correct("{abc:\"azerty uiop\",bcd:\"pou mlk jhg\"}"), "{\"abc\":\"azerty uiop\",\"bcd\":\"pou mlk jhg\"}");

console.log(correct("{abc:nulla}"));

t.deepEqual(correct('{abc:tru,bcd:fal,cde:nu}'), '{"abc":"tru","bcd":"fal","cde":"nu"}');

console.log(correct('{abc:nulla,bcd:falsesy}'));

t.deepEqual(correct('{abc:nulla}'), '{"abc":"nulla"}');


t.deepEqual(correct('{abc:true,bcd:false,cde:null,def:null}'), '{"abc":true,"bcd":false,"cde":null,"def":null}');


t.deepEqual(correct("{abc:\"azerty  uiop\",bcd:\"pou    mlk  jhg\"}"), "{\"abc\":\"azerty  uiop\",\"bcd\":\"pou    mlk  jhg\"}");
console.log(correct("{abc:\"azerty  uiop\",bcd:\"pou    mlk  jhg\"}"));

//console.log(correct("{a:1\n,b\":3\n,c:{e:4}}"));

//console.log(correct('            {   abc   :   "1"    ,     bcd   :    \'25\'    ,   cde   :    3   }'));