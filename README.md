`Existing Heroku Link` https://pure-lowlands-90270.herokuapp.com/
# Project3-agendasync
**Agendasync** - A calendar application that has a day-to-day task-based agenda system. The application uses a combination of Google calendar and custom methods to combine a calendar and todolist into one intuitive application. Using twilio, we also bring forth a mobile bot that allows a user to update their daily todolist with commands outside of the web application and on the go.

## Application Setup
This application uses several components to initialize the application. Starting from a fresh repository clone, you must perform several setup tasks to bring you up to a working repository.

### Set up React    
0. `cd ~/environment && git clone https://github.com/NJIT-CS490/project3-agendasync && cd project3-agendasync`    
1. Install your stuff!    
  a) `npm install && npm install -g webpack && npm install --save-dev webpack && npm install socket.io-client --save`    
  b) `pip install flask-socketio`    
  c) `pip install eventlet`    
  d) `pip install twilio`    
  e) `pip install google_auth_oauthlib`    
  f) `pip install python-dotenv`    
  g)  `pip install --upgrade google-api-python-client`    
  h) `pip install flask_apschedular'     

:warning: :warning: :warning: If you see any error messages, make sure you use `sudo pip` or `sudo npm`. If it says "pip cannot be found", run `which pip` and use `sudo [path to pip from which pip] install`  :warning: :warning: :warning:  
</div>
  
### Getting PSQL to work with Python  
  
1. Update yum: `sudo yum update`, and enter yes to all prompts    
2. Upgrade pip: `sudo pip install --upgrade pip`  
3. Get psycopg2: `sudo pip install psycopg2-binary`    
4. Get SQLAlchemy: `sudo pip install Flask-SQLAlchemy==2.1`    
  
### Setting up PSQL  
  
1. Install PostGreSQL: `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs`    
    Enter yes to all prompts.    
2. Initialize PSQL database: `sudo service postgresql initdb`    
3. Start PSQL: `sudo service postgresql start`    
4. Make a new superuser: `sudo -u postgres createuser --superuser $USER`    
    :warning: :warning: If you get an error saying "could not change directory", that's okay! It worked!  
5. Make a new database: `sudo -u postgres createdb $USER`    
        :warning: :warning: If you get an error saying "could not change directory", that's okay! It worked!  
6. Make sure your user shows up:    
    a) `psql`    
    b) `\du` look for ec2-user as a user    
    c) `\l` look for ec2-user as a database    
7. Make a new user:    
    a) `psql` (if you already quit out of psql)    
    ## REPLACE THE [VALUES] IN THIS COMMAND! Type this with a new (short) unique password.    
    b) I recommend 4-5 characters - it doesn't have to be very secure. Remember this password!   
        `create user [some_username_here] superuser password '[some_unique_new_password_here]';`   
        :warning: this should look like `create user sresht superuser password 'mypass';` :warning:   
    c) `\q` to quit out of sql    
8. `cd` into `project3-agendasync` and make a new file called `sql.env` and add `SQL_USER=` and `SQL_PASSWORD=` in it  
9. Fill in those values with the values you put in 7. b)  
  
### Initializing Google API

The app uses Google to initialize and authenticate a client.
1. Create a Google API account at https://console.developers.google.com/apis/dashboard
2. On your developer console, search `Google Calendar API` in the top search bar and enable it for your account
3. Return to the console UI and click the APIs and Services Tab, click on `Credentials`
4. Click `Create OAuth client ID`
5. Create a web application as well as give it a name
6. Insert the a uri link from your AWS preview
7. Download a credentials file from your web application and rename it `client_secret.json`, insert it into your directory
8. Create two files, `react.env` and `redirect.env`, and insert `REACT_APP_GOOGLE_CLIENT_ID='[Google clientId]'` into the former and `export GOOGLE_URI='[local web browser]'` into the latter.

### Initializing Twilio
The app uses Twilio to create a mobile bot that allows interaction outside of the application.
1. Sign up for a free trial account at https://www.twilio.com/try-twilio
2. Verify your email and phone number. The questions that follow are incosequential but it's suggested you answer those related to the purpose of sending and recieving a message on python.
3. Copy your twilio account credentials into a file called `twilio.env` and create two export variables `export TWILIO_ACCOUNT_SID=''` and `export TWILIO_AUTH_TOKEN=''`
## Perform this step AFTER the heroku deployment!    
4. Open up your twilio dashboard and open up the side panel labeled `...` and click on `phone numbers`.
5. Click the automatically generated number and scroll down to the messaging section.
6. Beside the webhook, replace the url with `[your heroku url]/bot/`
7. Your twilio application should be ready to go after you save.
  
### Enabling read/write from SQLAlchemy  
There's a special file that you need to enable your db admin password to work for:  
1. Open the file in vim: `sudo vim /var/lib/pgsql9/data/pg_hba.conf`  
:warning: :warning: :warning: If that doesn't work: `sudo vim $(psql -c "show hba_file;" | grep pg_hba.conf)`  :warning: :warning: :warning:  
2. Replace all values of `ident` with `md5` in Vim: `:%s/ident/md5/g`  
3. After changing those lines, run `sudo service postgresql restart`  
4. Ensure that your `sql.env` has the username/password of the superuser you created; make sure you source the rest of your `.env` files!
5. Run your code!    
  a) `npm run watch`. If prompted to install webpack-cli, type "yes"    
  b) In a new terminal, `python app.py`    
  c) Preview Running Application (might have to clear your cache by doing a hard refresh)    
  d) To communicate with the twilio component, message the phone number `16506676737`
6. You should just see the same random number as lect10's socket demo.

### Deploying to Heroku
To instead deploy the app on Heroku, there are a few additional steps needed.
1. Sign up for heroku at https://www.heroku.com/
2. Install heroku by running `npm install -g heroku`  
3. Login by running `heroku login -i`
4. Create the heroku application `heroku create`
5. Create a `.profile` and insert `echo ${CLIENT_SECRET} > /app/client_secret.json`
6. Create heroku database with `heroku addons:create heroku-postgresql:hobby-dev` and then run `heroku pg:wait`
7. Open `psql` and change database ownership with `ALTER DATABASE Postgres OWNER TO [database username];`
8. Return to the console and push database with `PGUSER=[database owner] heroku pg:push postgres DATABASE_URL` (`PGUSER=""` can be removed if not working)
9. Optionally check for your databases with `heroku pg:psql`
10. Push database information to heroku `heroku pg:push postgres DATABASE_URL`
11. Ensure all files are synced with master branch and run `git push heroku master`
12. Return to your config var variables in your heroku settings and add a key that corresponds to every environment variable you have created prior
13. Add a new config variable called `CLIENT_SECRET` insert the contents of `client_secret.json` into it.
14. After restarting all dynos, the application should load but it's likely you won't be able to make it through authorization. Return to your google account and insert the heroku web address into your existing clientID
15. After saving, the application should successfully deploy from the resulting url! It can also be reached and deployed from your heroku account!

## Engineer Testimonials 

**Jason Eccles** - For this MVP I worked mostly with the initial setup and organization and the backed. 
I was the first project manager so I was responsible for the initial setup and organization of the project.
I created and set up the trello board, the repository, the boilerplate code to get started, and updated the final proposal.
I set up the database and the server.
I created the text bot using twilio and the queries to pull/update information from the database.
I used eslint on the front end code.


**Zaafira Hasan** - For this MVP, I worked mostly on the frontend to have much of the UI design deployed.
I designed the login page with Surindra and helped the google credentials to be sent to the backend.
I helped to design the main page and had the personalized Google calendar to show up with the logged-in user.
I designed the to-do list interface and using flask-socket allowed the information to be sent to the interface.
Along with Surindra, I helped with unit-testing.

**Surindra Boodhoo** - I created the frontend login page.
I setup the add calendar and the add todo item forms.
I worked with Andre to get the users information on login
Andre,Zaafira, and I worked together to deploy to Heroku.
Zaafira and I worked together on the unit tests.

**Andre Pugliese** - For this MVP I was able to complete several connective pieces of code within the application.
I used google calendar API and worked with Surindra to connect the frontend and backend using authentication tokens.
I sorted out textbot logic and responses prior to database implementation.
Worked with Zaafira and Surindra to deploy the application to Heroku.
Used pyLint to lint the backend python code and enforce code style.
Updated and expanded readme to include new instructions for application deployment.

**Functionalities that still need to be sorted out on the backend.** These include:
Allowing the server to handle and separate multiple clients during use,
separating the textbot into its own class,
creating textbot logic for updating the calendar using the API,
the textbot needs to delete todos,
fix the socket emit issue (need to update with multiple clients),
update todos with the bot.

**Functionalities that still need to be sorted out on the frontend.** These include:
We have to create the landing page,
have a more aesthetic login page,
the calendar interface with buttons need to be more aesthetic.
