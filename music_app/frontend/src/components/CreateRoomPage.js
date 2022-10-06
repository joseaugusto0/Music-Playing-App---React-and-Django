import React, {Component, useState} from "react";
import {Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import { Collapse, Alert } from "@mui/material"


export function CreateRoomPage(props) {

    const _props = props
    const title = _props.update ? "Update Room" : "Create a Room"

    const defaultProps ={
        votesToSkip: '2',
        guestCanPause:true,
        update: false,
        roomCode: null,
        updateCallback: () => {}
    }

    const [state, setState] = useState({
        guestCanPause: _props.guestCanPause,
        votesToSkip: _props.votesToSkip,
        errorMsg: "",
        sucessMsg: ""
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

    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                votes_to_skip: state.votesToSkip,
                guest_can_pause: state.guestCanPause,
                code: props.roomCode
            })
        }

        fetch('/api/update-room', requestOptions
            ).then((response) => {

                if (response.ok){
                    setState( (prevState) => (
                        {
                            ...prevState,
                            sucessMsg: "Room updated sucessfully"
                        }
                    ))
                    
                }else{
                    setState( (prevState) => (
                        {
                            ...prevState,
                            errorMsg: "Room updated sucessfully"
                        }
                    ))
                }
                _props.updateCallback();
            })
        
    }

    const renderButtons = () => {
        if (!props.update) {
            return (
                <Grid container spacing={2}>
                    <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>Create a Room</Button>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
                    </Grid>
                </Grid>
            )
        }
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>Update Room</Button>
                </Grid>
            </Grid>
        )
        
    }

    const clearMessage = (type = 'sucess') => {
        if (type=='sucess'){
            setState( (prevState) => (
                {
                    ...prevState,
                    sucessMsg: ""
                }
            ))
        }else{
            setState( (prevState) => (
                {
                    ...prevState,
                    errorMsg: ""
                }
            ))
        }
    }

    return(
        
        <Grid container spacing={2}>

            <Grid item xs={12} align="center">
                <Collapse 
                    in={state.errorMsg != "" || state.sucessMsg != ""}
                > 

                    {state.sucessMsg != "" ? 
                        (<Alert severity='success' onClose={() => {clearMessage()}}>{state.sucessMsg}</Alert>) :
                        (<Alert severity="error" onClose={()=> {clearMessage("error")}}>{state.errorMsg}</Alert>)
                    }

                </Collapse>
            </Grid>

            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    {title}
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <FormControl component='fieldset'> 
                    <FormHelperText>
                        <div align='center'>
                            Guest Controle of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={_props.guestCanPause.toString()} onChange={HandleGuestCanPause}>
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

            {renderButtons()}
        </Grid>
    );
}

