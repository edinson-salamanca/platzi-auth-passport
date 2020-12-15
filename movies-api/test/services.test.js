const assert = require('assert');
const proxyquire = require('proxyquire');

const {
  MongoLibMock,
  getAllStub,
  getStub,
  createStub,
  updateStub,
  deleteStub,
} = require('../utils/mocks/mongoLib');

const { moviesMock } = require('../utils/mocks/movies');

describe('services - movies', function () {
  const MoviesServices = proxyquire('../services/movies', {
    '../lib/mongo': MongoLibMock,
  });

  const moviesService = new MoviesServices();

  describe('when getMovies method is called', async function () {
    it('should call the getall MongoLib method', async function () {
      await moviesService.getMovies({});
      assert.strictEqual(getAllStub.called, true);
    });

    it('should return an array of movies', async function () {
      const result = await moviesService.getMovies({});
      const expected = moviesMock;
      assert.deepStrictEqual(result, expected);
    });
  });

  describe('when getMovie method is called', async function () {
    it('should call the get MongoLib method', async function () {
      await moviesService.getMovie({});
      assert.strictEqual(getStub.called, true);
    });

    it('should return requested movie', async function () {
      const mocksMovieId = 'd2a4a062d25641bbb1b29d91';
      const result = await moviesService.getMovie({ movieId: mocksMovieId });
      const expect = moviesMock[0];
      assert.deepStrictEqual(result, expect);
    });

    it('should return an object of movie filtered', async () => {
      const result = await moviesService.getMovies({ tags: 'Terror' });
      const expected = moviesMock.filter((movie) => movie.tags === 'Drama');
      assert.deepStrictEqual(result, expected);
    });
  });
  describe('when createMovie method is called', async function () {
    it('should call create MongoLib method', async () => {
      await moviesService.createMovie({});
      assert.strictEqual(createStub.called, true);
    });

    it('shuld return an id of movie created', async () => {
      const resultId = await moviesService.createMovie({});
      const expected = moviesMock[0].id;
      assert.deepStrictEqual(resultId, expected);
    });
  });
  describe('when updateMovie method is called', async function () {
    it('should call update MongoLib method', async function () {
      moviesService.updateMovie({});
      assert.strictEqual(updateStub.called, true);
    });

    it('should return an id to updated moive', async function () {
      const mocksMovieId = '5fb1d49f97fe700343c9da89';
      const result = await moviesService.updateMovie({
        movieId: mocksMovieId,
        movie: {},
      });
      const expected = moviesMock[0].id;
      assert.deepStrictEqual(result, expected);
    });
  });

  describe('when deleteMovie method is called', async () => {
    it('should call delete MongoLib method', async () => {
      await moviesService.deleteMovie({});
      assert.strictEqual(deleteStub.called, true);
    });

    it('should return an id of movie deleted', async () => {
      const mocksMovieId = 'd2a4a062-d256-41bb-b1b2-9d915af6b75e';
      const result = await moviesService.deleteMovie({
        movieId: mocksMovieId,
      });
      const expected = moviesMock[0].id;
      assert.strictEqual(result, expected);
    });
  });
});
