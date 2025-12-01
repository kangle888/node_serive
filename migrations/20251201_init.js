export const up = async (knex) => {
  const hasUser = await knex.schema.hasTable('user');
  if (!hasUser) {
    await knex.schema.createTable('user', (table) => {
      table.increments('id').primary();
      table.string('name', 50).notNullable().unique();
      table.string('password', 255).notNullable();
      table.timestamp('createAt').defaultTo(knex.fn.now());
      table.timestamp('updateAt').defaultTo(knex.fn.now());
    });
  }

  const hasHealthRecord = await knex.schema.hasTable('health_record');
  if (!hasHealthRecord) {
    await knex.schema.createTable('health_record', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('type', 50).notNullable();
      table.decimal('value', 10, 2).notNullable();
      table.string('unit', 20).defaultTo('');
      table.dateTime('record_time').notNullable();
      table.timestamp('createAt').defaultTo(knex.fn.now());
      table.timestamp('updateAt').defaultTo(knex.fn.now());
      table.index(['user_id', 'record_time']);
    });
  }
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('health_record');
  await knex.schema.dropTableIfExists('user');
};


