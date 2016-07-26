"use strict";
twitterApp.controller('TimelineController', function($sce, $scope, $q, connectionService, $rootScope, authenticationService) {
    $scope.tweets = [];
    $scope.parentObject = {};
    connectionService.initialize();
    $scope.isAuthenticated = authenticationService.isAuthenticated;

    $scope.refreshTimeline = function() {
        connectionService.getLatestTweets($scope.numberOfTweets).then(function(data) {
            $scope.tweets = data.map(function(tweet) {
                tweet.text = $sce.trustAsResourceUrl(tweet.text);
                return tweet;
            });

            $scope.parentObject.rateLimitError = false;
            if(!$scope.$$phase) {
                $scope.$digest();
            }
        }, function(resp) {
            if(resp.status == 429){
                $scope.parentObject.rateLimitError = true;
                if(!$scope.$$phase) {
                    $scope.$digest();
                }
            }
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

    if (authenticationService.isAuthenticated()) {
        $scope.refreshTimeline();
    }
});
