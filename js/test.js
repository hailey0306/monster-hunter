// var

var db = [];






// make function

function checkLoginForm(){
	if(!waitForDB(checkLoginForm)) return;

	var user = db.filter(function(obj){
		if(obj.username!=$("#login-username").val()) return false;
		if(obj.password!=$("#login-password").val()) return false;
		return true;
	});



	if(user.length) {
		localStorage.loggedIn = user[0].id;
		$("#login-form")[0].reset();
	} else {
		localStorage.removeItem("loggedIn");
		$(".alert").html("Username or Password incorrect.");
		setTimeout(function(){
			$(".alert").html("&nbsp;");
		},4000);
	}
	checkStorage();
}

function checkStorage(){
	if(localStorage.loggedIn === undefined) {
		// Is NOT Logged In
		// $("body").addClass("loggedIn")
		if(location.hash!="#login-page" ||
			location.hash!="#signup-page" ||
			location.hash!="")
			$.mobile.navigate("#landing-page")
	} else {
		// Is Logged In
		// $("body").removeClass("loggedIn")
		if(location.hash=="#login-page" ||
			location.hash=="")
			$.mobile.navigate("#map-page")
	}
}





// function ghostinfoclick() {
//     var x = document.getElementById("ghost-info");
//     if (x.style.display === "none") {
//         x.style.display = "block";
//     } else {
//         x.style.display = "none";
//     }

//     var y = document.getElementById("ghost2");
//     if (y.style.width === "2.75em") {
//         y.style.width = "3.5em";
//     } else {
//         y.style.width = "2.75em";
//     }

// }




// function searchboxclick() {
//     var z = document.getElementById("search-box");
//     if (z.style.display === "none") {
//         z.style.display = "block";
//     } else {
//         z.style.display = "none";
//     }

// }




function showListPage(){
	console.log("trying");
	if(!waitForDB(showListPage)) return;
	console.log(db,currentUser());

	showDataList(
		currentUser()[0].ghosts,
		$("#ghost-list-template").html(),
		"#list-page .ghost-list-all"
		);

}

// function showListFavPage(){
// 	console.log("trying");
// 	if(!waitForDB(showListFavPage)) return;
// 	console.log(db,currentUser());

// 	var foundghosts = currentUser()[0].ghosts.filter(function(obj,index,arr){
// 		return obj.id==0 || obj.id==1 || obj.id==2;
// 	})

// 	showDataList(
// 		foundghosts,
// 		$("#ghost-list-template").html(),
// 		"#list-page .ghost-list-fav"
// 		)

// }

function showProfilePage(){
	if(!waitForDB(showProfilePage)) return;
	// console.log(db);
	console.log(currentUser())
	showDataList(
		currentUser(),
		$("#profile-template").html(),
		"#profile-page [data-role='main']"
		)

}


function showEditGhostPage(){
	if(!waitForDB(showEditGhostPage)) return;

	showDataList(
		currentGhost(),
		$("#ghost-edit-template").html(),
		"#ghost-edit-page [data-role='main']"
		)
}

function showEditUserPage(){
	if(!waitForDB(showEditUserPage)) return;

	showDataList(
		currentUser(),
		$("#user-edit-template").html(),
		"#profile-edit-page [data-role='main']"
		)
}


function showGhostProfilePage(){
	if(!waitForDB(showGhostProfilePage)) return;

	if(currentGhost()[0]===undefined) {
		$.mobile.navigate("#map-page");
		return;
	}

	var locations = currentGhost()[0].locations;
	console.log(locations)

	showDataList(
		currentGhost(),
		$("#ghost-profile-template").html(),
		"#ghost-profile-page [data-role='main']"
		);

	for(var i in locations) {
		locations[i].img = currentGhost()[0].img;
		}

	showMap(
		locations,
		"#ghost-profile-page .ghost-map",
		12,
		function(){

			var map = $("#ghost-profile-page .ghost-map");
			var markers = map.data("markers");
			var marker;

			var lineSymbol = {
			  path: 'M 0,-1 0,1',
			  strokeOpacity: 1,
	          strokeColor: '#181743',
	          strokeWeight: 1,
			  scale: 2
			};

			var polyline = new google.maps.Polyline({
	          path: locations,
	          geodesic: true,
	          strokeOpacity: 0,
	          icons: [{
	          	icon: lineSymbol,
	          	offset: '0',
	          	repeat: '10px'
	          }]
	        });

        	polyline.setMap(map.data("map"));

			map.data("map").addListener(
				"click",
				function(e){
					console.log(
						e.latLng.lat(),
						e.latLng.lng()
						)
					$("#new-location-lat").val(e.latLng.lat())
					$("#new-location-lng").val(e.latLng.lng())
					$("#add-location").addClass("active")
				}
			);

			for(var i in map.data("markers")) {
				map.data("markers")[i].addListener(
					"click",
					// Closure makes sure loop variables are set
					(function(marker,id){
						return function(e){


							var datesplit = locations[id].date.split(" ")
							var thisdate = new Date(datesplit[0]);
							console.log(thisdate,locations[id])

							// Change the data inside the infowindow
							map.data("infoWindow")
								.setContent(
									""+(
										thisdate.getFullYear()+"-"+
										lz(thisdate.getMonth(),2)+"-"+
										lz(thisdate.getDay(),2)
									)+
									"<div class='location-description'>"+locations[id].description+"</div>"
									);
							// Open the window at the marker
							map.data("infoWindow")
								.open(map,marker);
						}
					})(map.data("markers")[i],i)
				)
			}
		}
		);
}


