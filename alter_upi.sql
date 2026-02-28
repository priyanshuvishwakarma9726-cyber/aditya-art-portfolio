-- Adjust Enum values first to include new states safely
ALTER TABLE commissions MODIFY payment_status ENUM('pending', 'pending_verification', 'paid', 'partial', 'rejected') DEFAULT 'pending';
ALTER TABLE orders MODIFY payment_status ENUM('pending', 'pending_verification', 'paid', 'failed', 'refunded', 'rejected') DEFAULT 'pending';

-- Add screenshot Proofs and Details
ALTER TABLE commissions 
ADD COLUMN screenshot_path VARCHAR(512) NULL,
ADD COLUMN upi_amount DECIMAL(10,2) NULL;

ALTER TABLE orders 
ADD COLUMN screenshot_path VARCHAR(512) NULL,
ADD COLUMN upi_amount DECIMAL(10,2) NULL;

-- Base settings for UPI
INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES
('upi_id', 'test@upi', 'The UPI ID to display on the payment page'),
('enable_commission_toggle', 'true', 'Enable or disable commission requests globally');
