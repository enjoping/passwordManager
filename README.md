# passwordManager
### Developed by
- Joe Pietler
- Lukas Schardt
- Marcel Bös
- Patrick Holetzky

## Testing instance
We've created a testing instance wich can be used to test the passwordManager without a need to install it. This can be
found on http://fwe.h2652485.stratoserver.net/. Besides we've created a small landingpage which informas interested
users about our product and how to install it. This can be found at http://info.fwe.h2652485.stratoserver.net/

## Short description
The passwordManager is an easy and use tool to manage passwords in a team. It features a user and group management and
is based on modern encryption techniques and the WebCripto API which is build in into all modern Browsers. The frontend
is based on Angular 4, the backend is based on Node.js and uses a MongoDB for storing data. A detailed description of
used technologies can be found later in this documentation.

## Supported Browsers
Our web application is based on SubtleCrypto which is part of the WebCripto API. At the moment it is supported by:
- Google Chrome 37
- Microsoft Edge 20
- Mozilla Firefox 34
- Opera 24

Following browsers have a simple Implementation included but named it differently. So it may be possible to support
these in the future but it will require a lot of heavy testing:
- Microsoft Internet Explorer 11
- Apple Safari 8

## Security concept
One of the main problems of a secure encryption process is the exchange of passwords. A common approach is to use
a hybrid cryptosystem. Therefore we create a RSA keypair for every user which is generated by the users browser. The
private key will only be stored in the browsers indexedDB. For this prototype it is stored without any encryption as
resulted in a broken key but a goal for the next release would be the encryption using the users password. The users
public key will be send to the backend and stored in the database.  
The RSA keypair will not be used for the direct encryption of a password because of two main reasons:
1. Public-key encryption is a slow form of encryption and is very limited in the length the data to be crypted can have.
2. We've focused on a group based system from the beginning on. If we want to encrypt passwords using a public-key we
 need to do this for every single user of a group. This would result in a big number of encrypted strings per group
 (number of passwords * number of users). Besides every single password of a group needs to be decrypted and encrypted
 when adding a user to a group and every new password needs to be encrypted with the pulic keys of all members.
 
Because of these reasons we've decided to create a group key for every new group which is then used to encrypt and
decrypt all passwords of this group using the advanced encryption standard in counter mode. With this solution we only
need to store the groups key encrypted by all members public keys and all keys are encrypted using the group key. With
this solution we only need to store a much smaller number of encrypted strings (number of passwords + number of user).
Whenever a new user is added to a group only the group key needs to be decrypted and then encrpyted with the users
public key. When adding a new password to a group the user only needs to load the groups key, decrypt it with his
private key and encrypt the new password with it. 

## System requirements and installation
When installing the application on your own you need to make sure to have a running MongoDB as well as an installation
of a current Node.js version. We recommended using the Docker version which allows a very simple and fast usage of our
tool. You just need to download the current version from http://info.fwe.h2652485.stratoserver.net/build.tar.gz This
link can also be found on the landingpage. To use this version please make sure you have a working installation of
Docker running on your local machine.  
Unarchive the tar.gz file and direct into to extracted folder using your favourite terminal which includes bash. Now you
need to run the init.sh file like `bash init.sh`. This will start the docker container as well as the passwordManager
application which will be running on port 3000. The output of the init.sh script will ask you to open
`http://localhost:3000/install` on which you will be able to create the administrator account. If you are on a Mac your
default browser will automatically be opened with this page. As we are creating your keypair when creating an account
please make sure to use on of the supported browsers otherwise you will just see an alert message.  
Please also be aware of the fact that you can use an account only with the browser you've created it in as it will store
the keypair and we have no export and import functionality at the moment.  
After creating your administrator account you can start using the passwordManager.

___

## Backend
The backend is a Class based Node.js application written in TypeScript wich uses express to run a web server as well as
passport for a user and authentication handling.

### Server
In production the backend is not only used to provide rest interfaces to work with any kind of data it also delivers the
frontend web application as well as the installation page. This not only prevents cross origin problems but also only
requires one single server to make the complete application work. As a software to build this server we've used express.

### Database
The application is build based on a mongoDB and all requests are handled by Mongoose. To archive numerical IDs we've
used the package mongoose-auto-increment. This allows us to have human readable IDs for users, groups and nodes.

### User and session management
The user management as well as logging in is done by Passport which handles the creation of new users including the
encryption of their password. It also handles the login of a user and creates a session token which includes the users
ID and role. On every request a user does to the REST interfaces he needs to send his session token which automatically
get's encrypted.

### Structure
We've build the backend on TypeScript to make use of it's type definitions. Besides it's mostly build on classes.  
A documentation of all REST interfaces can be found in the Wiki section of this repository:
https://gl.fbi.h-da.de/fwe-ss2017/projekte/passwordmanager/wikis/api-description

