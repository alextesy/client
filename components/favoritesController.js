angular.module("poiApp")
    .controller('favoritesController', ['$location','$scope','$http','localStorageModel','getlocalpois','dbpois','localdeletepois',function($location,$scope,$http,localStorageModel,getlocalpois,dbpois,localdeletepois) {
        let serverUrl='http://localhost:3000/'
        self=this;
        $scope.poiorder=[];
        
        
        var mymap = L.map('mapid').setView([40.782281, -73.969151], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicmF6eWlkIiwiYSI6ImNqaWtiOGUzazF3aWYza3FwejVsa2d4ZnoifQ.e20DpGD798sL470V93XvQg'
        }).addTo(mymap);




       $scope.checkIfExists=function(arr,poi){
            for(var i=0;i<arr.length;i++){
                console.log(arr[i].ID);
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
                var deletpois = localdeletepois.get_local_deletepois(); 
                if(deletpois=="undefined")
                    deletpois = [];
                for(var i=0;i<result.length;i++){
                    var poi={};
                    poi=result[i].data.poidetails[0];
                    poi.image=result[i].data.images[0].image;
                    poi.reviews=result[i].reviews;
                    if(!$scope.checkIfExists(deletpois,poi.ID))
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
                if(localPoi){
                    for(var i=0;i<localPoi.length;i++){
                        $scope.poiarray[localPoi[i].ID]=localPoi[i];
                    }
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