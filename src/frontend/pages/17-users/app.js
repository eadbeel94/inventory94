/** @namespace Frontend/17-users */

import './style.css';
/** 
 * Call day js for handle easily dates
 * @const {function} m
 * @memberof Frontend/17-users
 */
import m from 'dayjs';
/** 
 * Call Modal class from boostrap native
 * @const {class} Modal
 * @memberof Frontend/17-users
 */
import Modal from 'bootstrap.native/dist/components/modal-native.esm.js';
/**
 * Call local methods from service
 * @typedef {object} service
 * @property {Function} genUsers Create a HTML toast card for each user
 * @property {Function} modalShow show an Bootstrap modal in specify area
 * @property {Function} mBodyBTN1 return string with a button for a Modal
 * @property {Function} mBodyBTN2 return string with two button for a Modal
 * @property {Function} messWait show common message please wait
 * @memberof Frontend/17-users
 */
const { 
  modalShow, 
  mBodyBTN1, 
  mBodyBTN2, 
  messWait,
  genUsers 
} = require('../../js/service.js');
/** 
 * Variable contain IP for using any fetch
 * @type {string}
 * @memberof Frontend/17-users
 * @todo I need to delete in production
 */ 
const IP= process.env.NODE_ENV === 'production' ? '' : `http://localhost:3300`;
/** 
 * HTML input where capture user fullname
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */
const $inp_fullname = document.getElementById('inp_fullname');
/** 
 * HTML input where capture user departament's access
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */
const $inp_deps = document.getElementById('inp_deps');
/** 
 * HTML input where capture user level access
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */
const $inp_level = document.getElementById('inp_level');
/** 
 * HTML input where capture user account name
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */
const $inp_account = document.getElementById('inp_account');
/** 
 * HTML input where capture user phone number
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */
const $inp_phone = document.getElementById('inp_phone');
/** 
 * HTML input where capture user password
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */
const $inp_pass = document.getElementById('inp_pass');
/** 
 * HTML input where capture user password confirm
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */
const $inp_confirm = document.getElementById('inp_confirm');
/** 
 * HTML label where show account name
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */  
const $lbl_accountn = document.getElementById('lbl_accountn'); 
/** 
 * HTML form that contain all inputs
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */ 
const $frm_newuser = document.getElementById('frm_newuser');
/** 
 * HTML section that contain all taost's user
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */ 
const $sec_allusers = document.getElementById('sec_allusers');
/** 
 * HTML button for save user information
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */ 
const $btn_save = document.getElementById('btn_save');
/** 
 * HTML button for modify user information
 * @type {HTMLElement}
 * @memberof Frontend/17-users
 */ 
const $btn_update = document.getElementById('btn_update');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * toggle authorized vehicles
 * @function toggleV
 * @memberof Frontend/17-users
 * @param {Event} ev Mouse click event button
 * @returns null
 */
