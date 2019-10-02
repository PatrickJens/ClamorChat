exports.SessionManager = SessionManager ;

//Global Variables
var sessions = [] ; 
var sessionIdModulator = 1 ;
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
    return 0 ;
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
        mSession = getSessionByUsername(username);
        if(!mSession)
        {
            var session = new Session(username);
            sessions.push(session);
        }
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
        if(session)
        {
            username = session.username ;
            return username ;
        }
        else
        {
            return "-1";
        }
        
        
    }

    this.terminateSession = function(dSession)
    {
        var i = 0 ;
        var j = 0 ;
        for( i=0; i < sessions.length ; i ++ )
        {
            if(sessions[i].sid == dSession.sid && sessions[i].username == dSession.username)
            {
                sessions.splice(i, 1);
                console.log("[SessionManager Terminate Session]: spliced sessions", sessions, "  dSession.username = ", dSession.username);
                return sessions ;
            }
        }
        if(i >= sessions.length)
        {
            dummy_session = { username: "double-logout-event", sid: 123 };
            return dummy_session ;
        }
    }

    this.logSessions = function()
    {
        console.log("[logSessions] Sessions:", sessions);
    }
}






