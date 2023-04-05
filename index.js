const program = require('commander');
const spawn = require('child_process').spawn;
const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');
const http = require('http');

const ffplay = require('ffplay-static').default;

program
  .version('{Version}')
  .option('-i, --input <src>', `Primary input source`)
  // .option('-s, --save',                    `save to file`)
  .option('-k, --insecure', `Allow connections to SSL sites without certs`)
  .option('-r, --raw', `stdout`)
  // .option('-d, --debug',                    `debug`)
  // .option('-sa')
  .parse(process.argv);

// console.error(program.input);
if (!/ws|http/.test(program.input)) {
  program.outputHelp();
  process.exit();
}
var url = program.input;

if (program.insecure) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

function flvOnOpen() {
    if (program.raw == undefined) {
      child = spawn(ffplay, ['-i', '-']);
      child.stdin.setEncoding = 'utf-8';
      child.stdout.pipe(process.stdout);
      child.stdin.on('error', (err) => {
        console.error('stop');
        process.exit();
      });
    }
}

function flvOnDate(message) {
    idx += 1;

    if (idx < 100 || message.length > 10000) {
      console.error(`Stream(${message.length})`, Date.now() - start);
      if (message.length > 10000) idx = 1000;
    }
    if (message instanceof Buffer) {
      // if(program.debug )
      // console.log(message.length);
      if (program.raw) {
        process.stdout.write(message);
      } else {
        // console.error(child.stdin.readyState);
        child.stdin.write(message);
      }
    }
}

let idx = 0;
const start = Date.now();
if (/http/.test(url)) {
  const agent = /https/.test(url) ? https : http;
  // console.log(agent);
  const target = new URL(url);
  const options = {
    hostname: target.hostname,
    port: target.port,
    path: target.pathname + target.search,
    method: 'GET',
    headers: {

    }
  }
  const req = agent.request(options, (res) => {
    flvOnOpen();
    res.on('open', () => {
      // console.error('open');
    })
    res.on('close', function () {
      // console.error('echo-protocol Connection Closed');
    });
    res.on('data', (message) => {
      flvOnDate(message);
    });
    res.on('end', () => {
      // console.error('No more data in response.');
    });
  });
  req.end();
} else {

  const client = new WebSocket(url, {
    origin: 'https://websocket.org',
    'user-agent': 'wsplay',
  });

  // console.error('WebSocket Client Start', start);

  client.on('open', function (connection) {
    flvOnOpen();
  });

  client.on('error', function (error) {
    console.error("Connection Error: " + error.toString());
  });
  client.on('close', function () {
    console.error('echo-protocol Connection Closed');
  });
  client.on('message', function (message) {
    flvOnDate(message);
  });

  client.once('message', function (message) {
    console.error(`WebSocket Client Stream(${message.length})`, Date.now() - start);
  }, );
}