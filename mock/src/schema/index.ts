import { readFileSync } from "fs";
import { join } from "path";
import { gql } from "graphql-tag";

const schema = readFileSync(join(__dirname, "schema.graphqls"), "utf-8");

// Combine all schemas
export const typeDefs = gql`
  ${schema}
`;
