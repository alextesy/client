angular.module('poiApp')
.controller('singlePoiCtrl',['getCategories','getALLPOI','$location','$scope','$http','$rootScope',function(getCategories,getALLPOI,$location,$scope,$http,$rootScope) {
    let serverUrl='http://localhost:3000/'
    self=this;
    $scope.review = true;
   
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
            console.log("razy");
        })
    });
    $scope.openreview = function(){
        $scope.review = false;
    }
    $scope.cleareview = function(){
        $scope.review = true;
    }
    $scope.checkpoi = function(){
        if($scope.enabled == false){
            $scope.enabled = true;
        }
        else{
            $scope.enabled = false;
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

