const chalk = require('chalk');
const ora = require('ora');

const message = {
    success(info) {
        console.log(chalk.green.bold(info));
    },
    error(info) {
        console.log(chalk.red.bold(info));
    },
    info(info) {
        console.log(chalk.blue.bold(info));
    },
    warn(info) {
        console.log(chalk.yellow.bold(info));
    },
};

const cbLog = (file, cb) => {
    cb(null, file);
}

const spin = (info) => {
    return ora(info)
}

module.exports = { message, cbLog, spin }