require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
// notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService(collaborationsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // 1. setelah plugin Jwt didaftarkan, kini Hapi plugin sudah mengenal schema dengan nama ‘jwt’
  // 2. selanjutnya, membuat strategies yang mengimplementasikan schema ‘jwt’ tersebut
  // 3. untuk menetapkan authentication strategy pada Hapi server, gunakan fungsi server.auth.strategy
  // 4. fungsi tersebut menerima 3 parameter yakni strategy name, schema name, dan options
  // 5. strategy name: merupakan nama dari strategi yang akan kita buat, nantinya strategy name akan digunakan untuk menetapkan authentication pada routes.
  // 6. schema name: merupakan nama skema yang akan digunakan pada pembuatan strategy, di sini kita memberikan nilai ‘jwt’ untuk menggunakan strategi jwt dari @hapi/jwt.
  // 7. options: merupakan objek yang menentukan perilaku atau behaviour dijalankannya authentication schema. Pada schema jwt, kita perlu menetapkan:
  // 7.1. keys: merupakan key atau kunci dari token JWT-nya (di mana merupakan access token key)
  // 7.2.verify: merupakan objek yang menentukan seperti apa signature token JWT harus diverifikasi. Di objek ini kita menetapkan:
  // 7.2.1. aud: nilai audience dari token, bila kita diberi nilai false itu berarti aud tidak akan diverifikasi.
  // 7.2.2. iss: nilai issuer dari token, bila kita diberi nilai false itu berarti iss tidak akan diverifikasi.
  // 7.2.3. sub: nilai subject dari token, bila kita diberi nilai false itu berarti sub tidak akan diverifikasi.
  // 7.2.4. maxAgeSec: nilai number yang menentukan umur kedaluwarsa dari token. Penentuan kedaluwarsa token dilihat dari nilai iat yang berada di payload token.
  // 7.3. validate: merupakan fungsi yang membawa artifacts token. Fungsi ini dapat kita manfaatkan untuk menyimpan payload token--yang berarti kredensial pengguna--pada request.auth.
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
