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
            return response.json(users[0]);
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send("Error retrieving data from database");
        })
};

const postUser = (request, response) => {
    const { firstname, lastname, email, city, language } = request.body;

    database
        .query(
            "INSERT INTO `users` (`firstname`, `lastname`, `email`, `city`, `language`) VALUES (?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language]
        )
        .then(([result]) => {
            const id = result.insertId;
            const createdUser = { id, firstname, lastname, email, city, language };
            return response.status(201).json(createdUser);
        })
        .catch((error) => {
            if (!firstname || !lastname || !email || !city || !language) {
                return response.status(400).send("Missing required field");
            }
            if (error.code === "ER_DUP_ENTRY") {
                return response.status(409).send("User already exists");
            }
            console.error("Error saving the user", error.message);
            return response.status(500).send("Error saving the user");
        });
};

module.exports = {
    getUsers,
    getUserById,
    postUser,
};