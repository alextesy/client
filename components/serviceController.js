angular.module('poiApp')
.service('setHeadersToken',[ '$http', function ($http) {

    let token = ""

    this.set = function (t) {
        token = t
        $http.defaults.headers.common[ 'x-access-token' ] = t
        // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
        console.log("set")
    }

    //this.userName='shir'

}])

.service('Authservice',['setHeadersToken','$location','$http','setUser','$route','$rootScope',function(setHeadersToken,$location,$http,setUser,$route,$rootScope){   
    self = this;
    self.check = function(){
        t = localStorage.getItem('ls.token');
        if (t){
            t = t.substring(1);
            t = t.substring(0,t.length-1);
            setHeadersToken.set(t);
            return $http.post(serverUrl+'Users/validation')
            .then(function(result){
                     $rootScope.login=true;
                     $location.path('/home');
                     console.log("Auth");
            },function(err){
                $rootScope.login=false;
                $location.path('/');
                return;
            })
        }
        else{
            $rootScope.login=false;
            $location.path('/');
            return;
        }
    }
   
}])


.factory('setUser',['$http',function($http){
    var user={};
    var service = {}

    service.setUser=function(){
        return new Promise(function(resolve,reject){
            $http.post(serverUrl + "Users/log")
            .then(function(result){
                user.username=result.data.username;
                user.firstname=result.data.FirstName;
                user.lastame=result.data.LastName;
                user.city=result.data.City;
                user.country=result.data.Country;
                user.email=result.data.Email;
                user.categories=result.data.categories;
                resolve(user);
            },function(err){
                reject(err);
            })
        })
    };
    service.getUser=function(){
        return user;
    }

    return service;
}])

.service('getlocalpois',['localStorageModel',function(localStorageModel){   
    self = this;
    let localpoiarray; 
    self.get_local_pois= function(){
        temp=localStorageModel.getLocalStorage('localpoiarray');
        if(temp){
            localpoiarray = temp;
            return localpoiarray;
        }
        return undefined;
    }
    self.update_local_pois = function(poi){
        localpoiarray=localStorageModel.getLocalStorage('localpoiarray');
        if(localpoiarray==null)
            localpoiarray = [];
        localpoiarray.push(poi);
        localStorageModel.updateLocalStorage('localpoiarray',localpoiarray);
    }
    self.remove_local_pois =function(poi){
        localpoiarray=localStorageModel.getLocalStorage('localpoiarray');
        if(localpoiarray!=null){
            for(var i=0;i<localpoiarray.length;i++){
                if(poi.ID==localpoiarray[i].ID){
                    localpoiarray.splice(i,1);
                }
            }
            localStorageModel.updateLocalStorage('localpoiarray',localpoiarray);
        }
    }
}])

.service('localdeletepois',['localStorageModel',function(localStorageModel){   
    self = this;
    let localdeletepois; 
    self.get_local_deletepois= function(){
        temp=localStorageModel.getLocalStorage('localdeletepois');
        if(temp){
            localdeletepois = temp;
            return localdeletepois;
        }
        return undefined;
    }
    self.update_local_deletepois = function(poi){
        localdeletepois=localStorageModel.getLocalStorage('localdeletepois');
        if(localdeletepois==null)
            localdeletepois = [];
        for(var i=0;i<localdeletepois.length;i++){
            if(poi.ID==localdeletepois[i].ID){
                return;
            }
        }
        localdeletepois.push(poi);
        localStorageModel.updateLocalStorage('localdeletepois',localdeletepois);
    }
    self.remove_local_deletepois =function(poi){
        localdeletepois=localStorageModel.getLocalStorage('localdeletepois');
        if(localdeletepois!=null){
            for(var i=0;i<localdeletepois.length;i++){
                if(poi.ID==localdeletepois[i].ID){
                    localdeletepois.splice(i,1);
                }
            }
            localStorageModel.updateLocalStorage('localdeletepois',localdeletepois);
        }
    }
}])


.service('dbpois',['localStorageModel',function(localStorageModel){   
    self = this;
    let dbpois; 
    self.get_dbpois= function(){
        temp=localStorageModel.getLocalStorage('dbpois');
        if(temp){
            dbpois = temp;
            return dbpois;
        }
        return undefined;
    }
    self.update_dbpois = function(poi){
        dbpois=localStorageModel.getLocalStorage('dbpois');
        if(dbpois==null)
            dbpois = [];
            dbpois.push(poi);
        localStorageModel.updateLocalStorage('dbpois',dbpois);
    }
    self.remove_dbpois =function(poi){
        dbpois=localStorageModel.getLocalStorage('dbpois');
        if(dbpois!=null){
            for(var i=0;i<dbpois.length;i++){
                if(poi.ID==dbpois[i].ID){
                    dbpois.splice(i,1);
                }
            }
            localStorageModel.updateLocalStorage('dbpois',dbpois);
        }
    }
}])
.service('dbpoisinit',['localStorageModel','$http','dbpois',function(localStorageModel,$http,dbpois){ 
    self = this;
    var checkIfExists=function(arr,poi){
        for(var i=0;i<arr.length;i++){
            if(arr[i].ID==poi.ID){
                return true;
            }
        }
        return false;
    }
    self.DBinit = function(){
        return $http.get(serverUrl+'users/log/saved')
        .then(function(response){
            data = response.data;
            poiarray ={};
            var promiseArr=[];
        for(var i =0;i<data.length;i++){
            promiseArr.push($http.get(serverUrl+'POI/'+data[i].poiID))             
        }
        return Promise.all(promiseArr)
        .then(function(result){
            for(var i=0;i<result.length;i++){
                var poi={};
                poi=result[i].data.poidetails[0];
                poi.image=result[i].data.images[0].image;
                poi.reviews=result[i].reviews;
                poiarray[poi.ID]=poi;
                var Dbpois=dbpois.get_dbpois();
                if(Dbpois){
                    if(!checkIfExists(Dbpois,poi))
                    dbpois.update_dbpois(poi);
                }
                else{
                    dbpois.update_dbpois(poi);
                }
            }
            return;
        
        })
        },function(response){
            alert("something went wrong");
        })
    }
}])
.service('updatecounter',['$rootScope','getlocalpois','dbpois','localdeletepois',function($rootScope,getlocalpois,dbpois,localdeletepois){

    self = this;
    self.update = function(){
    var localpois=getlocalpois.get_local_pois();
    var Dbpois=dbpois.get_dbpois();
    var deletepois=localdeletepois.get_local_deletepois();
    if(localpois!=undefined)
        x1 = localpois.length
    else
        x1 = 0;
    if(Dbpois!=undefined)
        x2 = Dbpois.length
    else
        x2 = 0;
    
    if(deletepois!=undefined)
        x3 = deletepois.length
    else
        x3 = 0;
    
    $rootScope.counterpoi = x1+x2-x3;
    console.log("");
    }
}])