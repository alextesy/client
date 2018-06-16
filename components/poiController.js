angular.module('poiApp')
.controller('poiController',['getCategories','getALLPOI','$location','$scope','$http',function(getCategories,getALLPOI,$location,$scope,$http) {
    let serverUrl='http://localhost:3000/'
    self=this;
    getCategories.get().then(function(response){
       $scope.categories = response.data;
       $scope.enabled = [];
       getALLPOI.get()
       .then(function(response){
           $scope.pois = response.data;
           for(var i =0; i <$scope.pois.length;i++){
               for(var j = 0 ;j<$scope.categories.length;j++){
                   if($scope.pois[i].categoryID == $scope.categories[j].ID)
                        $scope.pois[i].category = $scope.categories[j].categories;       
               }
           }
           console.log("");
        })
    })
    $scope.clearfilter = function(){
        $scope.cat_filter ="undefined";
        $scope.name_filter ="";
        $scope.rating_filter ="";
        $scope.numv_filter ="";
        
    }
    $scope.checkpoi = function(index){
        if($scope.enabled[index] == false){
            $scope.enabled[index] = true;
        }
        else{
            $scope.enabled[index] = false;
        }
    }
}]);

