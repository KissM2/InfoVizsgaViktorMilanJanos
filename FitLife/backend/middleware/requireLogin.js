async function loginCheck(request, response, next) {
    try {
        if (!request.session.user || !request.session.user.id) {
            return response.status(401).json({
                message: "Nincs bejelentkezve."
            });
        }
        next();
    } catch (error) {
        return response.status(500).json({
            message: "Hiba történt a bejelentkezés ellenőrzése során."
        });
    }
}

async function adminCheck(request, response, next) {
    try {
        if (!request.session.user || !request.session.user.id) {
            return response.status(401).json({
                message: "Nincs bejelentkezve."
            });
        }

        if (request.session.user.role !== 'admin') {
            return response.status(403).json({
                message: "Nincs jogosultsága ehhez a művelethez."
            });
        }

        next();
    } catch (error) {
        return response.status(500).json({
            message: "Hiba történt a jogosultság ellenőrzése során."
        });
    }
}

module.exports = {
    loginCheck,
    adminCheck
}
