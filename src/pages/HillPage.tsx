import "./HillPage.css";

import { useParams } from "react-router-dom";

import { useHills } from "../hooks/useHills";
import setPageTitle from "../hooks/setPageTitle";
import { displayElevation } from "../utils/unitConversions";


const BookNumbers : {[book : number]: string} = {
  1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven"
}
const BookTitles : {[book : number]: string} = {
  1: "The Eastern Fells", 2: "The Far Eastern Fells", 3: "The Central Fells", 4: "The Southern Fells", 5: "The Northern Fells", 6: "The North Western Fells", 7: "The Western Fells"
}


export type Hill = {
  slug: string;
  name: string;
  name_secondary?: string;
  height: number;
  latitude: number;
  longitude: number;
  book: number;
  hasWalk: boolean;
}


export function HillPage() {
  const { slug } = useParams();

  const hillData = useHills(slug) as Hill;
  const bookNum = hillData?.book;

  setPageTitle(hillData?.name ?? "The Wainwrights");

  return (
    <main className="hill-page">

      <section>
        <div className="flex-row">
          <article className="wainwright-book" data-book={bookNum}>
            <div className="wainwright-book-bind">{("Book "+BookNumbers[bookNum])}</div>
            <div className="wainwright-book-text">
              A. Wainwright
              <p>{BookTitles[bookNum]}</p>
            </div>
            <div className="wainwright-book-bind"></div>
          </article>

          <div className="flex-column">
            <div className="hill-page_header">
              <h1 className="title">{hillData.name}</h1>
              <p className="subheading">{displayElevation(hillData.height)}</p>
              <p>"This is a random Wainwright quote about the current mountain and could be quite long"</p>
            </div>

            <div>
              <h2 className="heading">Walks:</h2>
              <p>Sorry, we've not been to this mountain yet!</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}