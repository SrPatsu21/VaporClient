import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../apiConfig";

const AddYourOwn = () => {
    const [attributes, setAttributes] = useState(() => {
        const saved = sessionStorage.getItem("addYourOwnAttributes");
        if (saved) return JSON.parse(saved);
        return {
            name: "",
            description: "",
            imageURL: "",
            magnetLink: "",
            othersUrl: [],
            title: "",
            tags: [],
            version: "",
        };
        //* name: 'string',
        //* description: 'string',
        //* imageURL: 'string',
        //* magnetLink: 'string',
        //* othersUrl: [
        //*     "string"
        //* ],
        //* title: 'string',
        //* tags: [
        //*     { _id: "tag id", tagSTR: "tag name"}
        //* ],
        //* version: 'string',
    });
    const [allTags, setAllTags] = useState([]);
    const [allTitles, setAllTitles] = useState([]);

    //* start functions
    useEffect(() => {
        //? show all titles
        const fetchTitles = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/v1/title`);
                const data = await res.json();
                setAllTitles(data);
            } catch (err) {
                console.error("Error fetching all titles", err);
            }
        };

        //? show all tags
        const fetchTags = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/v1/tag`);
                const data = await res.json();
                setAllTags(data);
            } catch (err) {
                console.error("Error fetching all tags", err);
            }
        };

        fetchTitles();
        fetchTags();
    }, []);

    //* tag input related functions
    const handleTagInput = async (e) => {
        const { value, options, selectedIndex } = e.target;
        if (selectedIndex != 0) {
            if (!attributes.tags.some(tag => tag._id === value)) {

                const newArray = attributes.tags;
                newArray.push({ _id: value, tagSTR: options[selectedIndex].text });
                
                setAttributes((prev) => ({
                    ...prev,
                    tags: newArray,
                }));
                
                console.log("handleTagInput: tags field: ", attributes.tags);
            }
        }
    };
    const removeTag = (id) => {
        setAttributes((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag._id !== id),
        }));
    };

    //* otherUrl input related functions
    const handleOtherUrl = async(e) => {
        const { value } = e.target;
        if (e.code == 'Enter') {
            //? make another this equal to tag, to add this otherUrl to one span inside a div
            const newArray = attributes.othersUrl;
            newArray.push(value);

            setAttributes((prev) => ({
                ...prev,
                othersUrl: newArray,
            }));    

            console.log("OthersUrl: ", attributes.othersUrl);
        }
    }

    const removeTitle = async(id) => {
        const newArray = attributes.othersUrl;
        newArray.splice(id, 1);

        setAttributes((prev) => ({
            ...prev,
            othersUrl: newArray,
        }));
    }

    //* create your owns files
    const createOwnMagnetLink = async() => {
        const batchFilePaths = await window.torrentFuncts.openFile()
        if (batchFilePaths) {
            console.log("path: ", batchFilePaths);
            const res = await window.torrentFuncts.createNewTorrent(batchFilePaths);
            console.log("res: ", res);
        }
    }

    //* prepare the payload and do the post request
    const addOwnProduct = () => {
        //? set params using the inputs (tags is set when the tag is select)

        //? check if all params that are required aren't null or blank string
        //? if some are then use message modal to show to the user what intel is missing

        //? send the request
        console.log(attributes);

        //? using message model the request has been successful
    };

    return (
        <div className="space-y-4 p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto">
            <input
                type="text"
                name="name"
                value={attributes.name}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--warning_color)]"
                placeholder="Enter name"
            />
            <input
                type="text"
                name="description"
                value={attributes.description}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--warning_color)]"
                placeholder="Enter description"
            />
            <input
                type="text"
                name="imageURL"
                value={attributes.imageURL}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--warning_color)]"
                placeholder="Enter imageURL"
            />
            <input
                type="text"
                name="magnetLink"
                value={attributes.magnetLink}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--warning_color)]"
                placeholder="Enter magnetLink"
            />
            <button className="w-full text-center px-4 py-2 rounded text-[var(--text_color)] hover:text-[var(--hover_text_color)] bg-[var(--warning_color)] hover:bg-[var(--hover_warning_color)]" onClick={createOwnMagnetLink}>
                Create your own torrent!
            </button>
            <input
                type="text"
                name="othersUrl"
                onKeyDown={handleOtherUrl}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--warning_color)]"
                placeholder="Enter others url"
            />
            <div>
                titles:
                {attributes.othersUrl && attributes.othersUrl.map((url, index) => (
                    <p className="text-[var(--warning_color)] py-1">
                        {url}
                        <button
                                onClick={() => removeTitle(index)}
                                className="ml-2 text-[var(--danger_color)] hover:text-[var(--hover_danger_color)]"
                            >
                                &times;
                            </button>
                    </p>
                ))}
            </div>
            <select
                name="title"
                value={attributes.title}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--warning_color)]"
            >
                <option>Select a title</option>
                // foreach titles on api
                {allTitles.map((title) => (
                    <option value={title._id}> {title.titleSTR} </option>
                ))}
            </select>
            <select
                name="tags"
                onChange={handleTagInput}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--warning_color)]"
            >
                <option value="" >Select a tag</option>
                {allTags.map((tag) => (
                        <option value={tag._id}> {tag.tagSTR} </option>
                    ))}
            </select>
            <div className="flex flex-wrap gap-2 mb-2">
                {attributes.tags &&
                    attributes.tags.map((tag) => (
                        // tag
                        <span
                            className="bg-[var(--background_color2)] text-[var(--warning_color)] px-2 py-1 rounded-full flex items-center"
                        >
                            {tag.tagSTR}
                            <button
                                onClick={() => removeTag(tag._id)}
                                className="ml-2 text-[var(--danger_color)] hover:text-[var(--hover_danger_color)]"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
            </div>
            <input
                type="text"
                name="version"
                value={attributes.version}
                classname="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--warning_color)]"
                placeholder="Enther version"
            />
            <button className="w-full text-center px-4 py-2 rounded text-[var(--text_color)] hover:text-[var(--hover_text_color)] bg-[var(--warning_color)] hover:bg-[var(--hover_warning_color)]" onClick={addOwnProduct}>Add Your Own Product!</button>
        </div>
    );
};

export default AddYourOwn;
