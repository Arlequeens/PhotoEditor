$(document).ready(function () {

    // Variable de filtre
    var filter = "";
    var intensity = 1;

    // Variable de redimensionnement (resize)
    var dWidth;
    var dHeight;
    var ratio;

    // Variable de recadrage (crop)
    var sx;
    var sy;
    var sWidth;
    var sHeight;

    // Upload de l'image
    $("#file").change(function(event) {
        var srcImage = URL.createObjectURL(event.target.files[0]);
        var image = document.getElementById("image");
        image.src = srcImage;

        image.onload = function(){

            // Initialise le filtre
            filter = "aucun";

            // Initialise le recadrage (crop)
            sx = 0;
            sy = 0;
            sWidth = image.width;
            sHeight = image.height;

            // Initialise le redimensionnement
            dWidth = sWidth;
            dHeight = sHeight;
            ratio = image.width / image.height;

            // Rendre actif l'onglet général
            $("#general").find(".nav-link").addClass("active");
            $("#general").siblings().find(".nav-link").removeClass("active");
            $("#generalPanel").removeClass("d-none");
            $("#generalPanel").siblings().addClass("d-none");

            // Affiche l'image
            displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);

            // Initialise l'onglet general
            var srcImage = document.getElementById('file').value;
            document.getElementById('fileName').value = getFileName(srcImage);

            // Initialise l'onglet resize
            document.getElementById('width').value = dWidth;
            document.getElementById('height').value = dHeight;

            // Initialise l'onglet crop
            $('#nocrop').addClass("border-secondary");
            $('#zoom').removeClass(" border-secondary");
            $("#warningResize").html("max size : " + sWidth + " x " + sHeight);

            // Masquer l'input type range
            $("#intensity").addClass("d-none");
        }
    });

    // Affiche le panel général pour le renommage du fichier
    $("#general").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
        $("#generalPanel").removeClass("d-none");
        $("#generalPanel").siblings().addClass("d-none");

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);
    });

    // Affiche le panel des filtres
    $("#filter").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
        $("#filterPanel").removeClass("d-none");
        $("#filterPanel").siblings().addClass("d-none");

        // Rendre actif le bouton du filtre courant
        setActiveCurrentFilterBtn(filter);

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);
    });

    // Choix du filtre (filter)
    $("#aucun").click(function () {

        // Rendre actif le bouton
        $("#aucun").addClass("border-secondary");
        $("#aucun").parent().siblings().find(".card").removeClass("border-secondary");

        // Maj du filtre
        filter = "aucun";
        intensity = 0;

        // Masquer l'input type range
        $("#intensity").addClass("d-none");

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);
    });
    $("#sepia").click(function () {
        
        // Rendre actif le bouton
        $("#sepia").addClass("border-secondary");
        $("#sepia").parent().siblings().find(".card").removeClass("border-secondary");

        // Maj du filtre
        filter = "sepia";
        intensity = 1;

        // Afficher l'input type range
        $("#intensity").removeClass("d-none");
        $("#intensity").val(intensity);

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);
    });
    $("#greyscale").click(function () {

        // Rendre actif le bouton
        $("#greyscale").addClass("border-secondary");
        $("#greyscale").parent().siblings().find(".card").removeClass("border-secondary");

        // Maj du filtre
        filter = "greyscale";
        intensity = 1;

        // Afficher l'input type range
        $("#intensity").removeClass("d-none");
        $("#intensity").val(intensity);

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);
    });

    // Changement d'intensité du filtre
    $("#intensity").change(function () {
        intensity = $("#intensity").val();

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);
    });

    // Affiche le panel pour le redimensionnement de l'image (resize)
    $("#resize").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
        $("#resizePanel").removeClass("d-none");
        $("#resizePanel").siblings().addClass("d-none");

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);
    });

    // Redimensionnement de l'image (resize)
    $("#width").change(function () {
        var tempWidth = $("#width").val();
        if(tempWidth <= sWidth) {
            dWidth = tempWidth;
            dHeight = Math.floor(tempWidth / ratio);
            $("#height").val(dHeight);
        }
        else {
            $("#width").val(dWidth);
        }
        var image = document.getElementById("image");
        displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);
        $("#width").blur(); 
    });
    $("#height").change(function () {
        var tempHeight = $("#height").val();
        if(tempHeight <= sHeight) {
            dHeight = tempHeight;
            dWidth = Math.floor(tempHeight * ratio);
            $("#width").val(dWidth);
        }
        else {
            $("#height").val(dHeight);
        }
        var image = document.getElementById("image");
        displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity);
        $("#height").blur(); 
    });

    // Affiche le panel pour le recadrage de l'image (crop)
    $("#crop").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
        $("#cropPanel").removeClass("d-none");
        $("#cropPanel").siblings().addClass("d-none");

        // Affichage du recadrage
        var image = document.getElementById("image");
        displayImageCropping(image, sx, sy, sWidth, sHeight, filter, intensity);
    });

    // Choix du recadrage
    $("#nocrop").click(function () {
        $('#nocrop').addClass("border-secondary");
        $('#zoom').removeClass(" border-secondary");

        var image = document.getElementById("image");
        sx = 0;
        sy = 0;
        sWidth = image.width;
        sHeight = image.height;
        dWidth = sWidth;
        dHeight = sHeight;

        // Maj de l'onglet resize
        document.getElementById('width').value = dWidth;
        document.getElementById('height').value = dHeight;
        $("#warningResize").html("max size : " + sWidth + " x " + sHeight);

        // Affichage du recadrage
        displayImageCropping(image, sx, sy, sWidth, sHeight, filter, intensity);
    });
    $("#zoom").click(function () {
        $('#nocrop').removeClass("border-secondary");
        $('#zoom').addClass(" border-secondary");

        var image = document.getElementById("image");
        sx = image.width / 4;
        sy = image.height / 4;
        sWidth = image.width / 2;
        sHeight = image.height / 2;
        dWidth = sWidth;
        dHeight = sHeight;

        // Maj de l'onglet resize
        document.getElementById('width').value = dWidth;
        document.getElementById('height').value = dHeight;
        $("#warningResize").html("max size : " + sWidth + " x " + sHeight);

        // Affichage du recadrage
        displayImageCropping(image, sx, sy, sWidth, sHeight, filter, intensity);
    });

    // Téléchargement de l'image du canvas (download)
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
});

