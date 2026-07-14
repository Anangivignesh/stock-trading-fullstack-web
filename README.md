# SB Stocks — Enterprise MERN Stock Trading Simulator

SB Stocks is a full-stack, enterprise-grade paper trading simulation web application designed for stock market enthusiasts to practice their trading strategies without real financial risk. Powered by a Node.js/Express.js backend, MongoDB, and a React frontend.

---

## Key Features

1. **User Registration & JWT Authentication**: Secure signup and login with password hashing (`bcryptjs`) and state persistence.
2. **Virtual Cash Balance**: New users are initialized with a simulated `$100,000.00` virtual balance.
3. **Simulated Live Market Data**:
   - Seeded with 12 major US stock listings (AAPL, NVDA, TSLA, MSFT, etc.).
   - Background seeder service shifts prices dynamically every 15 seconds by up to `±1.5%`.
4. **Transaction & Holding Ledger**:
   - Buy/Sell logic with real-time balance checks (prevents over-drafting and selling unowned assets).
   - Dynamically calculates average costs for ticker holdings.
   - Audited logs tracked under the MERN `transactions` collection.
5. **Watchlist Tracking**: Custom watchlist management saving watched tickers.

---

## Tech Stack
- **Frontend**: React, TanStack Start, TanStack Query, TailwindCSS, Axios
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, Helmet, CORS, Morgan
- **Database**: MongoDB (Local or In-Memory fallback for local development)

---

## Project Structure

```
pocket-port-sim/
│
├── server/
│   ├── config/             # MongoDB database configuration
│   ├── controllers/        # Express handlers (user, order, stock, etc.)
│   ├── middleware/         # Auth verification, role checks, error boundaries
│   ├── models/             # Mongoose schemas (user, stock, portfolio, etc.)
│   ├── routes/             # REST routing endpoints
│   ├── services/           # Background simulator and market listing services
│   └── index.js            # Server entry point
│
├── client/
│   ├── src/
│   │   ├── components/     # Reusable layout and trade modal components
│   │   ├── context/        # GeneralContext global state
│   │   ├── pages/          # Restructured Dashboard, Portfolio, and Ledger views
│   │   ├── services/       # axiosInstance API client
│   │   ├── routes/         # TanStack file-based routes
│   │   └── lib/            # Session, authentication, and mock helpers
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017`

### Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/sb-stocks
   JWT_SECRET=supersecretkey_for_jwt_auth
   ```
4. Start the server:
   ```bash
   node index.js
   ```

### Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.
