import { IUserDto } from './model';
import { User } from './user';

describe('user.ts', () => {
  let user: User;
  const userMoney = 100;

  beforeEach(() => {
    jest.resetAllMocks();
    user = new User('1', 'test', userMoney);
  });

  it('should retore user from localstorage', () => {
    const userObject: IUserDto = {
      id: '1',
      money: 100,
      name: 'test',
      soundDisabled: false,
    };
    const getItem = jest.spyOn(Storage.prototype, 'getItem');

    getItem.mockReturnValue(JSON.stringify(userObject));
    const restoredUser = User.restoreUser();
    expect(getItem).toHaveBeenCalled();
    expect(restoredUser).toBeDefined();
    expect(restoredUser.id).toEqual(userObject.id);
    expect(restoredUser.money).toEqual(userObject.money);
    expect(restoredUser.name).toEqual(userObject.name);
    expect(restoredUser.soundDisabled).toEqual(userObject.soundDisabled);
  });

  it('should store user to localstorage', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem');
    User.storeUser(new User('1', 'test', userMoney));
    expect(setItem).toHaveBeenCalled();
  });

  it('should clear user from localstorage', () => {
    const removeItem = jest.spyOn(Storage.prototype, 'removeItem');
    User.clearUser();
    expect(removeItem).toHaveBeenCalled();
  });

  // No test for to JSON version since it could be flaky
});
