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

const putUser = (request, response) => {
    const { id } = request.params;
    const { firstname, lastname, email, city, language } = request.body;

    database
        .query(
            "UPDATE `users` SET `firstname` = ?, `lastname` = ?, `email` = ?, `city` = ?, `language` = ? WHERE `id` = ?",
            [firstname, lastname, email, city, language, id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                response.status(404).send("User not found");
                return;
            }
            const updatedUser = { id, firstname, lastname, email, city, language };
            return response.json(updatedUser);
        })
        .catch((error) => {
            if (!firstname || !lastname || !email || !city || !language) {
                return response.status(400).send("Missing required field");
            }
            if (error.code === "ER_DUP_ENTRY") {
                return response.status(409).send("User already exists");
            }
            console.error("Error updating the user", error.message);
            return response.status(500).send("Error updating the user");
        });
};

const deleteUser = (request, response) => {
    const { id } = request.params;

    database
        .query("DELETE FROM `users` WHERE `id` = ?", [id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                response.status(404).send("User not found");
                return;
            }
            response.status(204).send();
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send("Error deleting the user");
        });
};

module.exports = {
    getUsers,
    getUserById,
    postUser,
    putUser,
    deleteUser,
};