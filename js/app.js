// instantiate variables
var db=[];
// make functions
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
		// $("body").removeClass("loggedIn");
		if(location.hash!="#login-page" ||
			location.hash!="#signup-page" ||
			location.hash!="")
			$.mobile.navigate("#login-page");
	} else {
		// Is Logged In
		// $("body").addClass("loggedIn");
		if(location.hash=="#login-page" ||
			location.hash=="")
			$.mobile.navigate("#main-page");
	}
}






/* ---------------------------
Show Page Functions 
--------------------------- */
function showListPage(){
	if(!waitForDB(showListPage)) return;
	monsterlisticon();

	showDataList(
		currentUser()[0].animals,
		$("#monsterlist-template").html(),
		"#list-page .monsterlist"
		);
	
}

function showProfilePage(){
	if(!waitForDB(showProfilePage)) return;

	showDataList(
		currentUser(),
		$("#profile-template").html(),
		"#profile-page .profile-main"
		)

	profileicon();
}
function showAnimalProfilePage(){
	if(!waitForDB(showAnimalProfilePage)) return;

		if(!currentAnimal().length) {
		// $.mobile.navigate("#main-page");
		return;
	}

	var locations = currentAnimal()[0].locations;
	var map = $('#monster-location-page .profile-map');

	currentAnimal()[0].locations_count = locations.length;

	showDataList(
		currentAnimal(),
		$("#animal-profile-template").html(),
		"#monster-location-page .profile-main"
	);

	showDataList(
		currentAnimal()[0].locations,
		$("#animal-description-template").html(),
		"#monster-location-page .profile-content"
	);


	for(var i in locations) {
		locations[i].img = currentAnimal()[0].img;
	}

	showMap(
		locations,
		map,
		function(){
			var markers = map.data("markers");

			map.data("map").addListener(
				"click",
				function(e){
					console.log(
						e.latLng.lat(),
						e.latLng.lng()
						);
					$("#new-location-lat").val(e.latLng.lat());
					$("#new-location-lng").val(e.latLng.lng());
					$("#add-new-location").addClass("active");
				}
			);

			for(var i in markers) {
				console.log(markers[i])
				markers[i].addListener(
					"click",
					// closure, anonymous function, recursion
					(function(id,marker,location){
						return function(){
							console.log(id,map.data("infoWindow"))
							map.data("infoWindow")
								.setContent(`
								\<strong\>Time: \<\/strong\>${location.date}\<br\>\<strong\>Confession: \<\/strong\>${location.confession}
								`);
							map.data("infoWindow")
								.open(map,marker)
						}
					})(i,markers[i],locations[i])
				)
			}
		}
	);
}


function showMainMapPage(){
	if(!waitForDB(showMainMapPage)) return;


	var animals = currentUser()[0].animals;

	showDataList(
		currentUser()[0].animals,
		$("#my-filter-list-template").html(),
		"#main-page .the-filter"
	);

	showDataList(
		currentUser()[0].animals,
		$("#my-selection-template").html(),
		"#main-page .my-select-nav"
	);

	makeMainMap(animals);
	mapIcon();
}


function makeMainMap(fullarr){
	var animals = currentUser()[0].animals;
	var map = $('#main-page .map');
	var arr = [];
	for(var i in fullarr) {
		arr.push(fullarr[i]);

	}
	console.log(arr);
	var locations = [];
	for(var a in arr) {
		// console.log(animals[a].locations)
		locations=locations.concat(arr[a].locations)
	}


	showMap(
		locations,
		map,
		function(){
			var markers = map.data("markers");

			map.data("map").addListener(
				"click",
				function(e){
					console.log(
						e.latLng.lat(),
						e.latLng.lng()
						);
					$("#new-location-lat").val(e.latLng.lat());
					$("#new-location-lng").val(e.latLng.lng());
					$("#add-location2").addClass("active");
				}
			);

			for(var i in markers) {
				markers[i].addListener(
					"click",
					// closure, anonymous function, recursion
					(function(id,marker,location){
						return function(){
							console.log(id,map.data("infoWindow"))
							map.data("infoWindow")
								.setContent(`
								\<strong\>Time: \<\/strong\>${location.date}\<br\>\<strong\>Confession: \<\/strong\>${location.confession}
								`);
							map.data("infoWindow")
								.open(map,marker)
						}
					})(i,markers[i],locations[i])
				)
			}
		}
	);
}



/* ---------------------------
Maps Functions 
--------------------------- */

// Map style code from Bartosz Kurpiewski source:http://www.mapstylr.com/author/kurpieldesignu/

