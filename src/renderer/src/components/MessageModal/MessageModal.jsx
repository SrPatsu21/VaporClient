import React, { useEffect, useState } from "react";

export default function MessageModal({ message, title }) {
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setShowModal(true);
        setTimeout(() => setIsVisible(true), 50); // delay to trigger transition

        const timer = setTimeout(() => {
            setIsVisible(false); // start fade-out
            setTimeout(() => setShowModal(false), 500); // wait for fade-out to finish
        }, 4500);

        return () => clearTimeout(timer);
    }, []);

    if (!showModal) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className={`
                    transition-all duration-500
                    ${isVisible ? "opacity-100 blur-none" : "opacity-0 blur-sm"}
                    bg-white rounded-xl shadow-lg p-4 w-80 backdrop-blur-md
                `}
            >
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
}
