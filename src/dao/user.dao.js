import knexClient from '../database/knexClient.js';

const USER_TABLE = 'user';

class UserDAO {
  create(user) {
    return knexClient(USER_TABLE).insert({ name: user.username, password: user.password });
  }

  findByName(username) {
    return knexClient(USER_TABLE).where({ name: username }).first();
  }

  getUserInfo(userId) {
    return knexClient.raw(
      `
        SELECT 
          user.id, 
          user.name, 
          user.createAt,
          JSON_ARRAYAGG(JSON_OBJECT('roleId', roles.id, 'roleName', roles.role_name)) AS roles
        FROM 
          user
        LEFT JOIN 
          user_roles ON user.id = user_roles.user_id
        LEFT JOIN 
          roles ON user_roles.role_id = roles.id
        WHERE 
          user.id = ?
        GROUP BY 
          user.id;
      `,
      [userId]
    );
  }

  getUserMenu(roleId) {
    return knexClient.raw(
      `
        SELECT 
          menu.id, 
          menu.type, 
          menu.url, 
          menu.icon, 
          menu.parent_id,
          menu.name
        FROM 
          menu
        LEFT JOIN 
          role_menu ON menu.id = role_menu.menu_id
        LEFT JOIN 
          roles ON role_menu.role_id = roles.id
        WHERE 
          roles.id = ?;
      `,
      [roleId]
    );
  }
}

export default new UserDAO();


