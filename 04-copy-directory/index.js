const fs = require('fs');
const promise = require('fs/promises');

fs.mkdir(`${__dirname}/files-copy`, { recursive: true }, error => {
  if (error) {
    throw error;
  }
});

async function copyFilesInFolder () {
  const files = await promise.readdir(`${__dirname}/files`, {withFileTypes: true});
  files.map((file) => {
    fs.copyFile(`${__dirname}/files/${file.name}`, `${__dirname}/files-copy/${file.name}`, err => {
      if(err) throw err;
   });
  })
}

copyFilesInFolder();

