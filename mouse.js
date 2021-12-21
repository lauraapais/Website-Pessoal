var descricao = document.getElementsByClassName("projeto");


imgmove = function (e) {
    var img = this.getElementsByClassName("hidden_img")[0];
    if(img!=null) {
        img.style.top = e.clientY+"px";
        img.style.left = e.clientX+"px";
    }
}

for(var i=0; i<descricao.length; i++){
    descricao[i].addEventListener("mousemove", imgmove);
}


