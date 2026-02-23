async function checkUserData(request, response, next) {
    try {

        const {allergiak, preferenciak, cel_testsuly, cel_alkat, uzott_sport, magassag, testsuly, nem, edzesen_kivuli_mozgas} = request.body;

        if(!allergiak || !preferenciak || !cel_testsuly || !cel_alkat || !uzott_sport || !magassag || !testsuly || !nem || !edzesen_kivuli_mozgas){
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
    checkUserData
}
