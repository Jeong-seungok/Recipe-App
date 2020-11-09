const mealsEl = document.querySelector('#meals'); // 음식목록 부모 El
const mealPopupEl = document.querySelector('#meal-popup');
const mealInfoEl = document.querySelector('#meal-info');
const closePopBtn = document.querySelector('#close-popup');
const searchInputEl = document.querySelector('#search-term');
const searchBtnEl = document.querySelector('#search');
const favMealsEl = document.querySelector('#fav-meals');

// 초기화면 좋아요 목록, 랜덤이미지 출력
updateFav();
randomFood();

// 랜덤음식 API
async function randomFood(){
    const resData = 
    await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res=>res.json());

    const mealData = resData.meals[0];
    createFoodList(mealData, true);
}
// 검색한 음식 API
async function searchFood(term){
    const resData = 
    await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term)
    .then(res=>res.json());
    
    const mealDatas = resData.meals;
    return mealDatas;
}
// 음식 ID API
async function IdFood(id){
    const resData = 
    await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id)
    .then(res=>res.json());

    const mealDatas = resData.meals;
    return mealDatas;
}
// 좋아요 목록 업데이트
async function updateFav(){
    const mealDatas = GetFavInLs();
    favMealsEl.innerHTML = '';
    for(let i=0;i<mealDatas.length;i++){
        const meal = mealDatas[i];
        const mealDataArr = await IdFood(meal);
        AddFavMeal(mealDataArr[0]);
    }
}
// 검색목록 생성
searchBtnEl.addEventListener('click', async function(){
    mealsEl.innerHTML = ''; // 목록 초기화

    const term = searchInputEl.value;
    const mealDatas = await searchFood(term);

    mealDatas.forEach(meal=>{
        createFoodList(meal, false);
    })
});

// 음식목록 생성
function createFoodList(mealData, random = false){

    const mealEl = document.createElement('div');
    mealEl.classList.add('meal');

    mealEl.innerHTML = `
        <div class="meal-header">
        <span class="random">${random ? 'Random Recipe' : ''}</span>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn"><i class="fas fa-heart"></i></button>
        </div>
    `;
    // 좋아요 이벤트
    const favBtn = mealEl.querySelector('.fav-btn');
    favBtn.addEventListener('click',()=>{
        if(favBtn.classList.contains('active')){
            favBtn.classList.remove('active');
            RemoveFavInLs(mealData.idMeal);
        }
        else{
            favBtn.classList.add('active');
            AddFavInLs(mealData.idMeal);
        }
        updateFav();
    })
    // 팝업 이벤트
    mealEl.addEventListener('click', ()=>{
        foodInfoPopup(mealData);
    });
    mealsEl.append(mealEl);
}

// 음식정보 팝업
function foodInfoPopup(mealData){
    mealInfoEl.innerHTML = '';
    if(mealPopupEl.classList.contains('hidden'))
        mealPopupEl.classList.remove('hidden');
    
    const infoInnerEl = document.createElement('div');
    const ingredients = [];

    for(let i=0;i<20;i++){
        if(mealData['strIngredient'+i])
            ingredients
            .push(mealData['strIngredient'+i] + ' - ' + mealData['strMeasure'+i])
    }

    infoInnerEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <p>
        ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
                .map(
                    (ing) => `
            <li>${ing}</li>
            `
                )
                .join("")}
        </ul>
    `;

    closePopBtn.addEventListener('click',()=>{
        mealPopupEl.classList.add('hidden');
    })

    mealInfoEl.append(infoInnerEl);
}
// 좋아요 음식추가
function AddFavMeal(mealData){
    const favMealEl = document.createElement('li');
    favMealEl.innerHTML = `
        <img
        src="${mealData.strMealThumb}"
        alt="${mealData.strMeal}"/>
        <span>${mealData.strMeal}</span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `
    const clearBtn = favMealEl.querySelector('.clear');
    clearBtn.addEventListener('click',()=>{
        const mealId = mealData.idMeal;
        RemoveFavInLs(mealId);
        updateFav();
    })
    favMealsEl.append(favMealEl);
}
// 좋아요 목록 로컬저장소에서 가져오기
function GetFavInLs(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    return mealIds === null ? [] : mealIds;
}
// 좋아요 목록 추가
function AddFavInLs(mealId){
    const mealIds = GetFavInLs();
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}
// 좋아요 목록 제거
function RemoveFavInLs(mealId){
    const mealIds = GetFavInLs();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id=> id !== mealId)));
}