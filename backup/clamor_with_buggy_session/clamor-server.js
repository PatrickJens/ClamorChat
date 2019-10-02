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
var cookies = require("./Cookie");
var sm = require("./SessionManager");


//Global Variables
var getHandler = new gh.GetHandler();
var postHandler = new ph.PostHandler();
var dbManager = new dbmger.DBManager();
var sessionManager = new sm.SessionManager();
var numberOfClientsOnClamor = 0 ;

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
            postHandler.sendToController(requestParameters, res, getHandler, dbManager, sessionManager);                                     
        });
}

/** SERVER CALLBACK  **/
const server = http.createServer(function(req, res) 
{
    console.log("A client made a " + req.method+ " request   " + req.url);
    if( req.method == "GET" )
    {
        //console.log(req) ;
        getHandler.sendResponse(req.url, res);
        
    }
    if(req.method == "POST") 
    {
        //console.log("[Cookie]: ", req.headers["Cookie"]);
        sendToPostHandler(req, res);
    }
});

/** SOCKET MANAGEMENT **/
var io = require('socket.io')(server);
sessionManager.setIO(io);
io.on('connection', function(socket)
{
    //Save io object to sessionManager for use by other classes
    //Track the number of clients on the landing page
    console.log('User connected. Total clients:', ++ numberOfClientsOnClamor);
    sessionManager.io.emit('updateNumUsers', numberOfClientsOnClamor);
    //io.emit('updateNumUsers', numberOfClientsOnClamor);

    //Practice receiving emission from a client
    socket.on('chat message', function(ping){
        //console.log("message: ", ping);
    });
    
    socket.on('disconnect', function(){
        console.log('User disconnected. Total clients: ', -- numberOfClientsOnClamor);
        io.emit('updateNumUsers', numberOfClientsOnClamor);
    });

});

/** START SERVER **/
server.listen(8080, function(){
    console.log('listening on *:8080');
});










