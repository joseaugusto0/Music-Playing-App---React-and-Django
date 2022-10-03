# Creating the CreateRoomPage
```js
    export function CreateRoomPage () {
        const defaultVotes = 2

        return(
            <>
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography component='h4' variant='h4'>
                            Create A Room
                        </Typography>
                    </Grid>
                </Grid>
            </>
            
        );
```
Grid item xs={12} align="center" -> Will create a grid that will fill all horizontal space
Typography component='h4' variant='h4' -> Will create a title with a cool style

## Adding Radio Buttons
```js
    <Grid item xs={12} align="center">
        <FormControl component='fieldset'> //Creating the main Form of our app
            <FormHelperText> //Here is such as a title from our Form
                <div align='center'>
                    Guest Controle of Playback State
                </div>
            </FormHelperText>
            <RadioGroup row defaultValue='true'> //We need to start a Radio group align as a row with default 
            value as true

                <FormControlLabel 
                    value='true' 
                    control={<Radio color='primary' />} //Here is what will be render in this FormControlLabel
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
```

## Adding Text field to insert de votes to skip
```js
    <Grid item xs={12} align="center">
        <FormControl>
            <TextField 
                required={true} //Setting as a required value to be put in our form
                type="number" //Setting the input default as number
                defaultValue={this.defaultVotes}
                inputProps={{
                    min:1, //Setting the min value as 1, we don't want negative votes to skip
                    style: {textAlign: "center"}
                }}
            />
            <FormHelperText> //Adding a label just to tell what this textfield is
                <div align="center">
                    Votes Required to Skip 
                </div>
            </FormHelperText>
        </FormControl>
    </Grid>
```

## Adding buttons
```js
    <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained">Create a Room</Button>
    </Grid>

    <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
    </Grid>
```
variant is the button style, you can see all three differents in MUI docs
Button color="secondary" variant="contained" to="/" component={Link} -> Will redirect to homepage

# Sending the form to backend
```js
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

        fetch('/api/create-room', requestOptions //Sending to our API developed in Django
            ).then((response) => response.json()
            ).then((data) => console.log(data))
    }
```