import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import fsExtra from 'fs-extra';

// First of all we want to check, if our 'memes' folder already exists in our project folder. If it doesn't, fs creates it for us.
if (!fs.existsSync('memes')) {
  fs.mkdirSync('memes');
}

// Now we want to clean our 'memes' folder using fsExtra, so we don't get any conflicts while scraping.
const folder = 'memes';
fsExtra.emptyDirSync(folder);

// This defines the URL, we want to get our dank memes from.
const url = 'https://memegen-link-examples-upleveled.netlify.app/';

// First, we use axios & cheerio to check if our to be scrapped website is actually online. I used this code to get an idea of axios, cheerio and promises.
axios
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    console.log(`${url} is online. Will scrape the pictures now!`);
  })
  .catch((error) => {
    console.log(`${url} is offline. Can't scrape the pictures now!`);
  });

// Now we actually scrape the images and write them to our hard drive using fs.
axios
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    // Only targeting 'img'-elements.
    const images = $('img');
    // Looping over the first ten elements and defining the url for our axios-request.
    for (let i = 0; i < 10; i++) {
      const imageUrl = images[i].attribs.src;
      // Defining the filename starting with 01.jpg and so on.
      const fileName = `memes/0${i + 1}.jpg`;
      // Connecting again to our to be scraped website and getting the images via the stream responseType.
      axios({
        method: 'get',
        url: imageUrl,
        responseType: 'stream',
        // Finally we write our data to our 'memes'-folder using the pipe-function, I learned following a tutorial.
      })
        .then((response) => {
          response.data.pipe(fs.createWriteStream(fileName));
        })
        // If fs isn't able to write to our 'memes'-folder we get an error message.
        .catch((error) => {
          console.log('Writing failed!');
        });
    }
  })
  // If the scraping fails, we get an error message.
  .catch((error) => {
    console.log('Scraping failed!');
  });
