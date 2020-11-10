

//favourite
let fav = document.getElementsByClassName("fa-heart");


for (let i = 0; i < fav.length; i++){
    fav[i].addEventListener("click", e => {
        let postId = e.target.id;
        if (fav[i].style.color != "rgb(255, 0, 0)") {
            fav[i].style.color = "rgb(255, 0, 0)";
            fetch(`/posts/fav/${e.target.id}`, {
            method: 'post',
            body: postId
            })
        } else {
            fav[i].style.color = "#494949";
            fetch(`/posts/unfav/${e.target.id}`, {
            method: 'post',
            body: postId
            })
        }
        
})
}





