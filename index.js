const express = require('express')
const app = express()
const logger = require('./logger');

app.use(logger);
app.listen(3000, console.log('Server Joyas ON'))

const { obtenerJoyas, obtenerJoyasPorFiltro, prepararHATEOAS } = require('./consultas')



//GET joyas => HATEOS de todas las joyas en tabla inventario
app.get('/joyas', async(req,res)=>{
    try{
        const joyas = await obtenerJoyas(req.query)
        const HATEOAS = await prepararHATEOAS(joyas)
        res.json(HATEOAS)
    }catch(error){
        console.log('Error en GET /joyas:', error);
        res.status(500).json({ error: 'Error al obtener joyas' });
    }

})

//GET joyas/filtros => recibe parametros de filtrado en QueryString
app.get('/joyas/filtros',async(req,res)=>{
    try{
        const queryStrings = req.query
        const joyas = await obtenerJoyasPorFiltro(queryStrings)    
        res.json(joyas)
    }catch(error){
        console.log('Error en GET /joyas/filtros:', error);
        res.status(500).json({ error: 'Error al obtener joyas por filtro' });
    }

})

//Rutas que no existen
app.get("*", (req,res) => {
    res.status(404).send("Ruta inexistente")
})