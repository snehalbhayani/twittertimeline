var serviceModule = angular.module("ServiceModule", []);

serviceModule.factory('authenticationService', function() {
    var authenticationInfo = {};
    authenticationInfo.isAuthenticated = function() {
        return authenticationInfo.authorized;
    };
    authenticationInfo.unAuthenticate = function() {
        authenticationInfo.authorized = false;
    };
    authenticationInfo.setAuthenticated = function() {
        authenticationInfo.authorized = true;
    };
    return authenticationInfo;
});
serviceModule.factory('connectionService', function($q, $rootScope, authenticationService) {

    var authorizationResult = false,
        connection = {};

    connection.initialize = function() {
        OAuth.initialize('QqgVzdLVpj7PKwb9ZBSsg2eMejY', {
            cache: true
        });
        authorizationResult = OAuth.create('twitter');
        if(authorizationResult) {
            authenticationService.setAuthenticated();
        } else {
            authenticationService.unAuthenticate();
        }

    };

    connection.connectToTwitter = function(resolve) {

        var twitterConnection = OAuth.popup("twitter", {
            cache: true
        }, function(error, result) {
            if (!error) {
                authorizationResult = result;
                authenticationService.setAuthenticated();
                $rootScope.authenticated = true;
                if(angular.isFunction(resolve)) {
                    resolve();
                }
            } else {
                console.log(error);
            }
        });

        return twitterConnection;
    };

    connection.getLatestTweets = function(countOfTweets) {
        var url = '/1.1/statuses/home_timeline.json',
            count = !countOfTweets ? 10 : countOfTweets;
        if (count) {
            url += '?count=' + count;
        }
        var promise = authorizationResult.get(url);
        return promise;
    };

    connection.logOut = function () {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        authenticationService.unAuthenticate();
    };

    return connection;
});
