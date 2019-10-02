
var goToLandingPage = function()
{
    window.location = '/' ;
}

var goToRegistrationPage = function()
{
    window.location = '/registration.html'
}

function login()
{
    //Capture user input
    var loginURL = "/user-dashboard.html";
    var username = document.getElementById("username-input").value.toString();
    var password = document.getElementById("password-input").value.toString();
    var credentials = new Credentials(username, password);
    var credentials_JSON = JSON.stringify(credentials);
    

    //POST formatted input
    postJSON = new PostJSON() ;
    postJSON.mJSON = credentials_JSON ;
    postJSON.url = loginURL ;   

    //Send POST request
    postJSON.sendPostRequest();
}

var registerUser = function()
{
    var username = document.getElementById("username-input").value.toString();
    var password = document.getElementById("password-input").value.toString();
    if( username.length < 2 || password.length < 2)
    {
        document.getElementById("user-exists-message").innerHTML = "Username and password must both be at least 3 characters long.";
    }
    else
    {
        alert("You are registered as "+username+"! You will be taken back to the login page.");
        var new_user_object = {username: username, password: password};
        var new_user_JSON = JSON.stringify(new_user_object);
        var xhr = new XMLHttpRequest() ;
        xhr.open('POST', '/register-new-user', true);
        xhr.onreadystatechange = function()
        {
            if( xhr.readyState == 4 && xhr.status == 200 )
            {   
                if(xhr.responseText == "user-exists")
                {
                    document.getElementById("user-exists-message").innerHTML = "Username already exists. Please pick a new username.";
                }
                if(xhr.responseText == "Insert successful")
                {
                    window.location = '/';
                }
            }
        }
        xhr.send(new_user_JSON);
    }

}