let map;
let placeMarker = false;
let creatingEvent = false;
let markers = [];
let events = [];
let currentMarkerInfoWindow;
let pinScaleDown;
let pinScaleUp;
let id = 0;

// Initializing Google Maps API
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "AIzaSyBxvC2A0TPnwgoYfgePqIR0UWpdzo5YCXQ",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
  });

  //Create Map
async function initMap() {

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const { Map } = await google.maps.importLibrary("maps");

    const centerMap = { lat: -34.397, lng: 150.644 };

    const mapOptions = {
        center: centerMap,
        zoom: 8,
        disableDefaultUI: true,
        mapId: "DEMO_MAP_ID"
    }

    map = new Map(document.getElementById("map"), mapOptions);

    const infoWindow = new google.maps.InfoWindow({
        minWidth: 200,
        maxWidth: 200
    });

    currentMarkerInfoWindow = infoWindow;

    // Create Event on Click
    google.maps.event.addListener(map, 'click', function (event) {
        creatingEvent = true;

        displayCoordinates(event.latLng);
        
        pinScaledUp = new PinElement({
            scale: 1.5,
          });
        pinScaledDown = new PinElement({
            scale: 1.0,
        })
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
            map,
            content: pinScaledUp.element,
            title: "Hello World!",
        });

        currentMarker = marker;
        console.log("Marker Position:", marker.position.lat + " and " + marker.position.lng);

        markers.push(marker);
            
        if(markers.length > 1)
        {
            markers[0].setMap(null);
            markers.shift();
        }
        console.log("markers", markers);

        // Add autocomplete="off" to everything after finished
    function createEventInfoWindow() {
        const eventInfoWindowContent = `
        <form id="event-form" onsubmit="event.preventDefault(); submitEvent()" class="gm-style-iw-d">
            <h3>Create Event</h3>


            <p id="title-input-label">Title</p>
            <input id="title-input" type="text">
            <p id="hostname-input-label">Host Name</p>
            <input id="hostname-input" type="text">
            <p id="date-input-label">Date</p>
            <input id="date-input" type="date">
            <p>Time Input</p>
            <input id="time-input" type="time">
            <p>Description</p>
            <input id="description-input" type="text">
            <button class="btn btn-primary btn-sm" id="submit-event-button" type="submit">Submit</button>
        </form>
        `

        infoWindow.setContent(eventInfoWindowContent);
        infoWindow.open(map, marker);
    }

    google.maps.event.addListener(infoWindow, 'closeclick', () => {
        currentMarker.setMap(null);
        console.log('InfoWindow closed!');
        // You can perform additional actions here
    });

    createEventInfoWindow();
        
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

function submitEvent() {
    console.log("Event Submitted!");
    const title = document.getElementById("title-input").value;
    const hostName = document.getElementById("hostname-input").value;
    const date = document.getElementById("date-input").value;
    const time = document.getElementById("time-input").value;
    const description = document.getElementById("description-input").value;

    // const date = new Date(dateInput);
    // const options = { weekday: 'long', month: 'long', day: 'numeric' };
    // const formattedDate = date.toLocaleDateString('en-US', options);

    console.log("markers[0]", markers[0]);
    const marker = markers[0];

    console.log("Event Variables: " + title + " " + hostName + " " + date + " " + time + " " + description);

    currentMarkerInfoWindow.close();

    marker.content = pinScaledDown.element;

    const infoWindow = new google.maps.InfoWindow({
        minWidth: 200,
        maxWidth: 400
    });

    google.maps.event.addListener(marker, 'click', function (event) {
        creatingEvent = true;
        console.log(creatingEvent);
        createInfoWindows();
        marker.content = pinScaledUp.element;
    });

    // google.maps.event.addListener('moveMapToMarkerEvent', () => {
    //     marker.content = pinScaledUp.element;
    // })

    google.maps.event.addListener(infoWindow, 'closeclick', () => {
        marker.content = pinScaledDown.element;
        console.log('InfoWindow closed!');
        // You can perform additional actions here
    });

    function createInfoWindows() {
        const infoWindowContent = `
            <div class="marker-content">
                <h1>${title}</h1>
                <p>by: ${hostName}</p>
                <p>${date}</p>
                <p>${time}</p>
                <p>${description}</p>
            </div>
        `;

        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, marker);
    }
    
    const infoWindowContent = `
        <div class="marker-content">
            <h1>Event Title</h1>
            <p>Description</p>
        </div>
    `;
    console.log("Checkpoint #3", marker);
    const eventObject = { id: ++id, title: title, hostName: hostName, date: date, time: time, description: description, markerLat: marker.position.lat, markerLng: marker.position.lng };
    events.push(eventObject);
    eventObject.marker = marker;
    console.log("Checkpoints #4", eventObject.marker);
    document.getElementById("liveEvents").innerHTML = generateEventsList();

    markers.shift();
}

function generateEventsList()
{
    return events.map(event => 
        `
        <div key=${event.id}>
        <p id="event-list-title">${event.title}</p>
        <p id="event-list-hostName">${event.hostName}</p>
        <p id="event-list-date">${event.date}</p>
        <p id="event-list-time">${event.time}</p>
        <p id="event-list-description">${event.description}</p>

        <button type="button" onClick="moveMapToMarkerAtCenter(${event.id}, ${event.markerLat}, ${event.markerLng})">See Location</button>
        </div>
        `).join('');
}

function moveMapToMarkerAtCenter(id, initLat, initLng) {
    // const event = new Event('moveMapToMarkerEvent');
    // this.dispatchEvent(event);
    // console.log("initMarker", initMarker);
    const markerLocation = { lat: initLat, lng: initLng }
    map.setCenter(markerLocation);
    events[id - 1].marker.content = pinScaledUp.element;

    const infoWindow = new google.maps.InfoWindow({
        minWidth: 200,
        maxWidth: 200
    });

    const infoWindowContent = `
            <div class="marker-content">
                <h1>${events[id - 1].title}</h1>
                <p>by: ${events[id - 1].hostName}</p>
                <p>${events[id - 1].date}</p>
                <p>${events[id - 1].time}</p>
                <p>${events[id - 1].description}</p>
            </div>
        `;

        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, events[id - 1].marker);

        google.maps.event.addListener(infoWindow, 'closeclick', () => {
            events[id - 1].marker.content = pinScaledDown.element;
            console.log('InfoWindow closed!');
            // You can perform additional actions here
        });
}



/////// Hamburger side bar ///////

// Get the hamburger menu and sidebar elements
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebar = document.getElementById('sidebar');
const section = document.querySelector('section');

let isSidebarOpen = false; // Tracks state of sidebar

// Function to open the sidebar
hamburgerMenu.addEventListener('click', function() {
    if (!isSidebarOpen) {
        const sectionTop = section.offsetTop; // Get the top position of the section
        const sectionHeight = section.offsetHeight; // Get the height of the section

        sidebar.style.height = `${sectionHeight}px`;
        sidebar.style.top = `${sectionTop}px`;
        sidebar.style.display = 'block'; // Show the sidebar
        isSidebarOpen = true; // Update the state
    }
    else {
        sidebar.style.display = 'none'; // Hide the sidebar
        isSidebarOpen = false; // Update the state
    }
});