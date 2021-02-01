$(document).ready(function () {
    
    $("#file").change(function(event) {
        srcImage = URL.createObjectURL(event.target.files[0]);
        var image = new Image();
        image.src = srcImage;

        image.onload = function(){
            
            // Affiche le canvas
            var picture = document.getElementById('picture');
            var canvas = document.getElementById('canvas');
            if (canvas.getContext){
                if(image.width > image.height) {
                    canvas.width = picture.clientWidth;
                    canvas.height = canvas.width * (image.height / image.width);
                }
                else {
                    canvas.height = picture.clientHeight;
                    canvas.width = canvas.height * (image.width / image.height);
                }

                ctx = canvas.getContext('2d');
                // ctx.filter = "sepia(0.5)";
                // ctx.filter = "grayscale(1)";
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            } else {
                alert('canvas non supporté par ce navigateur');
            }

            //Initialise l'onglet general
            var srcImage = document.getElementById('file').value;
            document.getElementById('fileName').value = getFileName(srcImage);
        }
    });

    // Abbonnement évenements des nav-item
    $(".nav-item").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
    });

});

function getFileName(srcImage) {
    var tab = srcImage.split('\\');
    return tab[tab.length - 1];
}


