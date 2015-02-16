set DEBUG=twittertool
set OPENSHIFT_NODEJS_PORT=80
set OPENSHIFT_MONGODB_DB_HOST=localhost
set OPENSHIFT_MONGODB_DB_PORT=27017
start http://localhost/
nodemon server.js
pause