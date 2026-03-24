async function validateRegister(request, response, next) { 
    const { fullname, birthdate, phone, nem } = request.body;

    if (!fullname || !birthdate || !phone || !nem) {
        return response.status(400).json({ message: 'Nem megfelelő név, nem, születési dátum vagy telefon szám.' });
    }

    next(); 
}

async function validateEmailPassword(request, response, next) {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ message: 'Nem megfelelő email, password.' });
    }

    next();
}

// Export
module.exports = {
    validateRegister,
    validateEmailPassword
};
