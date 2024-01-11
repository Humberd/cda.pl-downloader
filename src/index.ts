import puppeteer from 'puppeteer';
import { execSync } from 'child_process';

// a PATH to a json file with seasons
const PATH = '../pokemon.json';

// time to wait between requests to prevent blocking by the server
const WAIT_TIME_MS = 3000;

interface Season {
  link: string;
  title: string;
}

async function scrapeEpisodeLinks(season: Season): Promise<string[]> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const links: string[] = [];

  let pageUrl = season.link;
  // Extract the domain from the page URL
  const urlObject = new URL(pageUrl);
  const domain = urlObject.origin;

  do {
    await page.goto(pageUrl);
    const episodeLinks = await page.$$eval('.thumb-wrapper-just .list-when-small a.link-title-visit', elems => elems.map(e => e.getAttribute('href')));
    const fullEpisodeLinks = episodeLinks.map(link => `${domain}${link}`);
    links.push(...fullEpisodeLinks);

    const nextPage = await page.$('.paginationControl>a');
    if (nextPage) {
      pageUrl = await nextPage.evaluate(el => el.getAttribute('href'));
    } else {
      break;
    }
  } while (pageUrl);

  await browser.close();
  return links;
}

function download(episodeLink: string, season: Season): void {
  const command = `yt-dlp -P "data/${season.title}"  ${episodeLink}`;
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`Downloaded successfully: ${episodeLink}`);
  } catch (error) {
    console.error(`Error downloading:`, error);
  }
}

async function downloadSeason(season: Season): Promise<void> {
  const episodeLinks = await scrapeEpisodeLinks(season);
  for (const episodeLink of episodeLinks) {
    // to prevent blocking by the server
    await wait(WAIT_TIME_MS);
    download(episodeLink, season);
  }
}

async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readSeasons(path: string): Season[] {
  return require(path);
}

async function main(path: string): Promise<void> {
  for (const season of readSeasons(path)) {
    console.log(`Downloading season: ${season.title}`);
    await downloadSeason(season);
  }
}

main(PATH);
