import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Rules from './Rules';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock('../Toolbar/Toolbar', () => ({
  default: vi.fn(() => <div id="Portal" />),
}));
vi.mock('../Toolbar/More', () => ({
  default: vi.fn(() => <div className="More" />),
}));

describe('Rules', () => {
  it('renders rules object control', () => {
    const store = mockStore({
      rules: {
        add: {
          loaded: false,
          loading: false,
          error: null,
        },
        enable: {
          loaded: false,
          loading: false,
          error: null,
        },
        disable: {
          loaded: false,
          loading: false,
          error: null,
        },
        apply: {
          loaded: false,
          loading: false,
          error: null,
        },
        unapply: {
          loaded: false,
          loading: false,
          error: null,
        },
        remove: {
          loaded: false,
          loading: false,
          error: null,
        },
        get: {
          loaded: false,
          loading: false,
          error: null,
        },
        rules: [],
      },
      content: {
        data: {
          title: 'Blog',
        },
      },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const { container } = render(
      <Provider store={store}>
        <Rules location={{ pathname: '/blog/rules' }} />
        <div id="toolbar"></div>
      </Provider>,
    );

    expect(container).toMatchSnapshot();
  });
});
