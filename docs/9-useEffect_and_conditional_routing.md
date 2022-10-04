# Redirecting user to the room page if he has a session
- Creating the view to check if the user already has a session
```py
    class UserInRoom(APIView):
        def get(self, request, format=None):

            if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()

            data = {
                'code': self.request.sessions.get('room_code')
            }

            return JsonResponse(data, status=status.HTTP_200_OK)
```
- Now we need to get this info when the home page is render
```js
    var [roomCode, setRoomCode] = useState(null);

    useEffect( () => {
        
        fetch('/api/user-in-room')
            .then((response) => response.json())
            .then((data) => {  
                setRoomCode(
                    data.code
                )
            })
    }, [roomCode])

    return (
        <div className="center">
            <Router>
                <Routes>
                    <Route exact path="/" element={
                        roomCode ? 
                        <Navigate replace to={`/room/${roomCode}`} /> :
                        <HomePage />
                    } />
```