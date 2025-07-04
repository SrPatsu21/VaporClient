import React, { useState, useEffect, useRef } from "react";
import MessageModal from "../MessageModal/MessageModal";

export default function Download() {
    const [torrents, setTorrents] = useState([]);
    const messageModalRef = useRef();

    useEffect(() => {
        const getTorrents = async () => {
            setTorrents(await window.torrentFuncts.getAllTorrents());
        };

        const interval = setInterval(getTorrents, 1000);

        return () => clearInterval(interval);
    }, []);

    const removeActualTorrent = async (torrentID) => {
        const data = await window.torrentFuncts.removeTorrent(torrentID);
        console.log("TorrentId remove: ", typeof data, " and: ", data);
        messageModalRef.current.showModal("Remove torrent!", data);
    };

    const downloadingIcon = `<svg width="34px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 15V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V15M12 5V15M12 15L10 13M12 15L14 13" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    const readyIcon = `<svg width="34px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    return (
        <div style={{ padding: "1rem" }}>
            <MessageModal ref={messageModalRef} />
            <div className="overflow-x-auto p-4">
                <table className="min-w-full table-auto text-left text-sm text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Actual Download</th>
                            <th className="px-4 py-2">Download Speed</th>
                            <th className="px-4 py-2">Time remaining</th>
                            <th className="px-4 py-2">Seeds</th>
                            <th className="px-4 py-2">Upload Speed</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {torrents &&
                            torrents.map((torrent) => (
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium">
                                        <span
                                            dangerouslySetInnerHTML={
                                                {__html: torrent.done == false
                                                    ? downloadingIcon
                                                    : readyIcon}
                                            }
                                        ></span>
                                    </td>
                                    <td className="px-4 py-2 font-medium">
                                        {torrent.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {torrent.downloaded}GB of{" "}
                                        {torrent.length}GB
                                    </td>
                                    <td className="px-4 py-2">
                                        {torrent.downloadSpeed}MB/s
                                    </td>
                                    <td className="px-4 py-2">
                                        {torrent.timeRemaining} minutes
                                    </td>
                                    <td className="px-4 py-2">
                                        {torrent.numPeers}
                                    </td>
                                    <td className="px-4 py-2">
                                        {torrent.uploadSpeed}MB/s
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() =>
                                                removeActualTorrent(
                                                    torrent.magnetURI
                                                )
                                            }
                                            className="shrink p-2 hover:text-[var(--hover_warning_color)]"
                                        >
                                            <svg
                                                width="32"
                                                height="32"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M4 6H20L18.4199 20.2209C18.3074 21.2337 17.4512 22 16.4321 22H7.56786C6.54876 22 5.69264 21.2337 5.5801 20.2209L4 6Z"
                                                    stroke="#000000"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M7.34491 3.14716C7.67506 2.44685 8.37973 2 9.15396 2H14.846C15.6203 2 16.3249 2.44685 16.6551 3.14716L18 6H6L7.34491 3.14716Z"
                                                    stroke="#000000"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M2 6H22"
                                                    stroke="#000000"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M10 11V16"
                                                    stroke="#000000"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M14 11V16"
                                                    stroke="#000000"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
