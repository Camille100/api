import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import equipmentRoute from './routes/equipmentRoute.js';
import dumpRoute from './routes/dumpRoute.js';
import { authenticateUser } from './middlewares/auth.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000",
}));
app.use(cookieParser());

app.use('/auth', authRoute);
app.use('/user', authenticateUser, userRoute);
app.use('/equipment', authenticateUser, equipmentRoute);
app.use('/dump', authenticateUser, dumpRoute);

app.get('/', (req, res) => {
  res.send('SERVER IS RUNNING')
})

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));