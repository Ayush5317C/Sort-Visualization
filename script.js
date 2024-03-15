//Using 20 bars to demonstrate

//Global Declaration
let heights = [];
let bars;
const barContainer = document.querySelector(".bars");
const menuContainer = document.querySelector(".menuContainer");
const menuIcon = document.querySelector(".menuIcon");
const menuElements = document.querySelectorAll(".menuElement");
const sortTitle = document.querySelector(".sortTitle");
const timeDelay = 1;
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
  bars = [...document.querySelectorAll(".bar")];
}
function play() {
  sortType[activeSort].sort();
}
async function selectionSort() {
  let n = heights.length;
  isSortChanged = false;
  //search for the minimum value, at the end swap with current; then increase current and again find minimum and at the end swap with current
  for (let i = 0; i < n - 1; ++i) {
    let minIndex = i;
    for (let j = i + 1; j < n; ++j) {
      if (heights[j] < heights[minIndex]) {
        bars[minIndex].classList.remove("minBar");
        minIndex = j;
        bars[minIndex].classList.add("minBar");
      }
      //checking if user has changed the sorting techniques in the middle of sorting. if so, stopping sort
      if (isSortChanged) {
        isSortChanged = false;
        removeActiveBarStyle();
        return;
      }
      updateBars(i, j, false);
      await delay(timeDelay);
    }
    updateBars(i, minIndex, false);
    await delay(timeDelay);
    if (minIndex != i) {
      swap(heights, i, minIndex);
      updateBars(i, minIndex, true);
      bars[i].classList.add("minBar");
      bars[minIndex].classList.remove("minBar");
      await delay(timeDelay);
    }
    bars[i].classList.remove("minBar");
  }
}
async function bubbleSort() {
  let n = heights.length;
  isSortChanged = false;
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < n - 1; ++j) {
      //checking if user has changed the sorting techniques in the middle of sorting. if so, stopping sort
      if (isSortChanged) {
        isSortChanged = false;
        removeActiveBarStyle();
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
}
async function insertionSort() {
  let n = heights.length;
  isSortChanged = false;
  for (let i = 1; i < n; ++i) {
    for (let j = i; j > 0; --j) {
      //checking if user has changed the sorting techniques in the middle of sorting. if so, stopping sort
      if (isSortChanged) {
        isSortChanged = false;
        //removes the unwanted styling of bars
        removeActiveBarStyle();
        return;
      }
      updateBars(j, j - 1, false);
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
}

function swap(list, ind1, ind2) {
  let temp = list[ind1];
  list[ind1] = list[ind2];
  list[ind2] = temp;
}
function updateBars(ind1, ind2, hasSwapped) {
  if (hasSwapped) {
    let t = ind1;
    ind1 = ind2;
    ind2 = t;
  }
  bars.forEach((bar, i) => {
    bar.style.height = `${heights[i]}%`;
    i == ind1
      ? bar.classList.add("primaryBar")
      : bar.classList.remove("primaryBar");
    i == ind2
      ? bar.classList.add("secondaryBar")
      : bar.classList.remove("secondaryBar");
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
    bar.classList.remove("minBar");
  }
}
function delay(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}
function setSortTitle() {
  sortTitle.innerText = sortType[activeSort].title;
}
