-----------------------COMP2800 PROJECT---------------------
Application Name: WeCool Release version 1.0
School: BCIT
Team: BBY-16
Team Members:
 -[Andy Tran], [A0166629], [Set 2D]
 -[Buck Sin], [A00805677], [Set 1B]
 -[Doohyung Kim], [A01268522], [Set 2C]
 -[Lester Shun], [A01312027], [Set 1B]

Github Repo Link: 
https://github.com/dennisdkim/2800-202210-BBY16


---------------------PROJECT DESCRIPTION---------------------
Our team, BBY-16 is developing a community-based application 
to help local communities, especially civilians at risk of 
heat related illnesses, find relief from the increasingly 
intense summer heat by marking closest locations with air 
conditioning and water.


----------------------TECHNOLOGIES USED----------------------
APIs:
 -Google Maps Directions API
 -Google Maps Distance Matrix API
 -Google Maps Geocoding API
 -Google Maps Elevation API
 -Google Maps Javascript API
 -Google Maps Places API
Client-side:
 -HTML5
 -CSS3
 -JavaScript
Server-side:
 -NodeJS
 -Express (framework)
 -Express-sessions (framework)
Database:
 -MySQL (MariaDB)
 -XAMPP - used to run local DBs
Design:
 -Figma - used for design and planning


------------------------FILE CONTENTS------------------------
Root:
│   COMP2537-project-wecool.zip
│   comp2800.sql
│   package-lock.json
│   package.json
│   readme.txt
│   wecool-server.js
│
├───app
│   └───html
│       │   admin.html
│       │   admin_dashboard.html
│       │   coolzone.html
│       │   home.html
│       │   login.html
│       │   map.html
│       │   mycoolzones.html
│       │   profile.html
│       │   settings.html
│       │   signup.html
│       │   timeline.html
│       │
│       └───components
│               footer.html
│               navbar.html
│               navbar_admin.html
│
├───node_modules (contains module files)
│     
└───public
    ├───css
    │       admin.css
    │       admin_dashboard.css
    │       buttons.css
    │       create-coolzone.css
    │       footer.css
    │       home.css
    │       login.css
    │       map.css
    │       mycoolzones.css
    │       navbar.css
    │       profile.css
    │       signup.css
    │       timeline.css
    │
    ├───img
    │   │   background.jpg
    │   │
    │   ├───coolzones
    │   │       default.png
    │   │       1653079699421-6422690433.jpg
    │   │
    │   ├───icons
    │   │       coolzoneMarker.png
    │   │       favicon.ico
    │   │       left-arrow.png
    │   │
    │   ├───logo
    │   │       fan.png
    │   │       logo-text.png
    │   │       logo.jpg
    │   │
    │   ├───timelinePhotos
    │   │       1653070497296-8549561664.jpg
    │   │       1653079699421-6422690431.jpg
    │   │       1653079699421-6422690433.jpg
    │   │
    │   └───userAvatars
    │           default.png
    │
    ├───js
    │       admin.js
    │       coolzone.js
    │       homeLanding.js
    │       login.js
    │       map.js
    │       mycoolzones.js
    │       nav_footer_loader.js
    │       profile.js
    │       signUp.js
    │       timeline.js
    │
    └───sounds
            wind.mp3


------------------HOW TO RUN WECOOL LOCALLY-------------------
WeCool is a full-stack web application that requires a front-
end and back-end components. The front-end requires a browser
to run it. Google Chrome is recommended as the application was
tested with it.

NOTE:
This release of WeCool is currently configured to run off a 
local server at Port: 8000.
Lines 84-89 in wecool-server.js configure the app to run off
this local server. Note that we also left in code to connect to 
a remote server powered by Heroku on lines 75 to 81 in 
weccol-server.js. Leave this commented out unless you wish to
connect to the remote server.

To run the server-side code locally. The following is required.
 - a console terminal
 - XAMPP web server software with MySQL installed.
 - NodeJS installed.

 Instructions:
 - extract file contents into a local folder 
 - run XAMPP and activate MySQL server
 - in the console terminal open MariaDB and paste in all 
   content from comp2800.sql to write database and tables
 - open the console terminal to the path where file contents 
   are located
 - install the Express framework using "npm install express"
 - install the Express-sessions framework using "npm install 
   express-sessions" 
 - enter "node wecool-server.js" to run the server on PORT 8000
 - enter localhost:8000 into the browser address field to 
   run WeCool


