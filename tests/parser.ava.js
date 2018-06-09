import { test } from "ava";

import * as JSONEx from "../distrib/json-better-parser.min.js";


function to(exp) {
  return JSONEx.stringify(JSONEx.parse(exp)).replace(" ", "");
}

function correct(exp) {
  return JSONEx.correct(exp).replace(" ", "");
}

test("correctToken-simple", t => {
  t.deepEqual(to("{a:1}"), "{\"a\":1}");
});

test("simple", t => {
  t.deepEqual(to("{a:1}"), '{\"a\":1}');
});

test("correctToken-multilines", t => {
  t.deepEqual(to("{a:1\n,b:3\n,c:{e:4}}"), '{"a":1,"b":3,"c":{"e":4}}');
});

test("parse-missing-leftcomma", t => {
  let input = "{a:1\n,b':3\n,c:{e:4}}";
  var obj = JSONEx.parse(correct(input));
  t.true(obj != null);
});

test("parse-multilines-missing-leftcomma", t => {
  let input = "{a:1\n,b\":3\n,c:{e:4}}";
  var obj = JSONEx.parse(input);
  t.true(obj != null);
});

test("correct-missing-leftcomma", t => {
  t.deepEqual(correct("{a:1,b\":3,c:{e:4}}"), '{"a":1,"b":3,"c":{"e":4}}');
});

test("correct-missing-leftcomma2", t => {
  t.deepEqual(correct("{a\":1}"), '{"a":1}');
});

test("correct-missing-rightcomma", t => {
  t.deepEqual(correct("{a:\"1}"), '{"a":"1"}');
});

test("correct-with-space-in-values", t => {
  let input = "{abc:\"azerty uiop\",bcd:\"pou mlk jhg\"}";
  t.deepEqual(correct(input).replace(/ /g, ""),
    "{\"abc\":\"azerty uiop\",\"bcd\":\"pou mlk jhg\"}".replace(/ /g, ""));
  JSONEx.parse(correct(input));
});

// test("correct-missing-rightcomma2", t => {
//   t.deepEqual(correct("{a:\"1,b:2,c:\"3}"), '{"a":"1","b":2,"c":"3"}');
// });


test("correct-with-space", t => {
  let input = '            {   abc   :   "1"    ,     bcd   :    \'25\'    ,   cde   :    3   }';
  t.deepEqual(correct(input).replace(/ /g, ""),
    '{"abc"   :"1","bcd"   :"25","cde"   :3}'.replace(/ /g, ""));
  JSONEx.parse(input);
});


test("correct-special-value", t => {
  t.deepEqual(correct('{abc:true,bcd:false,cde:null}'), '{"abc":true,"bcd":false,"cde":null}');
});

test("correct-special-value2", t => {
  t.deepEqual(correct('{abc:"true",bcd:"false",cde:null,def:null}'), '{"abc":"true","bcd":"false","cde":null,"def":null}');
});

test("correct-special-value3", t => {
  t.deepEqual(correct('{abc:[true,false,null,false,true],bcd:false,cde:null}'), '{"abc":[true,false,null,false,true],"bcd":false,"cde":null}');
});

test("correct-special-value4", t => {
  t.deepEqual(correct('{abc:[true,false,7,null,"false",true],bcd:false,cde:null}'), '{"abc":[true,false,7,null,"false",true],"bcd":false,"cde":null}');
});

test("correct-special-value5", t => {
  t.deepEqual(correct('{abc:truesy,bcd:falsesy,cde:nullable}'), '{"abc":"truesy","bcd":"falsesy","cde":"nullable"}');
});

test("correct-special-value6", t => {
  t.deepEqual(correct('{abc:tru,bcd:fal,cde:nu}'), '{"abc":"tru","bcd":"fal","cde":"nu"}');
});

test("correct-guillement", t => {
  let input = '{abc:\'tru\',bcd:     \'fal\',    cde  :  \'nu\'}';
  t.deepEqual(correct(input).replace(/ /g, ""), '{"abc":"tru","bcd":"fal","cde"  :"nu"}'.replace(/ /g, ""));
  JSONEx.parse(input);
});

test("correct-guillement2", t => {
  let input = '{abc:"tr \' u",bcd:     \'fal\',    cde  :  \'nu\'}';
  t.deepEqual(correct(input).replace(/ /g, ""), '{"abc":"tr \' u","bcd":"fal","cde":"nu"}'.replace(/ /g, ""));
  JSONEx.parse(input);
});

test("correct-guillement3", t => {
  let input = '{abc:"tr\' u",bcd:     \'fal\',    cde  :  \'nu\'}';
  t.deepEqual(correct(input).replace(/ /g, ""), '{"abc":"tr\' u","bcd":"fal","cde":"nu"}'.replace(/ /g, ""));
  JSONEx.parse(input);
});

test("correct-space", t => {
  let input = '{abc:"once upon a time",bcd:    "game of thrones"}';
  t.deepEqual(correct(input).replace(/ /g, ""), '{"abc":"once upon a time","bcd":"game of thrones"}'.replace(/ /g, ""));
  JSONEx.parse(input);
});