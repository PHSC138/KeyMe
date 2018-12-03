import React, {Component} from 'react';

export default class WelcomeView extends Component{
    constructor(props) {
        super(props);
        this.state={start:0,end:2880};
    }
    updateVid(start){
        if(this.state.start!==start)this.setState({start:start});
    }
    render(){
        return(
            <div>
                <h1>Welcome</h1>
                <p>This web app is an interactive demonstration of key stretching with a competitive twist.</p>
                <p>Key stretching is a technique used to make passwords harder to crack in the event of a breach.</p>
                <p>The inspiration for this project came from a security talk given at Purdue 1/17/2018, it is embedded below.</p>
                <ul>
                    <li>
                        Password storage: <button style={{border:"none",background:"none",cursor:"pointer",color:"blue"}} onClick={()=>(this.updateVid("93"))}>1:30-3:00</button>
                    </li>
                    <li>
                        Key stretching via hash iteration: <button style={{border:"none",background:"none",cursor:"pointer",color:"blue"}} onClick={()=>(this.updateVid("397"))}>6:37-7:07</button>
                    </li>
                </ul>
                <iframe title="economics of password cracking" width="560" height="315" src={"https://www.youtube-nocookie.com/embed/4SzhRZJLHwI?start="+this.state.start} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        );
    }
}

