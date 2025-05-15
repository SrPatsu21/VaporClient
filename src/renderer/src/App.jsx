function App() {
    const ipcHandle = () => window.electron.ipcRenderer.send("ping");

    return (
        <>
            <div>
                <p className="text-red-200">Hello world</p>
            </div>
        </>
    );
}

export default App;
