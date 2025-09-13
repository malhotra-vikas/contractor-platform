-- Seeding initial data for B2B platform
-- Insert admin user (password: admin123)
INSERT INTO users (email, password_hash, role, company_name, contact_person, phone) VALUES
('admin@platform.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'admin', 'Platform Admin', 'System Administrator', '+1-555-0100');

-- Insert sample subcontractor users
INSERT INTO users (email, password_hash, role, company_name, contact_person, phone, address) VALUES
('contractor1@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'subcontractor', 'ABC Construction', 'John Smith', '+1-555-0101', '123 Main St, City, State 12345'),
('contractor2@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'subcontractor', 'XYZ Builders', 'Jane Doe', '+1-555-0102', '456 Oak Ave, City, State 12346');

-- Insert sample products
INSERT INTO products (sku, name, description, category, brand, unit_price, cost_price, stock_quantity, min_stock_level, weight, dimensions, created_by) VALUES
('SKU-001', 'Steel Beam 10ft', 'High-grade steel beam, 10 feet length', 'Steel', 'SteelCorp', 299.99, 199.99, 50, 10, 85.5, '10ft x 6in x 4in', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('SKU-002', 'Concrete Mix 50lb', 'Premium concrete mix, 50 pound bag', 'Concrete', 'ConcretePro', 12.99, 8.50, 200, 25, 50.0, '24in x 16in x 6in', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('SKU-003', 'Rebar #4 20ft', 'Grade 60 rebar, #4 size, 20 feet', 'Steel', 'SteelCorp', 45.99, 32.00, 100, 15, 10.7, '20ft x 0.5in dia', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('SKU-004', 'Plywood 4x8 3/4"', 'Construction grade plywood sheet', 'Lumber', 'WoodWorks', 89.99, 65.00, 75, 20, 61.0, '48in x 96in x 0.75in', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('SKU-005', 'PVC Pipe 4" 10ft', 'Schedule 40 PVC pipe, 4 inch diameter', 'Plumbing', 'PipePro', 28.99, 18.50, 150, 30, 12.5, '10ft x 4in dia', (SELECT id FROM users WHERE role = 'admin' LIMIT 1));

-- Insert sample quote request
INSERT INTO quote_requests (request_number, subcontractor_id, notes, requested_delivery_date) VALUES
('QR-2024-001', (SELECT id FROM users WHERE email = 'contractor1@example.com'), 'Need materials for new construction project', '2024-02-15');

-- Insert quote request items
INSERT INTO quote_request_items (quote_request_id, product_id, quantity, notes) VALUES
((SELECT id FROM quote_requests WHERE request_number = 'QR-2024-001'), (SELECT id FROM products WHERE sku = 'SKU-001'), 10, 'For main structure'),
((SELECT id FROM quote_requests WHERE request_number = 'QR-2024-001'), (SELECT id FROM products WHERE sku = 'SKU-002'), 50, 'Foundation work'),
((SELECT id FROM quote_requests WHERE request_number = 'QR-2024-001'), (SELECT id FROM products WHERE sku = 'SKU-003'), 25, 'Reinforcement');
