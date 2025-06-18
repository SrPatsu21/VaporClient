import { useState } from "react";
import { API_BASE_URL, setToken } from "../../apiConfig";

export default function LoginOverlay({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        const res = await fetch(`${API_BASE_URL}/v1/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            setError("Login failed");
            return;
        }

        const data = await res.json();

        setToken(data.token); // função do apiConfig
        localStorage.setItem("refreshToken", data.refreshToken);

        onLoginSuccess(); // sinaliza para App.jsx que login foi feito
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-xl shadow-lg w-80 flex flex-col gap-4"
            >
                <h2 className="text-xl font-semibold text-center">Login</h2>

                <input
                    className="border px-3 py-2 rounded outline-none focus:ring-2 ring-blue-400"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    className="border px-3 py-2 rounded outline-none focus:ring-2 ring-blue-400"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            </form>
        </div>
    );
}
