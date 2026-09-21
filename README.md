# Splittr Backend

The backend system for **Splittr**, a modern expense split and settlement application.

## Features
- **User Authentication**: Secure JWT-based login and registration using `bcrypt`.
- **Group Management**: Create groups and fetch user lists.
- **Expense Logging**: Add expenses with equal or custom split configurations.
- **Settlement Engine**: An optimized greedy algorithm that calculates the minimal number of transactions required to settle all debts in a group.

## Tech Stack
- **Node.js** & **Express**
- **TypeScript**
- **MongoDB** & **Mongoose**
- **Zod** (Validation)

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in this root directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/splittr
   JWT_SECRET=your_super_secret_jwt_key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment on Render
This backend is fully configured for easy deployment on [Render](https://render.com).

### Render Web Service Setup:
1. Create a new **Web Service** on Render and connect this repository.
2. Set the **Root Directory** to `backend`.
3. Set the **Build Command** to:
   ```bash
   npm install && npm run build
   ```
4. Set the **Start Command** to:
   ```bash
   npm start
   ```
5. In the **Environment Variables** section on Render, make sure to add:
   - `MONGODB_URI` (Your production MongoDB Atlas connection string)
   - `JWT_SECRET` (A strong random secret)
   - *Note: Render provides the `PORT` automatically, so you don't need to specify it.*

Once deployed, update the `baseURL` in your frontend's `src/api/axios.js` to point to your new Render URL!
