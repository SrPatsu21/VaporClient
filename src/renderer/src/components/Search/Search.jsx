import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";

const Search = () => {
    const [query, setquery] = useState({});
    const didInitialSearch = useRef(false);

    const [params, setParams] = useState(() => {
        const saved = sessionStorage.getItem("searchState");
        if (saved) return JSON.parse(saved);
        return {
            search: '',
            name: '',
            title: '',
            tags: [],
            category: '',
            titleInput: '',
            tagsInput: '',
            categoryInput: '',
            page: 0,
        };
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

    useEffect(() => {
        if (didInitialSearch.current) return;

        const runInitialSearch = async () => {
            try {
                const lastParams = sessionStorage.getItem("lastSearchParams");
                const lastResults = sessionStorage.getItem("lastSearchResults");

                if (lastParams && lastResults) {
                    const parsedParams = JSON.parse(lastParams);
                    const parsedResults = JSON.parse(lastResults);

                    if (JSON.stringify(parsedParams) === JSON.stringify(params)) {
                        // console.log("Carregando resultado do cache");
                        setquery(parsedResults);
                        didInitialSearch.current = true;
                        return;
                    }
                }

                if (params.search?.trim()) {
                    await fetchsimplequery(params.search);
                    setParams(prev => ({ ...prev, search: '' }));
                } else {
                    await handleSearch();
                }

            } catch (err) {
                console.error("Error:", err);
            }

            didInitialSearch.current = true;
        };

        runInitialSearch();
    }, [params]);

useEffect(() => {
    sessionStorage.setItem("searchState", JSON.stringify(params));
}, [params]);

//* Searchs

    const fetchsimplequery = async (name) => {
        try {
            const res = await fetch(`${API_BASE_URL}/v1/othersearch/searchbyqueryall?query=${name}&limit=20&skip=0`);
            // console.log("url 3:" + `${API_BASE_URL}/v1/othersearch/searchbyqueryall?query=${name}&limit=20&skip=0`)

            const data = await res.json();
            setquery(data || {});
            didInitialSearch.current = true;
            sessionStorage.setItem("searchState", JSON.stringify(params));
            sessionStorage.setItem("lastSearchParams", JSON.stringify(params));
            sessionStorage.setItem("lastSearchResults", JSON.stringify(data));;
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
        if (field === 'tags') {
            setParams((prev) => {
                const prevTags = Array.isArray(prev.tags) ? prev.tags : [];

                if (prevTags.some((t) => t._id === option._id)) return prev;

                return {
                    ...prev,
                    tags: [...prevTags, { _id: option._id, tagSTR: option.tagSTR }],
                    tagsInput: '',
                };
            });
        } else {
            let inputValue = '';
            if (field === 'title') inputValue = option.titleSTR;
            else if (field === 'category') inputValue = option.categorySTR;

            setParams((prev) => ({
                ...prev,
                [`${field}Input`]: inputValue,
                [field]: option._id,
            }));
        }
    };


    const removeTag = (id) => {
        setParams((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag._id !== id),
        }));
    };


    const handleSearch = async () => {
        const tags = Array.isArray(params.tags) ? params.tags : [];
        const tagsParam = tags.length > 0 ? `&tags=${tags.map(t => t._id).join(",")}` : "";
        const url = `${API_BASE_URL}/v1/othersearch/searchbytitleandcategory?name=${params.name}${params.title ? `&title=${params.title}` : ''}${params.category ? `&category=${params.category}` : ''}${tagsParam}&limit=20&skip=${params.page*20}`;
        // console.log("url 1:" + url)

        try {
            const res = await fetch(url);
            const data = await res.json();
            setquery(data);
            didInitialSearch.current = true;
            sessionStorage.setItem("searchState", JSON.stringify({...params}));
            sessionStorage.setItem("lastSearchParams", JSON.stringify(params));
            sessionStorage.setItem("lastSearchResults", JSON.stringify(data));;
        } catch (err) {
            console.error("Error fetching product search:", err);
        }
    };

    const handleSearchParams = async (customParams = params) => {
        const tags = Array.isArray(customParams.tags) ? customParams.tags : [];
        const tagsParam = tags.length > 0 ? `&tags=${tags.map(t => t._id).join(",")}` : "";
        const url = `${API_BASE_URL}/v1/othersearch/searchbytitleandcategory?name=${customParams.name}${customParams.title ? `&title=${customParams.title}` : ''}${customParams.category ? `&category=${customParams.category}` : ''}${tagsParam}&limit=20&skip=${customParams.page*20}`;
        // console.log("url 2:" + url)

        try {
            const res = await fetch(url);
            const data = await res.json();
            setquery(data);
            didInitialSearch.current = true;
            sessionStorage.setItem("searchState", JSON.stringify(customParams));
            sessionStorage.setItem("lastSearchParams", JSON.stringify(customParams));
            sessionStorage.setItem("lastSearchResults", JSON.stringify(data));;
        } catch (err) {
            console.error("Error fetching product search:", err);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-[25%] p-6 bg-gray-100 border-r border-gray-300">
                <h2 className="text-xl font-semibold mt-12 mb-4">Search Parameters</h2>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Name:</label>
                    <input type="text" name="name" value={params.name} onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded" placeholder="Enter name"
                    />
                </div>

                <div className="mb-4 relative">
                    <label className="block font-medium mb-1">Category:</label>
                    <input type="text" name="categoryInput" value={params.categoryInput} onChange={handleInputChange}
                        onFocus={() => setCategoryVisible(true)} onBlur={() => handleBlur(categoryDropdownRef, setCategoryVisible)}
                        className="w-full border px-3 py-2 rounded" placeholder="Enter category"
                    />
                    {categoryVisible && categoryOptions.length > 0 && (
                        <ul
                            ref={categoryDropdownRef}
                            onMouseEnter={() => setCategoryVisible(true)}
                            onMouseLeave={() => setCategoryVisible(false)}
                            className="absolute bg-[var(--background_color4)] rounded-md border w-full z-10 max-h-40 overflow-y-auto custom-scrollbar_warning_color"
                        >
                            {categoryOptions.map((option) => (
                                <li key={option.uuid} onClick={() => selectOption('category', option)}
                                    className="p-2 text-[var(--text_color2)] hover:text-[var(--hover_text_color2)] hover:bg-[var(--hover_background_color4)] cursor-pointer"
                                >
                                    {option.categorySTR}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mb-4 relative">
                    <label className="block font-medium mb-1">Title:</label>
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
                            className="absolute bg-[var(--background_color4)] rounded-md border w-full z-10 max-h-40 overflow-y-auto custom-scrollbar_warning_color"
                        >
                            {titleOptions.map((option) => (
                                <li
                                    key={option.uuid}
                                    onClick={() => selectOption('title', option)}
                                    className="p-2 text-[var(--text_color2)] hover:text-[var(--hover_text_color2)] hover:bg-[var(--hover_background_color4)] cursor-pointer"
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
                            className="absolute bg-[var(--background_color4)] rounded-md border w-full z-10 max-h-40 overflow-y-auto custom-scrollbar_warning_color"
                        >
                            {tagOptions.map((option) => (
                                <li
                                    key={option.uuid}
                                    onClick={() => selectOption('tags', option)}
                                    className="p-2 text-[var(--text_color2)] hover:text-[var(--hover_text_color2)] hover:bg-[var(--hover_background_color4)] cursor-pointer"
                                >
                                    {option.tagSTR}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(params.tags) && params.tags.map((tag) => (
                        <span
                            key={tag._id}
                            className="bg-[var(--background_color2)] text-[var(--warning_color)] px-2 py-1 rounded-full flex items-center"
                        >
                            {tag.tagSTR}
                            <button onClick={() => removeTag(tag._id)} className="ml-2 text-[var(--danger_color)] hover:text-[var(--hover_danger_color)]">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <button
                    onClick={handleSearch}
                    className="w-full text-center px-4 py-2 rounded text-[var(--text_color1)] hover:text-[var(--hover_text_color1)] bg-[var(--warning_color)] hover:bg-[var(--hover_warning_color)]"
                >
                    Search
                </button>
            </div>

            <div className="w-[75%] my-12 mr-20 bg-[var(--background_color3)] p-6">
                {Array.isArray(query.titles) && query.titles.length > 0 && (
                    <h1 className="mb-4 text-3xl font-bold">Titles found:</h1>
                )}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 justify-items-center">
                    {Array.isArray(query.titles) && query.titles.length > 0 && (
                        (query.titles || []).map((title, index) => (
                            <div onClick={async () =>
                                    {
                                        const newParams = {
                                            ...params,
                                            name: '',
                                            title: title._id,
                                            titleInput: title.titleSTR,
                                        };

                                        setParams(newParams);
                                        handleSearchParams(newParams);
                                    }
                                }
                                className="w-[280px] bg-white shadow flex-shrink-0 snap-start"
                            >
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
                        ))
                    )}
                </div>
                {Array.isArray(query.products) && query.products.length > 0 && (
                    <h1 className="mb-4 text-3xl font-bold">Products found:</h1>
                )}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 justify-items-center">
                    {(query.products || []).map((product, index) => (
                        <Link to={`/product/${product._id}`} key={index}>
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
