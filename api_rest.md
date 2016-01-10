# API REST

In this document you can find all the web services available for the usage of Friends Account web application. All the services require a JWT (JSON Web Token) in order to authenticate the client.

## GET 

Getting all information needed by AngularJS and authenticate

* Get all events by username 	==> /event/:name
* Event by id					==> /event/:id

## POST

The POST verb is used to **create** new ressources in the database. In our case, it is going to be used to insert new spendings, new events or new users to our database.

* New events	==> /newevent and in body request : label & currency & clients[username, weight]
* New user		==> /newuser and in body request : username & password !! have to validate that the username is not already used. (NOT SECURE)
* Authenticate 	==> /authenticate/:user/:password (NOT SECURE)

## PUT

The PUT verb is used to **update** ressources in the database. In our case, it is going to be used to insert new spendings, new concerned people for one spending, and add a client in an event or to update one data in an event, a spending or

* New spending (in event) 				==> /newspending/:eventid 				body : label & amount & date & concerned[username]
* New user (in concerned, in spending) 	==> /newconcerned/:eventid/:spendingid 	body : name
* New user (in event) 					==> /newclient/:eventid 				body : name & weight
* Update label of event 				==> /uplabelevent/:eventid 				body : label
* Update currency of event 				==> /upcurrevent/:eventid				body : currency
* Update label of spending 				==> /uplabelspend/:eventid/:spendingid	body : label
* Update amount of spending 			==> /upamountspend/:eventid/:spendingid	body : amount
* Update weight of user in event 		==> /upweightevent/:eventid/:name 		body : weight

## DELETE

The DELETE verb is used to **delete** a ressource in the database. In our case, we would want to delete an event, a client in event, a spending, a client concerned in a spending. And delete a user.

* Delete event 					==> /event/:eventid
* Delete client in event 		==> /client/:eventid/:name
* Delete spending in event 		==> /spending/:eventid/:spendingid
* Delete concerned in spending 	==> /concerned/:eventid/:spendingid/:name
* Detele user 					==> /user/:name

# WARNING TODO

* If a user add a new spending and want to delete it just after it was created, we have to store the _id in order to delete.
* When updating a spending, you can only add users that are include in the event
* When a request is sent, I have to encapsulate the token in the header as : x-access-token=xxxxxxxxxxxxxxxxxx
* The author of a spending can only be the user himself
* Maybe save the concerned array completely ? Less operations than looking the for the good _id and stuff