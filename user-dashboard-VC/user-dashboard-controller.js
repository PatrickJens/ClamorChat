//Global variables
var session_user = "";
var sid = "" ;
var contacts_list = [] ;
var allSessions ;
var other_user = "" ;
var previousRowId = "" ;
var updateChat = 0 ;
var landingPageLocation = "" ;

//Instantiate PostJSON to get landing page to get port number and define landing page location
var postJSON = new PostJSON() ;
postJSON.getPortNumber();
landingPageLocation = postJSON.getLandingPageAddress();



//Socket listeners
var socket = io() ;

socket.on('login', function()
{
    getSessionUser() ;
    getAllSessions() ;
});

socket.on('updateContacts', function()
{
    //setDebug4Block("UPDATE CONTACTS WORKED!!");
    getAllSessions();
    turnOffOnlineDots();
});

socket.on('updateChatEvent', function(txrx) //txrx is a object // pass the object
{
    var txrx_str = JSON.stringify(txrx);
    if( txrx.receiver_username == session_user)
    {
        //setDebug4Block("UPDATE CHATS EVENT txrx: " + txrx_str);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/get-chats', false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function()
        {
            if( xhr.readyState == 4 && xhr.status == 200 )
            {
                removeMessages();
                populateMessagesContainer(xhr.responseText);
            }
        };
        xhr.send(txrx_str);
    }
});


//Boot up dashboard  
var initializeDashboard = function()
{
    checkCookie();
    getSessionUser();
    getContacts();
    getAllSessions();
}

var checkCookie = function()
{
    var cookies = document.cookie ;
    cookies_string = cookies.toString();
    //setDebug4Block(cookies_string);
    if( !cookies )
    {
        window.location = '/';
    }
}

var getSessionUser = function()
{
    sid = document.cookie ;
    //setDebugBlock(sid) ;
    getUserFromServer(sid) ;
}

var turnOffOnlineDots = function()
{
    var i = 0 ;
    var j = 0 ;
    var onlineDots =  document.getElementsByClassName('contacts-table-entry-dot-online') ;
    var username ;
    var present = 0 ;
    for(i=0; i < onlineDots.length; i ++)
    {
        username =  getUsernameFromRowId(onlineDots[i].getAttribute('id')) ;
        
        for( j = 0 ; j < allSessions.length ; j ++ )
        {
            if(username == allSessions[j].username)
            {
                present = 1 ;
            }
        }
        if(present == 0 )
        {
            onlineDots[i].setAttribute("class", "contacts-table-entry-dot");
        }
        present = 0 ;
    }
}

var getUserFromServer = function(sid)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/get-session-user', false);
    xhr.onreadystatechange = function()
    {
        if( xhr.readyState == 4 && xhr.status == 200 )
        {
            session_user = xhr.responseText ;
            //document.cookie = "username=" + session_user ;
            document.getElementById("logged-in-user").innerHTML = session_user ;
        }
    }
    xhr.send(sid);
}

var getContacts = function()
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/user-dashboard-get-contacts', false);
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
var getAllSessions = function()
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/get-all-sessions', false);
    xhr.onreadystatechange = function()
    {
        if( xhr.readyState == 4 && xhr.status == 200 )
        {
            setDebug2Block("All sessions from server (Debug2): " + xhr.responseText) ;
            allSessions = JSON.parse(xhr.responseText) ;
            setSessionContacts(allSessions) ;
        }
    };
    xhr.send();
}

var setSessionContacts = function(allSessions)
{
    var root = document.getElementsByTagName('tbody');
    treeLength = root[0].children.length ;
    var i = 0 ;
    var j = 0 ;
    for(i = 0 ; i < treeLength ; i ++ )
    {
        username = getUsernameFromRowId(root[0].children[i].children[0].getAttribute('id'));
        for(j=0 ; j < allSessions.length ; j ++ )
        {
            if(allSessions[j].username == username)
            {
                root[0].children[i].children[0].setAttribute('class', "contacts-table-entry-dot-online");
            }
        }
    }
}
var setDebugBlock = function(text)
{
    document.getElementById("debug").innerHTML = text ;
}
var setDebug2Block = function(text)
{
    document.getElementById("debug2").innerHTML = text ;
}
var setDebug3Block = function(text)
{
    document.getElementById("debug3").innerHTML = text ;
}
var setDebug4Block = function(text)
{
    document.getElementById("debug4").innerHTML = text ;
}
var populateContactsTable = function(contacts_JSON)
{
    setDebug3Block("[Populate Contacts Table]:" + session_user);
    var contacts_table = document.getElementById("contacts-table");
    for( var i = 0 ; i < contacts_JSON.length ; i ++)
    {
        if(contacts_JSON[i].username != session_user)
        {

        //create row
        var row = contacts_table.insertRow();
        row.setAttribute("class", "contacts-table-entry-row");
        row.setAttribute("id", "contacts-table-entry-row-"+contacts_JSON[i].username);
        row.setAttribute("onclick", "getChatHistory(this.id)");
        
        //create online/offline dot
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
}

populateMessagesContainer = function(messages_JSON_string)
{
    messages_JSON = JSON.parse(messages_JSON_string);
    if(!messages_JSON){
        setDebug4Block("[Error]: No messages JSON");
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
        var o_user = getUsernameFromRowId(rowId);
        var users_object = {sender_username: session_user, receiver_username: o_user };
        var users_JSON = JSON.stringify(users_object);

        //Send XMLHttpRequest
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/get-chats', false);
        //xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function()
        {
            if( xhr.readyState == 4 && xhr.status == 200 )
            {
                populateMessagesContainer(xhr.responseText);
            }
        };
        xhr.send(users_JSON);
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
    xhr.open('POST', '/post-message', false);
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

addMessageToChat = function(requestParameters) //contains the entire message
{
    message_obj = JSON.parse(requestParameters);
    //setDebug4Block("addMessageToChat " + requestParameters);
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

var logout = function()
{
    window.location = '/';
    // terminateSession();
    // socket.emit('logout');
    // document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //goToLandingPage();
}

// //Other browser events programmed to trigger logout
window.addEventListener('beforeunload', function (e) {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = 'Exiting the application' ;

    terminateSession();
    socket.emit('logout');
    document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });

var terminateSession = function()
{
    //Get sid from sid cookie name/value pair
    var sessionId = extractValueFromCookie(sid);

    //JSON-ify sid and username
    var session_JSON = { 'sid': sessionId, 'username': session_user };
    var session_JSON_string = JSON.stringify(session_JSON);

    //Issue AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/terminate-session', false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function()
    {
        if( xhr.readyState == 4 && xhr.status == 200 )
        {
            setDebug3Block(xhr.responseText);
        }
    };
    xhr.send(session_JSON_string);
}

var goToLandingPage = function()
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/', true);
    xhr.onreadystatechange = function()
    {
        if( xhr.readyState == 4 && xhr.status == 200 )
        {
            setDebug3Block(postJSON.getLandingPageAddress());
            window.location = landingPageLocation;
        }
    };
    xhr.send(); 
}

var extractValueFromCookie = function(cookie)
{
    nameValue = cookie.split("=");
    //setDebugBlock(nameValue);
    return nameValue[1] ;
}