const toggleV= (ev)=>{
  ev.target.classList.toggle('active');
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Capture new all user information and send to backend
 * @function createUser
 * @memberof Frontend/17-users
 * @param {Event} ev Mouse click event form submit
 * @returns null
 */
const createUser= (ev)=>{
  ev.preventDefault();                                  //Disable page reload and show confirm modal
  const { $confirmed }= modalShow( Modal, 'sec_modal' , undefined , mBodyBTN2('Do you wanna create this new user?') );

  $confirmed.addEventListener('click', ()=>{            //If user press YES then...
    modalShow( Modal, 'sec_modal' , undefined , mBodyBTN1(messWait) );    //Show modal with message please wait
    const send= {
      name: $inp_account.value,
      fullname: $inp_fullname.value,
      phone: $inp_phone.value,
      pass: $inp_pass.value,
      confirm: $inp_confirm.value,
      depts: Array.from( $inp_deps.querySelectorAll('.active') ).map( r => { return r.innerText; }),
      level: $inp_level.value
    };

    fetch(`${IP}/api/auth/addUser`, {         //Create a object with each input value from form and send these values to backend
        method: 'POST',
        body: JSON.stringify(send),
        headers:{ 'Content-Type': 'application/json'  }
      }).then(res0 => { return res0.json() })
        .catch(err => console.log(err) )
        .then( res => {                       //Show modal with message result
          modalShow( Modal, 'sec_modal' , undefined , mBodyBTN1( res.message.length > 5 ? res.message : "Error"  ) );
          setTimeout(() => { res.status && location.reload(); }, 1000);
        });
  });
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * apture all user information and send to backend (user previously selected)
 * @function modifyUser
 * @memberof Frontend/17-users
 * @param {Event} ev Mouse click event button
 * @returns null
 */
const modifyUser= (ev)=>{   //If user press update then...
  ev.preventDefault();                          //Disable page reload and show confirm modal
  const { $confirmed }= modalShow( Modal, 'sec_modal' , undefined , mBodyBTN2(`Do you wanna modified all information for user ${$inp_account.value.toUpperCase()}?`) );

  $confirmed.addEventListener('click', ()=>{    //If user press YES then...
    modalShow( Modal, 'sec_modal' , undefined , mBodyBTN1(messWait) );    //Show modal with message please wait
    const send= {
      id: $btn_update.id.substr(3),
      name: $inp_account.value,
      fullname: $inp_fullname.value,
      phone: $inp_phone.value,
      depts: Array.from( $inp_deps.querySelectorAll('.active') ).map( r => { return r.innerText; }),
      level: $inp_level.value
    };
    $inp_pass.value.length > 0 && ( send.pass= $inp_pass.value );
    $inp_pass.value.length > 0 && ( send.confirm= $inp_pass.value );

    fetch(`${IP}/api/auth/editanUser`, {      //Create a object with each input value from form and send these modified values to backend
        method: 'POST',
        body: JSON.stringify(send),
        headers:{ 'Content-Type': 'application/json'  }
      }).then(res0 => { return res0.json() })
        .catch(err => console.log(err) )
        .then( res => {                       //Show modal with message result
          modalShow( Modal, 'sec_modal' , undefined , mBodyBTN1( res.message.length > 5 ? res.message : "Error"  ) );
          setTimeout(() => { res.status && location.reload(); }, 2000);
        });
  });
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Check if use press any button into toast user
 * @function watchCards
 * @memberof Frontend/17-users
 * @param {Event} ev Mouse click event button press
 * @returns null
 */
const watchCards= (ev)=>{
  if(ev.target.type == "button" || ev.target.tagName == "I"){   //if object pressed is a button then...
    const type = (String(ev.target.id)).slice(3,4);   //get type button
    const id = (String(ev.target.id)).substr(4);      //get id button

    if( type == "e" ){                                //If user pressed edit button
      fetch(`${IP}/api/auth/getanUser?id=${id}`)      //Get all user information selected
        .then(res0 => {return res0.json()})
        .catch(err => console.log(err))
        .then(data => {
          if(data.hasOwnProperty('status') && data.status){   
            const allbtns= Array.from( $inp_deps.querySelectorAll('.btn') );    //Get all department buttons
            allbtns.forEach( r => { r.classList.remove('active') });            //Erase pressed buttons
            data['item']['depts'].forEach( dep => {                             //Check all departmens storage for that user
              for (const j in allbtns){   (dep == allbtns[j].innerText) && ( allbtns[j].classList.add('active') );  };  //mark like active if exist into array
            });
            $inp_account.value = data['item']['name'];
            $inp_fullname.value = data['item']['fullname'];
            $inp_phone.value = data['item']['phone'];
            $inp_level.value = data['item']['level'];
            $btn_update.id= 'up-' + data['item']['_id']
          };
        });
      $btn_save.classList.add('d-none');
      $btn_update.classList.remove('d-none');
    }
    if( type == "d" ){                              //If user pressed erase button
      const name = document.getElementById(`${id}`).querySelector("div.toast-header strong");   //Get name from toast title
                                                    //Show confirm modal
      const { $confirmed }= modalShow( Modal, 'sec_modal' , undefined , mBodyBTN2(`Do you wanna delete the <strong>${name.innerText.toUpperCase()}</strong> ?`) );

      $confirmed.addEventListener('click', () =>{   //If user press "YES" then send user's id to backend for erase element into database
        modalShow( Modal, 'sec_modal' , undefined , mBodyBTN1(messWait) );    //Show modal with message please wait

        fetch(`${IP}/api/auth/delanUser?id=${id}`,{method: "DELETE"})
          .then( res0 => {return res0.json()} )
          .catch( err => console.log(err) )
          .then( res =>{
            modalShow( Modal, 'sec_modal' , undefined , mBodyBTN1( res.message.length > 5 ? res.message : "Error"  ) );
            setTimeout(() => { res.status && location.reload(); }, 1000);
          });
      });

    };
  };
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Check auth level for show name account, fill table and load methods
 * @function main
 * @memberof Frontend/17-users
 * @returns null
 */
const main= ()=> {  

  fetch(`${IP}/api/auth/allUsers`)            //Get all list of users
    .then(res0 => { return res0.json() })
    .catch(err => modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )
    .then( res => {
      if(res.hasOwnProperty('status'))
        res['status'] && ( $sec_allusers.innerHTML= genUsers(res['items'], m) );    //Fill card with a toast for each user
    });

  fetch(`${IP}/api/auth/getPassport`)     //Get user information
    .then(res0 => {return res0.json()})
    .catch(err => modalShow( Modal, "sec_modal", 2, mBodyBTN1(err) ) )
    .then(res => {
      if(res.hasOwnProperty('status'))
        res['status'] && ( $lbl_accountn.innerText = res['item']['name'] );  //Show account name in label user
    });

  $inp_deps.onclick= (ev) => toggleV(ev);
  $frm_newuser.onsubmit= (ev) => createUser(ev);
  $btn_update.onclick= (ev) => modifyUser(ev);
  $sec_allusers.onclick= (ev) => watchCards(ev);
};

window.onload= main;