import { Request, Response } from 'express';
import Scraper from '../../Utils/scraper';
import Guess from '../Models/Guess';

async function getGuess(req: Request, res: Response): Promise<Response> {
  console.time('GetCeleb');
  const scraper = new Scraper();
  const celebs = await Promise.all([scraper.getCelebrity(), scraper.getCelebrity()]);
  console.timeEnd('GetCeleb');

  try {
    const guess: Guess = {
      firstCelebrity: celebs[0],
      secondCelebrity: celebs[1],
    };

    if (guess.firstCelebrity.netWorthInNumbers > guess.secondCelebrity.netWorthInNumbers) {
      guess.firstCelebrity.winner = true;
      guess.secondCelebrity.winner = false;
    } else {
      guess.firstCelebrity.winner = false;
      guess.secondCelebrity.winner = true;
    }

    return res.status(200).json(guess);
  } catch (error) {
    return res.status(500).json('Internal server error');
  }
}

export { getGuess };
