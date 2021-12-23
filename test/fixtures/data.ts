import { RoleCode } from '../src/entities/roles'
const data = {
  Role: [
    {
      id: 'test-role',
      name: 'test-role',
      code: RoleCode.user,
    },
  ],
  User: [
    {
      id: 'test-user',
      email: 'test-email',
      roleId: 'test-role',
      meta: {
        field1: 1,
        field2: 2,
      },
    },
  ],
  Place: [{
    id: 'test-place',
    point: { type: 'Point', coordinates: [1, 2] }
  }],
};

export default data;
