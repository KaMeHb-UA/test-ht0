import { resolve } from 'node:path';
import { cwd, argv } from 'node:process';

export default resolve(cwd(), argv[1], '..');
