var carousel = document.getElementById('carousel');
var images = carousel.getElementsByTagName('img');
var index = 0;

function changeImage() {
    images[index].style.minWidth = "0%";
    index = (index + 1) % images.length;
    images[index].style.minWidth = "100%";
  }
  

setInterval(changeImage, 5000); // Cambia la imagen cada 2 segundos