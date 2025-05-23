import React, { useRef } from "react";

const HomePage = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = window.innerWidth + 500;
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="bg-[var(--background_color3)] p-6">
            <div className="relative">
                {/* Left Scroll Button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full text-xl"
                >
                    ←
                </button>

                {/* Scrollable Cards */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto no-scrollbar scroll-smooth space-x-4 px-12 snap-x snap-mandatory"
                >
                    {[...Array(10)].map((_, i) => (
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
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full text-xl"
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default HomePage;
