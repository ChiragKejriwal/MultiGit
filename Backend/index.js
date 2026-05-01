const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');

const {initRepo} = require('./controllers/init');
const {add} = require('./controllers/add');
const {commit} = require('./controllers/commit');
const {pullRepo} = require('./controllers/pull');
const {pushRepo} = require('./controllers/push');
const {revert} = require('./controllers/revert');

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


.command('commit <msg>', 'To commit changes to a repository', (yargs) => {
    yargs.positional('msg', {
        describe: 'Commit message',
        type: 'string'
    })}
   ,argv =>{
    commit(argv.msg);
})
.command('pull', 'Pull changes', {}, pullRepo)
.command('push', 'Push changes', {}, pushRepo)
.command('revert <commitId>', 'Revert to a specific commit', (yargs) => {
    yargs.positional('commitId', {
        describe: 'ID of the commit to revert to',
        type: 'string'
    })}, argv => {
    revert(argv.commitId);
})
.demandCommand(1, 'You need to specify a command')
.help()
.argv;