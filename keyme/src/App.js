import React,{Component} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Nav from './components/top_nav';
import View1 from './components/view1'
import View2 from './components/view2'
import './css/App.css';

class App extends Component{
    render(){
        return(
            <Router>
                <div className="App">
                    <Nav/>
                    <Route exact={true} path="/" render={() => (
                        <h1>welcome</h1>
                    )}/>
                    <Route path="/view1" component={View1}/>
                    <Route path="/view2" component={View2}/>
                    <Route path="/examples" render={()=>(
                        <h1>examples</h1>
                    )}/>
                </div>
            </Router>
        );
    }
}

export default App;
