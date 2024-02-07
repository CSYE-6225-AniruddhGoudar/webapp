import express from 'express';
import { validationResult, check } from 'express-validator';
import { HttpError } from '../models/errorHandler.js';
import { account } from '../models/account.js';
import bcrypt from 'bcrypt';


const createAccount = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError(errors.array()[0].msg, 422);
        }

        const { first_name, last_name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const createdAccount = await account.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            id: createdAccount.id,
            first_name: createdAccount.first_name,
            last_name: createdAccount.last_name,
            email: createdAccount.email,
            account_created: createdAccount.account_created,
            account_updated: createdAccount.account_updated,
        });
    } catch (error) {
        next(error);
    }
};

const updateAccount = async (req, res, next) => {
    try {
        const { first_name, last_name, password } = req.body;
        const authUser = req.authenticatedUser;

        const user = await account.findOne({ where: { email: authUser } });
        if (!user) {
            throw new HttpError('User not found', 404);
        }
        
        if (req.body.email) {
            throw new HttpError('Cannot update email', 400);
        }

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.status(201).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            account_created: user.account_created,
            account_updated: user.account_updated,
        });
    } catch (error) {
        next(error);
    }
};

const getAccount = async (req, res, next) => {
    try {
        const authenticatedUser = req.authenticatedUser;
        const user = await account.findOne({ where: { email: authenticatedUser } });
        
        if (!user) {
            throw new HttpError('User not found', 404);
        }

        res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            account_created: user.account_created,
            account_updated: user.account_updated,
        });
    } catch (error) {
        next(error);
    }
};

const handleUnsupportedMethods = (req, res, next) => {
    res.status(405).send();
};

export { createAccount, updateAccount, handleUnsupportedMethods, getAccount };
