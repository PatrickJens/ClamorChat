# ClamorChat
Web based chat application deployed on the Heroku cloud. 

In the  DemoPresentation.pptx, start at page 6 for app explanations and some UML

At some point, I'll push the npm_modules folder

---------------------------------------------------------------------------------------------------------------

Some classes like Cookie.js are not user. Some classes like PostJSON is only used once. This was a learning process. 

The main entry point is clamor-server.js; clamor-server.js must be running either locally or in cloud for the application to work

Folders named wxyz-VC means that a MVC (model-view-controller) was implemented for that part of the webpage. Because the data model was simple, only the VC of MVC was explcitly implemented. The only exception is register-user-VC which only contains the registration page .html and uses controller JavaScript code from other MVC folders. 

The user data model is {username, password}

The message data model was {sender_username, receiver_username, message_content}

Dependencies are listed in the package.json file (for localhost) and package-lock.json (for Heroku). The package files are identical; Heroku required dependencies be listed in a file named package-lock.json

Use NPM to download/refresh the dependencies. 

Heroku environment variables are listed in Procfile

When running on localhost, the MySQL connection object in DBManager.js must be changed to match the MySQL connection on the local machine.

The Heroku MySQL API times out after 60 seconds, so a dummy query is executed every 55 seconds.

The Heroku hosting service times out after 30 minutes of inactivity. Any potential employeers or recruiters must contact me (the author) to activate the application for a demo. On Heroku, this application is fully functional although not exactly high security. =)

