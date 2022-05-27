import React, { useState } from "react";
import { Routes, Route, BrowserRouter, Router } from "react-router-dom";
import { Navigation, Footer, Login, Signup, Home, Profile } from "./webpages";

import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import Posts from "./webpages/articles/Posts";
import Post from "./webpages/articles/Post";

function App() {
    // On récupère le cookie qui a été créé au moment du login
    const [cookies, setCookie, removeCookie] = useCookies(["access"]);

    const token = cookies.access;
    const decoded = jwt_decode(token);
    const user_id = decoded.userId;
    const user_role = decoded.role;

    const access = {
        token: token,
        user_id: user_id,
        role: user_role,
    };

    const user = sessionStorage.getItem("isAuthenticate");

    // ce state autorise ou non l'accès aux pages privés
    const [isAuthenticated, setIsAuthenticated] = useState(cookies ? true : false); // <==== remplacer user par cookies

    console.log(cookies);

    if (!isAuthenticated) {
        return (
            <BrowserRouter>
                <div className="App">
                    <div className="App__bgColor"></div>
                    {/* <Login /> */}
                    <Routes>
                        <Route path="/" element={<Login />} />
                        {/* <Route path="/" element={<Login />} /> */}
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <div className="App">
                <div className="App__bgColor"></div>
                <header className="App-header">
                    <Navigation access={access} />
                    {/* <button onClick={handleCookie}>Set Cookie</button>
                    {cookies.user && <p>{cookies.user}</p>} */}
                </header>
                <Routes>
                    {/* Affichage des articles */}
                    <Route path="/" element={<Home access={access} />} />
                    <Route path="/articles/" element={<Post access={access} />}>
                        {/* <Route path="" element={<Post />} /> */}
                        <Route path=":postSlug" element={<Post access={access} />} component={Post} />
                    </Route>

                    {/* Affichage des profiles utilisateurs */}
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/profile/" element={<Profile access={access} />}>
                        <Route path=":userSlug" element={<Profile access={access} />} component={Profile} />
                    </Route>
                </Routes>
                {/* <Footer /> */}
            </div>
        </BrowserRouter>
    );
}

export default App;
