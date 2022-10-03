## Creating a Serializer to Create something with the POST request
In serializers.py
```py
    class CreateRoomSerializer(serializers.ModelSerializer):
        class Meta:
            model = Room
            fields = ('guest_can_pause', 'votes_to_skip')
```
The serializer will get the fields that you need to create

- In views.py from api folder
```py
    class CreateRoomView(APIView):
        serializer_class = CreateRoomSerializer

        def post(self, request, format=None):
            if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()
            
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid(): #Here will check if the two values nedeed in serializer are valid
                guest_can_pause = serializer.data.get('guest_can_pause')
                votes_to_skip = serializer.data.get('votes_to_skip')
                host = self.request.session.session_key

                queryset = Room.objects.filter(host=host) # As a rule in our app, one host can't have multiple rooms, so if a host already has one room, we just will update the guest_can_pause and votes_to_skip vars.
                if queryset.exists():
                    room = queryset[0]
                    room.guest_can_pause = guest_can_pause
                    room.votes_to_skip = votes_to_skip
                    room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                else:
                    room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                    room.save()
                
            return Response(RoomSerializer(room).data,  status=status.HTTP_201_CREATED) #We will return as response the room created as a json. The .data will convert the room object to a json
```
As we created before, the Room model requires a host, that is such a session for our app. When we login at facebook, a session is created, which allow us to navigate through different pages in facebook domain without make login in all of them. In our application here will have a session too, so if in the request hasn't any session, we will create.
