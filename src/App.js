import React, {useState} from 'react';
import './App.css';
import {embedTypes} from "./utils";
import Header from "./components/Header";
import MainView from "./components/MainView";
import Footer from "./components/Footer";

const App = () => {

    // state variables
    const [embeds, setEmbeds] = useState([
        {
            'type': embedTypes.python,
            'title': '🐟 S.A.R.D.I.N.A.',
            'description': 'Statistiche Amabili Rendimento Degli Informatici Nell’Anno',
            'katacoda': 'e-caste/weee-open-sardina',
            'github': 'weee-open/sardina',
            'isActive': false,
        },
        {
            'type': embedTypes.php,
            'title': '✅ WEEEhire-ng',
            'description': 'Manage applications to the team',
            'katacoda': 'e-caste/weee-open-weeehire-ng',
            'github': 'weee-open/weeehire-ng',
            'isActive': false,
        },
        {
            'type': embedTypes.python,
            'title': '🍐 P.E.R.A.C.O.T.T.A.',
            'description': 'Progetto Esteso Raccolta Automatica Configurazioni hardware Organizzate Tramite Tarallo Autonomamente',
            'katacoda': 'e-caste/weee-open-peracotta',
            'github': 'weee-open/peracotta',
            'isActive': false,
        }
    ]);
    const [color, setColor] = useState("00983a");

    const buttonHandler = embed => setEmbeds(prevState => {
        return prevState.map(e => {
            if (e.github === embed.github) {
                let newE = {...e};  // CRUCIAL STEP
                newE.isActive = !newE.isActive;
                return newE;
            } else return e;
        });
    });

    return (
        <div className="App">
            <Header />
            <MainView
                embeds={embeds}
                buttonHandler={buttonHandler}
                color={color}
            />
            <Footer />
        </div>
    );
}

export default App;
