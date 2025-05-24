import React, { useRef, useState, useEffect } from "react";
import { HashRouter, Link, Routes, Route } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";

const HomePage = () => {
    const scrollRef = useRef(null);
    const cardRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);
    const [categories, setCategories] = useState([]);
    const [titles, setTitles] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(API_BASE_URL+ "/v1/category", {
                    headers: {
                        Accept: "application/json",
                    },
                });
                const data = await res.json();
                setCategories(data || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        const fetchTitles = async () => {
            try {
                const res = await fetch(API_BASE_URL+ "/v1/title?limit=12", {
                    headers: {
                        Accept: "application/json",
                    },
                });
                const data = await res.json();
                setTitles(data || []);
            } catch (err) {
                console.error("Error fetching titles:", err);
            }
        };

        fetchCategories();
        fetchTitles()
    }, []);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = 216;
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="m-12 bg-[var(--background_color3)] p-6">
            <h1 className="mb-4 text-2xl font-bold">Categories:</h1>
            <div className="relative group">
                {/* Left Scroll Button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-0 z-10 h-full bg-[var(--background_color3)] shadow p-1 rounded-l-lg text-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300"
                >
                    ←
                </button>

                {/* Scrollable Cards */}
                <div className="px-4">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto no-scrollbar scroll-smooth space-x-4"
                    >
                        {/*{(() => {
                            try {*/}
                                {categories.map((category, index) => (
                                    <Link to="/"
                                        key={index}
                                        className=" bg-[var(--background_color2)] hover:bg-[var(--hover_background_color2)] text-[var(--text_color1)] h-[ 1.125rem] rounded-xl p-2 px-4 flex-shrink-0 snap-start font-bold text-sm">
                                        {category.categorySTR}
                                    </Link>
                                ))}{/*
                            } catch (error) {
                                console.error("Error rendering titles:", error);
                                return <p className="text-red-500">Failed to load cards.</p>;
                            }
                        })()}*/}
                    </div>

                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-0 h-full z-10 shadow p-1 rounded-r-lg text-xl bg-[var(--background_color3)] opacity-0 group-hover:opacity-75 transition-opacity duration-300"
                >
                    →
                </button>
            </div>
            <h1 className="mb-4 mt-8 text-2xl font-bold">Recent add Titles:</h1>
            <div className="flex flex-warp justify-around content-start">
                {/* {(() => {
                    try { */}
                        {titles.map((title, index) => (
                            <Link to="/"
                                key={index}
                            >
                                <div className="min-w-[250px] max-w-[300px] bg-white rounded-xl shadow p-4 flex-shrink-0 snap-start">
                                    <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden mb-4">
                                        <img
                                            src={title.imageURL || "https://via.placeholder.com/300x160?text=No+Image"}
                                            alt={title.titleSTR}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">{title.titleSTR}</h3>
                                    <p className="text-sm text-gray-600 mb-2">Category: {title.category.categorySTR}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {title.tags?.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                                            >
                                                {tag.tagSTR}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    {/* } catch (error) {
                        console.error("Error rendering titles:", error);
                        return <p className="text-red-500">Failed to load cards.</p>;
                    }
                })} */}
            </div>
        </div>
    );
};

export default HomePage;
