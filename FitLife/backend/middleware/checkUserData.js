async function checkUserData(request, response, next) {
    try {
        const { 
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak,
            cel_testsuly,
            edzesen_kivuli_mozgas
        } = request.body;

        if(!testsuly || !magassag || !edzesre_forditott_ido || !cel_alak || !cel_testsuly || !edzesen_kivuli_mozgas){
            return response.status(400).json({
                message: "nem megfelelő személyes adatok"
            })
        }

        next();

    } catch (error) {
        return response.status(500).json({
            message: "hiba a személyes adatok hitelesítése közben"
        });
    }
}

async function checkAllergiak(request, response, next) {
    try {
        const { etelAllergiak } = request.body;

        if(!etelAllergiak){
            return response.status(400).json({
                message: "nem megfelelő allergia adatok"
            })
        }

        next();

    } catch (error) {
        return response.status(500).json({
            message: "hiba az allergia adatok hitelesítése közben"
        });
    }
}

async function checkPreferenciak(request, response, next) {
    try {
        const { etelPreferenciak } = request.body;

        if(!etelPreferenciak){
            return response.status(400).json({
                message: "nem megfelelő preferencia adatok"
            })
        }

        next();

    } catch (error) {
        return response.status(500).json({
            message: "hiba a prefernia adatok hitelesítése közben"
        });
    }
}

async function checkEdzesiNapok(request, response, next) {
    try {
        const { edzesiNapok } = request.body;

        if(!edzesiNapok){
            return response.status(400).json({
                message: "nem megfelelő edzesi nap adatok"
            })
        }

        next();
    } catch (error) {
        return response.status(500).json({
            message: "hiba az edzesi napok adatok hitelesítése közben"
        });
    }
}

module.exports = {
    checkUserData,
    checkAllergiak,
    checkPreferenciak,      
    checkEdzesiNapok,
}
