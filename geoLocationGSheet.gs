function onChange() {

    var inputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('input');
    var outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('output');
    var inputDataLastRow = inputSheet.getLastRow();
    var rangeIdIn = inputSheet.getRange(2, 1, inputDataLastRow, 1);
    var outputDataLastRow = outputSheet.getLastRow();
    var rangeIdOut = outputSheet.getRange(2, 1, outputDataLastRow, 1);
    var idcolInput = rangeIdIn.getValues();
    var idcolOutpu = rangeIdOut.getValues();

    //Logger.log("OUTPUTDATA: "+outputData);

    //Logger.log("LAST INPUT ROW "+inputDataLastRow);
    //Logger.log("LAST OUTPUT ROW "+outputDataLastRow);

    //Logger.log("Input IDS: "+idcolInput);
    //Logger.log("Output IDS: "+idcolOutpu);


    for (var i = 0; i < inputDataLastRow - 1; i++) {
        var indexof = ArrayLib.indexOf(idcolOutpu, -1, idcolInput[i].toString());
        var conflictRow = i + 2;
        if (indexof == -1) {
            Logger.log("NOT PRESENT, conflict: " + conflictRow);
            var toProcess = inputSheet.getRange(conflictRow, 1, 1, 8);
            var dataToProcess = toProcess.getValues();

            var id = dataToProcess[0][0];
            var org = dataToProcess[0][1];
            var date = dataToProcess[0][2];
            var loc = dataToProcess[0][3];
            var part = dataToProcess[0][4];
            var val = dataToProcess[0][5];
            var email = dataToProcess[0][6];
            var concl = dataToProcess[0][7];

            if (id.length != 0 && loc.length != 0) {


                var latlon = addressToPosition(loc) || [0, 0];
                //Logger.log("LOC:  "+latlon);
                if (latlon != 0) {
                    var newRow = [id, org, date, loc, latlon[0], latlon[1], part, val, concl, "http://dialogosgo.es/resources/void.pdf"];
                    outputSheet.appendRow(newRow);
                    //Logger.log("NEW ROW:  "+newRow);

                } else {
                    Logger.log("ERROR geocoding");
                }

            } else {
                Logger.log("No Significant Changes.");
            }

        }

    }

}


function addressToPosition(loc) {

    var geocoder = Maps.newGeocoder().setRegion('es');
    var location = geocoder.geocode(loc);
    if (location.status == 'OK') {
        var lat = location["results"][0]["geometry"]["location"]["lat"];
        var lng = location["results"][0]["geometry"]["location"]["lng"];

        var res = [lat, lng];

        return res;
    } else {
        return 0;
    }

}
