import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";

const Product = () => {
    const [titleInfo, setTitleInfo] = useState({});
    const [products, setProducts] = useState([]);
    const { id } = useParams();

    // Get title info to show and get products by this title
    useEffect(() => {
        const fetchTitleInfo = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/v1/title/${id}`, {
                    headers: { Accept: "application/json" },
                });
                const data = await res.json();
                setTitleInfo(data);
            } catch (err) {
                console.error("Error fetching title info: ", err);
            }
        };

        fetchTitleInfo();
    }, [id]);

    // Get all products from the title
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // https://vaporapi.onrender.com/api/v1/product?title=6831f2cb9f59cce170567929
                const res = await fetch(
                    `${API_BASE_URL}/v1/product?title=${titleInfo._id}`,
                    {
                        headers: { Accept: "application/json" },
                    }
                );
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products: ", err);
            }
        };

        if (titleInfo._id) {
            fetchProducts();
        }
    }, [titleInfo]);

    function downloadThisProduct(magnetURI) {
        console.log(magnetURI);
    }

    return (
        <div>
            <h1>Product {titleInfo._id}</h1>
            <h1>Product {titleInfo.titleSTR}</h1>
            <table className="min-w-full table-auto text-left text-sm text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">
                                Nome: {product.name}
                            </td>
                            <button
                                onClick={() =>
                                    downloadThisProduct(product.magnetLink)
                                }
                                className="shrink p-2 hover:text-[var(--hover_warning_color)]"
                            >
                                <svg
                                    width="32px"
                                    height="32px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M19 15V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V15M12 5V15M12 15L10 13M12 15L14 13"
                                        stroke="#000000"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Product;
