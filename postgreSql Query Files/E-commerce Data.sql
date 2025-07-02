CREATE TABLE category_types (
    category_type_id INT AUTO_INCREMENT PRIMARY KEY,,
    type_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create Categories Table
CREATE TABLE categories (
    category_id  INT AUTO_INCREMENT PRIMARY KEY,,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create Subcategories Table
CREATE TABLE subcategories (
    subcategory_id INT AUTO_INCREMENT PRIMARY KEY,,
    category_id INT NOT NULL,
	category_type_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
	FOREIGN KEY (category_type_id) REFERENCES category_types(category_type_id) ON DELETE CASCADE
);

INSERT INTO category_types (category_type_id,type_name) VALUES
(200001,'Tops'),
(200002,'Bottoms'),
(200003,'Outerwear'),
(200004,'Activewear'),
(200005,'Underwear'),
(200006,'Accessories'),
(200007,'Dresses'),
(200008,'Loungewear'),
(200009,'Formal Wear'),
(2000010,'Footwear'),
(20000111,'Socks');


INSERT INTO categories (id ,name) VALUES
(1001,'Men\'s Clothing'),
(1002,'Women\'s Clothing'),
(1003,'Boys\'s Clothing'),
(10031,'Girls\'s Clothing'),

(10032,'Newborn Clothing (0-3 months)'),
(10033,'Infant Clothing (3-12 months)'),
(10034,'Toddler Clothing (1 to 3 years)'),

(10051,'Men\'s Activewear'),
(10052,'Women\'s Activewear'),


(1006,'Specialty Clothing'),
(1007,'Seasonal Clothing'),
(1008,'Sustainable & Ethical Fashion'),
(1009,'Luxury & Designer Clothing'),


(10041,'Men\'s Footwear'),
(10042,'Women\'s Footwear'),
(10041,'Boys\'s Footwear'),
(10042,'Girls\'s Footwear');

INSERT INTO subcategories (subcategory_id,category_id,category_type_id, name) VALUES
-- Men's Clothing
(5001,1001,200001, 'T-Shirts'),
(1001, 'Dress Shirts'),
(1001, 'Polo Shirts'),
(1001, 'Hoodies & Sweatshirts'),

(1001, 'Bottoms'), 
(1001, 'Jeans'),
(1001, 'Chinos'),
(1001, 'Shorts'),
(1001, 'Trousers'),
(1001, 'Outerwear'),
(1001, 'Jackets'),
(1001, 'Coats'),
(1001, 'Blazers'),
(1001, 'Activewear'),
(1001, 'Athletic Shirts'),
(1001, 'Joggers'),
(1001, 'Gym Shorts'),
(1001, 'Underwear & Socks'),
(1001, 'Boxers'),
(1001, 'Briefs'),
(1001, 'Socks'),
(1001, 'Accessories'),
(1001, 'Belts'),
(1001, 'Ties'),
(1001, 'Hats'),
(1001, 'Scarves'),

-- Women's Clothing
(1002, 'Tops'),
(1002, 'Blouses'),
(1002, 'T-Shirts'),
(1002, 'Sweaters'),
(1002, 'Tank Tops'),
(1002, 'Bottoms'),
(1002, 'Skirts'),
(1002, 'Jeans'),
(1002, 'Trousers'),
(1002, 'Leggings'),
(1002, 'Dresses'),
(1002, 'Casual Dresses'),
(1002, 'Formal Dresses'),
(1002, 'Maxi Dresses'),
(1002, 'Outerwear'),
(1002, 'Coats'),
(1002, 'Jackets'),
(1002, 'Cardigans'),
(1002, 'Activewear'),
(1002, 'Sports Bras'),
(1002, 'Leggings'),
(1002, 'Athletic Tops'),
(1002, 'Underwear & Loungewear'),
(1002, 'Bras'),
(1002, 'Panties'),
(1002, 'Pajamas'),
(1002, 'Accessories'),
(1002, 'Scarves'),
(1002, 'Hats'),
(1002, 'Jewelry'),


-- Boy's Clothing
(1003, 'Tops'),
(1003, 'Bottoms'),
(1003, 'Outerwear'),
(1003, 'Activewear'),

-- Girls's Clothing
(10031, 'Tops'),
(10031, 'Bottoms'),
(10031, 'Dresses'),
(10031, 'Outerwear'),

-- Infants/Toddlers Clothing
(1003, 'Infants/Toddlers'),
(10032, 'Bodysuits'),
(10032, 'Sleepers'),
(10032, 'Outerwear'),
(10032, 'Accessories'),
(10032, 'Hats'),
(10032, 'Socks'),
(10032, 'Backpacks'),

-- Footwear
(1004, 'Men\'s Footwear'),
(1004, 'Sneakers'),
(1004, 'Dress Shoes'),
(1004, 'Sandals'),
(1004, 'Boots'),

(1004, 'Women\'s Footwear'),
(1004, 'Heels'),
(1004, 'Flats'),
(1004, 'Sneakers'),
(1004, 'Boots'),

(1004, 'Children\'s Footwear'),
(1004, 'Sneakers'),
(1004, 'Sandals'),
(1004, 'Dress Shoes'),

-- Men's Activewear
(10051, 'Shorts'),
(10051, 'Shirts'),
(10051, 'Joggers'),

-- Womens's Activewear
(10052, 'Leggings'),
(10052, 'Sports Bras'),
(10052, 'Workout Tops'),
(10052, 'Accessories'),
(10052, 'Gym Bags'),
(10052, 'Water Bottles'),
(10052, 'Headbands'),

-- Specialty Clothing
(1006, 'Plus Size Clothing'),
(1006, 'Maternity Clothing'),
(1006, 'Formal Wear'),
(1006, 'Suits'),
(1006, 'Evening Gowns'),
(1006, 'Costumes'),
(1006, 'Halloween Costumes'),
(1006, 'Themed Outfits'),

-- Seasonal Clothing
(1007, 'Summer Clothing'),
(1007, 'Winter Clothing'),
(1007, 'Holiday Clothing'),

-- Sustainable & Ethical Fashion
(1008, 'Eco-Friendly Brands'),
(1008, 'Fair Trade Clothing'),

-- Luxury & Designer Clothing
(1009, 'High-End Brands'),
(1009, 'Designer Collaborations');


INSERT INTO subcategories (category_id, name) VALUES
(3, 'Tops'),
(3, 'Long-Sleeve Shirts'),
(3, 'Bottoms'),
(3, 'Pants'),
(3, 'Leggings'),
(3, 'Shorts'),
(3, 'Dresses'),
(3, 'Outerwear'),
(3, 'Jackets'),
(3, 'Sweaters'),
(3, 'Footwear'),
(3, 'Shoes'),
(3, 'Sneakers'),
(3, 'Accessories'),
(3, 'Hats'),
(3, 'Socks'),
(3, 'Bibs');