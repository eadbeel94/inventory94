/** @namespace Frontend/01-login */

import './style.css';

/** 
 * Call Modal class from boostrap native
 * @const {class} Modal
 * @memberof Frontend/01-login
 */
import Modal from 'bootstrap.native/dist/components/modal-native.esm.js';
/** 
 * Call Alert class from boostrap native
 * @const {class} Alert
 * @memberof Frontend/01-login
 */
import Alert from 'bootstrap.native/dist/components/alert-native.esm.js';
/**
 * Call local methods from service
 * @typedef {object} service
 * @property {Function} alertShow show an Bootstrap alert in specify area
 * @property {Function} modalShow show an Bootstrap modal in specify area
 * @property {Function} mBodyBTN1 return string with a button for a Modal
 * @memberof Frontend/01-login
 */
const { alertShow , modalShow , mBodyBTN1 } = require('../../js/service.js');
/** 
 * HTML input where typing username
 * @type {HTMLElement}
 * @memberof Frontend/01-login
 */
const inp_name = document.getElementById('inp_name');   
/** 
 * HTML input where typing password
 * @type {HTMLElement}
 * @memberof Frontend/01-login
 */  
const inp_pass = document.getElementById('inp_pass');     
/** 
 * Variable contain IP for using any fetch
 * @type {string}
 * @memberof Frontend/01-login
 * @todo I need to delete in production
 */  
const IP= process.env.NODE_ENV === 'production' ? '' : `http://localhost:3300`;
/**
 * Check last error on passport authentification process throw fetch and show return information in alert card
 * @callback DOMContentLoaded 
 * @memberof Frontend/01-login
 */
document.addEventListener("DOMContentLoaded", () => {
  fetch(`${IP}/api/auth/status`)                              
  .then(res0 => {return res0.json()})
  .catch(err => modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )
  .then(data => {       
    if( data.hasOwnProperty('message') && data.status )
      alertShow( Alert , 'spc_alert' , 2 * 1000 , data.message );
  });
});
/**
 * autocomplete invite pass field
 * @callback inp_name-keyup 
 * @memberof Frontend/01-login
 */
inp_name.addEventListener('keyup', () =>{                     //autocomplete invite pass field
  if((String(inp_name.value)).toLowerCase() == 'invitado')
    inp_pass.value = 'invitado';
});