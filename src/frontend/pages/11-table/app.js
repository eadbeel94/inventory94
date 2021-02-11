/** @namespace Frontend/11-table */

import './style.css';

/** 
 * Call Modal class from boostrap native
 * @const {class} Modal
 * @memberof Frontend/11-table
 */
import Modal from 'bootstrap.native/dist/components/modal-native.esm.js';
/** 
 * Call Alert class from boostrap native
 * @const {class} Alert
 * @memberof Frontend/11-table
 */
import Alert from 'bootstrap.native/dist/components/alert-native.esm.js';
/**
 * Call local methods from service
 * @typedef {object} service
 * @property {Function} genTable fill HMTL Table using api information
 * @property {Function} alertShow show an Bootstrap alert in specify area
 * @property {Function} modalShow show an Bootstrap modal in specify area
 * @property {Function} mBodyBTN1 return string with a button for a Modal
 * @memberof Frontend/11-table
 */
const { genTable , alertShow , modalShow , mBodyBTN1 } = require('../../js/service.js');
/** 
 * Variable contain IP for using any fetch
 * @type {string}
 * @memberof Frontend/11-table
 * @todo I need to delete in production
 */ 
const IP= process.env.NODE_ENV === 'production' ? '' : `http://localhost:3300`;
/** 
 * get params from url in this page
 * @type {URLSearchParams}
 * @memberof Frontend/11-table
 */ 
const urlParams = new URLSearchParams(window.location.search);
/** 
 * HTML empty table where will fill artcile's information
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */  
const $spc_tfill= document.getElementById('spc_tfill');
/** 
 * HTML section where are button plus and minus
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */  
const $sec_btnpage = document.getElementById('sec_btnpage');
/** 
 * HTML section where show spinner loading
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */  
const $sec_spinner= document.getElementById('sec_spinner');
/** 
 * HTML form (left) that use for filter by article's type
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */ 
const $frm_filter = document.getElementById('frm_filter');
/** 
 * HTML form (right) that use for search by article's partial name
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */ 
const $frm_search = document.getElementById('frm_search');
/** 
 * HTML input that use for select first filter type
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */ 
const $inp_filter1 = document.getElementById('inp_filter1');
/** 
 * HTML input that use for select second filter type
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */ 
const $inp_filter2 = document.getElementById('inp_filter2');
/** 
 * HTML input that user write your search
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */ 
const $inp_search = $frm_search.querySelector('input');
/** 
 * HTML input that user select a page
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */ 
const $inp_page = document.getElementById('inp_page');
/** 
 * HTML label where show max count articles founded
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */ 
const $lbl_count = document.getElementById('lbl_count');
/** 
 * HTML label where show account name
 * @type {HTMLElement}
 * @memberof Frontend/11-table
 */  
const $lbl_accountn = document.getElementById('lbl_accountn');
/** 
 * Group HTML Element buttons inner sec_filter tag
 * @type {NodeListOf<Element>}
 * @memberof Frontend/11-table
 */  
const $btns= document.querySelectorAll('#sec_filter .btn');
/** 
 * Global variable that storage count of articles founded
 * @type {number}
 * @memberof Frontend/11-table
 */  
var groupCount = 0;
/** 
 * storage common message "filtering data" using in alert
 * @type {string}
 * @memberof Frontend/11-table
 */ 
const messAlert= `<strong>Filtering data!</strong> please wait<div class="spinner-border text-secondary ml-2" role="status" style="width: 1rem; height: 1rem;"><span class="sr-only">Loading...</span></div>`;

/**
 * Fill table with info from API
 * @function fillPage
 * @memberof Frontend/11-table
 * @param {number} type select type=0 -> fill table without filter, type=1 -> fill table with filter, type=2 -> fill table with user's search
 * @param {number} page page number
 * @returns null
 */
const fillPage= ( type=0, page=1 )=>{                   //Fill table using fetch information from server
  let URL= `${IP}/api/table/row?ed=${urlParams.get('ed')}&page=${page}`;    
  if(type == 1){ URL= `${IP}/api/table/filter2?f1=${$inp_filter1.value}&f2=${$inp_filter2.value}&ed=${urlParams.get('ed')}&page=${page}` }
  if(type == 2){ URL=`${IP}/api/table/search1?s=${$inp_search.value}&ed=${urlParams.get('ed')}&page=${page}` }

  fetch(URL) //Get articles from my db
    .then(res0 => {return res0.json()})
    .catch(err => modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )
    .then(res => {
      if( res.hasOwnProperty('status') && res['status'] ){
        groupCount = res.hasOwnProperty('count') ? res['count'] : res['items'].length;    //Write global count
        $spc_tfill.innerHTML = genTable(res['items'],page);   //Create HTML table body using database information
        $lbl_count.innerText = groupCount;                    //Show all inventory's article counter
        $sec_spinner.classList.add('d-none');                 //Hide spinner
        if(type == 1){                                        //activate/desactivate btn based type value
          $btns[0].classList.add('active');                   
          $btns[1].classList.remove('active'); 
        }else if(type == 2){ 
          $btns[1].classList.add('active'); 
          $btns[0].classList.remove('active'); 
        };
      };
    });
  return null;
};
/**
 * Check auth level for show name account and fill table
 * @callback DOMContentLoaded 
 * @memberof Frontend/11-table
 */
