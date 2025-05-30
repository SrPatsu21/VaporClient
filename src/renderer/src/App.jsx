import { HashRouter, Link, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage"
import Download from "./components/Download/Download";

function App() {
    return (
        <HashRouter>
            <Header />
            <main className="min-h-screen">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/download" element={<Download />} />
                </Routes>
            </main>
            <Footer />
        </HashRouter>
    );
}

export default App;
