import express from 'express'
import { getAllScores } from '../controllers/scores.js'

const router = express.Router()

router.get('/get-scores', getAllScores)

export default router