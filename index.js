let api = `https://api.jikan.moe/v3/search`;
let animeApi = `${api}/anime`;
let mangaApi = `${api}/manga`;
let key = 'SA4XIX5LA1BQ';
let api2 = `https://api.tenor.com/v1/search`;
let isClick_next = false;
let shows_arr, gif_arr, is_hover, boxa;
function api_list(){
    let anime = `https://api.jikan.moe/v3/anime/id/request/parameter`;
    let manga = `https://api.jikan.moe/v3/manga/id/request`;
    let person = `https://api.jikan.moe/v3/person/id/request`;
    let character = `https://api.jikan.moe/v3/character/id/request`;
    let search = `https://api.jikan.moe/v3/search/type?q=Fate/Zero&page=1`;
    let season = `https://api.jikan.moe/v3/season/year/season`;
    let season_archive = `https://api.jikan.moe/v3/season/later`;
    let season_later = `https://api.jikan.moe/v3/season/later`;
    let schedule = `https://api.jikan.moe/v3/schedule/day`;
    let top = `https://api.jikan.moe/v3/top/type/page/subtype`;
    let genre = `https://api.jikan.moe/v3/genre/type/genre_id/page`;
    let producer = `https://api.jikan.moe/v3/producer/producer_id/page`;
    let magazine = `https://api.jikan.moe/v3/magazine/magazine_id/page`;
    let user = `https://api.jikan.moe/v3/user/username/request/argument`;
    let club = `https://api.jikan.moe/v3/club/id/request`;
    let meta = `https://api.jikan.moe/v3/meta/request/type/period`;
}

window.onload = () => {
    set_enviorment();
}

function set_enviorment() {
    body.innerHTML += '<div id="header"></div>';
    body.innerHTML += '<div id="main"></div>';
    body.innerHTML += '<div id="footer"></div>';
    header.innerHTML = `<ul id="nav"></ul>`;
    main.innerHTML = `<div id="search"></div>`;
    footer.innerHTML = `<i class="material-icons">copyright</i>Jamberu.Simantov`;
    search.innerHTML = `<div id="input"></div>`;
    search.innerHTML += `<div id="loader"></div>`;
    search.innerHTML += `<div id="result"></div>`;
    search.innerHTML += `<div id="gif_div_container"></div>`;
    input.innerHTML = `<input placeholder="search anime now..." type="text" id="inputElement"/>`;
    gif_div_container.innerHTML = '<div id="gif_div"></div>';
    gif_div.innerHTML = '<i id="close_gif_div" class= "material-icons">close</i></br>';
    gif_div.innerHTML += '<div id="gif_loader"></div>';
    gif_div.innerHTML += '<div id="gif_container"></div>';
    gif_div.innerHTML += '<i id="next_gifs_set" class= "material-icons">skip_next</i>';
    navbar(nav);
    inputElement.addEventListener('input', () => { searchAnime(result, loader, inputElement.value) });
    close_gif_div.addEventListener('click', () => { close_gif(gif_div_container, gif_container) });
    next_gifs_set.addEventListener('click', () => { next_set(gif_container) });
}

function navbar(nav_element) {
    let nav_list = ['about', 'contact'];
    nav_list.forEach(item => {
        nav_element.innerHTML += `<li class="navbar"><a href="#" class="nav_link">${item}</a></li>`;
    })
}


async function getManga(manga_name) {
    return await fetch(`${mangaApi}?q=${manga_name}/`).then(res => res.json());
}


async function getAnime(anime_name) {
    return await fetch(`${animeApi}?q=${anime_name}/`).then(res => res.json());
}
async function get_gif(anime_name) {
    return await fetch(`${api2}?q=${anime_name}&key=${key}&pos=${0}`).then(res => res.json());
}
async function searchAnime(grid_element, loader_div, value) {
    is_hover = false;
    if (value.length > 2) {
        try {
            display_loading(loader_div);
            await getAnime(value).then((res) => {
                anime_result_handler(res, grid_element);
            });
            await getManga(value).then(res => {
                console.log(res);
            })

        } catch (err) {
            console.error(err);
        } finally {
            clr_loading(loader_div);
        }
    } else {
        grid_element.innerHTML = '';
    }
}
async function search_gif(anime_name, grid_element) {
    try {
        display_loading(gif_loader);
        await get_gif(anime_name).then((res) => {
            gif_result_handler(res, grid_element);
        });
    } catch (err) {
        console.error(err);
    } finally {
        clr_loading(gif_loader);
    }
}
async function display_gif(param, container_element, grid_element) {
    try {
        await search_gif(param, grid_element).then(() => {
            container_element.style.display = 'block';
        });
    } catch (err) {
        console.error(err);
    } finally {}
}

