import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";

const Search = () => {
    const [searchParams] = useSearchParams();
    const [query, setquery] = useState({});

    const [params, setParams] = useState({
        name: '',
        title: '',
        tags: '',
        category: '',
        titleInput: '',
        tagsInput: '',
        categoryInput: '',
    });

    const [titleOptions, setTitleOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [titleVisible, setTitleVisible] = useState(false);
    const [tagsVisible, setTagsVisible] = useState(false);
    const [categoryVisible, setCategoryVisible] = useState(false);

    const titleDropdownRef = useRef(null);
    const tagsDropdownRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    const search = searchParams.get('search');

    useEffect(() => {
        fetchsimplequery(search);
    }, []);

    const fetchsimplequery = async (name) => {
        try {
            const res = await fetch(`${API_BASE_URL}/v1/othersearch/searchbyqueryall?query=${name}&limit=20&skip=0`);
            const data = await res.json();
            setquery(data || {});
        } catch (err) {
            console.error("Error fetching simple query:", err);
        }
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        const field = name.replace('Input', '');

        setParams((prev) => ({
            ...prev,
            [name]: value,
            ...(value === '' ? { [field]: '' } : {})
        }));

        if (name === 'titleInput') {
            if (value.length > 0) {
                try {
                    const url = `${API_BASE_URL}/v1/title?titleSTR=${value}&limit=8${params.category ? `&category=${params.category}` : ''}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    setTitleOptions(data || []);
                } catch (err) {
                    console.error("Error fetching title options", err);
                }
            } else {
                setTitleOptions([]);
            }
        }

        if (name === 'tagsInput') {
            if (value.length > 0) {
                try {
                    const res = await fetch(`${API_BASE_URL}/v1/tag?tagSTR=${value}&limit=8`);
                    const data = await res.json();
                    setTagOptions(data || []);
                } catch (err) {
                    console.error("Error fetching tag options", err);
                }
            } else {
                setTagOptions([]);
            }
        }

        if (name === 'categoryInput') {
            if (value.length > 0) {
                try {
                    const res = await fetch(`${API_BASE_URL}/v1/category?categorySTR=${value}`);
                    const data = await res.json();
                    setCategoryOptions(data || []);
                } catch (err) {
                    console.error("Error fetching category options", err);
                }
            } else {
                setCategoryOptions([]);
            }
        }
    };

    const handleBlur = (dropdownRef, setVisible) => {
        setTimeout(() => {
            if (!dropdownRef.current?.matches(':hover')) {
                setVisible(false);
            }
        }, 200);
    };

    const selectOption = (field, option) => {
        let inputValue = '';
        console.log(option)
        if (field === 'title') inputValue = option.titleSTR;
        else if (field === 'tags') inputValue = option.tagSTR;
        else if (field === 'category') inputValue = option.categorySTR;

        setParams((prev) => ({
            ...prev,
            [`${field}Input`]: inputValue,
            [field]: option._id,
        }));
    };


    const handleSearch = async () => {
        const url = `${API_BASE_URL}/v1/product?name=${params.name}${params.title ? `&title=${params.title}` : ''}${params.tags ? `&tags=${params.tags}` : ''}&limit=100&skip=0`;
        console.log(url)

        console.log("🔍 Buscando produtos com:");
        console.log("Name:", params.name);
        console.log("Title UUID:", params.title);
        console.log("Tag UUID:", params.tags);
        console.log("URL final:", url);
        try {
            const res = await fetch(url);
            const data = await res.json();
            setquery({ products: data });
        } catch (err) {
            console.error("Error fetching product search:", err);
        }
    };

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
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter name"
                    />
                </div>

                <div className="mb-4 relative">
                    <label className="block font-medium mb-1">Category</label>
                    <input
                        type="text"
                        name="categoryInput"
                        value={params.categoryInput}
                        onChange={handleInputChange}
                        onFocus={() => setCategoryVisible(true)}
                        onBlur={() => handleBlur(categoryDropdownRef, setCategoryVisible)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter category"
                    />
                    {categoryVisible && categoryOptions.length > 0 && (
                        <ul
                            ref={categoryDropdownRef}
                            onMouseEnter={() => setCategoryVisible(true)}
                            onMouseLeave={() => setCategoryVisible(false)}
                            className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto"
                        >
                            {categoryOptions.map((option) => (
                                <li
                                    key={option.uuid}
                                    onClick={() => selectOption('category', option)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {option.categorySTR}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mb-4 relative">
                    <label className="block font-medium mb-1">Title</label>
                    <input
                        type="text"
                        name="titleInput"
                        value={params.titleInput}
                        onChange={handleInputChange}
                        onFocus={() => setTitleVisible(true)}
                        onBlur={() => handleBlur(titleDropdownRef, setTitleVisible)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter title"
                    />
                    {titleVisible && titleOptions.length > 0 && (
                        <ul
                            ref={titleDropdownRef}
                            onMouseEnter={() => setTitleVisible(true)}
                            onMouseLeave={() => setTitleVisible(false)}
                            className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto"
                        >
                            {titleOptions.map((option) => (
                                <li
                                    key={option.uuid}
                                    onClick={() => selectOption('title', option)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {option.titleSTR}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mb-4 relative">
                    <label className="block font-medium mb-1">Tags</label>
                    <input
                        type="text"
                        name="tagsInput"
                        value={params.tagsInput}
                        onChange={handleInputChange}
                        onFocus={() => setTagsVisible(true)}
                        onBlur={() => handleBlur(tagsDropdownRef, setTagsVisible)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter tags"
                    />
                    {tagsVisible && tagOptions.length > 0 && (
                        <ul
                            ref={tagsDropdownRef}
                            onMouseEnter={() => setTagsVisible(true)}
                            onMouseLeave={() => setTagsVisible(false)}
                            className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto"
                        >
                            {tagOptions.map((option) => (
                                <li
                                    key={option.uuid}
                                    onClick={() => selectOption('tags', option)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {option.tagSTR}
                                </li>
                            ))}
                        </ul>
                    )}
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
};

export default Search;
