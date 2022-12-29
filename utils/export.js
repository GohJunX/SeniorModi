function createNewExcelFile() {
    //select datestart 
    let datestart = document.getElementById('datestart').value;
    console.log(datestart);
  
    //select dateend 
    let dateend = document.getElementById('dateend').value;
    console.log(dateend);
    console.log("SELECT * FROM sinv where doc_date >='" + datestart + "' AND doc_date <='" + dateend + "'");
  
    try{
      if(datestart == "" || dateend == "") throw "Date is Empty";
      if(datestart > dateend) throw "Start Date cannot lower than End Date";
  
    // connect to your database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        const requestExport = new sql.Request();
  
    // query to the database and get the records
    requestExport.query("SELECT sinv.doc_date, sinv.custcode, sinv.name, sinv.createdate, sinv.lastupdate, sinv.addr,sinvdet.prodcode, sinvdet.desp, sinvdet.doc_no, sinvdet.qty, sinvdet.unit, stock.utd_cost, sinvdet.qty * stock.utd_cost AS total_price FROM sinv, sinvdet, stock WHERE sinv.doc_date >='" + datestart + "' AND sinv.doc_date <='" + dateend + "'", function (err, recordset) {
        if (err) {
            console.log(err)
        }
        else {
  
            //Conver Return Data Object to string
            const result = JSON.parse(JSON.stringify(recordset));
  
            //create new xlsx file used for export data from database
            const workbookExport = new excel.Workbook();
            const worksheetExport = workbookExport.addWorksheet("My Sheet");
  
            //xlsx file header and find the database table column key 
            worksheetExport.columns = [
                // { header: "Id", key: "id", width: 10 },
                { header: "Channel Partner ID", key: "partner", width: 10 },
                { header: "Sales Org", key: "sales", width: 32 },
                { header: "Debit Memo Number", key: "debit", width: 32 },
                { header: "Reporting Period Start Date (YYYYMMDD)", key: "createdate", width: 15 },
                { header: "Reporting Period End Date (YYYYMMDD)", key: "lastupdate", width: 15 },
                { header: "Ship To End Customer unique ID", key: "custcode", width: 15 },
                { header: "Ship To End Customer Name Line 1", key: "name", width: 15 },
                { header: "Ship To End Customer Name Line 2", key: "name2", width: 15 },
                { header: "Ship To End Customer Address -Line 1", key: "addr", width: 15 },
                { header: "Ship To End Customer Address -Line 2", key: "addr2", width: 15 },
                { header: "Ship To End Customer City", key: "city", width: 15 },
                { header: "Ship To End Customer Region", key: "region", width: 15 },
                { header: "Ship To End Customer Postal Code", key: "shipmethod", width: 15 },
                { header: "Ship To End Customer Country", key: "country", width: 15 },
                { header: "Material-Catalog/Short ID", key: "material", width: 15 },
                { header: "Material UPC", key: "upc", width: 15 },
                { header: "3M SKU number", key: "prodcode", width: 15 },
                { header: "Distributor or 3M Material Description", key: "desp", width: 15 },
                { header: "Invoice Date (YYYYMMDD)", key: "doc_date", width: 15 },
                { header: "Invoice Number", key: "doc_no", width: 15 },
                { header: "Quantity Ship ped/Returned", key: "qty", width: 15 },
                { header: "Unit of Measurement(sold to customer)", key: "unit", width: 15 },
                { header: "Distributor Buying Price from 3M per unit(column V)", key: "buying", width: 15 },
                { header: "Channel Partner Extended Cost * utd_cost", key: "utd_cost", width: 15 },
                { header: "Currency Code", key: "code", width: 15 },
                { header: "LEAVE BLANK", key: "blank", width: 15 },
                { header: "LEAVE BLANK", key: "blank2", width: 15 },
                { header: "3M Chargeback Agreement Number", key: "agreement", width: 15 },
                { header: "Buying Unit cost", key: "cost", width: 15 },
                { header: "Unit Chargeback Claim in $", key: "claim", width: 15 },
                
            ];
  
            //Fix data
            let a = 83391;
            let b = 6079;
            let c = "SG";
            let d = 123456;
            let e = "SGD";
            let f = "PDR5678";
            let g = 0.2;
            //let aaa = "select doc_date , sinvdet.qty * stock.utd_cost AS total_price FROM sinvdet , stock";
  
            //Add database data to xlsx file
            for (let i = 0; i < result.recordset.length; i++) {
              worksheetExport.addRow({
                    // id: result.recordset[i].id,
                    partner: a,
                    sales: b,
                    debit: result.recordset[i].debit,
                    //doc_date: result.recordset[i].doc_date,
                    custcode: result.recordset[i].custcode,
                    name: result.recordset[i].name,
                    name2: result.recordset[i].name2,
                    createdate: result.recordset[i].createdate,
                    lastupdate: result.recordset[i].lastupdate,
                    addr: result.recordset[i].addr,
                    addr2: result.recordset[i].addr2,
                    city: c,
                    region: c,
                    shipmethod: d,
                    country: c,
                    material: result.recordset[i].material,
                    upc: result.recordset[i].upc,
                    prodcode: result.recordset[i].prodcode,
                    desp: result.recordset[i].desp,
                    doc_date: result.recordset[i].doc_date,
                    doc_no: result.recordset[i].doc_no,
                    qty: result.recordset[i].qty,
                    unit: result.recordset[i].unit,
                    buying: result.recordset[i].buying,
                    utd_cost: result.recordset[i].utd_cost,
                    code: e,
                    blank: result.recordset[i].blank,
                    blank2: result.recordset[i].blank2,
                    agreement: f,
                    cost: result.recordset[i].cost,
                    claim: g,
                
                });
            }
            const remote = require('@electron/remote');
            const { dialog } = remote;
  
            dialog.showSaveDialog({
              title: "Save file", 
              filters :[
                {name: 'XLSX File', extensions: ['xlsx']},
                {name: 'All Files', extensions: ['*']}
              ]
  
          }).then((filePath_obj)=>{
              if (filePath_obj.canceled){
                // console.log("canceled")
              }                
              else{
                //Generate a xlsx file 
                workbookExport.xlsx.writeFile(filePath_obj.filePath).then(function () {
                  dialogs.alert("Export File Successful");
                });
  
                  console.log('absolute path: ',filePath_obj.filePath);
              }
          });
  
            
        }
      });
    });
  }catch(err){
    dialogs.alert(err);
    console.log(err);
  }
  }