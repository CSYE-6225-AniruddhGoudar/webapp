import express from 'express';
import { createAccount, updateAccount, handleUnsupportedMethods, getAccount } from '../controllers/accountController.js';
import { account } from '../models/account.js';
import Joi from 'joi';

const router = express.Router();

const userCreationSchema = Joi.object({
  first_name: Joi.string().trim().required().label('First name'),
  last_name: Joi.string().trim().required().label('Last name'),
  email: Joi.string().trim().email().required().label('Email'),
  password: Joi.string().trim().min(8).required().label('Password')
});

const validateUserCreation = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      return res.status(400).json({ error: 'Basic Authorization is enabled' });
    }
    const { error, value } = userCreationSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, ''); // I removed quotes as it was setting extra and was not looking good
      return res.status(400).json({ error: `${errorMessage} ` });
    }

    const existingUser = await account.findOne({ where: { email: value.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

   
    next();
  } catch (err) {
    console.error('Error while validating user creation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//PUT
const userUpdateSchema = Joi.object({
  first_name: Joi.string().trim().optional().label('First name'),
  last_name: Joi.string().trim().optional().label('Last name'),
  email: Joi.string().trim().email().optional().label('Email').forbidden(),
  password: Joi.string().trim().min(8).optional().label('Password')
}).or('first_name', 'last_name', 'password'); // At least one field should be present for update

const validateUserUpdate = async (req, res, next) => {
  try {
    
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, ''); // Remove quotes
      return res.status(400).json({ error: errorMessage });
    }

    if (req.body.email) {
      return res.status(400).json({ error: 'Email cannot be updated' });
    }

    next();
  } catch (err) {
    console.error('Error while validating user update:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const validateGetUser = (req, res, next) => {
  if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0 
    || req.headers['content-length'] > 0 || req.params[0] || req.url.includes('?') || req.originalUrl !== '/v1/user/self' ) {
        res.status(400).json();
    } else {
    next();
  }
};

// Define route handlers

router.get('/',validateGetUser,  getAccount);
router.post('/', validateUserCreation , createAccount);
router.delete('/', handleUnsupportedMethods);
router.put('/', validateUserUpdate, updateAccount);
router.patch('/', handleUnsupportedMethods);
router.patch('/', handleUnsupportedMethods);
router.options('/', handleUnsupportedMethods);
router.head('/', handleUnsupportedMethods);

export default router;
