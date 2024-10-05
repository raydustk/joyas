const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
    const rutaLog = path.join(__dirname, 'reporte_actividad.log');
    const filaLog = `${req.method} ===> ${req.originalUrl}\n`;
    fs.appendFile(rutaLog, filaLog, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de log:', err);
        }
        next();
    });
};

module.exports = logger;
