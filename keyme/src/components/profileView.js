import React, {Component} from 'react';
import {Auth} from 'aws-amplify'

export default class ProfileView extends Component{
    signOut = () => {
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
        this.props.history.push("/");
        window.location.reload();
    }

    render(){
        return(
            <div>
                <h1>Profile</h1>
                <h3>Cracks: </h3>
                <button onClick={this.signOut}>Sign Out</button>
            </div>
        );
    }
}

