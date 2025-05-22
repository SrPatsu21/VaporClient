import React, { useState, useEffect } from "react";

export default function Download() {
    const [magnetURI, setMagnetURI] = useState("");
    const [folderPath, setFolderPath] = useState("");
    const [torrents, setTorrents] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("downloadFolder");
        if (saved) setFolderPath(saved);
    }, []);

    const pickFolder = async () => {
        const folder = await window.torrentFuncts.openFolder();
        if (folder) {
            setFolderPath(folder);
            localStorage.setItem("downloadFolder", folder);
        }
    };

    const startDownload = async () => {
        if (!magnetURI || !folderPath) return;
        await window.torrentFuncts.downloadTorrent(magnetURI, folderPath);
    };

    useEffect(() => {
        const getTorrents = async () => {
            setTorrents(await window.torrentFuncts.getAllTorrents());
        };

        const interval = setInterval(getTorrents, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Electron Torrent Downloader TESTER</h1>
            <input
                type="text"
                value={magnetURI}
                onChange={(e) => setMagnetURI(e.target.value)}
                placeholder="Enter Magnet URI"
                style={{ width: "100%" }}
            />
            <button onClick={pickFolder}>Choose Folder</button>
            <div>{folderPath && `Save to: ${folderPath}`}</div>
            <button onClick={startDownload} style={{ marginTop: "1rem" }}>
                Download
            </button>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {torrents &&
                        torrents.map((torrent, index) => (
                            <tr key={index}>
                                <td>{torrent.name}</td>
                                <td>{torrent.progress}%</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
