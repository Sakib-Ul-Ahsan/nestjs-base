import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';

export async function runSeeders(app) {
  await app.get(PermissionSeeder).seed();
  await app.get(RoleSeeder).seed();
}
