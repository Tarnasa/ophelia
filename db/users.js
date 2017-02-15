"use strict";

const vars = require('../vars');


const knex = require('knex')({
    client: 'pg',
    connection: {
        database: "mmai",
        host: vars.DB_HOST,
        password: vars.DB_PASS,
        port: vars.DB_PORT,
        user: vars.DB_USER
    }
});


/**
 * insertUser - inserts a registered user into the Database
 * @param {string} name - Username of the user.
 * @param {string} fullName - User's full (actual) name
 * @param {string} email - Email for the user's account.
 * @param {string} shirtSize - Available options are 's' to 'xxl'.
 * @param pizzaChoice - Available options are 'cheese', 'pepperoni', 'bacon', and 'chicken'.
 * @param isStudent - Defaults to True in the DB, but can be set False.
 */
function insertUser(name, fullName, email, shirtSize, pizzaChoice, isStudent) {
    return new Promise((resolve, reject)=>{
        knex('user').insert({
            name: name,
            full_name: fullName,
            email: email,
            shirt_size: shirtSize,
            pizza_choice: pizzaChoice,
            is_student: isStudent
        }).then(()=>{ // On success
            resolve("successful");
        }).catch((err)=>{ // On failure
            reject(err);
        });
    })

}

module.exports = {
    insertUser
};
