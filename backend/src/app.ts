import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes';
import { sweetsRouter } from './routes/sweets.routes';
import { errorHandler } from './middleware/error';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/sweets', sweetsRouter);

app.use(errorHandler);

export { app };