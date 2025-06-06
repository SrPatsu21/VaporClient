import { HashRouter, Link, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../../apiConfig";

const Search = () => {
const [searchParams] = useSearchParams();
const [query, setquery] = useState({});
const navigate = useNavigate();
const [params, setParams] = useState({
    name: '',
    owner: '',
    title: '',
});

const search = searchParams.get('search');


    const fetchsimplequery = async () => {
        try {
            const res = await fetch(API_BASE_URL+ "/v1/othersearch/searchbyqueryall?query="+ search +"&limit=20&skip=0", {
                headers: {
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            setquery(data || []);
        } catch (err) {
            console.error("Error fetching simple query:", err);
        }
    };

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

    fetchsimplequery()
    return (
        <div className="flex min-h-screen">
            <div className="w-[25%] p-6 bg-gray-100 border-r border-gray-300">
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

            <div className="w-[75%] my-12 mr-20 bg-[var(--background_color3)] p-6">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 justify-items-center">
                    {(query.titles || []).map((title, index) => (
                        <Link to="/" key={index}>
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
                    {(query.products || []).map((product, index) => (
                        <Link to="/" key={index}>
                            <div className="w-[280px] bg-white shadow flex-shrink-0 snap-start">
                                <div className="w-full h-[420px] bg-gray-200 overflow-hidden relative">
                                    <img
                                        src={product.imageURL || "https://via.placeholder.com/300x160?text=No+Image"}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <h3 className="absolute bottom-0 w-full text-[var(--text_color1)] bg-[var(--transparent_background_color1)] opacity-100 text-lg font-semibold px-2 py-1">
                                        {product.name}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Search;