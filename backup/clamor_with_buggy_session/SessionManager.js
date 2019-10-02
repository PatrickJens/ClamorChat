exports.SessionManager = SessionManager ;

//Global Variables
var sessions = [] ; 
var sessionIdModulator = 1 ;
//var io ;
var socket ;

//Global Class
function Session(user)
{
    this.sid = Date.now() + (sessionIdModulator ++) ;
    this.username = user ;
}

//Global functions
var getSessionByUsername = function(username)
{
    for(let i = 0 ; i < sessions.length ; i ++)
    {
        if(sessions[i].username == username)
        {
            return sessions[i] ;
        }
    }
}

var getSessionBySid = function(sid)
{
    for(let i = 0 ; i < sessions.length ; i ++)
    {
        if(sessions[i].sid == sid)
        {
            return sessions[i] ;
        }
    }    
}

//Create a cookie name/value string 
var sessionToCookie = function(name, value)
{
    cString = "" ;
    cString = name + "=" + value + ";";
    return cString ;
}

//Returns the name of a name/value pair of a cookie
var getKeyFromCookie = function(cookieString)
{
    var key = "" ;
    var startWritingNow = 1 ;
    for(let i = 0 ; i < cookieString.length ; i ++ )
    {
        if( cookieString[i] == "=")
        {
            startWritingNow = 0 ;
        }
        if(startWritingNow == 1)
        {
            key += cookieString[i];
        }
    }
    return key ;
}

//Get the value of a name/value pair of a cookie
var getSidFromCookie = function(cookieString)
{
    
    stringArray = cookieString.split("=");
    sidString = stringArray[1] ;
    console.log("[getSidFromCookie] sidString:", sidString);
    return sidString ;
}


//The SessionManager class contains the core functionality
function SessionManager()
{
    this.io ;
    this.setIO = function(mIO)
    {
        this.io = mIO ;
    }

    this.returnAllSessions = function()
    {
        return sessions ;
    }

    this.addSession = function(username)
    {
        var session = new Session(username);
        sessions.push(session);
    }

    this.getSessionByUsername = function(username)
    {
        session = getSessionByUsername(username);
        return session ;
    }
    
    this.sessionToCookie = function(session)
    {
        cookieString = sessionToCookie("sid", session.sid);
        return cookieString ;
    }

    this.getUsernameFromCookieSid = function(cookieString)
    {
        sid = getSidFromCookie(cookieString);
        session = getSessionBySid(sid);
        username = session.username ;
        return username ;
    }

    this.logSessions = function()
    {
        console.log("[logSessions] Sessions:", sessions);
    }
}






