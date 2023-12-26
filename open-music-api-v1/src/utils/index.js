const albumMapToDBModel = (album, songs) => ({
  id: album.id,
  name: album.name,
  year: album.year,
  songs,
});

module.exports = { albumMapToDBModel };
