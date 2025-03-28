let formulaireLogin = document.querySelector(".loginformulaire")


formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault()
    const email = document.getElementById("email").value
    const mdp = document.getElementById("mdp").value
    const infoLogin = {
        "email" : email ,
        "password" : mdp
    }
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(infoLogin)
        })
    
        if (response.ok) {
            const reponseLog = await response.json()
            console.log("Connexion réussie ")
            sessionStorage.setItem("token", reponseLog.token)
            window.location.href = "index.html"
        } else {
        let messageErreurConnexionP = document.querySelector(".msgErreurConnexion")
        messageErreurConnexionP.classList.remove("cacherMsgErreur")
        console.log("E-mail ou Mot de passe incorrectes connexion non réussie")
        }
    } catch (error) {
        console.error( error)
    
    }
       
})
