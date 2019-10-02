exports.GetHandler = GetHandler ;

const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql');

/*
Author: Patrick Cannell, patrick.cannell@crygp.com

This class accepts a HTTP GET request URL and returns an HTTP response to the client.
The this.urls is a list of tuple objects representing accepted URLs and relative paths to resources on the server. 

Class operation is defined by the following steps:

1. Translate the request URL to a uniform resource identifer (urn)
2. Get the file extension from the urn
3. Set response content-type base on the file extension
4. Read file async from server
5. Write and send the response

*/

function GetHandler()
{
    this.response_content_type = "" ; 
    this.urn_path = "" ;

    this.urls = [
        { url: '/', urn: './landing-page-VC/landing-page.html' } ,
        { url: '/favicon.ico', urn: 'images/favicon.ico'} ,
        { url: '/landing-page.css', urn: './landing-page-VC/landing-page.css'},
        { url: '/landing-page-controller.js', urn: './landing-page-VC/landing-page-controller.js'},
        { url: '/PostJSON.js', urn: './PostJSON.js' },
        { url: '/Cookie.js', urn:'./Cookie.js'},
        { url: '/user-dashboard.html', urn: './user-dashboard-VC/user-dashboard.html' },
        { url: '/user-dashboard-controller.js', urn: './user-dashboard-VC/user-dashboard-controller.js'},
        { url: '/user-dashboard.css', urn: './user-dashboard-VC/user-dashboard.css'},
        { url: '/register-page.html' , urn: './register-user-VC/register-user.html'}
    ] ;

    //1. Identify server resource
    this.getResourceURN = function(requestURL)
    {
       for( let i = 0 ; i < this.urls.length; i ++)
       {
           if( this.urls[i]["url"] == requestURL )
           {
               this.urn_path = this.urls[i]["urn"] ;
               return this.urls[i]["urn"] ;
           }
       } 
    }

    //2. Get content type extension
    this.getContentTypeExtension = function()
    {
        this.response_content_type = "" ;
        var i = 0 ;
        for(i = this.urn_path.length - 1 ; i >= 0 ; i -- )
        {
            if( this.urn_path.charAt(i) == ".")
            {
                break ;
            }
        }
        for( ++i ; i < this.urn_path.length ; i ++ )
        {
            
            this.response_content_type += this.urn_path.charAt(i) ;
        }       
    }

    //3. Write response content type based on file extension
    this.setResponseContentType = function(res)
    {
        switch(this.response_content_type)//urn_content_type
        {
            case "html":            res.setHeader("Content-Type", "text/html"); break;
            case "css" :            res.setHeader("Content-Type", "text/css"); break;
            case "js"  :            res.setHeader("Content-Type", "text/javascript"); break;
            case "ico" :            res.setHeader("Content-Type", "image/vnd.microsoft.icon"); break;
        }
    }

    //4. Read file contents asynchronously from server
    this.getFileContent = function(urn_path)
    {
        return new Promise(function(resolve, reject)
        {
            fs.readFile(urn_path, function(err, data)
            {
                if(err)
                {
                    reject(err);
                } 
                else
                {
                    resolve(data);
                } 
            });
        });
    }

    //5. Write file contents to a HTTP response on completion of the async promise
    this.sendResponse = function(requestURL, res)
    {
        this.getResourceURN(requestURL);                                //1
        this.getContentTypeExtension();                                 //2
        this.setResponseContentType(res);                               //3
        this.getFileContent(this.urn_path).then(function(data)          //4 then 5
        { 
            res.write(data);
            res.end();
        });
    }

    this.postSendResponse = function(requestParameters, response)
    {
        this.getResourceURN(requestParameters.url);                                
        this.getContentTypeExtension();   
        this.setResponseContentType(response);                                                          
        this.getFileContent(this.urn_path).then(function(data)          
        {   
            response.write(data);
            response.end();
        });
    }
}