const scoreJoin = (layer) => {
    let layerJoined = ''
    switch (layer) {
        case 'diemchuan_truongthuong_lopthuong':
            layerJoined = 'truongthuong'
            break;
    
        case 'diemchuan_truongco_loptichhop':
            layerJoined = 'truongcoloptichhop'
            break;
    
        default:
            layerJoined = 'truongchuyen'
            break;
    }
    return layerJoined
}

const statisticJoin = (layer) => {
    let layerJoined = ''  
    switch (layer) {
        case 'chitieu_truongthuong':
            layerJoined = 'truongthuong'
            break;
    
        case 'chitieu_truongchuyen':
            layerJoined = 'truongcoloptichhop'
            break;
    
        case 'chitieu_truongcoloptichhop':
        default:
            layerJoined = 'truongchuyen'
            break;
    }
    return layerJoined
}

module.exports = { scoreJoin, statisticJoin }