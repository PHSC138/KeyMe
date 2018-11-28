import React, { Component } from 'react';
import NavLink from "./nav_link";

//Links data
import elements from "../data/navElements";

export default class NavBar extends Component{
    render(){
        let links=[];
        for(let i=0;i<elements.elements.length;i++){
            links.push(<div className='NavElement' key={elements.elements[i].text}><NavLink url={elements.elements[i].url} text={elements.elements[i].text}/></div>);
        }
        return (
            <div className="NavBar">
                {links}
            </div>
        );
    }
}

