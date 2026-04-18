async function checkUserData(request, response, next) {
    try {

        const { 
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak_id,
            cel_testsuly,
            EKM_id
        } = request.body;

        if(!testsuly || !magassag || !edzesre_forditott_ido || !cel_alak_id || !cel_testsuly || !EKM_id){
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
