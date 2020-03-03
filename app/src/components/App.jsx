import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Segment, Responsive, Visibility } from 'semantic-ui-react';
import Header from './Header';
import Footer from './Footer';
import AppProvider from "../store/AppProvider";
import AppContext from "../store/AppContext";
import { menuItems } from "./config";

const getWidth = () => {
    const isSSR = typeof window === 'undefined'
  
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

export default class App extends React.Component {

    state = {
        menuItems
    };

    handleMenuItemClick = (mi) =>
    {
        const { menuItems } = this.state;

        menuItems.forEach(m => m.active = false);
        menuItems.find(m => m.title === mi.title).active = true;
        
        this.setState({ menuItems });
    }
    
    render() {
        return (
            <Router>
                <AppProvider>
                    <AppContext.Consumer>
                        {
                            (context) => {

                                return (
                                    <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
                                        <Visibility once={false}>
                                            <Segment
                                                basic={true}
                                                textAlign='center'
                                                style={{ minHeight: 70, padding: '1em 0em'}}
                                                vertical>
                                                <Header menuItems={menuItems} onClick={this.handleMenuItemClick} />
                                            </Segment>

                                            <Switch>
                                                {
                                                    menuItems.map(mi => {

                                                        const Component = mi.component;

                                                        return (
                                                            <Route key={mi.title} path={mi.link} exact component={Component} />
                                                        )
                                                    })
                                                }                                                
                                            </Switch>  
                                            <Redirect from="/" to={menuItems[0].link} />                                          
                                        </Visibility>
                                        <Footer />                
                                    </Responsive>
                                )
                            }                        
                        }
                    </AppContext.Consumer>
                </AppProvider>                
            </Router>
        )
    }
}