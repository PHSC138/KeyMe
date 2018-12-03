import React, {Component} from 'react';

export default class LeaderboardView extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[<tr key={"loading"}><td>Loading</td></tr>]
        }
    }

    //comment
    getData(){
        //Get data from db
        let url="https://www.phsc138.com/api/getusers";
        fetch(url,{
            method:"GET",
        }).then(res=>{
            return res.json();
        }).then(data=>{
            console.log(data.message.Items);
            let tmpUsers=[];
            for(let i=0;i<data.message.Items.length;i++){
                tmpUsers.push({
                    "user":data.message.Items[i].username.S,
                    "cracks":data.message.Items[i].cracks.N
                });
            }
            //Sort users by # cracks
            console.log("sorting");
            tmpUsers.sort((a,b)=>parseInt(b.cracks)-parseInt(a.cracks));
            console.log(tmpUsers);
            let items=[];
            /*
             0: Object { user: "Test", cracks: "8" }
             1: Object { user: "Test2", cracks: "1" }
             length: 2
            */
            for(let i=0;i<tmpUsers.length;i++){
                items.push(
                    <tr key={i}>
                        <td>{i+1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>{tmpUsers[i].user}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>{tmpUsers[i].cracks}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                );
            }
            this.setState({data:items});
        });
    }

    componentDidMount(){
        this.getData();
    }

    render(){
        return(
            <div>
                <h2>Leaderboard</h2>
                <table align="center">
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>User</th>
                            <th>Cracks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data}
                    </tbody>
                </table>
            </div>
        );
    }
}

