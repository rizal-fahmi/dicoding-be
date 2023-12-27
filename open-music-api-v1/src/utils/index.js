const albumMapToDBModel = (album, songs) => ({
  id: album.id,
  name: album.name,
  year: album.year,
  songs,
});

const songMapToDBModel = (data) => ({
  id: data.id,
  title: data.title,
  year: data.year,
  performer: data.performer,
  genre: data.genre,
  duration: data.duration,
  albumId: data.album_id,
});

module.exports = { albumMapToDBModel, songMapToDBModel };
