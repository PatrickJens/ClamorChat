exports.PostHandler = PostHandler ;

//Import controller files
const lc = require("./landing-page-VC/LoginController");
const gcc = require("./user-dashboard-VC/GetContactsController");
const gchc = require("./user-dashboard-VC/GetChatHistoryController");
const pmc = require("./user-dashboard-VC/PostMessageController");

//Instantiate controller objects
var loginController = new lc.LoginController();
var getContactsController = new gcc.GetContactsController();
var GetChatHistoryController = new gchc.GetChatHistoryController();
var postMessageController = new pmc.PostMessageController();

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
            case '/get-chats':                      this.executeGetChatHistoryController(requestParameters, response, getHandler, dbManager);
                                                    break;      
            case '/post-message':                   this.executePostMessageController(requestParameters, response, getHandler, dbManager);
                                                    break;
            case '/get-session-user':               respondWithUsername(response, sessionManager.getUsernameFromCookieSid(requestParameters.data)) ;
                                                    break;
            case '/get-all-sessions':               responseWithAllSessions(response, sessionManager);   
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

    this.executeGetChatHistoryController = function(requestParameters, response, getHandler, dbManager)
    {
        console.log("[executeGetChatHistoryController]", JSON.parse(requestParameters.data).username);
        GetChatHistoryController.getChatHistory("P", JSON.parse(requestParameters.data).username, requestParameters, response, getHandler, dbManager);
    }

    this.executePostMessageController = function(requestParameters, response, getHandler, dbManager)
    {
        console.log("[executeGetChatHistoryController]");
        postMessageController.postMessage(requestParameters, response, getHandler, dbManager);
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
    console.log('[respondWithAllSessions]:', allSessions_JSON);
    response.write(allSessions_JSON);
    response.end();
}

