const express = require('express');
const passport = require('passport');
const MoviesService = require('../services/movies');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');
const buildMessage = require('../utils/buildMessage');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../utils/time');

// JWT strategy
require('../utils/auth/strategies/jwt');

const moviesApi = (app) => {
  const router = express.Router();
  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    async function (req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);

      const { tags } = req.query;

      try {
        const movies = await moviesService.getMovies({ tags });

        res.status(200).json({
          data: movies,
          message: buildMessage('movie', 'list'),
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);

      const { movieId } = req.params;

      try {
        const movies = await moviesService.getMovie({ movieId });

        res.status(200).json({
          data: movies,
          message: buildMessage('movie', 'retrieve'),
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:movie']),
    validationHandler(createMovieSchema),
    async function (req, res, next) {
      const { body: movie } = req;
      try {
        const createdMovieId = await moviesService.createMovie({ movie });

        res.status(201).json({
          data: createdMovieId,
          message: buildMessage('movie', 'create'),
        });
      } catch (err) {
        next(err);
      }
    }
  );

  // update
  router.put(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async function (req, res, next) {
      const { movieId } = req.params;
      const { body: movie } = req;

      try {
        const updateMovieId = await moviesService.updateMovie({
          movieId,
          movie,
        });

        res.status(200).json({
          data: updateMovieId,
          message: buildMessage('movie', 'update'),
        });
      } catch (err) {
        next(err);
      }
    }
  );

  // router.patch('/:movieId', async function (req, res, next) {
  //   const { movieId } = req.params;
  //   const { body: movie } = req;

  //   try {
  //     const updateMovieId = await moviesService.updatePatch({ movieId, movie });

  //     res.status(200).json({
  //       data: updateMovieId,
  //       message: 'resource updated',
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // });

  router.delete(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { movieId } = req.params;

      try {
        const deleteMovieId = await moviesService.deleteMovie({ movieId });

        res.status(200).json({
          data: deleteMovieId,
          message: buildMessage('movie', 'delete'),
        });
      } catch (err) {
        next(err);
      }
    }
  );
  router.patch;
};

module.exports = moviesApi;
