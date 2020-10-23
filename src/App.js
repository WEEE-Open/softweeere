import React, {useState, useEffect} from 'react';
import './App.css';
import utils from "./utils";
import Header from "./components/Header";
import MainView from "./components/MainView";

const App = () => {
    const embedTypes = utils.embedTypes;

    // state variables
    const [embeds, setEmbeds] = useState([
        {
            'type': embedTypes.python,
            'title': '🐟 S.A.R.D.I.N.A.',
            'description': 'Statistiche Amabili Rendimento Degli Informatici Nell’Anno',
            'katacoda': 'e-caste/weee-open-sardina',
            'github': 'weee-open/sardina',
        },
        {
            'type': embedTypes.php,
            'title': '✅ WEEEhire-ng',
            'description': 'Manage applications to the team',
            'katacoda': 'e-caste/weee-open-weeehire-ng',
            'github': 'weee-open/weeehire-ng',
        },
        {
            'type': embedTypes.python,
            'title': '🍐 P.E.R.A.C.O.T.T.A.',
            'description': 'Progetto Esteso Raccolta Automatica Configurazioni hardware Organizzate Tramite Tarallo Autonomamente',
            'katacoda': 'e-caste/weee-open-peracotta',
            'github': 'weee-open/peracotta',
        }
    ]);
    const [color, setColor] = useState("00983a");

    return (
        <div className="App">
            <Header />
            <MainView embeds={embeds} color={color} />
        </div>
    );
}

export default App;
