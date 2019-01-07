import React, { Component } from 'react';
import { HashRouter, Switch } from 'react-router-dom'
import App from './../App'
import FrontendAuth from './frontendAuth'
import routerConfig from './config'

class IRouter extends Component {
    render() {
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <FrontendAuth config={routerConfig}></FrontendAuth>
                    </Switch>
                </App>
            </HashRouter>
        );
    }
}

export default IRouter;