CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    status VARCHAR(20), -- 'healthy', 'warning', 'critical'
    latency_ms INTEGER, -- Simula latencia de respuesta de la propiedad
    last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO properties (name, status, latency_ms) VALUES
('Edificio Central', 'healthy', 45),
('Torre Norte', 'critical', 850),
('Condominio Los Andes', 'warning', 320),
('Oficina Centro', 'healthy', 20),
('Galpón Industrial', 'critical', 910);