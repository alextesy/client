angular.module('poiApp')
.controller('indexCtrl',['$location','$scope',function($location,$scope) {
    $scope.deleteLocalStorage =function(){

        localStorage.clear();
        $location.path('/');
    }

}])