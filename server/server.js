import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";
import connectCloudinary from './configs/cloudinary.js';

import { clerkWebhooks, stripeWebhook } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoute.js';
const app = express();

// -------------------------------
// SECURITY + PARSING MIDDLEWARE
// -------------------------------

// CORS (allow only frontend)
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

app.use(morgan('tiny'));

// Clerk Auth middleware
app.use(clerkMiddleware());

// Normal JSON parsing (must come AFTER clerkMiddleware)
app.use(express.json());



// -------------------------------
// API ROUTES
// -------------------------------
app.get('/',(req,res)=>res.send("API is running..."));
app.post('/clerk', express.json(), clerkWebhooks);
app.use('/api/educator', educatorRouter);
app.use('/api/course',express.json(),courseRouter); // Stripe webhook needs raw body
app.use('/api/user', express.json(), userRouter); // Dynamic import for ES modules
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhook); // Stripe webhook needs raw body
// -------------------------------
// INITIALIZE DATABASE + CLOUDINARY
// -------------------------------
connectDB();
connectCloudinary(); // FIXED — You missed parentheses!

// -------------------------------
// START SERVER
// -------------------------------
const PORT =  5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// -------------------------------
// EXPORT FOR SERVERLESS
// -------------------------------
export default app;
