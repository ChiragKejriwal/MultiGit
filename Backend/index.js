const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');

const {initRepo} = require('./controllers/init');
const {add} = require('./controllers/add');
const {commit} = require('./controllers/commit');
const {pullRepo} = require('./controllers/pull');
const {pushRepo} = require('./controllers/push');

yargs(hideBin(process.argv))
.command('init', 'Initialize repositories', {}, initRepo)
.command('add <file>', 'To stage the file in the repository',(yargs)=>{
    yargs.positional('file', {
        describe: 'File to add',
        type: 'string'
    })}
, argv=>{
    add(argv.file);
})


.command('commit', 'Commit changes', {}, commit)
.command('pull', 'Pull changes', {}, pullRepo)
.command('push', 'Push changes', {}, pushRepo)
.demandCommand(1, 'You need to specify a command')
.help()
.argv;