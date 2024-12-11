import express from 'express'
import { getAllCharacters, getCharacterById } from '../controllers/characters.js'
import { authenticateSession } from '../middleware/auth.js';


const router = express.Router()

router.get('/all-characters',getAllCharacters)
router.get('/characters/:characterId', getCharacterById);

export default router