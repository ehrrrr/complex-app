const usersConnection = require('../db').collection('users');
const validator = require('validator');

const User = function (data) {
    this.data = data;
    this.errors = [];
}

User.prototype.cleanUp = function() {
    if(typeof(this.data.username) !== 'string') {this.data.username = "" }
    if(typeof(this.data.email) !== 'string') {this.data.email = "" }
    if(typeof(this.data.password) !== 'string') {this.data.password = "" }

    // get rid of any bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function() {
    if(this.data.username === "") { this.errors.push("You must provide a username") }
    if(this.data.username !== "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
    if(!validator.isEmail(this.data.email)) { this.errors.push("You must provide a valid email") }
    if(this.data.password === "") { this.errors.push("You must provide a password") }
    if(this.data.password.length > 0 && this.data.password.length < 12) { this.errors.push("Password must be at least 12 characters.") }
    if(this.data.password.length > 100) { this.errors.push("Password cannot exceed 100 characters.") }
    if(this.data.username.length > 0 && this.data.username.length < 3) { this.errors.push("Username must be at least 3 characters.") }
    if(this.data.username.length > 30) { this.errors.push("Username cannot exceed 30 characters.") }
    
}

User.prototype.register = function() {
    // Step #1: Validate user data
    this.cleanUp();
    this.validate();
    
    // Step #2: Only if there are no validation error
    // then save the user into a database
    if(!this.errors.length) {
        usersConnection.insertOne(this.data);
    }
};

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        usersConnection.findOne({username: this.data.username}).then((attemptedUser)=>{
            if(attemptedUser && attemptedUser.password === this.data.password) {
                resolve('Congrats');
            } else {
                reject('Invalid username and/or password');
            }
        }).catch(function(){
            reject('Please try again later.')
        });
    });
};

module.exports = User;