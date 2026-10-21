# AssetQuant website deployment and indexing checklist

## Deployment
1. Review changes in this ZIP, especially AQuA product claims and business contact email.
2. Back up the current repository. Copy these files into the existing GitHub Pages publishing branch/root (preserve CNAME).
3. Test links and demo interactions, commit, push, and wait for the GitHub Pages deployment to complete.
4. Confirm https://assetquant.ai/ and https://assetquant.ai/aqua/ load, and HTTPS is enforced.
5. Confirm apex and www redirect/canonical behavior is consistent.

## Google indexing
1. In Google Search Console add and verify a Domain property for assetquant.ai via registrar DNS TXT record.
2. Submit sitemap URL: https://assetquant.ai/sitemap.xml.
3. Use URL Inspection on /, /aqua/, /aqua/payments.html, /aqua/kyc.html and /aqua/demos.html; request indexing when accessible.
4. Monitor Pages indexing, Core Web Vitals, HTTPS, search queries and sitemap processing over subsequent days/weeks. Indexing and ranking are not guaranteed.
5. Consider Bing Webmaster Tools and submit the same sitemap.
6. Add GA4 only after selecting analytics/consent approach and updating privacy disclosures as appropriate.

## Important limitations
- The four AQuA pages are a public-facing product overview plus two synthetic interactive concept calculators; they are NOT 12 independently implemented demos.
- Do not claim AQuA is production-ready, bank-certified, connected to CKYC or deployed at banks.
- The existing 12 demos are preserved.
- DNS changes, Search Console verification, repository push and live indexing require authenticated access; none has been performed by this ZIP.
- Sitemap paths assume GitHub Pages publishes at the custom-domain root.
- Test form delivery and contact addresses separately before announcing launch.
