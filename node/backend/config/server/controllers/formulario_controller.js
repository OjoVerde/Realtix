import { executeQuery } from '../../../models/query.js' 

export const getLocalidades =async(req, res)=>{

    try{
        const query = `
        SELECT loccodigo, locnombre 
        FROM pediatria.geo_localidades 
        ORDER BY loccodigo ASC
    `;
    let data = await executeQuery(query);

    res.status(200).json({ok:true, body: data})

    }catch(err){

        console.log(err)

        res.status(500).json({ok:false, message: err})
        
    }

}

export const getUPL =async(req, res)=>{

    try{
        const query = `
        SELECT nombre_upl, codigo_upl, loccodigo 
        FROM pediatria.geo_upl 
        ORDER BY codigo_upl ASC
    `;
    let data = await executeQuery(query);

    res.status(200).json({ok:true, body: data})

    }catch(err){

        console.log(err)

        res.status(500).json({ok:false, message: err})
        
    }

}

export const getUPZ =async(req, res)=>{

    try{
        const query = `
        SELECT codigo_upz, nombre_upz, loccodigo 
        FROM pediatria.geo_upz 
        ORDER BY codigo_upz ASC
    `;
    let data = await executeQuery(query);

    res.status(200).json({ok:true, body: data})

    }catch(err){

        console.log(err)

        res.status(500).json({ok:false, message: err})
        
    }
    
}

export const UPLIntersectsLocalidad =async(req, res)=>{

    try{

        let {loccodigo} = req.query
        const query = `
        SELECT upl.codigo_upl, upl.nombre_upl, upl.loccodigo
        FROM pediatria.geo_upl AS upl
        JOIN pediatria.geo_localidades AS localidades ON ST_Intersects(localidades.geom, ST_Centroid(upl.geom))
        WHERE localidades.loccodigo = :loccodigo
        ORDER BY upl.codigo_upl ASC;
        `;
    let data = await executeQuery(query, { loccodigo });

    res.status(200).json({ok:true, body: data})

    }catch(err){

        console.log(err)

        res.status(500).json({ok:false, message: err})
        
    }
    
}

export const UPZIntersectsLocalidadUPL =async(req, res)=>{

    try{

        let {loccodigo, codigo_upl} = req.query
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

    let data = await executeQuery(query, replacements);

    res.status(200).json({ok:true, body: data})

    }catch(err){

        console.log(err)

        res.status(500).json({ok:false, message: err})
        
    }
}

export const GetPediatriaIPS =async(req, res)=>{

    try{

        let {loccodigo, codigo_upl, codigo_upz, clasep} = req.query

      
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


    let data = await executeQuery(query, replacements);

    res.status(200).json({ok:true, body: data})

    }catch(err){

        console.log(err)

        res.status(500).json({ok:false, message: err})
        
    }
}

export const NewIPS =async(req, res)=>{

    try{
    
        let {body} = req
        console.log(body)
        const query = `
        INSERT INTO pediatria.geo_consultorios_pediatria(
        identifica, codigo, nombre, telefono, direccion, correoele, clasep, geom)
        VALUES (:identify, :code, :name, :tel, :address, :email, :inst_type, ST_AsBinary(ST_Point(:lon, :lat)));
    `;
    let data = await executeQuery(query, body);
    res.status(200).json({ok:true, body: data})

    }catch(err){

        console.log(err)

        res.status(500).json({ok:false, message: err})
        
    }

}