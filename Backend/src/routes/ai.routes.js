import { Router } from 'express';
import { textToSpeech } from '../controllers/ai.controller.js';

const router = Router();

router.post('/tts', textToSpeech);

export default router;
