import {Sequelize} from 'sequelize'

export const postgres_db = new Sequelize('ips_bogota', 'web_editor_user', 'Fcf#Vo43vFk&iCfi', {
    dialect: 'postgres',
    host: '192.168.68.2',
    port: 5432
});

export async function testConnection() {
    try {
        await postgres_db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await postgres_db.close();
    }
}

// module.exports = { postgres_db, testConnection };
