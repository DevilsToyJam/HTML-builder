const fs = require('fs');
const fsAsync = require('fs/promises');
const path = require('path');

// -- Bundle CSS -- //

fsAsync.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', () => { });

const bundleCss = async () => {
    const files = await fsAsync.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    files.forEach((file, i) => {
        if (path.extname(file.name) === '.css') {
            const stream = fs.ReadStream(path.join(__dirname, 'styles', `${file.name}`));
            stream.on('data', (data) => {
                const writeFunc = (content) => {
                    fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), content, { flag: 'a+' }, () => { });
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

// -- Copy assets -- //

fsAsync.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });

const assets = async (origPath, copyPath) => {
    const files = await fsAsync.readdir(origPath, { withFileTypes: true });
    for (const file of files) {
        
        if (file.isFile()) {
            await fsAsync.copyFile(origPath + `/${file.name}`, copyPath + `/${file.name}`);
        } else {
            await fsAsync.mkdir(path.join(__dirname, 'project-dist', 'assets', `${file.name}`), { recursive: true });
            await fsAsync.rm(copyPath + `/${file.name}`, { recursive: true });
            await fsAsync.mkdir(path.join(__dirname, 'project-dist', 'assets', `${file.name}`), { recursive: true });
            await assets(origPath + `/${file.name}`, copyPath + `/${file.name}`);
        }
    }
    return;
};

assets(__dirname + '/assets', __dirname + '/project-dist' + '/assets');

// -- Bundle HTML -- //

const stream = fs.ReadStream(path.join(__dirname, 'template.html'));

fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), '', () => { });

const bundleHtml = async () => {
    let htmlString;
    stream.on('data', async (data) => {
        htmlString = data.toString();
        const files = await fsAsync.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
        for (const file of files) {
            const copyStream = fs.ReadStream(path.join(__dirname, 'components', file.name));
            copyStream.on('data', async (data) => {
                const regex = new RegExp(`{{${file.name.split('.')[0]}}}`, 'g');
                htmlString = await htmlString.replace(regex, data.toString());
            });

            copyStream.on('end', () => {
                fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), htmlString, () => { });
            });
        }
    });
};

bundleHtml();