___

## Frontend
The frontend uses angular cli as a command line interface.

### Structure
The frontend source code is split into several dedicated categories, which can be found in frontend/src/app.

- Components
Each subfolder of the components folder is grouped by their task, e.g. the login subfolder contains the 
html, typescript and scss files, which implementation will allow the user to login. 
Some of these subfolders additionally represent reoccuring components, so they were created with reusability in mind
and therefore are imported into several other components.

- Models
The models folder groups the entities classes, that we instantiate elsewhere and send to the backend for persistance, e.g. user.model.ts.
Thus they have to define the same attributes as their backend counterparts.

- Pages
Each subfolder represents a navigable page in the web browser. 
E.g. the login folder provides the framework for the login page and imports the login component.

- Services
Each service class matches an API that the backend provides for group/note/user persistance, user registering or user authorisation.
Some services make sure that only authorised users are granted access to frontend functionality, they are the backbone of the password manager. 
Many of them import abovementioned model classes to return promises of these for the app components.
To provide offline functionality, the subfolder services/repositories contains classes for all those services, 
that should continue working in offline mode. 

### Routes

- /
The default route allows registered users to login, using their username and password.

- /groups
Upon a succesfull login, the user will find themselves on the groups page, 
that allows creating groups and therefore also security notes inside those groups.

- /admin
These will be only accessible for users with admin rights.
While /admin/users shows a list of all registered users, that allows to edit or delete them, 
(provided the logged in user is authorised to do so) the invite function also makes it possible to 
send invite tokens to persons.
/admin/groups is the equivalent to the users page for groups. 
It's possible to change group owners based on their user id or to delete them together with their security notes.

- invite/:token
This route will be part of the invitation. :token is replaced with a unique invite token, provided by the respective backend API.

___

## Additional components
Besides the frontend and backend which are the main components of the passwordManager we have a few additional
components which make the usage of our tool very easy.

### Continuous integration
We've used Gitlab CI to continuously build and deploy our application from the beginning on. We use it for automated
testing and linting of all branches as well as building and deploying our application to a develop and live system.
More information on what exactly happens on every deployment can be found in the **.gitlab-ci.yml** file in the root
directory of this project.

### Gulp
As we've wanted to make our application depend on as few other tools as possible we deliver a pure javascript
application. Therefore we needed to compile all the typescript files we have in the backend to javascript and uglify
them to make our project as small as possible. This is done using gulp as it has easy to use parsers for typescript.

### Build archive and Docker
To allow an interested user to make our application work as fast as possible we wanted to use Docker but we thought
about how to ship our application to the user. Therefore we create a tar archive on every develop and master deployment
which can be downloaded through the landingpage. The package includes the complete code of the frontend and backend as
well all files needed for the Docker container and the installation process.  
At first it was planned to have the code and the database separated into two Docker containers. This sadly did not work
as the backend was not able to connect to the database. Therefore we are now using only one container based on Alpine
Linux which is an extremely small version of Linux which allows a fast installation and has only small requirements to
be run.  
The Docker container only exposes port 3000 which allows the user the user to work with the passwordManager without
blocking other ports like the mongoDB default port.

### Installation
We wanted to make installing the passwordManager as easy as possible. Therefore we've created a archive which contains
all data needed to run our code including files to start a Docker container as well as a **init.sh** file which can be
found in the backend folder of this project.  
It simply builds and starts the Docker container, logs into the container and starts the Node.js application. The user
will then be prompted to open the installation page which is a static HTML page which can be found in
**backend/installation**. This page is used to create an administrator account as only accounts you've been invited to
can be created otherwise. The administrator account could not be created automatically as a keypair is needed to use
our tool correctly. Therefore we've created the installation page on which the users keypair get created before sending
the users credentials to the backend. After the data has been saved correctly the user will be redirected to the start
page of the frontend.

### Landingpage
To generate a professional look we've created a simple landingpage which informs potential users of our tool about how
it works and how easy you can start working with it. It is located in the **frontend** folder in the root directory. It
is based on Bootstrap 4 and features a download button which allows interested users to download our build archive which
is automatically copied into the landingpages folder.

### Encryption prototype
On of the main points of our tool is the encryption and decryption and as we need to implement this feature correctly
and equal everywhere it is needed we've created a prototype to show the process of creating a user, a group and a
security node inside the group as well as adding a new user to this group. To make calls to these functions as easy as
possible we wrote a class which handles the storage of a key but also offers functions to encrypt and decrypt strings.
The complicated part about encryption and decryption is that it's based on binary values (ArrayBuffers) instead of other
data types. Therefore we need a lot of conversions from a string to an ArrayBuffer and vice versa. Therefore the class
handles all these operations and everyone who needs to work with the class can use strings in most cases.
