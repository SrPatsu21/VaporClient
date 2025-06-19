import { HashRouter, Link, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage"
import Download from "./components/Download/Download";
import Search from "./components/Search/Search";
import LoginOverlay from "./components/Login/LoginOverlay";
import Library from "./components/Library/Library";
import { getToken } from "./apiConfig";

function App() {
    const [token, setToken] = useState(null);
    const [tokenTime, setTokenTime] = useState(null);
    const [loginOpen, setLoginOpen] = useState(false);

    const openLoginOverlay = () => setLoginOpen(true);
    const closeLoginOverlay = () => setLoginOpen(false);

    useEffect(() => {
        getToken();
    }, []);

    return (
        <HashRouter>
            <Header
                token={token}
                setToken={setToken}
                setTokenTime={setTokenTime}
                openLoginOverlay={openLoginOverlay}
            />
            <main className="min-h-screen">
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/about" element={<About/>} />
                    <Route path="/download" element={<Download/>} />
                    <Route path="/search" element={<Search/>} />
                    <Route path="/library" element={<Library/>} />
                </Routes>
            </main>
            <Footer />
            {loginOpen && (
                <LoginOverlay
                onClose={closeLoginOverlay}
                setToken={setToken}
                setTokenTime={setTokenTime}
                />
            )}
        </HashRouter>
    );
}

export default App;
