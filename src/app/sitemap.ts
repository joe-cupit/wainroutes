import { MetadataRoute } from "next"

import Walk from "@/types/Walk";
import Hill from "@/types/Hill";

import walksJson from "@/data/walks.json";
import wainsJson from "@/data/hills.json";


export const dynamic = "error"  // forces file to run once only on build
const domainName = "https://wainroutes.co.uk"


function getStaticUrls() {
  const staticPages = [
    "/",
    "/about",
    "/about/support",
    "/contact",
    "/safety",
    "/safety/terrain-icons",
    "/travel",
    "/wainwrights",
    "/walks",
    "/weather",
  ]

  return staticPages.map(path => `${domainName}${path}`)
}


function getWalkUrls() {
  return (walksJson as unknown as Walk[]).map(walk => `${domainName}/walks/${walk.slug}`)
}


function getWainwrightUrls() {
  return (wainsJson as unknown as Hill[]).map(wain => `${domainName}/wainwrights/${wain.slug}`)
}


export default async function sitemap() : Promise<MetadataRoute.Sitemap> {
  return [...getStaticUrls(), ...getWalkUrls(), ...getWainwrightUrls()].map(url => ({
    url: url,
    lastModified: new Date().toISOString().split('T')[0]
  }))
}
