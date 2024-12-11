import express from 'express'
import { getAccountById, getAllAccountsByCharacter, getAllAccountsScoreboard } from '../controllers/accounts.js'
import { authenticateSession } from '../middleware/auth.js';

const router = express.Router()

router.get('/all-accounts-by-character', authenticateSession,getAllAccountsByCharacter)
router.get('/all-accounts-scoreboard', authenticateSession,getAllAccountsScoreboard)
router.post('/account/:accountId', getAccountById);


export default router