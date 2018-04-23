import React, { Component } from 'react';

import Aux from '../../hoc/Auxilary';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'; 

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false});
    }

    sideDrawerOpenHandler = () => {
        console.log('side drawer toggle clicked');
        this.setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        });
    }
    

    render () {
        console.log('showSideDrawer is now ' + this.state.showSideDrawer);
        return (
            <Aux>
                <Toolbar toggleClickHandler={this.sideDrawerOpenHandler}/>
                <SideDrawer 
                    open={this.state.showSideDrawer} 
                    buttonHandler={this.sideDrawerOpenHandler} closed={this.sideDrawerClosedHandler} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
    
        )
    }
};

export default Layout;