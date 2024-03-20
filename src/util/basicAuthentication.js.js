import auth from 'basic-auth';
import bcrypt from 'bcrypt';
import { account } from '../models/account.js';
import logger from '../util/logger.js';

const basicAuth = async (req, res, next) => {
    try {
        const userCredentials = auth(req);

        if (!userCredentials) {
            return unauthorized(res);
        }

        const user = await account.findOne({ where: { username: userCredentials.name } });

        if (!user || !(await isValidPassword(userCredentials.pass, user.password))) {
            return unauthorized(res);
        }

        req.authenticatedUser = user.username;
        next();
        logger.info('Basic Autherization Successfull');
    } catch (error) {
        logger.error('Basic Autherization Failed', error);
        console.error('Error during basic authorization:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const isValidPassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

const unauthorized = (res) => {
    res.set('WWW-Authenticate', 'Basic');
    return res.status(401).send();
};

export { basicAuth };
