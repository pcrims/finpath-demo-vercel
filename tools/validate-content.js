// Validate public/content/tracks.v1.json against tools/tracks.schema.json
// usage: node tools/validate-content.js
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const contentPath = path.join(__dirname, '..', 'public', 'content', 'tracks.v1.json');
const schemaPath = path.join(__dirname, 'tracks.schema.json');
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
