const convert_vi_to_en = require('../../utils/vi_to_en')
const replace_regexp = require('../../utils/replace_regexp')
const join = require('./layerJoin')

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
        case 'diemchuan_truongchuyen_lopthuong':
            return `
                SELECT MIN(nv3)
                FROM ${layer}
            `

        default:
            return `
                SELECT MIN(nv1)
                FROM ${layer}
            `
    }
}
const getSchoolName = (school) => {
    switch (school) {
        case undefined:
            return `
                SELECT tentruong, diachi, trangweb, ST_AsGeoJSON(ST_Transform(geom, 4326)):: jsonb as json
                FROM truongchuyen
                UNION
                SELECT tentruong, diachi, trangweb, ST_AsGeoJSON(ST_Transform(geom, 4326)):: jsonb as json
                FROM truongthuong
            `
    
        default:
            return `
                SELECT ST_AsGeoJSON(ST_Transform(geom, 4326)):: jsonb as json
                FROM truongchuyen
                WHERE vi_to_en(tentruong) = '${replace_regexp(convert_vi_to_en(school))}'
                UNION
                SELECT ST_AsGeoJSON(ST_Transform(geom, 4326)):: jsonb as json
                FROM truongthuong
                WHERE vi_to_en(tentruong) = '${replace_regexp(convert_vi_to_en(school))}'
            `
    }
}
const getLayerStatistic = (layer) => {
    const layerJoined = join.statisticJoin(layer)
    return `
        SELECT tentruong
        FROM ${layerJoined}
    `
}
const renderChart = ({layer, school}) => {  
    const layerJoined = join.statisticJoin(layer)
    return `
        SELECT a.*, b.tentruong
        FROM ${layer} a
        JOIN ${layerJoined} b
        ON a.matruong = b.matruong
        WHERE vi_to_en(b.tentruong) = '${replace_regexp(convert_vi_to_en(school))}'
    `
}
const advisingEnrollment = ({layer, distance, score, longitude, latitude}) => {
    const layerJoined = join.scoreJoin(layer)
    let whereScore = ''
    let arrangeScore = ''

    switch (score) {
        case '0':
            whereScore = (layer == 'diemchuan_truongchuyen_lopthuong') 
                ? `nv3 <= (SELECT MAX(nv3) FROM ${layer})` 
                : `nv1 <= (SELECT MAX(nv1) FROM ${layer})`
            arrangeScore = (layer == 'diemchuan_truongchuyen_lopthuong') 
                ? `nv3 DESC` 
                : `nv1 DESC`
            break;

        default:
            whereScore = (layer == 'diemchuan_truongchuyen_lopthuong') 
                ? `nv3 <= ${score}` 
                : `nv1 <= ${score}`
            arrangeScore = (layer == 'diemchuan_truongchuyen_lopthuong') 
                ? `nv3 DESC` 
                : `nv1 DESC`
            break;
    }

    return `
        SELECT a.*, 
            ST_AsGeoJSON(ST_Intersection(b.geom, buffer))::json as pointJson, 
            ST_AsGeoJSON(buffer)::json as bufferJson
        FROM 
            (SELECT ST_Buffer((ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)::geography), ${distance})::Geometry as buffer) cliped, 
            ${layer} a
        JOIN ${layerJoined} b 
        ON a.matruong = b.matruong
        WHERE ${whereScore}
        GROUP BY a.matruong, a.*, b.geom, buffer
        HAVING ST_AsGeoJSON(ST_Intersection(b.geom, buffer)) <> '{"type":"Point","coordinates":[]}'
        ORDER BY a.${arrangeScore}
        LIMIT 20
    `
}

module.exports = {
    getAddress,
    getMinScore,
    getSchoolName,
    getLayerStatistic,
    renderChart,
    advisingEnrollment
}