import React, {Component} from 'react';

class AboutView extends Component{
    render(){
        return(
            <div>
                <h1>About</h1>
                <p>This web-site is an interactive demonstration of key stretching</p>
                <p>Key stretching is a technique used to make passwords harder to crack in the event of a breach</p>
                <p>The inspiration for this project came from a security talk given at Purdue 1/17/2018, it is embedded below</p>
                <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/4SzhRZJLHwI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        );
    }
}

export default AboutView;
