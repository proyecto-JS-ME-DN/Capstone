const express = require("express");
const mongoose = require("mongoose");
const app = express();

const uri = 'mongodb+srv://adminmotorsolution:admin1234@motorssolution.b7bc1rc.mongodb.net/?retryWrites=true&w=majority'

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Conectado a MongoDB");
    }
    catch (error) {
        console.error(error)
    }
}

connect();

app.listen(8000, () => {
    console.log("Servidor iniciado en puerto 8000");
})