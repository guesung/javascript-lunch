import Component from '../core/Component.ts';
import { html } from '../lib/utils.ts';
import RestaurantAddModal from './RestaurantAddModal.ts';
import type { RestaurantType } from '../lib/types.ts';

interface RestaurantHeaderProps {
  title: string;
  alt: string;
  addRestaurant: (restaurant: RestaurantType) => void;
}

interface RestaurantHeaderState {
  isRestaurantAddModalOpen: boolean;
}

export default class RestaurantHeader extends Component<RestaurantHeaderState, RestaurantHeaderProps> {
  constructor(props?: RestaurantHeaderProps) {
    super(props);

    this.state = {
      isRestaurantAddModalOpen: false,
    };
  }

  template() {
    return html`
      <header class="gnb">
        <h1 class="gnb__title text-title">${this.props?.title ?? ''}</h1>
        <button type="button" class="gnb__button" aria-label="${this.props?.alt ?? ''}">
          <img src="images/add-button.png" alt="${this.props?.alt ?? ''}" />
        </button>
      </header>
    `;
  }

  attachEventListener() {
    this.element?.addEventListener('click', (event) => {
      event.stopPropagation();
      const target = event.target as HTMLElement;

      if (target.closest('.gnb__button')) {
        this.setState({
          isRestaurantAddModalOpen: true,
        });
      }
    });
  }

  onRender() {
    this.#appendRestaurantAddModal();
  }

  #appendRestaurantAddModal() {
    const restaurantAddModal = new RestaurantAddModal({
      addRestaurant: this.props!.addRestaurant.bind(this),
      onModalClose: () => {
        this.setState({
          isRestaurantAddModalOpen: false,
        });
      },
    });
    if (!this.state.isRestaurantAddModalOpen) return;

    document.body.appendChild(restaurantAddModal.render());
  }
}
