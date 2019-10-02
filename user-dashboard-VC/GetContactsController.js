exports.GetContactsController = GetContactsController ;

function GetContactsController()
{
    this.getContacts = function(requestParameters, response, getHandler, dbManager)
    {
        dbManager.getAllUsersFromDB().then(function(rows){
            var rows_JSON= JSON.stringify(rows);
            //console.log("[GetContactsController]: rows", rows_JSON);
            response.write(rows_JSON);
            response.end();
        });  
    }
}