var pg = require('pg');
var conString = "postgres://zplgxrfq:APvDvrAQdcb52ADYBWT_P2OUH3UaP-Rc@motty.db.elephantsql.com/zplgxrfq"
var client = new pg.Client(conString);

client.connect(function(err) {
  if(err) {
    return console.error('No se puede conectar con Postgre', err);
  }
  client.query('select * from categoria_prod', function(err, result) {
    if(err) {
      return console.error('error al ejecutar la query', err);
    }
    console.log(result.rows);
    client.end();
  });
});





