const e = require("express");
const Joi = require("joi");

const userSchema = Joi.object({
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    city: Joi.string().max(255).required(),
    language: Joi.string().max(255).required(),
});

const validateUser = (request, response, next) => {
    const { firstname, lastname, email, city, language } = request.body;
    const { error } = userSchema.validate(
        { firstname, lastname, email, city, language },
        { abortEarly: false }
    );

    if (error) {
        response.status(422).json({ validationErrors: error.details });
    }

    else {
        next();
    }
};

module.exports = validateUser;