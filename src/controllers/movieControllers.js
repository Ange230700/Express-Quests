const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    color: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    color: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const getMovies = (req, res) => {
  res.json(movies);
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  const movie = movies.find((movie) => movie.id === id);

  if (movie != null) {
    res.json(movie);
  } else {
    res.status(404).send("Not Found");
  }
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

const putMovie = (request, response) => {
  const { id } = request.params;
  const { title, director, year, color, duration } = request.body;

  database
    .query(
      "UPDATE `movies` SET `title` = ?, `director` = ?, `year` = ?, `color` = ?, `duration` = ? WHERE `id` = ?", [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        response.status(404).send("Movie not found");
        return;
      }

      response.status(204).send("Movie updated successfully");
    })
    .catch((error) => {
      response.status(500).send("Error updating movie");
    });
}

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  putMovie,
};
