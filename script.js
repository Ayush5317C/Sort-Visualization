//Using 20 bars to demonstrate

//Global Declaration
let heights = [];
let bars;
const barContainer = document.querySelector(".bars");
const menuContainer = document.querySelector(".menuContainer");
const menuIcon = document.querySelector(".menuIcon");
const menuElements = document.querySelectorAll(".menuElement");
const sortTitle = document.querySelector(".sortTitle");
let timeDelay = 0.5;
let prevSelectedMenu;
let canPlay = true;
let isSortChanged = false;
let activeSort = "selection";
const sortType = {
  selection: {
    title: "Selection Sort",
    sort: selectionSort,
    menuElement: menuElements[0],
  },
  bubble: {
    title: "Bubble Sort",
    sort: bubbleSort,
    menuElement: menuElements[1],
  },
  insertion: {
    title: "Insertion Sort",
    sort: insertionSort,
    menuElement: menuElements[2],
  },
};
//Main
//changing sort menu selection first time on the basis of activeSort
prevSelectedMenu = sortType[activeSort].menuElement;
prevSelectedMenu.classList.add("activeMenu");
//bars
generateRandomHeights();
generateBars(heights);
menuIcon.addEventListener("click", () => {
  menuContainer.classList.toggle("activeMenuContainer");
});
setSortTitle();
//changing all the setup accordingly on the basis of sorting technique change
for (const menuElement of menuElements) {
  menuElement.addEventListener("click", () => {
    basicResetSetup();
    prevSelectedMenu.classList.remove("activeMenu");
    menuElement.classList.add("activeMenu");
    activeSort = menuElement.getAttribute("data-val");
    prevSelectedMenu = menuElement;
    setSortTitle(activeSort);
  });
}
document
  .querySelector("#randomizeBtn")
  .addEventListener("click", basicResetSetup);
document.querySelector("#playBtn").addEventListener("click", () => {
  if (canPlay) play();
  canPlay = false;
  menuContainer.classList.remove("activeMenuContainer");
});

//Functions
function basicResetSetup() {
  canPlay = true;
  isSortChanged = true;
  generateRandomHeights();
  removeActiveBarStyle();
  updateBars(-1, -1, false);
}
function generateRandomHeights() {
  for (let i = 0; i < 20; ++i) {
    let height = 20 + Math.ceil(Math.random() * 80);
    heights[i] = height;
  }
}
function generateBars(heights) {
  for (let i = 0; i < 20; ++i) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${heights[i]}%`;
    bar.style.left = `${i * 35}px`;
    barContainer.append(bar);
  }
  bars = document.querySelectorAll(".bar");
}
function play() {
  sortType[activeSort].sort();
}
async function selectionSort() {
  let n = heights.length;
  isSortChanged = false;
//   O position ko element lai aru position ko element sange palai palo compare hanera sano huda swap hanne
// O position ko element primary bar and baki ko secondary bar
// swap handa
// show ---> delay ---> O (primary) swap with secondary ---> delay ---> isSwapped = false feri agadi ko lai primary banaune
  for (let i = 0; i < n - 1; ++i) {
    for (let j = i + 1; j < n; ++j) {
      //checking if user has changed the sorting techniques in the middle of sorting. if so, stopping sort
      if (isSortChanged) {
        isSortChanged = false;
        return;
      }
      updateBars(i,j,false);
      await delay(timeDelay);
      //sorting logic
      if (heights[i] > heights[j]) {
        swap(heights, i, j);
        updateBars(i, j, true);
        await delay(timeDelay);
      }
    }
  }
  //removes the styling of two selected bars at last
  removeActiveBarStyle();
}
async function bubbleSort() {
  let n = heights.length;
  isSortChanged = false;
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < n - 1; ++j) {
      //checking if user has changed the sorting techniques in the middle of sorting. if so, stopping sort
      if (isSortChanged) {
        isSortChanged = false;
        return;
      }
      updateBarsForBubble(j, j + 1);
      await delay(timeDelay);
      //sorting logic
      if (heights[j] > heights[j + 1]) {
        swap(heights, j, j + 1);
        updateBarsForBubble(j, j + 1);
        await delay(timeDelay);
      }
    }
  }
  //removes the styling of two selected bars at last
  removeActiveBarStyle();
}
async function insertionSort() {
  let n = heights.length;
  isSortChanged = false;
  for (let i = 1; i < n; ++i) {
    for (let j = i; j > 0; --j) {
      //checking if user has changed the sorting techniques in the middle of sorting. if so, stopping sort
      if (isSortChanged) {
        isSortChanged = false;
        return;
      }
      updateBars(j, j-1, false);
      await delay(timeDelay);
      //sorting logic
      if (heights[j - 1] < heights[j]) {
        break;
      }
      swap(heights, j - 1, j);
      updateBars(j, j - 1, true);
      await delay(timeDelay);
    }
  }
  //removes the unwanted styling of bars
  removeActiveBarStyle();
}

function swap(list, ind1, ind2) {
  let temp = list[ind1];
  list[ind1] = list[ind2];
  list[ind2] = temp;
}
function updateBars(ind1, ind2, hasSwapped) {
  bars.forEach((bar, i) => {
    bar.style.height = `${heights[i]}%`;
    if (i == (!hasSwapped ? ind1 : ind2)) bar.classList.add("primaryBar");
    else bar.classList.remove("primaryBar");

    if (i == (!hasSwapped ? ind2 : ind1)) bar.classList.add("secondaryBar");
    else bar.classList.remove("secondaryBar");
  });
}
function updateBarsForBubble(ind1, ind2) {
  bars.forEach((bar, i) => {
    if (i == ind1 || i == ind2) {
      bar.classList.add("primaryBar");
    } else {
      bar.classList.remove("primaryBar");
    }
    bar.style.height = `${heights[i]}%`;
  });
}
function removeActiveBarStyle() {
  for (const bar of bars) {
    bar.classList.remove("primaryBar");
    bar.classList.remove("secondaryBar");
  }
}
function delay(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}
function setSortTitle() {
  sortTitle.innerText = sortType[activeSort].title;
}
