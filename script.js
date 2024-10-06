let map;
let placeMarker = false;
let creatingEvent = false;

// Initializing Google Maps API
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "AIzaSyBxvC2A0TPnwgoYfgePqIR0UWpdzo5YCXQ",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
  });

// Custom Overlay Class
// class USGSOverlay extends google.maps.OverlayView {
//     bounds;
//     image;
//     div;
//     constructor(bounds, image) {
//       super();
//       this.bounds = bounds;
//       this.image = image;
//     }
// }

  //Create Map
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    const centerMap = { lat: -34.397, lng: 150.644 };

    const mapOptions = {
        center: centerMap,
        zoom: 8,
        disableDefaultUI: true
    }

    map = new Map(document.getElementById("map"), mapOptions);

    const infoWindow = new google.maps.InfoWindow({
        minWidth: 200,
        maxWidth: 200
    });

    // Create Event on Click
    google.maps.event.addListener(map, 'click', function (event) {
        creatingEvent = true;

        displayCoordinates(event.latLng);
        
        const marker = new google.maps.Marker({
            position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
            map,
            title: "Hello World!",
    });



    function createEventInfoWindow() {
        const eventInfoWindowContent = `
        <form>
            <h1>Create Event</h1>
            <input type="text">
            <button type="submit">Submit</button>


        </form>
        `

        infoWindow.setContent(eventInfoWindowContent);
        infoWindow.open(map, marker);
    }

    createEventInfoWindow();
        
        function createInfoWindows() {
            const infoWindowContent = `
                <div class="marker-content">
                    <h1>Event Title</h1>
                    <p>Description</p>
                </div>
            `;
    
            infoWindow.setContent(infoWindowContent);
            infoWindow.open(map, marker);
        }

        google.maps.event.addListener(marker, 'click', function (event) {
            creatingEvent = true;
            console.log(creatingEvent);
            createInfoWindows();
        });
    });

    // Displays mouse coordinates in lat/lng in console
    function displayCoordinates(pnt) {
        var lat = pnt.lat();
        lat = lat.toFixed(4);
        var lng = pnt.lng();
        lng = lng.toFixed(4);
        console.log("Latitude: " + lat + "  Longitude: " + lng);
    }
}

initMap();