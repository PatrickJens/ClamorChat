document.getElementById(id).innerHTML = "JS EXECUTED";
function getdata()
{
    var http = new XMLHttpRequest();
    if(http) 
    {
        //console.log("req SUCCESS created");
    }
    http.onreadystatechange = function(){
        if( http.readyState == 4 && http.status == 200)
        {
            var text = http.responseText;
            document.getElementById("welcome-text").innerHTML = http.responseText;
        }
    };
    http.open('GET', '/userdata' , true);
    http.send(null);
};