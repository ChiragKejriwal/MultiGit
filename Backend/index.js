const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');

const {init} = require('./controllers/init');
const {addRepo} = require('./controllers/add');
const {commit} = require('./controllers/commit');
const {pullRepo} = require('./controllers/pull');
const {pushRepo} = require('./controllers/push');

yargs(hideBin(process.argv))
.command('i', 'Initialize repositories', {}, init)
.command('add', 'Add a repository', {}, addRepo)
.command('commit', 'Commit changes', {}, commit)
.command('pull', 'Pull changes', {}, pullRepo)
.command('push', 'Push changes', {}, pushRepo)
.demandCommand(1, 'You need to specify a command')
.help()
.argv;