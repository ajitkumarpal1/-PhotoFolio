import { Link } from "react-router-dom";
import { db } from "../firebase";
import { useReducer, useEffect } from "react";
import { doc, onSnapshot, query, collection, where, getDocs } from "firebase/firestore";
import { useLocation } from "react-router-dom";

function albumRender(album, action) {
    switch (action.type) {
        case "setList":
            return action.payload;
        default:
            return album;
    }
}

export const MyAlbum = () => {
    const albumName = new URLSearchParams(useLocation().search).get('name');
    const [albumimg, dispatchAlbumimg] = useReducer(albumRender, { albumPics: [] });

    async function getAlbum() {
        try {
            const q = query(collection(db, "albums"), where("name", "==", albumName));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                let albumData = {};
                querySnapshot.forEach((doc) => {
                    albumData = { ...doc.data(), id: doc.id };
                });
                return albumData;
            } else {
                console.log("No matching document found.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching album:", error);
            return null;
        }
    }

    useEffect(() => {
        async function fetchData() {
            const albumData = await getAlbum();
            if (albumData) {
                const docRef = doc(db, "albums", albumData.id);
                const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const updatedAlbumData = { ...docSnapshot.data(), id: docSnapshot.id };
                        dispatchAlbumimg({ type: "setList", payload: updatedAlbumData });
                    } else {
                        console.log("No such document!");
                    }
                });

                // Clean up the listener on component unmount
                return () => unsubscribe();
            }
        }

        fetchData();
    }, [albumName]);

    return (
        <>
            <section className="relative max-w-7xl mx-auto px-4 focus:outline-none sm:px-3 md:px-5 my-12">
                <ul className="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {albumimg.albumPics.map((pic, index) => (
                        <li key={index} className="space-y-8 text-center h-96">
                            <Link to={`/`} className="text-sm leading-6 col-span-1">
                                <figure className="relative flex flex-col-reverse rounded-lg p-6 shadow-2xl h-full">
                                    <blockquote className="mt-6">
                                        <p className="text-slate-800 bg-gray-200 rounded-md text-3xl">{pic.title}</p>
                                    </blockquote>
                                    <figcaption className="flex items-center justify-center flex-grow h-3/4">
                                        <img className="rounded-md object-contain h-full w-full" src={pic.url} alt={pic.title} />
                                    </figcaption>
                                </figure>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}
