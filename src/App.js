/* global _spPageContextInfo */

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { getUserInfo } from "./utils/sharepointConnect";

import './App.css';

/* UI Components */
import HeaderComponent from './components/headerComponent'
import LobbyComponent from './components/lobbyComponent'
import StoreComponent from './components/storeComponent'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userId: null,
            screenSharePlugin: true
        };
        console.log('Initializing');
    }

    componentWillMount() {
        let userId = this.state.userId;

        if (document.getElementById('MSOLayout_InDesignMode') !== null) {
            userId = _spPageContextInfo.userId;
        }

        getUserInfo(userId)
            .then(res => {
                this.setState({
                    userName: res.d.Title,
                    userId: userId
                })
            });
    }

    render() {
        const { userName, userId } = this.state;
        return (
            <HashRouter>
                <Switch>
                    <Route
                        exact path="/"
                        render={(routeProps) => (
                            <div className="wrapper">
                                <HeaderComponent
                                    {...routeProps}
                                />
                                <LobbyComponent
                                    userName={userName}
                                    userId={userId}
                                    {...routeProps}
                                />
                            </div>
                        )}
                    />
                    <Route
                        path="/store/:roomId?/:section?"
                        render={(routeProps) => (
                            <div className="wrapper">
                                <HeaderComponent
                                    {...routeProps}
                                />
                                <StoreComponent
                                    userName={userName}
                                    userId={userId}
                                    {...routeProps}
                                />
                            </div>
                        )}
                    />
                </Switch>
            </HashRouter>
        );
    }
}

export default App;
