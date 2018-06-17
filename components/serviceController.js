angular.module('poiApp')
.service('setHeadersToken',[ '$http', function ($http) {

    let token = ""

    this.set = function (t) {
        token = t
        $http.defaults.headers.common[ 'x-access-token' ] = t
        // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
        console.log("set")
    }

    //this.userName='shir'

}])
.service('Authservice',['setHeadersToken','$location','$http','setUser','$route','$rootScope',function(setHeadersToken,$location,$http,setUser,$route,$rootScope){   
    self = this;
    self.check = function(){
        t = localStorage.getItem('ls.token');
        if (t){
            t = t.substring(1);
            t = t.substring(0,t.length-1);
            setHeadersToken.set(t);
            return $http.post(serverUrl+'Users/validation')
            .then(function(result){
                     $rootScope.login=true;
                     $location.path('/home');
                     console.log("Auth");
            },function(err){
                $rootScope.login=false;
                $location.path('/');
                return;
            })
        }
        else{
            $rootScope.login=false;
            $location.path('/');
            return;

        }
    }
   
}])

.factory('setUser',['$http',function($http){
    var user={};
    var service = {}

    service.setUser=function(){
        return new Promise(function(resolve,reject){
            $http.post(serverUrl + "Users/log")
            .then(function(result){
                user.username=result.data.username;
                user.firstname=result.data.FirstName;
                user.lastame=result.data.LastName;
                user.city=result.data.City;
                user.country=result.data.Country;
                user.email=result.data.Email;
                user.categories=result.data.categories;
                resolve(user);
            },function(err){
                reject(err);
            })
        })
    };
    service.getUser=function(){
        return user;
    }

    return service;
}])

 
    
