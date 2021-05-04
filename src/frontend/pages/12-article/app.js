/** @namespace Frontend/12-article */

import './style.css';

/**
 * Call vehicle module from faker
 * @typedef {object} faker
 * @property {object} vehicle include methods for get random vehicles information
 * @memberof Frontend/12-article
 */
import { vehicle } from 'faker';
/** 
 * Call Modal class from boostrap native
 * @const {class} Modal
 * @memberof Frontend/12-article
 */
import Modal from 'bootstrap.native/dist/components/modal-native.esm.js';
/**
 * Call local methods from service
 * @typedef {object} service
 * @property {Function} genArticle fill HMTL form using api information
 * @property {Function} genEmpty fill HMTL form with empty inputs
 * @property {Function} modalShow show an Bootstrap modal in specify area
 * @property {Function} mBodyBTN1 return string with a button for a Modal
 * @property {Function} mBodyBTN2 return string with two button for a Modal
 * @property {Function} messWait show common message please wait
 * @memberof Frontend/12-article
 */
const { 
  genArticle, 
  genEmpty, 
  modalShow, 
  mBodyBTN1, 
  mBodyBTN2, 
  messWait 
} = require('../../js/service.js');
/** 
 * Variable contain IP for using any fetch
 * @type {string}
 * @memberof Frontend/12-article
 * @todo I need to delete in production
 */ 
const IP= process.env.NODE_ENV === 'production' ? '' : `http://localhost:3300`;
/** 
 * get params from url in this page
 * @type {URLSearchParams}
 * @memberof Frontend/12-article
 */ 
const urlParams = new URLSearchParams(window.location.search);
/** 
 * HTML form that contain all inputs
 * @type {HTMLElement}
 * @memberof Frontend/12-article
 */ 
const $frm_main = document.getElementById('frm_main');
/** 
 * HTML section that contain all inputs
 * @type {HTMLElement}
 * @memberof Frontend/12-article
 */ 
const $sec_inps= $frm_main.querySelector('section.form-group');
/** 
 * HTML section that contain square with image tag
 * @type {HTMLElement}
 * @memberof Frontend/12-article
 */
const $sec_image = document.querySelector('#sec_images img');
/** 
 * HTML label where show account name
 * @type {HTMLElement}
 * @memberof Frontend/12-article
 */  
const $lbl_accountn = document.getElementById('lbl_accountn');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Get information into form and send to backend
 * @function processData
 * @memberof Frontend/12-article
 * @param {Event} ev capture mouse event
 * @param {boolean} edit if article is new or is edited
 */
