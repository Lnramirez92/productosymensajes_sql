const { options_mariadb } = require("../options/mariadb/mariadb.js");
const knex = require("knex")(options_mariadb);

class contenedor_productos_mariadb {
    constructor(nombre_tabla) {
        this.nombre_tabla = nombre_tabla;
        knex.schema.hasTable(this.nombre_tabla)
            .then(exists => {
                if(!exists){
                    return knex.schema.createTable(this.nombre_tabla, table => {
                        table.increments("id");
                        table.string("title");
                        table.integer("price");
                        table.string("thumbnail");
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
        let producto = {};
        let listaProductos = [];
        await knex.from(this.nombre_tabla).select("*")
            .then(rows => {
                for(let row of rows) {
                    producto = {
                        title: row["title"],
                        price: row["price"],
                        thumbnail: row["thumbnail"]
                    }
                    listaProductos.push(producto);
                }
            })
            .catch( err => {
                console.log(err); throw err;
            })
            // .finally( () => {
            //     knex.destroy();
            // })
        return listaProductos;
    }

    async save(objeto){
        await knex("productos").insert(objeto)
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

    async update(prod, id) {
        await knex(this.nombre_tabla)
            .where({id: id})
            .update({
                title: prod["title"],
                price: prod["price"],
                thumbnail: prod["thumbnail"]
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
        let producto = {};
        await knex(this.nombre_tabla).select("*").where("id", "=", id)
            .then((rows) => {
                for(let row of rows){
                    producto = {
                        id: row.id,
                        title: row.title,
                        price: row.price,
                        thumbnail: row.thumbnail
                    };
                }
                console.log(`Producto obtenido: ${JSON.stringify(producto)}`);
            })
            .catch(err => {
                console.log(err); throw err;
            })
            // .finally(() => {
            //     knex.destroy();
            // })
            return producto;
    }

    async deleteById(id) {
        await knex(this.nombre_tabla).where("id", "=", id).del()
            .then(() => {
                console.log("Producto eliminado");
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
                console.log("Todos los procutos fueron eliminados");
            })
            .catch(err => {
                console.log(err); throw err;
            })
            // .finally(() => {
            //     knex.finally();
            // });
    }
}

module.exports = contenedor_productos_mariadb;