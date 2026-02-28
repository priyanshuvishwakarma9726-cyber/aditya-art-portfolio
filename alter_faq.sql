CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keywords VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO faqs (keywords, answer) VALUES 
('commission, price, cost, how much', 'Pricing for custom commissions starts at ₹5,000 for an A4 portrait. The final price varies by medium (Pencil/Charcoal), size, and complexity. You can check the "Commission" page for an exact live quote!'),
('shipping, delivery, tracking, how long', 'Standard shipping across India takes 5-7 business days after the artwork is dispatched. Express shipping takes 2-3 days. You will receive a tracking link via email once dispatched.'),
('international, shipping, overseas, global', 'Yes! We ship globally. International shipping timelines vary between 10-15 business days. Please contact us directly for specific international shipping rates.'),
('medium, pencil, charcoal, materials', 'I specialize exclusively in graphite pencil and rich charcoal mediums on archival, museum-grade paper ensuring your artworks last for generations.'),
('refund, cancel, return', 'Since each commission is custom-made, refunds are only available before the drafting phase begins. Once penciling starts, cancellations are not permitted. For store items, returns are accepted within 7 days if the artwork is damaged in transit.');
