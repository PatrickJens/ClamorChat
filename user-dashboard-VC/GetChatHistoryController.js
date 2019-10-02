exports.GetChatHistoryController = GetChatHistoryController ;



function GetChatHistoryController()
{
    //User is receiver_username. Assuming P is this_user
    this.user ;
    this.getUserJSON = function(string_JSON)
    {
        var user_JSON = JSON.parse(string_JSON);
        this.user = user_JSON ;
    }

    this.getChatHistory = function(requestParameters, response, getHandler, dbManager, sessionManager)
    {
            var users_object = JSON.parse(requestParameters.data);
            //console.log("Chat History Object: ", users_object);
            var getMessageHistoryQuery = "SELECT * FROM messages WHERE (sender_username = '"+ users_object.sender_username+"' AND receiver_username = '"+ users_object.receiver_username+"') OR (sender_username = '"+users_object.receiver_username+"' AND receiver_username = '"+ users_object.sender_username+"');" ;
            dbManager.queryDB(getMessageHistoryQuery).then(function(rows)
            {
                var chat_history_JSON = JSON.stringify(rows);
                response.write(chat_history_JSON);
                response.end();
                //sessionManager.io.emit('updateChatEvent', chat_history_JSON) ;
            });
    }

    this.logUser = function()
    {
        console.log("[ChatHistoryController]", this.user)
    }
}