//--------------------------- Import Database -----------------------------------//

document.getElementById('EFile').onchange = async function() {
    try {
        const eFile = this;

        if (eFile.files[0] !== undefined) {

            const workbook = new excel.Workbook();
            const isCSV = eFile.files[0].type === "text/csv";
            const eFilePath = eFile.files[0].path;
            const workbookFile = isCSV ? await workbook.csv.readFile(eFilePath) : await workbook.xlsx.readFile(eFilePath);
            const worksheetName = isCSV ? workbookFile.name : workbookFile._worksheets[1].name;
            const worksheet = workbook.getWorksheet(worksheetName);
            
            let tableContext = 
            `<tr>
                <th>Product_Code</th>
                <th>BOM_No</th>
                <th>BOM_Product_Code</th>
                <th>BOM_No_Semi_Final</th>
                <th>BOM_Location</th>
                <th>BOM_Qty</th>
                <th>Print</th>	
                <th>SEQ</th>
            </tr>`;

            worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
                let isSkipRow = rowNumber === 1 && row.values[1] === "Product_Code";

                if (!isSkipRow) {
                    let rowContent = "<tr>";
                    for (let index = 1; index <= 8; index++) {
                        rowContent += `<td>${row.values[index] !== undefined ? row.values[index] : ""}</td>`;
                    }
                    rowContent += "<tr>";
                    tableContext += rowContent;
                }
            });

            document.getElementById("importDataTable").innerHTML = tableContext;
        }
    } catch (err) {
        console.log(err);
        document.getElementById("importDataTable").innerHTML = "";
        dialogs.alert("Invalid File.");
    }
};

document.getElementById("btnImport").onclick = async function() {
    document.getElementById("btnImport").disabled = true;
    await importExcelFileToDatabase();
    document.getElementById("btnImport").disabled = false;
};





async function importExcelFileToDatabase() {
 

    const workbook = new excel.Workbook();

    let eFile = document.getElementById("EFile");

    if (eFile.files.length < 1) return dialogs.alert("File Cannot be Empty.");

    const isCSV = eFile.files[0].type === "text/csv";

    const eFilePath = eFile.files[0].path;
    
    const workbookFile = isCSV ? await workbook.csv.readFile(eFilePath) : await workbook.xlsx.readFile(eFilePath);
    const worksheetName = isCSV ? workbookFile.name : workbookFile._worksheets[1].name;
    const worksheet = workbook.getWorksheet(worksheetName);
    const worksheetRows = worksheet._rows;

    let pool = await sql.connect(config);
 

    let firstRow = worksheet.getRow(1).values;
    let hasHeaderRow = firstRow[1] !== undefined && firstRow[1] === "Product_Code";

    let query1 = `create unique index ix_uq on dbo.prodbom(bom_no, bom_prodcode)`;
    pool.query(query1);

    let insertdata=[];
    for (let index = hasHeaderRow ? 2 : 1; index < worksheetRows.length + 1; index++) {

let ProdCode = await checkBomPC(pool);
if (ProdCode === 65) {
            return dialogs.alert(`Your product is empty, Please insert your product.`);
            
        }
    
else {
       
        let values = worksheet.getRow(index).values;
        if(values.length !== 0){
  
    
        let Product_Code = getStringFromRow(values[1], "");
        let BOM_No = getStringFromRow(values[2], "");
        let BOM_Product_Code = getStringFromRow(values[3], "");
        let BOM_No_Semi_Final = getStringFromRow(values[4], "");
        let BOM_Location = getStringFromRow(values[5], "null");
        let BOM_Qty = getStringFromRow(values[6], "");
        let Print1 = getStringFromRow(values[7], "");
        let SEQ = getStringFromRow(values[8], "");
        
        console.log(Product_Code+' '+BOM_No+' '+BOM_Product_Code+' '+BOM_No_Semi_Final+' '+BOM_Location+' '+BOM_Qty+' '+Print1+' '+SEQ);
let sqls = `insert into dbo.prodbom (prodcode, bom_no, bom_prodcode, bom_no_sf, bom_location, bom_qty, bom_print, bom_seq) values('${Product_Code}', '${BOM_No}', '${BOM_Product_Code}', '${BOM_No_Semi_Final}', '${BOM_Location}', '${BOM_Qty}', '${Print1}', '${SEQ}')`;
insertdata.push(sqls);
}
}

}
let query2 = `DROP INDEX ix_uq ON dbo.prodbom;`;
pool.query(query2);

    let queryID = insertdata.join(" ");
    var result=pool.query( queryID);
    console.log(result);
    result.then(()=>{ dialogs.alert("Imported Success.");}).catch(()=>{dialogs.alert(`Import Failed.`);})
    

}


// Reset Element
    document.getElementById("EFile").value = null;
    



    function getStringFromRow(values, vDefault, maxLength = undefined) {
        if (values !== undefined) {
            if (maxLength !== undefined && values.length > maxLength) {
                values = values.substring(0, maxLength);
            }
            return values;
        } else {
            return vDefault;
        }
    }

    // async function checkBomPC(pool, BOM_Product_Code) {
    //     let BPC = undefined;
    //     let query = `SELECT Top 1 * FROM dbo.prodbom WHERE bom_prodcode = '${BOM_Product_Code}'`;
    
    //     try {
    //         BPC = await pool.request().query(query);
    //         console.log(BPC);
    //     } catch (err) {
    //         console.log(err);
    //     }
    
    //     return BPC;
    // }


    async function checkBomPC(pool) {
        let PC = undefined;
        let query = `select prodcode from dbo.product`;
    
        try {
            PC = await pool.request().query(query);
            PC = JSON.stringify(PC).length
            console.log(PC);

        } catch (err) {
            console.log(err);
        }
    
        return PC;
    }

    