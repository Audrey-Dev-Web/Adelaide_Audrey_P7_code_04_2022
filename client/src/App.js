import React, { useState } from "react";
import { Routes, Route, BrowserRouter, Router } from "react-router-dom";
import { Navigation, Footer, Login, Signup, Home, UserProfile } from "./webpages";

import Posts from "./webpages/articles/Posts";
import Post from "./webpages/articles/Post";

function App() {
    const user = sessionStorage.getItem("isAuthenticate");
    const [isAuthenticated, setIsAuthenticated] = useState(user ? true : false);

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
                </header>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/articles/" element={<Post />}>
                        {/* <Route path="" element={<Post />} /> */}
                        <Route path=":postSlug" element={<Post />} component={Post} />
                    </Route>
                    <Route path="/profile" element={<UserProfile />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
