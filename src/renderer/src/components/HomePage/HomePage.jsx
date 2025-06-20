import React, { useRef, useState, useEffect } from "react";
import { HashRouter, Link, Routes, Route } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";

const HomePage = () => {
    const scrollRefs = useRef({});
    const [categories, setCategories] = useState([]);
    const [categoryTitles, setCategoryTitles] = useState({});

    // Fetch categories only once
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/v1/category`, {
                    headers: { Accept: "application/json" },
                });
                const data = await res.json();
                setCategories(data || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
    }, []);

    // When categories change, fetch titles for each one by one
    useEffect(() => {
        const fetchTitlesForCategory = async (categoryId) => {
            try {
                const queryParams = new URLSearchParams({ limit: 12 });
                queryParams.append("category", categoryId);

                const res = await fetch(`${API_BASE_URL}/v1/title?${queryParams.toString()}`, {
                    headers: { Accept: "application/json" },
                });

                const data = await res.json();

                setCategoryTitles(prev => ({
                    ...prev,
                    [categoryId]: data || [],
                }));
            } catch (err) {
                console.error(`Error fetching titles for category ${categoryId}:`, err);
            }
        };

        // Fetch titles one by one
        categories.forEach((category) => {
            if (!categoryTitles[category._id]) {
                fetchTitlesForCategory(category._id);
            }
        });
    }, [categories]);

    const scroll = (direction, categoryId) => {
        const container = scrollRefs.current[categoryId];
        if (!container) return;

        const scrollAmount = 316;
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="m-12 mx-20 bg-[var(--background_color3)] p-6">
            {categories.map((category) => (
                <div key={category._id}>
                    <h1 className="mb-4 text-3xl h-full font-bold">Recent {category.categorySTR}:</h1>
                    <div className="relative group">
                        <div
                            className="flex overflow-x-auto no-scrollbar scroll-smooth space-x-4"
                            ref={(el) => (scrollRefs.current[category._id] = el)}
                        >
                            {/* Left Scroll Button */}
                            <button
                                onClick={() => scroll("left", category._id)}
                                className="absolute left-0 top-0 z-10 h-full bg-[var(--background_color3)] shadow p-1 text-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300"
                            >
                                ←
                            </button>

                            {/* Scrollable Cards */}
                            {(categoryTitles[category._id] || []).map((title, index) => (
                                <Link
                                    to="/search"
                                    onClick={() => {
                                        const savedParams = sessionStorage.getItem("searchState");
                                        const parsed = savedParams ? JSON.parse(savedParams) : {};

                                        const newParams = {
                                            ...parsed,
                                            title: title._id,
                                            titleInput: title.titleSTR,
                                            search: '',
                                            name: '',
                                            tag: [],
                                            tagsInput: '',
                                            page: 0
                                        };

                                        sessionStorage.setItem("searchState", JSON.stringify(newParams));
                                    }}
                                >
                                    <div className="w-[280px] bg-white shadow flex-shrink-0 snap-start">
                                        <div className="w-full h-[420px] bg-gray-200 overflow-hidden relative">
                                            <img
                                                src={title.imageURL || "https://via.placeholder.com/300x160?text=No+Image"}
                                                alt={title.titleSTR}
                                                className="w-full h-full object-cover"
                                            />
                                            <h3 className="absolute bottom-0 w-full text-[var(--text_color1)] bg-[var(--transparent_background_color1)] opacity-100 text-lg font-semibold px-2 py-1">
                                                {title.titleSTR}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {/* Right Scroll Button */}
                            <button
                                onClick={() => scroll("right", category._id)}
                                className="absolute right-0 top-0 h-full z-10 shadow p-1 text-xl bg-[var(--background_color3)] opacity-0 group-hover:opacity-75 transition-opacity duration-300"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomePage;