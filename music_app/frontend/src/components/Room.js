import React, {useState, useEffect} from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import {Grid, Button, Typography} from "@mui/material"

export function Room(leaveRoomCallback) {
    

    const _leaveRoomCallback = leaveRoomCallback

    var [roomState, setRoomState] = useState({
        votesToSkip:2,
        guestCanPause: false,
        isHost: false,
    })

    const params = useParams();
    const navigate = useNavigate()

    const getRoomDetails = () => {
        fetch('/api/get-room' + "?code=" + params.roomCode)
            .then((response) => {
                
                if (!response.ok){
                    _leaveRoomCallback();
                    navigate('/')
                }
                return response.json()
            })
            .then((data) => {
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
    
    const leaveButtonPressed = () => {
        
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
        };
        fetch('/api/leave-room', requestOptions)
            .then((_response) => {
                navigate('/')
            })
    }

    return(

        <Grid container spacing={1}>

            <Grid item xs={12} align="center">
                <Typography variant='h4' component='h4'>
                    Code: {params.roomCode}
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <Typography variant='h6' component='h4'>
                    Votes: {roomState.votesToSkip}
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <Typography variant='h6' component='h4'>
                    Guest Can Pause: {roomState.guestCanPause.toString()}
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <Typography variant='h6' component='h4'>
                    Is Host: {roomState.isHost.toString()}
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <Button color="primary" variant='contained' onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
            
        </Grid>
       
    )
}