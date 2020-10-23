import React, {useState, useEffect} from 'react';
import './App.css';
import embedTypes from "./utils";
import Header from "./components/Header";
import MainView from "./components/MainView";

const App = () => {

    // state variables
    const [embeds, setEmbeds] = useState([]);
    const [color, setColor] = useState("00983a");

    // componentDidMount
    useEffect(() => {
        setEmbeds([
            {
                'type': embedTypes.python,
                'title': '🐟 S.A.R.D.I.N.A.',
                'katacoda': 'e-caste/weee-open-sardina',
                'github': 'weee-open/sardina',
            },
            {
                'type': embedTypes.php,
                'title': '✅ WEEEhire-ng',
                'katacoda': 'e-caste/weee-open-weeehire-ng',
                'github': 'weee-open/weeehire-ng',
            },
            {
                'type': embedTypes.python,
                'title': '🍐 P.E.R.A.C.O.T.T.A.',
                'katacoda': 'e-caste/weee-open-peracotta',
                'github': 'weee-open/peracotta',
            }
        ]);
    }, []);

    return (
        <div className="App">
            <Header />
            <MainView embeds={embeds} color={color} />
        </div>
    );
}

export default App;
