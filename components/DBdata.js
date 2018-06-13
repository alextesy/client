angular.module('poiApp')
.service('getCategories',['$http', function ($http) {

    let serverUrl='http://localhost:3000/'
    let categories ="";
    this.get = function () {
       return $http.get(serverUrl + "POI/allCategories")
        .then(function(response){
            return response
           
        },
        function (response) {
            //Second function handles error
            return "Something went wrong";
        });
   
    }
    return this;

    //this.userName='shir'

}])
.service('getALLPOI',['$http', function ($http) {

    let serverUrl='http://localhost:3000/'
    let categories ="";
    this.get = function () {
       return $http.get(serverUrl + "POI/allPOIs")
        .then(function(response){
            return response
           
        },
        function (response) {
            //Second function handles error
            return "Something went wrong";
        });
   
    }
    return this;

    //this.userName='shir'

}]);