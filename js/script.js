$(document).ready(function () {

    // Upload de l'image
    $("#file").change(function(event) {
        var srcImage = URL.createObjectURL(event.target.files[0]);
        var image = document.getElementById("image");
        image.src = srcImage;

        image.onload = function(){

            // Initialise le recadrage
            sessionStorage.setItem("sx", image.width / 4);
            sessionStorage.setItem("sy", image.height / 4);
            sessionStorage.setItem("sWidth", image.width / 2);
            sessionStorage.setItem("sHeight", image.height / 2);
            sessionStorage.setItem("dWidth", image.width);
            sessionStorage.setItem("dHeight", image.height);
            sessionStorage.setItem("filtre", "aucun");

            // Rendre actif l'onglet général
            $("#general").find(".nav-link").addClass("active");
            $("#general").siblings().find(".nav-link").removeClass("active");
            $("#generalPanel").removeClass("d-none");
            $("#generalPanel").siblings().addClass("d-none");

            // Affiche l'image
            displayImage(image, image.width, image.height);

            // Initialise l'onglet general
            var srcImage = document.getElementById('file').value;
            document.getElementById('fileName').value = getFileName(srcImage);

            // Initialise l'onglet resize
            document.getElementById('width').value = image.width;
            document.getElementById('height').value = image.height;

            // Masquer l'input type range
            $("#intensity").addClass("d-none");
        }
    });

    ///// Séléction de l'onglet, affichage du panel d'outils et affichage de l'image

    // Affiche le panel général pour le renommage du fichier
    $("#general").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
        $("#generalPanel").removeClass("d-none");
        $("#generalPanel").siblings().addClass("d-none");

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, sessionStorage.getItem("dWidth"), sessionStorage.getItem("dHeight"));
    });

    // Affiche le panel des filtres
    $("#filter").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
        $("#filterPanel").removeClass("d-none");
        $("#filterPanel").siblings().addClass("d-none");

        // Rendre actif le bouton du filtre courant
        setActiveCurrentFilterBtn();

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, sessionStorage.getItem("dWidth"), sessionStorage.getItem("dHeight"));
    });

    // Affiche le panel pour le redimensionnement de l'image
    $("#resize").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
        $("#resizePanel").removeClass("d-none");
        $("#resizePanel").siblings().addClass("d-none");

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, sessionStorage.getItem("dWidth"), sessionStorage.getItem("dHeight"));
    });

    // Affiche le panel pour le recadrage de l'image
    $("#crop").click(function () {
        $(this).find(".nav-link").addClass("active");
        $(this).siblings().find(".nav-link").removeClass("active");
        $("#cropPanel").removeClass("d-none");
        $("#cropPanel").siblings().addClass("d-none");

        // Affichage du recadrage
        var image = document.getElementById("image");
        var sx = sessionStorage.getItem("sx");
        var sy = sessionStorage.getItem("sy");
        var sWidth = sessionStorage.getItem("sWidth");
        var sHeight = sessionStorage.getItem("sHeight");
        displayImageCropping(image, image.width, image.height, sx, sy, sWidth, sHeight);
    });

    // Téléchargement de l'image du canvas
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

    ///// Choix du filtre

    $("#aucun").click(function () {

        // Rendre actif le bouton
        $("#aucun").addClass("border-secondary");
        $("#aucun").parent().siblings().find(".card").removeClass("border-secondary");

        // Maj du filtre dans le session storage
        sessionStorage.setItem("filtre", "aucun");
        sessionStorage.setItem("intensity", "0");

        // Masquer l'input type range
        $("#intensity").addClass("d-none");

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, sessionStorage.getItem("dWidth"), sessionStorage.getItem("dHeight"));
    });

    $("#sepia").click(function () {
        
        // Rendre actif le bouton
        $("#sepia").addClass("border-secondary");
        $("#sepia").parent().siblings().find(".card").removeClass("border-secondary");

        // Maj du filtre dans le session storage
        sessionStorage.setItem("filtre", "sepia");
        sessionStorage.setItem("intensity", "1");

        // Afficher l'input type range
        $("#intensity").removeClass("d-none");
        $("#intensity").val(sessionStorage.getItem("intensity"));

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, sessionStorage.getItem("dWidth"), sessionStorage.getItem("dHeight"));
    });

    $("#greyscale").click(function () {

        // Rendre actif le bouton
        $("#greyscale").addClass("border-secondary");
        $("#greyscale").parent().siblings().find(".card").removeClass("border-secondary");

        // Maj du filtre dans le session storage
        sessionStorage.setItem("filtre", "greyscale");
        sessionStorage.setItem("intensity", "1");

        // Afficher l'input type range
        $("#intensity").removeClass("d-none");
        $("#intensity").val(sessionStorage.getItem("intensity"));

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, sessionStorage.getItem("dWidth"), sessionStorage.getItem("dHeight"));
    });

    // Changement d'intensité du filtre
    $("#intensity").change(function () {
        var newIntensity = $("#intensity").val();
        sessionStorage.setItem("intensity", newIntensity);

        // Affichage de l'image
        var image = document.getElementById("image");
        displayImage(image, sessionStorage.getItem("dWidth"), sessionStorage.getItem("dHeight"));
    });

    // Redimensionnement de l'image
    $("#width, #height").change(function () {
        var image = document.getElementById("image");
        displayImage(image, $("#width").val(), $("#height").val());
        sessionStorage.setItem("dWidth", $("#width").val());
        sessionStorage.setItem("dHeight", $("#height").val());
    });
});

function displayImage(image, width, height) {

    // Creation du canvas
    var canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas");
    canvas.innerHTML = "canvas non supporté par ce navigateur";

    // Ajout du canvas dans la balise 'picture'
    document.getElementById("picture").innerHTML = "";
    document.getElementById("picture").appendChild(canvas);

    // Affichage de l'image dans le canvas
    if (canvas.getContext){
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        setFilter(ctx, sessionStorage.getItem("filtre"), sessionStorage.getItem("intensity"));
        ctx.drawImage(image, 0, 0, width, height);
    } else {
        alert('canvas non supporté par ce navigateur');
    }
}

function displayImageCropping(image, width, height, sx, sy, sWidth, sHeight) {
    displayImage(image, width, height);
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Ajout d'un voile sombre sur l'image
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, width, height);

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
function setActiveCurrentFilterBtn() {
    switch (sessionStorage.getItem("filtre")) {
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