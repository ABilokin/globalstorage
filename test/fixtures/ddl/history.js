'use strict';

module.exports = ({ History: history }) => ({
  name: 'generateDDL with History',
  schemas: {
    Identifier: {
      field: { domain: 'Nomen' },
    },
    Schema: history({
      field: { domain: 'Nomen' },
    }),
  },
  expectedSql: `
-- Category: Identifier --------------------------------------------------------

CREATE TABLE "Identifier" (
  "Id"    bigserial,
  "field" text
);

ALTER TABLE "Identifier" ADD CONSTRAINT "pkIdentifierId" PRIMARY KEY ("Id");

-- Category: Schema ------------------------------------------------------------

CREATE TABLE "Schema" (
  "Id"    bigint,
  "field" text
);

ALTER TABLE "Schema" ADD CONSTRAINT "pkSchemaId" PRIMARY KEY ("Id");

-- Category: SchemaHistory -----------------------------------------------------

CREATE TABLE "SchemaHistory" (
  "Id"             bigserial,
  "field"          text,
  "_Creation"      timestamp with time zone NOT NULL,
  "_Effective"     timestamp with time zone NOT NULL,
  "_Cancel"        timestamp with time zone,
  "_HistoryStatus" undefined NOT NULL,
  "_Identifier"    bigint NOT NULL
);

CREATE INDEX "idxSchemaHistory_Creation" on "SchemaHistory" ("_Creation");
CREATE INDEX "idxSchemaHistory_Effective" on "SchemaHistory" ("_Effective");
CREATE INDEX "idxSchemaHistory_Cancel" on "SchemaHistory" ("_Cancel");
CREATE INDEX "idxSchemaHistory_Identifier" on "SchemaHistory" ("_Identifier");

ALTER TABLE "SchemaHistory" ADD CONSTRAINT "pkSchemaHistoryId" \
PRIMARY KEY ("Id");

ALTER TABLE "SchemaHistory" ADD CONSTRAINT "fkSchemaHistory_Identifier" \
FOREIGN KEY ("_Identifier") REFERENCES "Identifier" ("Id") \
ON UPDATE RESTRICT ON DELETE RESTRICT;`,
});
