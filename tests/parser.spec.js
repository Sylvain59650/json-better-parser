var JSONEx = require("../sources/json-better-parser.js");

var st = '{"a":1,"b":2}';
var l = ' "{Aabc:1,bc:"5","titi:"78",tata":"45,04",\'rr:56}';

//console.log(JSONEx.getFirstLetter(l));
var ll = "{ll:[" + l + "," + "]}";

console.log(JSONEx.correct(l));
console.log(JSONEx.correct(ll));
// var obj = JSONEx.parse(l);
// console.log(JSONEx.stringify(obj));