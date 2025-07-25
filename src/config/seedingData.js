export const seedSQL = `

-- USERS
INSERT INTO users (id, name, email, phoneNumber, password) VALUES
  (10, 'Alice Admin', 'alice@example.com', '1234567890', 'hashedpassword1'),
  (11, 'Bob User', 'bob@example.com', '2345678901', 'hashedpassword2'),
  (12, 'Charlie Disabled', 'charlie@example.com', '3456789012', 'hashedpassword3'),
  (13, 'Dana Staff', 'dana@example.com', '4567890123', 'hashedpassword4')
ON CONFLICT (id) DO NOTHING;

-- PARKING LOTS
INSERT INTO parking_lots (id, name, location) VALUES
  (10, 'Downtown Lot', '123 Main St'),
  (11, 'Airport Lot', 'Airport Rd')
ON CONFLICT (id) DO NOTHING;

-- PARKING SPOTS
-- spot_type: 'compact', 'ev', 'large'
INSERT INTO parking_spots (id, parking_lot_id, spot_type, spot_number) VALUES
  (10, 10, 'compact', 'A1'),
  (11, 10, 'compact', 'A2'),
  (12, 10, 'ev', 'B1'),
  (13, 10, 'large', 'C1'),
  (14, 11, 'compact', 'D1'),
  (15, 11, 'ev', 'E1'),
  (16, 11, 'large', 'F1')
ON CONFLICT (id) DO NOTHING;

-- RESERVATIONS
-- status: 'reserved', 'cancelled'
INSERT INTO reservations (id, user_id, parking_spot_id, start_time, end_time, status) VALUES
  -- Active reservation for Bob User in Downtown Lot, compact spot (now + 0.5h to now + 2.5h)
  (10, 11, 10, (NOW() + INTERVAL '0.5 hour')::timestamp with time zone, (NOW() + INTERVAL '2.5 hour')::timestamp with time zone, 'reserved'),
  -- Overlapping reservation for Bob User in same spot (starts 2h after now, overlaps by 0.5h)
  (11, 11, 10, (NOW() + INTERVAL '2 hour')::timestamp with time zone, (NOW() + INTERVAL '4 hour')::timestamp with time zone, 'reserved'),
  -- Cancelled reservation for Charlie Disabled in EV spot (starts 4h from now)
  (12, 12, 12, (NOW() + INTERVAL '4 hour')::timestamp with time zone, (NOW() + INTERVAL '6 hour')::timestamp with time zone, 'cancelled'),
  -- Reservation in the past for Dana Staff in compact spot (starts 2h ago)
  (13, 13, 11, (NOW() - INTERVAL '2 hour')::timestamp with time zone, (NOW() - INTERVAL '1 hour')::timestamp with time zone, 'reserved'),
  -- Future reservation for Bob User in large spot at Airport Lot (starts 8h from now)
  (14, 11, 16, (NOW() + INTERVAL '8 hour')::timestamp with time zone, (NOW() + INTERVAL '10 hour')::timestamp with time zone, 'reserved'),
  -- Reservation for Bob User in EV spot at Airport Lot (starts 12h from now)
  (15, 11, 15, (NOW() + INTERVAL '12 hour')::timestamp with time zone, (NOW() + INTERVAL '13 hour')::timestamp with time zone, 'reserved'),
  -- Reservation for Charlie Disabled in large spot at Downtown Lot (starts 16h from now)
  (16, 12, 13, (NOW() + INTERVAL '16 hour')::timestamp with time zone, (NOW() + INTERVAL '17 hour')::timestamp with time zone, 'reserved')
ON CONFLICT (id) DO NOTHING;

`;
