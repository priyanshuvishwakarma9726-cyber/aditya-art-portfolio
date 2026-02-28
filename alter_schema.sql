-- Update orders table
ALTER TABLE orders 
ADD COLUMN payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
ADD COLUMN tracking_id VARCHAR(255) NULL,
ADD COLUMN estimated_delivery TIMESTAMP NULL;

-- Create commissions table
CREATE TABLE commissions (
    id VARCHAR(36) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    size_selection VARCHAR(50) NOT NULL, -- 'A4', 'A3', 'A2', 'Custom'
    medium_selection VARCHAR(50) NOT NULL, -- 'Pencil', 'Charcoal', 'Digital'
    deadline_selection VARCHAR(50) NOT NULL, -- 'Normal', 'Express'
    reference_image_url VARCHAR(512) NOT NULL,
    additional_notes TEXT,
    calculated_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'accepted', 'in_progress', 'completed', 'shipped', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'partial') DEFAULT 'pending',
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    tracking_number VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Extend settings for Commission Calculator Rules
INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES
('commission_base_price', '50.00', 'Base price for a commissioned artwork'),
('mult_size_a4', '1.0', 'Multiplier for A4 size'),
('mult_size_a3', '1.5', 'Multiplier for A3 size'),
('mult_size_a2', '2.5', 'Multiplier for A2 size'),
('mult_size_custom', '3.0', 'Multiplier for Custom size'),
('mult_medium_pencil', '1.0', 'Multiplier for Pencil medium'),
('mult_medium_charcoal', '1.2', 'Multiplier for Charcoal medium'),
('mult_medium_digital', '0.8', 'Multiplier for Digital medium'),
('fee_express_deadline', '30.00', 'Flat extra fee for Express deadline (e.g., within 7 days)');

-- Simple guest session table to sync guest cart
CREATE TABLE session_carts (
    session_id VARCHAR(100) PRIMARY KEY,
    cart_data JSON, -- Simple JSON storing quantity + artwork_id
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
