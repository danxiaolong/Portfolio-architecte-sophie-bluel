

//fonction asynchrone qui récupere les travaux depuis l'ap i
async function createWorksGallery() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const worksList = await reponse.json()
    let galleryMyWorks = document.querySelector(".gallery")
    galleryMyWorks.innerHTML = "";
    for (i=0; i< worksList.length; i++){
        let NewWorkFigure = document.createElement("figure")
        let NewWorkImg = document.createElement("img")
        let NewWorkFigcaptions = document.createElement("figcaption")
        NewWorkFigcaptions.textContent = worksList[i].title
        NewWorkImg.src = worksList[i].imageUrl
        NewWorkImg.alt = worksList[i].title
        NewWorkFigure.appendChild(NewWorkImg)
        NewWorkFigure.appendChild(NewWorkFigcaptions)
        galleryMyWorks.appendChild(NewWorkFigure)
    }
}

createWorksGallery()