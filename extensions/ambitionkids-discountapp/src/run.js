// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {RunInput["cart"]["lines"][number]} RunInputCartLine
 */

const STEAL_DEAL_FIXED_PRICE = 599;
const DISCOUNT_MESSAGE = "Steal Deal unlocked";
const REQUIRED_ATTRIBUTE_VALUE = "STEAL DEAL @ RS. 599";

/**
 * @type {FunctionRunResult}
 */
const NO_DISCOUNT = {
  discountApplicationStrategy: "FIRST",
  discounts: [],
};

/**
 * @param {RunInputCartLine["merchandise"]} merchandise
 */
function isProductVariant(merchandise) {
  return merchandise.__typename === "ProductVariant";
}

/**
 * @param {RunInputCartLine} line
 */
function isMainProductLine(line) {
  return (
    isProductVariant(line.merchandise) &&
    line.merchandise.product.inMainCollection === true
  );
}

/**
 * @param {RunInputCartLine} line
 */
function isStealDealLine(line) {
  return (
    isProductVariant(line.merchandise) &&
    line.merchandise.product.inStealDealCollection === true &&
    line.attribute?.value?.trim() === REQUIRED_ATTRIBUTE_VALUE
  );
}

/**
 * Applies a fixed-price discount to collection-B products when at least one
 * collection-A product exists in the cart.
 *
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const lines = input.cart?.lines ?? [];
  const hasMainProduct = lines.some(isMainProductLine);

  if (!hasMainProduct) {
    return NO_DISCOUNT;
  }

  const discounts = lines
    .filter(isStealDealLine)
    .map((line) => {
      const currentPricePerUnit = Number.parseFloat(
        line.cost.amountPerQuantity.amount,
      );

      if (!Number.isFinite(currentPricePerUnit)) {
        return null;
      }

      const discountPerUnit = currentPricePerUnit - STEAL_DEAL_FIXED_PRICE;

      if (discountPerUnit <= 0) {
        return null;
      }

      return {
        message: DISCOUNT_MESSAGE,
        targets: [
          {
            cartLine: {
              id: line.id,
            },
          },
        ],
        value: {
          fixedAmount: {
            amount: discountPerUnit.toFixed(2),
            appliesToEachItem: true,
          },
        },
      };
    })
    .filter((discount) => discount !== null);

  if (discounts.length === 0) {
    return NO_DISCOUNT;
  }

  return {
    discountApplicationStrategy: "FIRST",
    discounts,
  };
}
