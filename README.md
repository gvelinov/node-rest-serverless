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

Pretty boring, right? :unamused:

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

#### Creating Lambda function
1. Open AWS [console](https://console.aws.amazon.com). Check above if you don't have an account yet.
1. Find and select Lambda service.
1. Hit the _Create Function_ button.
1. We are creating funtion from scrach with the name _TestFunc_ and runtime Node.js 8.10 (the version at the moment of writing).
1. You are obigated to select a role, so if you don't already have one you should create. If you are not familiar with Roles, there is explanation in the craete page itself. Save.
1. In the next page we can configure our function. We add triggers and view function's permissions. Scroll down to see the **Fuction Code** section.
![Lambda Fucntion](/images/lambda-func.png)
1. We are going to use _Upload a .zip file_ for **Code entry type**. 
1. Make a zip package from the src code (with node_modules)  and upload it in our lambda function (actually, you don't need Dockerfile, images dir and the README :wink:).
1. Change the **Handler** from _index.handler_ to _server.handler_.
1. At the top right on the console there is **Save** button. Save.
1. As our code package is smaller then 3MB we will be able too see the code in the online code editor:
![Lambda editor](/images/code.png)
1. From the online editor delete the following code from server.js: 
```javascript
function auth(key, fn) {
    if ('1234' === key)
        fn(null, true)
    else
        fn(null, null)
}

app.use(apiKey(auth));
```
13. And again, **Save** the function.


#### Createing API in API Gateway
1. Again, from the AWS console (you should already have open the console).
1. Find API Gateway in the Servies menu item under the Networking & Content Deleviery section.
1. Create new API with some name. I will use TestAPI as an example.
1. You will aready have the root path (resource) created. From the _Actions_ dropdown create new method for the root resource. The new method should be GET.
    1. For _Integration type_ select **Lambda**
    1. Check the Use _Lambda Proxy integration_ option
    1. Select your region and the name of your function (in our case TestFunc).
1. The next step is to create new resource _notes_ which is going to have two methods GET and POST.
    1. Set a name _Notes_ and the resource path shoud be automatically populated. Hit _Create Resource_ button.
    1. Create new method GET for the _Notes_ resource.
    1. Use Lambda Function as _integration type_.
    1. Check the _proxy integration_ opiton.
    1. Select your region and enter your function (_TestFunc_ if you follow my naming). Save.
    This is how the endpoint should look like:
    ![REST API endpoint](/images/endpoint.png)
    1. Repeat those steps while creating the POST method.
1. So far, so good! To start using our new Serverless API, we need to deploy it. From the _Actions_ dropdown select _Deploy API_. You will be promt to create a _Stage_, create one by choosing a _New Stage_ from the **Deployment stage** option, you could use _dev_ for a stage name. 
1. Hit _Deploy_ and API will be live. The invoke URL will be in a blue alret in the middle of the screen.
1. Use some tool like Postman or curl to test the API.

:loudspeaker: _When testing the Serverless approach you will need some MongoDB instance which is accessible from AWS. Which menas you need to deployed it somewhere. Keep this in mind. Or just delete the db connection from the server.js and work only with the base resourse path (/)_.

## Summary
In the demo I made I deployed the app using Elastic Beanstalk and EC2 with AMI template for MongoDB. Then I created an API (in API Gateway) with the three endpoints poitnig them to the Elastic Beanstalk instance. This way I started migrating to Serverless with a zero downtime. Then I created the Lambda function and redirected the API Gateway to Lambda instead to Elastic Beanstalk.

The good with Serverless technologies are that we don't need to care about the servers. They are there but they are provisioned and maintaind by the Cloud vendor. We take care only for our code. The scaling in automatical and effician. :smirk: 


![Serverless](/images/serverless.png)
