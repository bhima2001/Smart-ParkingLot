# Smart-ParkingLot

## Setup Instructions (Docker Way)

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhima2001/Smart-ParkingLot
   cd smartparkinglot
   ```

2. **Start the application using Docker Compose**
   ```bash
   docker-compose up
   ```

   This command will build and start all necessary containers (e.g., Node.js app, PostgreSQL database).

3. **Access the application**
   - The backend server will typically be available at `http://localhost:3000` (or the port specified in your configuration).
   - The database will be available at the port specified in your `docker-compose.yml`.


   ## Entity Relationship (ER) Diagram

   Below is a textual ER diagram representation for a typical Smart Parking Lot system. If you are using the default schema from the project, your database likely includes tables for users, parking lots, parking spots, vehicles, and reservations.

   ```
   [User] 
      (id) PK
      (name)
      (email)
      (password)
         |
         |<-----------------------------+
         |                              |
         v                              |
   [Vehicle]                            |
      (id) PK                           |
      (user_id) FK ---------------------+
      (license_plate)
      (type)
         |
         |<-----------------------------+
         |                              |
         v                              |
   [Reservation]                        |
      (id) PK                           |
      (user_id) FK ---------------------+
      (vehicle_id) FK ------------------+
      (parking_spot_id) FK -------------+
      (start_time)
      (end_time)
      (status)
         |
         v
   [ParkingSpot]
      (id) PK
      (parking_lot_id) FK --------------+
      (spot_number)
      (status)
         |
         v
   [ParkingLot]
      (id) PK
      (name)
      (location)
      (capacity)
   ```

   ```
   Table User {
     id int [pk, increment]
     name varchar
     email varchar
     password varchar
   }

   Table Vehicle {
     id int [pk, increment]
     user_id int [ref: > User.id]
     license_plate varchar
     type varchar
   }

   Table ParkingLot {
     id int [pk, increment]
     name varchar
     location varchar
     capacity int
   }

   Table ParkingSpot {
     id int [pk, increment]
     parking_lot_id int [ref: > ParkingLot.id]
     spot_number varchar
     status varchar
   }

   Table Reservation {
     id int [pk, increment]
     user_id int [ref: > User.id]
     vehicle_id int [ref: > Vehicle.id]
     parking_spot_id int [ref: > ParkingSpot.id]
     start_time datetime
     end_time datetime
     status varchar
   }
   ```