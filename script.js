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

    // Find User's Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Update the map's center and add a marker
            map.setCenter(userLocation);
            map.setZoom(15);
            let newMarker = new google.maps.Marker({
                position: userLocation,
                map: map
            });
            markers.push(newMarker);
        }, () => {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }

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

        let currentMarker = marker;
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
            <h5>Create Event</h5>

            
            <input id="title-input" type="text" placeholder="Add Title" autocomplete="off">

            <input id="hostname-input" type="text" placeholder="Host" autocomplete="off">

            <label class="form-label" id="date-input-label">Date:</label>
            <input id="date-input" type="date" autocomplete="off">

            <label class="form-label">Time:</label>
            <input id="time-input" type="time" autocomplete="off">

            <textarea id="description-input" type="text" placeholder="Description"></textarea>
            <button class="btn btn-primary btn-sm" id="submit-event-button" type="submit">Submit</button>
        </form>
        `

        // ARCHIVE
        // <label class="form-label"id="title-input-label">Title</label>
        // <label class="form-label" id="hostname-input-label">Host Name</label>
        // <label class="form-label" id="date-input-label">Date</label>
        // <label class="form-label">Time</label>
        // <label class="form-label">Description</label>

        infoWindow.setContent(eventInfoWindowContent);
        infoWindow.open(map, marker);
    }

    google.maps.event.addListener(infoWindow, 'closeclick', () => {
        markers[0].setMap(null);
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
    const formattedDate = formatDate(date);
    console.log("formattedDate: ", formattedDate);
    const time = document.getElementById("time-input").value;
    const formattedTime = formatTime(time);
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
        maxWidth: 200
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
            <div class="marker-info">
                <h5 id="marker-info-title">${title}</h5>
                <span id="marker-info-host">Host: ${hostName}<br /></span>
                
                <p id="marker-info-when">${formattedDate.month} ${formattedDate.day}, ${formattedDate.year} at ${formattedTime.hour}:${formattedTime.minute} ${formattedTime.dayType}</p>

                <p id="marker-info-description">${description}</p>
            </div>
        `;

        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, marker);
    }
    
    console.log("Checkpoint #3", marker);
    const eventObject = { id: ++id, title: title, hostName: hostName, date: formattedDate, time: formattedTime, description: description, markerLat: marker.position.lat, markerLng: marker.position.lng };
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
        <p id="event-list-hostName">Hosted by: ${event.hostName}</p>
        <p id="event-list-date">When: ${event.date.month} ${event.date.day}, ${event.date.year} at ${event.time.hour}:${event.time.minute} ${event.time.dayType}</p>
        <p id="event-list-description">Description: ${event.description}</p>

        <a id="event-list-location" href="javascript:void(0);" onClick="moveMapToMarkerAtCenter(${event.id}, ${event.markerLat}, ${event.markerLng})">See Location</a>
        <hr class="event-line">
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

    //${events[id - 1].title}
    const infoWindowContent = `
            <div class="marker-info">
                <h5 id="marker-info-title">${events[id - 1].title}</h5>
                <span id="marker-info-host">Host: ${events[id - 1].hostName}<br /></span>
                
                <p id="marker-info-when">${events[id - 1].date.month} ${events[id - 1].date.day}, ${events[id - 1].date.year} at ${events[id - 1].time.hour}:${events[id - 1].time.minute} ${events[id - 1].time.dayType}</p>

                <p id="marker-info-description">${events[id - 1].description}</p>
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
}});

function formatDate(date) {
    let dateObj = {};
    year = date.slice(0,4);
    month = convertMonth(date.slice(5,7));
    day = date.slice(8, 10);
    dateObj.year = year;
    dateObj.month = month;
    dateObj.day = day;
    return dateObj;
}

function convertMonth(monthNum)
{
    let month;
    switch(monthNum)
    {
        case "01":
            month = "January";
            break;
        case "02":
            month = "February";
            break;   
        case "03":
            month = "March";
            break;
        case "04":
            month = "April";
            break;
        case "05":
            month = "May";
            break;
        case "06":
            month = "June";
            break;
        case "07":
            month = "July";
            break;
        case "08":
            month = "August";
            break;
        case "09":
            month = "September";
            break;
        case "10":
            month = "October";
            break;
        case "11":
            month = "November";
            break;
        case "12":
            month = "December";
            break;
        default:
            console.log("Default");
    }
    return month;

}

function formatTime(time) {
    let formattedTime = {};
    let hour = parseInt(time.slice(0,2));
    let minute = time.slice(3, 5);
    let dayType = "AM";

    if(hour > 12)
    {
        hour -= 12;
        dayType = "PM";
        hour = hour.toString();
    }

    formattedTime.hour = hour;
    formattedTime.minute = minute;
    formattedTime.dayType = dayType;

    console.log(formattedTime);
    return formattedTime;
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}