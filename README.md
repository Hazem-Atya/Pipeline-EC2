# Nest CRUD API  Pipeline

## About this repo:
A simple Nest APIs build to run different Tests -Unit test, integration test,..) and run a pipeline to run the tests, push to docker HUB and then deploy in a EC2 machine

## Built using
 
<ul>
  <li> NestJs </li>
  <li> MongoDB </li>
</ul>
   
 
## Pipeline: 
   * Run the tests
   * Push the image to docker hub (use of the commit hash as a tag)
   * Connect to EC2 machine via SSH 
   * Delete the old image, stop then delete the already running container
   * Pull the new image
   * Run the new container
  
## Tests:
   The tests are under the folder src/products/test
   The used technologies fortesting are:
   * Jest: for Unit and integration tests
   * Cypress: for E2E tests
   *  User acceptance tests: Please [Click here to see the user acceptance test plan](https://github.com/Hazem-Atya/Pipeline-EC2/blob/main/User-Acceptance-Test-Plan.pdf).
   *  
### Please visit http://ec2-3-39-232-73.ap-northeast-2.compute.amazonaws.com:3000/products to test the APIs
