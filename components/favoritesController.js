angular.module("poiApp")
    .controller('favoritesController', ['$location','$scope','$http','localStorageModel',function($location,$scope,$http,localStorageModel) {
        let serverUrl='http://localhost:3000/'
        self=this;
        $scope.$on('addpoi',function(response,oArgs){
            $scope.login = $rootScope.login;
            $http.get(serverUrl+'POI/'+oArgs)
            .then(function(response){
              $scope.poiarray.push(response.data)
               
            })
        });
        $http.get(serverUrl+'users/log/saved')
        .then(function(response){
            data = response.data;
            $scope.poiarray = [];
            for(var i =0;i<data.length;i++){
                $http.get(serverUrl+'POI/'+data[i].poiID)
                .then((response)=>{
                    $scope.poiarray.push(response.data);
                    console.log("")
                });
            }
        },function(response){
            alert("something went wrong");
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