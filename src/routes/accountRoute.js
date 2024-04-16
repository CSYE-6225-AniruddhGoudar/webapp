import express from 'express';
import { createAccount, updateAccount, handleUnsupportedMethods, getAccount } from '../controllers/accountController.js';
import { account } from '../models/account.js';
import Joi from 'joi';
import logger from '../util/logger.js';

const router = express.Router();

const userCreationSchema = Joi.object({
  first_name: Joi.string().trim().required().label('First name'),
  last_name: Joi.string().trim().required().label('Last name'),
  username: Joi.string().trim().email().required().label('username'),
  password: Joi.string().trim().min(8).required().label('Password')
});

const validateUserCreation = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      logger.error('Basic Authorization is enabled');
      return res.status(400).json({ error: 'Basic Authorization is enabled' });
    }
    const { error, value } = userCreationSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, ''); // I removed quotes as it was setting extra and was not looking good
      return res.status(400).json({ error: `${errorMessage} ` });
    }

    const existingUser = await account.findOne({ where: { username: value.username } });
    if (existingUser) {
      logger.warn('username is already in use');
      return res.status(400).json({ error: 'username is already in use' });
    }
   
    next();
  } catch (err) {
    logger.error('Error while validating user creation', err);
    console.error('Error while validating user creation:', err);
    res.status(503).json({ error: 'No DB' });
  }
};


const userUpdateSchema = Joi.object({
  first_name: Joi.string().trim().optional().label('First name'),
  last_name: Joi.string().trim().optional().label('Last name'),
  username: Joi.string().trim().email().optional().label('username').forbidden(),
  password: Joi.string().trim().min(8).optional().label('Password')
}).or('first_name', 'last_name', 'password'); // At least one field should be present for update

const validateUserUpdate = async (req, res, next) => {
  try {
    
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, ''); // Remove quotes
      return res.status(400).json({ error: errorMessage });
    }

    if (req.body.username) {
      logger.error('username cannot be updated');
      return res.status(400).json({ error: 'username cannot be updated' });
    }

    next();
  } catch (err) {
    logger.error('Error while validating user update', err);
    console.error('Error while validating user update:', err);
    res.status(503).json({ error: 'No DB' });
  }
};

const validateGetUser = (req, res, next) => {
  if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0 
    || req.headers['content-length'] > 0 || req.params[0] || req.url.includes('?') || req.originalUrl !== '/v2/user/self' ) {
      logger.debug('Something wrong in query/param/body');
        res.status(400).json();
    } else {
    next();
  }
};

const putValidationEndpoint = (req, res, next) => {
  const { body, query, params, url, originalUrl, headers } = req;

  if (Object.keys(body).length === 0 && body.constructor === Object ||
      Object.keys(query).length > 0 || Object.keys(params).length > 0 ||
      params[0] || url.includes('?') || originalUrl !== '/v2/user/self' ||
      headers['content-length'] === '0') {
        logger.debug('Something wrong in query/param/body');
      return res.status(400).json();
  }
  next();
};

// Define route handlers

router.get('/',validateGetUser,  getAccount);
router.post('/', validateUserCreation , createAccount);
router.delete('/', handleUnsupportedMethods);
router.put('/', putValidationEndpoint, validateUserUpdate, updateAccount);
router.patch('/', handleUnsupportedMethods);
router.patch('/', handleUnsupportedMethods);
router.options('/', handleUnsupportedMethods);
router.head('/', handleUnsupportedMethods);

export default router;
