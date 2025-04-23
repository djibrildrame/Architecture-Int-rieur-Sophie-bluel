const gallery = document.querySelector(".gallery");
const Tous = document.querySelector('.tous');
const Objet = document.querySelector('.objets');
const Appart = document.querySelector('.appartements');
const Hotel = document.querySelector('.hotel');
const modifier = document.querySelector('.modifier');
const category = document.querySelectorAll('.categorie');
const modaleadd = document.querySelector('.img-add');
const modale = document.querySelector('.container-modale');
const edition = document.querySelector('.edition');
console.log(edition);

let userData = [];

// Fonction pour vérifier si le token est expiré
function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split('.')[1])); // Décoder la charge utile du token
    return payload.exp * 1000 < Date.now(); // Vérifie si la date d'expiration est passée
}

// Récupère le token depuis le localStorage et vérifie son expiration
function getValidToken() {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
        console.log("Le token a expiré. Veuillez vous reconnecter.");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Rediriger vers la page de connexion
        return null;
    }
    return token;
}

// Fonction pour récupérer les données des projets
const fetchUser = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    userData = await response.json();
    console.log("Données récupérées :", userData);
    displayCategory(userData); // Affiche tous les projets par défaut
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
};

// Fonction d'affichage de la galerie principale
const userDisplay = async () => {
  await fetchUser();
  displayCategory(userData); // Affiche tous les projets par défaut

  // Ajoute des écouteurs pour les boutons de catégorie
  Tous.addEventListener("click", () => displayCategory(userData));
  Objet.addEventListener("click", () => displayCategory(userData.filter(work => work.category.name === "Objets")));
  Appart.addEventListener("click", () => displayCategory(userData.filter(work => work.category.name === "Appartements")));
  Hotel.addEventListener("click", () => displayCategory(userData.filter(work => work.category.name === "Hotels & restaurants")));
  
};

const displayCategory = (filteredData) => {
  const gallery = document.querySelector(".gallery");

  // Vider la galerie
  gallery.innerHTML = "";

  // Ajouter les projets filtrés
  gallery.innerHTML = filteredData.map(project => 
    `<figure class="id" data-id="${project.id}">
       <img src="${project.imageUrl}" alt="${project.title}">
       <figcaption>${project.title}</figcaption>
     </figure>`
  ).join('');
};


// Afficher ou masquer les éléments exclusifs en fonction du statut de connexion
document.addEventListener("DOMContentLoaded", () => {
  const token = getValidToken();
  if (token) {
    afficherElementsExclusifs();
  } else {
    masquerElementsExclusifs();
  }
});

function afficherElementsExclusifs() {
  document.querySelectorAll(".exclusif").forEach(element => element.style.display = "block");
  const logout = document.querySelector(".login-logout")
 logout.innerHTML = `Logout`;
 logout.addEventListener("click", () => {
  localStorage.removeItem('token');
  window.location.reload();
});



  if (modifier) {
    modifier.innerHTML = `
      <div class="modification">
       <i class="fa-regular fa-pen-to-square"></i>
        <p class="modifier">Modifier</p>
      </div>`;
    category.forEach(cat => cat.style.display = "none");
  }
  modifier.addEventListener('click', openModale);
}

// Fonction pour ouvrir la modale et afficher les projets
const openModale = async () => {
  await fetchUser();
  modale.innerHTML = `
    <div class="modale">
      <i class="fa-solid fa-xmark croix"></i>
      <div class="ligne">
        <h3 class="Galerie">Galerie Photo</h3>
        <div class="container">
          ${userData.map(user => `
            <div class="photo-wrapper" data-id="${user.id}">
              <img class="item" src="${user.imageUrl}" alt="${user.title}">
              <i class="fa-solid fa-trash delete-icon"></i>
            </div>
          `).join('')} 
        </div>
        <hr/>
        <input type="submit" value="Ajouter une photo" class="ajoutphoto">
      </div>
    </div>`;

  modale.style.display = "block";
  document.querySelector('.overlate').style.display = "block";
  addDeleteEventListeners();

  document.querySelector('.fa-xmark.croix').addEventListener('click', () => {
    modale.style.display = "none";
    document.querySelector('.overlate').style.display = "none";
  });

  document.querySelector('.ajoutphoto').addEventListener('click', () => openAddPhotoForm());
};

