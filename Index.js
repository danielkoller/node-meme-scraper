import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import fsExtra from 'fs-extra';

// First of all we want to check, if our 'memes' folder already exists in our project folder. If it doesn't, fs creates it for us.
if (!fs.existsSync('memes')) {
  fs.mkdirSync('memes');
}

// Now we want to clean our 'memes' folder, so we don't get any conflicts
const folder = 'memes';
fsExtra.emptyDirSync(folder);

// Defining the URL, we want to get our dank memes from.
const url = 'https://memegen-link-examples-upleveled.netlify.app/';

// First, we use axios & cheerio to check if our to be scrapped website is actually online.
axios
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    console.log(`${url} is online. Will scrape the pictures now!`);
  })
  .catch((error) => {
    console.log(`${url} is offline. Can't scrape the pictures now!`);
  });
