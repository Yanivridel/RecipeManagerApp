import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// Middleware Configuration
dotenv.config();
app.use(express.json());
app.use(cors( {
    origin: "http://localhost:5173",
    credentials: true
}));

// Database Connection
if (process.env.DB_URI) {
    mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Successfully Connected to DB"))
    .catch((err) => console.error("Connection failed", err));
} else {
    console.error("DB_URI environment variable is not defined");
}

app.get('/', (req: Request, res: Response): void => {
    res.status(200).send({ message: "Hello from the server!" });
});

// Routes
import userRoutes from './routes/userRoutes'
import recipeRoutes from './routes/recipeRoutes'

app.use('/api/users', userRoutes);

app.use('/api/recipes', recipeRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});