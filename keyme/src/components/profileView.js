import React, {Component} from 'react';
import AWSUser from '../aws/awsUser'
import {Auth} from 'aws-amplify'

export default class ProfileView extends Component{
    constructor(props){
        super(props);
        this.state={cracks:"",user:""};
    }

    componentDidMount(){
        this.getData();
    }

    getData(){
        let user=AWSUser.getInstance();
        if(user!=null){
            let username=user.getUser();
            this.setState({user:username});
            console.log(username);
            let url="http://localhost:3001/api/user";
            console.log(url);
            fetch(url,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"data":username})
            }).then(res=>{
                return res.json();
            }).then(data=>{
                console.log(data);
                this.setState({cracks:data.cracks});
            });
        }
    }

    signOut=()=>{
        Auth.signOut()
            .then(data=>console.log(data))
            .catch(err=>console.log(err));
        this.props.history.push("/");
        window.location.reload();
    }

    render(){
        return(
            <div>
                <h1>User: {this.state.user}</h1>
                <h3>Cracks: {this.state.cracks}</h3>
                <button onClick={this.signOut}>Sign Out</button>
            </div>
        );
    }
}

