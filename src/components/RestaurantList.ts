import { html } from '../lib/utils';
import Component from '../core/Component';
import { HTMLType, RestaurantType } from '../lib/types';
import RestaurantItem from './RestaurantItem';

interface RestaurantListProps {
  restaurants: RestaurantType[];
  setCurrentRestaurant: (restaurantId: string) => void;
}

export default class RestaurantList extends Component<null, RestaurantListProps> {
  template(): HTMLType {
    return html`<ul class="restaurant-list"></ul>`;
  }

  attachEventListener() {
    this.props?.restaurants.forEach((restaurant) => {
      this.appendChild(
        new RestaurantItem({ ...restaurant, setCurrentRestaurant: this.props!.setCurrentRestaurant }).render(),
        '.restaurant-list',
      );
    });
  }
}
