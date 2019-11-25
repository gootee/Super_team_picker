// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'super_team_picker',
      username: 'john',
      password: 'al1son',
    },
    migrations: {
      tableName: 'migrations',
      directory: 'db',
    },
  },

};
