//requête, films en tendance
async function getMovie(page){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${ssoTmdbReadApiKey}`
        }
      };
      let responseDetail = await fetch('https://api.themoviedb.org/3/movie/popular?language=fr-FR&page='+page, options).catch(err => console.error(err));
      if(!responseDetail){
          return
      }
      let detailData = await responseDetail.json();
      return detailData;
}

//affichage des films, ajout à l'html
async function displayMovie(page){
    let movies = await getMovie(page)
    results=movies.results
    for (let i=0;i<results.length;i++){ //Parcourir tous les résultats   
        let filmsContainer = document.createElement('div')
        filmsContainer.innerHTML = `
        <h3>${results[i].title}</h3>
        <img src=https://image.tmdb.org/t/p/w500${results[i].poster_path} alt="poster du film ${results[i].title}"/>
        <p>${results[i].release_date}</p>
        `//Affiche dans l'ordre: le titre, l'image du film et sa date de sortie
        filmsContainer.setAttribute('class',"film")
        filmsContainer.addEventListener('click',function(){
            window.location.href=`movie.html?${results[i].id}`;
        }) //Au clique, redirige vers movie.html du film correspondant
        let filmsDiv = document.getElementById('films');
        filmsDiv.appendChild(filmsContainer)
    }
}
//Au chargement, afficher la première page
let page=1
displayMovie(page)

//Au clique du bouton charger plus, afficher les films en tendance de la page suivante
let loadButton = document.getElementById('loadButton')
loadButton.addEventListener('click', (loadMore))
async function loadMore(){
    page+=1
    displayMovie(page)
}
