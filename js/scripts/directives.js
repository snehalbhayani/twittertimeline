"use strict";
twitterApp.directive('twitterTimeline', function(connectionService, authenticationService){
    return {
        restrict: 'AEC',
        scope: false,
        link: function(scope, element, attrs){
            function refreshHandler(count) {
                connectionService.getLatestTweets(count).then(function(data) {
                    scope.tweets = data.map(function(tweet) {
                        tweet.text = tweet.text;
                        return tweet;
                    });
                    if(!scope.$$phase) {
                        scope.$digest();
                    }
                    angular.element('.rate-limit-error').addClass('hidden');

                }, function(resp) {
                    if(resp.status == 429){
                        scope.tweets=[];
                        angular.element('.rate-limit-error').removeClass('hidden');
                    }
                });
            }

            if (authenticationService.isAuthenticated()) {
                refreshHandler();
            }
            scope.$on('refreshedTimeline', function(event, count) {
                refreshHandler(count);
            });
        }
    };
});
