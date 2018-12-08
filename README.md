# Transformation of lagecy REST API to Serverless

In this repo you can find a simple NodeJs (with Express) application of REST API with three endpoints.
And the purspoe is to show you how you can levarage the capabilities of Serverless and specificly using AWS. We are going to migrate the app entierly to Serverless.

What we have is a tipicaly app with server and database. Here we have the deployed architecture of the app, it could be in EC2 or some shared/private host or even on Docker.
![REST API](/images/restapp.png)

To run the app locally we need running instance of MongoDB. For local development I recomment to use Docker, it's easy and fast.
But first let's run a container of MongoDB (there is an [official Docker image](https://hub.docker.com/_/mongo/)). When you run MongoDB, go and set your MongoDB host in config/app.config.js.

Then, we can start our Node.js server. 
If you choose Docker, in the repo you could find the docker file:
* Build an image with `docker build -t node-rest-app .`
* Run it with `docker run -p 3000:3000 -d node-rest-app`

If you choose to work locally:
* Execute `npm start` in the src directory and you will have running server on https://localhost:3000 (Do not forget to run `npm install` first).

Now, we should have running API server (Node.js) with separated database (MongoDB). 
You can use Postman, Curl or similar tool to test the app. 
There are three endpoints:

Resource | GET | POST
------------ | ------------ | ------------
/ | + | -
/notes | + | +

_Note: I added very simple **API Key** authentication which you can find in server.js file. The default key is **1234**. In order to have successful 
add the `x-api-key` header with the value of 1234 in your request._

So far this is satisfactory. We have running servers and our users are happy. But what will happen if the usage of our API increases drastically?
Depending on the server we choose to deploy for production AWS EC2, dedicated server or shared one, it will probably crash. 
Yes, we can start another instance, we can scale horizontally or vertically. But this adds complication as we need more knowlage or adds the need of dedicated DevOps.
![REST API Scale](/images/ha.png)

One of our options is to be Srverless. The Wiki definition of Serverless is:
> Serverless computing is a cloud-computing execution model in which the cloud provider acts as the server, dynamically managing the allocation of machine resources. Pricing is based on the actual amount of resources consumed by an application, rather than on pre-purchased units of capacity. It is a form of utility computing.
Pretty boring, right?

What we are going to build now is this:
![Serverless](/images/now.png)

### API Gateway
Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. Read the full description on the [official doc](https://aws.amazon.com/api-gateway/)

### Lambda
AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time you consume - there is no charge when your code is not running. [Official doc](https://aws.amazon.com/lambda/).

### DynamoDB
Amazon DynamoDB is a nonrelational database that delivers reliable performance at any scale. It's very similar to MongoDB. [Official doc](https://aws.amazon.com/dynamodb/).

## Start the transformation
I am going to use AWS console (the web UI). If you don't have AWS account, you can create one (read more [here](https://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/AboutAWSAccounts.html)). It will requre credit/debit card but the first year you have _free tier_ which basically means you wan't be charged for using the basic AWS services.