function showMainMapPage(){
	if(!waitForDB(showMainMapPage)) return;


// in class
	
	var ghosts = currentUser()[0].ghosts;

		functionMainMap(ghosts);
}

function functionMainMap(fullarr){
	var map = $('#map-page .map');
	var ghosts = currentUser()[0].ghosts;


	var arr = [];
	for(var i in fullarr) {
		// arr.push(
			let lastloc = last(fullarr[i].locations);

			if(lastloc != undefined){
				fullarr[i].lat = lastloc.lat;
				fullarr[i].lng = lastloc.lng;
				arr.push(fullarr[i])
			}

		// );
	}


	// console.log(arr);
		showMap(
		arr,
		"#map-page .map",
		12,
		// Make a callback function that gets called when showMap is done
		function(){

			var map = $("#map-page .map");
			var markers = map.data("markers");
			var marker;

			map.data("map").addListener(
				"click",
				function(e){
					console.log(
						e.latLng.lat(),
						e.latLng.lng()
						)
					$("#new-main-location-lat").val(e.latLng.lat())
					$("#new-main-location-lng").val(e.latLng.lng())
					$("#add-map-ghost").addClass("active")
				}
			);

			for(var i in map.data("markers")) {
				map.data("markers")[i].addListener(
					"click",
					// Closure makes sure loop variables are set
					(function(marker,id){
						return function(e){

							// Change the data inside the infowindow
							map.data("infoWindow")
								.setContent(
									
									
									`
									<div class="info-window">
									<h2>${ghosts[id].name}</h2>
									<div class="flex-parent">
									
										<div class="flex-child">
											<img src="${ghosts[id].img}" alt="" class="img-info">
										</div>
										<div class="flex-child">
											<div>${ghosts[id].type}</div>
											<div>${ghosts[id].gender}</div><br>
											<div class="ghostmap-item" data-id="${ghosts[id].id}"">visit profile</div>
										</div>
									</div>
									</div>
									`
									
									);
							// Open the window at the marker
							map.data("infoWindow")
								.open(map,marker);
						}
					})(map.data("markers")[i],i)
				)
			}
			console.log(map.data())
		}
	);


}




function handleEditGhostForm(e){
	e.preventDefault();
	var ca = currentGhost()[0];

	ca.name = $("#edit-ghost-name").val();
	ca.type = $("#edit-ghost-type").val();
	ca.gender = $("#edit-ghost-gender").val();
	ca.about = $("#edit-ghost-about").val();
	
	$("#edit-form")[0].reset()
	$.mobile.navigate("#list-page");
}

function handleEditUserForm(e){
	e.preventDefault();
	var cu = currentUser()[0];
	var newimage = /url\("(.+)"\)/.exec(
			$(".imagepicker").css("background-image"))
	console.log(newimage,$(".imagepicker").css("background-image"))

	cu.name = $("#edit-user-name").val();
	cu.username = $("#edit-user-username").val();
	cu.email = $("#edit-user-email").val();
	cu.location = $("#edit-user-location").val();
	cu.img = newimage[1];
	
	$("#edit-user-form")[0].reset()
	$.mobile.navigate("#profile-page");
}


// function toggleBounce(marker) {
//     if (marker.getAnimation() !== null) {
//       marker.setAnimation(null);
//     } else {
//       marker.setAnimation(google.maps.Animation.BOUNCE);
//     }
//   }



// MAP FUNCTION


function initMap(){
	console.log("google map has been loaded")
}

