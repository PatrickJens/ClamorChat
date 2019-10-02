exports.RegisterUserController = RegisterUserController ;

//Global Variables


var checkIfUserExists = function()
{
    //query DB for username
}

this.addNewUser = function()
{
    //insert user into DB
}

function RegisterUserController()
{
    this.registerUser = function(newUser, response, dbManager)
    {
      
        dbManager.selectUserFromDB(newUser.username).then(function(rows){
            
            if( rows.length == 0 )
            {
                var insertQuery = 'INSERT INTO users (username, password) VALUES ("' + newUser.username + '", "'+ newUser.password + '");';
                
                dbManager.insertDB(insertQuery).then(function(value){
                        console.log('[RegisterUserController] value: ', value);
                        response.write(value);
                        response.end();
                });
            }
            else
            {
                response.write("user-exists");
                response.end();
            }
        });
        //if yes, add to db
        //if no, send response text saying username already exists
    }
}
