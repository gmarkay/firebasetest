'use strict';

const fbURL = "https://newproj-d27fa.firebaseio.com";

const getAndListCusts = () => {
  getActiveCustomers().then(custData => {
    listCustomers(custData);
  });
};

function getActiveCustomers() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://newproj-d27fa.firebaseio.com/customers.json?orderBy="active"&equalTo=true`
    }).done(activeCusts => {
      resolve(activeCusts);
    })
      .fail(error => {
        console.log('therewas an error', error.statusText);
      });
  });
}


$("#addCustomer").click(function () {

  let custObj = {
    age: $("#custAge").val(),
    name: $("#custName").val(),
    member_level: $("#custLevel").val(),
    active: true
  };
  addCustomer(custObj);
});


//update

function updateCust(id, member_level) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${fbURL}/customers/${id}.json`,
      method: "PATCH",
      data: JSON.stringify({ member_level })
    }).done(data => {
        getAndListCusts();
    });
  });
}

//delete

function deleteCust(id) {
  // console.log()
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://newproj-d27fa.firebaseio.com/customers/${id}.json`,
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


function listCustomers(custData) {
  // console.log("custs", custData);
  let custArray = [];
  if (custData) {

    let keys = Object.keys(custData);
    keys.forEach(key => {
      custData[key].id = key;
      custArray.push(custData[key]);
    });
  }
  // console.log(custArray);
  $("#customers").html("");
  custArray.forEach(cust => {
    $("#customers").append(
      `<h3>${cust.name}</h3>
      <p> ${cust.age}</p>
      <p> ${cust.member_level}</p>
      <input type="text" class="custForm" placeholder="level">
      <button id="${cust.id}" class="updateCust">updateCat</button>
       <button id="${cust.id
      }" class="deleteCust">delete</button>`
    );
  });
}



function addCustomer(newCust) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${fbURL}/customers.json`,
      method: "POST",
      data: JSON.stringify(newCust)
    }).done(customer => {
      // console.log(catId);
      getAndListCusts();
    });
  });
}
getAndListCusts();

$(document).on("click", ".deleteCust", function () {
  let custId = $(this).attr("id");
  // console.log("custId", custId);
  deleteCust(custId)
    .then(() => {
      alert("Cusomter deleted");
      return getActiveCustomers();
    })
    .then(custs => {
      listCustomers(custs);
    })
    .catch(err => {
      console.log("oops", err);
    });
});


$(document).on("click", ".updateCust", function(){
  // console.log('updateCat clicked');

  let id = $(this).attr("id");
  updateCust(id, $(this).prev(".custForm").val());
});
