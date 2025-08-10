// Validate public/content/tracks.v1.json against tools/tracks.schema.json (ESM)
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const contentPath = path.join(process.cwd(), 'public', 'content', 'tracks.v1.json');
const schemaPath = path.join(process.cwd(), 'tools', 'tracks.schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);
const ok = validate(data);
if (!ok) {
  console.error('❌ Content validation failed:');
  console.error(validate.errors);
  process.exit(1);
} else {
  console.log('✅ Content JSON is valid.');
}
