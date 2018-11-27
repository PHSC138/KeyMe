import React, {Component} from 'react';

class AboutView extends Component{
    render(){
        return(
            <div>
                <h1>About</h1>
                <p>This web-site is an interactive demonstration of key stretching</p>
                <p>In this context; key stretching is a technique used to make passwords unreasonable to crack in the event of a breach 
                    by iterating a hash function a large number of times to artificially increase the complexity of the function</p>
                <p>The theory is that if it takes 2 seconds to compute 1 hash, it will increase the time to crack a password by a substantial amount TODO: enough to make it uneconomical</p>
                <p>The inspiration for this project came from a CERIAS talk given at Purdue on 1/17/2018, it is embedded below</p>
                <iframe width="560" height="315" title="cerias_talk" src="https://www.youtube-nocookie.com/embed/4SzhRZJLHwI" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        );
    }
}

export default AboutView;
