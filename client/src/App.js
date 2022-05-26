import React, { useState } from "react";
import { Routes, Route, BrowserRouter, Router } from "react-router-dom";
import { Navigation, Footer, Login, Signup, Home, Profile } from "./webpages";

import { useCookies } from "react-cookie";

import Posts from "./webpages/articles/Posts";
import Post from "./webpages/articles/Post";

function App() {
    // Tuto cookies-react
    const [cookies, setCookie] = useCookies(["user"]);

    const user = sessionStorage.getItem("isAuthenticate");
    const [isAuthenticated, setIsAuthenticated] = useState(user ? true : false);

    // function handleCookie() {
    //     setCookie("user", "gowtham", {
    //         path: "/",
    //     });
    // }

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
                    <Navigation />
                    {/* <button onClick={handleCookie}>Set Cookie</button>
                    {cookies.user && <p>{cookies.user}</p>} */}
                </header>
                <Routes>
                    {/* Affichage des articles */}
                    <Route path="/" element={<Home />} />
                    <Route path="/articles/" element={<Post />}>
                        {/* <Route path="" element={<Post />} /> */}
                        <Route path=":postSlug" element={<Post />} component={Post} />
                    </Route>

                    {/* Affichage des profiles utilisateurs */}
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/profile/" element={<Profile />}>
                        <Route path=":userSlug" element={<Profile />} component={Profile} />
                    </Route>
                </Routes>
                {/* <Footer /> */}
            </div>
        </BrowserRouter>
    );
}

export default App;
