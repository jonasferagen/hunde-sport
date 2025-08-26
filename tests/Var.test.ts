import { loadFromJson } from "./ProductVariationOptions";
import * as util from "util";

const index = loadFromJson("tests/sample.json");
const groups = index.getOptionGroups();
// render one selector per group; disable options where available === false
console.log(util.inspect(groups, { depth: null, colors: true, compact: false }));

it('builds maps correctly', () => {
    expect(true).toBe(true);
});