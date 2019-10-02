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

    this.getChatHistory = function(sender_username, receiver_username, requestParameters, response, getHandler, dbManager)
    {
            var getMessageHistoryQuery = "SELECT * FROM messages WHERE (sender_username = '"+sender_username+"' AND receiver_username = '"+receiver_username+"') OR (sender_username = '"+receiver_username+"' AND receiver_username = '"+sender_username+"');" ;
            dbManager.queryDB(getMessageHistoryQuery).then(function(rows)
            {
                var chat_history_JSON = JSON.stringify(rows);
                //console.log(chat_history);
                response.write(chat_history_JSON);
                response.end();
            });
    }

    this.logUser = function()
    {
        console.log("[ChatHistoryController]", this.user)
    }
}