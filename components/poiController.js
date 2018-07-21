angular.module('poiApp')
.controller('poiController',['getCategories','getALLPOI','$location','$scope','$http','$rootScope','getlocalpois','localdeletepois','dbpois','updatecounter',function(getCategories,getALLPOI,$location,$scope,$http,$rootScope,getlocalpois,localdeletepois,dbpois,updatecounter) {
    let serverUrl='http://localhost:3000/'
    self=this;

    $scope.orderByField = 'rating';
    $scope.reverseSort = false;

    getCategories.get().then(function(response){
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
       $scope.categories = response.data;
       
       getALLPOI.get()
       .then(function(response){
           var poiArr=[]
           for (var i=0;i<response.length;i++){
                var poi=response[i].data.poidetails[0];
                poi.image=response[i].data.images[0].image;
                poi.reviews=response[i].data.reviews;
                poiArr.push(poi);
              
           }
            var localpois=getlocalpois.get_local_pois();
            var Dbpois=dbpois.get_dbpois();
            var deletepois=localdeletepois.get_local_deletepois();
           $scope.pois = poiArr;
           for(var i =0; i <$scope.pois.length;i++){
               for(var j = 0 ;j<$scope.categories.length;j++){
                   if($scope.pois[i].categoryID == $scope.categories[j].ID)
                        $scope.pois[i].category = $scope.categories[j].categories;       
               }
           }
           for(var i =0; i <$scope.pois.length;i++){
               if($scope.checkIfExists(Dbpois,$scope.pois[i])&&!$scope.checkIfExists(deletepois,$scope.pois[i])){ 
                   
                    $scope.pois[i].favorite = true;
                }
                else if($scope.checkIfExists(localpois,$scope.pois[i])){
            
                    $scope.pois[i].favorite = true;
                }
            }

        })
    })
    $scope.clearfilter = function(){
        $scope.cat_filter ="undefined";
        $scope.name_filter ="";
        $scope.rating_filter ="";
        $scope.numv_filter ="";
        
    }
    $scope.checkpoi = function(index){
        var DBpois=dbpois.get_dbpois();
        var deletepoi=localdeletepois.get_local_deletepois();
        if( $scope.pois[index].favorite == false){
            $scope.pois[index].favorite = true;
            if(!$scope.checkIfExists(DBpois,$scope.pois[index])){
                getlocalpois.update_local_pois($scope.pois[index]);
            }
            else if($scope.checkIfExists(deletepoi,$scope.pois[index])){
                localdeletepois.remove_local_deletepois($scope.pois[index]);
            }
        }
        else{
            $scope.pois[index].favorite = false;
            
            if($scope.checkIfExists(DBpois,$scope.pois[index])){
                localdeletepois.update_local_deletepois($scope.pois[index]);
            }
            else
                getlocalpois.remove_local_pois($scope.pois[index]);
        }
        updatecounter.update();
    }
    $scope.sendPOI=function(id){
        $rootScope.$broadcast('poi',id);
    }
    $scope.showfav = function(){
  
    }
}]);

