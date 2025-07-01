import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import { secureFetch } from "../../apiConfig";
import MessageModal from "../MessageModal/MessageModal";

export default function ManageProducts() {
    const { userid } = useParams();
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        title: "",
        titleInput: "",
        tags: [],
        page: 0,
    });

    const [titleOptions, setTitleOptions] = useState([]);
    const [titleVisible, setTitleVisible] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [tagOptions, setTagOptions] = useState([]);
    const titleDropdownRef = useRef();
    const messageModalRef = useRef();

    const fetchProducts = async () => {
        try {
            const tagQuery = filters.tags.length
                ? `&tags=${filters.tags.map((t) => t._id).join(",")}`
                : "";
            const url = `/v1/product?name=${filters.name}&owner=${userid}${
                filters.title ? `&title=${filters.title}` : ""
            }${tagQuery}&limit=20&skip=${filters.page * 20}`;
            const res = await secureFetch(url);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;

        if (name === "titleInput") {
            setFilters((prev) => ({
                ...prev,
                titleInput: value,
                ...(value === "" ? { title: "" } : {}),
            }));

            if (value.length > 0) {
                try {
                    const res = await secureFetch(`/v1/title?titleSTR=${value}&limit=8`);
                    const data = await res.json();
                    setTitleOptions(data || []);
                } catch (err) {
                    console.error("Error fetching title options", err);
                }
            } else {
                setTitleOptions([]);
            }
        } else {
            setFilters((prev) => ({ ...prev, [name]: value }));
        }
    };

    const selectTitle = (option) => {
        setFilters((prev) => ({
            ...prev,
            titleInput: option.titleSTR,
            title: option._id,
        }));
        setTitleVisible(false);
    };

    const handleTagSearch = async (value) => {
        setTagInput(value);
        if (!value) return setTagOptions([]);
        try {
            const res = await secureFetch(`/v1/tag?tagSTR=${value}&limit=8`);
            const data = await res.json();
            setTagOptions(data || []);
        } catch (err) {
            console.error("Error fetching tag options", err);
        }
    };

    const addTag = (tag) => {
        if (!filters.tags.find((t) => t._id === tag._id)) {
            setFilters((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
        }
        setTagInput("");
        setTagOptions([]);
    };

    const removeTag = (id) => {
        setFilters((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag._id !== id),
        }));
    };

    const handleBlur = (ref, setter) => {
        setTimeout(() => {
            if (!ref.current?.matches(":hover")) setter(false);
        }, 200);
    };

    const handleSearchClick = () => {
        setFilters((prev) => ({ ...prev, page: 0 }));
        fetchProducts();
    };

    const handlePageChange = (delta) => {
        const newPage = filters.page + delta;
        setFilters((prev) => ({ ...prev, page: newPage }));
        fetchProducts();
    };

    return (
        <div className="min-h-screen p-6">
            <MessageModal ref={messageModalRef} />
            <h1 className="text-2xl font-bold mb-4">Your Products</h1>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                    type="text"
                    name="name"
                    placeholder="Product name"
                    value={filters.name}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded w-full"
                />
                <div className="relative">
                    <input
                        type="text"
                        name="titleInput"
                        value={filters.titleInput}
                        onChange={handleInputChange}
                        onFocus={() => setTitleVisible(true)}
                        onBlur={() => handleBlur(titleDropdownRef, setTitleVisible)}
                        placeholder="Search title"
                        className="border px-3 py-2 rounded w-full"
                    />
                    {titleVisible && titleOptions.length > 0 && (
                        <ul
                            ref={titleDropdownRef}
                            className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto"
                        >
                            {titleOptions.map((option) => (
                                <li
                                    key={option._id}
                                    onClick={() => selectTitle(option)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {option.titleSTR}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="relative col-span-2">
                    <input
                        type="text"
                        placeholder="Search tags"
                        value={tagInput}
                        onChange={(e) => handleTagSearch(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                    />
                    {tagOptions.length > 0 && (
                        <ul className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto">
                            {tagOptions.map((tag) => (
                                <li
                                    key={tag._id}
                                    onClick={() => addTag(tag)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {tag.tagSTR}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 col-span-2">
                    {filters.tags.map((tag) => (
                        <span key={tag._id} className="bg-blue-100 px-2 py-1 rounded-full">
                            {tag.tagSTR}
                            <button
                                onClick={() => removeTag(tag._id)}
                                className="ml-2 text-red-500"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <div className="col-span-2">
                    <button
                        onClick={handleSearchClick}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Lista de produtos */}
            <div className="flex flex-col gap-4">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="flex bg-white shadow rounded overflow-hidden h-[200px]"
                    >
                        <div className="w-[200px] bg-gray-100 flex-shrink-0">
                            <img
                                src={product.imageURL || "https://via.placeholder.com/300x160?text=No+Image"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4 flex flex-col justify-between w-full">
                            <div>
                                <h3 className="text-xl font-semibold">{product.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                                <div className="mt-2 flex gap-2 flex-wrap">
                                    {product.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-xs bg-gray-200 px-2 py-1 rounded"
                                        >
                                            {typeof tag === "string" ? tag : tag.tagSTR}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <a
                                    onClick={() =>
                                        window.torrentFuncts.downloadTorrent(product.magnetLink, "default-folder")
                                    }
                                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded cursor-pointer"
                                >
                                    Download
                                </a>
                                <span className="text-xs text-gray-400">v{product.version}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginação */}
            <div className="mt-8 flex justify-center gap-4">
                <button
                    disabled={filters.page === 0}
                    onClick={() => handlePageChange(-1)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                    Previous
                </button>
                <span className="text-lg font-medium">Page {filters.page + 1}</span>
                <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    disabled={products.length < 20}
                >
                    Next
                </button>
            </div>
        </div>
    );
}