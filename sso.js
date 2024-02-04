const ssoTmdbReadApiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxODAwMWZhMTc1Mzk5MjE4M2ViMWQzYTY4NTEyYTY2MSIsInN1YiI6IjY1YWZjMDgyZDEwMGI2MDBhZGE2Yzc3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iiaGNFEddxOJ-xUT-LDpjeX43hs4kLL_xNqIPib06DA'

// verifie si un token est dans le lien d'accès, stocke le token et reload la page 
window.onload = async () => {
    if (sessionStorage.length < 2 || sessionStorage.getItem('tmdbSessionId') == 'undefined') {
        console.log('bonjour')
        hideloginbutton();
    }
    else{
        hidedecobutton();
    }
    if (!location.search.includes('request_token=')) {
        return
    }
    let token = location.search.split('request_token=')[1]?.split('&')?.[0]
    if(token) {
        getNewSession(token)
        .then(sessionData => {
            sessionStorage.setItem('tmdbSessionId', sessionData.session_id)
            sessionStorage.setItem('tmdbSessionToken', token)
            location.href = 'http://127.0.0.1:5500' //reload dans la barre de navigation
        })
        .catch(err => {
            console.error(err);
            location.href = 'http://127.0.0.1:5500'
        })
    }  
}

// Cette fonction verifie qu'un token existe et redirige l'utilisateur vers le lien tmdb pour valider le token
async function redirectUserToSSO() {
    let tokenData = await getNewTMDBToken()
    if (!tokenData.success) {
        return alert('Une erreur est survenue et je ne peux pas vous identifier')
    }
    location.href = `https://www.themoviedb.org/authenticate/${tokenData.request_token}?redirect_to=http://127.0.0.1:5500`
}

// Cette fonction fait une requete a tmdb pour obtenir  un token vierge a faire valider par le user
async function getNewTMDBToken() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${ssoTmdbReadApiKey}`
        }
    };
    let tokenRequest = await fetch('https://api.themoviedb.org/3/authentication/token/new', options).catch(err => console.error('error:' + err));
    if (!tokenRequest) {
        return
    }
    let tokenData = await tokenRequest.json() 
    return tokenData;
}

async function getNewSession(token) {
    const options = {
        method: 'POST', 
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${ssoTmdbReadApiKey}`
        },
        body: JSON.stringify({request_token: token})
    };
    let sessionRequest = await fetch('https://api.themoviedb.org/3/authentication/session/new', options).catch(err => console.error('error:' + err));
    if (!sessionRequest) {
        return
    }
    let sessionData = await sessionRequest.json()
    console.log(sessionData);
    return sessionData
}

function deletSession() {
    sessionStorage.removeItem('tmdbSessionId')
    sessionStorage.removeItem('tmdbSessionToken')
}

function hideloginbutton() {
    document.getElementById('buttonDelete').style.display = 'none';
    document.getElementById('redirectssobutton').style.display = 'block';

}
function hidedecobutton() {
    document.getElementById('buttonDelete').style.display = 'block';
    document.getElementById('redirectssobutton').style.display = 'none';
}

function buttonDelete() {
    let delSession = document.getElementById('buttonDelete');
    delSession.addEventListener('click', () => deletSession())
}
buttonDelete()

function buttonSignSession() {
    let redirButton = document.getElementById('redirectssobutton');
    redirButton.addEventListener('click', () => redirectUserToSSO())
}
buttonSignSession()

function deconnexionaffiche() {
    let deco = document.getElementById('buttonDelete');
    deco.addEventListener('click',()=> hideloginbutton())
}
deconnexionaffiche()
