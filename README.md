# Music Room - React and Django
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## Description
  Music Room was a software developed in a serie of videos created by [Tech With Tim](https://www.techwithtim.net/) which approached the creation of a joinable room that handles the spotify music thats playing, has a logic to control the skip by the number of votes. Was created with Django and React frameworks using SpotifyAPI


# Index

- [Installation and running](#installation-and-running)
- [Project Routes](#project-routes)
  - [1 - Main API Routes](#1---main-api-routes)
    - [localhost:8000/room - GET](#11---localhost8000room---get)
    - [localhost:8000/create-room - POST](#12---localhost8000create-room---post)
    - [localhost:8000/get-room - GET](#13---localhost8000get-room---get)
    - [localhost:8000/join-room - POST](#14---localhost8000join-room---post)
    - [localhost:8000/user-in-room - GET](#15---localhost8000user-in-room---get)
    - [localhost:8000/leave-room - POST](#16---localhost8000leave-room---post)
    - [localhost:8000/update-room - PATCH](#17---localhost8000update-room---patch)
- [My Annotations](https://github.com/joseaugusto0/Music-Playing-App---React-and-Django/tree/main/docs)


## Installation and running
-   Clone all the repository quoted in [Music Playing App - React and Django](https://github.com/joseaugusto0/Music-Playing-App---React-and-Django)
-   Create the virtualenv for the project proposed in this repository. Tutorial [here](https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/)
-   Install the dependencies with requirements.txt. Set your environment, and install all dependencies that you need with this command:
```
    pip install -r requirements.txt
```
-   You need to install the node dependencies too. In *music_app/frontend*
```
  npm install
```
-   You need to set some environment variables. You can create manually in your machine or add a .env file in *music_app* folder
```
  CLIENT_ID = clientID from Spotify API that you create
  CLIENT_SECRET = clientSecret from Spotify API that you create
  REDIRECT_URI = 'http://localhost:8000/spotify/redirect'
  SECRET_KEY = the Secret Key created by Django
  BASE_URL = 'https://api.spotify.com/v1/me'
  IP = your IP to run the django app
```
-   After all installed, you will run the django app in the folder *music_app*
```
  python manage.py runserver
```
-   You will need to start the react app separately in *music_app/frontend*
```
  npm run dev
```


## Project Routes
Music Playing App is composed basically by seven routes in the main API, seven routes in frontend (seven pages), and seven routes in the API to handle the spotify API. The main two ones are the API and frontend, with the respective routes:

## 1 - Main API Routes

### 1.1 - localhost:8000/room - GET
This route is just to list all rooms in the API. More for a Dev purposes.

### 1.2 - localhost:8000/create-room - POST
This route gets two parameters sent in request:
-   guest_can_pause : boolean
-   votes_to_skip : int

Just a route to create a new music room, and the two parameters are the main configs in the room. Has another one parameter, the session_id, but django create this variable automatically.

### 1.3 - localhost:8000/get-room - GET
This route gets one parameters sent in request:
-   room_code : string

This route will return a selected music room.

### 1.4 - localhost:8000/join-room - POST
This route gets one parameters sent in request:
-   room_code : string

This route will check if the room passed as parameters exists, and if it, will add in the user session the room code he enter

### 1.5 - localhost:8000/user-in-room - GET
This route gets one parameters sent in request:
-   room_code : string

This route will return the room code linked in the user session_id

### 1.6 - localhost:8000/leave-room - POST
This route will unlink the room code and the user session_id. All infos needed will are in the user session, created automatically by Django

### 1.7 - localhost:8000/update-room - PATCH
This route gets three parameters sent in request:
-   room_code : string
-   guest_can_pause : boolean
-   votes_to_skip : int

This route is just to update the music room parameters if the request came from the host of the room

## 2 - Frontend Routes

### 2.1 - localhost:8000/ - GET
This route will return the main home page if the user doesn't have a room code in his session infos. If it, will go to [localhost:8000/room/:roomCode](#24---localhost8000roomroomcode---get)
![Home Page](/docs/images/HomePage.PNG)

### 2.2 - localhost:8000/join - GET
Just a page to join in a created room with his code.
![Join Room Page](/docs/images/JoinRoom.PNG)

### 2.3 - localhost:8000/create - GET
A page to create a new music room
![Create Room Page](/docs/images/CreateRoomPage.PNG)

### 2.4 - localhost:8000/info - GET
A page that describes some app infos. What is the app, how it work.
![Info Page](/docs/images/InfoPage.PNG)

### 2.4 - localhost:8000/room/:roomCode - GET
That's the route that will go to the music room. Needs the parameters roomCode to make the request and return the room infos.
![Room Page](/docs/images/RoomPage.PNG)

## Challenges Proposed

- [X] Put the project in a github repository
- [X] Update the project with hooks
- [ ] Put the project in a production (using tools like Heroku)
- [ ] Improve frontend design
- [ ] Try differents DB's (like MongoDB, MariaDB, MySQL, and more)

### Created by: [José Augusto Coura](https://github.com/joseaugusto0)
