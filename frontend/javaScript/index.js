'use strict';

async function getAllActivities() {
  await fetch('http://localhost:8080/my_activities_backend/rest/activity/all', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => fillActivityTable(JSON.stringify(data)));
}

async function getAllProducts() {
  const response = await fetch(
    'http://localhost:8080/marinana-jorge-proj2/rest/products/all'
  );
  const products = await response.json();
  return products;
}
