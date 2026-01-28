// User & auth related
import { createUsersTable } from "./tables/users.js";
import { createBuyersTable } from "./tables/buyers.js";
import { createSellersTable } from "./tables/sellers.js";

// Product related
import { createProductCategoryTable } from "./tables/product_category.js";
import { createProductTable } from "./tables/product.js";
import { createReviewsTable } from "./tables/reviews.js";

// Order & cart related
import { createCartitemTable } from "./tables/cartitem.js";
import { createOrdersTable } from "./tables/orders.js";
import { createOrderitemTable } from "./tables/orderitem.js";

// Discount related
import { createDiscountTypeTable } from "./tables/discount_type.js";
import { createDiscountTable } from "./tables/discount.js";
import { createProductDiscountTable } from "./tables/productDiscount.js";
import { createOrderDiscountTable } from "./tables/orderDiscount.js";
// Q&A related
import { createQuestionsTable } from "./tables/questions.js";
import { createAnswersTable } from "./tables/answers.js";

export async function initDB() {
  try {
    /* Core */
    await createUsersTable();

    /* Role-based tables */
    await createBuyersTable();
    await createSellersTable();

    /* Product domain */
    await createProductCategoryTable();
    await createProductTable();
    await createReviewsTable();

    /* Cart & Orders */
    await createCartitemTable();
    await createOrdersTable();
    await createOrderitemTable();

    /* Discounts */
    await createDiscountTypeTable();
    await createDiscountTable();
    await createProductDiscountTable();
    await createOrderDiscountTable();

    /* Q&A */
    await createQuestionsTable();
    await createAnswersTable();

    console.log("All tables initialized successfully");
  } catch (error) {
    console.error("DB initialization failed:", error);
    process.exit(1);
  }
}
