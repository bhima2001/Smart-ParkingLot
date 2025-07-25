import pool from './config/db.js';
import { seedSQL } from './config/seedingData.js';

const seed = async () => {
  const client = await pool.connect();
  try {
    await pool.query(`
            DROP TABLE IF EXISTS reservations, parking_spots, parking_lots, users CASCADE;
          
            CREATE TABLE users (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              email TEXT UNIQUE NOT NULL,
              phoneNumber TEXT,
              password TEXT NOT NULL,
              deleted_at TIMESTAMP DEFAULT NULL
            );
          
            CREATE TABLE parking_lots (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              location TEXT NOT NULL,
              deleted_at TIMESTAMP DEFAULT NULL
            );
          
            CREATE TABLE parking_spots (
              id SERIAL PRIMARY KEY,
              parking_lot_id INTEGER NOT NULL REFERENCES parking_lots(id) ON DELETE CASCADE,
              spot_type TEXT NOT NULL CHECK (spot_type IN ('compact', 'ev', 'large')),
              spot_number TEXT NOT NULL,
              deleted_at TIMESTAMP DEFAULT NULL,
              UNIQUE (parking_lot_id, spot_number)
            );
          
            CREATE TABLE reservations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                parking_spot_id INTEGER NOT NULL REFERENCES parking_spots(id) ON DELETE CASCADE,
                start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                end_time TIMESTAMP WITH TIME ZONE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT NOT NULL CHECK (status IN ('reserved', 'cancelled')),
                deleted_at TIMESTAMP DEFAULT NULL,
                CHECK (start_time < end_time)
              );
            `);
    await pool.query(seedSQL);
    //CREATE INDEX idx_reservations_spot_time ON reservations (parking_spot_id, start_time, end_time);
    //CREATE INDEX idx_reservations_user_time ON reservations (user_id, start_time);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
  }
};

seed();