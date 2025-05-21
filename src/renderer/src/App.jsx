import { HashRouter, Link, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Header from "./components/Header/Header";

function App() {
    return (
        <>
        <HashRouter>
            <Header />
            {/* <header>
                <Header />
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                    </ul>
                </nav>
            </header> */}

            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/about" element={<About/>} />
            </Routes>

            <footer className="h-[200vh]">
                footer
            </footer>
        </HashRouter>
        </>
    );
}

export default App;
