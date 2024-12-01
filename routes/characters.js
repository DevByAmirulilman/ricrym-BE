import express from 'express'
import { getAllCharacters, getCharacterById } from '../controllers/characters.js'


const router = express.Router()

router.get('/all-characters',getAllCharacters)
router.get('/characters/:characterId', getCharacterById);

export default router