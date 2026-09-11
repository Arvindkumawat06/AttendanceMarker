import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import teachersRoutes from './Routes/teachers.route.js';
import { connectDB } from './utils/db.js';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.get('/', (req,res) => {
  res.send("Sri Ganeshay Namah");
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/teachers', teachersRoutes);

connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});