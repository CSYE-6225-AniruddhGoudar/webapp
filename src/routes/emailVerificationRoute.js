import express from 'express';
import { account } from '../models/account.js';
import logger from '../util/logger.js';

// Create a router instance
const router = express.Router();

router.get('/emailverification/:verificationtoken', async (req, res, next) => {
 
  const verificationtoken  = req.params.verificationtoken;

  try {
    const user = await account.findOne({ where: { verification_token : verificationtoken} });
    if (user) { 
      const currentWebappTimestamp = Date.now();
      if (currentWebappTimestamp < user.expiration_time) {
        console.log('currentWebappTimestamp '+currentWebappTimestamp);
        console.log('user.expiration_time '+user.expiration_time);
       user.isVerified = true;
         await user.save(); 
        logger.info("User Verified successfully " + user.username);
        return res.status(200).json({ message: 'Email verification successful.' });
      } else {
        
        logger.warn("Email Verification Expired" + user.username);
        return res.status(410).json({ message: 'Email Verification not successfull' });
      }
    } else {
      return res.status(404).json({ message: 'User Not Found' });
    }
   
  } catch (error) {
    logger.error('Error in verifying email', error);
    return next(error);
  }
});

// Export the router
export default router;