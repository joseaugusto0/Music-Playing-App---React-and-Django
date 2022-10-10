## Creating the view and the function in backend
```py
    class PauseSong(APIView):
        def put(self, request, format=None):
            room_code = self.request.session.get('room_code')
            room = Room.objects.filter(code=room_code)[0]

            if self.request.session.session_key == room.host or room.guest_can_pause:
                pause_song(room.host)

                return Response({}, status=status.HTTP_204_NO_CONTENT)

            return Response({}, status=status.HTTP_403_FORBIDDEN)
```

- Now we will create a function to handle
```py
    def play_song(host_session_id):
        return execute_spotify_api_request(session_id=host_session_id, endpoint="/player/play", put_=True)
```

## Creating in the frontend
```js
    const pauseSong = () => {
        const requestOption = {
            method: 'PUT',
            headers: {'Content-type':'application/json'}
        }
        fetch('/spotify/pause-song', requestOption)
    }

    const playSong = () => {
        const requestOption = {
            method: 'PUT',
            headers: {'Content-type':'application/json'}
        }
        fetch('/spotify/play-song', requestOption)
    }

    ...

     <IconButton onClick={() => {songInfos.is_playing ? pauseSong() : playSong()}}>
        {songInfos.is_playing ? <PauseCircle/> : <PlayCircle />}
    </IconButton>
```