import { RestaurantHeader, RestaurantList } from './components';
import Component from './core/Component';

export default class Application extends Component {
  onRender() {
    this.appendChild(new RestaurantList().render());
  }
}
