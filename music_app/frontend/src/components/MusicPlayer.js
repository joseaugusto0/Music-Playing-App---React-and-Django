import React, {Component} from 'react'

import { Grid, Typography, Card, IconButton, LinearProgress } from '@mui/material'
import { PlayCircle, SkipNext, PauseCircle } from '@mui/icons-material'


export function MusicPlayer(songInfos) {
    const songProgress = (songInfos.time / songInfos.duration)*100

    const pauseSong = () => {
        const requestOption = {
            method: 'PUT',
            headers: {'Content-type':'application/json'}
        }
        fetch('/spotify/pause-song', requestOption)
    }

    const playSong = () => {

        const requestOption = {
            method: 'PUT',
            headers: {'Content-type':'application/json'}
        }
        fetch('/spotify/play-song', requestOption)
    }

    const skipSong = () => {

        const requestOption = {
            method: 'POST',
            headers: {'Content-type':'application/json'}
        }
        fetch('/spotify/skip-song', requestOption)
    }

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
                        <IconButton onClick={() => {songInfos.is_playing ? pauseSong() : playSong()}}>
                            {songInfos.is_playing ? <PauseCircle/> : <PlayCircle />}
                        </IconButton>

                        <IconButton onClick={() => {skipSong()}}>
                            <SkipNext /> {songInfos.votes} /{" "} {songInfos.votes_required}
                        </IconButton>
                    </div>
                </Grid>
            </Grid>

            <LinearProgress variant='determinate' value={songProgress} />
        </Card>
    )

}