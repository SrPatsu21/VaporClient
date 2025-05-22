import { HashRouter, Link, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Header from "./components/Header/Header";
import Download from "./components/Download/Download";

function App() {
    return (
        <>
        <HashRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/download" element={<Download/>} />
            </Routes>

            <footer className="h-[200vh]">
                footer
            </footer>
        </HashRouter>
        </>
    );
}

export default App;
