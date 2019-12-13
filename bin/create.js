const fs = require('fs-extra');
const {basename, join} = require('path');
const readline = require('readline');
const download = require('download-git-repo');
const _fs = require('vinyl-fs');
const map = require('map-stream');
const { message, cbLog, spin } = require('./message');

const templateAddr = 'zjscy666/typescript-antd-system';

const _readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const orgPath = join(__dirname, '../org');

function initComplete(AppName) {
  message.success(`
    Created ${AppName} project!
    cd ${AppName}
    npm start
  `);
  process.exit();
}

function createProject(dir) {
  const _spin = spin('downloading template start');
  _spin.start()
  if (fs.existsSync(orgPath)) fs.emptyDirSync(orgPath)
  download(templateAddr, orgPath, function (err) {
    _spin.stop()
    if (err) {
      message.error(err)
      process.exit()
    }

    fs
    .ensureDir(dir)
    .then(() => {
      _fs
        .src(['**/*', '!node_modules/**/*'], {
          cwd: orgPath,
          cwdbase: true,
          dot: true,
        })
        .pipe(map(cbLog))
        .pipe(_fs.dest(dir))
        .on('end', function() {
          const AppName = basename(dir);
        // start install, or  user do it bySelf
          message.info('install packages');
          require('./download')({
            success: initComplete.bind(null, AppName),
            cwd: dir,
          });
        })
        .resume();
    })
    .catch(err => {
      console.log(err);
      process.exit();
    });
})
}

function init({AppName}) {
  const dist = process.cwd();
  const dir = join(dist, `./${AppName}`);
  if (fs.existsSync(dir)) {
    _readLine.question(
      message.info(`${AppName} directory exist! Do you want cover this directory? (Y/N)`),
      str => {
        const userInput = str && str.trim().toUpperCase();
        if (userInput === 'Y') {
          const _spin = spin(`remove ${AppName} directory`);
          _spin.start();
          fs
            .emptyDir(dir)
            .then(() => {
              _spin.stop();
              createProject(dir);
            })
            .catch(err => {
              console.error(err);
            });
        } else if (userInput === 'N') {
          process.exit();
        }
      }
    );
  } else {
    createProject(dir);
  }
}

module.exports = init;