import React,{Component} from 'react';
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom';
import Nav from './components/top_nav';
import HashView from './components/hashView';
import CrackView from './components/crackView';
import TestView from './components/testView';
import DatabaseView from './components/dbView';
import WelcomeView from './components/welcomeView';
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
                    <Route exact={true} path="/" render={()=>(<Redirect to="/keyme"/>)}/>
                    <Route exact={true} path="/keyme" component={WelcomeView}/>
                    <Route path="/keyme/hash" component={HashView}/>
                    <Route path="/keyme/crack" component={CrackView}/>
                    <Route path="/keyme/test" component={TestView}/>
                    <Route path="/keyme/db" component={DatabaseView}/>
                    <Route path="/keyme/profile" component={ProfileView}/>
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

