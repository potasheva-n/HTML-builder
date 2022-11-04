const fs = require('fs');
const readline = require('readline');
const process = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.on('beforeExit', () => {
  console.log('\n\nGoodbye!');
});

//построчная запись в файл через потоки
function ask(question) {
  rl.question(question, (answer) => {
    if(answer.toLowerCase() == 'exit') {
      rl.close();
    }
    else {
      const stream = fs.createWriteStream(`${__dirname}/text.txt`, {
        flags: 'a',
        encoding: 'utf8',
        mode: 0666
      });
      stream.on('error', (err) => console.log(`Err: ${err}`));
      stream.write(`${answer}\n`);
      stream.end();
      ask('Enter some more text: ');
    }
  });
}

ask('Hi! Please, enter the text: ');

//построчная запись в файл через appendFile

/*function ask(question) {
    rl.question(question, (answer) => {
      if(answer.toLowerCase() == 'exit') {
        rl.close();
      }
      else {
        fs.appendFile(
          `${__dirname}/text.txt`,
          `${answer}\n`,
          'utf8',
          (err) => {
            if (err) throw err;
          }
        );
        ask('Enter some more text: ');
      }
    });
}*/