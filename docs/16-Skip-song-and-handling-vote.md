## How will work
To skip the music, a certain number of skips will need to be counted. And this counter will show in frontend.
The host can skip automatically. We will create a model to store all vote to ONE music

## Creating the model
```py
    class Vote(models.Mode):
        user = models.CharField(max_length=50, unique=True)
        created_at = models.DateTimeField(auto_now_add=True)
        song_id = models.CharField(max_length=50)

        #models.CASCADE = if the room was deleted, delete all votes linked to it
        room = models.ForeignKey(Room, on_delete=models.CASCADE)
```
- We need to add the current_song_id in Room model
```py
    class Room(models.Model):
        code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
        host = models.CharField(max_length=50, unique=True)
        guest_can_pause = models.BooleanField(null=False, default=False)
        votes_to_skip = models.IntegerField(null=False, default=1)
        created_at = models.DateTimeField(auto_now_add=True)
        current_song = models.CharField(max_length=50, null=True)
```

## In backend
- Creating the view
```py
    class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        #Confirming that we will get only votes for the CURRENT SONG
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if self.request.session.session_key == room.host or (len(votes)+1 >= votes_needed):
            #If the music been skipped, we need to delete all previously votes
            votes.delete()
            skip_song(room.host)
        else:
            vote = Vote(
                user=self.request.session.session_key,
                room=room,
                song_id = room.current_song
            )
            vote.save()
            

        return Response({}, status=status.HTTP_204_NO_CONTENT)
```

- Creating the request function
```py
    def skip_song(session_id):
        return execute_spotify_api_request(session_id=session_id, endpoint="/player/next", post_=True)
```

- We need to return to the app the number of the votes, so in our currentSong view
```py
...
    votes = Vote.objects.filter(room=room, song_id=song_id)   
    song = {
        'title': item.get('name'),
        'artist': artist_string,
        'duration': duration,
        'time': progress,
        'image_url': album_cover,
        'is_playing': is_playing,
        'votes': len(votes),
        'votes_required': room.votes_to_skip,
        'id': song_id
    }
```

## In frontend
```js
    const skipSong = () => {

        const requestOption = {
            method: 'POST',
            headers: {'Content-type':'application/json'}
        }
        fetch('/spotify/skip-song', requestOption)
    }
    ...

     <IconButton onClick={() => {skipSong()}}>
        <SkipNext /> {songInfos.votes} /{" "} {songInfos.votes_required}
    </IconButton>
```

## Running the application in local network
We are running in a specific port that only can be accessed from our computer, we need to change this to all devices in the network can access
- In setting.py
```py
    ...
    # In IP will have the IP from your computer
    ALLOWED_HOSTS = ['127.0.0.1', os.environ.get('IP')]

    ...
```
```
    python .\manage.py runserver XXX.XXX.XXX.XXX:8000 //Your IP here
```
