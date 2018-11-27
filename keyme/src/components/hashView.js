import React, { Component } from 'react';
var sechash=require('sechash');

class HashView extends Component{
    constructor(props) {
        super(props);
        this.state={string:'',iterations:1,salt:''};

        this.handleStringChange=this.handleStringChange.bind(this);
        this.handleIterationsChange=this.handleIterationsChange.bind(this);
        this.handleSaltChange=this.handleSaltChange.bind(this);
        this.doHash=this.doHash.bind(this);
    }

    handleStringChange(event) {
        this.setState({string:event.target.value});
    }
    handleIterationsChange(event) {
        this.setState({iterations:event.target.value});
    }
    handleSaltChange(event) {
        this.setState({salt:event.target.value});
    }

    doHash(){
        var opts={
            algorithm:'sha256',
            iterations:this.state.iterations,
            //LastPass: 105000
            salt:this.state.salt
        };
        var t0=performance.now();

        var elapsed;
        //secash breaks while returning
        try{
            sechash.strongHash(this.state.string,opts,function(err,hash){
                var t1=performance.now();
                elapsed=t1-t0;
                hash=hash+":"+elapsed;
                alert("Hash: "+hash+"\nTook: "+elapsed+" milliseconds.")

                //Submit to db
                let url="http://localhost:3001/api/hash";

                fetch(url,{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({"data":hash})
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
                <h1>hashview</h1>
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
                                <button onClick={this.doHash}>
                                    Submit Hash
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default HashView;

/*
//TESTING the hash

// First we generate a hash...
var hash=sechash.strongHashSync('Your String',opts);

// To test if a string matches a hash, we you the testHash method
sechash.testHashSync('Your String',hash,opts);    // true
sechash.testHashSync('Another String',hash,opts); // false

// Again, this function also has an async form...
sechash.testHash('Your String',hash,opts,function(err,isMatch){
    console.log(isMatch); // true
});
*/
