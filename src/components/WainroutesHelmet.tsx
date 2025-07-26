import { Helmet } from 'react-helmet'

export default function WainroutesHelmet({ title, description, canonical } : { title?: string; description?: string; canonical?: string }) {
  
  return (
    <Helmet>
      <title>{title ? title + " | Wainroutes" : "Wainroutes"}</title>
      {description && <meta name="description" content={description} />}
      {(canonical !== undefined) && <link rel="canonical" href={"https://wainroutes.co.uk" + canonical} />}
    </Helmet>
  )
}
