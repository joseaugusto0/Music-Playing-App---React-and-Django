import React, {Component, useEffect, useState} from "react";
import {render} from 'react-dom';
import HomePage from "./HomePage";
import { CreateRoomPage } from "./CreateRoomPage";
import { RoomJoinPage } from "./RoomJoinPage";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import {Room} from "./Room";

export function App (){   

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

    const clearRoomCode = () => {
        setRoomCode({
            roomCode: null
        })
    }

    return (
        <div className="center">
            <Router>
                <Routes>
                    
                    <Route exact path="/" element={
                        roomCode ? 
                        <Navigate replace to={`/room/${roomCode}`} /> :
                        <HomePage />
                    } />
                    
                    <Route path='/join' element={<RoomJoinPage />} />
                    <Route path='/create' element={<CreateRoomPage />} />
                    <Route path='/room/:roomCode' element={<Room leaveRoomCallback={clearRoomCode} />} />
                </Routes>                
            </Router>  
        </div>
    )
}

const appDiv = document.getElementById("app")
render(<App />, appDiv)

