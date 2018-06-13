angular.module('poiApp')
.controller('poiController',['getCategories','$location','$scope','$http',function(getCategories,$location,$scope,$http) {
    let serverUrl='http://localhost:3000/'
    self=this;
    getCategories.get().then(function(response){
       $scope.categories = response.data;
    })

}]);

