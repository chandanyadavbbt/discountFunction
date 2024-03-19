// // @ts-check
// import { DiscountApplicationStrategy } from "../generated/api";

// // Use JSDoc annotations for type safety
// /**
// * @typedef {import("../generated/api").RunInput} RunInput
// * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
// * @typedef {import("../generated/api").Target} Target
// * @typedef {import("../generated/api").ProductVariant} ProductVariant
// */

// /**
// * @type {FunctionRunResult}
// */
// const EMPTY_DISCOUNT = {
//   discountApplicationStrategy: DiscountApplicationStrategy.First,
//   discounts: [],
// };

// // The configured entrypoint for the 'purchase.product-discount.run' extension target
// /**
// * @param {RunInput} input
// * @returns {FunctionRunResult}
// */
// export function run(input) {
//   const targets = input.cart.lines
//   // Only include cart lines with a quantity of two or more
//   // and a targetable product variant
//   .filter(line => line.quantity >= 2 &&
//     line.merchandise.__typename == "ProductVariant")
//   .map(line => {
//     const variant = /** @type {ProductVariant} */ (line.merchandise);
//     return /** @type {Target} */ ({
//       // Use the variant ID to create a discount target
//       productVariant: {
//         id: variant.id
//       }
//     }
//     );
    
    
//   });

//   if (!targets.length) {
//     // You can use STDERR for debug logs in your function
//     console.error("No cart lines qualify for volume discount.");
//     return EMPTY_DISCOUNT;
//   }
//   console.log("this is run .js")

//   // The @shopify/shopify_function package applies JSON.stringify() to your function result
//   // and writes it to STDOUT
//   return {
//     discounts: [
//       {
//         // Apply the discount to the collected targets
//         targets,
//         // Define a percentage-based discount
//         value: {
//           percentage: {
//             value: "5.0"
//           }
//         }
//       }
//     ],
//     discountApplicationStrategy: DiscountApplicationStrategy.First
//   };
// };


// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */

// this is web pixel apis
/**
 * browser.localStorage.getItem(url, data)
 *
 * @param {keyName} - String containing the name of the key you want to retrieve the value of.
 * @return {Promise} - Promise of type string.
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const couponCode = window.localStorage.getItem("discount_code");

  if (!couponCode) {
    console.error("No discount coupon found in local storage.");
    return EMPTY_DISCOUNT;
  }

  const targets = input.cart.lines
    // Only include cart lines with a quantity of two or more
    // and a targetable product variant
    .filter(
      (line) =>
        line.quantity >= 2 && line.merchandise.__typename == "ProductVariant"
    )
    .map((line) => {
      const variant = /** @type {ProductVariant} */ (line.merchandise);
      return /** @type {Target} */ ({
        // Use the variant ID to create a discount target
        productVariant: {
          id: variant.id,
        },
      });
    });

  if (!targets.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  console.log("Applying discount for coupon code:", couponCode);

  // Here, you can apply the discount based on the coupon code
  // Replace this logic with your actual implementation
  // For demonstration purposes, let's assume a percentage discount of 10%
  const discountValue = {
    percentage: {
      value: "1.0",
    },
  };

  const discount = {
    targets,
    value: discountValue,
  };

  return {
    discounts: [discount],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
