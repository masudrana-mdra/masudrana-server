# Portfolio Server 🛡️

The backend API for Masud Rana's Portfolio Website built using **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

## 📁 Project Structure

```
server/
├── config/           # Database and application configuration
├── controllers/      # Route controllers (logic handling)
├── middleware/       # Authentication, authorization, and error handling middleware
├── models/           # Mongoose schemas/models (User, Project, Blog, etc.)
├── routes/           # Express router endpoints
├── scripts/          # Database seeding scripts
└── server.js         # Application entry point
```

## 🛠️ Local Setup & Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_uri
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   BETTER_AUTH_SECRET=your_better_auth_secret
   JWT_SECRET=your_jwt_secret
   ```

4. Seed the database (optional):
   ```bash
   npm run seed
   ```

5. Start the development server (uses `nodemon` for auto-reloading):
   ```bash
   npm run dev
   ```

## 🚀 Scripts

- `npm run dev`: Start the Express server with nodemon auto-restart.
- `npm run start`: Run the server in production mode with native Node.js.
- `npm run seed`: Populate database with seed portfolio data.

## ☁️ Deployment Guidelines

The server can be deployed to Render, Railway, Heroku, or a VPS:
1. Push the `server` repository (`Portfolio-Server`) to GitHub.
2. Link the repository to your hosting service (e.g., Render).
3. Set the build/start commands:
   - Build: `npm install`
   - Start: `npm run start`
4. Define all environment variables listed in the environment setup section.
