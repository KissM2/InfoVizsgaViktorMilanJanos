const { json } = require("express");

async function checkEdzoData(request, response, next) {
    try {        
        const {
            leiras,
            kompetenciak,
            idezet,
            edzoterem_cim_lat,
            edzoterem_cim_lng
        } = request.body;
        
        const kep = request.file;

        if(!leiras || !kompetenciak || !idezet || !edzoterem_cim_lat || !edzoterem_cim_lng || !kep) {
            return response.status(400).json({
                message: "nem megfelelő adatok"
            })
        }

        next();

    } catch (error) {
        return response.status(500).json({
            message: "hiba az adatok hitelesítése közben"
        });
    }
}

module.exports = {
    checkEdzoData
}
