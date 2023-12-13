import * as _React from 'react';
import { useState } from 'react'; 
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'; 
import {
    onAuthStateChanged,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword 
} from 'firebase/auth'; 
import { SubmitHandler, useForm } from 'react-hook-form'; 
import { useNavigate } from 'react-router-dom'; 
import {
    Box,
    Button,
    Typography,
    Snackbar, //allow us to have an alert box popup in the corner for signin errors or success alert
    Stack,
    Divider,
    CircularProgress, //Loading symbol
    Dialog,
    DialogContent,
    Alert } from '@mui/material' 


// internal imports
import { NavBar, InputText, InputPassword } from '../sharedComponents'
import shopImage from '../../assets/images/banner.jpg'; 


// creating our dictionary/object for our css styling 

const authStyles = {
    main: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${shopImage});`,
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top 5px', 
        position: 'absolute',
        marginTop: '10px'
    },
    stack: {
        width: '400px',
        marginTop: '100px',
        marginRight: 'auto', //used a lot to center your div
        marginLeft: 'auto',
        color: 'white'
    },
    button: {
        width: '175px',
        fontSize: '14px'
    }
}


// creating our interfaces 

interface Props {
    title: string
}


interface ButtonProps {
    open: boolean 
    onClick: () => void
}


interface SubmitProps {
    email: string
    password: string 
}


// creating a literal union type for our different alerts 
export type MessageType = 'error' | 'warning' | 'info' | 'success'



// create a google button component
const GoogleButton = (_props: ButtonProps ) => {
    // setting up all of our hooks & variables
    const [ open, setOpen ] = useState(false) //sets state of open to open up our signin boxes
    const [ message, setMessage ] = useState<string>() //setting the messages for our alerts
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate() //insantiating useNavigate function to use 
    const auth = getAuth() //monitoring the state of our authentication (either true or false)
    const  [ signInWithGoogle, _user, loading, error ] = useSignInWithGoogle(auth)


    const signIn = async () => {
        await signInWithGoogle() //call this function which pulls up a Google Dialogue box so you 
                                //can select your google user & it will sign you in with that user

        // going to use local storage which is essentially temporary storage
        localStorage.setItem('auth', 'true') //key/value pairs in string format 
        onAuthStateChanged(auth, (user) => {

            if (user) {
                localStorage.setItem('user', user.email || "") //use this on our navbar to show who is currently logged in
                localStorage.setItem('uuid', user.uid || "") //use this for our cart to make them unique for our users & for our orders
                setMessage(`Successfully logged in ${user.email}`)
                setMessageType('success')
                setOpen(true)
                // going to use setTimeout to display messagae for a short period & then navigate elsewhere
                setTimeout(() => {navigate('/shop')}, 2000) //setTimeout takes 2 arguments, the first is function, second is time
            }
        })

        if (error) {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        }

        if (loading) {
            return <CircularProgress />
        }

    }

    return (
        <Box>
            <Button
                variant = 'contained'
                color = 'info'
                size = 'large'
                sx = { authStyles.button }
                onClick = { signIn }
            >
                Sign In With Google
            </Button>
            <Snackbar
                open = {open}
                autoHideDuration={2000}
                onClose = { () => setOpen(false) }
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}


const SignIn = () => {
    // setup our hooks
    const [ open, setOpen ] = useState(false) //sets state of open to open up our signin boxes
    const [ message, setMessage ] = useState<string>() //setting the messages for our alerts
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate() //insantiating useNavigate function to use 
    const auth = getAuth() //monitoring the state of our authentication (either true or false)
    const { register, handleSubmit } = useForm<SubmitProps>({})


    const onSubmit:SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault(); //prevents the default functionality of any event because we are about to code out our event


        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((_userCredential) => {
            // if it successfully goes into .then then we have successfully logged in with no errors
            localStorage.setItem('auth', 'true') //backup for monitoring if someone is logged in or not
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    localStorage.setItem('user', user.email || "") //use this on our navbar to show who is currently logged in
                    localStorage.setItem('uuid', user.uid || "") //use this for our cart to make them unique for our users & for our orders
                    setMessage(`Successfully logged in ${user.email}`)
                    setMessageType('success')
                    setOpen(true)
                    // going to use setTimeout to display messagae for a short period & then navigate elsewhere
                    setTimeout(() => {navigate('/shop')}, 2000) //setTimeout takes 2 arguments, the first is function, second is time
                }
            } )
        })
        .catch((error) => {
            const errorMessage = error.message 
            setMessage(errorMessage)
            setMessageType('error')
            setOpen(true)
        })

    }
    
    return (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Typography variant='h6'>Sign Into Your Account</Typography>
                <Box>
                    <label htmlFor='email'></label>
                    <InputText {...register('email')} name='email' placeholder='Email Here' />
                    <label htmlFor='password'></label>
                    <InputPassword {...register('password')} name='password' placeholder='Password must be 6 characters or longer' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open = {open}
                autoHideDuration={2000}
                onClose = { () => setOpen(false) }
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}



const SignUp = () => {
    // setup our hooks
    const [ open, setOpen ] = useState(false) //sets state of open to open up our signin boxes
    const [ message, setMessage ] = useState<string>() //setting the messages for our alerts
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate() //insantiating useNavigate function to use 
    const auth = getAuth() //monitoring the state of our authentication (either true or false)
    const { register, handleSubmit } = useForm<SubmitProps>({})


    const onSubmit:SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault(); //prevents the default functionality of any event because we are about to code out our event


        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((_userCredential) => {
            // if it successfully goes into .then then we have successfully logged in with no errors
            localStorage.setItem('auth', 'true') //backup for monitoring if someone is logged in or not
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    localStorage.setItem('user', user.email || "") //use this on our navbar to show who is currently logged in
                    localStorage.setItem('uuid', user.uid || "") //use this for our cart to make them unique for our users & for our orders
                    setMessage(`Successfully logged in ${user.email}`)
                    setMessageType('success')
                    setOpen(true)
                    // going to use setTimeout to display messagae for a short period & then navigate elsewhere
                    setTimeout(() => {navigate('/shop')}, 2000) //setTimeout takes 2 arguments, the first is function, second is time
                }
            } )
        })
        .catch((error) => {
            const errorMessage = error.message 
            setMessage(errorMessage)
            setMessageType('error')
            setOpen(true)
        })

    }
    
    return (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Typography variant='h6'>Sign Up for Free!</Typography>
                <Box>
                    <label htmlFor='email'></label>
                    <InputText {...register('email')} name='email' placeholder='Email Here' />
                    <label htmlFor='password'></label>
                    <InputPassword {...register('password')} name='password' placeholder='Password must be 6 characters or longer' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open = {open}
                autoHideDuration={2000}
                onClose = { () => setOpen(false) }
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}




export const Auth = (props:Props) => {
    // setup our Hooks
    const [open, setOpen] = useState(false)
    const [ signType, setSignType ] = useState<string>()



    return (
        <Box>
            <NavBar />
            <Box sx={ authStyles.main}>
                <Stack direction = 'column' alignItems = 'center' textAlign = 'center' sx={authStyles.stack}>
                    <Typography variant='h2' sx={{color: 'white'}}>
                        {props.title}
                    </Typography>
                    <br />
                    <Typography variant='h5'>
                        Track your shops items for free!
                    </Typography>
                    <br />
                    <GoogleButton open={open} onClick={() => setOpen(false)} />
                    <Divider variant = 'fullWidth' color = 'white' />
                    <br />
                    <Stack 
                        width = '100%'
                        alignItems = 'center'
                        justifyContent = 'space-between'
                        direction = 'row'
                    >
                        <Button 
                            variant = 'contained'
                            color = 'primary'
                            size = 'large'
                            sx = { authStyles.button}
                            onClick = { () => { setOpen(true); setSignType('signin')}}
                        >
                            Email Login
                        </Button>
                        <Button 
                            variant = 'contained'
                            color = 'primary'
                            size = 'large'
                            sx = { authStyles.button}
                            onClick = { () => { setOpen(true); setSignType('signup')}}
                        >
                            Email Signup
                        </Button>
                    </Stack>
                </Stack>
                <Dialog open={open} onClose = {() => setOpen(false)}>
                    <DialogContent>
                        { signType === 'signin' ? <SignIn /> : <SignUp />}
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    )




}
