import React, { Component } from 'react';
import NavBar from './nav_bar';
import '../css/App.css';

export default class Nav extends Component{
    render(){
        return(
            <div className="Nav">
                <NavBar/>
            </div>
        );
    }
}

