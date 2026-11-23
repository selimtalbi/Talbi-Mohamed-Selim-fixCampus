-- PostgreSQL runs this file when it creates an empty data directory.
-- Seed password_hash values are NULL until authentication is implemented.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('member', 'technician', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    building VARCHAR(120) NOT NULL,
    floor INTEGER NOT NULL DEFAULT 0,
    equipment_type VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT rooms_name_building_unique UNIQUE (name, building)
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    technician_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE interventions (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    technician_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    comment TEXT NOT NULL
);

CREATE INDEX tickets_room_id_idx ON tickets(room_id);
CREATE INDEX tickets_author_id_idx ON tickets(author_id);
CREATE INDEX tickets_technician_id_idx ON tickets(technician_id);
CREATE INDEX interventions_ticket_id_idx ON interventions(ticket_id);

INSERT INTO users (name, email, role) VALUES
    ('Admin User', 'admin@fixit-campus.test', 'admin'),
    ('Tech User', 'technician@fixit-campus.test', 'technician'),
    ('Member User', 'member@fixit-campus.test', 'member');

INSERT INTO rooms (name, building, floor, equipment_type) VALUES
    ('Room 101', 'Main Building', 1, 'Classroom'),
    ('Room 102', 'Main Building', 1, 'Classroom'),
    ('Lab 201', 'Science Building', 2, 'Laboratory'),
    ('Library Hall', 'Library', 0, 'Study space'),
    ('Gym Court', 'Sports Center', 0, 'Sports equipment');

INSERT INTO tickets (title, description, priority, status, room_id, author_id, technician_id)
SELECT seed.title, seed.description, seed.priority, seed.status, rooms.id, member.id, technician.id
FROM (VALUES
    ('Projector does not turn on', 'The projector in the front of the room will not power on.', 'high', 'open', 'Room 101', 'Main Building'),
    ('Broken desk', 'One desk has a loose leg and is unstable.', 'low', 'open', 'Room 101', 'Main Building'),
    ('Air conditioning is too warm', 'The air conditioner runs but does not cool the room.', 'medium', 'in_progress', 'Room 102', 'Main Building'),
    ('Ceiling light flickers', 'The light above the second row flickers repeatedly.', 'medium', 'open', 'Room 102', 'Main Building'),
    ('Lab sink is leaking', 'Water is leaking from the pipe below the lab sink.', 'critical', 'open', 'Lab 201', 'Science Building'),
    ('Power outlet is damaged', 'The outlet cover is cracked and should be replaced.', 'high', 'resolved', 'Lab 201', 'Science Building'),
    ('Library door sticks', 'The entrance door is difficult to open.', 'low', 'open', 'Library Hall', 'Library'),
    ('Study room screen is blank', 'The shared display shows no signal.', 'medium', 'in_progress', 'Library Hall', 'Library'),
    ('Gym scoreboard is offline', 'The scoreboard does not respond to its controls.', 'high', 'open', 'Gym Court', 'Sports Center'),
    ('Water fountain is not cooling', 'The fountain dispenses water but it is not chilled.', 'low', 'closed', 'Gym Court', 'Sports Center')
) AS seed(title, description, priority, status, room_name, building)
JOIN rooms ON rooms.name = seed.room_name AND rooms.building = seed.building
CROSS JOIN users AS member
CROSS JOIN users AS technician
WHERE member.email = 'member@fixit-campus.test'
  AND technician.email = 'technician@fixit-campus.test';
