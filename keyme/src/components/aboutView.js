import React, {Component} from 'react';

export default class AboutView extends Component{
    render(){
        return(
            <div>
                <h1>Welcome</h1>
                <img style={{width:'40%',height:'40%'}} alt="doom_zone" src={require('../data/doom_zone.png')} />
                <p>This web-site is intended to be an interactive demonstration of key stretching</p>
                <p>In this context; key stretching is a technique used to make passwords unreasonable to crack in the event of a breach 
                    by iterating a hash function a large number of times to artificially increase the complexity of the function</p>
                <p>The inspiration for this project came from a CERIAS talk given at Purdue on 1/17/2018, it is embedded below</p>
                <iframe width="560" height="315" title="cerias_talk" src="https://www.youtube-nocookie.com/embed/4SzhRZJLHwI" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        );
    }
}

