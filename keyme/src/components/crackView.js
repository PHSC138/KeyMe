import React, {Component} from 'react';
var sechash=require('sechash');

export default class CrackView extends Component{
    constructor(props){
        super(props);
        this.state={string:'',algorithm:'sha256',iterations:1,salt:''};

        this.handleStringChange=this.handleStringChange.bind(this);
        this.handleIterationsChange=this.handleIterationsChange.bind(this);
        this.handleSaltChange=this.handleSaltChange.bind(this);
        this.doCrack=this.doCrack.bind(this);
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

    doCrack(){
        var opts={
            algorithm:this.state.algorithm,
            iterations:this.state.iterations,
            //LastPass: 105000
            salt:this.state.salt
        };

        //secash breaks while returning
        try{
            sechash.strongHash(this.state.string,opts,function(err,hash){
                var split=hash.split(":");

                //Check hash in db
                let url="http://localhost:3001/api/crack";

                fetch(url,{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({"data":split[3]})
                }).then(function(res){
                    return res.json();
                }).then(function(data){
                    alert(JSON.stringify(data))
                });
            });
        }catch(e){
            //Do nothing
        }
    }
    render(){
        return(
            <div>
                <h1>Crack</h1>
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
                                <button onClick={this.doCrack}>
                                    Crack Hash
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

