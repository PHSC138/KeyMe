import React, {Component} from 'react';

export default class DatabaseView extends Component{
    constructor(props){
        super(props);
        this.state={
            data:['Loading']
        }
    }

    getData(){
        //Get data from db
        let url="http://localhost:3001/api/getdb";
        fetch(url,{
            method:"GET",
        }).then(res=>{
            return res.json();
        }).then(data=>{
            console.log(data.message.Items);
            //TODO: render db
            let items=[];
            /*"cracks":{"N":"0"},"hash":{"S":"4edf08edc95b2fdcbcaf2378fd12d8ac212c2aa6e326c59c3e629be3039d6432"},"date":{"S":"11/27/2018"},"hash_time":{"N":"22"},"salt":{"S":"postman"},"algorithm":{"S":"sha256"},"iterations":{"N":"1"}*/
            for(let i=0;i<data.message.Items.length;i++){
                items.push(
                    <tr>
                        <td>{data.message.Items[i].hash.S}</td>
                        <td>{data.message.Items[i].salt.S}</td>
                        <td>{data.message.Items[i].iterations.N}</td>
                        <td>{data.message.Items[i].algorithm.S}</td>
                        <td>{data.message.Items[i].hash_time.N}</td>
                        <td>{data.message.Items[i].date.S}</td>
                        <td>{data.message.Items[i].cracks.N}</td>
                    </tr>
                );
            }
            this.setState({
                data:items
            });
            //console.log(this.state.data);
        });
    }

    componentDidMount(){
        this.getData();
    }

    render(){
        return(
            <div>
                <h1>Database</h1>
                <table align="center">
                    <thead>
                        <tr>
                            <th>Hash</th>
                            <th>Salt</th>
                            <th>Iterations</th>
                            <th>Algorithm</th>
                            <th>Hash Time</th>
                            <th>Date</th>
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

