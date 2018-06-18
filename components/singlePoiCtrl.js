angular.module('poiApp')
.controller('singlePoiCtrl',['getCategories','getALLPOI','$location','$scope','$http','$rootScope','localStorageModel','getlocalpois',function(getCategories,getALLPOI,$location,$scope,$http,$rootScope,localStorageModel,getlocalpois) {
    let serverUrl='http://localhost:3000/'
    self=this;
    $scope.review = true;
    $scope.enabled = {};
    $scope.flag = {};

    console.log("single");
    $scope.$on('poi',function(response,oArgs){
        $scope.login = $rootScope.login;  
        $http.get(serverUrl+'POI/'+oArgs)
        .then(function(result){
            $scope.poi=result.data.poidetails[0];
            $scope.poi.image=result.data.images[0].image;
            $scope.poi.reviews=result.data.reviews;
            if($scope.poi.reviews.length==0){
                $scope.flag[$scope.poi.ID]=true;
            }
            var localpois=getlocalpois.get_local_pois();
            if(localpois){
                for(var i=0;i<localpois.length;i++){
                    $scope.enabled[localpois[i].ID]=true;
                }
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
        if($scope.enabled[$scope.poi.ID] == false||!$scope.enabled[$scope.poi.ID]){
            $scope.enabled[$scope.poi.ID] = true;
            var id = $scope.poi.ID; 
            $rootScope.$broadcast('addpoi',id);
            getlocalpois.update_local_pois($scope.poi);
        }
        else{
            $scope.enabled[$scope.poi.ID] = false;
            getlocalpois.remove_local_pois($scope.poi);
        
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

