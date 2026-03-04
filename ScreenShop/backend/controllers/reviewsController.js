import { sql } from "../config/db.js";

export const createReview = async (req, res) => {
    const { user_id } = req.user;
    const product_id = parseInt(req.params.productId);
    const { rating, comment } = req.body;

    if (!rating) {
        return res.status(400).json({
            success: false,
            message: "rating is required.",
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: "rating must be between 1 and 5.",
        });
    }

    try {
        const buyer_id = user_id;

        const [purchase] = await sql`
            SELECT oi.order_item_id
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.order_id
            WHERE o.buyer_id = ${buyer_id}
              AND oi.product_id = ${product_id}
            LIMIT 1
        `;

        if (!purchase) {
            return res.status(403).json({
                success: false,
                message: "You can only review products you have purchased.",
            });
        }

        const [newReview] = await sql`
            INSERT INTO reviews (product_id, buyer_id, rating, review_text)
            VALUES (${product_id}, ${buyer_id}, ${rating}, ${comment ?? null})
            RETURNING *
        `;

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            data: newReview,
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this product.",
            });
        }
        if (error.code === "23503") {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }
        console.error("Error in createReview:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const getProductReviews = async (req, res) => {
    const product_id = parseInt(req.params.productId);

    try {
        const [stats] = await sql`
            SELECT
                ROUND(AVG(rating)::numeric, 2)  AS average_rating,
                COUNT(*)::int                   AS total_reviews
            FROM reviews
            WHERE product_id = ${product_id}
        `;

        const reviews = await sql`
            SELECT
                r.review_id,
                r.rating,
                r.review_text AS comment,
                r.created_at,
                u.name
            FROM reviews r
            JOIN buyers  b ON r.buyer_id  = b.buyer_id
            JOIN users   u ON b.buyer_id   = u.user_id
            WHERE r.product_id = ${product_id}
            ORDER BY r.created_at DESC
        `;

        return res.status(200).json({
            success: true,
            average_rating: stats.average_rating ?? 0,
            total_reviews: stats.total_reviews ?? 0,
            reviews,
        });
    } catch (error) {
        console.error("Error in getProductReviews:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const updateReview = async (req, res) => {
    const { user_id } = req.user;
    const product_id = parseInt(req.params.productId);
    const { rating, comment } = req.body;

    if (!rating && comment === undefined) {
        return res.status(400).json({
            success: false,
            message: "At least one field (rating or comment) must be provided.",
        });
    }

    if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
            success: false,
            message: "rating must be between 1 and 5.",
        });
    }

    try {
        const buyer_id = user_id;

        const [existing] = await sql`
            SELECT * FROM reviews
            WHERE product_id = ${product_id} AND buyer_id = ${buyer_id}
        `;

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Review not found.",
            });
        }

        const updatedRating = rating ?? existing.rating;
        const updatedComment = comment !== undefined ? comment : existing.review_text;

        const [updated] = await sql`
            UPDATE reviews
            SET rating      = ${updatedRating},
                review_text = ${updatedComment}
            WHERE product_id = ${product_id} AND buyer_id = ${buyer_id}
            RETURNING *
        `;

        return res.status(200).json({
            success: true,
            message: "Review updated successfully.",
            data: updated,
        });
    } catch (error) {
        console.error("Error in updateReview:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const deleteReview = async (req, res) => {
    const { role, user_id } = req.user;
    const product_id = parseInt(req.params.productId);

    try {
        let deleted;

        if (role === "admin") {
            // to delete a specific review, review id need to be provided
            const { review_id } = req.body;
            if (!review_id) {
                return res.status(400).json({
                    success: false,
                    message: "review_id is required in the request body for admin deletion.",
                });
            }

            [deleted] = await sql`
                DELETE FROM reviews
                WHERE review_id = ${review_id} AND product_id = ${product_id}
                RETURNING *
            `;
        } else if (role === "buyer") {
            const buyer_id = user_id;

            [deleted] = await sql`
                DELETE FROM reviews
                WHERE product_id = ${product_id} AND buyer_id = ${buyer_id}
                RETURNING *
            `;
        } else {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Review not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully.",
            data: deleted,
        });
    } catch (error) {
        console.error("Error in deleteReview:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const getAllReviewsAdmin = async (req, res) => {
    const { product_id, seller_id, rating } = req.query;

    try {
        const reviews = await sql`
            SELECT
                r.review_id,
                r.product_id,
                p.name,
                r.buyer_id,
                u.name,
                r.rating,
                r.review_text AS comment,
                r.created_at
            FROM reviews r
            JOIN products p  ON r.product_id  = p.product_id
            JOIN buyers   b  ON r.buyer_id    = b.buyer_id
            JOIN users    u  ON b.buyer_id     = u.user_id
            WHERE
                (${product_id ?? null}::int IS NULL OR r.product_id = ${product_id ?? null}::int)
            AND (${seller_id ?? null}::int IS NULL OR p.seller_id   = ${seller_id ?? null}::int)
            AND (${rating ?? null}::int IS NULL OR r.rating      = ${rating ?? null}::int)
            ORDER BY r.created_at DESC
        `;

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        console.error("Error in getAllReviewsAdmin:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const deleteAnyReview = async (req, res) => {
    const { review_id } = req.params;

    try {
        const [deleted] = await sql`
            DELETE FROM reviews
            WHERE review_id = ${review_id}
            RETURNING *
        `;

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: `Review with id '${review_id}' not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully.",
            data: deleted,
        });
    } catch (error) {
        console.error("Error in deleteAnyReview:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};