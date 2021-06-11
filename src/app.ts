import express from 'express';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

// Routes
import userRoutes from './routes/user.routes';
import codesRoutes from './routes/codes.routes';
import loginRoutes from './routes/login.routes';
import passwordRoutes from './routes/password.routes';

// Database
import './database';

// Settings
const app = express();
app.use(morgan('dev'));
app.set('port', process.env.PORT || 3001);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Routes usage
app.use('/api/code', codesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/password', passwordRoutes);

export default app;
