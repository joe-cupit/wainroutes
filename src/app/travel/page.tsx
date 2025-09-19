import styles from './Travel.module.css';
import fontStyles from "@/styles/fonts.module.css";

import { createPageMetadata } from '@/utils/metadata';


export function generateMetadata() {
  return createPageMetadata({
    title: "Lake District Travel",
    description: "Find bus times, hostel accommodation, lake boats, and travel tips for your next Lake District visit.",
    path: "/travel",
  });
}


export default function Travel() {

  return (
    <main className={styles.travel}>

      <section>
        <div className={styles.main}>
          <div>
            <h1 className={`${fontStyles.title} ${styles.title}`}>Travelling The Lake District</h1>
            <p>More information is coming to this page soon. For now, you may find these links useful.</p>
          </div>

          <div>
            <h2 className={fontStyles.heading}>Useful resources</h2>
            <div className={styles.resources}>
              <div className={styles.resourcesGroup}>
                <h3 className={fontStyles.subheading}>Stagecoach Buses</h3>
                <ResourceLink to="https://tiscon-maps-stagecoachbus.s3.amazonaws.com/Timetables/Cumbria/Lakes%20Connection/Summer%2025/Lakes%20by%20Bus%20Summer%202025%20WEB.pdf">
                  The Lakes by Bus Summer Timetables
                </ResourceLink>
                <ResourceLink to="https://www.stagecoachbus.com/promos-and-offers/cumbria-and-north-lancashire/explore-the-lakes-by-bus">
                  Stagecoach Lake District Bus Info
                </ResourceLink>
              </div>

              <div className={styles.resourcesGroup}>
                <h3 className={fontStyles.subheading}>Youth Hostels & Hotels</h3>
                <ResourceLink to="https://www.yha.org.uk/places-to-stay/lake-district">
                  YHA Lake District Accomodation
                </ResourceLink>
                <ResourceLink to="https://www.dentonhouse-keswick.co.uk/">
                  Denton House Hostel Keswick
                </ResourceLink>
              </div>

              {/* <div className={styles.resources-group}>
                <h3 className={fontStyles.subheading}>Train Travel</h3>
              </div> */}

              <div className={styles.resourcesGroup}>
                <h3 className={fontStyles.subheading}>Boats</h3>
                <ResourceLink to="https://keswick-launch.co.uk/">
                  Keswick Launch Cruises
                </ResourceLink>
                <ResourceLink to="https://keswick-launch.co.uk/boat-hire/">
                  Derwentwater Boat Hire
                </ResourceLink>
                <ResourceLink to="https://www.ullswater-steamers.co.uk/plan-your-visit/timetable-and-fares">
                  Ullswater Steamers Cruises
                </ResourceLink>
                <ResourceLink to="https://www.windermere-lakecruises.co.uk/cruises-fares">
                  Windermere Lake Cruises
                </ResourceLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


function ResourceLink({ to, children } : { to: string; children: React.ReactNode }) {
  return (
    <a href={to} target='_blank'>
      {children}
    </a>
  )
}
