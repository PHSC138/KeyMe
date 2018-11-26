import React, { Component } from 'react';
var sechash=require('sechash');
var opts={
    algorithm:'sha256',
    iterations:1,
    salt:'some_SALT?'
};


class HashView extends Component{
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.doHash = this.doHash.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    doHash(){
        var t0 = performance.now();
        sechash.strongHash(this.state.value,opts,function(err,hash){
            var t1 = performance.now();
            alert("Hash: "+hash+"\nTook: "+(t1 - t0)+" milliseconds.")
            //alert(hash);
        });
    }

    render(){
        return(
            <div>
                <h1>hashview</h1>
                <label>String to hash:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <button onClick={this.doHash}>
                    Submit Hash
                </button>
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
