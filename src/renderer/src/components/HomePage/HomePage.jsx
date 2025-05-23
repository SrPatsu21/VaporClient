import React, { useRef, useState, useEffect } from "react";
import { API_BASE_URL } from "../../apiConfig";

const HomePage = () => {
    const scrollRef = useRef(null);
    const cardRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(API_BASE_URL+ "/v1/category", {
                    headers: {
                        Accept: "application/json",
                    },
                });
                const data = await res.json();
                setCategories(data.data || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
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
        <div className="bg-[var(--background_color3)] p-6">
            <div className="relative group">
                {/* Left Scroll Button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-0 z-10 h-full bg-[var(--background_color3)] shadow p-1 rounded-l-lg text-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300"
                >
                    ←
                </button>

                {/* Scrollable Cards */}
                <div className="pr-1">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto no-scrollbar scroll-smooth space-x-4"
                    >
                        {categories.map((category, index) => (
                            <div
                                key={category._id || index}
                                className="min-w-[200px] h-40 bg-white rounded-xl shadow p-4 flex-shrink-0 snap-start"
                            >
                                <h3 className="font-bold text-lg mb-2">{category.categorySTR}</h3>
                                <p className="text-sm text-gray-600">ID: {category._id}</p>
                            </div>
                        ))}
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
        </div>
    );
};

export default HomePage;