------------------HOW TO RUN WECOOL ON HEROKU-------------------
To configure WECOOL via Heroku the following steps are required:
- install the Heroku CLI.
- login to Heroku account.
- connect git repo to remote Heroku repo.
- if using a remote database, connect to the remote database in 
  the server side js.
- push changes to Heroku repo.
- use the link provided to open the Heroku hosted app.

Lines 84-89 in wecool-server.js configure the app to run off
this local server. Comment out these lines of code, and uncomment
lines 75 to 81 in weccol-server.js to connect to a remote server.
You may need to configure remote connection object to connect to 
your server.

 --------------------HOW TO USE WECOOL------------------------
WeCool consists of main features:
-Map
-Timeline (newsfeed)
-Coolzone creation/editing
-User account managment (admin users only)

The map page will show all coolzones in a certain radius around
a search location. The location is centered on the user's location
by default. Users can use the page controls to input a new search
location, change the search radius, and change filters so that 
coolzones with different attributes will be shown.

The create-coolzones page has a form that users can fill out to
create a coolzone. Users can upload an image for that coolzone as
well. newly created coolzones will automatically update to the map
and the timeline.

The mycoolzones page will show all the coolzones that the user
created. Users can edit the existing coolzone information using
the edit-coolzone form on the page.

The timeline page will show all timeline posts made from all users.
Users can create their own post. Users can add multiple photos to
their posts to be displayed on the timeline. Users can also edit 
their own posts after its been made.

The admin-dashboard page shows all users existing in the user
database table. The page will only be accessible to admin users.
Admin users can add/delete users. They can also edit existing
users. Note that admin users can grant other users admin status.


 --------------------CREDITS AND REFERENCES--------------------

Background image file: /public/img/background.jpg
Default coolzone file: /public/img/coolzones/default.png
City Building Cityscape Skyline Business White Background
Retrieved from shutterstock.com Vector ID: 1928080667 
Vector Creator: jongcreative
https://www.shutterstock.com/image-vector/city-building-cityscape-skyline-business-white-1928080667

Back-button icon: /public/img/icons/left-arrow.png
Retrieved from flaticon.com
Author Attribution: <a href="https://www.flaticon.com/free-icons/left-arrow" title="left arrow icons">Left arrow icons created by Creatype - Flaticon</a>
https://www.flaticon.com/premium-icon/arrow_3183354?term=left%20arrow&page=1&position=19&page=1&position=19&related_id=3183354&origin=search

Default avatar image file: public/img/userAvatars/default.png
Retrieved from pngtree.com as a free download.
figure portrait PNG Designed By 588ku from 
<a href="https://pngtree.com"> Pngtree.com</a>
https://pngtree.com/freepng/character-default-avatar_5407167.html

Sample timeline photo file: public/img/timelinePhotos/1653070497296-8549561664.jpg
Little asian boy drinking water in the public park
Retrieved from shutterstock.com Vector ID: 645327073
Photo contributor: Littlekidmoment
https://www.shutterstock.com/image-photo/little-asian-boy-drinking-water-public-645327073

Sample timeline photo file: public/img/timelinePhotos/1653079699421-6422690431.jpg
Adorable Child Drinking From Outdoor Water Fountain
Retrieved from shutterstock.com Vector ID: 97397987
Photo contributor: D. Hammonds
https://www.shutterstock.com/image-photo/adorable-child-drinking-outdoor-water-fountain-97397987

Sample coolzone photo file: public/img/coolzones/1653079699421-6422690433.jpg
small business, people and service concept - man or bartender 
serving customer at coffee shop
Retrieved from shutterstock.com Vector ID: 722609509
Photo contributor: Syda Productions
https://www.shutterstock.com/image-photo/small-business-people-service-concept-man-722609509

Footer icons:
All footer icons were referenced from Google's Materal icons
library. Google permits the use of these icons pursuant to
the Apache License Version 2.0.
https://developers.google.com/fonts/docs/material_icons


 -----------------------CONTACT INFO---------------------------
If you need more inforamtion about this project, you can contact 
one of the authors Buck Sin at bsin3@my.bcit.ca
