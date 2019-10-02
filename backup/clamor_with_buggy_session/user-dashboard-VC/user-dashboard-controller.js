//Global variables
var contacts_list = [] ;
var active_sessions = [] ;
var session_user = "";
var other_user = "" ;
var previousRowId = "" ;


//Socket listeners
var socket = io() ;

socket.on('updateNumUsers', function(numUsers)
{
    string = "Num users: " + numUsers ;
    setDebugBlock(string) ;
});

socket.on('login', function(username)
{
    string = "Someone logged in" ;
    setDebug2Block(string) ;
});

//User dashboard functionality
var initializeDashboard = function()
{
    getSessionUser();
    getContacts();
    getAllSessions();
}

var getAllSessions = function()
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/get-all-sessions', true);
    xhr.onreadystatechange = function()
    {
        if( xhr.readyState == 4 && xhr.status == 200 )
        {
            setDebug2Block(xhr.responseText);
            allSessions = JSON.parse(xhr.responseText);
            setSessionContacts(allSessions);
        }
    };
    xhr.send();
}

var setSessionContacts = function(allSessions)
{
    var i = 0 ;
    var j = 0 ;

    //Get collection of td objects representing online/offline dot
    contacts = document.getElementsByClassName('contacts-table-entry-dot');
    var username ;
    //username = getUsernameFromRowId(contacts[i].getAttribute('id')) ;
    //setDebugBlock(username);
    //setDebug2Block(allSessions[0].username);
    
    //For each element in contacts
    for(i = 0 ; i < contacts.length - 1 ; i ++)
    {
        username = getUsernameFromRowId(contacts[i].getAttribute('id')) ;
        setDebug2Block(username);
        for(j = 0 ; j < allSessions.length ; j ++)
        {
            if(allSessions[j].username == username)
            {
                contacts[i].setAttribute("class", "contacts-table-entry-dot-online");
            }
            else
            {
                contacts[i].setAttribute("class", "contacts-table-entry-dot");
            }
        }
    }
}

var getSessionUser = function()
{
    var session_id = document.cookie ;
    setDebugBlock(session_id) ;
    getUserFromServer(session_id);
}

var getUserFromServer = function(sid)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/get-session-user', true);
    xhr.onreadystatechange = function()
    {
        if( xhr.readyState == 4 && xhr.status == 200 )
        {
            session_user = xhr.responseText ;
            //document.cookie = "username=" + session_user ;
            document.getElementById("logged-in-user").innerHTML = session_user ;
        }
    };
    xhr.send(sid);
}

var setDebugBlock = function(text)
{
    document.getElementById("debug").innerHTML = text ;
}
var setDebug2Block = function(text)
{
    document.getElementById("debug2").innerHTML = text ;
}

var populateContactsTable = function(contacts_JSON)
{
    var contacts_table = document.getElementById("contacts-table");
    for( var i = 0 ; i < contacts_JSON.length ; i ++)
    {
        //create row
        var row = contacts_table.insertRow();
        row.setAttribute("class", "contacts-table-entry-row");
        row.setAttribute("id", "contacts-table-entry-row-"+contacts_JSON[i].username);
        row.setAttribute("onclick", "getChatHistory(this.id)");
        
        //create 
        var dot_cell = row.insertCell();
        dot_cell.setAttribute("class", "contacts-table-entry-dot");
        dot_cell.setAttribute("id", "contacts-table-entry-dot-"+contacts_JSON[i].username);
        
        //create, configure, and append username td, aka cell
        var user_cell = row.insertCell();
        user_cell.setAttribute("class", "contacts-table-entry-user");
        user_cell.setAttribute("id", "contacts-table-entry-user-"+contacts_JSON[i].username);
        var text = document.createTextNode(contacts_JSON[i].username);
        user_cell.appendChild(text);
    }
}

var getContacts = function()
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/user-dashboard-get-contacts', true);
    xhr.onreadystatechange = function()
    {
        if( xhr.readyState == 4 && xhr.status == 200 )
        {
            contacts_string = xhr.responseText ;
            contacts_JSON = JSON.parse(contacts_string);
            populateContactsTable(contacts_JSON);
        }
    }
    xhr.send();
}

