import React from "react";
import Header from "./Header";
import { Container } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'; // to tie up the css 
const layout = (props) => {
    return (
        <Container>
            <Header/>
            {props.children}
        </Container>
    );
};

export default layout;