function initMap(){
	console.log("maps loaded")
	
}
function showMap(arr,target,callback){
	if(!waitForMaps(showMap,arguments)) return;

	var myStyle=[
    {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#ffffff"
            },
            {
                "lightness": 61
            },
            {
                "gamma": 2.29
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": -73
            },
            {
                "lightness": 29
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ebf7ff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#1441b3"
            },
            {
                "lightness": 34
            }
        ]
    }
]						
	
	
	if(!$(target).data("map")) {
		$(target)
		.data(
			"map",
			new google.maps.Map(
				$(target)[0],
				{
		          center: {lat: 37.786053, lng: -122.397229},
		          zoom: 10,
		          styles: myStyle

		        }
		    )
		)
		.data(
			"infoWindow",
			new google.maps.InfoWindow({
				content:"",
				maxWidth: 200
			})
		);
	}
	// var map is actually $(target).data("map")

	if($(target).data("markers")) {
		for(var i in $(target).data("markers")) {
			$(target).data("markers")[i].setMap(null);
		}
	}

	$(target).data("markers",[]);

	var marker, bounds = new google.maps.LatLngBounds(null);
	for(var i in arr) {
		marker = new google.maps.Marker({
			position: arr[i],
			map: $(target).data("map"),
			icon: {
				url:arr[i].img,
				scaledSize: {
					width:20,
					height:20
				}
			}
		});
		$(target).data("markers").push(marker);
		bounds.extend(marker.getPosition());
	}

	setTimeout(function(){
		if($(target).data("markers").length>1) {
			$(target).data("map").fitBounds(bounds);
		}
		else if($(target).data("markers").length==1) {
			$(target).data("map").setCenter(
				$(target).data("markers")[0].getPosition()
				);
		}
		
		if(callback) callback();
	},150);

	
}





