import puppeteer from 'puppeteer';
import { execSync } from 'child_process';

const seasons: Season[] = [
  {
    "link": "https://www.cda.pl/Rakso_98/folder/35223597",
    "title": "Pokemon Filmy"
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223606',
    'title': 'Pokemon Sezon 01 (Indigo League)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223618',
    'title': 'Pokemon Sezon 02 (Adventures on the Orange Islands)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223624',
    'title': 'Pokemon Sezon 03 (Johto Journeys)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223630',
    'title': 'Pokemon Sezon 04 (Johto Champions League)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223633',
    'title': 'Pokemon Sezon 05 (Master Quest)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223639',
    'title': 'Pokemon Sezon 06 (Advanced)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223648',
    'title': 'Pokemon Sezon 07 (Advanced Challenge)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223654',
    'title': 'Pokemon Sezon 08 (Advanced Battle)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223819',
    'title': 'Pokemon Sezon 09 (Battle Frontier)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223822',
    'title': 'Pokemon Sezon 10 (Diament i Perła)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223834',
    'title': 'Pokemon Sezon 11 (Wymiary Walki)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223843',
    'title': 'Pokemon Sezon 12 (Galaktyczne Bitwy)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223846',
    'title': 'Pokemon Sezon 13 (Gwiazdy Ligi Sinnoh)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223855',
    'title': 'Pokemon Sezon 14 (Czerń i Biel)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223864',
    'title': 'Pokemon Sezon 15 (Czerń i Biel: Ścieżki Przeznaczenia)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223876',
    'title': 'Pokemon Sezon 16 (Czerń i Biel: Przygody w Unovie i nie tylko)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223888',
    'title': 'Pokemon Sezon 17 (Seria: XY)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223900',
    'title': 'Pokemon Sezon 18 (Seria: XY: Przygody w Kalos)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223903',
    'title': 'Pokemon Sezon 19 (Seria: XYZ)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223918',
    'title': 'Pokemon Sezon 20 (Słońce i Księżyc)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223927',
    'title': 'Pokemon Sezon 21 (Słońce i Księżyc: Ultra Przygody)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223939',
    'title': 'Pokemon Sezon 22 (Słońce i Księżyc: Ultra Legendy)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/35223942',
    'title': 'Pokemon Sezon 23 (Seria: Podróże)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/40021670',
    'title': 'Pokemon Sezon 24 (Seria: Podróże Mistrzów)',
  },
  {
    'link': 'https://www.cda.pl/Rakso_98/folder/40039187',
    'title': 'Pokemon Sezon 25 (Seria: Najwspanialsze podróże)',
  },
];

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
    download(episodeLink, season);
  }
}

async function main(seasons: Season[], maxConcurrentDownloads: number): Promise<void> {
  for (const season of seasons) {
    console.log(`Downloading season: ${season.title}`);
    await downloadSeason(season);
  }
}

main(seasons, 3);
