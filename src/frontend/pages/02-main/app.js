/** @namespace Frontend/02-welcome */

import './style.css';

/** 
 * Call Modal class from boostrap native
 * @const {class} Modal
 * @memberof Frontend/02-welcome
 */
import Modal from 'bootstrap.native/dist/components/modal-native.esm.js';
/**
 * Call local methods from service
 * @typedef {object} service
 * @property {Function} alertShow show an Bootstrap alert in specify area
 * @property {Function} modalShow show an Bootstrap modal in specify area
 * @property {Function} mBodyBTN1 return string with a button for a Modal
 * @memberof Frontend/02-welcome
 */
const { 
  modalShow, 
  mBodyBTN1 
} = require('../../js/service.js');
/** 
 * Variable contain IP for using any fetch
 * @type {string}
 * @memberof Frontend/02-welcome
 * @todo I need to delete in production
 */ 
const IP= process.env.NODE_ENV === 'production' ? '' : `http://localhost:3300`;
/** 
 * Group HTML Element buttons for each access window
 * @type {NodeListOf<Element>}
 * @memberof Frontend/02-welcome
 */  
const $btns = document.querySelectorAll('#sec_bodyM1 button');    
/** 
 * HTML label where show account name
 * @type {HTMLElement}
 * @memberof Frontend/02-welcome
 */  
const $lbl_accountn = document.getElementById('lbl_accountn');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Check auth level for unlock button/windows that user has access
 * @function main
 * @memberof Frontend/02-welcome
 * @returns null
 */
const main= ()=> {         
  fetch(`${IP}/api/auth/getPassport`)                 
    .then(res => {return res.json()} )
    .catch(err => modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )  
    .then(data => {
      if( data.hasOwnProperty('status') && data['status'] ){
        const user= data['item'];
        $lbl_accountn.innerText = user['name'];
        //alertShow( Alert , "spc_alert" , 3 * 1000 , `WELCOME AGAIN ${ user['name'].toUpperCase() }` );
        $btns[1].disabled = !(user['level'] >= 2);
        $btns[2].disabled = !(user['level'] >= 2);
        $btns[3].disabled = !(user['level'] >= 3);
        $btns[4].disabled = !(user['level'] >= 9);
      }
    });
};

window.onload= main;
/* --------------------------------------------------------------------------------------------------------------------------------------------- */