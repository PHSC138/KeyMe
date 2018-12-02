import React,{Component} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import Nav from './components/top_nav';
import HashView from './components/hashView';
import CrackView from './components/crackView';
import TestView from './components/testView';
import DatabaseView from './components/dbView';
import AboutView from './components/aboutView';
import ProfileView from './components/profileView';
import './css/App.css';

import Amplify, {Auth} from 'aws-amplify';
import {withAuthenticator,SignIn,ConfirmSignIn,ConfirmSignUp,ForgotPassword,VerifyContact,RequireNewPassword} from 'aws-amplify-react';
import MySignUp from "./aws/mySignUp.js";
import AWSUser from "./aws/awsUser";
import aws_exports from './aws/aws-exports';
Amplify.configure(aws_exports);

export class App extends Component{
    constructor(props){
        super(props);
        //Set current AWSUser data
        Auth.currentSession()
            .then(user=>{
                console.log("user from app.js: ");
                console.log(user);
                AWSUser.setInstance(user);
                this.loadUserData();
            })
            .catch(err=>{
                console.log(err);
            });
    }
    render(){
        return(
            <Router>
                <div className="App">
                    <Nav/>
                    <Route exact={true} path="/" component={AboutView}/>
                    <Route path="/hash" component={HashView}/>
                    <Route path="/crack" component={CrackView}/>
                    <Route path="/test" component={TestView}/>
                    <Route path="/db" component={DatabaseView}/>
                    <Route path="/profile" component={ProfileView}/>
                </div>
            </Router>
        );
    }
}

export default withAuthenticator(App, false,[
    <SignIn/>,
    <MySignUp/>,
    <RequireNewPassword/>,
    <ConfirmSignIn/>,
    <VerifyContact/>,
    <ConfirmSignUp/>,
    <ForgotPassword/>,
]);

