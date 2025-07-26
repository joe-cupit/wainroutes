import { useMemo } from 'react';
import { Helmet } from 'react-helmet'


export default function WainroutesHelmet({ title, description, canonical, imageUrl } : { title?: string; description?: string; canonical?: string, imageUrl?: string }) {

  const fullTitle = useMemo(() => {
    if (title && title.length > 0) return title + " | Wainroutes";
    else return "Wainroutes";
  }, [title])

  const canonicalUrl = useMemo(() => {
    if (canonical !== undefined) return "https://wainroutes.co.uk" + canonical;
    else return null;
  }, [canonical])


  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta property="og:title" content={fullTitle} />
      <meta name="twitter:title" content={fullTitle} />

      {description && [
        <meta name="description" content={description} />,
        <meta property="og:description" content={description} />,
        <meta name="twitter:description" content={description} />
      ]}
      {canonicalUrl && [
        <link rel="canonical" href={canonicalUrl} />,
        <meta property="og:url" content={canonicalUrl} />
      ]}

      {imageUrl && [
        <meta property="og:image" content={imageUrl} />,
        <meta name="twitter:image" content={imageUrl} />
      ]}
    </Helmet>
  )
}
