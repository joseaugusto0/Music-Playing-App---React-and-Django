import React from "react";
import {Grid, Button, ButtonGroup, Typography} from '@mui/material'
import { Link } from 'react-router-dom'

export default function HomePage () {

    return(
        <Grid container spacing={3}>
            <Grid item xs={12} align='center'>
                <Typography variant='h3' compact='h3'>
                    Zé's Party
                </Typography>
            </Grid>

            <Grid item xs={12} align='center'>
                <ButtonGroup disableElevation variant="contained" color="primary">
                    <Button color='primary' to='/join' component={ Link }>
                        Join a Room
                    </Button>

                    <Button color='secondary' to='/create' component={ Link }>
                        Create a Room
                    </Button>

                    <Button color='primary' to='/info' component={ Link }>
                        Info
                    </Button>

                </ButtonGroup>
            </Grid>

        </Grid>
    )
    
}


