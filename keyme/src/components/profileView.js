import React, {Component} from 'react';
import AWSUser from '../aws/awsUser';
import {Auth} from 'aws-amplify';
import LeaderboardView from './leaderboardView';

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
        let _this=this;
        if(user!=null){
            let username=user.getUser();
            this.setState({user:username});
            console.log(username);
            let url="http://localhost:3001/api/user?user="+username;
            fetch(url).then(res=>{
                return res.json();
            }).then(data=>{
                console.log(data);
                this.setState({cracks:data.cracks});
            });
        }else{
            //Re do getData() function if AWSUser hasn't been initialized yet
            var wait=ms=>new Promise((r,j)=>setTimeout(r,ms));
            (async()=>{await wait(1);_this.getData()})();
        }
    }

    deleteLocalStorage(){
        //Delete by key
        for(let key in {cracks:"",user:"",string:"",algorithm:"",iterations:"",salt:"",message:"",elapsed:"",hash:""})if(localStorage.hasOwnProperty(key))localStorage.removeItem(key);
    }

    signOut=()=>{
        Auth.signOut()
            .then(data=>console.log(data))
            .catch(err=>console.log(err));
        this.deleteLocalStorage();
        this.props.history.push("/");
        window.location.reload();
    }

    render(){
        return(
            <div>
                <h1>User: {this.state.user}</h1>
                <h3>Cracks: {this.state.cracks}</h3>
                <LeaderboardView/>
                <button onClick={this.signOut}>Sign Out</button>
            </div>
        );
    }
}

