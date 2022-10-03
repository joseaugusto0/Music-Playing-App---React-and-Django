# Installing django
```
    pip install django djangorestframework
``` 

## Initializing Django Project
```
    django-admin startproject music_app
```
Will be created a bunch of archives inside a new folder called "music_app", our project folder

## Creating an app
Before creating a django project, you need to creed a new app. A django project contains one or more apps.
The app created will handle the API
```
    cd music_app
    django-admin startapp api
```

- Views.py -> Contains the code responsible to render the views on API
We need to add the app created to our project
In setting.py in music_app we add "api"

```python
    INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api.apps.ApiConfig',
    'rest_framework'
]
```
If you open apps.py, into the api folder, we will see a Class called APIConfig, that contains the app name
rest_framework its a app needed in this app

## Creating the first view
In our api folder, we will create a simple function to handle a simple route:
```python
    from django.http import HttpResponse

    def main(request):
        return HttpResponse("Hello")
```
We need to point in project (music_app) urls.py to redirect /api routes to our api app routes 
```python
    from django.urls import include, path

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('', include('api.urls'))
    ]
```
We need to create a urls.py file in api folder
```python
    from django.urls import path
    from .views import main

    urlpatterns = [
        path('', main)
    ]
```

## Run our webserver
```
    python .\manage.py makemigrations
    python .\manage.py migrate
```
We need to run database changes in our project, that first run is to initalize. If we change a model, or the database, we need to run these commands again.
A db.sqlite3 file will be created. It's our database

```
    python .\manage.py runserver
```