populateMessagesContainer = function(messages_JSON_string)
{
    
    messages_JSON = JSON.parse(messages_JSON_string);
    if(!messages_JSON){

    }
    var i = 0 ;
    //Identify messages root
    var messages_root = document.getElementById("chat-messages-container");
    var text ;
    
    //If no chat history, populate chat box with a no chats mesage
    if(messages_JSON == "")
    {
        var no_messages = document.createElement("div");
        no_messages.setAttribute('class', 'no-chats-message');
        text = document.createTextNode("Send a message to join the Clamor!");
        no_messages.appendChild(text);
        messages_root.appendChild(no_messages);
    }

    var specifiedUser ; 
    for( i = 0 ; i < messages_JSON.length ; i ++ )
    {
        //Create message box
        var message_box = document.createElement("div");
        if(messages_JSON[i].sender_username == session_user)
        {
            message_box.setAttribute("class", "chat-message-session-user");
            specifiedUser = "-session";
        }
        else{
            message_box.setAttribute("class", "chat-message-other-user");
            specifiedUser = "-other";
        }
        
        //Create User Badge Div
        var user_badge = document.createElement("div");
        user_badge.setAttribute("class", "chat-message-user-badge");
        text = document.createTextNode(messages_JSON[i].sender_username);
        user_badge.appendChild(text);    
        messages_root.appendChild(user_badge);

        //Create Message Content Div
        var content = document.createElement("div");
        content.setAttribute("class", "chat-message-content"+specifiedUser);
        text = document.createTextNode(messages_JSON[i].message_content);
        content.appendChild(text);
        messages_root.appendChild(content);
        //setDebugBlock(messages_JSON.length);
        
        //Append Badge and Content to message box
        message_box.append(user_badge);
        message_box.append(content);

        //Append message box to message container roor
        messages_root.append(message_box);
    }
}

var removeMessages = function()
{
    var session_user_chats = document.getElementsByClassName("chat-message-session-user");
    var other_user_chats = document.getElementsByClassName('chat-message-other-user');
    var no_chats = document.getElementsByClassName('no-chats-message');
    var no_contact = document.getElementById('no-other_user_message');
    var i = 0 ;
    if(session_user_chats.length > 0 )
    {
        for(i=session_user_chats.length - 1 ; i >= 0; i-- )
        {
            session_user_chats[i].remove();
        }
    }
    if(other_user_chats.length > 0)
    {
        for(i=other_user_chats.length - 1 ; i >= 0 ; i --)
        {
            other_user_chats[i].remove();
        }
    }
    if(no_chats.length > 0)
    {
        for(i=no_chats.length - 1 ; i >= 0 ; i --)
        {
            no_chats[i].remove();
        }
    }
}

setChatTitle = function(rowId)
{
    var username = getUsernameFromRowId(rowId);
    var chat_title_element = document.getElementById("chat-title-container");
    var new_chat_title = "Chat with "+username;
    chat_title_element.innerHTML = new_chat_title ;
}

var getChatHistory = function(rowId)
{
    setChatTitle(rowId);
    if( rowId != previousRowId)
    {   
        removeMessages();
        
        //JSONify username
        var username = getUsernameFromRowId(rowId);
        var user_object = {username: username};
        var user_JSON = JSON.stringify(user_object);

        //Send XMLHttpRequest
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/get-chats', true);
        //xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function()
        {
            if( xhr.readyState == 4 && xhr.status == 200 )
            {
                populateMessagesContainer(xhr.responseText);
            }
        };
        xhr.send(user_JSON);
        previousRowId = rowId;
    }
}

getUsernameFromRowId= function(rowId)
{
    username = "" ;
    var i = 0 ;
    for(i = rowId.length - 1 ; i >= 0 ; i -- )
    {
        if( rowId.charAt(i) == "-")
        {
            break ;
        }
    }
    for( ++i ; i < rowId.length ; i ++ )
    {
        
        username += rowId.charAt(i) ;
    }
    other_user = username;
    return username ;       
}

sendMessageRequest = function()
{
    var chat_content = document.getElementById("enter-message-field").value.toString() ;

    if(other_user == "")
    {
        alert("Select a Contact before sending a message!")
    }
    if( chat_content == "")
    {
        alert("Please enter a message before sending");
    }
    else
    {
        var message = {sender_username: session_user, receiver_username: other_user, content: chat_content};
        message_JSON = JSON.stringify(message);
        postMessage(message_JSON);
    }
}

postMessage = function(message_JSON)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/post-message', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function()
    {
        if( xhr.readyState == 4 && xhr.status == 200 )
        {
            addMessageToChat(xhr.responseText);
        }
    };
    xhr.send(message_JSON);
}

addMessageToChat = function(requestParameters)
{
    message_obj = JSON.parse(requestParameters);
    
    //Identify messages root
    var messages_root = document.getElementById("chat-messages-container");
    var text ;
    var specifiedUser ;
    
    //Create message box
    var message_box = document.createElement("div");
    message_box.setAttribute("class", "chat-message-session-user");
    specifiedUser = "-session";

    //Create User Badge Div
    var user_badge = document.createElement("div");
    user_badge.setAttribute("class", "chat-message-user-badge");
    text = document.createTextNode(message_obj.sender_username);
    user_badge.appendChild(text);    
    message_box.appendChild(user_badge);

    //Create Message Content Div
    var content = document.createElement("div");
    content.setAttribute("class", "chat-message-content"+specifiedUser);
    text = document.createTextNode(message_obj.content);
    content.appendChild(text);
    message_box.appendChild(content);

    //Append Message To Root
    messages_root.appendChild(message_box);
}
