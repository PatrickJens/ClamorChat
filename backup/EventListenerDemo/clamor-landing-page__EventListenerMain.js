//require modules
const Logger = require('./hello') //demo purposes only// interfaces with export command in hello.js. Don't accidentally want to override value of hellomodule//hellomodule.sayHello("Patricio");
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');

//end end require modules

/* start path demo */
//var pathObj = path.parse(__filename);
//console.log(pathObj);

/*start fs demo */

//readdir gets an array of strings. The strings are the files in the directory specified by the first arguement
// fs.readdir('./', 
// 			function(err, files) 
// 			{ 
// 				if (err) 
// 					console.log('Error', err); 
// 				else
// 					console.log('Result', files)
// 			});

//register a listener
//emitter.on('messageLogged', function(arg) { 

const logger = new Logger();

logger.on('messageLogged', (arg)=> { 
	console.log('Listener called', arg);
});
logger.log('message');

