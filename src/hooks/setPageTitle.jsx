
const baseTitle = "Wainroutes";
const separator = "—";


export default function setPageTitle(pageTitle) { 
  if (!pageTitle || pageTitle === "") {
    document.title = baseTitle
  }
  else {
    document.title = `${pageTitle} ${separator} ${baseTitle}`
  }
}
