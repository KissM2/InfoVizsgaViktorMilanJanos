const db = require('../sql/database.js');

async function checkIfEmailUsed(request, response, next) {
    try {
        const { email } = request.body;

        if(request.session.user && email == request.session.user.email){
            return next();
        }

        const checkUser = await db.checkUser(email);

        if(checkUser.length > 0){
            return response.status(409).json({
                message: 'Ez az email cím már használatban van.'
            });
        }
        next();
    } catch (error) {
        return response.status(500).json({
            message: 'Hiba történt az email cím ellenőrzésekor'
        });
    }
}

module.exports = {
    checkIfEmailUsed
};
