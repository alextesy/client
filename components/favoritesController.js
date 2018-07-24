angular.module("poiApp")
    .controller('favoritesController', ['$location','$scope','$http','localStorageService','getlocalpois','dbpois','localdeletepois','Authservice',function($location,$scope,$http,localStorageService,getlocalpois,dbpois,localdeletepois,Authservice) {
        if(!Authservice.check()){
            return;
        }
        
        let serverUrl='http://localhost:3000/'
        self=this;
        $scope.poiorder=[];
        $scope.favorites = [];
        
        var mymap = L.map('mapid').setView([40.782281, -73.969151], 12);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicmF6eWlkIiwiYSI6ImNqaWtiOGUzazF3aWYza3FwejVsa2d4ZnoifQ.e20DpGD798sL470V93XvQg'
        }).addTo(mymap);

        $scope.sendPOI=function(id){
            $rootScope.$broadcast('poi',id);
        }

       $scope.checkIfExists=function(arr,poi){
           if(arr){
            for(var i=0;i<arr.length;i++){
                console.log(arr[i].ID);
                if(arr[i].ID==poi.ID){
                    return true;
                }
            }
            return false;
            }
            return false;

        }

        $http.get(serverUrl+'users/log/saved')
            .then(function(response){
                data = response.data;
                poiDict={};

                $scope.poiarray ={};
                var promiseArr=[];
            for(var i =0;i<data.length;i++){
                poiDict[data[i].poiID]=data[i].savedOrder;
                promiseArr.push($http.get(serverUrl+'POI/'+data[i].poiID))             
            }
            Promise.all(promiseArr)
            .then(function(result){
                var deletpois = localdeletepois.get_local_deletepois(); 
                if(deletpois==undefined)
                    deletpois = [];
                for(var i=0;i<result.length;i++){
                    var poi={};
                    poi=result[i].data.poidetails[0];
                    poi.image=result[i].data.images[0].image;
                    poi.reviews=result[i].reviews;
                    poi.order=poiDict[poi.ID];
                    if(!$scope.checkIfExists(deletpois,poi))
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

                var order = [];
                for (key in $scope.poiarray){
                    order[order.length] = [$scope.poiarray[key].ID,$scope.poiarray[key].order];
                }
                order.sort(function(x,y){
                    return x[1] > y[1] ? 1 : -1;
                });
                for(var i = 0 ;i <order.length;i++){
                    $scope.poiorder[i]= order[i][0];
                }
                
                $scope.showimgs = true;
                //$scope.poiorder=Object.keys($scope.poiarray);
                $scope.addmarker($scope.poiarray);
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
            var localPoi=getlocalpois.get_local_pois();
            var localPromiseArr=[];
            if(localPoi){
                for(var i=0;i<localPoi.length;i++){
                    localPromiseArr.push($http.post(serverUrl+'users/log/POI',{'poiID':localPoi[i].ID}))
                }
                Promise.all(localPromiseArr)
                .then(function(result){
                    $http.post(serverUrl+'users/log/savedPOIOrder',{'pois':$scope.poiorder})
                    .then(function(result){
                        localStorageService.remove('localpoiarray');
                        localStorageService.remove('localdeletepois');
                        localStorageService.remove('dbpois');
    
                        alert("pois saved successfully");
                        $location.path('/favorites')
                    },function(result){
                        alert("Something went wrong");
                    })
                    
                })
            }
            else{

                $http.post(serverUrl+'users/log/savedPOIOrder',{'pois':$scope.poiorder})
                .then(function(result){
                    localStorageService.remove('localpoiarray');
                    localStorageService.remove('localdeletepois');
                    localStorageService.remove('dbpois');

                    alert("pois saved successfully");
                },function(result){
                    alert("Something went wrong");
                })
            }
            var localDeletePoi=localdeletepois.get_local_deletepois();
            if(localDeletePoi){
                var deleteArr=[];
                for(var i=0;i<localDeletePoi.length;i++){
                    //var pro=$http({url:serverUrl+'users/log/POI', method:'DELETE', data:{'poiID': localDeletePoi[i].ID}});
                    var pro=$http.post(serverUrl+'users/log/deletePOI',{'poiID': localDeletePoi[i].ID})
                    deleteArr.push(pro);

                }
                Promise.all(deleteArr)
                .then(function(result){
                    console.log("deleted");
                },function(err){
                    alert("Something went wrong");
                })
            }
            $location.path('/favorites');
        }        
        $scope.addmarker = function(poi){
            for(var i in poi){
                var marker = L.marker([	poi[i].latitude, poi[i].longitude]).addTo(mymap);
                marker.bindPopup("<b>"+poi[i].name +"!</b><br>").openPopup();        
            }
        }


        function scrollmap(){
            var element = document.getElementById("mapid");
            var desiredPosition = 1000;
            if(window.pageYOffset >= desiredPosition){
               element.style.cssText += "position: fixed; top: auto; bottom: 20px; right: 20px; left: auto;"; 
              }
            else {
               element.style.cssText += "position: relative; top: 20px; bottom: auto; right: auto; left: 20px;";  
             } 
           }
           //window.onscroll = scrollmap;
      
    }]);