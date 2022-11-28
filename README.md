In the project directory, you can run:

### `yarn start`

Runs the app.
</br></br>


# ER Diagram

<img src='./ER_Diagram.png' alt='ER_Diagram'></img>
</br></br>

# APIs

## Sign Up
POST:<span>&nbsp; &nbsp;</span>/form/signup
</>

<strong>Request Body</strong>: 
```
{
   "name": "Arijeet",
   "email": "Arijeet@gmail.com",
   "password": "Arijeet"
}
```
Required field:
<ul>
    <li>name</li>
    <li>email</li>
    <li>password</li>
</ul>
</br>

<strong>Success Response</strong>: 
```
{
    "status": "success",
    "message": "SignUp successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFyaWplZXRAZ21haWwuY29tIiwiaWF0IjixNjY5NTM5ODI3LCJleHAiOjE2Njk1NDA0Mjd8.KCA26P91NPk_eU0vskqEiBB9b8eiwiZJYUDyW3-VOEY"
}
```
<strong> Error Response</strong>:
```
{
    "status": "error",
    "statusCode": 403,
    "message": "This Email Already Exists"
}
```
</br>

## Sign In
POST:<span>&nbsp; &nbsp;</span>/form/signin 
</br>

<strong>Request Body</strong>: 
```
{
   "email": "Arijeet@gmail.com",
   "password": "Arijeet"
}
```
Required field:
<ul>
    <li>email</li>
    <li>password</li>
</ul>
</br>

<strong>Success Response</strong>: 
```
{
    "status": "success",
    "message": "SignIn successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ik5hcmF5YW5AZ21haWwuY29tIiwiaWF0IjoxNiY5NTM4NTE1LCJleHAiOjE2Njk1MzkxMTZ9.2XGEm4V1joc9yZbiKqLDhDYkH2ltNbpyF8sZYFFzodo
}
```
<strong>Error Response</strong>:
```
{
    "status": "error",
    "statusCode": 400,
    "message": "Please check email and password"
}
```
## Create Post
POST:<span>&nbsp; &nbsp;</span>/form/createpost
</br>

<strong>Request Body</strong>: 
```
{
    "title": "Python vs JS",
    "description": "How Python is better than JS",
    "tag": "Python, JS"
}
```
Required field:
<ul>
    <li>title</li>
    <li>description</li>
</ul>

Optional field:
<ul>
    <li>tag</li>
</ul>
</br>

<strong>Success Response</strong>:
```
{
    "status": "success",
    "message": [
        {
            "UserName": "Arijeet",
            "PostId": 10020,
            "Title": "Python vs JS",
            "Description": "How Python is better than JS",
            "Tag": "Python, JS",
            "CreatedTime": "2022-11-27T09:16:00.000Z"
        }
    ]
}
``` 
<strong>Error Response</strong>:
```
{
    "status": "error",
    "statusCode": 400,
    "message": "\"description\" is required"
}
```
</br>

## Update Post
PUT: <span>&nbsp; &nbsp;</span>/form/updatepost?description=Python3 Vs JS&tag=Python, JS&title=Is Python better than JS&postId=10015
</br>

<strong>Request Params</strong>: 
```
    postId: 10015
    description: "Python3 Vs JS",
    tag: "Python, JS",
    title: Is Python better than JS
```
Required field:
<ul>
    <li>postId</li>
</ul>
</br>
Optional fields but required atleast 1 field:
<ul>
    <li>description</li>
    <li>tag</li>
    <li>title</li>
</ul>
</br>

<strong>Success Response</strong>:
```
{
    "status": "success",
    "message": [
        {
            "UserName": "Arijeet",
            "Title": "Is Python better than JS",
            "Description": "Python3 Vs JS ",
            "Tag": "Python, JS",
            "CreatedTime": "2022-11-27T11:07:26.000Z"
        }
    ]
}
``` 
<strong>Error Response</strong>:
```
{
    "status": "error",
    "statusCode": 400,
    "message": "Enter the column to be updated"
}
``` 
</br>

## Delete Post
DELETE: <span>&nbsp; &nbsp;</span>/form/deletepost?postId=10015
</br>

<strong>Request Params</strong>: 
```
    postId: 10015
```
Required field:
<ul>
    <li>postId</li>
</ul>
</br>

<strong>Success Response</strong>:
```
{
    "status": "success",
    "message": "Deleted the post successfully"
}
``` 
<strong>Error Response</strong>:
```
{
    "status": "error",
    "statusCode": 400,
    "message": "\"postId\" is required"
}
```
</br>

## Add Answer
POST: <span>&nbsp; &nbsp;</span>/form/addanswer
</br>

<strong>Request Body</strong>: 
```
{
    "postId":10015,
    "answer":"JS and Python are good programming language."
}
```
</br>
Required field:
<ul>
    <li>postId</li>
    <li>answer</li>
</ul>
</br>

<strong>Success Response</strong>:
```
{
    "status": "success",
    "message": [
        {
            "PostId": 10015,
            "Title": "Python vs JS",
            "AnswerId": 21,
            "AnswerBy": "Ari",
            "Answer": "JS and Python are good programming language.",
            "CreatedTime": "2022-11-27T12:07:15.000Z"
        }
    ]
}
``` 

<strong>Error Response</strong>:
```
{
    "status": "error",
    "statusCode": 400,
    "message": "\"answer\" is required"
}
```
</br>

## Get Answers
GET: <span>&nbsp; &nbsp;</span>/form/getanswers?title=NodeJS vs Deno
</br>

<strong>Request Params</strong>: 
```
    title: NodeJS vs Deno
```
Required field:
<ul>
    <li>title</li>
</ul>
</br>

<strong>Success Response</strong>:
```
{
    "status": "success",
    "message": [
        {
            "Name": "Ari",
            "Answer": "Deno is better than NodeJS",
            "CreatedTime": "2022-11-27T07:02:11.000Z"
        },
        {
            "Name": "Arijeet",
            "Answer": "NodeJS is better than Deno",
            "CreatedTime": "2022-11-27T07:01:55.000Z"
        }
    ]
}
```
</br>

<strong>Error Response</strong>:

```
{
    "status": "error",
    "statusCode": 400,
    "message": "\"title\" is required"
}
```
</br>


## Get Posts
GET: <span>&nbsp; &nbsp;</span> /form/getposts?page=1
</br>

<strong>Request Params</strong>: 
```
    page: 1 (for pagination)
```
</br>

<strong>Success Response</strong>:
```
{
    "status": "success",
    "message": [
        {
            "Id": 10020,
            "Name": "Arijeet",
            "Title": "Python vs JS",
            "Description": "How Python is better than JS",
            "Tag": null,
            "CreatedTime": "2022-11-27T09:16:00.000Z"
        },
        {
            "Id": 10019,
            "Name": "John",
            "Title": "Deno vs NodeJS",
            "Description": "How Deno is better than NodeJS",
            "Tag": "JS, Deno, NodeJS",
            "CreatedTime": "2022-11-27T09:12:50.000Z"
        }
    ]
}
```
</br>

<strong>Error Response</strong>:
```
{
    "status": "error",
    "statusCode": 400,
    "message": "\"page\" is required"
}
```
</br>




