import React, {useState, useEffect} from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import {Grid, Button, Typography} from "@mui/material"
import { CreateRoomPage } from './CreateRoomPage';
import { MusicPlayer } from './MusicPlayer';

export function Room(leaveRoomCallback) {

    const _leaveRoomCallback = leaveRoomCallback

    var [roomState, setRoomState] = useState({
        votesToSkip:2,
        guestCanPause: false,
        isHost: false,
        roomCode: null,
        spotifyAuthenticated: false,
    })

    var [songInfos, setSongInfos] = useState({})

    var [showSettings, setShowSettings] = useState(false)

    const params = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        getRoomDetails()
        getCurrentSong()
        const interval = setInterval(() => getCurrentSong(),1000)
        return () => clearInterval(interval)
    }, [])

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
                            isHost: data.is_host,
                            roomCode: data.code
                        }
                    )
                )

                if (data.is_host){
                    authenticateSpotify()
                }
            })

            
    }

    const getCurrentSong = () => {
        fetch('/spotify/current-song')
            .then((response) => {
                console.log(response)
                if(!response.ok){
                    return {};
                }
                return response.json();
            })
            .then((data) => {
                setSongInfos(data)
            })

    }

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated')
            .then((response) => response.json())
            .then((data) => {

                setRoomState( (prevState) =>
                    (
                        {
                            ...prevState,
                            spotifyAuthenticated: data.Status
                        }
                    )
                )

                if (!data.Status){
                    fetch('/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url)
                        })
                }
            }
        )
    }

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

    const updateShowSettings = (value) => {
        setShowSettings(value)
    }

    const renderSettingButton = () => {
        return(
            <Grid item xs={12} align='center'>
                <Button variant='contained' color='primary' onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        )
    }

    const renderSettings = () => {
        return(
        <Grid container spacing={1}>
            <Grid item xs={12} align='center'>
                <CreateRoomPage
                    update={true} 
                    votesToSkip={roomState.votesToSkip}
                    guestCanPause = {roomState.guestCanPause}
                    roomCode = {roomState.roomCode}
                    updateCallback={getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align='center'>
                <Button variant='contained' color='primary' onClick={ () => {updateShowSettings(false)}}>
                    Close
                </Button>
            </Grid>
        </Grid>
        );
    }

    return(
        <>
        {showSettings ? renderSettings() : 
            <Grid container spacing={1}>
            
                <Grid item xs={12} align="center">
                    <Typography variant='h4' component='h4'>
                        Code: {params.roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer 
                    {...songInfos}
                />
                {roomState.isHost ? renderSettingButton() : null}

                <Grid item xs={12} align="center">
                    <Button color="primary" variant='contained' onClick={leaveButtonPressed}>
                        Leave Room
                    </Button>
                </Grid>
            
            </Grid>
        }
        </>
    )
}
