const form = document.querySelector('.form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const errorMessage = document.querySelector('.error-message');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Réinitialise le message d'erreur
    errorMessage.textContent = '';

   

    // Si les validations passent, configure la requête
    const init = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    };

    console.log('Données envoyées :', {
        email: email.value,
        password: password.value
    });    

  

    fetch('http://localhost:5678/api/users/login', init)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Identifiants incorrects ou erreur serveur');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Réponse du serveur :', data);
            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Utilisateur connecté, token stocké !');
                window.location.href = "index.html";
            } else {
                errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
                errorMessage.style.color = "red"; 
            }
        })
        .catch((error) => {
            errorMessage.textContent = 'Erreur réseau : Impossible de se connecter au serveur.';
            errorMessage.style.color = "red"; 
            console.error('Erreur réseau :', error);
        });


        
});

// Récupère le token depuis localStorage
const token = localStorage.getItem('token');

// Vérifie que le token existe
if (token) {
    fetch('http://localhost:5000/exclusive-content', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Envoie le token dans l'en-tête Authorization
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Contenu exclusif :', data);
        // Affiche le contenu exclusif dans l'interface utilisateur
    })
    .catch(error => {
        console.error('Erreur :', error);
        // Gère l'erreur, par exemple en affichant un message d'erreur à l'utilisateur
    });
} else {
    console.log("Aucun token trouvé, redirection vers la page de connexion.");
    // Redirige l'utilisateur vers la page de connexion s'il n'est pas connecté
}

