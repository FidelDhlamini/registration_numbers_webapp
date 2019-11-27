module.exports = function RegistrationCheck() {
    var numberPlates =  [];
    var message = ""

    function storePlate(plate) {
        if (plate === "") {
        
            message = 'Enter a registration number';
            return false;
        }
        console.log(plate)
        plate = plate.toUpperCase();

        if (plate.startsWith("CA") || plate.startsWith("CL") || plate.startsWith("CJ")) {




            if (plate.length > 10) {
                message = "Registration number cannot exceed 10 characters"
                return false;
            }


            if (plate !== "" || plate !== undefined) {

                if (!numberPlates.includes(plate)) {
                    numberPlates.push(plate);
                    message = "Registration number added.";
                    return true;
                } else {
                    message = "Registration number already exists";
                    return false;
                }
            }
            return false;
        } else {
            message = "Invalid Registration number";
            return false;
        }
    }


    function showAllRegNumbers() {
        return numberPlates;
    }

    function getMessage() {
        return message;
    }

    function filterRegNum(townTag) {
        var filteredPlates = []

        if (townTag === "") {
            return numberPlates;
        }

        for (var i = 0; i < numberPlates.length; i++) {
            var storedPlates = numberPlates[i]
            if (storedPlates.startsWith(townTag)) {
                filteredPlates.push(storedPlates)
            }
        }

        return filteredPlates;
    }

    return {
        storePlate,
        showAllRegNumbers,
        filterRegNum,
        getMessage

    }
}