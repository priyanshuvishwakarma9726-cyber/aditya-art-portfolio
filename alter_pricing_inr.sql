-- Add new columns to commissions table
ALTER TABLE commissions ADD COLUMN final_price_inr INT NULL;
ALTER TABLE commissions ADD COLUMN difficulty_level VARCHAR(50) DEFAULT 'Medium';

-- Add new settings for INR and Difficulty to the settings table
INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES
('base_price_inr', '5000', 'Base price in INR for a commissioned artwork'),
('mult_diff_easy', '1.0', 'Multiplier for Easy difficulty (Simple face, clean background)'),
('mult_diff_medium', '1.3', 'Multiplier for Medium difficulty (Moderate shading)'),
('mult_diff_hard', '1.8', 'Multiplier for Hard difficulty (Heavy shading, detailed background)'),
('mult_diff_extreme', '2.5', 'Multiplier for Extreme difficulty (Hyper-realistic, multiple subjects)'),
('fee_express_inr', '2000', 'Flat extra fee in INR for Express deadline');
