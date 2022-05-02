// import logo from "./logo.svg";
// import "./sass/App.scss";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation, Footer, Login, Home, User_profile } from "./webpages";

function App() {
    return (
        <div className="App">
            <Router>
                <Login />
                {/* <header className="App-header">
                    <Navigation />
                </header>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/User_profile" element={<User_profile />} />
                </Routes>
                <Footer /> */}
            </Router>
        </div>

        // <div className="App">
        //     <header className="App-header">
        //         <img src={logo} className="App-logo" alt="logo" />
        //         <h1>Bonjour !</h1>
        //     </header>
        // </div>
    );
}

export default App;
