const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');

const {initRepo} = require('./controllers/init');
const {add} = require('./controllers/add');
const {commit} = require('./controllers/commit');
const {pull} = require('./controllers/pull');
const {push} = require('./controllers/push');
const {revert} = require('./controllers/revert');
const {log} = require('./controllers/log');

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

.command('pull <repoId>', 'Pull changes from the repo', (yargs)=>{
    yargs.positional('repoId', {
        describe: 'Repository ID to pull from',
        type: 'string'
    })}, argv =>{
        pull(argv.repoId);
})

.command('push <repoId>', 'Push changes to the repo', (yargs)=>{
    yargs.positional('repoId', {
        describe: 'Repository ID to push to',
        type: 'string'
    })}, argv =>{
        push(argv.repoId);
})

.command('revert <commitId>', 'Revert to a specific commit', (yargs) => {
    yargs.positional('commitId', {
        describe: 'ID of the commit to revert to',
        type: 'string'
    })}, argv => {
    revert(argv.commitId);
})
.command(`log`, 'Show commit history', {}, log)
.demandCommand(1, 'You need to specify a command')
.help()
.argv;