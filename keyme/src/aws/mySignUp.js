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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("@aws-amplify/core");
var auth_1 = require("@aws-amplify/auth");
var AuthPiece_1 = require("../../node_modules/aws-amplify-react/dist/Auth/AuthPiece");
var Amplify_UI_Components_React_1 = require("../../node_modules/aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React");
var SignUp = /** @class */ (function (_super) {
    __extends(SignUp, _super);
    function SignUp(props) {
        var _this = _super.call(this, props) || this;
        _this._validAuthStates = ['signUp'];
        _this.signUp = _this.signUp.bind(_this);
        _this.inputs = {};
        return _this;
    }
    SignUp.prototype.signUp = function () {
        var _this = this;
        var _a = this.inputs, username = _a.username, password = _a.password, email = _a.email;
        if (!auth_1.default || typeof auth_1.default.signUp !== 'function') {
            throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
        }
        var signup_info = {
            username: username,
            password: password,
            attributes: {
                email: email
            }
        };
        auth_1.default.signUp(signup_info).then(function () { return _this.changeState('confirmSignUp', username); })
            .catch(function (err) { return _this.error(err); });
    };
    SignUp.prototype.showComponent = function (theme) {
        var _this = this;
        var hide = this.props.hide;
        if (hide && hide.includes(SignUp)) {
            return null;
        }
        return (React.createElement(Amplify_UI_Components_React_1.FormSection, { theme: theme },
            React.createElement(Amplify_UI_Components_React_1.SectionHeader, { theme: theme }, core_1.I18n.get('Create a new KeyMe account')),
            React.createElement(Amplify_UI_Components_React_1.SectionBody, { theme: theme },
                React.createElement(Amplify_UI_Components_React_1.FormField, { theme: theme },
                    React.createElement(Amplify_UI_Components_React_1.InputLabel, null,
                        core_1.I18n.get('Username'),
                        " *"),
                    React.createElement(Amplify_UI_Components_React_1.Input, { autoFocus: true, placeholder: core_1.I18n.get('Create a username'), theme: theme, key: "username", name: "username", onChange: this.handleInputChange })),
                React.createElement(Amplify_UI_Components_React_1.FormField, { theme: theme },
                    React.createElement(Amplify_UI_Components_React_1.InputLabel, null,
                        core_1.I18n.get('Password'),
                        " *"),
                    React.createElement(Amplify_UI_Components_React_1.Input, { placeholder: core_1.I18n.get('Create a password'), theme: theme, type: "password", key: "password", name: "password", onChange: this.handleInputChange })),
                React.createElement(Amplify_UI_Components_React_1.FormField, { theme: theme },
                    React.createElement(Amplify_UI_Components_React_1.InputLabel, null,
                        core_1.I18n.get('Email Address'),
                        " *"),
                    React.createElement(Amplify_UI_Components_React_1.Input, { placeholder: "janedoe@email.com", theme: theme, key: "email", name: "email", onChange: this.handleInputChange })),
                React.createElement(Amplify_UI_Components_React_1.FormField, { theme: theme },
                    React.createElement(Amplify_UI_Components_React_1.SelectInput, { theme: theme },
                ))),
            React.createElement(Amplify_UI_Components_React_1.SectionFooter, { theme: theme },
                React.createElement(Amplify_UI_Components_React_1.SectionFooterPrimaryContent, { theme: theme },
                    React.createElement(Amplify_UI_Components_React_1.Button, { onClick: this.signUp, theme: theme }, core_1.I18n.get('Create Account'))),
                React.createElement(Amplify_UI_Components_React_1.SectionFooterSecondaryContent, { theme: theme },
                    core_1.I18n.get('Have an account? '),
                    React.createElement(Amplify_UI_Components_React_1.Link, { theme: theme, onClick: function () { return _this.changeState('signIn'); } }, core_1.I18n.get('Sign in'))))));
    };
    return SignUp;
}(AuthPiece_1.default));
exports.default = SignUp;
//# sourceMappingURL=SignUp.js.map
