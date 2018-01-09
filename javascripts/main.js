"use strict";

const fbURL = "https://newproj-d27fa.firebaseio.com";


// firebase module
function getCats() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://newproj-d27fa.firebaseio.com/categories.json"
    })
      .done(cats => {
        resolve(cats);
      })
      .fail(error => {
        console.log("uh-oh", error.statusText);
        reject(error);
      });
  });
}

function addCategory(newCat) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${fbURL}/categories.json`,
      method: "POST",
      data: JSON.stringify(newCat)
    }).done(newCat => {
      // console.log(catId);
      listCats(newCat);

    });
  });
}
$("#addCategory").click(function() {
  console.log("addCat called");

  let custObj = {
    name: $("#catName").val(),
    description: $('#catDesc').val()
  };
  addCategory(custObj);
});


function updateCat(id, description) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${fbURL}/categories/${id}.json`,
      method: "PATCH",
      data: JSON.stringify({ description })
    }).done(data => {
      console.log("updated obj", data);
    });
  });
}

function deleteCat(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://newproj-d27fa.firebaseio.com/categories/${id}.json`,
      method: "DELETE"
    })
      .done(data => {
        resolve(data);
      })
      .fail(error => {
        console.log("uh-oh", error.statusText);
        reject(error);
      });
  });
}

function addCustomer(newCustomer) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${fbURL}/customers.json`,
      method: "POST",
      data: JSON.stringify(newCustomer)
    }).done(customerId => {
      console.log(customerId);
    });
  });
}

function getActiveCustomers() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://newproj-d27fa.firebaseio.com/customers.json?orderBy="name"&equalTo=true`
    }).done(activeCusts => {
      console.log(activeCusts);
    });
  });
}
getActiveCustomers();

// end of FB module

function listCats(catData) {
  console.log("cats", catData);
  let catsArr = [];
  let keys = Object.keys(catData);
  keys.forEach(key => {
    catData[key].id = key;
    catsArr.push(catData[key]);
  });
  console.log(catsArr);
  $("#categories").html("");
  catsArr.forEach(cat => {
    $("#categories").append(
      `<h3>${cat.name}</h3>
      <input type="text" class="catForm" placeholder="description">
      <button id="${cat.id}" class="updateCat">updateCat</button>
        <button id="${
          cat.id
        }" class="deleteCat">delete</button>`
    );
  });
}

getCats().then(catData => {
  listCats(catData);
});

$(document).on("click", ".deleteCat", function() {
  let catId = $(this).attr("id");
  console.log("catId", catId);
  deleteCat(catId)
    .then(() => {
      alert("Category deleted");
      return getCats();
    })
    .then(cats => {
      listCats(cats);
    })
    .catch(err => {
      console.log("oops", err);
    });
});

$("#addCustomer").click(function() {
  console.log("addCust called");

  let custObj = {
    age: $("#custAge").val(),
    name: $("#custName").val(),
    member_level: $("#custLevel").val(),
    active: true
  };
  addCustomer(custObj);
});

$(document).on("click", ".updateCat", function(){
  console.log('updateCat clicked');

  let id = $(this).attr("id");
  updateCat(id, $(this).prev(".catForm").val());
});
