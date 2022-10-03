## Creating models
In our api app models.py
```python
    class Room(models.Model):
        code = models.CharField(max_length=8, default="", unique=True)
        host = models.CharField(max_length=50, unique=True)
        guest_can_pause = models.BooleanField(null=False, default=False)
        votes_to_skip = models.IntegerField(null=False, default=1)
        created_at = models.DateTimeField(auto_now_add=True)
```
Code will be a code to enter in our music room
Host will be a information that links to the music room host (as a IP)
auto_now_add will add automatically the actual datetime


- We need to generate a unique code to our room:
```python
    import string
    import random

    def generate_unique_code():
        length = 6
        while True:
            code = ''.join(random.choices(string.ascii_uppercase, k=length))
            if Room.objects.filter(code=code).count() == 0:
                break

        return
```
Will be created a var "code" that will contains a string with 6 characters from ascii, all uppercase, and checked in ou Room.objects (our model, or table in database) if already has this code


# Creating a API view to see our Rooms
We need to say to front-end if the Room exists.
To this, we will need a json response. We need to translate the Room class code from our model to a json (to return to front-end).
- We need to create serializers.py in api folder
```python
    from rest_framework import serializers
    from .models import Room

    class RoomSerializer(serializers.ModelSerializer):
        class Meta:
            model = Room
            fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')
```

- And now we create a view to see all rooms in our database. In views.py in api folder
```python
    from rest_framework import generics
    from .models import Room
    from .serializers import RoomSerializer

    # Create your views here.
    class RoomView(generics.CreateAPIView):
        queryset = Room.objects.all()
        serializer_class = RoomSerializer
```
The generics.CreateAPIView will create automatically a view to see all Rooms in our database and POST some in our database. 
In generics.ListAPIView will create automatically a view just to see all Room, you not be able to POST in database
But now we need to add this in a route. In api folder, in urls.py:
```python
    from .views import RoomView

    urlpatterns = [
        path('home', RoomView.as_view())
    ]
```
as_view() is a method that converts our class to a view