const database = require("../../database");

const getUsers = (request, response) => {
    database
        .query("SELECT * FROM `users`")
        .then(([users]) => {
            response.json(users);
        })
        .catch(
            (error) => {
                console.error(error);
                response.status(500).send("Error retrieving data from database");
            }
        );
};

const getUserById = (request, response) => {
    const { id } = request.params;

    database
        .query("SELECT * FROM `users` WHERE `id` = ?", [id])
        .then(([users]) => {
            if (users.length === 0) {
                response.status(404).send("User not found");
                return;
            }

            response.json(users[0]);
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send("Error retrieving data from database");
        })
}

const postUser = (request, response) => {
    const { firstname, lastname, email, city, language } = request.body;

    database
        .query(
            "INSERT INTO `users` (`firstname`, `lastname`, `email`, `city`, `language`) VALUES (?, ?, ?, ?, ?)", [firstname, lastname, email, city, language]
        )
        .then((result) => {
            response.status(201).send({ id: result.insertId });
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send("Error adding user to database");
        });
}

module.exports = {
    getUsers,
    getUserById,
    postUser,
}