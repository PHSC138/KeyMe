import React,{Component} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import Nav from './components/top_nav';
import HashView from './components/hashView';
import CrackView from './components/crackView';
import DatabaseView from './components/dbView';
import AboutView from './components/aboutView';
import './css/App.css';

class App extends Component{
    render(){
        return(
            <Router>
                <div className="App">
                    <Nav/>
                    <Route exact={true} path="/" render={()=>(
                        <div>
                            <h1>welcome</h1>
                            <h4>Don't join the others in the doom zone</h4>
                            <img style={{width:'40%',height:'40%'}} src={require('./data/doom_zone.png')} />
                        </div>
                    )}/>
                    <Route path="/hash" component={HashView}/>
                    <Route path="/crack" component={CrackView}/>
                    <Route path="/db" component={DatabaseView}/>
                    <Route path="/about" component={AboutView}/>
                </div>
            </Router>
        );
    }
}

export default App;
