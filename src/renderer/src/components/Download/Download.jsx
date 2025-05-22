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
            <div class="overflow-x-auto p-4">
                <table class="min-w-full table-auto text-left text-sm text-gray-700">
                    <thead class="bg-gray-100 text-xs uppercase text-gray-500">
                    <tr>
                        <th class="px-4 py-2">Name</th>
                        <th class="px-4 py-2">Actual Download</th>
                        <th class="px-4 py-2">Download Speed</th>
                        <th class="px-4 py-2">Time remaining</th>
                        <th class="px-4 py-2">Seeds</th>
                        <th class="px-4 py-2">Upload Speed</th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                    {torrents &&
                        torrents.map((torrent, index) => (
                            <tr class="hover:bg-gray-50">
                            <td class="px-4 py-2 font-medium">{torrent.name}</td>
                            <td class="px-4 py-2">{torrent.downloaded}GB of {torrent.length}GB</td>
                            <td class="px-4 py-2">{torrent.downloadSpeed}MB/s</td>
                            <td class="px-4 py-2">{torrent.timeRemaining} minutes</td>
                            <td class="px-4 py-2">{torrent.numPeers}</td>
                            <td class="px-4 py-2">{torrent.uploadSpeed}MB/s</td>
                        </tr>
                        ))}
                    
                    </tbody>
                </table>
            </div>
        </div>
    );
}
