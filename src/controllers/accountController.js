import express from 'express';
import { validationResult, check } from 'express-validator';
import { HttpError } from '../models/errorHandler.js';
import { account } from '../models/account.js';
import bcrypt from 'bcrypt';
import logger from '../util/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { PubSub } from '@google-cloud/pubsub';

const topicName = process.env.TOPIC;
//process.env.GOOGLE_APPLICATION_CREDENTIALS = '/Users/anirudhgoudar/Desktop/Cloud/WebappInt/webapp/emerald-trilogy-411720-70e2ecefe45d.json';

const pubsubmodel = new PubSub();

const createAccount = async (req, res, next) => {
    let testCondition;
    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
    if(process.env.NODE_ENV === 'test'){
        testCondition = true;
    }
    console.log('testCondition ',testCondition);

    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('testCondition before setting:', testCondition);

const verified = testCondition ? true :false;
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
            isVerified: verified
        });

        const verificationtoken = uuidv4();
let message;
        if (!testCondition && createdAccount.username) {
           
            message = {
                email: createdAccount.username,
                verificationtoken : verificationtoken
            };
           
            const dataBuffer = Buffer.from(JSON.stringify(message));
            console.log('dataBuffer before publishing: ', dataBuffer); 
            try{
                pubsubmodel.topic(topicName).publish(dataBuffer);
                const userEmail = await account.findOne({ where: { username: createdAccount.username } });
                console.log('Message published successfully');
            logger.info('Message published successfully to Pub/Sub ');
            }catch(error){
                console.error('Error publishing message to Pub/Sub ', error);
                logger.error('Error publishing message to Pub/Sub ', error);
            }
        }

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
        logger.error('Account Creation Unsuccessful', error);
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
        if (!user.isVerified) {
            logger.error('User verification not successful');
            throw new HttpError('User verification not successful', 403);
            return;
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
        logger.info('Account Update Successful');
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
        if (!user.isVerified) {
            logger.error('User verification not successful');
             throw new HttpError('User verification not successful', 403);
             return;
        }

        res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.account_created,
            account_updated: user.account_updated,
        });
        logger.info('Get Account Request Successful');
    } catch (error) {
        logger.error('Get Account Request Unsuccessful', error);
        next(error);
    }
};

const handleUnsupportedMethods = (req, res, next) => {
    logger.warn('Unsupported method called:', req.method);
    res.status(405).send();
};

export { createAccount, updateAccount, handleUnsupportedMethods, getAccount };
