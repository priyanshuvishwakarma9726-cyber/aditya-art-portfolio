-- Production Enhancements

-- 1. Visitor Tracking Log
CREATE TABLE IF NOT EXISTS visitor_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_hash VARCHAR(64) NOT NULL,
    path VARCHAR(255) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (created_at)
);

-- 2. Members Only Artwork Lock
ALTER TABLE artworks ADD COLUMN is_exclusive BOOLEAN DEFAULT FALSE;

-- 3. Settings table for Legal documents (Assuming 'settings' table exists)
INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES
('legal_terms', '# Terms of Service\n\nWelcome to Aditya Art Studio. By accessing this website, you agree to be bound by these terms...', 'Terms of Service markdown content'),
('legal_privacy', '# Privacy Policy\n\nYour privacy is important to us. We securely hash IPs for analytics and never sell your data...', 'Privacy Policy markdown content'),
('legal_refund', '# Refund Policy\n\nCustom commissions cannot be refunded once drafting begins. Original store artworks may be returned within 7 days if damaged.', 'Refund Policy markdown content');
