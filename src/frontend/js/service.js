/** @namespace Frontend/service */

/** 
 * common message loading. 
 * @constant {string} messWait 
 * @memberof Frontend/service 
 */
const messWait= `Please wait <br/> <div class="spinner-border text-info mt-3" role="status"><span class="sr-only">Loading...</span></div>`;

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Html table (read only fields)
 * @function genTable
 * @memberof Frontend/service
 * @param {Array<object>} list this array will fill with backend information
 * @param {number} offset change index rows
 * @returns {string} HTML Table rows
 */
const genTable= ( list=[], offset=0 ) => {
  let table_str= ``;
  if(list.length>0){
    for (let i= 0; i < list.length; i++) {
      table_str+= `
      <tr data-toggle="tooltip" data-placement="right" title="Open element in a new Tab">
        <th scope="row">${ ((offset-1) * 20) + (i+1)}</th>
        <td>${list[i]['vin']|| ' ' }</td>
        <td>${list[i]['vehicle']|| ' ' }</td>
        <td>${list[i]['manufacturer']|| ' ' }</td>
        <td>${list[i]['model']|| ' ' }</td>
        <td>${list[i]['type']|| ' ' }</td>
        <td>${list[i]['fuel']|| ' ' }</td>
        <td>${list[i]['color']|| ' ' }</td>
      </tr>`;
    };
  };
  return table_str;
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Html table (input editable fields)
 * @function genModtable
 * @memberof Frontend/service
 * @param {Array<object>} list this array will fill with backend information
 * @param {number} offset change index rows
 * @returns {string} HTML Table rows
 */
const genModtable= ( list=[], offset=0 ) => {
  let table_str= ``;  
  if(list.length>0){
    for (let i= 0; i < list.length; i++) {
      table_str+= `
      <tr data-toggle="tooltip" data-placement="right" title="Open element in a new Tab">
        <th scope="row">${ ((offset-1) * 20) + (i+1)}</th>
        <td> <input type="text" class="form-control" value="${ list[i]['vin']|| ' ' }" > </td>
        <td> <input type="text" class="form-control" value="${ list[i]['vehicle']|| ' ' }" > </td>
        <td> <input type="text" class="form-control" value="${ list[i]['manufacturer']|| ' ' }" > </td>
        <td> <input type="text" class="form-control" value="${ list[i]['model']|| ' ' }" > </td>
        <td> <input type="text" class="form-control" value="${ list[i]['type']|| ' ' }" > </td>
        <td> <input type="text" class="form-control" value="${ list[i]['fuel']|| ' ' }" > </td>
        <td> <input type="text" class="form-control" value="${ list[i]['color']|| ' ' }" > </td>
      </tr>`;
    };
  };
  return table_str;
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Html filled form 
 * @function genArticle
 * @memberof Frontend/service
 * @param {Array<object>} list this array will fill with backend information
 * @param {boolean} edit change editable or read only inputs
 * @returns {string} HTML form with multiple inputs
 */
const genArticle= ( list=[], edit=false ) => {
  let form_str= ``;
  if(list){
    for (const i in list) {
      const onlyread= ( i== 'vin' || !edit ) ? 'disabled' : '';
      form_str+= `
        <div class="form-group col-lg-5 col-sm-10 col-12 mx-auto">
          <label>${i}</label>
          <input id="${i}" type="text" class="form-control" value="${list[i]}" ${onlyread}>
        </div>`;
    };
    if( edit ){
      form_str+= `
        <section class="col-12 text-center mt-5" role="group">
          <button type="submit" class="btn btn-info">
            Save changes <i class="fas fa-folder-plus pl-2"></i>
          </button>
          <button type="button" class="btn btn-primary">
            Create random values <i class="fas fa-random pl-2"></i>
          </button>
          <button type="button" class="btn btn-danger">
            Delete article <i class="fas fa-random pl-2"></i>
          </button>
        </section>`;
    }
  };
  return form_str;
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Html empty form
 * @function genEmpty
 * @memberof Frontend/service
 * @param {Array<object>} list this array will fill with backend information
 * @returns {string} HTML form with multiple empty inputs
 */
const genEmpty= ( list=[] ) => {
  let form_str= ``;
  if(list){
    form_str= list.map( prop => {
      return `
        <div class="form-group col-lg-5 col-10 mx-auto">
          <label>${prop}</label>
          <input id="${prop}" type="text" class="form-control"  ${ prop == "vin" ? 'required' : '' }>
        </div>`;
    }).join("");
    form_str+= `
      <section class="col-12 text-center mt-5" role="group">
        <button type="submit" class="btn btn-info">
          Save changes <i class="fas fa-folder-plus pl-2"></i>
        </button>
        <button type="button" class="btn btn-primary">
          Create random values <i class="fas fa-random pl-2"></i>
        </button>
      </section>`;
  };
  return form_str;
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Html card Bootstrap-alert
 * @function alertShow
 * @memberof Frontend/service
 * @param {object} Alert Bootstrap alert class
 * @param {string} id HTML tag id where filled with this alert
 * @param {number} time tiemout count for dismiss alert
 * @param {string} mess Body message
 * @returns {{ alert: HTMLElement, native: Element }} return alert body and alert methods object
 */
const alertShow= ( Alert, id="" , time= 1000 , mess="" ) => {        //Create a Html card alert
  const alert= document.getElementById(`${id}`);
  alert.innerHTML= `
    <div class="alert alert-primary mb-0 text-center alert-dismissible fade show" role="alert">
      ${mess}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;
  const native= new Alert(`#${id} div.alert`);
  setTimeout(() => native.close() , time);
  return { alert , native };
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Html Bootstrap-Modal
 * @function modalShow
 * @memberof Frontend/service
 * @param {object} Modal Bootstrap Modal class
 * @param {string} id HTML tag id where filled with this Modal
 * @param {number} type css style type 1 or type 2
 * @param {string} body modal body with HTML tags and text
 * @returns {{native: Element, modal: HTMLElement, $confirmed: Element }} return modal method object, modal body element and confirmed button element
 */
const modalShow= ( Modal , id="" , type=1 , body="" ) =>{            //Create a Html Modal empty
  const modal= document.getElementById(`${id}`);  
  const random= Math.floor(Math.random() * 100);
  modal.innerHTML= `
    <div id="modal${random}" class="modal fade modalT${type}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <section class="modal-content rounded-0">${body}</section>
      </div>
    </div>`;
  const native= new Modal(`#modal${random}`);             //native.setContent(body)
  native.show();
  const $confirmed= modal.querySelector('.confirmed');
  return { native , modal , $confirmed };
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Html Modal body with a button
 * @function mBodyBTN1
 * @memberof Frontend/service
 * @param {string} message string HTML tags and text
 * @returns {string} return HTML modal body
 */
const mBodyBTN1= ( message="" )=>{ 
  return `
    <div class="modal-header">
      <h5 class="modal-title text-center w-100 pt-2">INVENTORY</h5>
      <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
    <div class="modal-body text-center">
      ${message}
    </div>
    <div class="modal-footer">
      <div class="btn-group btn-block" role="group">
        <button type="button" class="btn w-100" data-dismiss="modal">OK</button>
      </div>
    </div>`;
}

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Html Modal body with 2 buttons
 * @function mBodyBTN2
 * @memberof Frontend/service
 * @param {string} message string HTML tags and text
 * @param {string} textL text button left
 * @param {string} textR text button rigth
 * @returns {string} return HTML modal body
 */
const mBodyBTN2= ( message="" , textL= "YES" , textR= "CANCEL" )=>{
  return `
    <div class="modal-header">
      <h5 class="modal-title text-center w-100 pt-2">INVENTORY</h5>
      <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
    <div class="modal-body text-center">
      ${message}
    </div>
    <div class="modal-footer">
      <div class="btn-group btn-block" role="group">
        <button type="button" class="btn w-50 confirmed">${textL}</button>
        <button type="button" class="btn w-50" data-dismiss="modal">${textR}</button>
      </div>
    </div>`;
}

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Html card toast from user array
 * @function genUsers
 * @memberof Frontend/service
 * @param {Array<object>} users list user with objects
 * @param {Object} moment Class moment
 * @returns {string} return HTML toast space
 */
const genUsers= ( users=[], moment ) => {
  if(users.length > 0){
    return users.map( (r,i) => {      
      return `
        <div id="${r['_id']}" class="col-sm-6 p-1">
          <div class="toast border-primary h-100">
            <div class="toast-header" >
              <span class="badge badge-info">${i + 1}</span> 
              <strong class="mr-auto pl-2 text-capitalize">${r['name']}</strong><small>${ moment(r['date']).format("D-MMM-YY") }</small>
            </div>
            <div class="toast-body py-1">
              <section class="row">
                <div class="col-6">
                  <p class="mb-1">Departamentos autorizados</p>${ r['depts'].map( d => { return d } ) }
                </div>
                <div class="col-6 text-right">

                  <p class="my-1">${ r.hasOwnProperty('fullname') ? r['fullname'] : r['name'] }</p>
                  <p class="my-1">Nivel #${r['level']} </p>
                  <p class="my-1">${r['phone'] || ' '} </p>
                  <p class="mb-3"></p> 

                </div>
                <div class="col-12">
                  <div class="btn-group w-100" role="group">
                    <button type="button" id="btne${r['_id']}" class="btn btn-info btn-sm w-50">
                      Editar <i id="btne${r['_id']}" class="fas fa-tools pl-2"></i>
                    </button>
                    <button type="button" id="btnd${r['_id']}" class="btn btn-primary btn-sm w-50">
                      Eliminar <i id="btnd${r['_id']}" class="fas fa-dumpster-fire pl-2"></i>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>`;
    }).join('');
  }
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

module.exports= { genTable, genModtable, genArticle, genEmpty, alertShow, modalShow, mBodyBTN1, mBodyBTN2 , messWait, genUsers };
