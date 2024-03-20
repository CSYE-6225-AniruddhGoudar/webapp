import express from 'express';
import { basicAuth } from './util/basicAuthentication.js.js';
import apiRouter from './routes/apiRouter.js';
import accountRouter from './routes/accountRoute.js';
import { sequelize } from './util/database.js';
import { HttpError } from './models/errorHandler.js';
import logger from './util/logger.js';


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Sync database with model
sequelize.sync()
  .then(() => {
    logger.info('Database is in syn with the model');
    console.log('Database is in syn with the model.');
  })
  .catch((err) => {
    logger.error('Error in syncing the database', err);
    console.error('Error in syncing the database:', err);
  });

// Routes
app.use('/healthz', apiRouter);
app.use('/v1/user', accountRouter);
app.use('/v1/user/self', basicAuth, accountRouter);

// Error handling for unknown routes
app.use((req, res, next) => {
  const error = new HttpError('This route is not found.', 404);
  next(error);
});

// Custom error handling middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 400);
  res.json({ message: error.message || 'Bad Request' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export {app};