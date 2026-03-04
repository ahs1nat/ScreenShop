import { sql } from "../config/db.js";

const SELLER_ALLOWED_TYPES = ["SELLER_BASED", "TIMELINE_PRODUCT"];

export const createDiscountType = async (req, res) => {
    const { type_name, description } = req.body;
    const { role } = req.user;

    if (!type_name) {
        return res.status(400).json({
            success: false,
            message: "type_name is required.",
        });
    }

    const normalizedTypeName = type_name.trim().toUpperCase();

    if (role === "seller" && !SELLER_ALLOWED_TYPES.includes(normalizedTypeName)) {
        return res.status(403).json({
            success: false,
            message: `Sellers can only create the following discount types: ${SELLER_ALLOWED_TYPES.join(", ")}.`,
        });
    }

    try {
        const [newType] = await sql`
            INSERT INTO discount_type (type_name, description)
            VALUES (${normalizedTypeName}, ${description ?? null})
            RETURNING *
        `;

        return res.status(201).json({
            success: true,
            message: "Discount type created successfully.",
            data: newType,
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: `Discount type '${normalizedTypeName}' already exists.`,
            });
        }
        console.error("Error in createDiscountType:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const getAllDiscountTypes = async (req, res) => {
    try {
        const discountTypes = await sql`
            SELECT * FROM discount_type
            ORDER BY type_id ASC
        `;

        return res.status(200).json({
            success: true,
            count: discountTypes.length,
            data: discountTypes,
        });
    } catch (error) {
        console.error("Error in getAllDiscountTypes:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const updateDiscountType = async (req, res) => {
    const { id } = req.params;
    const { type_name, description } = req.body;

    if (!type_name && description === undefined) {
        return res.status(400).json({
            success: false,
            message: "At least one field (type_name or description) must be provided.",
        });
    }

    try {
        const [existing] = await sql`
            SELECT * FROM discount_type WHERE type_id = ${id}
        `;

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: `Discount type with id '${id}' not found.`,
            });
        }

        const updatedTypeName = type_name
            ? type_name.trim().toUpperCase()
            : existing.type_name;

        const updatedDescription =
            description !== undefined ? description : existing.description;

        const [updated] = await sql`
            UPDATE discount_type
            SET
                type_name   = ${updatedTypeName},
                description = ${updatedDescription}
            WHERE type_id = ${id}
            RETURNING *
        `;

        return res.status(200).json({
            success: true,
            message: "Discount type updated successfully.",
            data: updated,
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: `Discount type name already exists.`,
            });
        }
        console.error("Error in updateDiscountType:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const deleteDiscountType = async (req, res) => {
    const { id } = req.params;

    try {
        const [deleted] = await sql`
            DELETE FROM discount_type
            WHERE type_id = ${id}
            RETURNING *
        `;

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: `Discount type with id '${id}' not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Discount type '${deleted.type_name}' deleted successfully.`,
            data: deleted,
        });
    } catch (error) {
        if (error.code === "23503") {
            return res.status(409).json({
                success: false,
                message: "Cannot delete this discount type as it is referenced by existing discounts.",
            });
        }
        console.error("Error in deleteDiscountType:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};