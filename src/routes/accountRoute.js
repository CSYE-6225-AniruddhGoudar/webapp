import express from 'express';
import { createAccount, updateAccount, handleUnsupportedMethods, getAccount } from '../controllers/accountController.js';
import { account } from '../models/account.js';
import Joi from 'joi';

const router = express.Router();


// Defining syntax for user creation
const userCreationSchema = Joi.object({
  first_name: Joi.string().trim().required().label('First name'),
  last_name: Joi.string().trim().required().label('Last name'),
  email: Joi.string().trim().email().required().label('Email'),
  password: Joi.string().trim().min(8).required().label('Password')
});

const validateUserCreation = async (req, res, next) => {
  try {
    // Validate request body against Joi schema
    const { error, value } = userCreationSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, ''); // I removed quotes as it was setting extra and was not looking good
      return res.status(400).json({ error: `${errorMessage} ` });
    }

    // Check for duplicate email
    const existingUser = await account.findOne({ where: { email: value.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // If validation passes and no duplicate email, proceed to the next middleware
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
    // Validate request body against Joi schema
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, ''); // Remove quotes
      return res.status(400).json({ error: errorMessage });
    }

    // Check if email is being updated
    if (req.body.email) {
      return res.status(400).json({ error: 'Email cannot be updated' });
    }

    // If validation passes and email is not being updated, proceed to the next middleware
    next();
  } catch (err) {
    console.error('Error while validating user update:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Define route handlers

router.get('/',  getAccount);
router.post('/', validateUserCreation , createAccount);
router.delete('/', handleUnsupportedMethods);
router.put('/', validateUserUpdate, updateAccount);
router.patch('/', handleUnsupportedMethods);
router.patch('/', handleUnsupportedMethods);
router.options('/', handleUnsupportedMethods);
router.head('/', handleUnsupportedMethods);

export default router;
