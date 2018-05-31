import { test } from "ava";

import * as JSONEx from "../sources/json-better-parser.js";


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

test("multilines-missing-leftcomma", t => {
  t.deepEqual(to("{a:1\n,b':3\n,c:{e:4}}"), '{"a":1,"b":3,"c":{"e":4}}');
});

test("correct-multilines-missing-leftcomma", t => {
  t.deepEqual(correct("{a:1\n,b\":3\n,c:{e:4}}"), '{"a":1,"b":3,"c":{"e":4}}');
});

test("correct-missing-leftcomma", t => {
  t.deepEqual(correct("{a:1,b\":3,c:{e:4}}"), '{"a":1,"b":3,"c":{"e":4}}');
});

test("correct-missing-leftcomma2", t => {
  t.deepEqual(correct("{a\":1}"), '{"a":1}');
});