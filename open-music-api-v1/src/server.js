require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumValidator = require('./validator/albums');
const AlbumService = require('./services/postgres/AlbumsService');
const songs = require('./api/songs');
const SongValidator = require('./validator/songs');
const SongService = require('./services/postgres/SongsService');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        validator: AlbumValidator,
        service: albumService,
      },
    },
    {
      plugin: songs,
      options: {
        validator: SongValidator,
        service: songService,
      },
    },
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