const processData= ( ev, edit=false )=>{
  ev.preventDefault();                          //cancel reload and show modal confirmation
  const { $confirmed }= modalShow( Modal, "sec_modal", undefined, mBodyBTN2('Do you wanna save these information?' ) );

  $confirmed.addEventListener('click', ()=>{    //If user pressed YES then send information to backend
    modalShow( Modal, "sec_modal", undefined, mBodyBTN1(messWait) );  //Show modal with please wait message
    const send= {};
    for (let i = 0; i < 7; i++)
      send[`${ev.target[i].id}`]= ev.target[i].value;       //Create a object with all input information
    
    fetch(`${IP}/api/article/${ edit ? 'edit' : 'add' }`, {   
        method: 'POST',
        body: JSON.stringify(send),
        headers:{ 'Content-Type': 'application/json' }
      }).then(res0 => { return res0.json() })
        .catch(err =>  modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )
        .then( res => {   //Show modal with information
          modalShow( Modal , "sec_modal" , undefined, mBodyBTN1(res.status ? `Changes saved successfully` : `Error`) )
          setTimeout(() => { res.status && location.reload();  }, 1000);
        });
  });
  return null;
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Delete article and send its ID to backend
 * @function deleteData
 * @memberof Frontend/12-article
 * @param {Event} ev capture mouse event
 */
const deleteData= ( ev )=>{
  ev.preventDefault();
  const { $confirmed }= modalShow( Modal, "sec_modal", 2, mBodyBTN2('Do you wanna delete this article?') );

  $confirmed.addEventListener('click', ()=>{
    modalShow( Modal, "sec_modal", undefined, mBodyBTN1(messWait) );  //Show modal with please wait message

    fetch(`${IP}/api/article/delete?vin=${document.getElementById('vin').value}`,{ method: 'DELETE' })  //Send vin code
      .then(res0 => { return res0.json() })
      .catch(err =>  modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )
      .then( async res => {   //Show modal with information
        modalShow( Modal , "sec_modal" , undefined, mBodyBTN1(res.status ? `Article deleted successfully` : `Error`) )
        setTimeout(() => { res.status && window.close(); }, 1000);
      });
  });
  return null;
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create random vehicle's values using faker library
 * @function genRandom
 * @memberof Frontend/12-article
 * @param {*} vin set vin value if article need be edited
 * @param {number} random set random numer for get random image based on this number
 */
const genRandom= ( vin=false, random=0 ) =>{
  document.getElementById('vehicle').value=       vehicle.vehicle();  
  document.getElementById('color').value=         vehicle.color();  
  document.getElementById('fuel').value=          vehicle.fuel();  
  document.getElementById('manufacturer').value=  vehicle.manufacturer();  
  document.getElementById('model').value=         vehicle.model();  
  document.getElementById('type').value=          vehicle.type();  
  vin && ( document.getElementById('vin').value=  vehicle.vin() );  
  $sec_image.src= `https://loremflickr.com/320/240/car?random=${random}`;
  return null;
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Search article using vin code and fill information in a form
 * @function showART
 * @memberof Frontend/12-article
 * @param {boolean} edit if article is new or is edited
 */
const showART= async ( edit=false )=> {
  try {
    const res0 = await fetch(`${IP}/api/article/find?vin=${urlParams.get('vin')}`);
    const res = await res0.json();
    if(res.hasOwnProperty('status')){
      if(res['status']){
        delete res['item']['_id'];              //delete id property
        $sec_inps.innerHTML= genArticle(res['item'], edit);   //Fill card with form
      }
    }
    const btns= $sec_inps.getElementsByTagName('button');   //Get all buttons
    if(btns.length > 0){
      $frm_main.addEventListener( 'submit', ev=> processData( ev, true ) );   //If user press btn save then send info to backend
      btns[1].addEventListener( 'click', ()=> genRandom( false, Math.random() * 100 ) );  //If user press btn random, then fill fields with random information
      btns[2].addEventListener( 'click', ev=> deleteData( ev ) );             //If user press btn delete, then send cmd to backend for erase these data
    }
  } catch (err) {   modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) );  };
  return null;
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Fill card with empty inputs fields
 * @function showNEW
 * @memberof Frontend/12-article
 */
const showNEW= async () => {
  try {
    const res0 = await fetch(`${IP}/api/article/allfields`);    //Get from server all propierties
    const res = await res0.json();
    if(res.hasOwnProperty('status'))
      res['status'] && ( $sec_inps.innerHTML= genEmpty(res['items']) );
    
    const btns= $sec_inps.getElementsByTagName('button');     //Get all buttons
    if(btns){
      //const allinp= sec_inps.getElementsByTagName('input');
      $frm_main.addEventListener( 'submit', ev=> processData( ev, false ) );  //If user press btn save, then send cmd to save these information to backend
      btns[1].addEventListener( 'click', ()=> genRandom( true, Math.random() * 100 ));    //If user press random btn then create randoms values for each field
    }
  } catch (err) {  modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) )  };
  return null;
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Check URL and fill article's field depend if new (field's empty) or is exist (fill fields)
 * @function main
 * @memberof Frontend/12-article
 * @returns null
 */
const main= ()=>{   
  switch ( urlParams.get('ed') ) {            //Check url param
    case 'nw':   showNEW();         break;    //If url content nw then show empty fields
    case 'rw':   showART( true );   break;    //If url content rw then show editable fields
    default:     showART( false );  break;    //If url content '' then show not modify inputs filled
  }

  fetch(`${IP}/api/auth/getPassport`)         //Get user information
    .then(res => {return res.json()})
    .catch(err => modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )
    .then(data => {
      if(data.hasOwnProperty('status'))
        data['status'] && ( $lbl_accountn.innerText = data['item']['name'] );
    });
};

window.onload= main;

