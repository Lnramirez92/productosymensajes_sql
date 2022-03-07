const express = require("express");
const { Server: HttpServer} = require("http");
const { Server: IOServer } = require("socket.io");

const contenedor_productos_mariadb = require('../contenedores/contenedor_productos_mariadb.js');
const contenedor_mensajes_sqlite3 = require('../contenedores/contenedor_mensajes_sqlite3.js');
const contenedorProductos = new contenedor_productos_mariadb("productos");
const contenedorMensajes = new contenedor_mensajes_sqlite3("mensajes");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configuración del socket
io.on("connection", async socket => {
    console.log("Se ha conectado un cliente");

    socket.emit("productos", await contenedorProductos.getAll()); //Cargo los productos

    //Actualizo los productos
    socket.on("update", async producto => { 
        contenedorProductos.save(producto);
        io.sockets.emit("productos", await contenedorProductos.getAll());
    });

    //Cargo los mensajes
    socket.emit("mensajes", await contenedorMensajes.getAll());
    
    //Actualizo los mensajes
    socket.on("nuevoMensaje", async mensaje => {
        mensaje.fyh = new Date().toLocaleString();
        await contenedorMensajes.save(mensaje);
        io.sockets.emit("mensajes", await contenedorMensajes.getAll());
    });
});


const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${connectedServer.address().port}`);
});
connectedServer.on("error", error => console.log(`Error en el servidor ${error}`));