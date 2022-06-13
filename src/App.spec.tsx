import { render, screen } from '@testing-library/react';
import App from './App';
import { ApplicationStoreContext } from './app.store';

describe('App', () => {
  it('should work as expected', () => {
    const component = render(
      <ApplicationStoreContext.Provider value={jest.fn() as any}>
        <App />
      </ApplicationStoreContext.Provider>
    );
    expect(component).toBeDefined();
  });
});
