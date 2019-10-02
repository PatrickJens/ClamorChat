exports.PostMessageController = PostMessageController ;

function PostMessageController()
{
    this.postMessage = function(requestParameters, response, getHandler, dbManager, sessionManager)
    {
        message = JSON.parse(requestParameters.data);
        var txrx = {sender_username: message.sender_username, receiver_username: message.receiver_username };
        console.log("txrx: " + JSON.stringify(txrx));
        updateMessagesTable = "INSERT INTO messages (sender_username, receiver_username, message_content) VALUES ('"+
                                            message.sender_username + "' , '" + 
                                            message.receiver_username +"' , '" + 
                                            message.content + "')" ;
        dbManager.queryDB(updateMessagesTable).then(function(){
            sessionManager.io.emit('updateChatEvent', txrx) ;
            response.write(requestParameters.data);
            response.end();
        });

        
    }
}