function anime_result_handler(res, grid_element) {
    grid_element.innerHTML = '';
    shows_arr = res.results;
    if (shows_arr.length) {
        shows_arr.forEach(element => {
            print_result(element);
        });
    }
    add_events(gif_div_container, gif_container);
}

function gif_result_handler(res, grid_element) {
    grid_element.innerHTML = '';
    gif_arr = res.results;
    if (gif_arr.length) {
        if (gif_arr.length >= 12) {
            loop(0, 12, gif_arr);
            return;
        }
        loop(0, gif_arr.length, gif_arr);
    }
}

function display_synopsis(param) {
    is_hover = !is_hover;
    let imgs = document.getElementsByClassName('front');
    let front = document.getElementById(`front${param}`);
    let back = document.getElementById(`back${param}`);
    for (const element of imgs) {
        element.style.opacity = (is_hover) ? '10%' : '100%';
    }
    front.style.opacity = '100%';
    back.style.display = (is_hover) ? 'block' : '';
}

function loop(index_i, index_f, arr) {
    for (let i = index_i; i < index_f; i++) {
        add_gifs(arr[i].media[0].loopedmp4.url);
    }
}

function print_result(element) {
    element.title = fix_double_quatings(element.title);
    let box, inner, front, back;
    result.innerHTML += `<div id="${element.title}" class="flipbox"></div >`;
    box = document.getElementById(`${element.title}`);
    box.innerHTML = `<div class= "inner" id ="inner${element.title}"></div >`;
    inner = document.getElementById(`inner${element.title}`);
    inner.innerHTML = `<div class= "front" id ="front${element.title}"></div >`;
    inner.innerHTML += `<div class= "back" id ="back${element.title}"></div >`;
    front = document.getElementById(`front${element.title}`);
    front.innerHTML = `<img class= "img_element" src="${element.image_url}">`;
    back = document.getElementById(`back${element.title}`)
    back.innerHTML = `<h3 class= "title">${element.title}</h3>`;
    back.innerHTML += `<p class= "synopsis">${element.synopsis}</p>`;
    back.innerHTML += `<p class= "rated">rated:${element.rated}</p>`;
    back.innerHTML += `<p class= "episodes">episodes:${element.episodes}</p>`;
}

function add_gifs(url) {
    gif_container.innerHTML += `<div class="gif" ></div>`;
    let gifs = document.getElementsByClassName('gif');
    gifs[gifs.length - 1].innerHTML = `<video class="gif_element" src="${url}" autoplay loop muted></video>`;
}

function close_gif(container_element, grid_element) {
    grid_element.innerHTML = '';
    container_element.style.display = 'none';
}

function next_set(grid_element) {
    let gifs = grid_element.childNodes;
    let index = gifs.length;
    isClick_next = !isClick_next;
    if (isClick_next) {
        if (gif_arr.length >= 12) {
            grid_element.innerHTML = '';
            loop(12, gif_arr.length, gif_arr);
        }
        return;
    }
    grid_element.innerHTML = '';
    if (gif_arr.length >= 12) {
        loop(0, 12, gif_arr);
    } else {
        loop(0, gif_arr.length, gif_arr);
    }
}

function add_events(container_element, grid_element) {
    let boxes = document.getElementsByClassName('flipbox');
    for (const element of boxes) {
        boxa = element.id;
        element.addEventListener("mouseover", display_synopsis.bind(this, boxa));
        element.addEventListener("mouseout", display_synopsis.bind(this, boxa));
        element.addEventListener("click", display_gif.bind(this, boxa, container_element, grid_element));
    }
}

function display_loading(loader_div) {
    loader_div.innerHTML = "<img id='load_gif' src='https://flevix.com/wp-content/uploads/2020/01/Preloader.gif'>";
}

function clr_loading(loader_div) {
    loader_div.innerHTML = "";
}

function fix_double_quatings(param) {
    while (param.indexOf('"') != (-1)) {
        param = param.replace('"', "'");
    }
    return param;
}