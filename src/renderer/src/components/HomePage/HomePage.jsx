import React, { useRef } from "react";

const HomePage = () => {
    const scrollRef = useRef(null);

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
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto no-scrollbar scroll-smooth space-x-4"
                >
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="min-w-[200px] h-40 bg-white rounded-xl shadow p-4 flex-shrink-0 snap-start"
                        >
                            <h3 className="font-bold text-lg mb-2">Card {i + 1}</h3>
                            <p>Some description here</p>
                        </div>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-0 h-full z-10 bg-white shadow p-1 rounded-r-lg text-xl bg-[var(--background_color3)] opacity-0 group-hover:opacity-75 transition-opacity duration-300"
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default HomePage;
