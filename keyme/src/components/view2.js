import React, { Component } from 'react';

class View2 extends Component{
    constructor(props) {
        super(props);
        this.state={
            json: '{"name":"John", "age":31, "city":"New York"}',
            response: '0',
        };
    }


    componentDidMount() {
    }

    render(){
        this.componentDidMount();
        return(
            <div>
                <p>{this.state.json}</p>
                <p>{this.state.response}</p>
            </div>
        );
    }
}

export default View2;
