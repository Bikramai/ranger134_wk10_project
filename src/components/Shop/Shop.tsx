import * as _React from 'react'; 
import { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Stack,
    Typography,
    Snackbar,
    Alert } from '@mui/material'; 

import InfoIcon from '@mui/icons-material/Info';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getDatabase, ref, push } from 'firebase/database'; 


// internal imports
import { useGetShop, ShopProps } from '../../customHooks';
import { NavBar, InputText } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { MessageType } from '../Auth';


//  creating our Shop CSS style object 
export const shopStyles = {
    main: {
        backgroundColor: theme.palette.secondary.main,
        height: '100%',
        width: '100%',
        color: 'white',
        backgroundSize: 'cover',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: 'fixed',
        position: 'absolute',
        overflow: 'auto',
        paddingBottom: '100px'
    },
    grid: {
        marginTop: '25px', 
        marginRight: 'auto', 
        marginLeft: 'auto', 
        width: '70vw'
    },
    card: {
        width: "300px", 
        padding: '10px',
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.secondary.light,
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    cardMedia: {
        width: '95%',
        margin: 'auto',
        marginTop: '5px',
        aspectRatio: '1/1',
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    button: {
        color: 'white', 
        borderRadius: '50px',
        height: '45px',
        width: '250px',
        marginTop: '10px'
    },
    stack: {
        width: '75%', 
        marginLeft: 'auto', 
        marginRight: 'auto'
    },
    stack2: {
        border: '1px solid', 
        borderColor: theme.palette.primary.main, 
        borderRadius: '50px', 
        width: '100%',
        marginTop: '10px'
    },
    typography: { 
        marginLeft: '15vw', 
        color: "white", 
        marginTop: '100px'
    }

}


// creating our interfaces for our cart & our form submit
export interface SubmitProps {
    quantity: string 
}


interface CartProps {
    cartItem: ShopProps
}


const AddToCart = (cart: CartProps ) => {
    // setup our hooks & variables
    const db = getDatabase();
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const { register, handleSubmit } = useForm<SubmitProps>({})
    let myCart = cart.cartItem 


    const onSubmit: SubmitHandler<SubmitProps> = async (data: SubmitProps, event: any) => {
        if (event) event.preventDefault(); 

        const userId = localStorage.getItem('uuid') //grabbing the user id from localstorage 
        const cartRef = ref(db, `carts/${userId}/`) // this is where we are pathing in our database 



        myCart['quantity']=parseInt(data.quantity)
        

        //this is grabbing our data object to send to the database for our cart 


        // if they try to add a quantity greater than available it'll just go down to available quantity 

        // if (myCart.quantity > parseInt(data.quantity)) {
        //     myCart.quantity = parseInt(data.quantity)
        // }

        // push because we are pushing an object to a list essentially
        // takes in two arguments, 1st is where we are pushing, 2nd is what we are pushing
        push(cartRef, myCart)
        .then((_newCartRef) => {
            setMessage(`Successfully added item ${myCart.title} to Cart`)
            setMessageType('success')
            setOpen(true)
        })
        .then(() => {
            setTimeout(()=>{window.location.reload()}, 2000)
        })
        .catch((error) => {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }

    return (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Box>
                    <label htmlFor='quantity'>How much of {myCart.title} do you want to add?</label>
                    <InputText {...register('quantity')} name='quantity' placeholder='Quantity Here' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={()=> setOpen(false)}
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )
}




export const Shop = () => {
    // setup our hooks
    const { shopData } = useGetShop() //list of all lour data objects
    const [ currentShop, setCurrentShop] = useState<ShopProps>(); //one and only one object we will send to our cart 
    const [ cartOpen, setCartOpen ] = useState(false); 

    console.log(shopData)
    return (
        <Box sx={ shopStyles.main }>
            <NavBar />
            <Typography 
                variant = 'h4'
                sx = { shopStyles.typography }
                >
                The Shop
            </Typography>
            <Grid container spacing={3} sx={shopStyles.grid}>
                {shopData.map((shop: ShopProps, index: number ) => (
                    <Grid item key={index} xs={12} md={6} lg={4}>
                        <Card sx={shopStyles.card}>
                            <CardMedia 
                                component='img'
                                sx={shopStyles.cardMedia}
                                image={shop.img}
                                
                            />
                            <CardContent>
                                <Stack 
                                    direction='column'
                                    justifyContent='space-between'
                                    alignItems = 'center'
                                >
                                    <Stack 
                                        direction = 'row'
                                        alignItems = 'center'
                                        justifyContent = 'space-between'
                                    >
                                        <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
                                            <AccordionSummary 
                                                expandIcon={<InfoIcon sx={{ color: theme.palette.primary.main }}/>}
                                            >
                                                <Typography>{shop.title}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>{shop.img}</Typography>
                                                <Typography>{shop.price}</Typography>
                                                <Typography>{shop.saleprice}</Typography>
                                                <Typography>{shop.rating}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Stack>
                                <Button
                                    size='medium'
                                    variant='outlined'
                                    sx={shopStyles.button}
                                    onClick = {()=>{ setCurrentShop(shop) ; setCartOpen(true)}}
                                >
                                    Add to Cart - ${parseFloat(shop.price).toFixed(2)}
                                </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={cartOpen} onClose={()=>{setCartOpen(false)}}>
            <DialogContent>
                    <DialogContentText>Add to Cart</DialogContentText>
                    <AddToCart  cartItem = {currentShop as ShopProps}/>
                </DialogContent>
            </Dialog>

        </Box>
    )
}