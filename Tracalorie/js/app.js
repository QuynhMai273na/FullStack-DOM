class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesBurned();
    this._displayCaloriesConsumed();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
  // Public methods
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index != -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeMeal(id);
      this._meals.splice(index, 1);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index != -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeWorkout(id);

      this._workouts.splice(index, 1);
      this._render();
    }
  }
  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }
  setLimit(limit) {
    this._calorieLimit = limit;
    Storage.setCalorieLimit(limit);
    this._displayCaloriesLimit();

    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }
  //private methods
  _displayCaloriesTotal() {
    const totalCaloriesElement = document.getElementById('calories-total');
    totalCaloriesElement.innerText = this._totalCalories;
  }
  _displayCaloriesLimit() {
    const limitlCaloriesElement = document.getElementById('calories-limit');
    limitlCaloriesElement.innerText = this._calorieLimit;
  }
  _displayCaloriesConsumed() {
    const caloriesComsumedElement =
      document.getElementById('calories-consumed');
    const caloriesConsumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesComsumedElement.innerText = caloriesConsumed;
  }
  _displayCaloriesBurned() {
    const caloriesBurnedElement = document.getElementById('calories-burned');
    const caloriesBurned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedElement.innerText = caloriesBurned;
  }
  _displayCaloriesRemaining() {
    const progressElement = document.getElementById('calorie-progress');

    const caloriesRemainElement = document.getElementById('calories-remaining');
    const caloriesRemain = this._calorieLimit - this._totalCalories;
    caloriesRemainElement.innerText = caloriesRemain;

    if (caloriesRemain <= 0) {
      caloriesRemainElement.parentElement.classList.remove('bg-light');
      caloriesRemainElement.parentElement.classList.add('bg-danger');
      progressElement.classList.remove('bg-success');
      progressElement.classList.add('bg-danger');
    } else {
      caloriesRemainElement.parentElement.classList.remove('bg-danger');
      caloriesRemainElement.parentElement.classList.add('bg-light');
      progressElement.classList.remove('bg-danger');
      progressElement.classList.add('bg-success');
    }
  }
  _displayCaloriesProgress() {
    const progressElement = document.getElementById('calorie-progress');
    const progress = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(progress, 100);
    progressElement.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealsElement = document.getElementById('meal-items');
    const mealEle = document.createElement('div');
    mealEle.classList.add('card', 'my-2');
    mealEle.setAttribute('data-id', meal.id);
    mealEle.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
            </div>`;

    mealsElement.appendChild(mealEle);
  }
  _displayNewWorkout(workout) {
    const workoutsElement = document.getElementById('workout-items');
    const workoutEle = document.createElement('div');
    workoutEle.classList.add('card', 'my-2');
    workoutEle.setAttribute('data-id', workout.id);
    workoutEle.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
            </div>`;

    workoutsElement.appendChild(workoutEle);
  }
  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem('calorieLimit');
    }
    return calorieLimit;
  }
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem('totalCalories');
    }
    return totalCalories;
  }
  static updateTotalCalories(totalCalories) {
    localStorage.setItem('totalCalories', totalCalories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }
  static saveMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }
  static getWorkouts() {
    let workouts;
    if (localStorage.getItem('workouts') === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }
  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals().filter((meal) => meal.id !== id);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts().filter(
      (workout) => workout.id !== id
    );
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }
  static clearAll() {
    localStorage.clear();
  }
}
class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }
  _loadEventListeners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));

    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'));

    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

    document
      .getElementById('reset')
      .addEventListener('click', this._resetDay.bind(this));

    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
  }
  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    if (name.value === '' || calories.value === '') {
      alert('Please fill in all fields');
      return;
    }
    if (type == 'meal') {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = '';
    calories.value = '';

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, { toggle: true });
  }
  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are your sure?')) {
        console.log('delete');
        const id = e.target.closest('.card').getAttribute('data-id');
        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);
        e.target.closest('.card').remove();
      }
    }
  }
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLocaleLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  _resetDay(e) {
    this._tracker.reset();
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }
  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById('limit');
    if (limit === '') {
      alert('Please add limit calories!');
      return;
    }
    this._tracker.setLimit(+limit.value);
    limit.value = '';

    const modalEle = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEle);
    modal.hide();
  }
}
const app = new App();
