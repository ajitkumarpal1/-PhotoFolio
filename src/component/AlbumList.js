import { Link } from "react-router-dom";
export const AlbumList = (props) => {
    const { album } = props
    return (<>
        <section key={"ses"} className="relative max-w-7xl mx-auto px-4 focus
    sm
    md
    my-12"
        >
            <ul className="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {
                    album.map((element, i) => {
                        return (<li key={i} className="space-y-8 text-center">
                            <Link to={`album?name=${element.name}`} className="text-sm leading-6 col-span-1">
                                <figure className="relative flex flex-col-reverse  rounded-lg p-6 shadow-2xl  ">
                                    <blockquote className="mt-6 ">
                                        <p className="text-slate-800 bg-gray-200 rounded-md text-3xl">{element.name}</p>
                                    </blockquote>
                                    <figcaption className="flex items-center space-x-4">
                                        <img className="mx-auto rounded-md" src="https://picsum.photos/300/300" alt="img" />
                                    </figcaption>
                                </figure>
                            </Link>
                        </li>)
                    })
                }
            </ul>
        </section>
    </>)
}