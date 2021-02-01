$(document).ready(function () {
    
    $("#file").change(function(event) {
        var srcImage = URL.createObjectURL(event.target.files[0]);
        var image = document.getElementById("image");
        image.src = srcImage;

        image.onload = function(){
            
            // Affiche le canvas
            var canvas = document.getElementById('canvas');
            if (canvas.getContext){
                canvas.width = image.width;
                canvas.height = image.height;
                ctx = canvas.getContext('2d');
                ctx.filter = "sepia(0.5)";
                // ctx.filter = "grayscale(1)";
                ctx.drawImage(image, 0, 0, image.width, image.height);

                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, image.width, image.height);

                ctx.drawImage(image, 500, 500, 2000, 1500, 500, 500, 2000, 1500);
            } else {
                alert('canvas non supporté par ce navigateur');
            }

            // Initialise l'onglet general
            var srcImage = document.getElementById('file').value;
            document.getElementById('fileName').value = getFileName(srcImage);

            // Initialise l'onglet resize
            document.getElementById('width').value = canvas.width;
            document.getElementById('height').value = canvas.height;
        }
    });

    // Abbonnement évenements des nav-item
    $(".nav-item").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
    });

    // Abbonnement évenement download de l'image
    $("#download").click(function () {
        // création d'un lien html temporaire
        const lien = document.createElement("a");
        // récup. des data de l'image
        var canvas = document.getElementById('canvas');
        var dataImage = canvas.toDataURL("image/*");
        // affectation d'un nom à l'image
        lien.download = document.getElementById('fileName').value;
        // modifie le type de données
        dataImage = dataImage.replace("image/png", "image/octet-stream");
        // affectation de l'adresse
        lien.href = dataImage;
        // ajout de l'élément
        document.body.appendChild(lien);
        // simulation du click
        lien.click();
        // suppression de l'élément devenu inutile
        document.body.removeChild(lien);
    });

    // Onglet Resize
    $("#width, #height").change(function () {

        // Affiche le canvas
        var image = document.getElementById("image");
        var canvas = document.getElementById('canvas');
        if (canvas.getContext){
            canvas.width = $("#width").val();
            canvas.height = $("#height").val();
            ctx = canvas.getContext('2d');
            ctx.filter = "sepia(0.5)";
            // ctx.filter = "grayscale(1)";
            ctx.drawImage(image, 0, 0, $("#width").val(), $("#height").val());
        } else {
            alert('canvas non supporté par ce navigateur');
        }
    });

});

function getFileName(srcImage) {
    var tab = srcImage.split('\\');
    return tab[tab.length - 1];
}