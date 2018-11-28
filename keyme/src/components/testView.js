import React, { Component } from 'react';
var sechash=require('sechash');

export default class TestView extends Component{
    constructor(props) {
        super(props);
        this.state={string:"",algorithm:"sha256",iterations:1,salt:"",hash:"",elapsed:""};

        this.handleStringChange=this.handleStringChange.bind(this);
        this.handleIterationsChange=this.handleIterationsChange.bind(this);
        this.handleSaltChange=this.handleSaltChange.bind(this);
        this.testHash=this.testHash.bind(this);
    }

    handleStringChange(event){
        this.setState({string:event.target.value});
    }
    handleIterationsChange(event){
        this.setState({iterations:event.target.value});
    }
    handleSaltChange(event){
        this.setState({salt:event.target.value});
    }

    //Save state from https://hackernoon.com/how-to-take-advantage-of-local-storage-in-your-react-projects-a895f2b2d3f2
    componentDidMount(){
        this.hydrateStateWithLocalStorage();

        //Add event listener to save state to localStorage
        //When user leaves/refreshes the page
        window.addEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );
    }

    componentWillUnmount(){
        window.removeEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );
        //Saves if component has a chance to unmount
        this.saveStateToLocalStorage();
    }

    hydrateStateWithLocalStorage(){
        //For all items in state
        for(let key in this.state){
            //If the key exists in localStorage
            if(localStorage.hasOwnProperty(key)){
                //Get the key's value from localStorage
                let value=localStorage.getItem(key);

                //Parse the localStorage string and setState
                try{
                    value=JSON.parse(value);
                    this.setState({[key]:value});
                }catch (e){
                    //Handle empty string
                    this.setState({[key]:value});
                }
            }
        }
    }

    saveStateToLocalStorage(){
        //For every item in React state
        for(let key in this.state){
            //Save to localStorage
            localStorage.setItem(key,JSON.stringify(this.state[key]));
        }
    }

    testHash(){
        var opts={
            algorithm:this.state.algorithm,
            iterations:this.state.iterations,
            salt:this.state.salt
        };
        var t0=performance.now();

        let gElapsed,gHash;
        //secash breaks while returning
        try{
            sechash.strongHash(this.state.string,opts,function(err,hash){
                var t1=performance.now();
                gElapsed=t1-t0;
                gHash=hash;
            });
        }catch(e){
            //Do nothing
        }
        //Update states
        this.setState({hash:gHash});
        this.setState({elapsed:gElapsed});
    }

    render(){
        return(
            <div>
                <div>
                    <h1>Test</h1>
                    <table align="center">
                        <tbody>
                            <tr>
                                <td>
                                    <label>String to hash:</label>
                                </td>
                                <td>
                                    <input type="text" value={this.state.string} onChange={this.handleStringChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Iterations:</label>
                                </td>
                                <td>
                                    <input type="number" value={this.state.iterations} onChange={this.handleIterationsChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Salt:</label>
                                </td>
                                <td>
                                    <input type="text" value={this.state.salt} onChange={this.handleSaltChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button onClick={this.testHash}>
                                        Test Hash
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    {this.state.hash!==""&&
                        <div>
                        <h4>Hash: {this.state.hash.split(":")[3]}</h4>
                        <h4>Elapsed: {this.state.elapsed}ms</h4>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

