angular.module("poiApp")
    .controller('favoritesController', ['$location','$scope','$http','localStorageModel','getlocalpois',function($location,$scope,$http,localStorageModel,getlocalpois) {
        let serverUrl='http://localhost:3000/'
        self=this;
        localpoiarray=[];
        /*
        $scope.$on('addpoi',function(response,oArgs){
            $scope.login = $rootScope.login;
            $http.get(serverUrl+'POI/'+oArgs)
            .then(function(response){
              $scope.poiarray.push(response.data)
               
            })
        });
        */
        self.getlocalpoi = function(){

        }

        $scope.$on('$routeChangeSuccess', function() {

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
                }
                localPoi=getlocalpois.get_local_pois();
                for(var i=0;i<localPoi.length;i++){
                    $scope.poiarray[localPoi[i].ID]=localPoi[i];
                }
                $scope.showimgs = true;
                $scope.$apply();
                
            })
        },function(response){
            alert("something went wrong");
        })
        })
        
        $scope.updatepostion_up = function(index){
            
            temp = $scope.poiarray[index-1];
            $scope.poiarray[index-1] = $scope.poiarray[index];
            $scope.poiarray[index] = temp;
        }
        $scope.updatepostion_down = function(index){
            
            temp = $scope.poiarray[index+1];
            $scope.poiarray[index+1] = $scope.poiarray[index];
            $scope.poiarray[index] = temp;
        }
        $scope.save_order = function(){
            
            
        }        
    }]);