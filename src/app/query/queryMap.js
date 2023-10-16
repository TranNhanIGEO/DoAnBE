const convert_vi_to_en = require('../../utils/vi_to_en')
const replace_regexp = require('../../utils/replace_regexp')

const getAddress = (address) => {
    switch (address) {
        case undefined:
            return `
                SELECT diachi
                FROM sonhadacap
            `   
    
        default:
            return `
                SELECT lat, lon 
                FROM sonhadacap 
                WHERE diachi LIKE '%${address}%'
            `
    }
}
const getMinScore = (layer) => {
    switch (layer) {
        case '00LTKC00':
            return `
                SELECT MIN(nv1_ht)
                FROM diemchuan_lopthuong
            `

        case '00LTHC00':
            return `
                SELECT MIN(nv1_ht)
                FROM diemchuan_loptichhop
            `

        default:
            return `
                SELECT MIN(nv1_ht)
                FROM diemchuan_lopchuyen
            `
    }

}
const getSchoolName = (school) => {
    switch (school) {
        case undefined:
            return `
                SELECT tentruong, diachi, trangweb, ST_AsGeoJSON(ST_Transform(geom, 4326)):: jsonb as json
                FROM danhsachtruonghoc
            `
    
        default:
            return `
                SELECT ST_AsGeoJSON(ST_Transform(geom, 4326)):: jsonb as json
                FROM danhsachtruonghoc
                WHERE vi_to_en(tentruong) = '${replace_regexp(convert_vi_to_en(school))}'
            `
    }
}
const getLayerStatistic = (layer) => {
    return `
        SELECT b.tentruong
        FROM ${layer} a
        JOIN danhsachtruonghoc b
        ON a.matruong = b.matruong
    `
}
const renderChart = ({layer, school}) => {  
    return `
        SELECT a.*, b.tentruong
        FROM ${layer} a
        JOIN danhsachtruonghoc b
        ON a.matruong = b.matruong
        WHERE vi_to_en(b.tentruong) = '${replace_regexp(convert_vi_to_en(school))}'
    `
}
const advisingEnrollment = ({layer, distance, score, longitude, latitude}) => {
    switch (layer) {
        case '00LTKC00':
            return `
                SELECT a.matruong, a.nv1_ht, a.nv2_ht, a.nv3_ht, b.tentruong, c.ctieu_ht,
                    ST_AsGeoJSON(ST_Intersection(b.geom, buffer))::json as pointJson, 
                    ST_AsGeoJSON(buffer)::json as bufferJson
                FROM 
                    (SELECT ST_Buffer((ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)::geography), ${distance})::Geometry as buffer) cliped, 
                    diemchuan_lopthuong a
                JOIN danhsachtruonghoc b ON a.matruong = b.matruong
                JOIN chitieu_lopthuong c ON b.matruong = c.matruong
                WHERE 
                    a.maloaihinh = '${layer}'
                    AND nv1_ht <= ${score}
                GROUP BY a.matruong, a.nv1_ht, a.nv2_ht, a.nv3_ht, b.tentruong, b.geom, buffer, c.ctieu_ht
                HAVING ST_AsGeoJSON(ST_Intersection(b.geom, buffer)) <> '{"type":"Point","coordinates":[]}'
                ORDER BY a.nv1_ht DESC
                LIMIT 20
            `

        case '00LTHC00':
            return `
                SELECT a.matruong, a.nv1_ht, a.nv2_ht, b.tentruong, c.ctieu_ht,
                    ST_AsGeoJSON(ST_Intersection(b.geom, buffer))::json as pointJson, 
                    ST_AsGeoJSON(buffer)::json as bufferJson
                FROM 
                    (SELECT ST_Buffer((ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)::geography), ${distance})::Geometry as buffer) cliped, 
                    diemchuan_loptichhop a
                JOIN danhsachtruonghoc b ON a.matruong = b.matruong
                JOIN chitieu_loptichhop c ON b.matruong = c.matruong
                WHERE 
                    a.maloaihinh = '${layer}'
                    AND nv1_ht <= ${score}
                GROUP BY a.matruong, a.nv1_ht, a.nv2_ht, b.tentruong, b.geom, buffer, c.ctieu_ht
                HAVING ST_AsGeoJSON(ST_Intersection(b.geom, buffer)) <> '{"type":"Point","coordinates":[]}'
                ORDER BY a.nv1_ht DESC
                LIMIT 20
            `

        default:
            return `
                SELECT a.matruong, a.nv1_ht, a.nv2_ht, b.tentruong, c.ctieu_ht,
                    ST_AsGeoJSON(ST_Intersection(b.geom, buffer))::json as pointJson, 
                    ST_AsGeoJSON(buffer)::json as bufferJson
                FROM 
                    (SELECT ST_Buffer((ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)::geography), ${distance})::Geometry as buffer) cliped, 
                    diemchuan_lopchuyen a
                JOIN danhsachtruonghoc b ON a.matruong = b.matruong
                JOIN chitieu_lopchuyen c ON b.matruong = c.matruong
                WHERE 
                    a.maloaihinh = '${layer}'
                    AND nv1_ht <= ${score}
                GROUP BY a.matruong, a.nv1_ht, a.nv2_ht, b.tentruong, b.geom, buffer, c.ctieu_ht
                HAVING ST_AsGeoJSON(ST_Intersection(b.geom, buffer)) <> '{"type":"Point","coordinates":[]}'
                ORDER BY a.nv1_ht DESC
                LIMIT 20
            `
    }
}

module.exports = {
    getAddress,
    getMinScore,
    getSchoolName,
    getLayerStatistic,
    renderChart,
    advisingEnrollment
}