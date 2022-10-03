import React, {Component} from "react";
import {render} from 'react-dom';
import HomePage from "./HomePage";
import { CreateRoomPage } from "./CreateRoomPage";
import { RoomJoinPage } from "./RoomJoinPage";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Room} from "./Room";

export function App (){   
    return (
        <div className="center">
            <Router>
                <Routes>
                    <Route exact path='/' element={<HomePage />} />
                    <Route path='/join' element={<RoomJoinPage />} />
                    <Route path='/create' element={<CreateRoomPage />} />
                    <Route path='/room/:roomCode' element={<Room />} />
                </Routes>                
            </Router>  
        </div>
    )
}

const appDiv = document.getElementById("app")
render(<App />, appDiv)

