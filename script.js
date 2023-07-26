const sleep = (ms) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};

const header = document.getElementsByTagName("header")[0];
const footer = document.getElementsByTagName("footer")[0];
const navLinks = document.getElementsByName("navLink");
const tourInfo = document.getElementsByClassName("tour-info")[0];
const placesSlides = document.getElementsByClassName("places-slides")[0];
const placesLink = document.getElementsByClassName("places-link")[0];

const mainHeaderScrollButton = document.getElementById(
  "mainHeaderScrollButton"
);

let showedPhoto = document.getElementsByName("current-slide")[0];
let droppedPhoto = document.getElementsByName("dropped-slide")[0];

const sliderTimer = document.getElementsByClassName("slider-timer")[0];

let droppedPlace, currentPlace, placesPagination;

const mainScrollTime = 6250;

const mainSliderImagesSrc = [
  "assets/img/11.jpg",
  "assets/img/13.jpg",
  "assets/img/15.jpg",
  "assets/img/14.jpg",
];

let currentPlaceIndex = 0;
let isRemoting = false;
const prevPlaceRemoteButton = document.getElementById("prevPlaceRemoteButton");
const nextPlaceRemoteButton = document.getElementById("nextPlaceRemoteButton");

const places = [
  {
    name: "Сулакский каньон",
    text: `Самая живописная достопримечательность Дагестана достигает 2 000 метров в глубину, 53 км в длину и 3 км в ширину. 
    При этом здесь комфортно прогуливаться – есть и пешеходные тропы, и мостики, и сотни обзорных площадок. 
    А по бирюзовой реке Сулак, протекающей в ущелье, можно прокатиться на туристическом катере.`,
    src: "assets/img/sulak.jpg",
  },
  {
    name: "Бархан Сарыкум",
    text: `В Дагестане находится редкий памятник 
    природы – один на всю Евразию – гигантская песчаная гора площадью 600 гектаров и высотой 262 метра. 
    Сарыкум называют филиалом пустыни Сахары в предгорье, и, 
    по подсчетам ученых, его возраст составляет 5 000 лет.`,
    src: "assets/img/barhan.jpg",
  },
  {
    name: "Водопад Тобот",
    text: `Тобот получил свое имя от одноименной реки, но местные иногда называют его Хунзахским – в честь плато, с обрыва которого и стекает источник с высотой падения более 70 метров.
    Во время таяния снегов Тобот становится особенно полноводным, и рядом с ним возникает еще и красивое озеро. 
    А зимой водопад замерзает и превращается в огромную сосульку – возможно, многих привлечет именно этот вид.`,
    src: "assets/img/tobot.jpg",
  },
  {
    name: "Село-призрак Гамсутль",
    text: `В высокогорье Гунибского района, на склоне горы Гамсутльмеэр виднеются руины аула, который 
    еще недавно был живым. Гамсутль и Дербент считаются самыми старыми поселениями Дагестана. 
    Во второй половине XX века людям стало тесно жить в тесных древних домах, туда не доходила телефонная связь и другие блага цивилизации, 
    поэтому жители Гамсутля стали покидать его и переезжать в комфортные города и села, так здесь в итоге не осталось никого.`,
    src: "assets/img/gamsutl.jpg",
  },
  {
    name: "Село Чох",
    text: `В Гунибском районе находится знаменитый на всю страну аул Чох – здесь около 10 000 лет назад остановились древние люди времен неолита – это одно из старейших поселений в Европе. 
    Сегодня же этот аул посещают не только из-за исторической повестки, но и из-за уникальной жилой 
    архитектуры – селение застроено своеобразными домами-террасами, крыша каждого 
    дома прилегает к основанию соседнего. Очень аутентичное и важное для республики место.`,
    src: "assets/img/choh.jpg",
  },
  {
    name: "Нарын-кала",
    text: `Это один из лучших музеев Дагестана — крепость нависает над древним Дербентом. 
    Вам потребуется минимум час, чтобы обойти только ее часть и стены под открытым небом. 
    Не пожалейте денег на экскурсию: здесь работают люди, которые готовы без устали рассказывать 
    туристам об истории памятника. Помимо музея, здесь есть зоны отдыха и кафе.`,
    src: "assets/img/derbent.jpg",
  },
  {
    name: "Село Гуниб",
    text: `Крупное село высоко в горах. Здесь есть гостиницы, кафе и несколько достопримечательностей. 
    Например, монумент «Белые журавли», который олицетворяет слова известной песни на стихи Расула 
    Гамзатова. В центре села небольшой водопад, а в самой высокой его точке — Гунибская крепость, 
    которую называют последним оплотом имама Шамиля.`,
    src: "assets/img/gunib.jpg",
  },
];

