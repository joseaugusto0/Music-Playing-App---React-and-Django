## Add style to our app
In our index.html already is calling index.css to apply a style in the main page. So we just need to create this file in frontend/static/css/index.css
```css
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        color: white;
    }

    #main {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }

    #app {
        width: 100%;
        height: 100%;
        display: flex;
    }
```

## Passing props to our component
```js
...
    render() {
        return (
            <h1>Testing React Code, {this.props.name}</h1>
        )
    }
    }

    const appDiv = document.getElementById("app")
    render(<App name="tim"/>, appDiv)
```

## Creating our router system
In our App.js we will create a router to redirect to different pages (or components)
```js
    import {render} from 'react-dom';
    import HomePage from "./HomePage";
    import { CreateRoomPage } from "./CreateRoomPage";
    import { RoomJoinPage } from "./RoomJoinPage";
    import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

    export function App (){   
        return (
            <Router>
                <Routes>
                    <Route exact path='/' element={<HomePage />} />
                    <Route path='/join' element={<RoomJoinPage />} />
                    <Route path='/create' element={<CreateRoomPage />} />
                </Routes>                
            </Router>  
        )
    }

    const appDiv = document.getElementById("app")
    render(<App />, appDiv)
```
But we need to say to django that if the user put the /join route or /create, django needs to render the index.html and let the react take the control for this router options
- In music_app urls.py
```py
    urlpatterns = [
        path('', index),
        path('join', index),
        path('create', index),
    ]
``` 