angular.module('poiApp')
.service('getCategories',['$http', function ($http) {

    let serverUrl='http://localhost:3000/'
    let categories ="";
    this.get = function () {
       return $http.get(serverUrl + "POI/allCategories")
        .then(function(response){
            categories = response;
            return response
           
        },
        function (response) {
            //Second function handles error
            return "Something went wrong";
        });
   
    }
    return this;

  

}])
.service('getALLPOI',['$http', function ($http) {

    let serverUrl='http://localhost:3000/'
    let categories ="";
    this.get = function () {
       return $http.get(serverUrl + "POI/allPOIs")
        .then(function(response){
            var promiseArr=[];
            for(var i=0;i<response.data.length;i++){
                promiseArr.push($http.get(serverUrl + "POI/"+response.data[i].ID));
            }
            return Promise.all(promiseArr)
            .then(function(result){
                return result
            })
        },
        function (response) {
            //Second function handles error
            return "Something went wrong";
        });
   
    }
    return this;

    //this.userName='shir'

}]);