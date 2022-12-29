function saveDbInfo() {
    // Require fs package
    var fs = require("fs");

    // Get the value from setting
    let serverName = document.getElementById("serverName").value;
    let instanceName = document.getElementById("instanceName").value;
    let passwordOption = document.getElementById("passwordOption").value;
    let userId = document.getElementById("userId").value;
    let password = document.getElementById("password").value;
    let db = document.getElementById("db").value;
    let company = document.getElementById("company").value;

    // Create a array to store data
    const dbData = [];

    // Insert the data to array from setting
    dbData.push(serverName);
    dbData.push(instanceName);
    dbData.push(passwordOption);
    dbData.push(userId);
    dbData.push(password);
    dbData.push(db);
    dbData.push(company);

    // console.log(dbData);

    // Store the txt file in this path
    var file = fs.createWriteStream(databaseInfoPath);
    file.on("error", function (err) {
        /* error handling */
    });
    file.write(dbData.join(",") + "\n");
    // console.log(file)
    file.end();
}

// -------------------------- Load Database Information -----------------------------//
function syncReadFile(filename) {
    // Read the txt file
    const contents = readFileSync(filename, "utf-8");

    // Use split to create new array
    const arr = contents.split(",");

    // Assign the array to input field
    document.getElementById("serverName").value = arr[0];
    document.getElementById("instanceName").value = arr[1];
    document.getElementById("passwordOption").value = arr[2];
    document.getElementById("userId").value = arr[3];
    document.getElementById("password").value = arr[4];
    document.getElementById("db").value = arr[5];

    // console.log(arr[1-1])

    // console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four']

    document.getElementById("importBtn").disabled = false;
    document.getElementById("exportBtn").disabled = false;
    // return arr;
}

// -------------------------- Auto Connect Database -----------------------------//
function connectDB() {
    // Load this function with this
    syncReadFile(databaseInfoPath);

    // Get value from input field
    var userId = document.getElementById("userId").value;
    var password = document.getElementById("password").value;
    var serverName = document.getElementById("serverName").value;
    var instance = document.getElementById("instanceName").value;
    var passwordOption = document.getElementById("passwordOption").value;
    var db = document.getElementById("db").value;

    // Insert database information
    config = {
        user: userId,
        password: password,
        server: serverName,
        database: db,
        type: passwordOption,
        options: {
            instanceName: instance,
            encrypt: false,
        }
    };

    // connect to your database
    sql.connect(config, function (err) {
        // if (err) console.log(err);

        // create Request object
        const request = new sql.Request();

        // query to the database and get the records
        request.query("SELECT * FROM gl", function (err, recordset) {
            if (err) {
                // When fail to connect db
                dialogs.alert("Unable to connect database server, please try again later.");
                console.log(err);
            }
            document.getElementById("importBtn").disabled = false;
            document.getElementById("exportBtn").disabled = false;
        });
    });
}