import * as _React from 'react';
// import React from 'react'; other way if you are getting red squiggles from above way
import { forwardRef } from 'react'; //allow our component forms to forward the information/data coming from user
import { TextField } from '@mui/material'; 


interface inputState {
    name: string,
    placeholder: string
}



export const InputText = forwardRef((props: inputState, ref) => {
    return (
        <TextField
            variant='outlined'
            margin='normal'
            inputRef={ref} //data coming from user submitall will be forwarded to the form using this input box
            fullWidth
            type = 'text'
            {...props}
        >
        </TextField>
    )
})

export const InputPassword = forwardRef((props: inputState, ref) => {
    return (
        <TextField
            variant='outlined'
            margin='normal'
            inputRef={ref} //data coming from user submitall will be forwarded to the form using this input box
            fullWidth
            type = 'password'
            {...props}
        >
        </TextField>
    )
})