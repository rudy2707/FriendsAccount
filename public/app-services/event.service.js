(function () {
    'use strict';

    angular
        .module('app.event')
        .factory('EventService', EventService);

    EventService.$inject = ['$http'];
    function EventService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetBalance = GetBalance;

        return service;

        function GetAll() {
            return $http.get('http://localhost:8080/api/events').then(handleSuccess, handleError)
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/events/' + username).then(handleSuccess, handleError);
        }

        function Create(event) {
            return $http.post('/api/events', event).then(handleSuccess, handleError);
        }

        function Update(event) {
            return $http.put('/api/events/' + event._id, event).then(handleSuccess, handleError);
        }

        function Delete(id) {
            return $http.delete('/api/events/' + id).then(handleSuccess, handleError);
        }

        function GetBalance(id) {
            return $http.get('/api/balance/' + id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            //console.log(res.data);
            return res.data;
        }

        function handleError(error) {
            //console.log(error.data.message);
            return { success: false, message: error.data.message };
        }
    }

})();
