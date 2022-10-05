# Why update 

- The host need to be able to change de room configs
- We will use the patch method now
- We will create a new serializer to update the room infos
```py
    class UpdateRoomSerializer(serializers.ModelSerializer):

        #This function is to disable the update in code var in Room table, because it's unique and we can't update this variable
        code = serializers.CharField(validators=[])
        class Meta:
            model = Room
            fields = ('guest_can_pause', 'votes_to_skip', 'code')
```
Seems like the CreateRoomSerializer, but with 'code' var

## Updating frontend
- In room page will have a settings button to the host, which is almost identical to the create room page
- We need to add a settings buttons JUST TO THE HOST OF THE ROOM
```js
    //Creating a funtion to set the state that we create to say if the page shows or not the settings button
    const updateShowSettings = (value) => {
        setShowSettings(value)
    }

    //Function to render the settings button
    const renderSettingButton = () => {
        return(
            <Grid item xs={12} align='center'>
                <Button variant='contained' color='primary' onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        )
    }

    ....
    //That's the conditional rendering, if the user is the host, the function to render the button will be called
    {roomState.isHost ? renderSettingButton() : null}
```