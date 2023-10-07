{
    "version": 2,
    "builds": [
        { "src": "*.js","use": "@vercel/node" },
      ],
      "routes": [
        { "src": "/api/.*", "dest": "elephantsql.js" }, // Ruta para la API
        { "src": "/(.*)", "dest": "$1" } // Ruta para archivos estáticos en la raíz
      ]
}
