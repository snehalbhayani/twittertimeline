"use strict";
twitterApp.controller('TimelineController', function($sce, $scope, $q, connectionService, $rootScope, authenticationService) {
    $scope.tweets = [];
    $scope.parentObject = {};
    connectionService.initialize();
    $scope.isAuthenticated = authenticationService.isAuthenticated;

    $scope.refreshTimeline = function() {
        $scope.$broadcast('showSpinner');
        $scope.$broadcast('refreshedTimeline', $scope.parentObject.numberOfTweets, function() {
            $scope.$broadcast('stopSpinner');
        });
    };

    $scope.connectToTwitter = function() {
         connectionService.connectToTwitter(function() {
             if (authenticationService.isAuthenticated()) {
                 $scope.refreshTimeline();
                 if(!$scope.$$phase) {
                     $scope.$digest();
                 }
            }
        });
    };

    $scope.signOut = function() {
         connectionService.logOut();
        $scope.tweets.length = 0;
    };


});
