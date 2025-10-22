import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from '../routes/index';
import { errorHandler, notFound } from '../app/middlewares/global/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swagger';
import { securityHeaders, corsOptions } from './security';
import { apiLimiter } from './rateLimiting';

dotenv.config();
const app = express();

// Security middleware (must be first)
app.use(securityHeaders);
app.use(corsOptions);

// General middleware
app.use(morgan('dev'));
app.use(cookieParser()); // Required for reading cookies
app.use(apiLimiter); // General API rate limiting
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

//routes
app.use('/api', routes);

//middleware global error handler
app.use(notFound)
app.use(errorHandler);

export default app;