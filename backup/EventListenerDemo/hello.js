
const EventEmitter = require('events'); 

//console.log(exports);
//console.log(require);
//console.log(module);
//console.log(__filename);
//console.log(__dirname);




class Logger extends EventEmitter {
	log(message)
	{
		console.log(message);
		//raise an event
		this.emit('messageLogged', { id: 1, url: 'http://'});

	}
}




module.exports = Logger ;
