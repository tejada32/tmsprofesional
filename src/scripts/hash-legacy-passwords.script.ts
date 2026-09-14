// src/scripts/hash-legacy-passwords.script.ts
//
// Migración única: recorre la tabla `users` y hashea con bcrypt cualquier
// `passwordHash` que todavía esté guardado en texto plano.
//
// CÓRRELO UNA SOLA VEZ, ANTES de desplegar el cambio que quita la
// comparación en texto plano de AuthService. Es seguro correrlo más de
// una vez: los hashes bcrypt (empiezan con $2a$, $2b$ o $2y$) se detectan
// y se saltan.
//
// Uso:
//   npm run migrate:hash-passwords
//
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

const SALT_ROUNDS = 10;
const BCRYPT_PREFIX_REGEX = /^\$2[aby]\$/;

async function run() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
  });

  await dataSource.initialize();
  console.log('Conectado a la base de datos.');

  // select() explícito porque passwordHash tiene select:false en la entidad.
  const users = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .addSelect('user.passwordHash')
    .getMany();

  console.log(`Usuarios encontrados: ${users.length}`);

  let migrated = 0;
  let alreadyHashed = 0;
  let skippedEmpty = 0;

  for (const user of users) {
    if (!user.passwordHash) {
      skippedEmpty++;
      console.warn(`  ⚠️  Usuario ${user.email} no tiene passwordHash, se omite.`);
      continue;
    }

    if (BCRYPT_PREFIX_REGEX.test(user.passwordHash)) {
      alreadyHashed++;
      continue;
    }

    const newHash = await bcrypt.hash(user.passwordHash, SALT_ROUNDS);
    await dataSource
      .getRepository(User)
      .update({ id: user.id }, { passwordHash: newHash });

    migrated++;
    console.log(`  ✅ Migrado: ${user.email}`);
  }

  console.log('---');
  console.log(`Migrados ahora:      ${migrated}`);
  console.log(`Ya estaban hasheados: ${alreadyHashed}`);
  console.log(`Sin passwordHash:     ${skippedEmpty}`);

  await dataSource.destroy();
}

run()
  .then(() => {
    console.log('Migración completada.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error en la migración:', err);
    process.exit(1);
  });
