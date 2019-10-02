exports.LoginController = LoginController ;
const dbmger = require("../DBManager");

const fs = require('fs');
const {StringDecoder } = require('string_decoder');
const utf8 = require('utf8');

//Global Variables
var getHandler ;
var dbManager ;
var mJSON = "" ;
var landingPageUser = "" ;
var validUser = "" ;


//Global LogicController Functions (usable by LogicController only, unaccessable outside the class)
validateRows = function(array)
{
    if(array.length > 1 )
    {
        console.log("[LoginController] Error: Duplicate users found in database");
        return 0 ;
    }
    else if(array.length == 0 )
    {
        console.log("[LoginController] Error: User not found in database");
        return 0 ;
    }
    else
    {
        return 1;
    }
}

//Valid username and password matches credentials in database
authenticateLandingPageUser = function(dbUser)
{
    if( dbUser.username == landingPageUser.username && dbUser.password == landingPageUser.password)
    {
        return 1 ;
    }
    else
    {
        return 0 ;
    }
}

var copyUsernames = function(rows){
    var i = 0 ;
    var usernames = [];
    for ( i = 0 ; i < rows.length ; i ++)
    {
        usernames[i] = rows[i].username ;
    }
    return usernames;
}

//Main Login Routine
function LoginController()
{
    this.init = function(requestParameters)
    {
        landingPageUser = JSON.parse(requestParameters.data);
        //console.log("[LoginController.init] landingPageUser: ", landingPageUser);
    }

    this.login = function(requestParameters, response, getHandler, dbManager, sessionManager)
    {

        if(landingPageUser == "")
        {
            console.log("[LoginController] Error: No user object");
            isValidLogin = 0 ;
        }
        else
        {
            dbManager.selectUserFromDB(landingPageUser.username).then(function(rows)
            {
                if(validateRows(rows) && authenticateLandingPageUser(rows[0]))
                {
                    //Extract username from the row data
                    validUser = rows[0].username ;

                    //Check if session already exists 
                    sessionManager.addSession(validUser);
                    //sessionManager.logSessions();
                    
                    //Convert current session to a cookie string
                    session = sessionManager.getSessionByUsername(validUser);
                    //console.log("LoginController session:", session);
                    session_cookie = sessionManager.sessionToCookie(session); 

                                                            
                    //Write response to the user login
                    getHandler.getResourceURN(requestParameters.url);                                
                    getHandler.getContentTypeExtension();   
                    getHandler.setResponseContentType(response);                                                          
                    getHandler.getFileContent(getHandler.urn_path).then(function(data)          
                    {   
                        response.setHeader("Set-Cookie", session_cookie);
                        response.write(data);
                        response.end();
                        console.log("All Sessions:", sessionManager.returnAllSessions());
                        sessionManager.io.emit('login');
                    });
                }
                else
                {
                    console.log("[LoginController] Login Invalid");
                    response.write("login_failure");
                    response.end();
                }
            });
        }   
    }
}