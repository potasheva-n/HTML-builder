const fs = require('fs');
const templatesStream = fs.createReadStream(`${__dirname}/template.html`, 'utf8');

/*создаем папку проекта*/
fs.mkdir(`${__dirname}/project-dist`, { recursive: true }, error => {
  if (error) {
    throw error;
  }
});

/*составляем index.html*/
templatesStream.on('data', (templateData) =>  {
  //нашли все вхождения названий компонентов вида {{xxxx}}
  let reg = new RegExp('\{\{[A-Za-z0-9_]*\}\}', 'gi');
  let templateNames = templateData.match(reg).map((name) => (name.replace(/[\{,\}]/g, '')));
  let htmlBundle = templateData;
  //считываем содержание файлов компонентов
  templateNames.forEach((componentName) => {
    const componentStream = fs.createReadStream(`${__dirname}/components/${componentName}.html`, 'utf8');
    const writeBundleStream = fs.createWriteStream(`${__dirname}/project-dist/index.html`, {
      flags: 'w',
      encoding: 'utf8',
      mode: 0666
    });
    //записываем содержание в общий html
    componentStream.on('data', (componentData) =>  {
      let componentReg = new RegExp(`\{\{${componentName}\}\}`, 'g');
      htmlBundle = htmlBundle.replace(componentReg, componentData);
      writeBundleStream.write(`${htmlBundle}`);
      writeBundleStream.end();
      writeBundleStream.on('error', (err) => console.log(`Err: ${err}`));
    });

    componentStream.on('error', (err) => console.log(`Err: ${err}`));
  });
});
templatesStream.on('error', (err) => console.log(`Err: ${err}`));

/*составляем style.css*/
const promise = require('fs/promises');

async function bundleCss () {
  const files = await promise.readdir(`${__dirname}/styles`, {withFileTypes: true});
  fs.access(`${__dirname}/project-dist/style.css`, (err) => {
    if (err) {
      return;
    } else { //если файл существует - очищаем
      const stream = fs.createWriteStream(`${__dirname}/project-dist/style.css`, 'utf8');
      stream.write('');
      stream.end();
    }
  });
  //выбираем css файлы
  files.filter((file) => {
    let name = file.name.split('.');
    return name[name.length - 1].toLowerCase() === 'css';
  })//записываем содержимое каждого css файла в style.css
    .map((file) => {
      const writeCssStream = fs.createWriteStream(`${__dirname}/project-dist/style.css`, {
        flags: 'a',
        encoding: 'utf8',
        mode: 0666
      });
      const readCssStream = fs.createReadStream(`${__dirname}/styles/${file.name}`, 'utf8');

      readCssStream.on('data', (data) => {
        writeCssStream.write(`${data}\n`);
        writeCssStream.end();
      });
      readCssStream.on('error', (err) => console.log(`Err: ${err}`));
      writeCssStream.on('error', (err) => console.log(`Err: ${err}`));
  });
}

bundleCss();

/*копируем папку assets*/

function copyFilesInFolder (pathTo, pathFrom) {
  fs.mkdir(pathTo, { recursive: true }, error => {
    if (error) {
      throw error;
    }
  });
  fs.readdir(pathFrom, {withFileTypes: true}, (err, files) => {
    files.map((file) => {
      if(file.isDirectory()){
        copyFilesInFolder(`${pathTo}/${file.name}`, `${pathFrom}/${file.name}`);
      }
      else{
        fs.copyFile(`${pathFrom}/${file.name}`, `${pathTo}/${file.name}`, err => {
          if(err) throw err;
        });
      }
    })
    if(err) throw err;
  });
}

copyFilesInFolder(`${__dirname}/project-dist/assets`, `${__dirname}/assets`);
