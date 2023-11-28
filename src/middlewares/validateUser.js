const e = require("express");

const validateUser = (request, response, next) => {
    const { firstname, lastname, email, city, language } = request.body;
    const errors = [];

    if (typeof firstname !== "string" || firstname.length == null) {
        response.status(422).send("Firstname is required");
        errors.push({ field: "firstname", message: "Firstname is required" });
    } else if (firstname.length > 255) {
        response.status(422).send("Firstname should have less than 255 characters");
        errors.push({ field: "firstname", message: "Firstname should have less than 255 characters" });
    }

    if (typeof lastname !== "string" || lastname.length == null) {
        response.status(422).send("Lastname is required");
        errors.push({ field: "lastname", message: "Lastname is required" });
    } else if (lastname.length > 255) {
        response.status(422).send("Lastname should have less than 255 characters");
        errors.push({ field: "lastname", message: "Lastname should have less than 255 characters" });
    }

    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-z]{2,3}/;

    if (typeof email !== "string" || email.length == null) {
        response.status(422).send("Email is required");
        errors.push({ field: "email", message: "Email is required" });
    } else if (!emailRegex.test(email)) {
        response.status(422).send("Email is not valid");
        errors.push({ field: "email", message: "Email is not valid" });
    } else if (email.length > 255) {
        response.status(422).send("Email should have less than 255 characters");
        errors.push({ field: "email", message: "Email should have less than 255 characters" });
    }

    if (typeof city !== "string" || city.length == null) {
        response.status(422).send("City is required");
        errors.push({ field: "city", message: "City is required" });
    } else if (city.length > 255) {
        response.status(422).send("City should have less than 255 characters");
        errors.push({ field: "city", message: "City should have less than 255 characters" });
    }

    if (typeof language !== "string" || language.length == null) {
        response.status(422).send("Language is required");
        errors.push({ field: "language", message: "Language is required" });
    } else if (language.length > 255) {
        response.status(422).send("Language should have less than 255 characters");
        errors.push({ field: "language", message: "Language should have less than 255 characters" });
    }

    if (errors.length > 0) {
        response.status(422).send(errors);
    }

    else {
        next();
    }
};

module.exports = validateUser;