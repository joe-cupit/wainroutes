import { useState } from "react"


export default function MapNavbar({ fullPoints, setFullPoints, undoStack, reverseGpxDirection, editMode, setEditMode, showConfig, setShowConfig }) {

  const [flipped, setFlipped] = useState(false);

  return (
    <nav className="gpx-editor--navbar">

      <div className="gpx-editor--navbar-section">
        <NavbarButton title="Upload a GPX file" onClick={() => {document.getElementById("gpx-input").click()}}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
        </NavbarButton>
        <NavbarButton title="GPX file config" className={showConfig ? " active" : ""} onClick={() => setShowConfig(prev => !prev)}>
          <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
        </NavbarButton>
      </div>

      <div className="gpx-editor--navbar-section">
        <NavbarButton title="Move points" className={editMode==="default" ? " active" : ""} onClick={() => {setEditMode("default")}} svgstyle={{transform: "rotate(45deg)"}}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </NavbarButton>
        <NavbarButton title="Add points" className={editMode==="add" ? " active" : ""} onClick={() => {setEditMode("add")}} svgstyle={{transform: "scale(1.1)"}}>
          <path fillRule="evenodd" stroke="none" fill="currentColor" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd"/>
        </NavbarButton>
        <NavbarButton title="Remove points" className={editMode==="delete" ? " active" : ""} onClick={() => {setEditMode("delete")}} svgstyle={{transform: "scale(1.1)"}}>
          <path fillRule="evenodd" stroke="none" fill="currentColor" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd"/>
        </NavbarButton>
        <NavbarButton title="Add waypoint" className={editMode==="waypoint" ? " active" : ""} onClick={() => {setEditMode("waypoint")}} svgstyle={{transform: "scale(0.9)"}}>
          <path fillRule="evenodd" fill="currentColor" d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z" clipRule="evenodd" />
        </NavbarButton>
        <NavbarButton title="Reverse route direction" onClick={() => {setFlipped(prev => !prev); reverseGpxDirection();}} svgstyle={flipped ? {transform: "scaleX(-1)"} : {}}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </NavbarButton>
      </div>

      <div className="gpx-editor--navbar-section">
        <NavbarButton title="Undo" onClick={() => setFullPoints(undoStack.undo(fullPoints))} disabled={undoStack.undoSize === 0}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"/>
        </NavbarButton>
        <NavbarButton title="Redo" onClick={() => setFullPoints(undoStack.redo(fullPoints))} disabled={undoStack.redoSize === 0}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 9H8a5 5 0 0 0 0 10h9m4-10-4-4m4 4-4 4"/>
        </NavbarButton>
      </div>

      <div className="gpx-editor--navbar-section">
        <NavbarButton title="Download route as GPX file" onClick={() => {document.getElementById("gpx-download").click()}}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </NavbarButton>
      </div>

    </nav>
  )
}


function NavbarButton({ children, className, svgstyle, ...props}) {
  return (
    <button className={"gpx-editor--navbar-button" + (className ? " "+className : "")} {...props}>
      <svg style={svgstyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
        {children}
      </svg>
    </button>
  )
}
