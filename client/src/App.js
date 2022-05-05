// import logo from "./logo.svg";
// import "./sass/App.scss";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Navigation, Footer, Login, Home, User_profile } from "./webpages";

function App() {
    let isLoggedIn = localStorage.getItem("user_id");
    // console.log(isLoggedIn);

    if (!isLoggedIn) {
        return (
            <div className="App">
                <div className="App__bgColor"></div>
                <Router>
                    <Login />
                </Router>
            </div>
        );
    }
    return (
        <div className="App">
            <div className="App__bgColor"></div>
            <Router>
                {/* <Login /> */}
                <header className="App-header">
                    <Navigation isLoggedIn={isLoggedIn} />
                </header>
                <Routes>
                    <Route path="/Home" element={<Home isLoggedIn={isLoggedIn} />} />
                    <Route path="/User_profile" element={<User_profile isLoggedIn={isLoggedIn} />} />
                </Routes>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
