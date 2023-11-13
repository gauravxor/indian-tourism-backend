const mongoose = require('mongoose');

/**
 * Create a schema to store the user credentials like usesrid,locationid,
 * number of children, number of adults and date of visit.
 */

const credentialsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'users',
    },
    password: {
        type: String,
        required: true,
    },
});

const credentialsModel = mongoose.model('credentials', credentialsSchema);

module.exports = credentialsModel;
