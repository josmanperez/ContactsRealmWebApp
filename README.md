# ContactsRealmWebApp
Application to demonstrate how to use Realm Sync with a Web App to do basic operations (CRUD)

# Live Example
This is the live example of the Web application running

[![Live Example](http://g.recordit.co/5Ig4TUvKY6.gif)](https://drive.google.com/file/d/1jv02y5Z7yf8lUe57jUKWi_xne3dKro8t/view?usp=sharing)

# Description

This application will list a table of contacts added to Mongo Realm and will synchronize the data with Realm Sync.

Operation allowed:

1. Create a new contact
2. Update contact 
3. Delete contact
4. Show list of contacts

## Dependencies & Prerequisites 

This application is self-contained in a Docker container. You need to set several things in order to build and run this application.

### Mongo Realm & Docker

1. You need to add your Realm Id to `api.files/routes/contacts.js` file in order to be able to open a Realm with your Realm Cloud.
2. Change `.env` variables to match your working directory.
   1. `CLIENT_PATH:` Is the directory where you've clone this project plus the folder `/api.files`.
   2. `BACKEND_PATH:` Is the directory where you've clone this project.
   3. `NGINX_APIX_LOGS:` Is the directory where you want to store the client logs file

Example of a `.env` file:
```
# Application's path (absolute or relative)
CLIENT_PATH={{current-directory}}/api.files/
BACKEND_PATH={{current-directory}}

# Logs path
NGINX_APIX_LOGS={{current-directory}}/logs/nginx/
```

### Packages needed 

This project is based on NodeJS and Bootstrap. These are the libraries used in this project:

- npm
- express
- nodemon
- realm
- socket
- cors
- bson

All these libraries are in the `package.json`. 
When executing a `docker-compose up --build -d` all the packages are automatically installed.

# Step by Step

Follow the link to the [Wiki](https://github.com/josmanperez/ContactsRealmWebApp/wiki) page for a step by step instruccionts on how to run this application.   