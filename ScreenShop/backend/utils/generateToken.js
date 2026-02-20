import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
    const payload = { user_id: userId, role: role };

    // This part was added later
    // Add role-specific IDs so controllers can access req.user.buyer_id 
    // or req.user.seller_id directly without any undefined errors.
    if (role === 'buyer') {
        payload.buyer_id = userId;
    } else if (role === 'seller') {
        payload.seller_id = userId;
    }
    // end of new part
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
};