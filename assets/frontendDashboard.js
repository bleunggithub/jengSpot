    let x = document.getElementById("postPhoto");
let selected = document.getElementById("selected");
    let urlInput = document.getElementById("postPhotUrl")
	let txt = "";

    function displayFile() {
        if ("files" in x) {
            if (x.files.length == 0) {
                txt = "Please select a file.";
            } else {
                var file = x.files[0];
                txt = ""
                    if ("name" in file) {
                        txt += "Filename: " + file.name + "<br>";
                    }
                    if ("size" in file) {
                        txt += "Size: " + file.size + " bytes <br>";
                    }
            }
        } else {
            if (x.value == "") {
                selected.innerHTML = "Please select a file.";
            } else {
                txt += "The files property is not supported by your browser!";
                txt += "<br>The path of the selected file: " + x.value;
            }
        }
        selected.innerHTML = txt;
};


//imgur
//#postPhoto = x
x.addEventListener("change", e => {
    const formdata = new FormData()
    formdata.append("image", e.target.files[0])
    fetch("https://api.imgur.com/3/image/", {
        method: 'post',
        headers: {
            Authorization: "Client-ID e1f04294844ccd5"
        },
        body: formdata
    }).then(data => data.json()).then(data => {
        let photoUrl = data.data.link;
        postPhotoUrl.setAttribute("value",photoUrl)
        })
})




//Google Map
let markers = [];  //return functions
let forDBLatLng = []; //return numerical value
let marker;
const lat = document.getElementById("postLat");
const lng = document.getElementById("postLng");


function initMap() {
    let options = {
        zoom: 15,
        center: { lat: 22.28552, lng: 114.15769 },
    }
    let map = new google.maps.Map(document.getElementById("postMap"), options);
    
    //add marker
    google.maps.event.addListener(map, 'click', (e) => {
        addMarker = (location) => {
            marker = new google.maps.Marker({
                position: location,
                map: map,
                draggable:true
            })
        }

        if (forDBLatLng.length === 0) {
            addMarker(e.latLng)
            //for backend
            forDBLatLng.push(e.latLng.toJSON())
            console.log(forDBLatLng)
            lat.setAttribute("value", `${forDBLatLng[0].lat}`)
            lng.setAttribute("value", `${forDBLatLng[0].lng}`)

        } else {
            markers,forDBLatLng = [];
            addMarker(e.latLng)
            //for backend
            forDBLatLng.push(e.latLng.toJSON())
            console.log(forDBLatLng)
            lat.setAttribute("value", `${forDBLatLng[0].lat}`)
            lng.setAttribute("value", `${forDBLatLng[0].lng}`)

        }

        google.maps.event.addListener(marker, 'dragend', (event) => {
            markers, forDBLatLng = [];
            forDBLatLng.push(event.latLng.toJSON())
            console.log(forDBLatLng)
            lat.setAttribute("value", `${forDBLatLng[0].lat}`)
            lng.setAttribute("value", `${forDBLatLng[0].lng}`)
        
        })
    })

}


