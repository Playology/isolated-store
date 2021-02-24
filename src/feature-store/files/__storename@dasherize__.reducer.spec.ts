import { InitialiseModule } from './<%= dasherize(storename) %>.actions';
import { initial<%= classify(feature) %>State, <%= camelize(storename) %>Reducer } from './<%= dasherize(storename) %>.reducer';

describe('<%= classify(storename) %> Reducer', () => {
  it('should default to original state', () => {
    const action = {} as any;

    const result = <%= camelize(storename) %>Reducer(initial<%= classify(feature) %>State, action);

    expect(result).toBe(initial<%= classify(feature) %>State);
  });

  it('should handle initialise module succeeded', () => {
    const result = <%= camelize(storename) %>Reducer(initial<%= classify(feature) %>State, new InitialiseModule());

    expect(result.isInitialised).toBe(true);
  });
});
