const showSchool = () => {
    return `
        SELECT matruong, tentruong, diachi, trangweb
        FROM danhsachtruonghoc
    `
}
const createSchool = ({layer, id, name, address, web, long, lat}) => {
    let insertData = ''
    let insertSchool = `
            INSERT INTO danhsachtruonghoc(matruong, tentruong, maloaihinh, diachi, trangweb, geom)
            VALUES ('${id}', '${name}', '{${layer}}', '${address}', '${web}', 'SRID=4326; POINT(${long} ${lat})');
    `
    if (layer.includes('00LTKC00')) {
        insertData += `
            INSERT INTO chitieu_lopthuong(matruong)
            VALUES ('${id}');
            INSERT INTO diemchuan_lopthuong(matruong, maloaihinh)
            VALUES ('${id}', '00LTKC00');
        `
          }  
    if (layer.includes('00LTHC00')) {
        insertData += `
            INSERT INTO chitieu_loptichhop(matruong)
            VALUES ('${id}');
            INSERT INTO diemchuan_loptichhop(matruong, maloaihinh)
            VALUES ('${id}', '00LTHC00');
        `
    }
    const specialTypes = layer.filter((lyr) => (
        lyr !== '00LTKC00' && lyr !== '00LTHC00'
    ))
    if (specialTypes.length) {
        insertData += `
            INSERT INTO chitieu_lopchuyen(matruong)
            VALUES ('${id}');
        `
        insertData += specialTypes.map((lyr) => (`
            INSERT INTO diemchuan_lopchuyen(matruong, maloaihinh)
            VALUES ('${id}', '${lyr}');
        `)).join('')
    }
    return insertSchool + insertData
}
const updateSchool = ({id, name, address, web}) => {
    return `
        UPDATE danhsachtruonghoc
        SET tentruong = '${name}', diachi = '${address}', trangweb = '${web}'
        WHERE matruong = '${id}'
    `
}
const deleteSchool = ({id}) => {
    return `
        DELETE FROM danhsachtruonghoc
        WHERE matruong = '${id}'
    `
}
const showScore = (layer) => {
    switch (layer) {
        case '00LTKC00':
            return `
                SELECT a.*, b.tentruong
                FROM diemchuan_lopthuong a
                JOIN danhsachtruonghoc b
                ON a.matruong = b.matruong
                WHERE a.maloaihinh = '${layer}'
            `
        case '00LTHC00':
            return `
                SELECT a.*, b.tentruong
                FROM diemchuan_loptichhop a
                JOIN danhsachtruonghoc b
                ON a.matruong = b.matruong
                WHERE a.maloaihinh = '${layer}'
            `
        default:
            return `
                SELECT a.*, b.tentruong
                FROM diemchuan_lopchuyen a
                JOIN danhsachtruonghoc b
                ON a.matruong = b.matruong
                WHERE a.maloaihinh = '${layer}'
            `
    }
}
const createScore = ({layer, year}) => {
    if (layer.includes('00LTKC00')) {
        return `
            ALTER TABLE diemchuan_lopthuong
            DROP COLUMN nv1_2n;
            ALTER TABLE diemchuan_lopthuong
            DROP COLUMN nv2_2n;
            ALTER TABLE diemchuan_lopthuong
            DROP COLUMN nv3_2n;

            ALTER TABLE diemchuan_lopthuong
            RENAME COLUMN nv1_1n TO nv1_2n;
            ALTER TABLE diemchuan_lopthuong
            RENAME COLUMN nv2_1n TO nv2_2n;
            ALTER TABLE diemchuan_lopthuong
            RENAME COLUMN nv3_1n TO nv3_2n;

            ALTER TABLE diemchuan_lopthuong
            RENAME COLUMN nv1_ht TO nv1_1n;
            ALTER TABLE diemchuan_lopthuong
            RENAME COLUMN nv2_ht TO nv2_1n;
            ALTER TABLE diemchuan_lopthuong
            RENAME COLUMN nv3_ht TO nv3_1n;

            ALTER TABLE diemchuan_lopthuong
            ADD nv1_ht INT;
            ALTER TABLE diemchuan_lopthuong
            ADD nv2_ht INT;
            ALTER TABLE diemchuan_lopthuong
            ADD nv3_ht INT;

            UPDATE diemchuan_lopthuong
            SET namcapnhat = ${year};
        `
    }
    if (layer.includes('00LTHC00')) {
        return `
            ALTER TABLE diemchuan_loptichhop
            DROP COLUMN nv1_2n;
            ALTER TABLE diemchuan_loptichhop
            DROP COLUMN nv2_2n;

            ALTER TABLE diemchuan_loptichhop
            RENAME COLUMN nv1_1n TO nv1_2n;
            ALTER TABLE diemchuan_loptichhop
            RENAME COLUMN nv2_1n TO nv2_2n;

            ALTER TABLE diemchuan_loptichhop
            RENAME COLUMN nv1_ht TO nv1_1n;
            ALTER TABLE diemchuan_loptichhop
            RENAME COLUMN nv2_ht TO nv2_1n;

            ALTER TABLE diemchuan_loptichhop
            ADD nv1_ht INT;
            ALTER TABLE diemchuan_loptichhop
            ADD nv2_ht INT;

            UPDATE diemchuan_loptichhop
            SET namcapnhat = ${year};
        `
    }
    const specialTypes = layer.filter((lyr) => (
        lyr !== '00LTKC00' && lyr !== '00LTHC00'
    ))
    if (specialTypes.length) {
        return `
            ALTER TABLE diemchuan_lopchuyen
            DROP COLUMN nv1_2n;
            ALTER TABLE diemchuan_lopchuyen
            DROP COLUMN nv2_2n;

            ALTER TABLE diemchuan_lopchuyen
            RENAME COLUMN nv1_1n TO nv1_2n;
            ALTER TABLE diemchuan_lopchuyen
            RENAME COLUMN nv2_1n TO nv2_2n;

            ALTER TABLE diemchuan_lopchuyen
            RENAME COLUMN nv1_ht TO nv1_1n;
            ALTER TABLE diemchuan_lopchuyen
            RENAME COLUMN nv2_ht TO nv2_1n;

            ALTER TABLE diemchuan_lopchuyen
            ADD nv1_ht INT;
            ALTER TABLE diemchuan_lopchuyen
            ADD nv2_ht INT;

            UPDATE diemchuan_lopchuyen
            SET namcapnhat = ${year};
        `
    }
}
const updateScore = (request, id) => {
    switch (request.layer) {
        case '00LTKC00':
            return `
                UPDATE diemchuan_lopthuong SET 
                nv1_2n = ${request.nv1_2n}, nv2_2n = ${request.nv2_2n}, nv3_2n = ${request.nv3_2n}, 
                nv1_1n = ${request.nv1_1n}, nv2_1n = ${request.nv2_1n}, nv3_1n = ${request.nv3_1n},
                nv1_ht = ${request.nv1_ht}, nv2_ht = ${request.nv2_ht}, nv3_ht = ${request.nv3_ht}
                WHERE matruong = '${id}' AND maloaihinh = '${request.layer}'
            `

        case '00LTHC00':
            return `
                UPDATE diemchuan_loptichhop SET 
                nv1_2n = ${request.nv1_2n}, nv2_2n = ${request.nv2_2n},
                nv1_1n = ${request.nv1_1n}, nv2_1n = ${request.nv2_1n},
                nv1_ht = ${request.nv1_ht}, nv2_ht = ${request.nv2_ht}
                WHERE matruong = '${id}' AND maloaihinh = '${request.layer}'
            `

        default:
            return `
                UPDATE diemchuan_lopchuyen SET 
                nv1_2n = ${request.nv1_2n}, nv2_2n = ${request.nv2_2n},
                nv1_1n = ${request.nv1_1n}, nv2_1n = ${request.nv2_1n},
                nv1_ht = ${request.nv1_ht}, nv2_ht = ${request.nv2_ht}
                WHERE matruong = '${id}' AND maloaihinh = '${request.layer}'
            `
    }
}
const showStatistic = ({layer}) => {
    return `
        SELECT a.*, b.tentruong
        FROM ${layer} a
        JOIN danhsachtruonghoc b
        ON a.matruong = b.matruong
    `
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
        SET namcapnhat = ${year};
    `
}
const updateStatistic = (request, id) => {
    return `
        UPDATE ${request.layer} SET 
        ctieu_ht = ${request.ctieu_ht}, ctieu_1n = ${request.ctieu_1n}, ctieu_2n = ${request.ctieu_2n}, 
        slnv1_ht = ${request.slnv1_ht}, slnv1_1n = ${request.slnv1_1n}, slnv1_2n = ${request.slnv1_2n}
        WHERE matruong = '${id}'
    `
}

module.exports = {
    showSchool,
    createSchool,
    updateSchool,
    deleteSchool,

    showScore,
    createScore,
    updateScore,

    showStatistic,
    createStatistic,
    updateStatistic
}