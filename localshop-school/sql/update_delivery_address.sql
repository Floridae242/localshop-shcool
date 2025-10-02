-- Add delivery_address column to existing orders table
USE localshop_school;

-- Add delivery_address column if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_address TEXT AFTER phone;

-- Update existing orders with sample delivery addresses
UPDATE orders 
SET delivery_address = '123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110' 
WHERE id = 1;

UPDATE orders 
SET delivery_address = '456 หมู่ 5 ตำบลแม่ฮ้อยเงิน อำเภอดอยสะเก็ด จังหวัดเชียงใหม่ 50220' 
WHERE id = 2;

UPDATE orders 
SET delivery_address = '789 ถนนนิมมานเหมินท์ ตำบลสุเทพ อำเภอเมือง จังหวัดเชียงใหม่ 50200' 
WHERE id = 3;

-- Add more sample data if needed
UPDATE orders 
SET delivery_address = '321 หมู่ 2 ตำบลแม่ฮ้อยเงิน อำเภอดอยสะเก็ด จังหวัดเชียงใหม่ 50220' 
WHERE id = 4;

UPDATE orders 
SET delivery_address = '654 ถนนเจริญเมือง ตำบลศรีภูมิ อำเภอเมือง จังหวัดเชียงใหม่ 50200' 
WHERE id = 5;

UPDATE orders 
SET delivery_address = '987 หมู่ 3 ตำบลแม่ฮ้อยเงิน อำเภอดอยสะเก็ด จังหวัดเชียงใหม่ 50220' 
WHERE id = 6;


