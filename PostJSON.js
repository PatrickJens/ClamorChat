exports.PostJSON = PostJSON ;
const utf8 = require('utf8');

var portNum = 123 ;
var userDashLocation = "" ;
var landingPageLocation = "" ;

var userDashboardAddress = 'http://localhost:5000/user-dashboard.html' ;
var badLogin = 'http://localhost:5000/bad-login.html' ;

// if( location.hostname =="localhost")
// {
//     userDashboardAddress = 'http://localhost:5000/user-dashboard.html' ;
//     badLoginAddress = 'http://localhost:5000/bad-login.html' ;
// }
// else
// {
//     userDashboardAddress = 'https://thawing-hamlet-65909.herokuapp.com/user-dashboard.html' ;
//     badLoginAddress = 'https://thawing-hamlet-65909.herokuapp.com/bad-login.html' ;
// }




function PostJSON()
{   
    this.mJSON = "dummyJSON" ;
    this.url = "/dummyURL" ;

    this.setJSON = function (mJSON)
    {
        this.mJSON = mJSON ;
    }

    this.setURL = function (url)
    {
        this.url = url ;
    }

    this.sendPostRequest = function(mJSON, url)
    {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function()
        {
            if( xhr.readyState == 4 && xhr.status == 200 )
            {   
                if( xhr.responseText == "login_failure")
                {
                    window.location = '/bad-login.html' ;
                    document.getElementById("clamor-cat-says").innerHTML = "Login failed. Please login again or register to create an account ";
                }
                else
                {
                    window.location = '/user-dashboard.html' ;
                }

            }
        };
        xhr.send(this.mJSON);
    }

    this.getPortNumber = function()
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/get-port', true);
        //xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function()
        {
            if( xhr.readyState == 4 && xhr.status == 200 )
            {
                portNum = xhr.responseText ;
            }
        };
        xhr.send();
    }

    this.getLandingPageAddress = function()
    {
        landingPageLocation = 'http://localhost:' + portNum + '/';
        return landingPageLocation ;
    }

    this.returnPort = function()
    {
        return portNum ;
    }
}