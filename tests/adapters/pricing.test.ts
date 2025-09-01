import {
  formatCartGrandTotal,
  formatItemLineTotal,
} from "@/adapters/woocommerce/cartPricing";

test("grand total formats with currency", () => {
  const t = {
    currency_code: "NOK",
    currency_minor_unit: 2,
    currency_prefix: "kr ",
    currency_suffix: "",
    currency_decimal_separator: ",",
    currency_thousand_separator: ".",
    total_price: "12345",
    total_tax: "0",
    total_items: "0",
    total_items_tax: "0",
    total_shipping: "0",
    total_shipping_tax: "0",
    total_discount: "0",
    total_discount_tax: "0",
  };
  expect(formatCartGrandTotal(t as any)).toMatch(/kr\s*123,45/);
});

test("line total prefers discounted total", () => {
  const t = {
    currency_code: "NOK",
    currency_minor_unit: 2,
    currency_prefix: "kr ",
    currency_suffix: "",
    currency_decimal_separator: ",",
    currency_thousand_separator: ".",
    line_subtotal: "10000",
    line_subtotal_tax: "2500",
    line_total: "8000",
    line_total_tax: "2000",
  };
  expect(formatItemLineTotal(t as any, true)).toMatch(/kr\s*100,00/); // 80+20
});
