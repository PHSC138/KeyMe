import React, { Component } from 'react';
import AWSUser from '../aws/awsUser'
var sechash=require('sechash');

export default class HashView extends Component{
    constructor(props) {
        super(props);
        this.state={
            string:"",
            algorithm:"sha256",
            iterations:1,
            salt:"",
            message:"",
            hash:"",
            elapsed:"",
        };

        this.handleStringChange=this.handleStringChange.bind(this);
        this.handleIterationsChange=this.handleIterationsChange.bind(this);
        this.handleAlgorithmChange=this.handleAlgorithmChange.bind(this);
        this.handleSaltChange=this.handleSaltChange.bind(this);
        this.doHash=this.doHash.bind(this);
    }

    handleStringChange(event){
        this.setState({string:event.target.value});
    }
    handleIterationsChange(event){
        this.setState({iterations:event.target.value});
    }
    handleAlgorithmChange(event){
        this.setState({algorithm:event.target.value});
    }
    handleSaltChange(event){
        this.setState({salt:event.target.value});
    }

    //Save state from https://hackernoon.com/how-to-take-advantage-of-local-storage-in-your-react-projects-a895f2b2d3f2
    componentDidMount(){
        this.hydrateStateWithLocalStorage();

        //Add event listener to save state to localStorage when user leaves/refreshes the page
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
            if(key==="message"||key==="hash"||key==="elapsed")continue;
            //Save to localStorage
            localStorage.setItem(key,JSON.stringify(this.state[key]));
        }
    }

    doHash(){
        var opts={
            algorithm:this.state.algorithm,
            iterations:this.state.iterations,
            salt:this.state.salt
        };
        var t0=performance.now();

        var hash=sechash.strongHashSync(this.state.string, opts);
        var t1=performance.now();
        var elapsed=t1-t0;

        //Update states
        this.setState({hash:hash});
        this.setState({elapsed:elapsed});

        //Submit to db
        let url="https://www.phsc138.com/api/hash";
        var _this=this;
        fetch(url,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"data":hash+":"+elapsed+":"+AWSUser.getInstance().getUser()})
        }).then(function(res){
            return res.json();
        }).then(function(data){
            _this.setState({message:data.message});
        });
    }

    render(){
        return(
            <div>
                <h1>Hash</h1>
                <table align="center">
                    <tbody>
                        <tr>
                            <td>
                                <label>String to hash:&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            </td>
                            <td>
                                <input type="text" value={this.state.string} onChange={this.handleStringChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Iterations:&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            </td>
                            <td>
                                <input type="number" value={this.state.iterations} onChange={this.handleIterationsChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Algorithm:&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            </td>
                            <td>
                                <select value={this.state.algorithm} onChange={this.handleAlgorithmChange}>
                                    <option value="sha1">sha1</option>
                                    <option value="sha256">sha256</option>
                                    <option value="sha512">sha512</option>
                                    <option value="md5">md5</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Salt:&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            </td>
                            <td>
                                <input type="text" value={this.state.salt} onChange={this.handleSaltChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button onClick={this.doHash}>
                                    Submit Hash
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    {this.state.hash!==""&&
                        <div>
                        <h4>Hash: {this.state.hash.split(":")[3]}</h4>
                        <h4>Elapsed: {this.state.elapsed}ms</h4>
                        </div>
                    }
                </div>
                <div>
                    {this.state.message==="success"&& <h4 style={{color:"green"}}>Response: {this.state.message}</h4>}
                    {(this.state.message!=="success"&&this.state.message!=="")&& <h4 style={{color:"red"}}>Response: {this.state.message}</h4>}
                </div>
            </div>
        );
    }
}

