import express from 'express'
import { getAccountById, getAllAccounts } from '../controllers/accounts.js'

const router = express.Router()

router.get('/all-accounts', getAllAccounts)
router.post('/account/:accountId', getAccountById);


export default router