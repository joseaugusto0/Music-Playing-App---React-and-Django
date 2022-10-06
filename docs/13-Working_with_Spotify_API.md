# Creating the spotify licence to use the API
```
    https://developer.spotify.com/dashboard
```

# Creating the handler in our project
We will create a new app, specific to just handle the spotify requests
- Create the urls.py file in the new project and a new file called credentials.py. This second file will get all credentials needed to make request in API.
- We will create a view to handle
```py
    class AuthURL(APIView):

    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing' #Here is the scopes that the user will have access, is in spotify API docs

        url= Request('GET', 'https://accounts.spotify.com/authorize', params={ # Preparing the request in spotify API
            'scope': scopes, #Sending the scopes we need
            'response_type': 'code', # Saying that we want a code as a response (token)
            'redirect_uri': REDIRECT_URI,
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID

        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)
            
        })
```
We are just creating a view to get the API credentials and prepare a URL to the frontend make the request
- We need to put the view in settings of the project
```py
    INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'api.apps.ApiConfig',
        'rest_framework',
        'frontend.apps.FrontendConfig',
        'livereload',
        'spotify.apps.SpotifyConfig'
    ]
```


## Creating the callback uri/method
After the API validate the credentials, will return the token, and with this token we can "enter" in the API
```py
    def spotify_callback(request, format=None):
        code = request.GET.get('code')
        error = request.GET.get('error')

        response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('acess_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    ...to be continued
```

But now what we do with the variables we catch? We need to handle all different users with different tokens. So we will create a database that will make the relationship between the roomCode, sessionKey and spotify Token

## Creating a new model to the tokens
```py
    from secrets import token_bytes
    from django.db import models

    class SpotifyToken(models.Model):
        user = models.CharField(max_lenght=50, unique=True)
        created_at = models.DateTimeField(auto_now_add=True)
        refresh_token = models.CharField(max_lenght=150)
        acess_token = models.CharField(max_lenght=150)
        expires_in = models.DateTimeField()
        token_type = models.CharField(max_lenght=50)
```
- Now we need to run the migration
```
    python .\manage.py makemigrations
    python .\manage.py migrate
```

## Now we will handle the tokens
- we will create a new file called util.py to verify the infos and save/update the tokens
```py
    def get_user_tokens(session_key): 
        user_tokens = SpotifyToken.objects.filter(user=session_key) #Getting the tokens by the session key

        if user_tokens.exists():
            return user_tokens[0]

        return None

    def update_or_create_user_tokens(session_key, access_token, token_type, expires_in, refresh_token):
        tokens = get_user_tokens(session_key)
        expires_in = timezone.now() + timedelta(seconds= expires_in) # We are converting the seconds that the API will return saying when the token expires to timestamp pattern

        if tokens: #Just updating the value in database
            tokens.acess_token = access_token
            tokens.refresh_token = refresh_token
            tokens.expires_in = _expires_in
            token_type = token_type
            tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in','token_type'])
        else:

            # Creating a new token
            tokens = SpotifyToken(
                user=session_key, 
                access_token = access_token
                refresh_token = refresh_token,
                expires_in = _expires_in,
                token_type = token_type)
            tokens.save()
```
- Returning to the view we create 
```py
    ...
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        session_key = request.session.session_key
        access_token = access_token,
        token_type = token_type,
        refresh_token = refresh_token
        expires_in = expires_in
    )

    return redirect('front-end:') #We are saying to after that request, will be redirected to frontend route
```
But to this redirect('front-end') works, we need to add in frontend folder urls.py
```py
    
    app_name = 'frontend'

    urlpatterns = [
        path('', index, name=''),
        path('join', index),
        path('create', index),
        path('room/<str:roomCode>', index)
    ]
```

## Check if the user is authenticated
We will create in utils.py a file to check if the token expires, if it, make a post request to update the token
``` py
    def is_spotify_authenticated(session_key):
        tokens = get_user_tokens(session_key)

        if tokens:
            expiry = tokens.expires_in

            if expiry <= timezone.now():
                refresh_spotify_token(tokens)

        return False

    def refresh_spotify_token(tokens):
        refresh_token = tokens.refresh_token

        response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': CLIENT_ID,
            'client_secred': CLIENT_SECRET
        }).json()

        access_token = response.get('access_token')
        token_type = response.get('token_type')
        expires_in = response.get('expires_in')
        refresh_token = response.get('refresh_token')

        update_or_create_user_tokens(
            session_key, 
            access_token=access_token, 
            token_type=token_type, 
            expires_in=expires_in, 
            refresh_token=refresh_token)
``` 
- Creating a view to make this authentication verification
```py
    class IsAuthenticated(APIView):
        def get(self, request, format=None):
            is_authenticated = is_spotify_authenticated(self.request.session.session_key)

            return Response({'Status': is_authenticated}, status=status.HTTP_200_OK)
```


# Creating the frontend part
After the Room infos has been get in the API, we will get the spotify authentication IF THE USER IS THE HOST
- So in Room.js, in the getRoomDetails method
```js
    ....
        .then((data) => {
            setRoomState( (prevState) =>
                (
                    {
                        ...prevState,
                        votesToSkip: data.votes_to_skip,
                        guestCanPause: data.guest_can_pause,
                        isHost: data.is_host,
                        roomCode: data.code
                    }
                )
            )

            if (data.is_host){
                authenticateSpotify()
            }
        })

    ....


    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated')
            .then((response) => response.json())
            .then((data) => {
                setRoomState( (prevState) =>
                    (
                        {
                            ...prevState,
                            spotifyAuthenticated: data.status 
                        }
                    )
                )
                if (!data.status){ //if the user isn't authenticated, we need to authenticate him
                    fetch('/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url) //we will redirect the user to the URL to authenticate in the Spotify
                        })
                }
            }
        )
    }
```
