(function () {
    'use strict';

    angular
        .module('app.event')
        .controller('EventController', ['$scope', 'EventService', '$rootScope', 'UserService', 'Notification', '$modal', '$log',
        function ($scope, EventService, $rootScope, UserService, Notification, $modal, $log) {

            var vm = this;

            vm.user = null;
            vm.allEvents = [];
            vm.loading = false;

            $rootScope.$on('new.event.created', function() {
                loadAllEvents();
                $scope.newEvent = false;
            });

            $rootScope.$on('load.events', function() {
                loadAllEvents();
            })

            $rootScope.$on('load.event', function(event, args) {
                vm.getBalance(args._id);
            })

            initController();
            function initController() {
                 vm.user = UserService.GetCurrentUser();
                 loadAllEvents();
                 loadFriends();
                 $scope.newEvent = false;
                 $scope.currentUser = $rootScope.globals.currentUser;
                 vm.currentUser = $rootScope.globals.currentUser;
                 $log.info(vm.currentUser);
            }

            function loadFriends() {
                UserService.GetFriends()
                    .then(function(friends) {
                        vm.friends = friends;
                    }, function(err) {
                        $log.error(err);
                    });
            }

            function loadAllEvents() {
                EventService.GetByUsername(vm.user)
                    .then(function (events) {
                        vm.allEvents = events;
                    }, function (err) {
                        console.log("Error when retrieving all events");
                    });
            }

            $rootScope.$on('load.events', function() {
                loadAllEvents();
            })

            vm.saveEvent = function saveEvent(upEvent) {
                console.log('saveEvent');
                EventService.Update(upEvent)
                    .then(function (res) {
                        console.log(res);
                        Notification.success('Event saved !');
                        loadAllEvents();
                    }, function (err) {
                        console.log("Error when updating the event")
                        Notification.error('Problem while saving event')
                    });
            }

            $scope.animationsEnabled = true;

            $scope.openNewEvent = function (size) {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'event/modalAddEvent.html',
                    controller: 'ModalAddEventCtrl',
                    size: size,
                    resolve: {
                    items: function () {
                      return $scope.items;
                    },
                    friends: function() {
                        return vm.friends;
                    }
                  }
                });

                modalInstance.result.then(function () {
                    // success
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });
            };

            // $scope.openNewSpending = function (size, currentEvent) {
            $scope.openNewSpending = function (currentEvent) {

                console.log(currentEvent);

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'event/modalAddSpending.html',
                    controller: 'ModalAddSpendingCtrl',
                    // size: size,
                    resolve: {
                    currentEvent: function () {
                      return currentEvent;
                    }
                  }
                });

                modalInstance.result.then(function () {
                    // success
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.openUpSpending = function (currentEvent, currentSpending, indexSpending) {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'event/modalUpSpending.html',
                    controller: 'ModalUpSpendingCtrl',
                    // size: size,
                    resolve: {
                    currentEvent: function () {
                      return currentEvent;
                    },
                    currentSpending: function() {return currentSpending},
                    indexSpending: function() {return indexSpending}
                  }
                });

                modalInstance.result.then(function () {
                    // success
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.openMembers = function (currentEvent) {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'event/modalMembers.html',
                    controller: 'ModalMembersCtrl',
                    resolve: {
                    currentEvent: function () {
                      return currentEvent;
                    }
                  }
                });

                modalInstance.result.then(function () {
                    // success
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };

            $scope.deleteSpending = function(evSpending, spending, index) {
                evSpending.spending.splice(index, 1);
                EventService.Update(evSpending)
                .then(function(res) {
                    loadAllEvents();
                    vm.getBalance(vm.event._id);
                    vm.event = evSpending;
                    $log.log('Spending deleted successfully');
                    Notification.success('Spending deleted successfully');
                }, function(err) {
                    console.log(err);
                    $log.error(err);
                    Notification.error('Problem while deleting event');
                });
            }

            $scope.deleteEvent = function(eventId) {
                EventService.Delete(eventId)
                .then(function() {
                    loadAllEvents();
                    $log.log('Event deleted successfully');
                    Notification.success('Event deleted successfully');
                    vm.event = null;
                }, function(err) {
                    console.log(err);
                    $log.error(err);
                    Notification.error('Problem while deleting event');
                });
            }

            vm.getBalance = function(eventId) {
                vm.loading = true;
                EventService.GetBalance(eventId)
                .then(function(balance) {
                    $log.info(balance);
                    vm.balance = balance;
                    vm.loading = false;
                }, function(err) {
                    $log.error(err);
                    vm.loading = false;
                });
            }

            vm.loadEvent = function(ev) {
                vm.event = ev;
                vm.getBalance(ev._id);
            }
        }

    ]);
})();
