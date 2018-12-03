import React, {Component} from 'react';

export default class DatabaseView extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[<tr key={"loading"}><td>Loading</td></tr>]
        }
    }

    getData(){
        //Get data from db
        let url="http://142.93.121.209:3001/api/getdb";
        fetch(url,{
            method:"GET",
        }).then(res=>{
            return res.json();
        }).then(data=>{
            console.log(data.message.Items);
            let items=[];
            /*"cracks":{"N":"0"},"hash":{"S":"4edf08edc95b2fdcbcaf2378fd12d8ac212c2aa6e326c59c3e629be3039d6432"},"date":{"S":"11/27/2018"},"hash_time":{"N":"22"},"salt":{"S":"postman"},"algorithm":{"S":"sha256"},"iterations":{"N":"1"}*/
            for(let i=0;i<data.message.Items.length;i++){
                try{
                    items.push(
                        <tr key={i}>
                            <td style={{wordWrap:"break-word"}}>{data.message.Items[i].hash.S}</td>
                            <td>{data.message.Items[i].salt.S}</td>
                            <td>{data.message.Items[i].iterations.N}</td>
                            <td>{data.message.Items[i].algorithm.S}</td>
                            <td>{data.message.Items[i].hash_time.N}</td>
                            <td>{data.message.Items[i].date.S}</td>
                            <td>{data.message.Items[i].cracks.N}</td>
                        </tr>
                    );
                }catch (e){
                    items.push(
                        <tr key={i}>
                            <td style={{wordWrap:"break-word"}}>{data.message.Items[i].hash.S}</td>
                            <td></td>
                            <td>{data.message.Items[i].iterations.N}</td>
                            <td>{data.message.Items[i].algorithm.S}</td>
                            <td>{data.message.Items[i].hash_time.N}</td>
                            <td>{data.message.Items[i].date.S}</td>
                            <td>{data.message.Items[i].cracks.N}</td>
                        </tr>
                    );
                }

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
                <table align="center" style={{tableLayout:"fixed",width:"100%"}}>
                    <thead>
                        <tr>
                            <th style={{width:"40%"}}>Hash</th>
                            <th style={{width:"10%"}}>Salt</th>
                            <th style={{width:"5%"}}>Iterations</th>
                            <th style={{width:"5%"}}>Algorithm</th>
                            <th style={{width:"5%"}}>Hash Time</th>
                            <th style={{width:"5%"}}>Date</th>
                            <th style={{width:"5%"}}>Cracks</th>
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