function showMap(arr,target,zoom,callback){

	if(!waitForMaps(showMap,arguments)) return;

	if(!$(target).data("map")) {
		$(target).data(
			'map',
			new google.maps.Map(
				$(target)[0], 
				{
		          center: {lat: 37.772063, lng: -122.425729},
		          disableDefaultUI: true,
		          zoom: zoom,
		          styles:
		          [
				    {
				        "featureType": "all",
				        "elementType": "labels.text.fill",
				        "stylers": [
				            {
				                "saturation": 36
				            },
				            {
				                "color": "#333333"
				            },
				            {
				                "lightness": 40
				            }
				        ]
				    },
				    {
				        "featureType": "all",
				        "elementType": "labels.text.stroke",
				        "stylers": [
				            {
				                "visibility": "on"
				            },
				            {
				                "color": "#ffffff"
				            },
				            {
				                "lightness": 16
				            }
				        ]
				    },
				    {
				        "featureType": "all",
				        "elementType": "labels.icon",
				        "stylers": [
				            {
				                "visibility": "off"
				            }
				        ]
				    },
				    {
				        "featureType": "administrative",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#fefefe"
				            },
				            {
				                "lightness": 20
				            }
				        ]
				    },
				    {
				        "featureType": "administrative",
				        "elementType": "geometry.stroke",
				        "stylers": [
				            {
				                "color": "#fefefe"
				            },
				            {
				                "lightness": 17
				            },
				            {
				                "weight": 1.2
				            }
				        ]
				    },
				    {
				        "featureType": "administrative.neighborhood",
				        "elementType": "labels.text",
				        "stylers": [
				            {
				                "visibility": "off"
				            }
				        ]
				    },
				    {
				        "featureType": "landscape",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#f5f5f5"
				            },
				            {
				                "lightness": 20
				            }
				        ]
				    },
				    {
				        "featureType": "landscape",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#d5d5d5"
				            }
				        ]
				    },
				    {
				        "featureType": "landscape.man_made",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#7574c0"
				            },
				            {
				                "saturation": "-37"
				            },
				            {
				                "lightness": "75"
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#f5f5f5"
				            },
				            {
				                "lightness": 21
				            }
				        ]
				    },
				    {
				        "featureType": "poi.business",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#7574c0"
				            },
				            {
				                "saturation": "-2"
				            },
				            {
				                "lightness": "53"
				            }
				        ]
				    },
				    {
				        "featureType": "poi.park",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#dedede"
				            },
				            {
				                "lightness": 21
				            }
				        ]
				    },
				    {
				        "featureType": "poi.park",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#7574c0"
				            },
				            {
				                "lightness": "69"
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#d1d0ee"
				            },
				            {
				                "lightness": "25"
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "elementType": "geometry.stroke",
				        "stylers": [
				            {
				                "color": "#ffffff"
				            },
				            {
				                "lightness": 29
				            },
				            {
				                "weight": 0.2
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "elementType": "labels.text.fill",
				        "stylers": [
				            {
				                "lightness": "38"
				            },
				            {
				                "color": "#000000"
				            }
				        ]
				    },
				    {
				        "featureType": "road.arterial",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#ffffff"
				            },
				            {
				                "lightness": 18
				            }
				        ]
				    },
				    {
				        "featureType": "road.local",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#ffffff"
				            },
				            {
				                "lightness": 16
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#f2f2f2"
				            },
				            {
				                "lightness": 19
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#e9e9e9"
				            },
				            {
				                "lightness": 17
				            }
				        ]
				    }
				]


		    	}
			)
		)
		.data(
			"infoWindow",
			new google.maps.InfoWindow({
				content:""
			})
		);
	}

	if($(target).data("markers")) {
		for(var i in $(target).data("markers")) {
			$(target).data("markers")[i].setMap(null);
		}
	}

	$(target).data("markers",[]);


	var bounds = new google.maps.LatLngBounds();

	var marker;
	for(var i in arr) {
		marker = new google.maps.Marker({
			position: arr[i],
			map: $(target).data("map"),
			icon: {
				url:arr[i].img,
				scaledSize:{
					width:40,
					height:40
				}
			}
		});
		$(target).data("markers").push(marker);
		bounds.extend(marker.getPosition());

		// marker.addListener('click', (function(marker){
		// 	return function(){ toggleBounce(marker); }
		// })(marker));

	}



	setTimeout(function(){
		// google.maps.event.trigger(
		// $(target).data("map"),"resize");

		if($(target).data("markers").length>1){

			$(target).data("map").fitBounds(bounds);
		} else if($(target).data("markers").length==1){
			$(target).data("map").setCenter(
				$(target).data("markers")[0].getPosition()
				);
		}

	},350)

	// Use callback if one is given.
	if(callback) callback();
}


function showSearchMap(result,arr,target,callback){


}



// HELPER FUNCTION

