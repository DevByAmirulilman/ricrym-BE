import express from 'express'
import { generateTwoFactorQR, login, register, verifyTwoFactor } from '../controllers/auth.js';

const router = express.Router()

router.post('/login', login);
router.post('/register', register)
router.get('/generate-qr/:accountId', generateTwoFactorQR)
router.post('/2fa', verifyTwoFactor);

export default router