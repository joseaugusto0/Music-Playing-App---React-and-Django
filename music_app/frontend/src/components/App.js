import React, {Component} from "react";
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

