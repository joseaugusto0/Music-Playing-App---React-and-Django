import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

export function Room () {
    
    var [roomState, setRoomState] = useState({
        votesToSkip:2,
        guestCanPause: false,
        isHost: false,
    })

    const params = useParams();

    const getRoomDetails = () => {
        fetch('/api/get-room' + "?code=" + params.roomCode).then((response) => {
            return response.json()
        }).then((data) => {
            
            setRoomState( (prevState) =>
                (
                    {
                        ...prevState,
                        votesToSkip: data.votes_to_skip,
                        guestCanPause: data.guest_can_pause,
                        isHost: data.is_host
                    }
                )
            )
        })
    }

    useEffect(getRoomDetails, [])
    

    return(
        <div>
            <p>Room: {params.roomCode}</p>
            <p>Votes: {roomState.votesToSkip}</p>
            <p>Guest Can Pause: {roomState.guestCanPause.toString()}</p>
            <p>Is Host: {roomState.isHost.toString()}</p>
        </div>
    )
}