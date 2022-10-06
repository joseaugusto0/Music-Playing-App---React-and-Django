## We need to add a default value to CreateRoomPage
in CreateRoomPage.js
```js

    export function CreateRoomPage () {

    const defaultProps ={
        votesToSkip: 2,
        guestCanPause:true,
        update: false,
        roomCode: null,
        updateCallback: () => {}
    }

    const [state, setState] = useState({
        guestCanPause: defaultProps.guestCanPause,
        votesToSkip: defaultProps.votesToSkip
    })
```


## Making an alert if the update was sucessfuly
```js
    import { Collapse } from "@mui/material"
    ...

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
```
Alert is a component in material that make a cool alert that we can close