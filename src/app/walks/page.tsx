import styles from "./Walks.module.css";
import fontStyles from "@/app/fonts.module.css";

import BackToTopButton from "@/app/components/BackToTopButton/BackToTopButton";
import WalkGrid from "./components/WalkGrid";
import WalksSearchBar from "./components/WalkSearchBar";


export default function WalksPage() {

  return (
    <main className={styles.walks}>
      <BackToTopButton minHeight={600} />

      <section>
      
        <div className="flex-column">
          <h1 className={fontStyles.title}>Walks in the Lake District</h1>
          {/* <WalkMap
            mapMarkers={filteredMarkers}
            activePoint={hoveredSlug}
          /> */}
          <div className={styles.main}>
            <WalksSearchBar/>
            <WalkGrid
              // walks={sortedWalks}
              // hasLocationParam={(currentTown in locations)}
              // sortControl={{
              //   value: sortValue,
              //   set: updateSortSearchParam
              // }}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
