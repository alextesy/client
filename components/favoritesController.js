angular.module("poiApp")
    .controller('favoritesController', ['$location','$scope','$http','localStorageModel','getlocalpois','dbpois',function($location,$scope,$http,localStorageModel,getlocalpois,dbpois) {
        let serverUrl='http://localhost:3000/'
        self=this;
        $scope.poiorder=[];
        
        /*
        $scope.$on('addpoi',function(response,oArgs){
            $scope.login = $rootScope.login;
            $http.get(serverUrl+'POI/'+oArgs)
            .then(function(response){
              $scope.poiarray.push(response.data)
               
            })
        });
        */
       $scope.checkIfExists=function(arr,poi){
            for(var i=0;i<arr.length;i++){
                if(arr[i].ID==poi.ID){
                    return true;
                }
            }
            return false;
        }

            $http.get(serverUrl+'users/log/saved')
            .then(function(response){
                data = response.data;
                $scope.poiarray ={};
                var promiseArr=[];
            for(var i =0;i<data.length;i++){
                promiseArr.push($http.get(serverUrl+'POI/'+data[i].poiID))             
            }
            Promise.all(promiseArr)
            .then(function(result){
                for(var i=0;i<result.length;i++){
                    var poi={};
                    poi=result[i].data.poidetails[0];
                    poi.image=result[i].data.images[0].image;
                    poi.reviews=result[i].reviews;
                    $scope.poiarray[poi.ID]=poi;
                    var Dbpois=dbpois.get_dbpois();
                    if(Dbpois){
                        if(!$scope.checkIfExists(Dbpois,poi))
                        dbpois.update_dbpois(poi);
                    }
                    else{
                        dbpois.update_dbpois(poi);
                    }
                   
                }
                localPoi=getlocalpois.get_local_pois();
                for(var i=0;i<localPoi.length;i++){
                    $scope.poiarray[localPoi[i].ID]=localPoi[i];
                }
                $scope.showimgs = true;
                $scope.poiorder=Object.keys($scope.poiarray);
                $scope.$apply();

            })
        },function(response){
            alert("something went wrong");
        })
        
        
        $scope.updatepostion_up = function(index){
            
            temp =  $scope.poiorder[index-1];
            $scope.poiorder[index-1] = $scope.poiorder[index];
            $scope.poiorder[index] = temp;
        }
        $scope.updatepostion_down = function(index){
            
            temp = $scope.poiorder[index+1];
            $scope.poiorder[index+1] = $scope.poiorder[index];
            $scope.poiorder[index] = temp;
        }
        $scope.save_order = function(){
            
            
        }        
    }]);