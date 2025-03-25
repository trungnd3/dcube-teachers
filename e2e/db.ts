import mysql from 'mysql2';

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

// connection.end();

class DBClient {
  private _client = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  query(queryString: string) {
    return new Promise<mysql.QueryResult>((resolve, reject) => {
      this._client.query(queryString, (err, results) => {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      });
    });
  }

  close() {
    return new Promise<void>((resolve, reject) => {
      this._client.end((err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }
}

export const dbClient = new DBClient();
