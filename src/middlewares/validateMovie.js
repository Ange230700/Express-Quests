const validateMovie = (request, response, next) => {
    const { title, director, year, color, duration } = request.body;
    const errors = [];

    if (typeof title !== "string" || title.length == null) {
        response.status(422).send("Title is required");
        // return;
    }

    if (typeof director !== "string" || director.length == null) {
        response.status(422).send("Director is required");
        // return;
    }

    if (typeof year !== "string" || year.length == null) {
        response.status(422).send("Year is required");
        // return;
    }

    if (typeof color !== "string" || color.length == null) {
        response.status(422).send("Color is required");
        // return;
    }

    if (typeof duration !== "number" || duration == null) {
        response.status(422).send("Duration is required");
        // return;
    }

    if (errors.length > 0) {
        response.status(422).send(errors.join(", "));
        // return;
    }

    else {
        next();
    }
};

module.exports = {
    validateMovie,
};