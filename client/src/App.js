import React, { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Navigation, Login, Signup, Home, Profile } from "./webpages";
import { useCookies } from "react-cookie";
import Post from "./webpages/articles/Post";

function App() {
    // On récupère le cookie qui a été créé au moment du login
    const [cookies, setCookie, removeCookie] = useCookies("access");

    const [isAuthenticated, setIsAuthenticated] = useState(cookies.access ? true : false);

    const access = cookies.access;

    if (!isAuthenticated) {
        // Ici, si l'utilisateur n'est pas connecté, il n'aura accès qu'à la page login et signup
        return (
            <BrowserRouter>
                <div className="App">
                    <div className="App__bgColor"></div>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }

    return (
        // Si l'utilisateur est connecté, il aura accès a toutes les pages ci-dessou
        <BrowserRouter>
            <div className="App">
                <div className="App__bgColor"></div>
                <header className="App-header">
                    <Navigation access={access} />
                </header>
                <Routes>
                    {/* Affichage des articles */}
                    <Route path="/" element={<Home access={access} />} />
                    <Route path="/articles/" element={<Post access={access} />}>
                        <Route path=":postSlug" element={<Post access={access} />} component={Post} />
                    </Route>

                    {/* Affichage des profiles utilisateurs */}
                    <Route path="/profile/" element={<Profile access={access} />}>
                        <Route path=":userSlug" element={<Profile access={access} />} component={Profile} />
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
