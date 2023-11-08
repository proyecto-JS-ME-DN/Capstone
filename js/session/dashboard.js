const { spawn } = require('child_process');
const { getLoginData, getContactoData } = require('../../js/consulta/consultas');

async function dashboardRoute(req, res) {
  const loginData = await getLoginData();
  const contactoData = await getContactoData();
  const python = spawn('python', ['python/procesadata.py']);
  let dataToSend;

  python.stdout.on('data', function (data) {
      dataToSend = JSON.parse(data);
  });

  python.stdin.write(JSON.stringify({login: loginData, contacto: contactoData}));
  python.stdin.end();

  python.on('close', (code) => {
      if (req.session.loggedin) {
          res.render("dashboard", {
              dashboard: true,
              name: req.session.name,
              data: dataToSend
          });
      } else {
          res.render("index", {
              dashboard: false,
              name: "Debe iniciar sesión",
              alert: true,
              alertTitle: "Debe iniciar sesión como administrador",
              alertMessage: "Debe iniciar sesión como administrador",
              alertIcon: "error",
              showConfirmButton: false,
              timer: 1000,
              ruta: "index",
          });
      }
  });
}

module.exports = dashboardRoute;
