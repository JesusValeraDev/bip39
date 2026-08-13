import { execSync } from 'child_process';

/**
 * The offline download is a build artifact, and one spec loads it directly to
 * check it stands on its own. Built here, once, rather than per worker: several
 * builds at a time would overwrite dist/ underneath each other.
 */
export default function globalSetup(): void {
  execSync('npm run build', { stdio: 'inherit' });
}
