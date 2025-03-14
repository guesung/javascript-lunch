import { html } from '../lib/utils';
import Component from '../core/Component';
import { HTMLType, RestaurantType } from '../lib/types';
import RestaurantItem from './RestaurantItem';

interface RestaurantListProps {
  restaurants: RestaurantType[];
  setCurrentRestaurant: (restaurantId: string) => void;
  onRestaurantLike: (restaurantId: string) => void;
  onModalClose: () => void;
}

export default class RestaurantList extends Component<null, RestaurantListProps> {
  template(): HTMLType {
    return html`<ul class="restaurant-list"></ul>`;
  }

  attachEventListener() {
    this.props?.restaurants.forEach((restaurant) => {
      this.appendChild(
        new RestaurantItem({
          ...restaurant,
          onModalClose: this.props!.onModalClose,
          setCurrentRestaurant: this.props!.setCurrentRestaurant,
          onRestaurantLike: this.props!.onRestaurantLike,
        }).render(),
        '.restaurant-list',
      );
    });
  }
}
