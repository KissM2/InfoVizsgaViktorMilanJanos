const db = require('../sql/database.js');

async function checkIfEmailUsed(request, response, next) {
    try {
        const { email } = request.body;
        const checkUser = await db.checkUser(email);

        if(checkUser > 0){
            return response.status(409).json({
                message: 'Ez az email cím már használatban van.'
            });
        }
        next();
    } catch (error) {
        return response.status(500).json({
            message: 'Hiba történt az email cím ellenőrzésekor: ' + error.message
        });
    }
}

module.exports = {
    checkIfEmailUsed
};