function displayImage(image, dWidth, dHeight, sx, sy, sWidth, sHeight, filter, intensity) {

    // Creation du canvas
    var canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas");
    canvas.innerHTML = "canvas non supporté par ce navigateur";

    // Ajout du canvas dans la balise 'picture'
    document.getElementById("picture").innerHTML = "";
    document.getElementById("picture").appendChild(canvas);

    // Affichage de l'image dans le canvas
    if (canvas.getContext){
        canvas.width = dWidth;
        canvas.height = dHeight;
        ctx = canvas.getContext('2d');
        setFilter(ctx, filter, intensity);
        ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
    } else {
        alert('canvas non supporté par ce navigateur');
    }
}

function displayImageCropping(image, sx, sy, sWidth, sHeight, filter, intensity) {
    displayImage(image, image.width, image.height, 0, 0, image.width, image.height, filter, intensity);
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Ajout d'un voile sombre sur l'image
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, image.width, image.height);

    // Affichage de l'image recadrée
    ctx.drawImage(image, sx, sy, sWidth, sHeight, sx, sy, sWidth, sHeight);
}

// Ajout d'un filtre à un contexte de canvas
function setFilter(ctx, label, intensity) {
    switch (label) {
        case 'sepia':
            ctx.filter = "sepia("+ intensity + ")";
            break;
        case 'greyscale':
            ctx.filter = "grayscale("+ intensity + ")";
            break;
    }
}

// Retourne le filename provenant de l'url de l'image
function getFileName(srcImage) {
    var tab = srcImage.split('\\');
    return tab[tab.length - 1];
}

// Rendre actif le bouton du filtre courant
function setActiveCurrentFilterBtn(filter) {
    switch (filter) {
        case 'aucun':
            $("#aucun").addClass("border-secondary");
            $("#aucun").parent().siblings().find(".card").removeClass("border-secondary");
            break;
        case 'sepia':
            $("#sepia").addClass("border-secondary");
            $("#sepia").parent().siblings().find(".card").removeClass("border-secondary");
            break;
        case 'greyscale':
            $("#greyscale").addClass("border-secondary");
            $("#greyscale").parent().siblings().find(".card").removeClass("border-secondary");
            break;
    }
}