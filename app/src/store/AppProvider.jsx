import React from 'react';
import AppContext from './AppContext';

export default class AppProvider extends React.Component {

    state = {

    };

    render() {

        const value =
        {
            state: this.state
        };

        return (
            <AppContext.Provider value={value}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}
