import React, {Component} from 'react'

import { Grid, Typography, Card, IconButton, LinearProgress } from '@mui/material'
import { PlayCircle, SkipNext, PauseCircle } from '@mui/icons-material'


export function MusicPlayer(songInfos) {
    const songProgress = (songInfos.time / songInfos.duration)*100

    return (
        <Card>
            <Grid container alignItem='center'>

                <Grid item align='center' xs={4}>
                    <img src={songInfos.image_url} height='100%' width='100%'/>
                </Grid>


                <Grid item align='center' xs={8}>
                    <Typography component='h5' variant='h5'>
                        {songInfos.title}
                    </Typography>

                    <Typography color='textSecondary' variant='subtitle1'>
                        {songInfos.artist}
                    </Typography>

                    <div>
                        <IconButton>
                            {songInfos.is_playing ? <PauseCircle/> : <PlayCircle />}
                        </IconButton>

                        <IconButton>
                            <SkipNext />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>

            <LinearProgress variant='determinate' value={songProgress} />
        </Card>
    )

}