angular.module('poiApp')
.controller('poiController', ['$location','$scope','$http','setHeadersToken','localStorageModel' ,function($location,$scope,$http,setHeadersToken,localStorageModel) {
    let serverUrl='http://localhost:3000/'
    self=this;
    listPOI=$scope.categories;
    console.log("asd");
}]);

