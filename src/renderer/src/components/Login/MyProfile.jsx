import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { secureFetch } from "../../apiConfig";

export default function MyProfile (){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            console.log("my profile")
            try {
                const response = await secureFetch("/v1/user/me", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log(data)
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 text-[var(--text_color1)]">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <div className="bg-[var(--background_color2)] p-4 rounded-xl shadow">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
};
