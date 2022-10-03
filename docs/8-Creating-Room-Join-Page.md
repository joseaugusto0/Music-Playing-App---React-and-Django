# Setting everything in the middle of the screen
```css
    .center {
        position: absolute;
        top: 50%;
        left:50%;
        transform: translate(-50%, -50%);
    }
```

## Problem with reload
Site not reloading: cookies cached
```
    pip install django-livereload-server
```
Put in setting.py
```py
    INSTALLED_APPS: [
        'livereload'
    ]
```

## Creating RoomJoinPage

- We need a textfield to put the room code:
```js
    <TextField 
        error={pageState.error} //It's a error that stays above the textfield
        label="Code"
        placeholder="Enter a Room Code"
        helperText={pageState.error}
        variant="outlined"
        onChange={_handleTextFieldChange}
    />
```

## Making a view to allow us to join the room
In views.py in api folder
```py
    class JoinRoom(APIView):

        lookup_url_kwarg = 'code'

        def post(self, request, format=None):
            
            if not self.request.session.exists(self.request.session.session_key): #Cheking if he already have a session
                self.request.session.create()

            code = request.data.get(self.lookup_url_kwarg) # Getting the code from the request data

            if code != None:
                room_result = Room.objects.filter(code=code)

                if len(room_result) > 0:
                    room = room_result[0]
                    self.request.session['room_code'] = code #Adding a var room_code in session object to say which room code the session is linked
                    return Response({'message': 'Room Joined'}, status= status.HTTP_200_OK)
                return Response({'Bad Request': 'Invalid Room Code'}, status= status.HTTP_400_BAD_REQUEST)

            return Response({'Bad Request' : "Invalid post data, did not find a code key"}, status=status.HTTP_400_BAD_REQUEST)
```

