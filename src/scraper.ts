import axios from 'axios';
import cheerio from 'cheerio';
import Celebrity from './Models/Celebrity';
import puppeteer from 'puppeteer';

class Scraper {
  private netWorthUrl: string;
  private celebrityUrl: string;

  constructor() {
    this.netWorthUrl = process.env.NET_WORTH_URL as string;
    this.celebrityUrl = process.env.CELEBRITY_URL as string;
  }

  async getCelebrity(): Promise<Celebrity> {
    const celebrity = await this.retry(5, 100, false);
    return celebrity;
  }

  private async retry(retriesLeft: number, interval: number, exponential: boolean): Promise<Celebrity> {
    try {
      const celebName = await this.scrapeRandomCelebrityName();
      const celeb = await this.scrapeNetWorth(celebName);
      return celeb;
    } catch (error) {
      console.log(error);
      if (retriesLeft) {
        await new Promise((r) => setTimeout(r, interval));
        return this.retry(retriesLeft - 1, exponential ? interval * 2 : interval, exponential);
      } else throw new Error(`Max retries reached for function ${this.getCelebrity.name}`);
    }
  }

  private async scrapeNetWorth(actor: string): Promise<Celebrity> {
    let celebrity: Celebrity = {
      name: '',
      netWorthInPlainText: '',
      netWorthInNumbers: 0,
      imageUrl: '',
    };

    const result = await axios.get(this.netWorthUrl + actor.replace(/\s/g, '-') + '-net-worth');
    const $ = cheerio.load(result.data);

    celebrity = {
      name: $('.celeb_stats_table_header').text(),
      netWorthInPlainText: $('.value').first().text(),
      netWorthInNumbers: this.parseNetWorthString($('.value').first().text().split(' ')),
      imageUrl: '',
    };

    return celebrity;
  }

  private async scrapeRandomCelebrityName(): Promise<string> {
    let celebrityName = '';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.celebrityUrl);
    await page.waitForSelector('.rand_medium', { timeout: 1000 });
    const body = await page.evaluate(() => {
      return {
        outerHTML: document.body.outerHTML,
      };
    });

    const $ = cheerio.load(body.outerHTML);
    celebrityName = $('.rand_medium').text();

    return celebrityName;
  }

  private parseNetWorthString(netWorthString: string[]): number {
    let networth = parseInt(netWorthString[0].replace('$', ''));
    if (netWorthString[1].toLowerCase() === 'billion') {
      networth = networth * 1000000000;
    } else {
      networth = networth * 1000000;
    }

    return networth;
  }
}

export default Scraper;
