let app = angular.module('poiApp', ["ngRoute", 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {


    $locationProvider.hashPrefix('');
    

    $routeProvider.when('/', {
        templateUrl: 'components/login.html',
        controller : 'loginController',
        
    })
 
    $routeProvider.when('/register', {
        templateUrl: 'components/register.html',
        controller : 'registerController'
    })
    $routeProvider.when('/poi', {
        templateUrl: 'components/poi.html',
        controller : 'poiController'
    })

    .otherwise({ redirectTo: '/' });

        
}]);