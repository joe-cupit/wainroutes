import './TravelPage.css';

import { ReactNode } from 'react';
import WainroutesHelmet from '../components/WainroutesHelmet';


export default function TravelPage() {

  return (
    <main className="travel-page">
      <WainroutesHelmet
        title="Lake District Travel"
        description="Travel information for the Lake District."
        canonical="/travel"
      />

      <section>
        <div className='travel__main'>
          <div>
            <h1 className='title'>Travelling The Lake District</h1>
            <p>More information is coming to this page soon. For now, you may find these links useful.</p>
          </div>

          <div>
            <h2 className='heading'>Useful resources</h2>
            <div className='travel__resources'>
              <div className='travel__resources-group'>
                <h3 className='subheading'>Stagecoach Buses</h3>
                <ResourceLink to="https://tiscon-maps-stagecoachbus.s3.amazonaws.com/Timetables/Cumbria/Lakes%20Connection/Summer%2025/Lakes%20by%20Bus%20Summer%202025%20WEB.pdf">
                  The Lakes by Bus Summer Timetables
                </ResourceLink>
                <ResourceLink to="https://www.stagecoachbus.com/promos-and-offers/cumbria-and-north-lancashire/explore-the-lakes-by-bus">
                  Stagecoach Lake District Bus Info
                </ResourceLink>
              </div>

              <div className='travel__resources-group'>
                <h3 className='subheading'>Youth Hostels & Hotels</h3>
                <ResourceLink to="https://www.yha.org.uk/places-to-stay/lake-district">
                  YHA Lake District Accomodation
                </ResourceLink>
                <ResourceLink to="https://www.dentonhouse-keswick.co.uk/">
                  Denton House Hostel Keswick
                </ResourceLink>
              </div>

              {/* <div className='travel__resources-group'>
                <h3 className='subheading'>Train Travel</h3>
              </div> */}

              <div className='travel__resources-group'>
                <h3 className='subheading'>Boats</h3>
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


function ResourceLink({ to, children } : { to: string; children: ReactNode }) {
  return (
    <a href={to} target='_blank'>
      {children}
    </a>
  )
}
