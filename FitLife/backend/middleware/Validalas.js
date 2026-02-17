async function validateRegister(request, response, next) { 
     const { name, role, szul_datum, tel_szam } = request.body;

    if (!name || !role || !szul_datum || !tel_szam) {
        return response.status(400).json({ message: 'Nem megfelelő adatok.' });
    }

    next(); 
}

async function validateEmailPassword(request, response, next) {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ message: 'Nem megfelelő adatok.' });
    }

    next();
}

// Export
module.exports = {
    validateRegister,
    validateEmailPassword
};
