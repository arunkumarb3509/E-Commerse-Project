-- user signup

select * from user_registration;

--  signup user address

select * from user_address;

-- login account

select * from login_account;

-- otp verification

select * from otp_verification; 

--  Roles

select * from roles;

INSERT INTO roles (role_id, role_name, description, role_type)
VALUES
(1, 'Customer', 'Regular customer with basic access', 'System'),
(2, 'Seller', 'Seller with additional access for managing their store', 'System');

--   User Roles
select * from user_roles;

-- business profile

select * from "BusinessProfile";

-- category_types

select * from category_types;

-- Main category

select * from main_categories;

-- sub category

select * from "subcategories"

-- Create the products table

select * from "products"

-- Create the seo_information table

select * from "seo_information"


-- Create the shipping_information table

select * from "shipping_information"

-- Create the product_size table

select * from product_size

-- Product Image	
	
select * from product_image

-- Product product_offers

select * from product_offers 

-- temp - add to cart 
select * from add_to_cart

-- customer Saved order 
select * from customer_saved_order

