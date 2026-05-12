const sitemap = () => {
  return [
    {
      url: 'https://proposalhero.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
};

module.exports = sitemap;
module.exports.default = sitemap;