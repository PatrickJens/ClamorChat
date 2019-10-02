exports.PostMessageController = PostMessageController ;

function PostMessageController()
{
    this.postMessage = function(requestParameters, response, getHandler, dbManager)
    {
        message = JSON.parse(requestParameters.data);
        updateMessagesTable = "INSERT INTO messages (sender_username, receiver_username, message_content) VALUES ('"+
                                            message.sender_username + "' , '" + 
                                            message.receiver_username +"' , '" + 
                                            message.content + "')" ;
        dbManager.queryDB(updateMessagesTable).then(function(){
            //console.log()
            response.write(requestParameters.data);
            response.end();
        });

        
    }
}