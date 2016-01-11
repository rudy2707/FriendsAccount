# API REST

In this document you can find all the web services available for the usage of Friends Account web application. All the services require a JWT (JSON Web Token) in order to authenticate the client.

## GET

Getting all information needed by AngularJS and authenticate

* Setup the database            ==> /setup
* Get all events                ==> /events
* Get all events by username 	==> /events/:name
* Event by id					==> /events/:id
* Get all users                 ==> /users
* Get a user by his name        ==> /users/:name
* Get all users but only with the name  ==> /friends
* Get the balance for an event  ==> /balance/:idevent

## POST

The POST verb is used to **create** new resources in the database. In our case, it is going to be used to insert new spendings, new events or new users to our database.

* New events	==> /events and in body request : label & currency & clients[username, weight]
* New user		==> /newuser and in body request : username & password !! have to validate that the username is not already used. (NOT SECURE)
* Authenticate 	==> /authenticate/:user/:password (NOT SECURE)

## PUT

The PUT verb is used to **update** resources in the database.

* Update event  ==> /events and in body request all the event

## DELETE

The DELETE verb is used to **delete** a resource in the database. In our case, we would want to delete an event, a client in event, a spending, a client concerned in a spending. And delete a user.

* Delete event 					==> /event/:eventid
