import express from 'express';
import { createMeme, getLeaderboard, getMemes, voteMeme } from '../controllers/memeController.js';
import { generateCaption } from '../controllers/aiController.js';

const router = express.Router();

router.post('/', createMeme);
router.get('/all', getMemes);
router.post('/:id/vote', voteMeme);
router.get('/leaderboard', getLeaderboard);
router.post('/:id/caption', generateCaption);

export default router;
