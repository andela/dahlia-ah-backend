import { assert } from 'chai';
import userServices from '../src/services/userService';

const superAdminRoleId = '2c4dfb3f-1798-43d4-8eb6-1c125994a263';

const { addUser, findUserRole } = userServices;

describe('findUserRole service function', () => {
  it('should find a user role by id', async () => {
    const role = await findUserRole(superAdminRoleId);
    assert.typeOf(role, 'object');
    assert.equal(role.roleName, 'superadmin');
  });
  it('should find a user role by role name', async () => {
    const role = await findUserRole('superadmin');
    assert.typeOf(role, 'object');
    assert.equal(role.id, superAdminRoleId);
  });
});

describe('createNewUser service function', () => {
  const userObject = {
    firstName: 'Maul',
    lastName: 'Maul',
    email: 'maul@empire.com'
  };

  it('should creat a new user', async () => {
    const createdUser = await addUser(userObject);
    assert.typeOf(createdUser, 'object');
    assert.equal(createdUser.firstName, userObject.firstName);
    assert.equal(createdUser.lastName, userObject.lastName);
  });
});
