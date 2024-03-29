const ClientError = require('../../exceptions/ClientError');

class CollaaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      // sebelum menambahkan kolaborator pada catatan, pengguna yang mengajukan permintaan haruslah owner dari catatan tersebut.
      // untuk memastikan hal itu, kita perlu verifikasi request.auth.credentials.id dan noteId yang berada di request.payload menggunakan fungsi this._notesService.verifyNoteOwner
      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;
      await this._notesService.verifyNoteOwner(noteId, credentialId);
      // setelah memastikan pengguna adalah owner dari catatan, selanjutnya kita bisa aman untuk menambahkan kolaborasi pada catatan tersebut.
      // silakan panggil fungsi this._collaborationsService.addCollaboration dengan membawa nilai noteId dan userId
      const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId);
      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;
      await this._notesService.verifyNoteOwner(noteId, credentialId);
      await this._collaborationsService.deleteCollaboration(noteId, userId);
      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = CollaaborationsHandler;
