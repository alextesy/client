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
}]);

 
    
