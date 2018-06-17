angular.module('poiApp')
.controller('singlePoiCtrl',['getCategories','getALLPOI','$location','$scope','$http','$rootScope',function(getCategories,getALLPOI,$location,$scope,$http,$rootScope) {
    let serverUrl='http://localhost:3000/'
    self=this;
    $scope.review = true;
    $scope.enabled = [];
    console.log("single");
    $scope.$on('poi',function(response,oArgs){
        $scope.login = $rootScope.login;
        $http.get(serverUrl+'POI/'+oArgs)
        .then(function(result){
            $scope.poi=result.data.poidetails[0];
            $scope.poi.image=result.data.images[0].image;
            $scope.poi.reviews=result.data.reviews;
            if($scope.poi.reviews.length==0){
                $scope.flag=true;
            }
           
        })
    });
    $scope.openreview = function(){
        $scope.review = false;
    }
    $scope.cleareview = function(){
        $scope.review = true;
    }
    $scope.checkpoi = function(){
        if($scope.enabled[$scope.poi.ID] == false){
            $scope.enabled[$scope.poi.ID] = true;
            var id = $scope.poi.ID; 
            $rootScope.$broadcast('addpoi',id);
        }
        else{
            $scope.enabled[$scope.poi.ID] = false;
        }
    }
    $scope.submitReview=function(){
        if($scope.userReview){
            var post={poiID:$scope.poi.poiID,
                review:$scope.userReview}
            $http.post(serverUrl+'log/review',post);
        }
        if($scope.userRating){
            var post={poiID:$scope.poi.poiID,
                rating:$scope.userRating}
            $http.post(serverUrl+'log/rating');

        }
            
    }

}]);