function waitForDB(fn){
	if(!db.length) {
		setTimeout(function(){
			fn();
		},100);
		return false;
	}
	return true;
}

function waitForMaps(fn,args){
	if(google===undefined) {
		setTimeout(function(){
			fn.apply(this,args);
		},100);
		return false;
	}
	return true;
}

function currentUser(){
	return db.filter(function(obj){
		return obj.id==localStorage.loggedIn;
	});
}
function currentGhost(){
	return currentUser()[0].ghosts.filter(function(obj){
		return obj.id==localStorage.currentGhost;
	});
}


function last(arr) {
	// ternary, comparison?iftrue:iffalse
	return arr.length==0?
		undefined:
		arr[arr.length-1];
}
function lz(n,e){return (+n+Math.pow(10,e)+'').substr(1)}



// image uploader

function readFiles(files,callback,index=0) {
  if (files && files[0]) {
    let file = files[index++],
        reader = new FileReader();
    reader.onload = function(e){
      callback(e);
      if(index<files.length) readFiles(files,callback,index);
    }
    reader.readAsDataURL(file);
  }
}







// run code

$.ajax({
	url:"data/data.json",
	dataTye:"json"
})

.done(function(d){
	db = d;
})





// doc ready


$(function(){

	checkStorage();

	$(document).on("pagecontainerbeforeshow", function(event,ui){
		console.log(event,ui);

		switch(ui.toPage[0].id) {
			case "map-page":
			// some code
				console.log("This is a map");
				showMainMapPage();
				break;
			case "profile-page":
			// some code
				showProfilePage();
				break;
			case "list-page":
			// some code
				showListPage();
				// showListFavPage();
				break;
			case "ghost-profile-page":
			// some code
				showGhostProfilePage();
				break;
			case "ghost-edit-page":
			// some code
				showEditGhostPage();
				break;
			case "profile-edit-page":
			// some code
				showEditUserPage();
				break;
		}
	})

	.on("click",".ghost-each,.ghostmap-item",function(){
		console.log($(this).data("id"))
		localStorage.currentGhost = $(this).data("id");
		$.mobile.navigate("#ghost-profile-page")
	})

	.on("click",".profile-main",function(){
		var p = $(this).parent().toggleClass("active");
        $('.see-more').text(p.hasClass("active")?'see less':'see more');      
	})


	.on("submit","#add-map-ghost-form",function(e){
		e.preventDefault();
		
		currentGhost()[0].locations.push(
		{
			id:currentGhost()[0].locations.length,
			date:(new Date()).toString(),
			lat:+$("#new-main-location-lat").val(),
			lng:+$("#new-main-location-lng").val(),
			description:$("#new-main-location-description").val()
		});
		showGhostProfilePage();
	})

	.on("submit","#new-location",function(e){
		e.preventDefault();
		
		currentGhost()[0].locations.push(
		{
			id:currentGhost()[0].locations.length,
			date:(new Date()).toString(),
			lat:+$("#new-location-lat").val(),
			lng:+$("#new-location-lng").val(),
			description:$("#new-location-description").val()
		});
		showGhostProfilePage();
	})

	.on("submit","#new-list-ghost",function(e){
		e.preventDefault();
		
		currentUser()[0].ghosts.push(
		{
			// id:currentUser()[0].ghosts.length,
			id:currentUser()[0].nextIndex++,
			name:$("#new-list-ghost-name").val(),
			type:$("[name='new-list-ghost-type']:checked").val(),
			gender:$("[name='new-list-ghost-gender']:checked").val(),
			img:$("[name='add-ghost-type']:checked").val(),
			about:$("#new-list-ghost-description").val(),
			locations:[]
		});
		$("#new-list-ghost")[0].reset()
		showListPage();

	})

	.on("submit","#login-form",function(e){
		e.preventDefault();
		console.log("honk")
		checkLoginForm();
	})

// list-page search

	.on("input",".js-search",function(e){
		console.log($(this).val());
		var search_string = $(this).val();
		var regex = RegExp(search_string,'i');
		var result = currentUser()[0].ghosts.filter(function(obj,id,arr){
			var found = false;
			if(regex.test(obj.name)) found = true;
			if(regex.test(obj.type)) found = true;
			if(regex.test(obj.description)) found = true;
			return found;
		})
		showDataList(
			result,
			$("#ghost-list-template").html(),
		"#list-page .ghost-list-all"

		)
		console.log(result);
	})


// map-page search

	.on("input",".js-main-search",function(e){

		var search_string = $(this).val();
		var regex = RegExp(search_string,'i');
		var result = currentUser()[0].ghosts.filter(function(obj,id,arr){
			var found = false;
			if(regex.test(obj.name)) found = true;
			if(regex.test(obj.type)) found = true;
			if(regex.test(obj.description)) found = true;
			return found;
		})

		if(search_string == "") {
			result = currentUser()[0].ghosts;
		}


		functionMainMap(result);
		
	})
	

// list-page filter

	.on("click",".js-filter",function(){
		var str = $(this).data("value");
		var property = $(this).data("sort");

		var result = currentUser()[0].ghosts.filter(function(obj,id,arr){
			return obj[property] == str;
		})

		if(str == "" || str == "all"){
			result = currentUser()[0].ghosts;
		}

		showDataList(
			result,
			$("#ghost-list-template").html(),
			"#list-page .ghost-list-all"
		)
	})



// map-page filter

	.on("click",".map-filter",function(){
		// console.log($(this).val())
		var filter = $(this).data("filter");
		var str = $(this).data("value");

		if(str == "all") {
			var result = currentUser()[0].ghosts;
		} else {
			var result = currentUser()[0].ghosts.filter(function(obj,id,arr){
				return obj[filter] == str;
			})
		}
		
		functionMainMap(result);
	})

	.on("click",".x-ghost",function(e){
		e.preventDefault();
		var did = +$(this).data("id");
		cu = currentUser()[0];
		console.log(cu.ghosts)
		cu.ghosts = cu.ghosts.filter(function(obj,id,arr){
			return obj.id!=did;
		})
		console.log(cu.ghosts)

		$.mobile.navigate("#list-page");

	})


	.on("submit","#edit-form",handleEditGhostForm)
	.on("click",".js-submit-edit-ghost",handleEditGhostForm)

	.on("submit","#user-edit-form",handleEditUserForm)
	.on("click",".js-submit-edit-user",handleEditUserForm)

// imagepicker userprofile

	.on("change",".imagepicker-replace input",function() {
	  // store the current "this" into a variable
	  var imagepicker = this;
	  console.log(this)
	  readFiles(this.files,function(e) {
	    // "this" will be different in the callback function
	    $(imagepicker).parent()
	      .addClass("picked")
	      .css({"background-image":"url("+e.target.result+")"});
	  });

	})


	$(".js-logout").on("click",function(e){
		// e.preventDefault();
		localStorage.removeItem("loggedIn");
		// checkStorage();
	})




	$(".js-popup").on("click",function(){
		$($(this).data("poptarget")).addClass("active")
	})

	$(".close").on("click",function(){
		$(this).closest(".modal").removeClass("active")
	})




	$("[data-template]").each(function(){
		var t = $($(this).data("template"));
		$(this).html(t.html());
	})

  // $("#delay-desc").delay(5000).fadeIn(500);
  // delay desc landing page
  	$("#delay-desc").hide();
	$("#delay-desc").delay(2000).fadeIn(100);

	// ghostinfoclick();

	// searchboxclick();

	$('.toggle').click(function() {
    $('.toggle-target').toggle('slow');
	});



})

