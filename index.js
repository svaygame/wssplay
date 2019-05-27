const program = require('commander');
const spawn = require('child_process').spawn;
const WebSocket = require('ws');
const fs = require('fs');

const ffplay = require('ffplay-static').default;

program
.version('{Version}')
.option('-i, --input <src>',                    `Primary input source`)
// .option('-s, --save',                    `save to file`)
.option('-k, --insecure',                    `Allow connections to SSL sites without certs`)
.option('-r, --raw',                    `stdout`)
// .option('-d, --debug',                    `debug`)
// .option('-sa')
.parse(process.argv);

console.error(program.input);
if(program.input == undefined || program.input.match(`ws`) == null)
{
    program.outputHelp();
    process.exit();
}
var url = program.input;

if(program.insecure)
{
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

const client = new WebSocket(url, {
    origin: 'https://websocket.org',
    'user-agent':'wsplay',
});
 
client.on('open', function(connection) {

    if(program.raw == undefined)
    {
        child = spawn(ffplay, ['-i', '-']);
        child.stdin.setEncoding = 'utf-8';
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);

        console.error('WebSocket Client Connected');
    }
});

client.on('error', function(error) {
        console.error("Connection Error: " + error.toString());
});
client.on('close', function() {
    console.error('echo-protocol Connection Closed');
});
client.on('message', function(message) {
    if(message instanceof Buffer){
        // if(program.debug )
            // console.log(message.length);
        if(program.raw )
        {
            process.stdout.write(message);
        }else
        {
            child.stdin.write(message);
        }
    }
});
