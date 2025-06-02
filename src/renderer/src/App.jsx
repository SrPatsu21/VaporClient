import { HashRouter, Link, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Header from "./components/Header/Header";
import HomePage from "./components/HomePage/HomePage"
import Download from "./components/Download/Download";
import Search from "./components/Search/Search";


function App() {
    return (
        <>
        <HashRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/download" element={<Download/>} />
                <Route path="/search" element={<Search/>} />

            </Routes>

            <footer className="h-[200vh]">
                footer
            </footer>
        </HashRouter>
        </>
    );
}

export default App;
