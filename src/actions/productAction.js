import * as types from '../constants/actionTypes';


// example of a thunk using the redux-thunk middleware
export function loadProduct(category) {
  return function (dispatch) {
    $.ajax({
      url: "https://api.github.com/users/mralexgray/repos",
      method: 'get',
      dataType: 'json',
      success: function (data) {
        var products = [];
        data.forEach(function(product) {
          if(product.Name.indexOf(category)!=-1)
            products.push(product)
        }, this);
        return dispatch({
          type: types.LOAD_PRODUCT,
          products: products,
          category
        })
      },
      error: function (xhr, status, err) {
        console.log(err)
        console.log(status)
        console.log(xhr)
      }
    });
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings

  };
}

export function addProduct(product ,category) {
  return function (dispatch) {
    $.ajax({
      url: "https://api.github.com/users/mralexgray/repos",
      method: 'get',
      dataType: 'json',
      success: function (data) {
        var products = [];
        products.push(product)
        data.forEach(function(productElement) {
          if(productElement.Name.indexOf(category)!=-1)
              products.push(productElement)
        }, this);

        return dispatch({
          type: types.ADD_PRODUCT,
          products: products,
          category
        })
      },
      error: function (xhr, status, err) {
        console.log(err)
        console.log(status)
        console.log(xhr)
      }
    });
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings

  };
}

export function editProduct(product ,category) {
  return function (dispatch) {
    $.ajax({
      url: "https://api.github.com/users/mralexgray/repos",
      method: 'get',
      dataType: 'json',
      success: function (data) {
        var products = [];

        data.forEach(function(productElement) {
          if(productElement.Name.indexOf(category)!=-1)

            if(productElement.Id == product.Id){
              products.push(product)
            }
            else
              products.push(productElement)
        }, this);

        return dispatch({
          type: types.EDIT_PRODUCT,
          products: products,
          category
        })
      },
      error: function (xhr, status, err) {
        console.log(err)
        console.log(status)
        console.log(xhr)
      }
    });
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings

  };
}

export function deleteProduct(Id ,category) {
  return function (dispatch) {
    $.ajax({
      url: "https://api.github.com/users/mralexgray/repos",
      method: 'get',
      dataType: 'json',
      success: function (data) {
        var products = [];

        data.forEach(function(productElement) {
          if(productElement.Name.indexOf(category)!=-1)

            if(productElement.Id != Id){
              products.push(productElement)
            }

        }, this);

        return dispatch({
          type: types.EDIT_PRODUCT,
          products: products,
          category
        })
      },
      error: function (xhr, status, err) {
        console.log(err)
        console.log(status)
        console.log(xhr)
      }
    });
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings

  };
}

