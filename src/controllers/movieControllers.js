const database = require("../../database");

const getMovies = (request, response) => {
  database
    .query("SELECT * FROM `movies`")
    .then(([movies]) => {
      response.json(movies);
    })
    .catch(
      (error) => {
        console.error(error);
        response.status(500).send("Error retrieving data from database");
      }
    );
};

const getMovieById = (request, response) => {
  const { id } = request.params;

  database
    .query("SELECT * FROM `movies` WHERE `id` = ?", [id])
    .then(([movies]) => {
      if (movies.length === 0) {
        response.status(404).send("Movie not found");
        return;
      }
      return response.json(movies[0]);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send("Error retrieving data from database");
    });
};

module.exports = {
  getMovies,
  getMovieById,
};