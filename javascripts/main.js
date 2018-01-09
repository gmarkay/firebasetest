"use strict";
const customers = require('./customers');
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


$("#addCategory").click(function() {

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



// end of FB module

function listCats(catData) {
  // console.log("cats", catData);
  let catsArr = [];
  if(catData){
  let keys = Object.keys(catData);
  // console.log(keys, 'there are the keys');
  keys.forEach(key => {
    // console.log(catData, 'catData');
    catData[key].id = key;
    catsArr.push(catData[key]);
  });
}
  // console.log(catsArr);
  $("#categories").html("");
  catsArr.forEach(cat => {
    $("#categories").append(
      `<h3>${cat.name}</h3>
      <p> ${cat.description}</p>
      <input type="text" class="catForm" placeholder="description">
      <button id="${cat.id}" class="updateCat">updateCat</button>
        <button id="${
          cat.id
        }" class="deleteCat">delete</button>`
    );
  });
}

const getAndListCats = () => {
getCats().then(catData => {
  listCats(catData);
});
};

function addCategory(newCat) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${fbURL}/categories.json`,
      method: "POST",
      data: JSON.stringify(newCat)
    }).done(category => {
      // console.log(catId);
      getAndListCats();

    });
  });
}
getAndListCats();

$(document).on("click", ".deleteCat", function() {
  let catId = $(this).attr("id");
  // console.log("catId", catId);
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


$(document).on("click", ".updateCat", function(){
  // console.log('updateCat clicked');

  let id = $(this).attr("id");
  updateCat(id, $(this).prev(".catForm").val());
});
