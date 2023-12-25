const albumMapToDBModel = (data, songs) => ({
  id: data.id,
  name: data.name,
  year: data.year,
  songs: songs,
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