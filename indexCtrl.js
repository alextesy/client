angular.module('poiApp')
.controller('indexCtrl',['$location','$scope','$rootScope',function($location,$scope,$rootScope) {
    $scope.deleteLocalStorage =function(){
        $rootScope.user.username = 'Guest';
        localStorage.clear();
        $location.path('/');
    }


}])