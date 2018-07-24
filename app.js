let app = angular.module('poiApp', ["ngRoute", 'LocalStorageModule']);
let serverUrl='http://localhost:3000/';

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {


    $locationProvider.hashPrefix('');
    
    $routeProvider.when('/', {
        templateUrl: 'components/login.html',
        controller : 'loginController',
        resolve:{
            Auth:function(Authservice){
                return Authservice.check();
            }
        }
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
        controller : 'homeCtrl',
    })
    $routeProvider.when('/forgot', {
        templateUrl: 'components/forgot.html',
        controller : 'forgotCtrl',
    })
    $routeProvider.when('/about', {
        templateUrl: 'components/about.html',
    })
    .otherwise({ redirectTo: '/' });
        
}])
.run(['setHeadersToken','$location','$http','setUser','$route','$rootScope','updatecounter',function(setHeadersToken,$location,$http,setUser,$route,$rootScope,updatecounter){
    t = localStorage.getItem('ls.token');
    if (t){
        t = t.substring(1);
        t = t.substring(0,t.length-1);
        setHeadersToken.set(t);
        return $http.post(serverUrl+'Users/validation')
        .then(function(result){
            
             return setUser.setUser()
            .then(function(result){
                $rootScope.login=true;
                $rootScope.user = setUser.getUser();
            
                updatecounter.update();
                return;
            })

        },function(err){
            $rootScope.login=false;
            $location.path('/');
        })
    }
    else{
        $rootScope.login=false;
        $location.path('/');

    }

}])

