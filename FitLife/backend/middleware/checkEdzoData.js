async function checkEdzoData(request, response, next) {
    try {

        const {nem,
            leiras, 
            kompetenciak, 
            kep, 
            idezet, 
            edzőterem_cím
        } = request.body;

        if(!nem || !leiras || !kompetenciak || !kep || !idezet || !edzőterem_cím){
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
    checkEdzoData
}
