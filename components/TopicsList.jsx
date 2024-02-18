import Link from "next/link";
import Canvas from "./Canvas";

const getTopics = async () => {
  try {
    const res = await fetch("https://draw-io-eight.vercel.app/api/topics", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading topics: ", error);
  }
};

export default async function TopicsList() {
  const topics = [];
  return (
    <div className="album py-5 ">
      <div className="container">
        <div className="row">
          {topics.map((t) => (
            <div className="col-md-4" key={t._id}>
              <Link href={`/editTopic/${t._id}`} style={{ textDecoration: 'none' }}>
                <div className="card mb-4 box-shadow">
                  <Canvas canvasFile={t.canvasFile}></Canvas>
                  <div className={"card-body"} >
                    <h5 className="card-title">{t.name}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
