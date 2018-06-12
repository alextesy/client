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
.service('getCategories',['$http',function($http){
    
    $http.get(serverUrl + "POI/allCategories")
    .then(function(response){
        $scope.categories=response.data
    },
    function (response) {
        //Second function handles error
        $scope.categories = "Something went wrong";
    });
    

}]) 


    
