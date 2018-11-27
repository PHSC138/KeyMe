import React, {Component} from 'react';

class DatabaseView extends Component{
    constructor(props){
        super(props);
        this.state={
            data:'Loading'
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
            for(let i=0;i<data.message.Items.length;i++){
                items.push(<div className='HashData'><h6>{data.message.Items[i].hash}</h6></div>);
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
                {this.state.data}
            </div>
        );
    }
}

export default DatabaseView;
