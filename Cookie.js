exports.Cookie = Cookie ;
exports.CookieString = cookieToString ;


function Cookie(sid)
{
    this.session_id = sid ;
    this.username = "" ;
    this.iat = Date.now() ;

    this.setUsername = function(username){
        this.username = username ;
    }

    this.addHit = function(url)
    {
        h = new hit(url, Date.now());
        this.hit_history.push(h);
    }

    this.stringifyCookie = function()
    {
        cString = "" ;
        sidString = "session_id=" + this.session_id +";";
        usernameString = "username="+this.username +";";
        cString += sidString + usernameString ;
        return cString ;
    }
}

var cookieToString = function(cookie)
{
    stringArray = [];
    sidString = "session_id=" + cookie.session_id +";" ;
    usernameString = "username="+ cookie.username +";" ;
    stringArray.push(sidString);
    stringArray.push(usernameString);
    return stringArray;
}

function hit(url, date)
{
    this.url = url ;
    this.date = date ;
}