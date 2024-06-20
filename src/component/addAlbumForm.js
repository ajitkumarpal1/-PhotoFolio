import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export const AddAlbumForm = () => {
    useEffect(() => {});

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    let close;

    async function formSubmit(e) {
        e.preventDefault();
        console.log(name);

        // Query Firestore to check if the album name already exists
        const q = query(collection(db, "albums"), where("name", "==", name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.log(q,querySnapshot);
            setError("This name Album already exists");
            close = setTimeout(() => {
                setError("");
            }, 3000);
            return;
        }

        // Add a new document with a generated id
        const docRef = await addDoc(collection(db, "albums"), {
            name: name,
            albumPics: []
        });
        console.log("Document written with ID: " + docRef.id);

        // Clear the input field after submission
        setName("");
    }

    return (
        <div className="flex flex-col items-center mx-auto">
            <div className="p-6 rounded shadow-xl w-full max-w-md">
                <h1 className="text-2xl text-white font-bold mb-4">Create an Album</h1>
                <form onSubmit={formSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setName("")}
                            className="w-full py-2 shadow-2xl text-white rounded hover:shadow-lg"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            className="w-full py-2 shadow-2xl text-white rounded hover:shadow-lg"
                        >
                            Add
                        </button>
                        <br />
                    </div>
                </form>
                {error && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded absolute top-9 right-9 w-80"
                        role="alert"
                    >
                        <strong className="font-bold">Try another name, </strong>
                        <span className="block sm:inline">{error}</span>
                        <span
                            onClick={() => {
                                clearTimeout(close);
                                setError("");
                            }}
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        >
                            <svg
                                className="fill-current h-6 w-6 text-red-500"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
