CREATE TABLE IF NOT EXISTS users
(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('buyer', 'seller')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buyers
(
    buyer_id INT PRIMARY KEY,
    address VARCHAR(255),
    CONSTRAINT fk_buyer_user
    FOREIGN KEY (buyer_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sellers
(
    seller_id INT PRIMARY KEY,
    store_name VARCHAR(150) NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_seller_user
    FOREIGN KEY (seller_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_category
(
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products
(
    product_id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_product_seller
    FOREIGN KEY (seller_id)
    REFERENCES sellers(seller_id),

    CONSTRAINT fk_product_category
    FOREIGN KEY (category_id)
    REFERENCES product_category(category_id)
);

CREATE TABLE IF NOT EXISTS reviews
(
    review_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    buyer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_review_product
    FOREIGN KEY (product_id)
    REFERENCES products(product_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_review_buyer
    FOREIGN KEY (buyer_id)
    REFERENCES buyers(buyer_id)
    ON DELETE CASCADE,

    CONSTRAINT uq_review_product_buyer
    UNIQUE (product_id, buyer_id)
);

CREATE TABLE IF NOT EXISTS questions
(
    question_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    buyer_id INT NOT NULL,
    question_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_question_product
    FOREIGN KEY (product_id)
    REFERENCES products(product_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_question_buyer
    FOREIGN KEY (buyer_id)
    REFERENCES buyers(buyer_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers
(
    answer_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL UNIQUE,
    seller_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_answer_question
    FOREIGN KEY (question_id)
    REFERENCES questions(question_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_answer_seller
    FOREIGN KEY (seller_id)
    REFERENCES sellers(seller_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders
(
    order_id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL,
    status VARCHAR(20) NOT NULL
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_order_buyer
    FOREIGN KEY (buyer_id)
    REFERENCES buyers(buyer_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items
(
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_orderitem_order
    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_orderitem_product
    FOREIGN KEY (product_id)
    REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS cart_items
(
    cartitem_id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),

    CONSTRAINT fk_cart_buyer
    FOREIGN KEY (buyer_id)
    REFERENCES buyers(buyer_id),

    CONSTRAINT fk_cart_product
    FOREIGN KEY (product_id)
    REFERENCES products(product_id),

    CONSTRAINT uq_cart_buyer_product
    UNIQUE (buyer_id, product_id)
);

CREATE TABLE IF NOT EXISTS discount_type
(
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS discount
(
    discount_id SERIAL PRIMARY KEY,
    type_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    discount_value INT NOT NULL CHECK (discount_value > 0),
    start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_discount_type
    FOREIGN KEY (type_id)
    REFERENCES discount_type(type_id)
);

CREATE TABLE IF NOT EXISTS order_discounts
(
    order_id INT NOT NULL,
    discount_id INT NOT NULL,

    CONSTRAINT pk_order_discount
    PRIMARY KEY (order_id, discount_id),

    CONSTRAINT fk_od_order
    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_od_discount
    FOREIGN KEY (discount_id)
    REFERENCES discount(discount_id)
);

CREATE TABLE IF NOT EXISTS product_discounts
(
    product_id INT NOT NULL,
    discount_id INT NOT NULL,

    CONSTRAINT pk_product_discount
    PRIMARY KEY (product_id, discount_id),

    CONSTRAINT fk_pd_product
    FOREIGN KEY (product_id)
    REFERENCES products(product_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_pd_discount
    FOREIGN KEY (discount_id)
    REFERENCES discount(discount_id)
    ON DELETE CASCADE
);

