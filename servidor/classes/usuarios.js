/**
 * Clase donde se manejarán los usuarios conectados
 */

class Usuarios {

    constructor() {
        this.usuarios = []
    }

    /**
     * Agrega un usuario
     * @param {string} id 
     * @param {string} nombre 
     */
    add(id, nombre, sala) {
        this.usuarios.push({ id, nombre, sala });
        return this.usuarios;
    }

    /**
     * Elimina un usuario de la colección. 
     * Devuelve los datos de la persona borrada (si existía).
     * @param {string} id Id del usuario a eliminar
     */
    del(id) {
        const personaBorrada = this.get(id)
        this.usuarios = this.usuarios.filter(function(u){ return u.id !== id});
        return personaBorrada;
    }

    /**
     * Obtener el usuario que contenga el id pasado 
     * por parametro
     * @param {string} id Id del usuario a obtener
     */
    get(id) {
        return this.usuarios.filter(function (u) { return u.id === id })[0];
    }

    /**
     * Devuelve todos los usuarios
     */
    getAll(){
        return this.usuarios;
    }


    /**
     * Devuelve todos los usuario de una sala en concreto
     * @param {*} sala 
     */
    getBySala(sala){
        return this.usuarios.filter(function (u) { return u.sala === sala });
    }

}

module.exports = {
    Usuarios
}