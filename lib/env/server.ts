import "server-only";

import { parseServerEnv } from "./schema";

/** Variables solo de servidor. Importar esto desde un componente de cliente rompe la compilación. */
export const serverEnv = parseServerEnv(process.env);
