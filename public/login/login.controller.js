(function () {
    'use strict';

    angular
        .module('app.event')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', '$timeout'];
    function LoginController($location, AuthenticationService, $timeout) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.name, vm.password, function (response) {
                console.log(response);
                if (response.success) {
                    console.log('[LoginController] vm.name : ' + vm.name);
                    AuthenticationService.SetCredentials(vm.name, response.token);
                    vm.loadingPage = true;
                    $timeout(function(){
                      $location.path("/event");
                    },2300);
                } else {
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
