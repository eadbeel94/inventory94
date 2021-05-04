/** @namespace Frontend/16-options */

import './style.css';
/** 
 * Call xlsx module for convert excel sheet
 * @const {object} xlsx
 * @memberof Frontend/16-options
 */
import XLSX from 'xlsx';
/** 
 * Call Modal class from boostrap native
 * @const {class} Modal
 * @memberof Frontend/16-options
 */
import Modal from 'bootstrap.native/dist/components/modal-native.esm.js';
/**
 * @property {Function} modalShow show an Bootstrap modal in specify area
 * @property {Function} mBodyBTN1 return string with a button for a Modal
 * @property {Function} mBodyBTN2 return string with two button for a Modal
 * @property {Function} messWait show common message please wait
 * @memberof Frontend/16-options
 */
const { 
  genModtable, 
  modalShow, 
  mBodyBTN1, 
  mBodyBTN2, 
  messWait  
} = require('../../js/service.js');
/** 
 * Variable contain IP for using any fetch
 * @type {string}
 * @memberof Frontend/16-options
 * @todo I need to delete in production
 */ 
const IP= process.env.NODE_ENV === 'production' ? '' : `http://localhost:3300`;
/** 
 * HTML section where user can drop excel file
 * @type {HTMLElement}
 * @memberof Frontend/16-options
 */
const $sec_dropfile = document.getElementById('sec_dropfile');
/** 
 * HTML section where will fill excel's sheet information
 * @type {HTMLElement}
 * @memberof Frontend/16-options
 */  
const $spc_tfill = document.getElementById('spc_tfill');
/** 
 * HTML section that contain all inputs into table
 * @type {HTMLElement}
 * @memberof Frontend/16-options
 */ 
const $frm_impTable = document.getElementById('frm_impTable');
/** 
 * HTML button that will use for download a excel
 * @type {HTMLElement}
 * @memberof Frontend/16-options
 */ 
const $btn_download = document.getElementById('btn_download');
/** 
 * HTML label where show account name
 * @type {HTMLElement}
 * @memberof Frontend/16-options
 */  
const $lbl_accountn = document.getElementById('lbl_accountn');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Change background color when a file are in drop area
 * @function changeBKcolor1
 * @memberof Frontend/16-options
 * @param {Event} ev Event file touch zone
 * @returns null
 */
const changeBKcolor1= (ev)=>{
  ev.preventDefault(); 
  ev.path[0].style.backgroundColor = "gray"; 
  ev.path[1].style.backgroundColor = "gray"; 
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Change background color when a file are in drop area
 * @function changeBKcolor2
 * @memberof Frontend/16-options
 * @param {Event} ev Event file touch zone
 * @returns null
 */
 const changeBKcolor2= (ev)=>{
  ev.path[0].style.backgroundColor = "rgb(43,62,81)"; 
  ev.path[1].style.backgroundColor = "rgb(43,62,81)"; 
};
/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Release excel file in drop area, then fill table with sheet information
 * @function dropFile
 * @memberof Frontend/16-options
 * @param {Event} ev Event file touch zone
 * @returns null
 */
const dropFile= (ev)=>{
  ev.preventDefault();

  if(ev.dataTransfer.items.length == 1){
    if(ev.dataTransfer.items[0].kind === 'file'){       //Get info into file and fill a table 
      const afile = ev.dataTransfer.items[0].getAsFile();
      if((afile.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")||(afile.type == "application/vnd.ms-excel")){

        afile.arrayBuffer()
          .catch( err => console.log(err) )
          .then( res => {
            const wb= XLSX.read(res, {type: 'array'});
            const ws= wb.Sheets[wb.SheetNames[0]];
            const info= XLSX.utils.sheet_to_json(ws);
            $spc_tfill.innerHTML= genModtable(info,1);
          });

      };
    };
  };
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Download an excel with all information in article's database
 * @function downFile
 * @memberof Frontend/16-options
 * @param {Event} ev Event mouse click button
 * @returns null
 */
const downFile= (ev)=>{
  fetch(`${IP}/api/options/downallTable`)         //Get all articles frrom server
    .then( res0 => {return res0.json()} )
    .catch( err => console.log(err) )
    .then( res => {                               //Transform these info in excel using XLSX library
      if(res.hasOwnProperty('status') && res['status']){                      //if response with ok then download file
        const rand= Date.now();
        const wb = XLSX.utils.book_new();
        const ws= XLSX.utils.json_to_sheet(res['items'] , { header: ['vin','vehicle','manufacturer','model','type','fuel','color'] } );
        XLSX.utils.book_append_sheet(wb, ws, `Sheet${rand }`);
        XLSX.writeFile(wb, `${rand}.xlsx`);
      };
    });
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Process all information in table and send to backend
 * @function sendTable
 * @memberof Frontend/16-options
 * @param {Event} ev Event mouse click button
 * @returns null
 */
const sendTable= (ev)=>{
  ev.preventDefault();                      //Cancel reload page and show confirmed modal
  const { $confirmed }= modalShow( Modal, 'sec_modal' , undefined , mBodyBTN2('Do you wanna save all these information?') );

  $confirmed.addEventListener('click', ()=>{          //If user press yes button
    modalShow( Modal, 'sec_modal' , undefined , mBodyBTN1(messWait) );    //Show modal with message please wait
    const send= [];
    const rows = $spc_tfill.getElementsByTagName('tr');   //Get all rows in table
    if( rows.length > 0 ){
      for (let i = 0; i < rows.length; i++) {
        const inps= rows[i].getElementsByTagName('input');    //Create object with all input information
        send.push({ 
          vin: inps[0].value,
          vehicle: inps[1].value,
          manufacturer: inps[2].value,
          model: inps[3].value,
          type: inps[4].value,
          fuel: inps[5].value,
          color: inps[6].value
        });
      };
    };

    fetch(`${IP}/api/options/upTable`, {
        method: 'POST',
        body: JSON.stringify(send),
        headers:{ 'Content-Type': 'application/json'  }
      }).then(res0 => { return res0.json() })
        .catch(err => console.log(err) )
        .then( res => {
          setTimeout(() => { res.status && (location.href = location.href);  }, 1000);
          if( !res.hasOwnProperty('status') || !res.status || res.mess.length > 5 )
            modalShow( Modal, 'sec_modal' , undefined , mBodyBTN1(res.mess.length > 5 ? "Error<br/>" + res.mess : `Error`) );
          else
            modalShow( Modal, 'sec_modal' , undefined , mBodyBTN1(`Changes saved successfully`) );
        });
  });
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Check auth level for show name account and load methods
 * @function main
 * @memberof Frontend/16-options
 * @returns null
 */
const main= ()=> {
  fetch(`${IP}/api/auth/getPassport`)     //Get user information
    .then(res0 => {return res0.json()})
    .catch(err => modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )
    .then(res => {
      if(res.hasOwnProperty('status'))
        res['status'] && ( $lbl_accountn.innerText = res['item']['name'] );  //Show account name in label user
    });
    
  $sec_dropfile.ondragover= (ev)=> changeBKcolor1(ev);
  $sec_dropfile.ondragleave= (ev)=> changeBKcolor2(ev);
  $sec_dropfile.ondrop= (ev)=> dropFile(ev);
  $btn_download.onclick= (ev)=> downFile(ev);
  $frm_impTable.onsubmit= (ev)=> sendTable(ev);
};

window.onload= main;