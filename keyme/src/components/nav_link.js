import React, { Component } from 'react';
import {Link} from 'react-router-dom'

export default class NavLink extends Component{
    render(){
        return(
            <Link className="NavLink" to={this.props.url}>{this.props.text}</Link>
        );
    }
}

