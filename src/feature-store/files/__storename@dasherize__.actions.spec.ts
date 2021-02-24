import { <%= classify(storename) %>ActionTypes, initialiseModule, initialiseModuleSucceeded } from './<%= dasherize(storename) %>.actions';

describe('<%= classify(storename) %>Actions', () => {
  let action: any;

  it('should define enum with correct set of actions', () => {
    expect(<%= classify(storename) %>ActionTypes.InitialiseModule).toBe('[<%= classify(feature) %>] Initialise module');
    expect(<%= classify(storename) %>ActionTypes.InitialiseModuleSucceeded).toBe('[<%= classify(feature) %>] Initialise module succeeded');
  });

  describe('initialiseModule', () => {
    beforeEach(() => {
      action = initialiseModule();
    });

    it('should be defined', () => {
      expect(action).toBeDefined();
    });

    it('should have correct type', () => {
      expect(action.type).toEqual(<%= classify(storename) %>ActionTypes.InitialiseModule);
    });
  });

  describe('initialiseModuleSucceeded', () => {
    beforeEach(() => {
      action = initialiseModuleSucceeded();
    });

    it('should be defined', () => {
      expect(action).toBeDefined();
    });

    it('should have correct type', () => {
      expect(action.type).toEqual(<%= classify(storename) %>ActionTypes.InitialiseModuleSucceeded);
    });
  });
});
