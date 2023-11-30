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

const postMovie = (request, response) => {
  const { title, director, year, color, duration } = request.body;

  database
    .query(
      "INSERT INTO `movies` (`title`, `director`, `year`, `color`, `duration`) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      const id = result.insertId;
      const createdMovie = { id, title, director, year, color, duration };
      return response.status(201).json(createdMovie);
    })
    .catch((error) => {
      if (error.code === "ER_BAD_NULL_ERROR") {
        return response.status(400).send("Missing required field");
      }
      console.error(error);
      return response.status(500).send("Error saving the movie");
    });
};

const putMovie = (request, response) => {
  const { id } = request.params;
  const { title, director, year, color, duration } = request.body;

  database
    .query(
      "UPDATE `movies` SET `title` = ?, `director` = ?, `year` = ?, `color` = ?, `duration` = ? WHERE `id` = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        response.status(404).send("Movie not found");
        return;
      }
      const updatedMovie = { id, title, director, year, color, duration };
      return response.json(updatedMovie);
    })
    .catch((error) => {
      if (error.code === "ER_BAD_NULL_ERROR") {
        return response.status(400).send("Missing required field");
      }
      console.error(error);
      return response.status(500).send("Error updating the movie");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  putMovie,
};