const fsAsync = require('fs/promises');
const path = require('path');

const myFunc = async () => {
    const files = await fsAsync.readdir(path.join(__dirname, 'secret-folder'));
    for (const file of files) {
        const fileObj = await fsAsync.stat(path.join(__dirname, 'secret-folder', `${file}`));
        const fileSize = fileObj.size;
        if (fileObj.isFile()) {
            console.log(file.split('.')[0] + ' - ' + file.split('.')[1] + ' - ' + fileSize/1024 + 'kb');
        } else {
            console.log(file + ' - this is directory, not a file.')
        }
    }
};

myFunc();