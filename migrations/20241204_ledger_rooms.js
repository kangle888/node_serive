export const up = async (knex) => {
  const hasRooms = await knex.schema.hasTable('rooms');
  if (!hasRooms) {
    await knex.schema.createTable('rooms', (table) => {
      table.string('id', 36).primary();
      table.string('name', 100).notNullable();
      table.string('invite_code', 16).notNullable().unique();
      table.bigInteger('creator_id').unsigned().notNullable();
      table.integer('status').unsigned().notNullable().defaultTo(1);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.index('creator_id', 'idx_rooms_creator');
    });
  }

  const hasRoomMembers = await knex.schema.hasTable('room_members');
  if (!hasRoomMembers) {
    await knex.schema.createTable('room_members', (table) => {
      table.string('id', 36).primary();
      table.string('room_id', 36).notNullable();
      table.bigInteger('user_id').unsigned().notNullable();
      table.decimal('balance', 12, 2).notNullable().defaultTo(0);
      table.timestamp('joined_at').defaultTo(knex.fn.now());
      table.unique(['room_id', 'user_id']);
      table.index('user_id', 'idx_room_members_user');
    });
  }

  const hasTransactions = await knex.schema.hasTable('room_transactions');
  if (!hasTransactions) {
    await knex.schema.createTable('room_transactions', (table) => {
      table.string('id', 36).primary();
      table.string('room_id', 36).notNullable();
      table.string('from_member_id', 36).notNullable();
      table.string('to_member_id', 36).notNullable();
      table.decimal('amount', 12, 2).notNullable();
      table.string('remark', 255).defaultTo('');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.index('room_id', 'idx_room_transactions_room');
    });
  }
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('room_transactions');
  await knex.schema.dropTableIfExists('room_members');
  await knex.schema.dropTableIfExists('rooms');
};

