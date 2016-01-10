(function () {
    'use strict';

    angular
        .module('app.event')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$rootScope'];
    function UserService($http, $rootScope) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetFriends = GetFriends;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetCurrentUser = GetCurrentUser;

        return service;

        function GetAll() {
            return $http.get('http://localhost:8080/api/users').then(handleSuccess, handleError)
        }

        function GetFriends() {
            return $http.get('/api/friends').then(handleSuccess, handleError);
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetCurrentUser() {
            return $rootScope.globals.currentUser.username;
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError);
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            console.log(res.data);
            return res.data;
        }

        function handleError(error) {
            console.log(error.data.message);
            return { success: false, message: error.data.message };
        }
    }

})();
