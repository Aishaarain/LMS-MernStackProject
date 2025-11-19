// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import morgan from "morgan";
// import bodyParser from "body-parser";
// import { clerkMiddleware } from "@clerk/express";

// import connectDB from "./configs/db.js";
// import connectCloudinary from './configs/cloudinary.js';
// import { clerkWebhooks, stripeWebhook } from './controllers/webhooks.js';
// import educatorRouter from './routes/educatorRoutes.js';
// import courseRouter from './routes/courseRoutes.js';
// import userRouter from './routes/userRoute.js';
// import newsletterRoutes from "./routes/newsletterRoute.js";

// const app = express();
// app.use(morgan('tiny'));

// app.use(clerkMiddleware());
// app.use(express.json());
// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.post('/clerk', bodyParser.raw({ type: "application/json" }), clerkWebhooks);
// app.post('/stripe', express.json({type: 'application/json'}), stripeWebhook);
// app.use('/api/educator', educatorRouter);
// app.use('/api/course', courseRouter);
// app.use('/api/user', userRouter);
// app.use("/api/newsletter", newsletterRoutes);

// const PORT = process.env.PORT || 5000;

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     connectCloudinary;
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// });


import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import morgan from "morgan";
import bodyParser from "body-parser";
import { clerkMiddleware } from "@clerk/express";
// import helmet from "helmet";
// import rateLimit from 'express-rate-limit';

import connectDB from "./configs/db.js";
import connectCloudinary from './configs/cloudinary.js';

import { clerkWebhooks, stripeWebhook } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoute.js';
import newsletterRoutes from "./routes/newsletterRoute.js";

const app = express();

// -------------------------------
// SECURITY MIDDLEWARE
// -------------------------------


// Allow only your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// -------------------------------
app.use(morgan('tiny'));
app.use(clerkMiddleware());

// For normal JSON endpoints
app.use(express.json());

// -------------------------------
// ROUTES
// -------------------------------
app.get('/', (req, res) => {
  res.json({ message: "API is running securely" });
});

// Raw body for webhooks (required)
app.post('/clerk', bodyParser.raw({ type: "application/json" }), clerkWebhooks);
app.post('/stripe', bodyParser.raw({ type: 'application/json' }), stripeWebhook);

app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);
app.use('/api/newsletter', newsletterRoutes);

// -------------------------------
// DATABASE + CLOUDINARY
// -------------------------------
connectDB();
connectCloudinary;

// -------------------------------
// EXPORT FOR SERVERLESS (VERCEL)
// -------------------------------
export default app;
