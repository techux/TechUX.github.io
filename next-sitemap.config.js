/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://devesh.is-a.dev",
  generateRobotsTxt: true,
  outDir: "out",
  sitemapSize: 7000,

  transform: async (config, path) => {
    if (path === "/") {
      return {
        loc: path,
        priority: 1.0,
        changefreq: "daily",
        lastmod: new Date().toISOString(),
      };
    }

    if (path.startsWith("/project/")) {
      return {
        loc: path,
        priority: 0.9,
        changefreq: "daily",
        lastmod: new Date().toISOString(),
      };
    }

    return {
      loc: path,
      priority: 0.7,
      changefreq: "monthly",
      lastmod: new Date().toISOString(),
    };
  },
};
