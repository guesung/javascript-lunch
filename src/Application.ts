import Component from './core/Component.ts';
import { FILTERS, LOCAL_STORAGE_KEY_MAP, SORTS } from './lib/constants.ts';
import type { FilterType, RestaurantType, SortType, TabType } from './lib/types.ts';
import { Select } from './components/common/index.ts';
import {
  RestaurantItem,
  RestaurantDetailModal,
  RestaurantTab,
  RestaurantHeader,
  RestaurantList,
} from './components/index.ts';
import { DEFAULT_RESTAURANT_LIST } from './lib/constants.ts';
import { html } from './lib/utils.ts';

interface RestaurantListState {
  restaurants: RestaurantType[];
  tab: TabType;
  filter: FilterType;
  sort: SortType;
  currentRestaurant: RestaurantType | null;
}

export default class Application extends Component<RestaurantListState> {
  constructor() {
    super();

    const localStorageRestaurants = localStorage.getItem(LOCAL_STORAGE_KEY_MAP.restaurants);
    const initialRestaurants = localStorageRestaurants ? JSON.parse(localStorageRestaurants) : DEFAULT_RESTAURANT_LIST;

    this.state = {
      restaurants: initialRestaurants,
      tab: 'all',
      filter: '전체',
      sort: '이름순',
      currentRestaurant: null,
    };
  }

  template() {
    return html`
      <header></header>
      <section class="restaurant-tab"></section>
      <section class="restaurant-filter-sort"></section>
      <section class="restaurant-list-container"></section>
      <section class="restaurant-add-modal"></section>
      <section class="restaurant-detail-modal"></section>
    `;
  }

  /**
   * 자식 컴포넌트 렌더링
   */

  onRender() {
    this.#appendRestaurantHeader();
    this.#appendRestaurantTab();
    this.#appendRestaurantFilterSelectSort();
    this.#appendRestaurantList();
    this.#appendRestaurantDetailModal();
  }

  #appendRestaurantHeader() {
    this.appendChild(
      new RestaurantHeader({
        title: '오늘 뭐 먹지',
        alt: '음식점 추가',
        addRestaurant: this.#addRestaurant.bind(this),
      }).render(),
      'header',
    );
  }

  #appendRestaurantTab() {
    this.appendChild(
      new RestaurantTab({
        setTab: (tab) =>
          this.setState({
            tab,
          }),
        focusedTab: this.state.tab,
      }).render(),
      '.restaurant-tab',
    );
  }

  #appendRestaurantFilterSelectSort() {
    this.appendChild(
      new Select({
        options: FILTERS,
        setValue: (filter) =>
          this.setState({
            filter: filter as FilterType,
          }),
        selected: this.state.filter,
      }).render(),
      '.restaurant-filter-sort',
    );
    this.appendChild(
      new Select({
        options: SORTS,
        setValue: (sort) =>
          this.setState({
            sort: sort as SortType,
          }),
        selected: this.state.sort,
      }).render(),
      '.restaurant-filter-sort',
    );
  }

  #appendRestaurantList() {
    const filteredRestaurants = [...this.state.restaurants]
      .filter((restaurant) => this.state.tab === 'all' || restaurant.isLike)
      .filter((restaurant) => this.state.filter === '전체' || restaurant.category === this.state.filter)
      .sort((a, b) =>
        this.state.sort === '이름순' ? (a.name < b.name ? -1 : a.name > b.name ? 1 : 0) : a.distance - b.distance,
      );

    this.appendChild(
      new RestaurantList({
        restaurants: filteredRestaurants,
        setCurrentRestaurant: this.#setCurrentRestaurant.bind(this),
      }).render(),
      '.restaurant-list-container',
    );
  }

  #appendRestaurantDetailModal() {
    const restaurantDetailModal = new RestaurantDetailModal({
      currentRestaurant: this.state.currentRestaurant,
      deleteRestaurant: this.#deleteRestaurant.bind(this),
    });

    if (!this.state.currentRestaurant) return;
    this.appendChild(restaurantDetailModal.render(), '.restaurant-detail-modal');
  }

  #addRestaurant(restaurant: RestaurantType) {
    this.setState({
      restaurants: [...this.state.restaurants, restaurant],
    });

    localStorage.setItem(LOCAL_STORAGE_KEY_MAP.restaurants, JSON.stringify(this.state.restaurants));
  }

  /**
   * 이벤트 리스너
   */

  attachEventListener() {
    this.element.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!event.target) return;

      const target = event.target as HTMLElement;

      if (target.closest('#like__button') && target.dataset.id) {
        this.#toggleLike(target.dataset.id);
        return;
      }
    });
  }

  #setCurrentRestaurant(id: string) {
    this.setState({
      currentRestaurant: this.state.restaurants.find((restaurant) => restaurant.id === id),
    });
  }

  #deleteRestaurant(id: string) {
    this.setState({
      restaurants: this.state.restaurants.filter((restaurant) => restaurant.id !== id),
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_MAP.restaurants, JSON.stringify(this.state.restaurants));
  }

  #toggleLike(restaurantName: string) {
    const copiedRestaurants = [...this.state.restaurants];

    const currentRestaurantIndex = this.state.restaurants.findIndex((restaurant) => restaurant.id === restaurantName);
    const targetRestaurant = this.state.restaurants[currentRestaurantIndex];

    copiedRestaurants.splice(currentRestaurantIndex, 1, { ...targetRestaurant, isLike: !targetRestaurant.isLike });

    this.setState({
      restaurants: copiedRestaurants,
    });

    localStorage.setItem(LOCAL_STORAGE_KEY_MAP.restaurants, JSON.stringify(this.state.restaurants));
  }
}
