import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import routes from './routes';
import notFound from './middlewares/notFound';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ message: 'OK' }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
