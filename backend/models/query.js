const { postgres_db } = require('../config/connection_db');

/**
 * Helper function to execute a query and log the results.
 * @param {string} query - The SQL query to execute.
 * @param {object} replacements - The replacements for the query.
 */

async function executeQuery(query, replacements = {}) {
    try {
        const [results, metadata] = await postgres_db.query(query, { replacements });
        console.log(JSON.stringify(results, null, 2));
    } catch (error) {
        console.error(`Error executing query: ${query}`, error);
    }
}

module.exports = { executeQuery };