document.addEventListener("DOMContentLoaded", () => { 
  fetch(`${IP}/api/auth/getPassport`)     //Get user information
    .then(res0 => {return res0.json()})
    .catch(err => modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )
    .then(res => {
      if(res.hasOwnProperty('status'))
        res['status'] && ( $lbl_accountn.innerText = res['item']['name'] );  //Show account name in label user
    });
  $inp_page.value= 1;                     //Init page integer value
  fillPage( 0 , 1 );                      //Fill table
});
/**
 * User selected an element from field filter 1 and filled filter 2 field
 * @callback $inp_filter1-change 
 * @memberof Frontend/11-table
 */
$inp_filter1.addEventListener('change', ev =>{  
  fetch(`${IP}/api/table/filter1?a=${ev.target.value}&ed=${urlParams.get('ed')}`)
    .then(res0 => {return res0.json()})
    .catch(err => console.log(err) )
    .then(res => {
      if(res.hasOwnProperty('status') && res['status']){
        const filtered= res['items'];           
        const table_str= filtered.map( item => {
          if(item && (item != " ") && (item != "")){ return `<option>${item}</option>` };
        }).join('');
        $inp_filter2.innerHTML= `<option value="" selected>Choose...</option>${table_str}`;
      }
    });
});
/**
 * User press left button into filter area and fill table based on your search
 * @callback $frm_filter-submit 
 * @memberof Frontend/11-table
 */
$frm_filter.addEventListener('submit', ev =>{  
  ev.preventDefault();
  alertShow( Alert , 'spc_alert' , 2 * 1000 , messAlert );  //Show alert message
  $inp_page.value= 1;
  fillPage( 1 , 1 );                                //Fill table with articles
});
/**
 * User press right button into filter area and fill table based on your search
 * @callback $frm_search-submit 
 * @memberof Frontend/11-table
 */
$frm_search.addEventListener('submit', ev =>{ 
  ev.preventDefault();
  alertShow( Alert , 'spc_alert' , 2 * 1000 , messAlert ); 
  $inp_page.value= 1;
  fillPage( 2 , 1 );                                //Fill table with articles
});
/**
 * User press double click in any row, then open new tab with article's info selected
 * @callback $spc_tfill-dblclick 
 * @memberof Frontend/11-table
 */
$spc_tfill.addEventListener('dblclick', ev => {
  if(ev.target.tagName == 'TD')
    window.open(`/pages/article/?ed=${urlParams.get('ed')}&vin=${String(ev.path[1].children[1].innerHTML)}`, '_blank');
});
/**
 * User press any button page, show respective information into table
 * @callback $sec_btnpage-click 
 * @memberof Frontend/11-table
 */
$sec_btnpage.addEventListener('click', ev => {
  const maxCount = groupCount > 20 ? parseInt(groupCount/20) + 1 : 1;   //Generate max count
  let actCount = $inp_page.value;                  //get actual count
  let oldval = $inp_page.value;                   

  if('inp_page' == ev.target.id){                 //Check if clicked input page pressed
    if(actCount > maxCount)                       //max limit hold
      actCount = maxCount;
  }else if('btn_minus' == ev.target.id){          //Btn minus pressed
    if(actCount > 1)
      actCount--;
  }else if('btn_plus' == ev.target.id){           //Btn plus pressed
    if(maxCount > actCount)
      actCount++;
  }

  if(oldval != actCount){                         //If value changed then...
    $inp_page.value = actCount;                   //Change page value and show respective information into table
    let type= 0;
    if( $btns[0].className.indexOf('active') >= 0 ){ type= 1 };
    if( $btns[1].className.indexOf('active') >= 0 ){ type= 2 };
    fillPage( type, actCount);
  }
});
/**
 * User fill into page number field, show respective information into table
 * @callback $inp_page-change 
 * @memberof Frontend/11-table
 */
$inp_page.addEventListener('change', () =>{
  const maxCount = groupCount > 20 ? parseInt(groupCount/20) + 1 : 1;
  let actCount = $inp_page.value;                 //get actual count

  if( actCount > maxCount ){ actCount = maxCount; } //max limit hold
  if( actCount < 1 ){ actCount = 1; }               //min limit hold
    
  $inp_page.value = actCount;                       //If value changed then...
  let type= 0;                                      //Change page value and show respective information into table
  if( $btns[0].className.indexOf('active') >= 0 ){ type= 1 };
  if( $btns[1].className.indexOf('active') >= 0 ){ type= 2 };
  fillPage( type, actCount);
});