const join = require('./layerJoin')

const showData = (layer) => {
    return `
        SELECT *
        FROM ${layer}
    `
}
const insertData = ({layer, type, id, name, address, web, long, lat}) => {
    switch (layer) {
        case 'truongthuong':
            return `
                INSERT INTO ${layer}(matruong, tentruong, diachi, trangweb, geom)
                VALUES ('${id}', '${name}', '${address}', '${web}', 'SRID=4326; POINT(${long} ${lat})');
                INSERT INTO chitieu_truongthuong(matruong)
                VALUES ('${id}');
                INSERT INTO diemchuan_truongthuong_lopthuong(matruong)
                VALUES ('${id}');
            `
            
        case 'truongcoloptichhop':
            return `
                INSERT INTO ${layer}(matruong, tentruong, diachi, trangweb, geom)
                VALUES ('${id}', '${name}', '${address}', '${web}', 'SRID=4326; POINT(${long} ${lat})');
                INSERT INTO chitieu_truongcoloptichhop(matruong)
                VALUES ('${id}');
                INSERT INTO diemchuan_truongco_loptichhop(matruong)
                VALUES ('${id}');
            `
    
        case 'truongchuyen':
            let layers = ''
            type.forEach(lyr => layers += `
                INSERT INTO ${lyr}(matruong)
                VALUES ('${id}');
            `
            )
            return `
                INSERT INTO ${layer}(matruong, tentruong, diachi, trangweb, geom)
                VALUES ('${id}', '${name}', '${address}', '${web}', 'SRID=4326; POINT(${long} ${lat})');
                INSERT INTO chitieu_truongchuyen(matruong)
                VALUES ('${id}');
            ` + layers
    }
}
const updateData = ({layer, id, name, address, web}) => {
    return `
        UPDATE ${layer}
        SET tentruong = '${name}', diachi = '${address}', trangweb = '${web}'
        WHERE matruong = '${id}'
    `
}
const deleteData = ({layer, id}) => {
    switch (layer) {
        case 'truongthuong':
            return `
                DELETE FROM ${layer}
                WHERE matruong = '${id}';
                DELETE FROM chitieu_truongthuong
                WHERE matruong = '${id}';
                DELETE FROM diemchuan_truongthuong_lopthuong
                WHERE matruong = '${id}';
            `

        case 'truongcoloptichhop':
            return `
                DELETE FROM ${layer}
                WHERE matruong = '${id}';
                DELETE FROM chitieu_truongcoloptichhop
                WHERE matruong = '${id}';
                DELETE FROM diemchuan_truongco_loptichhop
                WHERE matruong = '${id}';
            `
    
        default:
            const types = [
                "diemchuan_truongchuyen_lopthuong",
                "diemchuan_truongchuyen_lopchuyen_anh",
                "diemchuan_truongchuyen_lopchuyen_dia",
                "diemchuan_truongchuyen_lopchuyen_hoa",
                "diemchuan_truongchuyen_lopchuyen_ly",
                "diemchuan_truongchuyen_lopchuyen_nhat",
                "diemchuan_truongchuyen_lopchuyen_phap",
                "diemchuan_truongchuyen_lopchuyen_sinh",
                "diemchuan_truongchuyen_lopchuyen_su",
                "diemchuan_truongchuyen_lopchuyen_tin",
                "diemchuan_truongchuyen_lopchuyen_toan",
                "diemchuan_truongchuyen_lopchuyen_trung",
                "diemchuan_truongchuyen_lopchuyen_van"
            ]
            let layers = ''
            types.forEach(lyr => layers += `
                DELETE FROM ${lyr}
                WHERE matruong = '${id}';
            `)
            return `
                DELETE FROM ${layer}
                WHERE matruong = '${id}';
                DELETE FROM chitieu_truongchuyen
                WHERE matruong = '${id}';
            ` + layers
    }
}
const showScore = (layer) => {
    const layerJoined = join.scoreJoin(layer)
    return `
        SELECT a.*, b.tentruong
        FROM ${layer} a
        JOIN ${layerJoined} b
        ON a.matruong = b.matruong
    `
}
const updateScore = (request, id) => {
    switch (request.layer) {
        case 'diemchuan_truongthuong_lopthuong':
            return `
                UPDATE ${request.layer}
                SET chitieu = ${request.chitieu}, nv1 = ${request.nv1}, nv2 = ${request.nv2}, nv3 = ${request.nv3}
                WHERE matruong = '${id}'
            `

        case 'diemchuan_truongchuyen_lopthuong':
            return `
                UPDATE ${request.layer}
                SET chitieu = ${request.chitieu}, nv3 = ${request.nv3}, nv4 = ${request.nv4}
                WHERE matruong = '${id}'
            `

        default:
            return `
                UPDATE ${request.layer}
                SET chitieu = ${request.chitieu}, nv1 = ${request.nv1}, nv2 = ${request.nv2}
                WHERE matruong = '${id}'
            `
    }
}
const showStatistic = ({layer, year, getYear}) => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const layerJoined = join.statisticJoin(layer)
    const showCurrentYear = `
        SELECT a.matruong, a.namht, a.ctieu_ht, a.slnv1_ht, b.tentruong
        FROM ${layer} a
        JOIN ${layerJoined} b
        ON a.matruong = b.matruong
    `
    const showOneYearAgo = `
        SELECT a.matruong, a.namht, a.ctieu_1n, a.slnv1_1n, b.tentruong
        FROM ${layer} a
        JOIN ${layerJoined} b
        ON a.matruong = b.matruong
    `
    const showTwoYearAgo = `
        SELECT a.matruong, a.namht, a.ctieu_2n, a.slnv1_2n, b.tentruong
        FROM ${layer} a
        JOIN ${layerJoined} b
        ON a.matruong = b.matruong
    `
    if (getYear == currentYear) {
        if (year == currentYear) {return showCurrentYear} 
        else if (year == currentYear - 1) {return showOneYearAgo} 
        else if (year == currentYear - 2) {return showTwoYearAgo}
    }
    else if (getYear != currentYear) {
        if (year == currentYear - 1) {return showCurrentYear} 
        else if (year == currentYear - 2) {return showOneYearAgo} 
        else if (year == currentYear - 3) {return showTwoYearAgo}
    }
}
const createStatistic = ({layer, year}) => {
    return `
        ALTER TABLE ${layer}
        DROP COLUMN ctieu_2n;
        ALTER TABLE ${layer}
        DROP COLUMN slnv1_2n;
        ALTER TABLE ${layer}
        RENAME COLUMN ctieu_1n TO ctieu_2n;
        ALTER TABLE ${layer}
        RENAME COLUMN slnv1_1n TO slnv1_2n;
        ALTER TABLE ${layer}
        RENAME COLUMN ctieu_ht TO ctieu_1n;
        ALTER TABLE ${layer}
        RENAME COLUMN slnv1_ht TO slnv1_1n;
        ALTER TABLE ${layer}
        ADD ctieu_ht INT;
        ALTER TABLE ${layer}
        ADD slnv1_ht INT;
        UPDATE ${layer}
        SET namht = ${year};
    `
}
const updateStatistic = ({layer, id, year, getYear, target, registration}) => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const updateCurrentYear = `
        UPDATE ${layer}
        SET ctieu_ht = ${target}, slnv1_ht = ${registration}
        WHERE matruong = '${id}'
    `
    const updateOneYearAgo = `
        UPDATE ${layer}
        SET ctieu_1n = ${target}, slnv1_1n = ${registration}
        WHERE matruong = '${id}'
    `
    const updateTwoYearAgo = `
        UPDATE ${layer}
        SET ctieu_2n = ${target}, slnv1_2n = ${registration}
        WHERE matruong = '${id}'
    `
    if (getYear == currentYear) {
        if (year == currentYear) {return updateCurrentYear} 
        else if (year == currentYear - 1) {return updateOneYearAgo} 
        else if (year == currentYear - 2) {return updateTwoYearAgo}
    }
    else if (getYear != currentYear) {
        if (year == currentYear - 1) {return updateCurrentYear} 
        else if (year == currentYear - 2) {return updateOneYearAgo} 
        else if (year == currentYear - 3) {return updateTwoYearAgo}
    }
}

module.exports = {
    showData,
    insertData,
    updateData,
    deleteData,

    showScore,
    updateScore,

    showStatistic,
    createStatistic,
    updateStatistic
}