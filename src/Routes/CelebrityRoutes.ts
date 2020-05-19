import express from 'express';
import { getGuess } from '../Controllers/CelebrityController';

const celebrityRouter = express.Router();

celebrityRouter.get('/getGuess', getGuess);

export default celebrityRouter;
