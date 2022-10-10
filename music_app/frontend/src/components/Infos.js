import React, { useEffect, useState } from 'react'
import { Grid, Button, Typography, IconButton} from '@mui/material'
import { NavigateBeforeRounded, NavigateNextRounded } from '@mui/icons-material'
import {Link} from 'react-router-dom'

const pages = {
    JOIN: 'pages.join',
    CREATE: 'pages.create'
}

export default function InfoComponent(props) {
    const [page, setPage] = useState(pages.JOIN)

    function joinInfo() {
        return "Join Page"
    }

    function createInfo() {
        return 'Create Page'
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align='center'>
                <Typography component='h4' variant='h4'>
                    What is Zé's Party
                </Typography>
            </Grid>

            <Grid item xs={12} align='center'>
                <Typography variant='body1'>
                    {page === pages.JOIN ? joinInfo() : createInfo()}
                </Typography>
            </Grid>

            <Grid item xs={12} align='center'>
                <IconButton onClick={() => {
                    page===pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE)
                }}>
                    {page===pages.CREATE ? <NavigateBeforeRounded /> : <NavigateNextRounded /> }
                </IconButton>
            </Grid>
            <Grid item xs={12} align='center'>
                <Button color='secondary' variant='contained' to='/' component={Link}>
                    Back
                </Button>

            </Grid>
            

        </Grid>
    )
}