import { apihealthCheck,  handleOtherMethods   } from '../controllers/apiController.js';
import express from 'express';

const router = express.Router();

router.get('/', apihealthCheck);
router.use('/',  handleOtherMethods );


export default router;