const scrollTo = (element) => {
  element.scrollIntoView({
    block: "center",
    behavior: "smooth",
  });
};

const updateMainSliderPhotos = async () => {
  mainSliderImagesSrc.unshift(mainSliderImagesSrc.pop());

  showedPhoto = document.getElementsByName("current-slide")[0];
  droppedPhoto = document.getElementsByName("dropped-slide")[0];

  await sleep(1500);

  droppedPhoto.src = mainSliderImagesSrc[mainSliderImagesSrc.length - 2];
  droppedPhoto.className = "slide-right";
};

/* PLACES REMOTING */
const updatePlaces = () => {
  droppedPlace = document.getElementById("droppedPlace");
  currentPlace = document.getElementById("currentPlace");
};

const updatePlaceContent = (place, placeIndex = 0) => {
  let placeTitle = place.getElementsByTagName("h4")[0];
  let placeText = place.getElementsByTagName("p")[0];
  let placeImg = place.getElementsByTagName("img")[0];

  placeTitle.innerHTML = places[placeIndex].name;
  placeText.innerHTML = places[placeIndex].text;
  placeImg.src = places[placeIndex].src;
};

const remotePlace = async (index) => {
  if (isRemoting) return;
  isRemoting = true;

  let next = index > currentPlaceIndex && index <= places.length && index > 0;

  if (index === currentPlaceIndex) {
    return;
  }

  placesPagination.children[currentPlaceIndex].classList.remove("current-page");

  if (index >= places.length) {
    currentPlaceIndex = 0;
  } else if (index < 0) {
    currentPlaceIndex = places.length - 1;
  } else {
    currentPlaceIndex = index;
  }

  placesPagination.children[currentPlaceIndex].classList.add("current-page");

  updatePlaceContent(droppedPlace, currentPlaceIndex);

  droppedPlace.className = `main-info-inner slide-${next ? "right" : "left"}`;

  await sleep(100);

  if (next) {
    currentPlace.className = "main-info-inner slide-left drop-center-left";
    droppedPlace.className = "main-info-inner slide-center drop-right-center";
  } else {
    currentPlace.className = "main-info-inner slide-right drop-center-right";
    droppedPlace.className = "main-info-inner slide-center drop-left-center";
  }

  droppedPlace.id = "currentPlace";
  currentPlace.id = "droppedPlace";

  updatePlaces();

  await sleep(500);
  isRemoting = false;
};

const setPagination = () => {
  placesPagination = document.getElementById("placesPagination");

  places.forEach((v, i) => {
    const paginationUnit = document.createElement("div");

    paginationUnit.className = "pagination-unit";

    paginationUnit.onclick = function () {
      if (currentPlaceIndex === i) return;
      remotePlace(i);
    };

    placesPagination.appendChild(paginationUnit);
  });

  placesPagination = document.getElementById("placesPagination");
  placesPagination.children[0].classList.add("current-page");
};

nextPlaceRemoteButton.addEventListener("click", () =>
  remotePlace(currentPlaceIndex + 1)
);
prevPlaceRemoteButton.addEventListener("click", () =>
  remotePlace(currentPlaceIndex - 1)
);
/* PLACES REMOTING */

/* Scrollers */
navLinks[0].addEventListener("click", () => scrollTo(tourInfo));
navLinks[1].addEventListener("click", () => scrollTo(placesSlides));
navLinks[2].addEventListener("click", () => scrollTo(footer));

mainHeaderScrollButton.addEventListener("click", () => scrollTo(tourInfo));
placesLink.addEventListener("click", () => scrollTo(placesSlides));
/* Scrollers */

setInterval(() => {
  if (window.scrollY > header.clientHeight) return;

  droppedPhoto.className = "slide-center drop-right-center";
  showedPhoto.className = "slide-left drop-center-left";

  showedPhoto.name = "dropped-slide";
  droppedPhoto.name = "current-slide";

  updateMainSliderPhotos();
}, mainScrollTime);

updatePlaces();
updatePlaceContent(currentPlace);
setPagination();

/* Social */
const social = [
  "https://t.me/+79884202495",
  "https://api.whatsapp.com/send?phone=79884202495",
  "https://instagram.com/maga.tour",
];

document.getElementsByName("social").forEach((link, i) => {
  link.onclick = () => {
    window.open(social[i], "_blank");
  };
});
