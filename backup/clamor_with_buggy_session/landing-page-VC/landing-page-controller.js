/* 
Author: Patrick Cannell

Description:
Gets username and password input values. Puts them into a JSON. Uses XMLHttpRequest to send login credentials to 

*/

var socket = io();
socket.emit('chat message', 'EMITTED EVENT');

socket.on('updateNumUsers', function(numUsers){
    document.getElementById('numClients').innerHTML = numUsers;
});

function Credentials(username, password)
{
    this.username = username;
    this.password = password;
}

function login()
{
    //Capture user input
    var loginURL = "/user-dashboard.html";
    var username = document.getElementById("username-input").value.toString();
    var password = document.getElementById("password-input").value.toString();
    var credentials = new Credentials(username, password);
    var credentials_JSON = JSON.stringify(credentials);
    
    //POST formatted input
    postJSON = new PostJSON() ;
    postJSON.mJSON = credentials_JSON ;
    postJSON.url = loginURL ;
    
    //Send POST request
    postJSON.sendPostRequest();
}

goToRegisterPage = function()
{
    var registerPageURL = '/register-page.html';
    postJSON = new PostJSON();
    postJSON.setJSON( "/go-to-register-page" );
    postJSON.url = registerPageURL ;
    postJSON.sendPostRequest();
}

