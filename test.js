var topics = ["1", "2", "3", "4", "5", "6", "7", 
"8",  "9", "10", "11"];
var topicsSearch = ["classical", "rock", "jazz", "blues", "hip-pop", "country", "7", "8", "9",
 "10", "11"];
var userAdd = false;
var start = true;
var token1;




function getButton()
{

	if(start === true)
	{
		start = false;
	}

	if (userAdd === false)
	{
		for (var i = 0; i < topicsSearch.length; i++)
		{
			var btn = $("<button>").text(topics[i]);
			btn.addClass("btn btn-dark options");
			btn.attr("data-fitness", topicsSearch[i]);
			btn.attr("type", "button");
			$("#buttons-container").append(btn);
		}
		userAdd = true;
	}
	else
	{		
			var i = topicsSearch.length - 1 ;

			var btn = $("<button>").text(topics[i]);
			btn.addClass("btn btn-dark options");
			btn.attr("data-fitness", topicsSearch[i]);
			btn.attr("type", "button");
			$("#buttons-container").append(btn);
		
	}
}





function getSpotifyToken()
{
	var tokenURL = "https://accounts.spotify.com/api/token";
	var clientId = '5e15085d2b924d049ae29907ee452bbf';
	var clientSecret = 'e84f853c2b784addb982d679f609d73a';
	var encodedData = window.btoa(clientId + ':' + clientSecret);

	console.log("HI");
		jQuery.ajaxPrefilter(function(options) {
	    if (options.crossDomain && jQuery.support.cors) {
	        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
	    }
	});


		$.ajax({
		    method: "POST",
		    url: "https://accounts.spotify.com/api/token",
		    data: {
		      grant_type: 'client_credentials'
		    },
			headers: {
				"Authorization": "Basic "+ encodedData,
				'Content-Type': 'application/x-www-form-urlencoded',
				'x-requested-with': 'XMLHttpRequest'
			}
		})
		    .then (function(result) {
		      console.log(result);
		      token1 = result.access_token;
		 });


}

getButton();
getSpotifyToken();



// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '5e15085d2b924d049ae29907ee452bbf';
const redirectUri = 'https://chloezhouny.github.io/testSpotify/';
const scopes = [
  'streaming',
  'user-read-birthdate',
  'user-read-private',
  'user-modify-playback-state'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}




// Set up the Web Playback SDK

window.onSpotifyPlayerAPIReady = () => {
  const player = new Spotify.Player({
    name: 'Web Playback SDK Template',
    getOAuthToken: cb => { cb(_token); }
  });

  // Error handling
  player.on('initialization_error', e => console.error(e));
  player.on('authentication_error', e => console.error(e));
  player.on('account_error', e => console.error(e));
  player.on('playback_error', e => console.error(e));

  // Playback status updates
  player.on('player_state_changed', state => {
    console.log(state)
    $('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
    $('#current-track-name').text(state.track_window.current_track.name);
  });

  // Ready
  player.on('ready', data => {
    console.log('Ready with Device ID', data.device_id);
    
    // Play a track using our new device ID
    play(data.device_id);
  });

  // Connect to the player!
  player.connect();
}


// Play a specified track on the Web Playback SDK's device ID
function play(device_id) {
  $.ajax({
   url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
   type: "PUT",
   data: '{"uri": ["spotify:playlist:37i9dQZF1DWWEJlAGA9gs0"]}',
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     console.log(data)
   }
  });
}

























$(document).on("click", ".options", function()
{

	$("#playlistDiv").text("");
	console.log(token1);
	
	var topicSearch = $(this).attr("data-fitness");
	var state = $(this).attr("data-state");
	var playlistURL = "https://api.spotify.com/v1/search?q=" + topicSearch + "&type=playlist&limit=10";	



      /* Spotify playlist API */
		$.ajax({
			url: playlistURL,
			method: "GET",
			Accept: "application/json",
			ContentType: "application/json",
			headers: {
			"Authorization": "Bearer "+ token1}

		})
		.then(function(response){
			console.log(response);
			for(var i = 0; i<4; i++)
		{

			var result = response.playlists;
			var playlistURL = result.items[i].external_urls.spotify;

			var imgURL = result.items[i].images[0].url;
		

		

			var playlists = $("<div id = 'playlist'>");
			var playlist = $("<a href='" + playlistURL + "' target = 'blank'>");
			var img = $("<img>");
			img.attr("src"
				, imgURL);
			img.addClass("uk-animation-scale-up uk-transform-origin-top-left uk-transition-fade");
			img.attr("background-color", "black")

			var playDiv =  $("<div id='play'>").text("►");
			playDiv.addClass("uk-transition-fade");
			

			playlist.addClass("uk-transition-toggle");
			playlist.addClass("uk-overflow-hidden");
			playlist.append(img);
			playlist.append(playDiv);


			playlists.append(playlist);
			
			$("#playlistDiv").append(playlists);
		}
	})

});