$(function(){

	$("dt").on("click",function(){

		// $(this).next().slideToggle()
		
		$(this).next().slideDown()
			.siblings("dd").slideUp()
	});

	$(".tab").on("click",function(e){
		// console.log(e);

		var id = $(this).index();

		$(this).addClass("active")
			.siblings().removeClass("active")

		$(this).closest(".tabgroup")
			.find(".content").eq(id).addClass("active")
			.siblings().removeClass("active");
	})
});

// input time value now
// https://codepen.io/rafaelcastrocouto/pen/Iyewu

// $(function(){  
//   $('input[type="time"][value="now"]').each(function(){    
//     var d = new Date(),        
//         h = d.getHours(),
//         m = d.getMinutes();
//     if(h < 10) h = '0' + h; 
//     if(m < 10) m = '0' + m; 
//     $(this).attr({
//       'value': h + ':' + m
//     });
//   });
// });

$(function(){
        $(".new-list-ghost-type").click(function(){
          if($(this).val() === "sad ghost")
            $("#sad-ghost-option").show("fast");
          else
            $("#sad-ghost-option").hide("fast");
        });
        $(".new-list-ghost-type").click(function(){
          if($(this).val() === "weird ghost")
            $("#weird-ghost-option").show("fast");
          else
            $("#weird-ghost-option").hide("fast");
        });
        $(".new-list-ghost-type").click(function(){
          if($(this).val() === "cute ghost")
            $("#cute-ghost-option").show("fast");
          else
            $("#cute-ghost-option").hide("fast");
        });


	// $(".new-list-ghost-image").on("click",function(){
	// 	$(this).addClass("radio-active")
	// })


      });

