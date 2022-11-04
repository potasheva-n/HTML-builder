const promise = require('fs/promises');
const fs = require('fs');

async function bundleCss () {
  const files = await promise.readdir(`${__dirname}/styles`, {withFileTypes: true});
  fs.access(`${__dirname}/project-dist/bundle.css`, (err) => {
    if (err) {
      return;
    } else { //если файл существует - очищаем
      const stream = fs.createWriteStream(`${__dirname}/project-dist/bundle.css`, 'utf8');
      stream.write('');
      stream.end();
    }
  });
  //выбираем css файлы
  files.filter((file) => {
    let name = file.name.split('.');
    return name[name.length - 1].toLowerCase() === 'css';
  })//записываем содержимое каждого css файла в bundle.css
    .map((file) => {
      const writeStream = fs.createWriteStream(`${__dirname}/project-dist/bundle.css`, {
        flags: 'a',
        encoding: 'utf8',
        mode: 0666
      });
      const readStream = fs.createReadStream(`${__dirname}/styles/${file.name}`, 'utf8');

      readStream.on('data', (data) => {
        writeStream.write(`${data}\n`);
        writeStream.end();
      });
      readStream.on('error', (err) => console.log(`Err: ${err}`));
      writeStream.on('error', (err) => console.log(`Err: ${err}`));
  });
}

bundleCss();