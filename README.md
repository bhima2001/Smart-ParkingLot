# Smart-ParkingLot

## Setup Instructions (Docker Way)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartparkinglot
   ```

2. **Create a `.env` file**
   - create a new `.env` file with the required environment variables (e.g., database credentials, JWT secret, etc.).

3. **Start the application using Docker Compose**
   ```bash
   docker-compose up
   ```

   This command will build and start all necessary containers (e.g., Node.js app, PostgreSQL database).

4. **Access the application**
   - The backend server will typically be available at `http://localhost:3000` (or the port specified in your configuration).
   - The database will be available at the port specified in your `docker-compose.yml`.