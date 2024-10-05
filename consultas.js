const { Pool } = require("pg")

//formateo para evitar SQL-Injection
const format = require('pg-format');

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "1234",
    database: "joyas",
    allowExitOnIdle: true
})

const prepararHATEOAS = (joyas) => {
    const resultados = joyas.map((j) => ({
        name: j.nombre,
        href: `/joyas/joya/${j.id}`
    })).slice(0, 4);

    const total = joyas.length;
    const stockTotal = joyas.reduce((acc, j) => acc + j.stock, 0);
    return { total, stockTotal, resultados };
};

const obtenerJoyas = async({ limits = 10, order_by="id_ASC", page=1 }) =>{
    try{
        const offset = Math.abs((page-1)*limits)
        const [campo, direccion] = order_by.split("_")
        let consulta = "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s"
        const consultaFormateada = format(consulta,campo,direccion,limits,offset)
        const {rows: joyas} = await pool.query(consultaFormateada)
        return joyas
    }catch(error){
        console.log('Error al obtener joyas:', error);
        throw error;
    }

}

const obtenerJoyasPorFiltro = async({precio_max,precio_min,categoria,metal})=>{
    try{
        let filtros = []
        if(precio_max) filtros.push(`precio <= ${precio_max}`)
        if(precio_min) filtros.push(`precio > ${precio_min}`)
        if(categoria) filtros.push(`categoria = '${categoria}'`)
        if(metal) filtros.push(`metal = '${metal}'`)
    
        let consulta = "SELECT * FROM inventario"
    
        if(filtros.length > 0){
            filtros = filtros.join(" AND ")
            consulta += ` WHERE ${filtros}`
        }
        console.log(consulta)
        const { rows: joyas } = await pool.query(consulta)
        return joyas
    }catch(error){
        console.log('Error al obtener joyas por filtro:', error);
        throw error;
    }

}

module.exports = { obtenerJoyas, obtenerJoyasPorFiltro, prepararHATEOAS }