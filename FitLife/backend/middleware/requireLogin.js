async function loginCheck(request, response, next) {
    try {
        if (!request.session.user.email) {
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

module.exports = {
    loginCheck
}