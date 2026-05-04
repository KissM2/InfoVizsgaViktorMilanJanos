const { json } = require("express");
const database = require('../sql/database.js');
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
        const userId = request.session.user.id;

        //  lekérjük a régi képet
        const oldImage = await database.getEdzoImage(userId);

        //  alap mezők ellenőrzése
        if (
            !leiras ||
            !kompetenciak ||
            !idezet ||
            !edzoterem_cim_lat ||
            !edzoterem_cim_lng
        ) {
            return response.status(400).json({
                message: "nem megfelelő adatok"
            });
        }

        //  KÉP LOGIKA
        // ha nincs új kép ÉS nincs régi → hiba
        if (!kep && !oldImage) {
            return response.status(400).json({
                message: "Kép kötelező!"
            });
        }

        next();

    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "hiba az adatok hitelesítése közben"
        });
    }
}

module.exports = {
    checkEdzoData
}
