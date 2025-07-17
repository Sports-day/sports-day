import type { CodegenConfig } from "@graphql-codegen/cli";
import { fileURLToPath } from "node:url";
import path from "node:path";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const config: CodegenConfig = {
  overwrite: true,
  schema: path.join(dirname, "*.graphqls"),
  documents: path.join(dirname, "./src/**/*.{ts,tsx}"),
  generates: {
    "./src/gql/__generated__/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};

export default config;
