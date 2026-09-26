export function defaultSiteUrl(explicit: string | undefined): string {
  const siteUrl = explicit ?? process.env.GSC_SITE_URL;
  if (!siteUrl) {
    throw new Error(
      "No site_url given and GSC_SITE_URL is not set. Pass a property URL, e.g. 'sc-domain:example.de'.",
    );
  }
  return siteUrl;
}
