import { useMemo } from 'react';
import { Helmet } from 'react-helmet'


export default function WainroutesHelmet({ title, description, canonical, imageUrl, noindex } : { title?: string; description?: string; canonical?: string, imageUrl?: string, noindex?: boolean }) {

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
        <meta key="desc" name="description" content={description} />,
        <meta key="og:desc" property="og:description" content={description} />,
        <meta key="twitter:desc" name="twitter:description" content={description} />
      ]}
      {canonicalUrl && [
        <link key="url" rel="canonical" href={canonicalUrl} />,
        <meta key="og:url" property="og:url" content={canonicalUrl} />
      ]}

      {imageUrl && [
        <meta key="og:image" property="og:image" content={imageUrl} />,
        <meta key="twitter:image" name="twitter:image" content={imageUrl} />
      ]}

      {noindex &&
        <meta name="robots" content="noindex" />
      }
    </Helmet>
  )
}
