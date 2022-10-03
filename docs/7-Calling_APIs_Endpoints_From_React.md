# Creating Room page
The strategy is to enter in the room from the url: localhost:port/room/ABCDEF (this ABCDEF is the code)
- We need to add our route in App.js
```js
    <Route path='/room/:roomCode' element={<Room />} />
```
We are passing roomCode as a props to Room
- We need to add the route in our django project, in urls.py
```py
    path('room/<str:roomCode>', index)
```

# Getting the URLs params and sending to Room page:
```js
    import React, {Component, useState} from 'react';
    import { useParams } from 'react-router-dom';

    export function Room () {
        var [roomState, setRoomState] = useState({
            votesToSkip:2,
            guestCanPause: false,
            isHost: false,
        })

        const params = useParams();

        return(
            <div>
                <p>Room: {params.roomCode}</p>
```

# Making a request to get all room information
- We will create a view in our api views:
```py
    class GetRoom(APIView):
        serializer_class = RoomSerializer
        lookup_url_kwarg = 'code' # Setting the arg that will be catch in our URL

        def get(self, request, format=None):
            code = request.GET.get(self.lookup_url_kwarg) #Getting the parameter in url

            if code:
                room = Room.objects.filter(code=code) #Get the room in our database by his code
                if len(room) > 0:
                    data = RoomSerializer(room[0]).data 
                    data['is_host'] = self.request.session.session_key == room[0].host #Checking if the session of who is making the request is equals the session from who created the room
                    return Response(data, status=status.HTTP_200_OK)
            
                return Response({'Room Not Found': "Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND)
```
- We need to add in api urls:
```py
    urlpatterns = [
        path('room', RoomView.as_view()),
        path('create-room', CreateRoomView.as_view()),
        path('get-room', GetRoom.as_view())
    ]
```
- Et voilá, test the url
```
    localhost:port/api/get-room?code=ABCDEF
``` 

## Getting the Room info in our frontend
In Room.js
```js
    const getRoomDetails = () => {
        fetch('/api/get-room' + "?code=" + params.roomCode).then((response) => {
            return response.json()
        }).then((data) => {
            
            setRoomState( (prevState) =>
                (
                    {
                        ...prevState,
                        votesToSkip: data.votes_to_skip,
                        guestCanPause: data.guest_can_pause,
                        isHost: data.is_host
                    }
                )
            )
        })
    }

    useEffect(getRoomDetails, [])
```

# Goingo to the room page after create
In CreateRoomPage.js
```js
    const navigate = useNavigate();

    const handleRoomButtonPressed = () => {
        
        ....
        fetch('/api/create-room', requestOptions
            ).then((response) => response.json()
            ).then((data) => navigate('/room/'+data.code))
    }
``` 
