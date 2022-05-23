const fs = require('fs/promises');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
    
const myFunc = async () => {
    const files = await fs.readdir(path.join(__dirname, 'files'));
    for (const file of files) {
        const fileCopy = await fs.copyFile(path.join(__dirname, 'files', `${file}`), path.join(__dirname, 'files-copy', `${file}`));
    }
};

myFunc();
