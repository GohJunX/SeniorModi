// Get the modal
var aModal = document.getElementById("aModal");
var dbModal = document.getElementById("dbModal");
var importModal = document.getElementById("importModal");
var exportModal = document.getElementById("exportModal");

// Get the button that opens the modal
var aBtn = document.getElementById("aBtn");
var aSubmit = document.getElementById("aSubmit");
var importBtn = document.getElementById("importBtn");
var exportBtn = document.getElementById("exportBtn");

// Get the button that closes the modal
var authenticationCancel = document.getElementById("authenticationCancel");
var databaseCancel = document.getElementById("databaseCancel");
var importCancel = document.getElementById("importCancel");
var exportCancel = document.getElementById("exportCancel");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span1 = document.getElementsByClassName("close")[1];
var span2 = document.getElementsByClassName("close")[2];
var span3 = document.getElementsByClassName("close")[3];

//----------------Authentication Modal----------------------------//
// When the user clicks on the button, open the Authentication Modal and clear the input fields
aBtn.onclick = function () {
    aModal.style.display = "block";
    document.getElementById("aUserId").value = null;
    document.getElementById("aPassword").value = null;
};

// When click cancel button, close the Authentication Modal
authenticationCancel.onclick = function () {
    aModal.style.display = "none";
};

// When the user clicks on <span> (x), close the Authentication Modal
span.onclick = function () {
    aModal.style.display = "none";
};

// When the user clicks anywhere outside of the Authentication Modal, close it
window.onclick = function (event) {
    if (event.target == aModal) {
        aModal.style.display = "none";
    }
};

//----------------Database Modal----------------------------//
// When the user clicks on the button, open the Database Modal and clear the input fields
function databaseModal() {
    aModal.style.display = "none";
    dbModal.style.display = "block";
}

// When click cancel button, close the Database Modal
databaseCancel.onclick = function () {
    dbModal.style.display = "none";
};

// When the user clicks on <span> (x), close the Database Modal
span1.onclick = function () {
    dbModal.style.display = "none";
};

// When the user clicks anywhere outside of the Database Modal, close it
window.onclick = function (event2) {
    if (event2.target == dbModal) {
        dbModal.style.display = "none";
    }
};

//----------------Import Modal----------------------------//
// When the user clicks on the button, open the Import Modal and clear the input fields
importBtn.onclick = function () {
    importModal.style.display = "block";
    document.getElementById("BATCHNO").value = 10;
    document.getElementById("TaxCode").value = "STAX";
    document.getElementById("EFile").value = null;
    document.getElementById("importDataTable").innerHTML = "";
};

// When click cancel button, close the Import Modal
importCancel.onclick = function () {
    importModal.style.display = "none";
};

// When the user clicks on <span> (x), close the Import Modal
span2.onclick = function () {
    importModal.style.display = "none";
};

// When the user clicks anywhere outside of the Import Modal, close it
window.onclick = function (event3) {
    if (event3.target == importModal) {
        importModal.style.display = "none";
    }
};

//----------------Export Modal----------------------------//
// When the user clicks on the button, open the Export Modal and clear the input fields
exportBtn.onclick = function () {
    exportModal.style.display = "block";
    document.getElementById("datestart").value = null;
    document.getElementById("dateend").value = null;
};

// When click cancel button, close the Export Modal
exportCancel.onclick = function () {
    exportModal.style.display = "none";
};

// When the user clicks on <span> (x), close the Export Modal
span3.onclick = function () {
    exportModal.style.display = "none";
};

// When the user clicks anywhere outside of the Export Modal, close it
window.onclick = function (event4) {
    if (event4.target == exportModal) {
        exportModal.style.display = "none";
    }
};

aSubmit.onclick = function () {
    // Use try catch function to show alert when occuring error
    try {
        aUserId = document.getElementById("aUserId").value;
        aPassword = document.getElementById("aPassword").value;

        // Detect error
        if(aUserId == "")  throw "User Id cannot empty";
        if(aPassword == "")  throw "Password cannot empty";
        if(aPassword != "Rockb3ll@0419")  throw "User Id or Password is wrong";

        // Setting Authentication
        if ((aUserId == "rockbell" || aUserId == "") && (aPassword == "Rockb3ll@0419" || aPassword == "")) {
            console.log('"You are logged in!"');
            // Load the function
            databaseModal();
        }
    } catch (err) {
        dialogs.alert(err);
        console.log(err);
    } finally {
        // After onclick, password auto empty
        document.getElementById("aPassword").value = null;
    }
};

// onclick the database comfirm
document.getElementById("submit").onclick = function () {
    // database input field value
    var userId = document.getElementById("userId").value;
    var password = document.getElementById("password").value;
    var serverName = document.getElementById("serverName").value;
    var instance = document.getElementById("instanceName").value;
    var passwordOption = document.getElementById("passwordOption").value;
    var db = document.getElementById("db").value;

    // Insert Database information
    config = {
        user: userId,
        password: password,
        server: serverName,
        database: db,
        type: passwordOption,
        options: {
            instanceName: instance,
            encrypt: false,
        },
    };

    // connect to your database
    sql.connect(config, function (err) {
        //if (err) console.log(err);
        // create Request object
        const request = new sql.Request();

        // query to the database and get the records
        request.query("SELECT * FROM gl", function (err, recordset) {
            if (err) {
                dialogs.alert("Something went wrong");
                console.log(err);
            } else {
                dialogs.alert("Connect Successful! Please close this window to continue your work.", (ok) => {
                    console.log("Connect Successful");
                    document.getElementById("importBtn").disabled = false;
                    document.getElementById("exportBtn").disabled = false;
                });
                saveDbInfo();
            }
        });
    });
};
