import { HashRouter, Link, Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

const Search = () => {
const navigate = useNavigate();
const [params, setParams] = useState({
    name: '',
    owner: '',
    title: '',
});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSearch = () => {
        const query = Object.entries(params)
            .filter(([_, v]) => v !== '' && v !== null)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');

        navigate(`/download?${query}`);
    };

    return (
        <div className="flex h-screen">
        {/* Left Panel (30%) */}
            <div className="w-[30%] p-6 bg-gray-100 border-r border-gray-300">
                <h2 className="text-xl font-semibold mb-4">Search Parameters</h2>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={params.name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Owner</label>
                    <input
                        type="text"
                        name="owner"
                        value={params.owner}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter owner"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Title</label>
                    <input
                    type="text"
                    name="title"
                    value={params.title}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter title"
                    />
                </div>

                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Search
                </button>
            </div>

        {/* Right Panel (70%) */}
            <div className="w-[70%] p-6">
                <h1 className="text-2xl font-bold mb-4">Results Area</h1>
                <p>Search results will appear here after redirect to `/download`.</p>
            </div>
        </div>
    );
}

export default Search;