import React, {useState, useEffect} from 'react';
import './App.css';
import Header from "./components/Header";
import MainView from "./components/MainView";

const App = () => {

    // state variables
    const [embeds, setEmbeds] = useState([]);

    // componentDidMount
    useEffect(() => {
        setEmbeds([
            {
                'type': 'python',
                'title': '🐟 S.A.R.D.I.N.A.',
                'katacoda': 'e-caste/weee-open-sardina',
                'github': 'weee-open/sardina',
            },
            {
                'type': 'php',
                'title': '✅ WEEEhire-ng',
                'katacoda': 'e-caste/weee-open-weeehire-ng',
                'github': 'weee-open/weeehire-ng',
            },
            {
                'type': 'python',
                'title': '🍐 P.E.R.A.C.O.T.T.A.',
                'katacoda': 'e-caste/weee-open-peracotta',
                'github': 'weee-open/peracotta',
            }
        ]);
    }, []);

    return (
        <div className="App">
            <Header />
            <MainView embeds={embeds} />
        </div>
    );
}

export default App;
