/* 
Author: Patrick Cannell

Description:
Gets username and password input values. Puts them into a JSON. Uses XMLHttpRequest to send login credentials to 

*/



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
    window.location = '/registration.html' ;
}

var getHostname = function()
{
    document.getElementById("debug").innerHTML = "" ;
}

