// je creer la variable what category is chosen et je mets zero pour que par defaut quand ont lance la page tous les travaux soit créer et le filtre tous soit selectionner
let WhatCategoryIsChosen = 0


//fonction asynchrone qui récupere les travaux depuis l'api

async function createWorksGallery() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const worksList = await reponse.json()
    let galleryMyWorks = document.querySelector(".gallery")
    galleryMyWorks.innerHTML = "";
    for (i=0; i< worksList.length; i++){
        let NewWorkFigure = document.createElement("figure")
        let NewWorkImg = document.createElement("img")
        let NewWorkFigcaptions = document.createElement("figcaption")
        // ajout de classe avec la categorie pour le filtre
        let NewWorkCategory = worksList[i].category.id
        if (NewWorkCategory === WhatCategoryIsChosen || WhatCategoryIsChosen===0) {
            NewWorkFigcaptions.textContent = worksList[i].title
            NewWorkImg.src = worksList[i].imageUrl
            NewWorkImg.alt = worksList[i].title
            NewWorkFigure.classList.add(NewWorkCategory)
            NewWorkFigure.appendChild(NewWorkImg)
            NewWorkFigure.appendChild(NewWorkFigcaptions)
            galleryMyWorks.appendChild(NewWorkFigure)
        }  
    }
}

async function createGalerryCategories() {

    const reponse = await fetch("http://localhost:5678/api/categories")  
    const categoryList = await reponse.json()
    categoryList.unshift({ "id": 0, "name": "Tous" });
    let categoryDiv = document.querySelector(".CategoryButtons")
    categoryDiv.innerHTML =""
    for ( let i=0 ; i < categoryList.length ;i++) {
        let categoryId = "categorie" + categoryList[i].id
        let newButtonBalise = document.createElement("button")
        let categoryButtonName = categoryList[i].name
        newButtonBalise.textContent = categoryButtonName
        newButtonBalise.classList.add("CategoryButton")
        if ( i===0 ) {
            newButtonBalise.classList.add("chosenCategory")
        }
        newButtonBalise.id = categoryId
        categoryDiv.appendChild(newButtonBalise)  
        document.getElementById(categoryId).addEventListener("click", () => {
            let selectedButton = document.querySelector(".chosenCategory");
            selectedButton.classList.remove("chosenCategory")
            newButtonBalise.classList.add("chosenCategory");
            WhatCategoryIsChosen = categoryList[i].id
            createWorksGallery()   
        })
    }
}

function logout () {
    // ici j'enleve la clase close à l'indicateur du mode edition et le bouton modifier pour l'ouverture de la modal de modification
    let indicateurEdition = document.querySelector(".indicateurEdition")
    indicateurEdition.classList.remove("close")
    let boutonModalModifier = document.getElementById("boutonModalModifier")
    boutonModalModifier.classList.remove("close")
    let loginLogoutEmplacement = document.getElementById("loginLogout")
    loginLogoutEmplacement.textContent = "Logout"
    loginLogoutEmplacement.addEventListener("click", (event) => {
        event.preventDefault()
        sessionStorage.removeItem("token")
        window.location.href = "index.html"

    })
}



createWorksGallery()
//si il n'y à pas de token donc pas connecter je créer les filtres
if (!sessionStorage.getItem("token")) {
    createGalerryCategories()
    
} else {
    logout()
    
}


