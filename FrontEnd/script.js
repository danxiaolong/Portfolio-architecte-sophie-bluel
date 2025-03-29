// je creer la variable what category is chosen et je mets zero pour que par defaut quand ont lance la page tous les travaux soit créer et le filtre tous soit selectionner
let WhatCategoryIsChosen = 0
let boutonModalModifier = document.getElementById("boutonModalModifier")
let modalOverlay = document.querySelector(".modalOverlay")
let modal1 = document.querySelector(".wrapperModal")
let modal2 = document.querySelector(".wrapperModal2")
let modal1ClosingButton = document.getElementById("boutonFermetureModal")
let modal2ClosingButton = document.getElementById("boutonFermetureModal2")
let modal2BackButton = document.getElementById("boutonRetourModal2")
let addPictureButton = document.getElementById("boutonAjouterPhoto")
let divWorks = document.querySelector(".divWorksStyle")

let photoInputWrapper = document.querySelector(".photoInputWrapper")
let photoInputPreview = document.querySelector(".photoInputPreview")

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
    modalOpening()
    createModalContentGallery()
    modalClosingToggling()
}




function modalOpening() {
    boutonModalModifier.addEventListener("click",(event)=>{
        event.preventDefault()
        modalOverlay.classList.remove("close")
        modal1.classList.remove("close")
    })   
}

function modalClosingToggling() {
    modal1ClosingButton.addEventListener("click", (event)=>{
        event.preventDefault()
        modal1.classList.add("close")
        modalOverlay.classList.add("close")
    })
    addPictureButton.addEventListener("click",(event)=>{
        event.preventDefault()
        modal1.classList.add("close")
        modal2.classList.remove("close")
        //createModalCategories()
    })
    modal2BackButton.addEventListener("click",(event)=>{
        event.preventDefault()
        modal2.classList.add("close")
        modal1.classList.remove("close")
    })
    modal2ClosingButton.addEventListener("click",(event)=>{
        event.preventDefault()
        modal2.classList.add("close")
        modal1.classList.add("close")
        modalOverlay.classList.add("close")
    })
    modalOverlay.addEventListener("click",(event)=>{
        event.preventDefault()
        modal2.classList.add("close")
        modal1.classList.add("close")
        modalOverlay.classList.add("close")
    })
    
}


async function createModalContentGallery() {
    
    const reponse = await fetch("http://localhost:5678/api/works");
    const worksListModal = await reponse.json()

    for ( let i=0 ; i < worksListModal.length ; i++) { 
        let workId = worksListModal[i].id
        let WorkFigure = document.createElement("figure")
        WorkFigure.classList.add("workFigureStyle")
        let WorkImg = document.createElement("img")
        WorkImg.classList.add("imgGalerie")
        WorkImg.src = worksListModal[i].imageUrl
        let boutonEffacerA = document.createElement("a")
        boutonEffacerA.classList.add("boutonEffacerAStyle")
        let boutonEffacerIcon = document.createElement("i")
        boutonEffacerIcon.classList.add("fa-solid", "fa-trash-can", "fa-trash-can-style") 
        boutonEffacerA.appendChild(boutonEffacerIcon)
        WorkFigure.appendChild(boutonEffacerA)
        WorkFigure.appendChild(WorkImg)
        divWorks.appendChild(WorkFigure)
        boutonEffacerA.addEventListener("click", async (event) => {
            event.preventDefault()
            let token = sessionStorage.getItem("token")
            if (!token) {
                console.error("Token introuvable, impossible de supprimer.")
                return
            }
            try {
                let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "*/*", 
                        "Authorization": `Bearer ${token}`
                    }
                })
        
                if (!response.ok) {
                    console.error("Échec de la suppression :", response.statusText);
                    return;
                }
                console.log(`L'image avec ID ${workId} a été supprimée avec succès`)
                WorkFigure.remove();
                createWorksGallery();
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
            }
        });
        
    }
    
}



