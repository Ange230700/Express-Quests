const database = require("../../database");

const getMovies = (request, response) => {
  database
    .query("SELECT * FROM `movies`")
    .then(([movies]) => {
      response.json(movies);
    })
    .catch(
      (error) => {
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

      response.json(movies[0]);
    })
    .catch((error) => {
      response.status(500).send("Error retrieving data from database");
    });
};

const postMovie = (request, response) => {
  const { title, director, year, color, duration } = request.body;

  database
    .query(
      "INSERT INTO `movies` (`title`, `director`, `year`, `color`, `duration`) VALUES (?, ?, ?, ?, ?)", [title, director, year, color, duration]
    )
    .then((result) => {
      response.status(201).send({ id: result.insertId });
    })
    .catch((error) => {
      response.status(500).send("Error adding movie to database");
    });
}

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
};
