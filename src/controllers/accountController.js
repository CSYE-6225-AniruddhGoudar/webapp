import express from 'express';
import { validationResult, check } from 'express-validator';
import { HttpError } from '../models/errorHandler.js';
import { account } from '../models/account.js';
import bcrypt from 'bcrypt';
import logger from '../util/logger.js';


const createAccount = async (req, res, next) => {
    try {
        logger.debug('Request body:', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError(errors.array()[0].msg, 400);
        }

        const { first_name, last_name, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const createdAccount = await account.create({
            first_name,
            last_name,
            username,
            password: hashedPassword,
        });

        res.status(201).json({
            id: createdAccount.id,
            first_name: createdAccount.first_name,
            last_name: createdAccount.last_name,
            username: createdAccount.username,
            account_created: createdAccount.account_created,
            account_updated: createdAccount.account_updated,
        });
        logger.info('Created Account Successfully');
    } catch (error) {
        logger.error('Account Creation Unsuccessfull');
        next(error);
    }
};

const updateAccount = async (req, res, next) => {
    try {
        const { first_name, last_name, password } = req.body;
        const authUser = req.authenticatedUser;

        const user = await account.findOne({ where: { username: authUser } });
        if (!user) {
            logger.error('User is not found');
            throw new HttpError('User is not found', 404);
        }
        
        if (req.body.username) {
            logger.error('Cannot update username');
            throw new HttpError('Cannot update username', 400);
        }
        if (req.body.account_created) {
            logger.error('Cannot update account_created');
            throw new HttpError('Cannot update account_created', 400);
        }
        if (req.body.account_updated) {
            logger.error('Cannot update account_updated');
            throw new HttpError('Cannot update account_updated', 400);
        }

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.status(204).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.account_created,
            account_updated: user.account_updated,
        });
        logger.info('Account Update Successfull');
    } catch (error) {
        logger.error('Account Update Unsuccessful', error);
        next(error);
    }
};

const getAccount = async (req, res, next) => {
    try {
        const authenticatedUser = req.authenticatedUser;
        const user = await account.findOne({ where: { username: authenticatedUser } });
        
        if (!user) {
            logger.error('User is not found');
            throw new HttpError('User is not found', 404);
        }

        res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.account_created,
            account_updated: user.account_updated,
        });
        logger.info('Get Account Request Successfull');
    } catch (error) {
        logger.error('Get Account Request Unsuccessful', error);
        next(error);
    }
};

const handleUnsupportedMethods = (req, res, next) => {
    logger.trace('Unsupported method called:', req.method);
    res.status(405).send();
};

export { createAccount, updateAccount, handleUnsupportedMethods, getAccount };