// Fonction pour ajouter les écouteurs pour la suppression
const addDeleteEventListeners = () => {
  document.querySelectorAll('.fa-trash.delete-icon').forEach(supPhoto => {
    supPhoto.addEventListener('click', async () => {
      const photoWrapper = supPhoto.closest('.photo-wrapper');
      const imageId = photoWrapper.dataset.id;
      const token = getValidToken();

      if (!token) return;

      // Supprime l'élément de la modale et de la galerie principale
      photoWrapper.remove();
      const figureToRemove = document.querySelector(`.gallery figure[data-id="${imageId}"]`);
      if (figureToRemove) {
        figureToRemove.remove();
      }

      try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error("Erreur lors de la suppression sur le serveur");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    });
  });
};

// Fonction pour ouvrir le formulaire d'ajout de photo
const openAddPhotoForm = () => {
  modaleadd.style.display = "block";
  modale.style.display = "none";
  modaleadd.innerHTML = `
    <div class="modale-content">
      <div class="arrowdelete">
        <i class="fa-solid fa-arrow-left arrowleft"></i>
        <i class="fa-solid fa-xmark croix"></i>
      </div>
      <h3 class="modale-title">Ajout photo</h3>
      <div class="image-upload">
        <label class="addphoto" for="fileInput">
          <i class="fa-regular fa-image upload"></i>
          <input type="file" id="fileInput" accept="image/png, image/jpeg" style="display: none;">
          <p class="upload-text">+ Ajouter photo</p>
          <p class="jpg">jpg,png : 4 mo max</p>
        </label>
      </div>
      <div class="form-group">
        <label for="titleInput">Titre</label>
        <input type="text" id="titleInput" class="textadd">
      </div>
      <div class="form-group">
        <label for="categorySelect">Catégorie</label>
        <select id="categorySelect">
         <option value=""</option>
          <option value="1">Objets</option>
          <option value="2">Appartements</option>
          <option value="3">Hotels & restaurants</option>
        </select>
        <hr class="hradd">
      </div>
      <button class="submit-button" id="submitButton">Valider</button>
    </div>`;

  const fileInput = document.getElementById("fileInput");
  const imageUploadDiv = document.querySelector(".image-upload");
  let file = null;
   fileInput.addEventListener("change", (event) => {
     file = event.target.files[0];

    if (file) {
        console.log("Fichier sélectionné :", file);
        if (file.type === "image/png") {
            const imageUrl = URL.createObjectURL(file);
            imageUploadDiv.innerHTML = `<img src="${imageUrl}" alt="Aperçu de l'image" class="image-preview" style="width: 35%; height: auto; border-radius: 8px;">`;
            document.querySelector(".image-preview").onload = () => URL.revokeObjectURL(imageUrl);
        } else {
            console.log("Le fichier n'est pas au format JPG ou PNG.");
            alert("Veuillez sélectionner une image au format JPG ou PNG.");
        }
    } else {
        console.log("Aucun fichier sélectionné.");
        alert("Aucun fichier n'a été sélectionné.");
    }
});


  document.querySelector('.arrowleft').addEventListener('click', () => {
    modaleadd.style.display = "none";
    modale.style.display = "block";
  });

  document.querySelector('.arrowdelete .croix').addEventListener('click', () => {
    document.querySelector('.overlate').style.display = "none";
    modaleadd.style.display = "none";
  });


  document.getElementById("submitButton").addEventListener("click", async (event) => {
    event.preventDefault();

    
    const title = document.getElementById("titleInput").value.trim();
    const category = +document.getElementById("categorySelect").value;

    if (!file  || !title || !category) {
        alert("Veuillez remplir tous les champs et sélectionner une image.");
        return;
    } else {
      document.querySelector('.overlate').style.display = "none";
    }

    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const newProject = await response.json();
            console.log("Nouveau projet ajouté :", newProject);

            // Appel de la fonction pour afficher le nouveau projet dans la galerie
            addImageToGallery(newProject);

            // Masquer le formulaire après ajout
            document.querySelector('.img-add').style.display = "none";
        } else {
            console.error("Erreur lors de l'ajout du projet :", await response.text());
            alert("Une erreur est survenue lors de l'ajout du projet.");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Une erreur réseau s'est produite.");
    }
});

};


function addImageToGallery(project) {
  // Insérez dans la galerie principale
  const projectHTML = `
      <figure class="id" data-id="${project.id}">
          <img src="${project.imageUrl}" alt="${project.title}">
          <figcaption>${project.title}</figcaption>
      </figure>
  `;
  gallery.insertAdjacentHTML("beforeend", projectHTML);


}

// Cacher les éléments lors de la déconnexion
function masquerElementsExclusifs() {
  document.querySelectorAll(".exclusif").forEach(element => element.style.display = "none");
  const login = document.querySelector(".login")
  if (modifier) {
    modifier.style.display = "none";
    login.style.display = "block";
    edition.style.display = "none";
  }
}

// Initialiser l'affichage
userDisplay();
