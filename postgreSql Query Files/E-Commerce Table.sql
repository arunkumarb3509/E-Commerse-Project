-- user signup

CREATE TABLE user_registration (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(255),
	customer_type VARCHAR(50)
);

select * from user_registration;

DELETE FROM user_registration WHERE id=1;
	
drop table user_registration;

--  signup user address

CREATE TABLE user_address (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(50),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user_registration(id) ON DELETE CASCADE
);

select * from user_address;

DELETE FROM user_address WHERE id=1;
	
drop table user_address;


-- login account

CREATE TABLE login_account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
	active BOOLEAN DEFAULT True,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_date TIMESTAMP
);

select * from login_account;

drop table login_account;

-- otp verification

CREATE TABLE otp_verification (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    otp VARCHAR(10) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_date TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE, 
    workflow VARCHAR(50) DEFAULT 'initial',
	token VARCHAR(255)
);

select * from otp_verification; 

delete from otp_verification where id=9;

drop table otp_verification;

--  Roles

CREATE TABLE roles (
	role_id Serial Primary key,
    role_name varchar(50) not null unique,
    description text,
	role_type varchar(50)
);

select * from roles;

drop table roles;

INSERT INTO roles (role_id, role_name, description, role_type)
VALUES
(1, 'Customer', 'Regular customer with basic access', 'System'),
(2, 'Seller', 'Seller with additional access for managing their store', 'System');

--   User Roles

CREATE TABLE user_roles (
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
    role_id INT NOT NULL,
    foreign key (user_id) references user_registration(id),
	foreign key (role_id) references roles(role_id)
);

select * from user_roles;

drop table user_roles;


-- business profile

CREATE TABLE business_profile (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    companyOwner_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    whatsapp_number VARCHAR(20),
    website_URL VARCHAR(100),
    street_address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


select * from "BusinessProfile";

drop table "BusinessProfile";



-- category_types
CREATE TABLE category_types (
    category_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL
);

ALTER SEQUENCE category_types_category_type_id_seq RESTART WITH 200001;

INSERT INTO category_types (type_name) VALUES
('Tops'),
('Bottoms'),
('Outerwear'),
('Activewear'),
('Underwear'),
('Accessories'),
('Dresses'),
('Loungewear'),
('Formal Wear'),
('Footwear'),
('Socks');

select * from category_types;

drop table category_types;
-- Main category

CREATE TABLE main_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    category_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE main_categories_category_id_seq RESTART WITH 1001;

select * from main_categories;

drop table main_categories;

-- sub category
CREATE TABLE subcategories (
    subcategory_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    category_type_id INT NOT NULL,
    subcategory_name VARCHAR(100) NOT NULL,
    subcategory_description TEXT,
    images BYTEA,  -- Use BYTEA for binary data storage
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES main_categories(category_id) ON DELETE CASCADE,
    FOREIGN KEY (category_type_id) REFERENCES category_types(category_type_id) ON DELETE CASCADE
);

ALTER SEQUENCE subcategories_subcategory_id_seq RESTART WITH 5001;

select * from "subcategories"

drop table "subcategories"


-- Create the products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY, -- Auto-incrementing primary key starting from 2000000
    category_id INT,
    subcategory_id INT,
    category_type_id INT,
    material_type TEXT,
    product_code VARCHAR(255) UNIQUE, -- Ensure uniqueness
    product_name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    total_stock INT NOT NULL,
    stock_quantity INT NOT NULL, -- Newly added column
    reorder_level INT NOT NULL,
    availability VARCHAR(255) NOT NULL,
    product_description TEXT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    modified_by VARCHAR(255) NOT NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(subcategory_id),
    FOREIGN KEY (category_id) REFERENCES main_categories(category_id),
    FOREIGN KEY (category_type_id) REFERENCES subcategories(category_type_id),
    CONSTRAINT unique_product_code UNIQUE (product_code) -- Add Unique Constraint
);



ALTER TABLE products ADD CONSTRAINT unique_product_code UNIQUE (product_code);


TRUNCATE TABLE products CASCADE;
	
drop table products;

-- Alter the sequence for product_id to start from 2000000
ALTER SEQUENCE products_product_id_seq RESTART WITH 2000000;


select * from "products"



-- Create the seo_information table
CREATE TABLE seo_information (
    seo_id SERIAL PRIMARY KEY,                  -- Auto-incrementing primary key starting from 7000
    product_id INT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    keywords TEXT,
	care_instructions TEXT,
	return_policy TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Alter the sequence for seo_id to start from 7000
ALTER SEQUENCE seo_information_seo_id_seq RESTART WITH 7000;

select * from "seo_information"

drop table seo_information;

-- Create the shipping_information table
CREATE TABLE shipping_information (
    shipping_id SERIAL PRIMARY KEY,             -- Auto-incrementing primary key starting from 80000
    product_id INT,
    weight DECIMAL(10, 2),
    dimensions VARCHAR(255),
    shipping_class VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (product_id) REFERENCES products(product_id)
);
-- REFERENCES products(product_id) ON DELETE CASCADE,

-- Alter the sequence for shipping_id to start from 80000
ALTER SEQUENCE shipping_information_shipping_id_seq RESTART WITH 80000;

select * from "shipping_information"

drop table shipping_information;

-- Product Size
CREATE TABLE product_size (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    size_id VARCHAR(255),
	total_quantity INT,
    stock_quantity INT,
	FOREIGN KEY (product_id) REFERENCES products(product_id)
);
-- ALTER TABLE product_size
-- ADD COLUMN total_quantity INT,
-- ADD COLUMN stock_quantity INT;

select * from product_size

drop table product_size


-- Product Image	
CREATE TABLE product_image (
    id SERIAL PRIMARY KEY,
    product_id INT,
    image_id SERIAL,
    images BYTEA,
    image_name VARCHAR(255),
	image_title VARCHAR(255),
    image_url VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    modified_by INT,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
-- Set the starting value of the sequence associated with image_id to 500
ALTER SEQUENCE product_image_image_id_seq RESTART WITH 500;
	
select * from product_image

drop table product_image;


DELETE FROM seo_information
WHERE seo_id = 7003

-- product offers

-- Create the product_offers table with the specified fields
CREATE TABLE IF NOT EXISTS product_offers (
    offer_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    offer_name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    discount_percentage INT CHECK (discount_percentage BETWEEN 1 AND 100), -- Validates percentage range
    discount_price INT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    expired_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    modified_by VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Set the starting value for the offer_id sequence to 700
ALTER SEQUENCE product_offers_offer_id_seq RESTART WITH 700;

select * from product_offers

drop table product_offers



CREATE TABLE add_to_cart (
    cart_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    customer_id INT,
    guest_user_id VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at VARCHAR(255) NOT NULL,
    modified_at VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES user_registration(id) ON DELETE CASCADE
);

-- Set the starting value of cart_id to 4500
ALTER SEQUENCE add_to_cart_cart_id_seq RESTART WITH 4500;

select * from add_to_cart
 
drop table add_to_cart

-- customer saved order
CREATE TABLE customer_saved_order (
    saved_order_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
	guest_user_id VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

ALTER SEQUENCE customer_saved_order_saved_order_id_seq RESTART WITH 15000;

select * from customer_saved_order

drop table customer_saved_order



