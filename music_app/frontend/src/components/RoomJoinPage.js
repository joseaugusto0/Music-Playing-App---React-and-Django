import React, {Component, useState} from "react";
import { TextField, Button, Grid, Typography} from '@mui/material'
import {Link, useNavigate} from 'react-router-dom'

export function RoomJoinPage () {

    var [pageState, setPageState] = useState({
        roomCode: "",
        error: ""
    })
    const navigate = useNavigate();

    const _handleTextFieldChange = (e) => {
        setPageState( (prevState) => (
            {
                ...prevState,
                roomCode: e.target.value
            }
        ))
    }

    const _roomButtonPressed = (e) => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: pageState.roomCode
            })
        }

        fetch('/api/join-room', requestOptions).then((response) => {
            if (response.ok) {
                navigate('/room/'+pageState.roomCode)
            }else{
                setPageState( (prevState) => ({
                    ...prevState,
                    error: "Room not found"
                })

                )
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return(
        <Grid container spacing={1} >
            <Grid item xs={12} align="center">
                <Typography variant='h4' component='h4'>
                    Join a Room
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <TextField 
                    error={pageState.error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    helperText={pageState.error}
                    variant="outlined"
                    onChange={_handleTextFieldChange}
                />
            </Grid>

            

            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>

                <Button variant="contained" color="primary" onClick={_roomButtonPressed}>
                    Enter Room
                </Button>
            </Grid>

            <Grid item xs={12} align="center">
                
            </Grid>
        </Grid>
    )

    
}

