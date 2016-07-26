"use strict";
twitterApp.directive('twitterTimeline', function(connectionService, authenticationService){
    return {
        restrict: 'AEC',
        scope: false,
        link: function(scope, element, attrs){
            function refreshHandler(count, callBack) {
                connectionService.getLatestTweets(count).then(function(data) {
                    scope.tweets = data.map(function(tweet) {
                        tweet.text = tweet.text;
                        return tweet;
                    });
                    if(!scope.$$phase) {
                        scope.$digest();
                    }
                    if(angular.isFunction(callBack)) {
                        callBack();
                    }
                    angular.element('.rate-limit-error').addClass('hidden');

                }, function(resp) {
                    if(resp.status == 429){
                        scope.tweets=[];
                        if(!scope.$$phase) {
                            scope.$digest();
                        }
                        if(angular.isFunction(callBack)) {
                            callBack();
                        }

                        angular.element('.rate-limit-error').removeClass('hidden');
                    }
                });
            }

            if (authenticationService.isAuthenticated()) {
                scope.$broadcast('showSpinner');
                refreshHandler(10, function() {
                    scope.$broadcast('stopSpinner');
                });
            }
            scope.$on('refreshedTimeline', function(event, count, callBack) {
                refreshHandler(count, callBack);
            });
        }
    };
});

twitterApp.directive('aSpinner', function(){
    return {
        restrict: 'AEC',
        scope: false,
        link: function(scope, element, attrs){
            angular.element(element).addClass('hidden');
            scope.$on('stopSpinner', function() {
                angular.element(element).addClass('hidden');
            });
            scope.$on('showSpinner', function() {
                angular.element(element).removeClass('hidden');
            });
        }
    };
});
