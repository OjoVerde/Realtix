import { executeQuery } from "./query";
/**
* Get all localidades.
*/
async function GetLocalidades() {
    const query = `
        SELECT loccodigo, locnombre 
        FROM pediatria.geo_localidades 
        ORDER BY loccodigo ASC
    `;
    await executeQuery(query);
}

/**
* Get all UPL.
*/
async function GetUPL() {
    const query = `
        SELECT nombre_upl, codigo_upl, loccodigo 
        FROM pediatria.geo_upl 
        ORDER BY codigo_upl ASC
    `;
    await executeQuery(query);
}

/**
* Get all UPZ.
*/
async function GetUPZ() {
    const query = `
        SELECT codigo_upz, nombre_upz, loccodigo 
        FROM pediatria.geo_upz 
        ORDER BY codigo_upz ASC
    `;
    await executeQuery(query);
}

/**
* Filter the UPL data with Localidad code.
*/
async function UPLIntersectsLocalidad(loccodigo) {
    if (typeof loccodigo !== 'string') {
        throw new Error('loccodigo debe ser una cadena de texto.');
    }


    const query = `
        SELECT upl.codigo_upl, upl.nombre_upl, upl.loccodigo
        FROM pediatria.geo_upl AS upl
        JOIN pediatria.geo_localidades AS localidades ON ST_Intersects(localidades.geom, ST_Centroid(upl.geom))
        WHERE localidades.loccodigo = :loccodigo
        ORDER BY upl.codigo_upl ASC;
        `;
    await executeQuery(query, { loccodigo });
}

/**
* Filter the UPZ data with Localidad and UPL code.
*/
async function UPZIntersectsLocalidadUPL(loccodigo, codigo_upl) {

    let query = `
        SELECT upz.codigo_upz, upz.nombre_upz, upz.loccodigo, upz.codigo_upl
        FROM pediatria.geo_upz AS upz
    `;

    const conditions = [];
    const joins = []
    const replacements = {};

    if (loccodigo) {
        joins.push(`
            JOIN pediatria.geo_localidades 
            AS localidades 
            ON ST_Intersects(localidades.geom, ST_Centroid(upz.geom))
        `);
        conditions.push('localidades.loccodigo = :loccodigo');
        replacements.loccodigo = loccodigo;
    }

    if (codigo_upl) {
        joins.push(`
            JOIN pediatria.geo_upl 
            AS upl 
            ON ST_Intersects(upl.geom, ST_Centroid(upz.geom))
        `);
        conditions.push('upl.codigo_upl = :codigo_upl');
        replacements.codigo_upl = codigo_upl;
    }
    
    if (conditions.length > 0) {
        query += joins.join('\n') + ' WHERE ' + conditions.join(' AND ')
    }
    await executeQuery(query, replacements)
}

module.exports = { GetLocalidades, GetUPL, GetUPZ, UPLIntersectsLocalidad, UPZIntersectsLocalidadUPL };