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
    $routeProvider.when('/favorites', {
        templateUrl: 'components/favorites.html',
        controller : 'favoritesController'
    })
    $routeProvider.when('/home', {
        templateUrl: 'components/home.html',
        controller : 'homeCtrl'
    })
    .otherwise({ redirectTo: '/' });

        
}])
.run(['setHeadersToken',function(setHeadersToken){
    t = localStorage.getItem('ls.token');
    t = t.substring(1);
    t = t.substring(0,t.length-1);
    if(t != undefined)
        setHeadersToken.set(t);

}]);