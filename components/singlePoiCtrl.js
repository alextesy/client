angular.module('poiApp')
.controller('singlePoiCtrl',['getCategories','getALLPOI','$location','$scope','$http','$rootScope','localStorageModel','getlocalpois','localdeletepois','dbpois',function(getCategories,getALLPOI,$location,$scope,$http,$rootScope,localStorageModel,getlocalpois,localdeletepois,dbpois) {
    let serverUrl='http://localhost:3000/'
    self=this;
    $scope.review = true;
    $scope.enabled = {};
    $scope.flag = {};//if poi has reviews
    $scope.checkIfExists=function(arr,poi){
        for(var i=0;i<arr.length;i++){
            if(arr[i].ID==poi.ID){
                return true;
            }
        }
        return false;
    }
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
            var Dbpois=dbpois.get_dbpois();
            if(Dbpois){
                for(var i=0;i<Dbpois.length;i++){
                    $scope.enabled[Dbpois[i].ID]=true;
                }
            }
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
        var DBpois=dbpois.get_dbpois();
        if($scope.enabled[$scope.poi.ID] == false||!$scope.enabled[$scope.poi.ID]){
            $scope.enabled[$scope.poi.ID] = true;
            var id = $scope.poi.ID; 
            if(!$scope.checkIfExists(DBpois,$scope.poi)){
                getlocalpois.update_local_pois($scope.poi);
            }
        }
        else{
            $scope.enabled[$scope.poi.ID] = false;
            
            if($scope.checkIfExists(DBpois,$scope.poi)){
                localdeletepois.update_local_deletepois($scope.poi);
            }
            else
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

