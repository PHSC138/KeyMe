import React,{Component} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Nav from './components/top_nav';
import AboutView from './components/aboutView'
import HashView from './components/hashView'
import './css/App.css';

class App extends Component{
    render(){
        return(
            <Router>
                <div className="App">
                    <Nav/>
                    <Route exact={true} path="/" render={()=>(
                        <h1>welcome</h1>
                    )}/>
                    <Route path="/about" component={AboutView}/>
                    <Route path="/hash" component={HashView}/>
                    <Route path="/examples" render={()=>(
                        <h1>examples</h1>
                    )}/>
                </div>
            </Router>
        );
    }
}

export default App;
