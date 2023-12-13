import 'styled-components';
import { Theme } from '@mui/material/styles';

// whenever we refer to styled-components it will auto default to THIS Theme module 
// we are basically extending/inheriting the default Theme and changing it up a bit
declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}