import bg from "./assets/img/bg.jpg";
import {ReactComponent as Backbtn} from "./assets/svg/back.svg"
import { AddAlbumForm } from "./component/addAlbumForm";
import { AddImgToAlbumForm } from "./component/addImgToAlbumForm";
import { AlbumList } from "./component/AlbumList";
import { MyAlbum } from "./component/MyAlbum";
import { Footer } from "./component/Footer1";
import { useReducer, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function albumRender(album, action) {
  switch (action.type) {
    case "setList":
      return action.payload;

    default:
      return album;
  }
}

function App() {
  const [album, dispatchAlbum] = useReducer(albumRender, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "albums"), (querySnapshot) => {
      const array = [];
      querySnapshot.forEach((doc) => {
        array.push({ ...doc.data(), id: doc.id });
      });
      dispatchAlbum({ type: "setList", payload: array });
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div style={{ backgroundImage: `url(${bg})`, backgroundSize: "contain", minHeight: "100vh", maxWidth: "100vw" }} className="pt-14">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<><AddAlbumForm /><AlbumList album={album} /></>} />
            <Route path="album" element={<>
                                          <Link to="/" className="absolute top-4 left-4">
                                            <Backbtn width="44" height="44" className="text-2xl" />
                                          </Link>
                                          <AddImgToAlbumForm />
                                          <MyAlbum album={album} />
                                        </>} />
          </Routes>
        </BrowserRouter>
        <Footer />
      </div>
    </>
  );
}

export default App;
