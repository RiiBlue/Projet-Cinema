//requête, films correspondant à la recherche
async function getMovie(recherche){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${ssoTmdbReadApiKey}`
        }
      };
      let responseDetail = await fetch('https://api.themoviedb.org/3/search/movie?query='+recherche+'&include_adult=true&language=fr-FR&page=1', options).catch(err => console.error(err));
      if(!responseDetail){
          return
      }
      let detailData = await responseDetail.json();
      return detailData;
}

//affichage des films, ajout à l'html
async function displayMovie(recherche){
    let filmsDiv = document.getElementById('films');
    filmsDiv.innerHTML = '' //effacer les anciens résultats
    let movies = await getMovie(recherche)
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
        filmsDiv.appendChild(filmsContainer)
    }
}

const searchbar=document.getElementById('rechercher')
searchbar.addEventListener('input', () => displayMovie(searchbar.value)) //Pour la recherche dynamique, à la modification de la barre de recherche faire l'affichage des résultats
