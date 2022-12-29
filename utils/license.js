function activateLicense() {
    var con = mysql.createConnection({
        host: "151.106.116.154",
        user: "u492614961_Rockbell3",
        password: "Rockbell123",
        database: "u492614961_license",
    });

    // Read the txt file
    const contents = readFileSync(databaseInfoPath, "utf-8");

    // Use split to create new array
    const arr = contents.split(",");

    document.getElementById("company").value = arr[6];

    let cp = document.getElementById("company").value;

    con.query(
        `SELECT * FROM millionshopify WHERE license_key = '${cp}'`,
        function (err, result) {
            if (err) throw err;

            if (result.length == 0) {
                dialogs.alert("Invalid License, Please Try Again");
                document.getElementById("importBtn").disabled = true;
                document.getElementById("exportBtn").disabled = true;
                console.log(err);
            } else if (result.length > 0) {
                macaddress.one(function (err, mac) {
                    console.log("Mac address for this host: %s", mac);
                    // let clientMacAddress = isDevMode? "84:1b:77:d4:89:8d" : mac;
                    // if (result[0].mac_address == clientMacAddress) { //Mac Address Problem
                        // Mac Address is Matched
                        var current = moment(moment().format("YYYY-MM-DD"));
                        var licenseExpiryDate = moment(result[0].expiry_date,"YYYY-MM-DD");

                        if (current <= licenseExpiryDate) {
                            connectDB();
                        } else {
                            dialogs.alert("Your License Is Expired, Please Contact With Rockbell");
                            document.getElementById("importBtn").disabled = true;
                            document.getElementById("exportBtn").disabled = true;
                        };
                    // } else {
                    //     dialogs.alert("This device is not permitted to use this feature.");
                    //     document.getElementById("importBtn").disabled = true;
                    //     document.getElementById("exportBtn").disabled = true;
                    // }
                });
            }
        }
    );
    con.end();
}