import React, { useState, useEffect } from 'react';

export default function App() {
  const [magnetURI, setMagnetURI] = useState('');
  const [folderPath, setFolderPath] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('downloadFolder');
    if (saved) setFolderPath(saved);
  }, []);

  const pickFolder = async () => {
    const folder = await window.electronAPI.openFolder();
    if (folder) {
      setFolderPath(folder);
      localStorage.setItem('downloadFolder', folder);
    }
  };

  const startDownload = () => {
    if (!magnetURI || !folderPath) return;
    window.electronAPI.downloadTorrent(magnetURI, folderPath);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Electron Torrent Downloader</h1>
      <input
        type="text"
        value={magnetURI}
        onChange={(e) => setMagnetURI(e.target.value)}
        placeholder="Enter Magnet URI"
        style={{ width: '100%' }}
      />
      <button onClick={pickFolder}>Choose Folder</button>
      <div>{folderPath && `Save to: ${folderPath}`}</div>
      <button onClick={startDownload} style={{ marginTop: '1rem' }}>
        Download
      </button>
    </div>
  );
}
