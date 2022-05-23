const fs = require('fs');
const path = require('path');
const rl = require('readline');

const { stdin: input, stdout: output } = require('process');

const readline = rl.createInterface({ input, output });

fs.writeFile(path.join(__dirname, 'text.txt'), '', () => { });

console.log('Приветик, ожидаю записи.');

const closeFunc = () => { console.log('Покасик, записал.') };

readline.on('line', (input) => {
    if (input === 'exit') {
        readline.close();
        closeFunc();
        return;
    }
    fs.writeFile(path.join(__dirname, 'text.txt'), input + '\n', { flag: 'a' }, () => { });
});

readline.on('SIGINT', () => {
    closeFunc();
    readline.close();
});
