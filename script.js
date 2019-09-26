// Dog API

// Доделываем страничку с собачками.

// API - https://dog.ceo/dog-api/documentation/breed (тоже что и было на уроке)
// добавляем верстку
// создаем input type search, для поиска породы
// полученный список пород преобразовываем в одномерный массив строк, то есть:
// 	если у нас была вот такая структура в ответе:
// 			{
//     	     "mastiff": [
//                  "bull",
//                  "english",
//                  "tibetan"
//              ],
// 			"mexicanhairless": [],
// 			}
//     на выходе должны получить:
//       ["mastiff", "mexicanhairless"]
//  при клике/выборе одной из пород показать заголовок с названием породы
// при выборе породы запросить все картинки и отобразить их в слайдере
// если у породы есть виды как например у mastiff("bull",  "english",  "tibetan"), 
// отобразить селект с выбором вида и только после выбора вида запрашивать картинки и рисовать слайдер.

function makeRequest(url) {
    return fetch(url).then(res => res.json())
};

function createList(dogs, className, addingClassName, creatingElement) {
    const fragment = document.createDocumentFragment();
    const element = document.createElement(creatingElement);
    element.classList.add(addingClassName);

    for (dog of dogs) {
        let clone = element.cloneNode();
        clone.textContent = dog;
        element.classList.add(addingClassName);
        fragment.appendChild(clone);
        listOnClick(clone, dog)
    };

    const parent = document.getElementsByClassName(className)[0];
    if (creatingElement == 'option') {
        element.setAttribute('disabled', '');
        element.setAttribute('selected', '');
        element.textContent = 'подпорода';
        parent.appendChild(element);
    };
    parent.appendChild(fragment);
};

function clearOption(element) {
    let clear = document.getElementsByClassName(element);
    while (clear.length) clear[0].remove();
};

function createTitle(name, element) {
    let title = document.querySelector(element);
    title.textContent = name;
};

function searchInput(event) {

    const target = event.target;
    const search = target.value;

    let input = document.getElementsByClassName('breed');

    for (let i = 0; i < input.length; i++) {

        if (input[i].textContent.search(search) === -1) {
            input[i].style.display = 'none';
        } else {
            input[i].style.display = 'block';
        };
    };
};

function eventAction(event, idName, handler) {
    const search = document.querySelector(idName);
    search.addEventListener(event, handler);
};

function createImgList(res) {
    if (res.length > 7) {
        return res.slice(0, 7)
    }
    return res;
};

function setImgList(breed) {
    makeRequest(`https://dog.ceo/api/breed/${breed}/images`)
        .then((res) => createImgList(res.message))
        .then((res) => setSlider(res))
};

function setSlider(res) {

    clearOption('img-slider');

    let line = document.querySelector('.slider--line');
    const fragment = document.createDocumentFragment();
    const img = document.createElement('img');

    // res.forEach(item => { //выдавало ошибку, в версии с webpack работает (task 32)
    //     const clone = img.cloneNode();
    //     clone.src = item;
    //     clone.classList.add('img-slider');
    //     fragment.appendChild(clone);
    // });

    for (let i = 0; i < res.length; i++) {
        const clone = img.cloneNode();
        clone.src = res[i];
        clone.classList.add('img-slider');
        fragment.appendChild(clone);
    }

    line.appendChild(fragment);

    let list = document.querySelectorAll('.img-slider');

    line.style.width = list.length * 640 + 'px';

    const leftArrow = document.querySelector('.left--arrow');
    const rightArrow = document.querySelector('.right--arrow');
    let position = 0;
    line.style.right = 0;

    rightArrow.onclick = function () {
        position += 640;
        if (position > ((list.length - 1) * 640)) {
            position = 0
        }
        line.style.right = `${position}px`;
    };

    leftArrow.onclick = function () {
        position -= 640;
        if (position < 0) {
            position = ((list.length - 1) * 640)
        };
        line.style.right = `${position}px`;
    };
};

function getTitleName(element) {
    let name = document.querySelector(element);
    return name.textContent;
};

function createSelect(element, breed) {
    const select = document.getElementsByClassName('sub-breed')[0];
    const slider = document.getElementsByClassName('slider')[0];

    if (element.length > 0) {
        clearOption('dog-option');
        slider.style.display = 'none';
        createList(element, 'sub-breed', 'dog-option', 'option')
        select.style.display = 'block';

    } else {

        select.style.display = 'none';
        setImgList(breed);
        slider.style.display = 'block';

    };
};

function getOptionBreed() {
    const index = document.querySelector('.sub-breed').selectedIndex;
    const options = document.querySelector('.sub-breed').options;
    let subBreed = options[index].text;
    let breed = getTitleName('.title');
    if (index > 0) {

        const slider = document.getElementsByClassName('slider')[0];
        slider.style.display = 'block';

        makeRequest(`https://dog.ceo/api/breed/${breed}/${subBreed}/images`)
            .then(res => createImgList(res.message))
            .then(res => setSlider(res))
    }
};

makeRequest('https://dog.ceo/api/breeds/list/all')
    .then(res => createList(Object.keys(res.message), 'list', "breed", 'li'));

function listOnClick(element, breed) {
    clearOption('img-slider');
    element.onclick = () => {
        makeRequest(`https://dog.ceo/api/breed/${breed}/list`)
            .then(res => createSelect(res.message, breed))
            .then(() => createTitle(breed, '.title'))
    };
};

eventAction('input', '#search', searchInput);

eventAction('change', '.sub-breed', getOptionBreed);
