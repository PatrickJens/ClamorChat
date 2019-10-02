//Include modules
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');


//My Modules
const gh = require("./GetHandler");
const ph = require("./PostHandler");
const dbmger = require("./DBManager");
var sm = require("./SessionManager");

//Constant Global Variables
const PORT =  process.env.PORT || 5000 ;

//Global Variables
var getHandler = new gh.GetHandler();
var postHandler = new ph.PostHandler();
var dbManager = new dbmger.DBManager();
var sessionManager = new sm.SessionManager();
var numberOfClientsOnClamor = 0 ;

//Timer to poll DB so that the connection does not time out
var pollDB= function()
{
    dbManager.queryDB("SELECT * FROM users;").then(function(rows){
        //console.log(rows);
    });
}
setInterval(pollDB, 50000);

/** EXTRACT BODY OF POST REQUEST **/
function sendToPostHandler(req, res)
{ 
    var body = [];
    req.on('data', (chunk) => 
    {
        body.push(chunk);
    }
        ).on('end', () => 
        {
            body = Buffer.concat(body).toString();
            var requestParameters = { url: req.url, content_type: req.headers['content-type'], data: body };
            
            //Send to postHandler
            postHandler.sendToController(requestParameters, res, getHandler, dbManager, sessionManager);                                     
        });
}

/** SERVER CALLBACK  **/
const server = http.createServer(function(req, res) 
{
    console.log("A client made a " + req.method+ " request   " + req.url);
    if( req.method == "GET" )
    {
        // if(req.url == '/get-port')
        // {
        //     var port = PORT.toString();
        //     res.write(port);
        //     res.end();
        // }
        // else
        // {
            getHandler.sendResponse(req.url, res);
        // }
    }
    if(req.method == "POST") 
    {
        postHandler.sendToPostHandler(req, res);
    }
});

/** SOCKET MANAGEMENT **/
var io = require('socket.io')(server);
sessionManager.setIO(io);

io.on('connection', function(socket)
{
    console.log('User connected. Total clients:', ++ numberOfClientsOnClamor);

    socket.on('logout', function(){
        console.log("USER LOGGED OUT");
        io.sockets.emit('updateContacts');
    });
    
    socket.on('disconnect', function(){
        console.log('User disconnected. Total clients: ', -- numberOfClientsOnClamor);
        io.emit('updateNumUsers', numberOfClientsOnClamor);
    });

});

/** START SERVER **/
server.listen(PORT, function(){
    console.log('listening on *: ', PORT);
});










