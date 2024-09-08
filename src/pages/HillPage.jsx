import "./HillPage.css";

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
    <main className="hill-page flex-group">
      <aside className="hill-page_book flex-group flex-column flex-vertical-center">
        <div className="hill-page_book-bind" data-book={bookNum}>{("Book "+numbers[bookNum])}</div>
        <div className="hill-page_book-text grid-group">
          A. WAINWRIGHT
          <span data-book={bookNum}>{titles[bookNum]}</span>
        </div>
        <div className="hill-page_book-bind" data-book={bookNum}></div>
      </aside>

      <div className="grid-group">
        <header className="hill-page_header">
          <h1>{hillData.name}</h1>
          <p>"This is a random Wainwright quote about the current mountain and could be quite long"</p>
        </header>


        <section className="hill-page_stats">
          {hillData.height}m
        </section>

        <section className="hill-page_walks">
          <h2>Walks:</h2>
          Sorry, we've not been to this mountain yet!
        </section>
      </div>
    </main>
  )
}