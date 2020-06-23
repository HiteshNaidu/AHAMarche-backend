### To deploy
clone the repo

## To deploy the stack
cd into project folder
```
npm i
serverless deploy
```
Note: Certain services only work in a specified region those services default to a region that works in the template.

## To remove the stack
serverless remove


# To Debug a function:
serverless logs --function getUser


# To get lambda logs 
serverless logs -f getUser

# To test APIs from VS Code
### Install Rest Client from VS Code extension from here to test the following calls from VS Code
### https://marketplace.visualstudio.com/items?itemName=humao.rest-client

