# Cda.pl Pokemon Downloader

## Description
This script downloads all the pokemon episodes from https://www.cda.pl/Rakso_98/folder-glowny
The episodes are downloaded to the `./data` directory.
The episodes are in Polish.

To download this script uses `yt-dlp` which is a fork of `youtube-dl` with some extra features.
The episodes are downloaded in the best quality available.
The episodes are downloaded sequentially, so it might take a while.
THe downloader resumes in a place in case of an error or if the script is stopped.

## Customization
In a file `seasons.json` you can specify which seasons you want to download.
It can be from whatever show you want, not only pokemon.
The format is as follows:
```json
 [
  {
    "title": "Season 1",
    "link": "https://www.cda.pl/..."
  },
  {
    "title": "Season 2",
    "link": "https://www.cda.pl/..."
  }
]
```

## Requirements
- Node.js [https://nodejs.org/en/](https://nodejs.org/en/)
- yt-dlp [https://github.com/yt-dlp/yt-dlp/releases/latest](https://github.com/yt-dlp/yt-dlp/releases/latest)

## Installation
1. Clone this repository: `git clone <repo_url>`
2. Install dependencies: `npm install`
3. Run the script: `npm start`
4. Wait for the script to finish downloading all the episodes
5. Enjoy!

## License
[MIT](https://choosealicense.com/licenses/mit/)
```
