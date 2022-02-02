import 'semantic-ui-css/semantic.min.css'
import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './header';

const Layout = (props) => {
    return (
        <Container>
            <Header />
            {props.children}
        </Container>
    );
};

export default Layout;
