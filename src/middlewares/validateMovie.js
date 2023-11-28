const e = require("express");

const validateMovie = (request, response, next) => {
    const { title, director, year, color, duration } = request.body;
    const errors = [];

    if (typeof title !== "string" || title.length == null) {
        response.status(422).send("Title is required");
        errors.push({ field: "title", message: "Title is required" });
    } else if (title.length > 255) {
        response.status(422).send("Title should have less than 255 characters");
        errors.push({ field: "title", message: "Title should have less than 255 characters" });
    }

    if (typeof director !== "string" || director.length == null) {
        response.status(422).send("Director is required");
        errors.push({ field: "director", message: "Director is required" });
    } else if (director.length > 255) {
        response.status(422).send("Director should have less than 255 characters");
        errors.push({ field: "director", message: "Director should have less than 255 characters" });
    }

    if (typeof year !== "string" || year.length == null) {
        response.status(422).send("Year is required");
        errors.push({ field: "year", message: "Year is required" });
    } else if (year.length !== 4) {
        response.status(422).send("Year should have 4 characters");
        errors.push({ field: "year", message: "Year should have 4 characters" });
    }

    if (typeof color !== "string" || color.length == null) {
        response.status(422).send("Color is required");
        errors.push({ field: "color", message: "Color is required" });
    } else if (color.length > 255) {
        response.status(422).send("Color should have less than 255 characters");
        errors.push({ field: "color", message: "Color should have less than 255 characters" });
    }

    if (typeof duration !== "number" || duration == null) {
        response.status(422).send("Duration is required");
        errors.push({ field: "duration", message: "Duration is required" });
    } else if (duration < 0) {
        response.status(422).send("Duration should be a positive number");
        errors.push({ field: "duration", message: "Duration should be a positive number" });
    }

    if (errors.length > 0) {
        response.status(422).send(errors);
    }

    else {
        next();
    }
};

module.exports = validateMovie;