"use strict";
/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@aws-amplify/core");
var auth_1 = require("@aws-amplify/auth");
var AuthPiece_1 = require("../../node_modules/aws-amplify-react/dist/Auth/AuthPiece");
var Amplify_UI_Components_React_1 = require("../../node_modules/aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React");
var Amplify_UI_Theme_1 = require("../../node_modules/aws-amplify-react/dist/Amplify-UI/Amplify-UI-Theme");
var constants_1 = require("../../node_modules/aws-amplify-react/dist/common/constants");
var logger = new core_1.ConsoleLogger('SignOut');

import React, {Component} from 'react';

export default class MySignOut extends Component{
    constructor(props) {
        super(props);
        this.signOut = _this.signOut.bind(this);
        this.state = {
            authState: props.authState,
            authData: props.authData
        };
    }
    signOut = function () {
        var _this = this;
        var payload = {};
        try {
            payload = JSON.parse(localStorage.getItem(constants_1.default.AUTH_SOURCE_KEY)) || {};
            localStorage.removeItem(constants_1.default.AUTH_SOURCE_KEY);
        }
        catch (e) {
            logger.debug("Failed to parse the info from " + constants_1.default.AUTH_SOURCE_KEY + " from localStorage with " + e);
        }
        logger.debug('sign out from the source', payload);
        var _a = this.props, googleSignOut = _a.googleSignOut, facebookSignOut = _a.facebookSignOut, amazonSignOut = _a.amazonSignOut, auth0SignOut = _a.auth0SignOut;
        switch (payload.provider) {
            case constants_1.default.GOOGLE:
                if (googleSignOut)
                    googleSignOut();
                else
                    logger.debug('No Google signout method provided');
                break;
            case constants_1.default.FACEBOOK:
                if (facebookSignOut)
                    facebookSignOut();
                else
                    logger.debug('No Facebook signout method provided');
                break;
            case constants_1.default.AMAZON:
                if (amazonSignOut)
                    amazonSignOut();
                else
                    logger.debug('No Amazon signout method provided');
                break;
            case constants_1.default.AUTH0:
                if (auth0SignOut)
                    auth0SignOut(payload.opts);
                else
                    logger.debug('No Auth0 signout method provided');
                break;
            default:
                break;
        }
        if (!auth_1.default || typeof auth_1.default.signOut !== 'function') {
            throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
        }
        auth_1.default.signOut()
            .then(function () { return _this.changeState('signedOut'); })
            .catch(function (err) { logger.error(err); _this.error(err); });
    };
    render(){
        var hide = this.props.hide;
        if (hide && hide.includes(SignOut)) {
            return null;
        }
        var authState = this.state.authState;
        var signedIn = (authState === 'signedIn');
        var theme = this.props.theme || Amplify_UI_Theme_1.default;
        if (!signedIn) {
            return null;
        }
        return (
            React.createElement(Amplify_UI_Components_React_1.NavButton, { theme: theme, onClick: this.signOut }, core_1.I18n.get('Sign Out'))
        );
    }
    return SignOut;
}(AuthPiece_1.default));
