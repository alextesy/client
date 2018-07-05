angular.module('poiApp')
.controller('singlePoiCtrl',['getCategories','getALLPOI','$location','$scope','$http','$rootScope','localStorageModel','getlocalpois','localdeletepois','dbpois','updatecounter',function(getCategories,getALLPOI,$location,$scope,$http,$rootScope,localStorageModel,getlocalpois,localdeletepois,dbpois,updatecounter) {
    let serverUrl='http://localhost:3000/'
    self=this;
    $scope.review = true;
    $scope.enabled = {};
    $scope.flag = {};//if poi has reviews
    $scope.checkIfExists=function(arr,poi){
        if(arr){
            for(var i=0;i<arr.length;i++){
                if(arr[i].ID==poi.ID){
                    return true;
                }
            }
            return false;
        }
        return false;
    }
  
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
            var deletepois=localdeletepois.get_local_deletepois();
            if($scope.checkIfExists(Dbpois,$scope.poi)){
                    if(!$scope.checkIfExists(deletepois,$scope.poi)){
                        $scope.enabled[$scope.poi.ID]=true;
                    }
                
            }
            else if($scope.checkIfExists(localpois,$scope.poi)){
                    $scope.enabled[$scope.poi.ID]=true;
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
        var deletepoi=localdeletepois.get_local_deletepois();
        if($scope.enabled[$scope.poi.ID] == false||!$scope.enabled[$scope.poi.ID]){
            $scope.enabled[$scope.poi.ID] = true;
            var id = $scope.poi.ID; 
            if(!$scope.checkIfExists(DBpois,$scope.poi)){
                getlocalpois.update_local_pois($scope.poi);
            }
            else if($scope.checkIfExists(deletepoi,$scope.poi)){
                localdeletepois.remove_local_deletepois($scope.poi);
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
        updatecounter.update();
    }
    $scope.submitReview=function(userRating,userReview){
        if(userReview){
            var post={poiID:$scope.poi.ID,
                review:userReview}
            $http.post(serverUrl+'users/log/review',post);
        }
        if(userRating){
            var post={poiID:$scope.poi.ID,
                rating:userRating}
            $http.post(serverUrl+'users/log/rating',post);

        }
        alert("pois saved successfully");
        $scope.review = false;
    
            
    }

}]);

