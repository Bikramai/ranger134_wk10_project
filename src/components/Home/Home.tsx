import * as _React from 'react';
import { styled } from '@mui/system'; 
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; 


// internal import
import shopImage from '../../assets/images/banner.jpg'
import { NavBar } from '../sharedComponents';

interface Props  {
    title: string
}

// code out our styled components
const Root = styled('div')({
    padding: 0,
    margin: 0
})

const Main = styled('main')({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${shopImage});`,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center top 5px', 
    position: 'absolute',
    marginTop: '10px'
})

const MainText = styled('div')({
    textAlign: 'center',
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white'
})



// This is our firsst functional based component!
export const Home = (props: Props) => {
    const myAuth = localStorage.getItem('auth')

    // return is always HTML & it can have ONLY 1 parent div
    return (
        <Root>
            <NavBar />
            <Main>
                <MainText>
                    <Typography variant='h3'> { props.title }</Typography>
                    <Button sx={{ marginTop: '10px'}} component={Link} to={myAuth === 'true' ? "/shop" : "/auth"} variant='contained'>Click Here⛲️</Button>
                </MainText>
            </Main>
        </Root>
    )
} 