import express, { Express, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// connection to DB and cloudinary
import { connectDB } from './config/database';
import { cloudinaryConnect } from './config/cloudinary';

// routes - using JavaScript versions from parent directory (not compiled by tsc)
// After compilation, these resolve to ../routes/ which is outside dist/
const userRoutes = require(path.join(__dirname, '../routes/user'));
const profileRoutes = require(path.join(__dirname, '../routes/profile'));
const paymentRoutes = require(path.join(__dirname, '../routes/payments'));
const courseRoutes = require(path.join(__dirname, '../routes/course'));

// Log to verify routes are loaded
console.log('[Server] Routes loaded:', {
  userRoutes: typeof userRoutes,
  profileRoutes: typeof profileRoutes,
  paymentRoutes: typeof paymentRoutes,
  courseRoutes: typeof courseRoutes,
});

dotenv.config();

const app: Express = express();

// middleware 
app.use(express.json()); // to parse json body
app.use(cookieParser());
app.use(
    cors({
        origin: "*",
        credentials: true
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp'
    })
);

const PORT: string | number = process.env.PORT || 5000;

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server Started on PORT ${PORT}`);
});

// connections
connectDB();
cloudinaryConnect();

// mount route
console.log('[Server] Mounting routes at /api/v1/*');
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);
console.log('[Server] Routes mounted successfully');

// Default Route
app.get('/', (req: Request, res: Response) => {
    res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
});
