INSERT INTO eats_roles (role_code, role_name, description)
VALUES
('ADMIN', '{"fr":"Administrateur","en":"Administrator"}', '{"fr":"Accès complet","en":"Full access"}'),
('SUPPORT_CLIENT', '{"fr":"Support Client","en":"Client Support"}', '{"fr":"Gestion tickets clients Eats","en":"Handle customer tickets"}'),
('SUPPORT_VENDEUR', '{"fr":"Support Vendeur","en":"Vendor Support"}', '{"fr":"Gestion restaurants, menus, litiges","en":"Restaurant, menu & dispute management"}'),
('LOGISTICS', '{"fr":"Logistique","en":"Logistics"}', '{"fr":"Coordination livreurs + scoring","en":"Delivery coordination + scoring"}'),
('ANALYSTE', '{"fr":"Analyste","en":"Analyst"}', '{"fr":"Accès dashboards FATIMA","en":"FATIMA dashboard access"}'),
('MARKETER', '{"fr":"Marketeur","en":"Marketer"}', '{"fr":"Promotions et Ads Eats","en":"Eats promotions and Ads"}'),
('COMPTABLE', '{"fr":"Comptable","en":"Accountant"}', '{"fr":"Factures et reversements","en":"Invoices and settlements"}'),
('AGENT_EXTERNE', '{"fr":"Agent Externe","en":"External Agent"}', '{"fr":"Accès restreint zone/pays","en":"Restricted regional access"}')
ON CONFLICT (role_code) DO NOTHING;
