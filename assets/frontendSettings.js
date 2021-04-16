
let x = document.getElementById("postPhoto");
let selected = document.getElementById("selected");
let postPhotoUrl = document.getElementById("postPhotoUrl")
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
}



//imgur
//#postPhoto = x
x.addEventListener("change", e => {
    const formdata = new FormData()
    formdata.append("image", e.target.files[0])
    fetch("https://api.imgur.com/3/image/", {
        method: 'post',
        headers: {
            Authorization: "Client-ID 6c5af2df15528fc"
        },
        body: formdata
    }).then(data => data.json()).then(data => {
        let photoUrl = data.data.link;
        postPhotoUrl.setAttribute("value",photoUrl)
        })
})