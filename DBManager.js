exports.DBManager = DBManager ;

const qs = require('querystring');
const mysql = require('mysql');

var localConfig = {
    host: 'localhost',
    user: 'root',
    password: 'purpleunicornsdancing',
    database: 'clamordb'
};

var herokuConfig = {
    host:'us-cdbr-iron-east-02.cleardb.net',
    user:'b5344004750753',
    password:'df74333f',
    database: 'heroku_6ab038a0cbb264f'
};



function DBManager()
{
    /* Start connect to database*/
    var connection = mysql.createConnection(localConfig);

    connection.connect(function(err)
    {
        if(err){
            console.error('error connecting' + err.stack);
            return;
        }
        console.log('Connected to DB on thread id: ' + connection.threadID);
    }); 
    /* Database connection completed */

    this.insertDB = function(query_string)
    {
        return new Promise(function(resolve, reject){
            connection.query(query_string, function(err, rows){
                if(err){
                    reject(err);
                }
                resolve("Insert successful");
            });
        });
    }

    this.queryDB = function(query_string)
    {
        return new Promise(function(resolve, reject)
        {
            connection.query(query_string, function(err,rows){
                if(err){ 
                    reject(err);
                }
                resolve (rows);
            });
        });
    }

    this.selectUserFromDB = function(username)
    {
        return new Promise(function(resolve, reject)
        {
            connection.query("SELECT * FROM users WHERE username = '" + username + "'", function(err,rows){
                if(err){ 
                    reject(err);
                }
                resolve (rows);
            });
        });
    }

    this.getAllUsersFromDB = function()
    {
        return new Promise(function(resolve, reject)
        {
            connection.query("SELECT * FROM users;", function(err,rows){
                if(err){
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
}