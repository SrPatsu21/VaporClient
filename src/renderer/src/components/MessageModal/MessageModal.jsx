import React, {
    useImperativeHandle,
    forwardRef,
    useState,
    useEffect,
} from "react";

const MessageModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [animClass, setAnimClass] = useState("");

    useImperativeHandle(ref, () => ({
        showModal(newTitle, newMessage) {
            setTitle(newTitle);
            setMessage(newMessage);
            setVisible(true);
            setAnimClass("animate-fade-in");

            setTimeout(() => {
                setAnimClass("animate-fade-out");
                setTimeout(() => setVisible(false), 500); // wait fade-out
            }, 5000);
        },
    }));

    return visible ? (
        <div className={`fixed top-4 right-4 z-50 ${animClass}`}>
            <div className="bg-white/80 backdrop-blur-md p-4 rounded shadow-lg w-80 transition-all">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    ) : null;
});

export default MessageModal;