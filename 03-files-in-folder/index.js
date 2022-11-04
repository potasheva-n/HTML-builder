const promise = require('fs/promises');
const fs = require('fs');

async function showFilesInFolder () {
  const files = await promise.readdir(`${__dirname}/secret-folder`, {withFileTypes: true});
  files.filter((file) => (!file.isDirectory())).map((file) => {
    fs.stat(`${__dirname}/secret-folder/${file.name}`, (error, stats) => {
      if (error) {
        console.log(error);
      }
      else {
        console.log(`${file.name.split('.').join(' - ')} - ${(stats.size/1024).toFixed(3)} Kb`)
      }
    });
  });
}

showFilesInFolder();