'use strict';

const fbURL = "https://newproj-d27fa.firebaseio.com";

function getActiveCustomers() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://newproj-d27fa.firebaseio.com/customers.json?orderBy="active"&equalTo=true`
    }).done(activeCusts => {
      resolve(activeCusts);
    }).fail(error => {
      console.log('therewas an error', error.statusText);

    });
  });
}
// getActiveCustomers();

$("#addCustomer").click(function() {

  let custObj = {
    age: $("#custAge").val(),
    name: $("#custName").val(),
    member_level: $("#custLevel").val(),
    active: true
  };
  addCustomer(custObj);
});

//update
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
  let keys = Object.keys(custData);
  console.log(keys, 'there are the cust keys');
  keys.forEach(key => {
    custData[key].id = key;
    console.log(custData[key], 'custData');

    custArray.push(custData[key]);
  });
  // console.log(custArray);
  $("#customers").html("");
  custArray.forEach(cust => {
    $("#customers").append(
      `<h3>${cust.name}</h3>
      <p> ${cust.description}</p>
      <input type="text" class="custForm" placeholder="description">
      <button id="${cust.id}" class="updateCust">updateCat</button>
       <button id="${cust.id
        }" class="deleteCust">delete</button>`
    );
  });
}

const getAndListCusts = () => {
  getActiveCustomers().then(custData => {
      listCustomers(custData);
  });
};

function addCustomer(newCust) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${fbURL}/customers.json`,
      method: "POST",
      data: JSON.stringify(newCust)
    }).done(category => {
      // console.log(catId);
      getAndListCusts();
    });
  });
}
getAndListCusts();

$(document).on("click", ".deleteCust", function() {
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

// function addCustomer(newCustomer) {
//   return new Promise((resolve, reject) => {
//     $.ajax({
//       url: `${fbURL}/customers.json`,
//       method: "POST",
//       data: JSON.stringify(newCustomer)
//     }).done(customerId => {
//       console.log(customerId);
//     });
//   });
// }