/* ---------------------------
Helper Functions 
--------------------------- */
function waitForDB(fn){
	console.log("trying")
	if(!db.length) {
		setTimeout(function(){
			fn();
		},100);
		return false;
	}
	return true;
}
function waitForMaps(fn,args){
	if(window.google === undefined) {
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
function currentAnimal(){
	return currentUser()[0].animals.filter(function(obj){
		return obj.id==localStorage.currentAnimal;
	});
}
function last(arr) {
	// ternary, comparison?istrue:isfalse
	return arr.length==0?
		undefined:
		arr[arr.length-1];
}

/* ---------------------------
		My fubctions
--------------------------- */
function mapIcon(){
	$(".mapicon").attr("src","icon/map.png");
	$(".monsterlisticon").attr("src","icon/list.png");
	$(".profileicon").attr("src","icon/profile-gray.png");
	console.log("map icon changed")


}
function monsterlisticon(){
	$(".mapicon").attr("src","icon/map-gray.png");
	$(".monsterlisticon").attr("src","icon/list1.png");
	$(".profileicon").attr("src","icon/profile-gray.png");
	console.log("animal icon changed")
}
function profileicon(){
	$(".mapicon").attr("src","icon/map-gray.png");
	$(".monsterlisticon").attr("src","icon/list.png");
	$(".profileicon").attr("src","icon/profile.png");
	console.log("profile icon changed")

}

function addLocation2(){
	$(".add-location2").on("click",function(e){
	  e.preventDefault();
	  $("#add-location2").addClass("active")
	 })
	 $(".modal").on("click",function(e){
	  $(this).removeClass("active")
	 })	 
}



// run code

/* ---------------------------
Call for Database
--------------------------- */

$.ajax({
	url:"data/myjson.json",
	dataType:"json"
})
.done(function(data){
	db=data;
})
// document ready

// document ready
$(function(){

	checkStorage();


	/* ---------------------------
	Page Switch Logic
	--------------------------- */
	$(document).on("pagecontainerbeforeshow",function(e,ui){
		// console.log(e,ui)
		console.log(ui.toPage[0].id)

		switch(ui.toPage[0].id) {
			case "login-page":
				//do some code
				break;
			case "main-page":
				//do some code
				console.log("This is a map")
				showMainMapPage();
				break;
			case "list-page":
				//do some code
				showListPage();
				
				break;
			case "profile-page":
				//do some code
				showProfilePage();

				break;
			case "monster-location-page":
				//do some code
				showAnimalProfilePage();
				break;
		}
	})





	/* ---------------------------
	Event Handlers
	--------------------------- */
	.on("click",".animallist-item,.animalmap-item",function(){
		console.log($(this).data("id"))
		localStorage.currentAnimal = $(this).data("id");
		$.mobile.navigate("#monster-location-page")
	})
	.on("submit","#login-form",function(e){
		e.preventDefault();
		checkLoginForm();
	})
	.on("click",".js-logout",function(e){
		e.preventDefault();
		localStorage.removeItem("loggedIn");
		checkStorage();
	})

	.on("click",".add-animal",function(e){
		e.preventDefault();
		$("#add-animal").addClass("active")
	})

	.on("click",".add-location2",function(e){
		e.preventDefault();
		$("#notification").addClass("active");
		$(this).hide();
	})
	.on("click",".animal-image",function(e){
		e.preventDefault();
		console.log("clicked")
		$("#monster-location-page .profile-content").toggleClass("active")
	})

	.on("click",".js-delete-location",function(e){
		console.log("clicked")
		e.preventDefault();


		var id = +$(this).data("id");

		
		currentAnimal()[0].locations =
			currentAnimal()[0].locations.filter(
				function(o,i,a){
					return o.id != id;
			});
			console.log(id)
			
		currentAnimal()[0].loc_amount-=1;

		showAnimalProfilePage();
	})

	.on("click",".js-popup",function(){
		$($(this).data("poptarget")).addClass("active")
	})
	.on("click",".modal-back",function(e){
		$(this).closest(".modal").removeClass("active")
	})
	.on("click",".modal-close",function(){
		$(this).closest(".modal").removeClass("active")
	})
	.on("submit",".modal-form",function(e){
		$(this).closest(".modal").removeClass("active")
	})


	// .on("click",".profile-main",function(){
	// 	$(this).parent().toggleClass("active")
	// })

	.on("submit","#new-location",function(e){
		e.preventDefault();
		console.log("honk")

		currentAnimal()[0].locations.push({
			"id": currentAnimal()[0].locations.length,
			"img":currentAnimal()[0].img,
            "date": dayjs().format("YYYY-MM-DD HH:mm:ss"),
            "lat": +$("#new-location-lat").val(),
            "lng": +$("#new-location-lng").val(),
            "confession": $("#new-location-description").val(),
		})

		currentAnimal()[0].loc_amount+=1;


		$(this)[0].reset();

		showAnimalProfilePage();
		console.log("submitted!!")
	})

	.on("click","#save-location2",function(e){
		e.preventDefault();
		console.log("add-location2")
		var thisType = $("#my-select-nav").val();
		console.log(currentUser()[0].animals[thisType]);

		// var loc = $(".map").data("map").getCenter();

		currentUser()[0].animals[thisType].locations.push({
			"id": currentUser()[0].animals[thisType].locations.length,
			"img":currentUser()[0].animals[thisType].img,
            "date": dayjs().format("YYYY-MM-DD HH:mm:ss"),
            "lat": +$("#new-location-lat").val(),
            "lng": +$("#new-location-lng").val(),
            "confession": $("#new-confession").val(),
		})
		currentUser()[0].animals[thisType].loc_amount+=1;

		// clear no-form
		$('#my-select-nav').val(7);
		$('#new-confession').val('');

		$("#add-location2").removeClass("active")
		showMainMapPage();
		console.log("submitted222222!!")
	})

	.on("click","#save-profile",function(e){
		e.preventDefault();
		// var id=$("#theid").val()
		// console.log(id);

        currentUser()[0].firstName = $("#firstName").val();
        currentUser()[0].lastName = $("#lastName").val();
        currentUser()[0].username = $("#userName").val();
        currentUser()[0].email = $("#email").val();

		showProfilePage();
	})

	.on("click","#ok",function(e){
		e.preventDefault();
		$('#notification').removeClass("active");
	})

	.on("submit","#add-animal-form",function(e){
		e.preventDefault();
		console.log("submitted")

		currentUser()[0].animals.push({
			"id": currentUser()[0].animals.length,
			"type": $("#add-animal-type").val(),
            "img": 'images/Mess.png',
            "intro": $("#add-animal-info").val(),
			"locations":[],
			"loc_amount": 0
		})

		$(this)[0].reset();

		$("#add-animal").removeClass("active");
		showListPage();
	})
	.on("submit","#edit-confession-form",function(e){
		e.preventDefault();
		var id=$("#confession-id").val()
		console.log(id);

		var ca = currentAnimal()[0].locations[id];
		console.log(ca.confession)
        ca.confession = $("#edit-the-confession").val();
        console.log($("#edit-the-confession").val())
		$("#edit-confession-form").removeClass("active");
		showAnimalProfilePage();
		console.log(233)
	})

	.on("input",".js-search",function(){
		// console.log($(this).val())
		var str = $(this).val();

		var regex = RegExp(str,'i');

		var result = currentUser()[0].animals.filter(function(o,i,a){
			return regex.test(o.type);
		})

		if(str == "") {
			result = currentUser()[0].animals;
		
		}


		showDataList(
			result,
			$("#monsterlist-template").html(),
			"#list-page .monsterlist"
			);
	})

	.on("click",".map-filter",function(){
		// console.log($(this).data("value"));
		var filter = $(this).data("filter");
		$(this).css("color", "#000000");
		$(this).siblings().css("color", "#ffffff");
		var str = $(this).data("value");

		if(str == "all") {
			var result = currentUser()[0].animals;
			$('#my-filter li').css("color", "#ffffff");
		} else {
			var result = currentUser()[0].animals.filter(function(o,i,a){
				return o[filter] == str;
			})
		}
		
		makeMainMap(result);
	})

	.on("click",".js-edit-confession",function(){
		var id = +$(this).data("id");
		console.log(id);
		var con =
		currentAnimal()[0].locations.filter(
			function(o,i,a){
				return o.id == id;
		});
		showDataList(
			con,
			$("#edit-confession-form-template").html(),
			"#edit-confession .modal-content"
			);
		return id=id;
	})

	.on("click","[data-activate]",function(){
		$($(this).data("activate")).addClass("active")
	})
	.on("click","[data-deactivate]",function(){
		$($(this).data("deactivate")).removeClass("active")
	})
	.on("click","[data-toggle]",function(){
		$($(this).data("toggle")).toggleClass("active")
	})
	$("[data-template]").each(function(){
		var t = $(this).data("template");
		$(this).html(
			$(t).html()
		);
	})
})


