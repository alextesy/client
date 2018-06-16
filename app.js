let app = angular.module('poiApp', ["ngRoute", 'LocalStorageModule']);
let serverUrl='http://localhost:3000/';

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider,Auth)  {


    $locationProvider.hashPrefix('');
    

    $routeProvider.when('/', {
        templateUrl: 'components/login.html',
        controller : 'loginController'
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
.run(['setHeadersToken','$location','$http','setUser','$route','$rootScope',function(setHeadersToken,$location,$http,setUser,$route,$rootScope){
    t = localStorage.getItem('ls.token');
    if (t){
        t = t.substring(1);
        t = t.substring(0,t.length-1);
        setHeadersToken.set(t);
        $http.post(serverUrl+'Users/validation')
        .then(function(result){
            setUser.setUser()
            .then(function(result){
                $rootScope.login=true;
                $rootScope.user = setUser.getUser();
                $location.path('/home');
            })

        },function(err){
            $rootScope.login=false;

            $location.path('/login');
        })
    }
    else{
        $rootScope.login=false;
        $location.path('/login');

    }
    

}]);

