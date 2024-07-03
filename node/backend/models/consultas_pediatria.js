import { executeQuery } from "./query.js";

async function GetPediatriaIPS(loccodigo, codigo_upl, codigo_upz, clasep) {
    let query = `
        SELECT con_p.identifica, con_p.codigo, con_p.nombre, 
                con_p.nombreserv, con_p.telefono, con_p.direccion,
                con_p.correoele, con_p.tipopr, con_p.localidad, con_p.clasep
        FROM pediatria.geo_consultorios_pediatria AS con_p
    `
    const conditions = [];
    const joins = []
    const replacements = {};
    
    if (clasep) {
        conditions.push('con_p.clasep = :clasep')
        replacements.clasep = clasep
    }

    if (loccodigo) {
        joins.push(`JOIN pediatria.geo_localidades 
                        AS localidades 
                        ON ST_Intersects(localidades.geom, con_p.geom)
        `
        );
        conditions.push('localidades.loccodigo = :loccodigo');
        replacements.loccodigo = loccodigo;
    }

    if (codigo_upl) {
        joins.push(`
            JOIN pediatria.geo_upl
            AS upl 
            ON ST_Intersects(upl.geom, con_p.geom)
        `
        );
        conditions.push('upl.codigo_upl = :codigo_upl');
        replacements.codigo_upl = codigo_upl;
    }

    if (codigo_upz) {
        joins.push(`
            JOIN pediatria.geo_upz
            AS upz
            ON ST_Intersects(upz.geom, con_p.geom)
        `
        );
        conditions.push('upz.codigo_upz = :codigo_upz');
        replacements.codigo_upz = codigo_upz
    }

    if (conditions.length > 0) {
        query += joins.join('\n') + ' WHERE ' + conditions.join(' AND ')
    }
    await executeQuery(query, replacements);
}

module.exports = { GetPediatriaIPS }

