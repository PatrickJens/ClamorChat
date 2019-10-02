exports.PostJSON = PostJSON ;
const utf8 = require('utf8');

function PostJSON()
{   
    this.mJSON = "dummyJSON" ;
    this.url = "/dummyURL" ;
    

    this.setJSON = function (mJSON)
    {
        this.mJSON = mJSON ;
    }

    this.setURL = function (url)
    {
        this.url = url ;
    }

    this.sendPostRequest = function(mJSON, url)
    {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function()
        {
            if( xhr.readyState == 4 && xhr.status == 200 )
            {
                window.location = 'http://localhost:8080/user-dashboard.html';
                //document.getElementById("debug").innerText = xhr.responseText;
                //document.open();
                //document.write(xhr.responseText);
                //document.close();
            }
        };
        xhr.send(this.mJSON);
    }

}