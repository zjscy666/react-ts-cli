#!/usr/bin/env node
const program = require('commander');
const { message } = require('./message');
const create = require('./create');

if (process.argv.slice(2).join('') === '-v') {
    const packageJson = require('../package');
    message.info('lgrt version ' + packageJson.version);
    process.exit()
}

program
    .command('create [AppName]')
    .alias('c')
    .description('Creates a new Appproject')
    .action(function (AppName) {
        const _AppName = AppName || 'myReactApp';
        create({ AppName: _AppName })
    });

program.parse(process.argv);

const params = process.argv[2];
if (!['c', 'create'].includes(params)) {
    program.help();
}