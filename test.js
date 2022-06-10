const URL = "https://restcountries.com/v3.1/all";
const btnPre = document.querySelector(".btn-pre");
const btnNext = document.querySelector(".btn-next");
const paginateTextId = document.querySelector("#paginateTextId");
let textValue = +paginateTextId.value;
const totalPage = document.querySelector(".total-page");
let totalPageValue = +totalPage.textContent;
const col = document.querySelector(".col");
const searchTextId = document.querySelector("#searchTextId");
let _search = searchTextId.value;
const iconClear = document.querySelector(".icon-clear");
const selectRegion = document.querySelector(".select-region");
const listCountries = document.querySelector(".list-countries");
const countriesItem = document.querySelectorAll(".list-countries li");
const iconDown = document.querySelector(".fa-chevron-down");
let _filter = "Filter by Region";
const regionName = document.querySelector(".regionName");
const btnReset = document.querySelector(".btn-reset");
//====================================================================
/**
 * CALL API
 * @param {*} url
 * @returns
 */
const callApi = async (url) => {
  try {
    const response = await fetch(url);
    const datas = await response.json();
    return datas;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};
//====================================================================
/**
 * PHÂN TRANG
 * @param {*} datas
 * @param {*} page
 * @param {*} LIMIT
 * @returns
 */
const paginate = (datas, page = 1, LIMIT = 8) => {
  const pos = (page - 1) * LIMIT;
  let records = [];
  let totalRecords = page * LIMIT;
  if (totalRecords >= datas.length) {
    totalRecords = datas.length;
  }
  totalPage.textContent = Math.ceil(datas.length / LIMIT);
  totalPageValue = +totalPage.textContent;
  for (let i = pos; i < totalRecords; i++) {
    records.push(datas[i]);
  }
  const htmls = records.map((data) => {
    return `
            <div class="country">
              <div class="country__flag">
                <img
                  src="${data.flags.png}"
                  alt="${data.name.common}"
                />
              </div>
              <div class="country__name">${data.name.common}</div>
              <div class="country__information">
                <p><span class="index">Population:</span> ${data.population}</p>
                <p><span class="index">Region:</span> ${data.region}</p>
                <p><span class="index">Capital:</span> ${data.capital}</p>
              </div>
            </div>
      `;
  });
  if (htmls.join() === "") {
    paginateTextId.value = 0;
    return (col.textContent = "Không có kết quả nào");
  }

  col.innerHTML += htmls.join("");
};
const PaginateOnePage = async (url, page = 1, search = "") => {
  try {
    const datas = await callApi(url);
    paginate(datas, page);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};
//====================================================================
/**
 * PHÂN TRANG VÀ TÌM KIẾM
 * @param {*} url
 * @param {*} searchText
 * @param {*} page
 * @returns
 */
const PaginateSearchCountries = async (url, searchText, page = 1) => {
  try {
    const datas = await callApi(url);

    const arrSearch = datas.map((item) =>
      item.name.common
        .toLowerCase()
        .trim()
        .indexOf(searchText.toLowerCase().trim()) > -1
        ? item
        : ""
    );
    let result = [];
    for (let val of arrSearch) {
      if (val !== "") result.push(val);
    }
    paginate(result, page);
    return result;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};
//====================================================================
/**
 *  PHÂN TRANG VÀ LỌC
 * @param {*} url
 * @param {*} filterText
 * @param {*} page
 * @returns
 */
const PaginateFilterRegion = async (
  url,
  filterText = "Filter by Region",
  page = 1
) => {
  try {
    const datas = await callApi(url);
    const arrFilter = datas.map((item) =>
      item.region.indexOf(filterText) > -1 ? item : ""
    );
    let result = [];
    for (let val of arrFilter) {
      if (val !== "") result.push(val);
    }
    paginate(result, page);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};
selectRegion.onclick = () => {
  let types = [listCountries, iconDown];
  for (let type of types) {
    if (type.style.display == "block") {
      type.style.display = "none";
    } else {
      type.style.display = "block";
    }
  }
};

for (let item of countriesItem) {
  item.onclick = async () => {
    btnReset.style.display = "block";
    _filter = item.textContent;
    regionName.textContent = _filter;
    col.innerHTML = "";
    textValue = 1;
    paginateTextId.value = 1;
    await PaginateFilterRegion(URL, _filter, textValue);
  };
}

btnPre.onclick = async () => {
  if (textValue <= 1 || textValue > totalPageValue) return;
  else {
    textValue--;
  }

  col.innerHTML = "";
  if (_search !== "") {
    await PaginateSearchCountries(URL, _search, textValue);
  } else if (_search === "" && _filter === "Filter by Region") {
    await PaginateOnePage(URL, textValue);
  } else {
    await PaginateFilterRegion(URL, _filter, textValue);
  }
  paginateTextId.value = textValue;
};
btnNext.onclick = async () => {
  if (textValue < 1 || textValue >= totalPageValue) return;
  else {
    textValue++;
  }
  col.innerHTML = "";
  if (_search !== "") {
    await PaginateSearchCountries(URL, _search, textValue);
  } else if (_search === "" && _filter === "Filter by Region") {
    await PaginateOnePage(URL, textValue);
  } else {
    await PaginateFilterRegion(URL, _filter, textValue);
  }
  paginateTextId.value = textValue;
};
paginateTextId.onchange = async () => {
  textValue = +paginateTextId.value;
  if (textValue < 1 || textValue > +totalPageValue) {
    paginateTextId.value = 0;
    textValue = 0;
    regionName.textContent = "Filter by Region";
    col.textContent = "Không có kết quả nào";
    return;
  }
  col.innerHTML = "";
  regionName.textContent = "Filter by Region";
  await PaginateOnePage(URL, textValue);
};
PaginateOnePage(URL, textValue);

iconClear.onclick = () => {
  searchTextId.value = "";
  _search = "";
  iconClear.style.display = "none";
  regionName.textContent = "Filter by Region";
  col.innerHTML = "";
  PaginateOnePage(URL, 1);
};
btnReset.onclick = () => {
  btnReset.style.display = "none";
  regionName.textContent = "Filter by Region";
  _filter = "Filter by Region";
  col.innerHTML = "";
  PaginateOnePage(URL, 1);
};
searchTextId.onchange = async () => {
  if (searchTextId.value !== "") iconClear.style.display = "block";
  paginateTextId.value = 1;
  textValue = 1;
  _search = searchTextId.value;
  col.innerHTML = "";
  PaginateSearchCountries(URL, _search, textValue);
};
