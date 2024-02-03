const ssoTmdbReadApiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNjg1NTBmYTRlODIzMWE1MWVlZGViNjYyNGRkNzFjNSIsInN1YiI6IjY1YWZjMjA2MTU4Yzg1MDBhYzFkMzdmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-zClmVb2mljRLrKfpdAGMHUNc53hcS2MWsSOUWaj26w'

window.onload = async () => {
    const id = location.search.split()[0]?.split('?')?.[1]
    console.log(id)
    if (id) {
        displayMovie(id)
    }
}

async function getMovie(id) {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${ssoTmdbReadApiKey}`
        }
      };
      
    let responseDetail = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options).catch(err => console.error(err));
    if(!responseDetail){
        return
    }
    let detailData = await responseDetail.json();
    console.log(detailData);
    return detailData;
}

async function displayMovie(id){
    let movie = await getMovie(id);
    const titre=document.getElementById('titre')
    titre.textContent=movie.title //modifie le titre dans l'html
    const poster=document.getElementById('poster')
    poster.setAttribute('src',"https://image.tmdb.org/t/p/w500"+movie.poster_path) //modifie l'image dans l'html
    poster.setAttribute('alt',"poster du film "+movie.title) //modifie le alt de l'image
    const description=document.getElementById('description')
    description.textContent=movie.overview //modifie la description
}