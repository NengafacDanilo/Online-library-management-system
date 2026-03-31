# Project Structure Guide

## Folder Layout

```
Online Library Management System/
│
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── context/            # Context API state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/                 # Static files
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/                     # Node.js Backend
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Data models
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Custom middleware
│   │   ├── utils/              # Helper functions
│   │   └── server.js           # Main server file
│   ├── package.json
│   └── .env.example
│
├── database/
│   ├── migrations/             # SQL migration scripts
│   └── seeds/                  # Sample data scripts
│
└── README.md
```

## Next Steps

1. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Database**
   - Create a PostgreSQL database
   - Run migrations from `database/migrations/`
   - Run seeds from `database/seeds/` for sample data

4. **Configure Environment Variables**
   - Copy `.env.example` to `.env` in both frontend and backend
   - Update with your actual database credentials

5. **Start the Application**
   - Backend: `npm run dev` in the backend folder
   - Frontend: `npm run dev` in the frontend folder

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcryptjs
