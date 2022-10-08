## Getting the currently playing song infos
We will create a function in utils.py just to make the Spotify API requests
```py
    def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
        tokens = get_user_tokens(session_id) 

        header = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + tokens.access_token 
        }

        if post_:
            post(os.environ.get('BASE_URL') + endpoint, headers=header)

        if put_:
            put(os.environ.get('BASE_URL') + endpoint, headers=header)

        #The {} in the middle is because the sintax says that we need to send something in GET requests
        response = get(os.environ.get('BASE_URL') + endpoint, {}, headers=header)

        try:
            return response.json()
        except:
            return {'Error': 'Issue with request'} 
```
session_id = session_key from the user
endpoint = the endpoint we want to go in spotify API

## Making a view to get the currently song
```py
    class CurrentSong(APIView):
        def get(self, request, format=None):

            room_code = self.request.session.get('room_code')
            room = Room.objects.filter(code = room_code)[0]
            host = room.host
            endpoint = '/player/currently-playing'

            response = execute_spotify_api_request(
                session_id=host,
                endpoint=endpoint,
            )

            #Getting infos from the response
             item = response.get('item')
            duration = item.get('duration_ms')
            progress = response.get('progress_ms')

            # Getting the bigger photo in the response
            album_cover = item.get('album').get('images')[0].get('url')

            # If the music have more than one artist, we will store all the artist in a string
            artist_string = ""

            for i, artist in enumerate(item.get('artists')):
                if i>0:
                    artist_string += ', '
                artist_string += artist.get('name')

            #Grouping and returning the song infos
            song = {
                'title': item.get('name'),
                'artist': artist_string,
                'duration': duration,
                'time': progress,
                'image_url': album_cover,
                'is_playing': is_playing,
                'votes': 0,
                'id': song_id
            }
```

## Making the front end to handle these data
In Room.js
```js
    ....
    var [songInfos, setSongInfod] = useState({})
    ...

    useEffect(() => {
        getRoomDetails()
        getCurrentSong()
    }, [])
    ...
    const getCurrentSong = () => {
        fetch('/spotify/current-song')
            .then((response) => {
                if(!response.ok){
                    return {};
                }
                return response.json();
            })
            .then((data) => {
                
                setSongInfos(data)
            })

    }
```

## Update the current song
Unfortenately, spotify API doesn't not handle websockets, so we can't send messages one each other to update, so we need to create a function to keep verifying every second if the music changes
```js
    useEffect(() => {
        getRoomDetails()
        getCurrentSong()
        const interval = setInterval(() => getCurrentSong,1000)
    }, [])
```

## Creating a player component
Look to the file MusicPlayer.js, is just a frontend component creation passing some parameters.