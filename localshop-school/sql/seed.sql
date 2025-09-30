USE localshop_school;
INSERT INTO products (name,category,price,unit,stock,image_url) VALUES
('Oyster Mushroom', 'Mushroom', 60.00, 'kg', 10, 'img/mushroom.jpg'),
('Frog', 'Frog', 120.00, 'kg', 5, 'img/frog.jpg'),
('Lettuce', 'Vegetable', 25.00, 'bunch', 30, 'img/lettuce.jpg'),
('Kale', 'Vegetable', 35.00, 'bunch', 25, 'img/kale.jpg'),
('Cucumber', 'Vegetable', 40.00, 'kg', 20, 'img/cucumber.jpg'),
('Chicken Eggs (10 pcs)', 'Egg', 45.00, 'pack', 12, 'img/eggs.jpg'),
('Fish', 'Fish', 90.00, 'kg', 8, 'img/fish.jpg');

INSERT INTO media (title,url,caption) VALUES
('Greenhouse', 'img/greenhouse.jpg', 'Hydration & humidity auto-spray'),
('Harvest Day', 'img/harvest.jpg', 'Morning harvest by students'),
('Fish Pond', 'img/pond.jpg', 'Clean water cycle');
