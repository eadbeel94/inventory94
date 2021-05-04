/** @namespace Frontend/07-unauth */

import './style.css';

/** 
 * Call Modal class from boostrap native
 * @const {class} Modal
 * @memberof Frontend/07-unauth
 */
import Modal from 'bootstrap.native/dist/components/modal-native.esm.js';
/**
 * Call local methods from service
 * @typedef {object} service
 * @property {Function} modalShow show an Bootstrap modal in specify area
 * @property {Function} mBodyBTN1 return string with a button for a Modal
 * @memberof Frontend/07-unauth
 */
const { 
  modalShow, 
  mBodyBTN1 
} = require('../../js/service.js');
/** 
 * HTML label where show account name
 * @type {HTMLElement}
 * @memberof Frontend/07-unauth
 */  
const $lbl_accountn = document.getElementById('lbl_accountn');
/** 
 * Variable contain IP for using any fetch
 * @type {string}
 * @memberof Frontend/07-unauth
 * @todo I need to delete in production
 */ 
const IP= process.env.NODE_ENV === 'production' ? '' : `http://localhost:3300`;

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Check auth level for show name account
 * @function main
 * @memberof Frontend/07-unauth
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
};

window.onload= main;

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Redirect init page ended timeout time
 * @callback Timeout-5000 
 * @memberof Frontend/07-unauth
 */
setTimeout(() => {  location.href = "/";  }, 5000);

/* --------------------------------------------------------------------------------------------------------------------------------------------- */