const { options_sqlite3 } = require("../options/sqlite3/sqlite3.js");
const knex = require("knex")(options_sqlite3);

class contenedor_mensajes_sqlite3 {
    constructor(nombre_tabla) {
        this.nombre_tabla = nombre_tabla;
        knex.schema.hasTable(this.nombre_tabla)
            .then(exists => {
                if(!exists){
                    return knex.schema.createTable(this.nombre_tabla, table => {
                        table.increments("id");
                        table.string("autor");
                        table.string("fyh");
                        table.string("texto");
                    })
                    .then( () => {
                        console.log(`Table ${this.nombre_tabla} created`); 
                    }) 
                    .catch( (err) => {
                        console.log(err); throw err;
                    })
                }
            })
    }
    
    async getAll(){
        let mensaje = {};
        let listaMensajes = [];
        await knex.from(this.nombre_tabla).select("*")
            .then(rows => {
                for(let row of rows) {
                    mensaje = {
                        autor: row["autor"],
                        fyh: row["fyh"],
                        texto: row["texto"]
                    }
                    listaMensajes.push(mensaje);
                }
            })
            .catch( err => {
                console.log(err); throw err;
            })
            // .finally( () => {
            //     knex.destroy();
            // })
        return listaMensajes;
    }

    async save(objeto){
        await knex(this.nombre_tabla).insert(objeto)
            .then( () => {
                console.log("Data inserted");
            })
            .catch(err => {
                console.log(err); throw err;
            })
            // .finally( () => {
            //     knex.destroy();
            // })
    }

    async update(msj, id) {
        await knex(this.nombre_tabla)
            .where({id: id})
            .update({
                autor: msj["autor"],
                fyh: msj["fyh"],
                texto: msj["texto"]
            })
            .then(() => {
                console.log("Registro actualizado");
            })
            .catch(err => {
                console.log(err); throw err;
            })
            // .finally(() => {
            //     knex.destroy();
            // });
    }

    async getById(id) {
        let mensaje = {};
        await knex(this.nombre_tabla).select("*").where("id", "=", id)
            .then((rows) => {
                for(let row of rows){
                    mensaje = {
                        id: row.id,
                        autor: row.autor,
                        fyh: row.fyh,
                        texto: row.texto
                    };
                }
                console.log(`Mensaje obtenido: ${JSON.stringify(mensaje)}`);
            })
            .catch(err => {
                console.log(err); throw err;
            })
            // .finally(() => {
            //     knex.destroy();
            // })
            return mensaje;
    }

    async deleteById(id) {
        await knex(this.nombre_tabla).where("id", "=", id).del()
            .then(() => {
                console.log("Mensaje eliminado");
            })
            .catch(err => {
                console.log(err); throw err;
            })
            // .finally(() => {
            //     knex.destroy();
            // });
    }

    async deleteAll() {
        await knex(this.nombre_tabla).del()
            .then(() => {
                console.log("Todos los mensajes fueron eliminados");
            })
            .catch(err => {
                console.log(err); throw err;
            })
            // .finally(() => {
            //     knex.finally();
            // });
    }
}

module.exports = contenedor_mensajes_sqlite3;