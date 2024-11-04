const gallery = document.querySelector(".gallery");
const Tous = document.querySelector('.tous');
const Objet = document.querySelector('.objets');
const Appart = document.querySelector('.appartements');
const Hotel = document.querySelector('.hotel');


let userData = [];

const fetchUser = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    userData = await response.json();
    console.log(userData); // Affiche les données récupérées dans la console
    

  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
};

const userDisplay = async () => {
  await fetchUser(); // Assure-toi que fetchUser termine avant d'afficher les données

  // Génère le HTML pour chaque image et l'insère dans la galerie
  gallery.innerHTML = userData.map(user => 
    `<figure>
       <img src="${user.imageUrl}" alt="${user.title}">
       <figcaption>${user.title}</figcaption>
     </figure>`
  ).join('');

  Tous.addEventListener("click", () => {

    gallery.innerHTML = userData.map(user => 
        `<figure>
           <img src="${user.imageUrl}" alt="${user.title}">
           <figcaption>${user.title}</figcaption>
         </figure>`
      ).join('');
  })

  // Cela concernant le btn Objet
  Objet.addEventListener("click", () => {

    const objetsCategory = userData.filter(work => work.category.name === "Objets");
    
    gallery.innerHTML = objetsCategory.map(user =>
        
         `<figure>
           <img src="${user.imageUrl}" alt="${user.title}">
           <figcaption>${user.title}</figcaption>
         </figure>`
    ).join('');

    if (objetsCategory) {
      console.log("Catégorie trouvée : Objets");
    } else {
      console.log("Catégorie 'Objets' non trouvée.");
    }

  })

  Appart.addEventListener("click", () => {

    const appartCategory = userData.filter(work => work.category.name === "Appartements");

    gallery.innerHTML = appartCategory.map(user =>

       `<figure>
           <img src="${user.imageUrl}" alt="${user.title}">
           <figcaption>${user.title}</figcaption>
         </figure>`
    ).join('');

    
    if (appartCategory) {
      console.log("Catégorie trouvée : Appartements");
    } else {
      console.log("Catégorie 'Appartements' non trouvée.");
    }



  })

  Hotel.addEventListener("click", () => {

    const hotelCategory = userData.filter(work => work.category.name === "Hotels & restaurants");

    gallery.innerHTML = hotelCategory.map(user =>

        `<figure>
            <img src="${user.imageUrl}" alt="${user.title}">
            <figcaption>${user.title}</figcaption>
          </figure>`
     ).join('');

    if (hotelCategory) {
      console.log("Catégorie trouvée : Hotels & restaurants");
    } else {
      console.log("Catégorie 'Hotels & restaurants' non trouvée.");
    }
  })

};














userDisplay();
