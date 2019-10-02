exports.PostHandler = PostHandler ;

//Import controller files
const lc = require("./landing-page-VC/LoginController");
const gcc = require("./user-dashboard-VC/GetContactsController");
const gchc = require("./user-dashboard-VC/GetChatHistoryController");
const pmc = require("./user-dashboard-VC/PostMessageController");
const ruc = require("./bad-login-signup-VC/RegisterUserController");

//Instantiate controller objects
var loginController = new lc.LoginController();
var getContactsController = new gcc.GetContactsController();
var GetChatHistoryController = new gchc.GetChatHistoryController();
var postMessageController = new pmc.PostMessageController();
var registerUserController = new ruc.RegisterUserController();

function PostHandler(getHandler, dbManager, requestParameters)
{

    //Log request information
    this.readRequest = function(req)
    {
        console.log("[POSTHANDLER] readRequest: ", req);
    }

    //Route objects to controller depending on URL
    this.sendToController = function(requestParameters, response, getHandler, dbManager, sessionManager)
    {
        switch(requestParameters.url)
        {
            case '/user-dashboard.html':            this.executeLoginController(requestParameters, response, getHandler, dbManager, sessionManager); 
                                                    break;
            case '/register-page.html':             getHandler.postSendResponse(requestParameters, response);
                                                    break;
            case '/user-dashboard-get-contacts':    this.executeGetContactsController(requestParameters, response, getHandler, dbManager); 
                                                    break;
            case '/get-chats':                      this.executeGetChatHistoryController(requestParameters, response, getHandler, dbManager, sessionManager);
                                                    break;      
            case '/post-message':                   this.executePostMessageController(requestParameters, response, getHandler, dbManager, sessionManager);
                                                    break;
            case '/get-session-user':               respondWithUsername(response, sessionManager.getUsernameFromCookieSid(requestParameters.data)) ;
                                                    break;
            case '/get-all-sessions':               responseWithAllSessions(response, sessionManager);
                                                    break;
            case '/terminate-session':              terminateSession(requestParameters, response, getHandler, dbManager, sessionManager);
                                                    break;
            case '/register-new-user':              registerUser(requestParameters, response, getHandler, dbManager, sessionManager);
                                                    break;  
            default:                                break;
        }
    }


    /* Configure and execute controller functionality corresponding a use case */
    this.executeLoginController =  function(requestParameters, response, getHandler, dbManager, sessionManager)
    {
        console.log("[executeLoginController]");
        loginController.init(requestParameters);
        var res = loginController.login(requestParameters, response, getHandler, dbManager, sessionManager);
        return res;
    }

    this.executeGetContactsController = function(requestParameters, response, getHandler, dbManager)
    {
        console.log("[executeGetContactsController]");
        getContactsController.getContacts(requestParameters, response, getHandler, dbManager);
    }

    this.executeGetChatHistoryController = function(requestParameters, response, getHandler, dbManager, sessionManager)
    {
        console.log("[executeGetChatHistoryController]", JSON.parse(requestParameters.data));
        GetChatHistoryController.getChatHistory(requestParameters, response, getHandler, dbManager, sessionManager);
        //GetChatHistoryController.getChatHistory("P", JSON.parse(requestParameters.data), requestParameters, response, getHandler, dbManager);
    }

    this.executePostMessageController = function(requestParameters, response, getHandler, dbManager, sessionManager)
    {
        console.log("[PostMessageController]");
        postMessageController.postMessage(requestParameters, response, getHandler, dbManager, sessionManager);
    }
}

var respondWithUsername = function(response, username)
{
    console.log("[respondWithUserName]", username);
    response.write(username);
    response.end();
}

var responseWithAllSessions = function(response, sessionManager)
{
    allSessions = sessionManager.returnAllSessions();
    allSessions_JSON = JSON.stringify(allSessions);
    console.log('[responseWithAllSessions]:', allSessions_JSON);
    response.write(allSessions_JSON);
    response.end();
}

var terminateSession = function(requestParameters, response, getHandler, dbManager, sessionManager)
{
    var doomed_session = requestParameters.data ;
    var dSession = JSON.parse(doomed_session) ;
    var sessions = sessionManager.terminateSession(dSession);
    console.log("[Terminate Session]:", sessions);
    var sessions_JSON = JSON.stringify(sessions);
    response.write(sessions_JSON);
    response.end();
}

var registerUser = function(requestParameters, response, getHandler, dbManager, sessionManager)
{
    var newUser_JSON = requestParameters.data ;
    var newUser = JSON.parse(newUser_JSON);
    registerUserController.registerUser(newUser, response, dbManager);
}