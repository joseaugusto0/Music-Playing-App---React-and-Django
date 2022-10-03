# Creating an app to our frontend
```
    django-admin startapp frontend
``` 
- We will create these folder:
```
    frontend
    |
    |---templates
        |---frontend
    |---static
        |---css (to css files)
        |---frontend (to js files)
        |---images (guess what type of files)
    |---src
        |---components (which will contains our react components)
```

## Creating our React project
```
    cd frontend
    npm init -y
    npm i webpack webpack-cli --save-dev
    npm i @babel/core babel-loader @babel/preset-env @babel/preset-react -D
    npm i react react-dom --save-dev
    npm install @material-ui/core @material-ui/icons
    npm install @babel/plugin-proposal-class-properties
    npm install react-router-dom

```
webpack will get all of our javascript files and pack these into a minimun files as possible
Babel will convert our code to run in all browsers as possible, the older ones and the newest ones
material-ui/core its a library that contains a bunch of material components, similar as bootstrap. But it's available just to React 16. Here's just a adaptation to 17

## Configuring Babel
We need to create a babel.config.json in our frontend folder
```json
    {
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "node": "10"
          }
        }
      ],
      "@babel/preset-react"
    ],
    "plugins": ["@babel/plugin-proposal-class-properties"]
  }
``` 

## Creating a webpack config file
We need to create a webpack.config.js in our frontend folder. A webpack will bundle all js files into one to the browser.
```js
    const path = require("path");
    const webpack = require("webpack");

    module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./static/frontend"), //Say where we need the webpack output
        filename: "[name].js",
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
            loader: "babel-loader",
            },
        },
        ],
    },
    optimization: {
        minimize: true, //Thats able to make our javascript file smaller
    },
    plugins: [
        new webpack.DefinePlugin({
        "process.env": {
            // This has effect on the react lib size
            NODE_ENV: JSON.stringify("production"),
        },
        }),
    ],
    };
```

## Adding the scripts in our package.json
```json
...
    "scripts": {
    "dev": "webpack --mode development --watch",
    "build": "webpack --mode production"
  },
...
```

# Making the React take over to our first Django App 
Generally our Django will just render our vanilla HTML created by the React
- In frontend/templates/frontend we will create our index.html
```html
    <!DOCTYPE html>

    <html>
        <head>
            <meta charset="UTF-8">
            <meta name='viewport' content="width = device-width, initial-scale=1">
            <title>Music Controller</title>
            {% load static %} 

            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <link rel="stylesheet" type="text/css" href="{% static "css/index.css" %}"
        </head>

        <body>
        <div id="main">
            <div id="app"></div>
        </div>
        <script src="{% static "frontend/main.js" %}"> </script>
    </body>

    </html>
```
The {% load static %} is a function to django load everything that contains in static folder
Ou react app will be inside the "app" div
script src="{% static "frontend/main.js" %}" will combine the first static load in head with frontend/main.js

## Render this index.html created when a route is called
In views.py in frontend app folder
```python
    def index(request, *args, **kwargs):
        return render(request, 'frontend/index.html')
```
- We need to add our frontend urls in project. So in urls.py in music_app:
```python
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('api.urls')),
        path('', include('frontend.urls'))
    ]
```

- We need to create a urls.py in frontend app folder
```python
    from .views import index
    from django.urls import include, path

    urlpatterns = [
        path('', index),
    ]
```

## Creating the first component
Creating in frontend/src/components/App.js
```js
    import React, {Component} from "react";
    import {render} from "react-dom";

    export default class App extends Component{
        constructor(props){
            super(props);

        }

        render() {
            return (
                <h1>Testing React Code</h1>
            )
        }
    }

    const appDiv = document.getElementById("app")
    render(<App />, appDiv)
```
- And now we need to put this component in our index.js
```js
    import App from './components/App'
```
Just importing this, the render(<App />, appDiv) in App.js will take care of render the component

- We need to put our frontend as a app from music_app project. In setting.py in music_app folder
```python
    INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'api.apps.ApiConfig',
        'rest_framework',
        'frontend.apps.FrontendConfig'
    ]
```

# Running application
We need to run our Django application and the React application separately
- In music_app folder
```
    python .\manage.py runserver
``` 
- In a different terminal and in music_app/frontend folder
```
    npm run dev
```