import React, {Component, useState} from "react";
import {Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';


export function CreateRoomPage () {
    const [state, setState] = useState({
        guestCanPause: true,
        votesToSkip: '2'
    })

    const navigate = useNavigate();

    const handleVotesChanged = (e) => {
        setState( (prevState) => (
            {
                ...prevState,
                votesToSkip: e.target.value
            }
        ))
    }
    
    const HandleGuestCanPause = (e) => {
        setState( (prevState) => (
            {
                ...prevState,
                guestCanPause: e.target.value==='true' ? true : false
            }
        ))
    }

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                votes_to_skip: state.votesToSkip,
                guest_can_pause: state.guestCanPause
            })
        }

        fetch('/api/create-room', requestOptions
            ).then((response) => response.json()
            ).then((data) => navigate('/room/'+data.code))
    }

    return(
        
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    Create A Room
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <FormControl component='fieldset'> 
                    <FormHelperText>
                        <div align='center'>
                            Guest Controle of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue='true' onChange={HandleGuestCanPause}>
                        <FormControlLabel 
                            value='true' 
                            control={<Radio color='primary' />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel 
                            value='false' 
                            control={<Radio color='secondary' />}
                            label="No Control"
                            labelPlacement="bottom"
                        />

                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField 
                        required={true} 
                        type="number" 
                        defaultValue={state.votesToSkip}
                        onChange={handleVotesChanged}
                        inputProps={{
                            min:1,
                            style: {textAlign: "center"}
                        }}
                        
                    />
                    <FormHelperText>
                        <div align="center">
                            Votes Required to Skip
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>Create a Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid>
    );
}

