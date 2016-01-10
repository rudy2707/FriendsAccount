(function () {
    'use strict';

    angular.module('app.event').controller('ModalAddEventCtrl', function ($scope, $rootScope, EventService, Notification, friends) {

        $scope.globals.friends = friends;

        $scope.newEv = {label: '', currency: '', clients: [{name: $rootScope.globals.currentUser.username, weight: 1}]};

        $scope.save = function () {
            console.log($scope.newEv);
            EventService.Create($scope.newEv)
            .then(function (event) {
                $rootScope.$broadcast('new.event.created');
                Notification.success('New event created.');
            }, function(err) {
                Notification.error('Error while creating event');
            });
        };

        // $scope.cancel = function () {
        // };
    })
    .controller('ModalMembersCtrl', ['$scope', '$rootScope', 'EventService', 'Notification', 'currentEvent',
        function ($scope, $rootScope, EventService, Notification, currentEvent) {

        $scope.upEv = currentEvent;

        $scope.save = function () {
            EventService.Update($scope.upEv)
            .then(function (event) {
                $rootScope.$broadcast('load.events');
                Notification.success('Members saved successfully.');
            }, function(err) {
                Notification.error('Error while creating event');
            });
        };
    }])
    .controller('ModalAddSpendingCtrl', ['$scope', '$rootScope', 'EventService', 'Notification', 'currentEvent',
    function ($scope, $rootScope, EventService, Notification, currentEvent) {

        $scope.newSpending = {label: '', amount: 0, date: new Date(),
            concerned: [ { name: $rootScope.globals.currentUser.username, weight: 1 }, {name: '', weight: 1}],
            author: $rootScope.globals.currentUser.username};

        console.log(currentEvent);
        $scope.currentEvent = currentEvent;

        $scope.save = function () {
            currentEvent.spending.push($scope.newSpending);

            EventService.Update(currentEvent)
                .then(function() {
                    $rootScope.$broadcast('load.events');
                    $rootScope.$broadcast('load.event', currentEvent);
                    Notification.success('New spending added');
                }, function(err) {
                    Notification.error('Error while adding a spending');
                });
        };
    }])
    .controller('ModalUpSpendingCtrl', ['$scope', '$rootScope', 'EventService', 'Notification', 'currentEvent', 'currentSpending', 'indexSpending',
    function ($scope, $rootScope, EventService, Notification, currentEvent, currentSpending, indexSpending) {

        $scope.upSpending = currentSpending;
        $scope.upSpending.date = new Date(currentSpending.date).toISOString().substring(0, 10);

        console.log($scope.upSpending);
        $scope.currentEvent = currentEvent;

        $scope.save = function () {
            currentEvent.spending[indexSpending] = $scope.upSpending;

            EventService.Update(currentEvent)
                .then(function() {
                    $rootScope.$broadcast('load.events');
                    $rootScope.$broadcast('load.event', currentEvent);
                    Notification.success('New spending added');
                }, function(err) {
                    Notification.error('Error while adding a spending');
                });
        };
    }]);
})();
