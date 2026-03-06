const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLesson = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLesson(data.data));
};

const removeActive = () => {
  const lessonButton = document.querySelectorAll(".lesson-btn");
  lessonButton.forEach((btn) => {
    btn.classList.remove("active");
  });
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  // fetch(url)
  //   .then((res) => res.json())
  //   .then((data) => console.log(data));
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  const detailsContainer = document.getElementById("details-container");
  console.log(word);
  detailsContainer.innerHTML = `
   <div>
                    <h2 class="text-2xl font-bold">${word.word} ( <i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>

                </div>
                <div>
                    <h1 class="font-bold">Meaning</h1>
                    <p>${word.meaning}</p>
                </div>
                <div>
                    <h1 class="font-bold">Example</h1>
                    <p>${word.sentence}</p>
                </div>
                <div>
                    <h1 class="font-bold">সমার্থক শব্দ গুলো</h1>
                   <div class="">${createElements(word.synonyms)}</div>
                </div>
  `;
  document.getElementById("my_modal_5").showModal();
};

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `<div class="text-center col-span-full space-y-4 font-bangla">
            <img class='mx-auto' src="./assets/alert-error.png" alt="">
            <p class="font-normal text-[13.38px] ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <p class="font-medium text-[34.31px]">নেক্সট Lesson এ যান</p>
        </div>`;
    manageSpinner(false);
    return;
  }
  words.forEach((word) => {
    const wordCard = document.createElement("div");
    wordCard.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5">
            <h2 class="font-bold text-[32px] mb-6">${word.word ? word.word : "শব্দে পাওয়া যায় নি "}</h2>
            <p class="font-medium text-[20px] mb-6">Meaning /Pronounciation</p>
            <div class="font-bangla font-semibold text-[32px] mb-[56px]">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"}/ ${word.pronunciation}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick='pronounceWord('${word.word}')' class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
    `;
    wordContainer.append(wordCard);
  });
  manageSpinner(false);
};
const displayLesson = (lessons) => {
  //1.get the container
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  //2.Get every lesson
  for (let lesson of lessons) {
    //3.Create btnDiv
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
     <button
     id="lesson-btn-${lesson.level_no}"
      onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
    `;
    // 4.Append
    levelContainer.append(btnDiv);
  }
};

loadLesson();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const allWords = data.data;
      console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      displayLevelWord(filterWords);
    });
});
