import puppeteer from 'puppeteer';
// import { execSync, exec } from 'child_process';
// import fs from 'fs';
// import path from 'path';

async function scrapeEpisodeLinks(pageUrl: string): Promise<string[]> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const links: string[] = [];

  do {
    await page.goto(pageUrl);
    const episodeLinks = await page.$$eval('.thumb-wrapper-just .list-when-small a.link-title-visit', elems => elems.map(e => e.getAttribute('href')));
    links.push(...episodeLinks);

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

async function main() {
  const seasons = [
      "https://www.cda.pl/Rakso_98/folder/35223606"
  ]

  const links = await scrapeEpisodeLinks(seasons[0]);
  console.log(links);
  console.log(links.length);
}

main();
