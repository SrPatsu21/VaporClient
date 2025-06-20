import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";

export default function ShowProductInfo() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`${API_BASE_URL}/v1/product/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error("Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) return <div className="p-6 text-xl">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
    if (!product) return <div className="p-6">No product found</div>;

    return (
        <div className="p-8 m-12 m-20 bg-[var(--background_color3)] p-6">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <img
                src={product.imageURL || product.title?.imageURL || "https://via.placeholder.com/300x160?text=No+Image"}
                alt={product.name}
                className="w-auto object-contain rounded mb-4 bg-gray-100"
            />
            <p className="mb-2 text-lg"><strong>Description:</strong> {product.description}</p>
            <p className="mb-2 text-lg"><strong>Version:</strong> {product.version}</p>
            <p className="mb-2 text-lg"><strong>Magnet Link:</strong> {product.magnetLink}</p>

            {product.tags?.length > 0 && (
                <div className="mb-4">
                    <strong>Tags:</strong>
                    <ul className="list-disc list-inside">
                        {product.tags.map(tag => (
                            <li key={tag._id}>{tag.tagSTR}</li>
                        ))}
                    </ul>
                </div>
            )}

            {product.title && (
                <div className="mb-4">
                    <Link
                        to="/search"
                        onClick={() => {
                            const savedParams = sessionStorage.getItem("searchState");
                            const parsed = savedParams ? JSON.parse(savedParams) : {};

                            const newParams = {
                                ...parsed,
                                title: product.title._id,
                                titleInput: product.title.titleSTR,
                                search: '',
                                name: '',
                                page: 0
                            };

                            sessionStorage.setItem("searchState", JSON.stringify(newParams));
                        }}
                    >
                        <h1 className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer">
                            Title: {product.title.titleSTR}
                        </h1>
                        {product.title.imageURL && (
                            <img
                                src={product.title.imageURL}
                                alt={product.title.titleSTR}
                                className="w-auto max-h-[300px] object-contain mt-2 rounded"
                            />
                        )}
                    </Link>
                </div>
            )}

            {product.owner && (
                <p className="mb-2"><strong>Owner:</strong> {product.owner.username}</p>
            )}

            <div className="flex justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="text-center px-4 py-2 rounded text-[var(--text_color1)] hover:text-[var(--hover_text_color1)] bg-[var(--warning_color)] hover:bg-[var(--hover_warning_color)]"
                >
                    ← Back to search
                </button>

                <Link
                    to=""
                    className="text-center px-4 py-2 rounded text-[var(--text_color1)] hover:text-[var(--hover_text_color1)] bg-[var(--danger_color)] hover:bg-[var(--hover_danger_color)]"
                >
                    Download
                </Link>
            </div>

        </div>
    );
}