const fs = require('fs');
const fsAsync = require('fs/promises');
const path = require('path');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', () => { });

const bundleCss = async () => {
    const files = await fsAsync.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    files.forEach((file, i) => {
        if (path.extname(file.name) === '.css') {
            const stream = fs.ReadStream(path.join(__dirname, 'styles', `${file.name}`));
            stream.on('data', (data) => {
                const writeFunc = (content) => {
                    fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), content, { flag: 'a+' }, () => { });
                }
                if (!i) {
                    writeFunc(`${data.toString()}`);
                } else {
                    writeFunc(`\n\n${data.toString()}`);
                }
            });
        }
    });
};

bundleCss();