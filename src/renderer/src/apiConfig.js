export const BASE_URL = "https://vaporapi.onrender.com";
export const API_BASE_URL = BASE_URL + "/api";

let token = null;
let tokenTime = null;

export function setToken(newToken) {
    token = newToken;
    tokenTime = Date.now();
}

export function getTokenTime() {
    return tokenTime;
}

export function clearToken() {
    token = null;
    tokenTime = null;
    localStorage.removeItem("refreshToken");
}

export async function getToken() {
    const now = Date.now();
    const age = now - (tokenTime || 0);

    if (!token || age > 9 * 60 * 1000) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return null;

        const res = await fetch(`${API_BASE_URL}/v1/refreshToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        setToken(data.token);
        return data.token;
    }

    return token;
}

export async function secureFetch(path, options = {}) {
    const authToken = await getToken();
    if (!authToken) throw new Error("User not authenticated");

    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${authToken}`,
        },
    });
}
