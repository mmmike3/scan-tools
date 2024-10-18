import React from 'react';
import './App.css';
import BoardCodeList from './components/BoardCodeList';
import CPUCodeList from './components/CPUCodeList';

function App() {
    return (
        <div id="App" style={{"display": "grid", "gridTemplateColumns": "1fr 1fr"}}>
             <BoardCodeList/>
             <CPUCodeList/>
        </div>
    );
}

export default App;
