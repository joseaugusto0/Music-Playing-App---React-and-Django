# Leaving the room

```py
    class LeaveRoom(APIView):

    def post(self, request, format=None):

        #When the user leaves the room, the room_code var needs to pop out from session infos. 
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')

            #We need to check if who is leaving is the host, if it is the room will be deleted
            host_id = self.request.session.session_key

            room_results = Room.objects.filter(host=host_id)

            if len(room_results)>0:
                room = room_results[0]
                room.delete()
        
        return Response({'Message': 'Sucess'}, status=status.HTTP_200_OK)

```