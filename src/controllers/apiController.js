import { sequelize } from '../util/database.js';
import logger from '../util/logger.js';

const apihealthCheck = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-Store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Content-Type', 'application/json');
    if (Object.values(req.query).length || Object.values(req.params).length || Object.values(req.body).length || req.headers['content-length'] || req.url.includes('?') ){
      res.status(400).json(); // Bad Request
      return;
    }
    try {
        await sequelize.authenticate();
        res.status(200).send();
        logger.info('API health check: Authentication Successful');
    } catch(error) {
        logger.error('API health check: Authentication Failed', error);
        res.status(503).send();
    }
};

const handleOtherMethods = (req, res) => {
    logger.warn('Unsupported method called:', req.method);
    res.status(405).send();
};

export { apihealthCheck, handleOtherMethods };
