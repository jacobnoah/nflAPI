/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


$.support.cors = true;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        
        var corsServer = "http://0.0.0.0:8080/"
        var baseURL = "http://api.sportradar.us/nfl/official/trial/v5/";
        var key = "h5j8drcak2gbkyk89kujnehr";
        var review = "en/games/2019/REG/schedule.json?api_key=";
        var url = baseURL + review + key;
        
        var weekGames = document.getElementById("weekGames");
        

        $.ajaxPrefilter(function(options) {
            if (options.crossDomain && jQuery.support.cors){
                options.url = corsServer + options.url;
                
            }
        });
        
        $.ajax({
            url: url,
            type: 'GET',
            dataTyps:'json',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            crossDomain:true,
            success: function(result){
                
                
                
                var x = document.getElementById("weeks");
                
                
                for (b = 0; b < Object.keys(result.weeks).length; b++){
                    
                    var option = document.createElement("option");
                    var numWeeks = parseInt(b, 10);
                    option.text = numWeeks + 1;
                    
                    x.add(option);
                    
                }
                
                
                
                x.onchange = function() {
                    var weekLength = weekGames.length;
                    for (r = 0; r< weekLength; r++) {
                        weekGames.remove(0);
                    }
                    var blankOption = document.createElement("option");
                    blankOption.selected = true;
                    blankOption.disabled = true;
                    blankOption.hidden = true;
                    blankOption.style = "display : none";
                    weekGames.add(blankOption);
                    //weekGames.length = 0;
                    for (z = 0; z < Object.keys(result.weeks[this.value - 1].games).length; z++){
                        
                        //$("body").append(gameButton);
                        var gameOption = document.createElement("option");
                        gameOption.text = result.weeks[this.value - 1].games[z].away.name + " AT " + result.weeks[this.value - 1].games[z].home.name;
                        //console.log(result.weeks[this.value - 1].games[z]);
                        gameOption.value = result.weeks[this.value - 1].games[z].id;
                        
                        weekGames.add(gameOption);
                        
                    }
                }
                
                weekGames.onchange = function() {
                    setTimeout(function(){
                        var newCorsServer = "http://0.0.0.0:8080/";
                        var newBaseURL = "http://api.sportradar.us/nfl/official/trial/v5/";
                        var newKey = "h5j8drcak2gbkyk89kujnehr";
                        var gameID = weekGames.options[weekGames.selectedIndex].value;
                        
                        var newReview = "en/games/" + gameID + "/pbp.json?api_key=";
                        var newUrl = newBaseURL + newReview + newKey;
                    $.ajax({
                        
                        url: newUrl,
                        type: 'GET',
                        dataTyps:'json',
                        headers: {'X-Originating-IP': '149.160.218.156'},
                        crossDomain:true,
                        success: function(newResult){
                            var playInfo = document.getElementById("playInfo");            
                            var playDescription = "";
                            for(i = 0; i < Object.keys(newResult.periods).length; i++){
                                        
                                //console.log(Object.keys(newResult.periods).length);
                                for(x = 0; x < Object.keys(newResult.periods[i].pbp).length; x++){
                                    //console.log(Object.keys(newResult.periods[i].pbp).length);
                                    if (!(x == 0 && i == 0)){
                                        if ("events" in newResult.periods[i].pbp[x]) {
                                            for(z = 0; z < Object.keys(newResult.periods[i].pbp[x].events).length; z++){
                                                //console.log(Object.keys(result.periods[i].pbp[x].events).length
                                                playDescription += "<br>" + JSON.stringify(newResult.periods[i].pbp[x].events[z].description);
                                                //console.log(playDescription);
                                                //console.log(JSON.stringify(newResult.periods[i].pbp[x].events[z].description));
                                                var r= document.createElement("button");
                                                r.innerHTML = playDescription;
                                                r.style.display = "inline";
                                                r.style.width = '100%';
                                                r.style.background = 'black';
                                                r.style.color = 'white';
                                                r.style.textAlign = 'center';
                                                r.style.alignSelf = 'center';
                                                //$("body").append(r);
                                                
                                            }
                                        }
                                                
                                    }
                                
                                }
                            }
                            //$("body").append("<h3>" + playDescription + "</h3>");
                            playInfo.innerHTML = playDescription;
                            
                        },
                        error: function(xhr, status, error){
                            console.log("Error");
                            console.log(xhr.statusText);
                            console.log(xhr.responseText);
                            console.log(status);
                            console.log(error);
                        }
                        
                        
                    
                    });
                }, 2000);
            }
            }
            
        });  
            
    },   
        
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }

}      
app.initialize();
