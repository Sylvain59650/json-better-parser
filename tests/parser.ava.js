import { test } from "ava";

import * as JSONEx from "../sources/json-better-parser.js";



test("correctToken-simple", t => {
  t.deepEqual(JSONEx.correctToken("{a:1}"), "{\"a\":1}");
});

test("simple", t => {
  t.deepEqual(JSONEx.parse("{a:1}"), { a: 1 });
});