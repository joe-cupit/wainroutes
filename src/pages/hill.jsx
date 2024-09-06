import "../styles/hill.css";

import { useParams } from "react-router-dom";
import { useHills } from "../hooks/useHills";


const numbers = {
  1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven"
}
const titles = {
  1: "The Eastern Fells", 2: "The Far Eastern Fells", 3: "The Central Fells", 4: "The Southern Fells", 5: "The Northern Fells", 6: "The North Western Fells", 7: "The Western Fells"
}


export function HillPage() {
  const { slug } = useParams();

  const hillData = useHills(slug);
  const bookNum = hillData?.book;

  return (
  <div className="hill-page">
    <aside className="hill-page--book">
      <div className={"hill-page--book-bind book-background-"+bookNum}>{("Book "+numbers[bookNum]).toUpperCase()}</div>
      <div className="hill-page--book-text text--smallheading">
        A. WAINWRIGHT
        <span className={"book-text-"+bookNum}>{titles[bookNum].toUpperCase()}</span>
      </div>
      <div className={"hill-page--book-bind book-background-"+bookNum}></div>
    </aside>

    <main className="hill-page--main">
      <header>
        <h1 className="text--heading">{hillData.name}</h1>
        <p className="text--smallheading font--handwriting">"This is a random Wainwright quote about the current mountain and could be quite long"</p>
      </header>


      <section className="hill-page--stats">
        {hillData.height}m
      </section>

      <section className="hill-page--walks">
        <h2 className="text--subheading">Walks:</h2>
        Sorry, we've not been to this mountain yet!
      </section>
    </main>
  </div>
  )
}