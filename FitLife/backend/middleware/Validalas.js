async function validateRegister(request, response, next) { 
    const { 
        felh_nev,
        telszam,
        nem,
        szul_datum, 
    } = request.body;

    if (!felh_nev || !telszam || !nem || !szul_datum) {
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

async function validateEmail(request, response, next) {
    const { email } = request.body;

    if (!email ) {
        return response.status(400).json({ message: 'Nem megfelelő email.' });
    }

    next();
}

// Export
module.exports = {
    validateRegister,
    validateEmailPassword,
    validateEmail,
};
