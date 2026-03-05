const fs = require('fs');
const path = require('path');

const collectionPath = 'postman/collections/IT Management API';

// Standard test script for GET requests
const getTestScript = `scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      pm.test("Status code is not 500", function () {
          pm.response.to.not.have.status(500);
      });

      pm.test("Response is valid JSON", function () {
          pm.response.to.be.json;
      });

      pm.test("Status code is success", function () {
          pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
      });
`;

// Standard test script for POST/PUT/PATCH requests
const postTestScript = `scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      pm.test("Status code is not 500", function () {
          pm.response.to.not.have.status(500);
      });

      pm.test("Response is valid JSON", function () {
          pm.response.to.be.json;
      });

      pm.test("Status code is success", function () {
          pm.expect(pm.response.code).to.be.oneOf([200, 201]);
      });
`;

// Files that need tests added (don't have scripts section)
const filesToAddTests = [
  { file: 'Auth/Login.request.yaml', type: 'post' },
  { file: 'Auth/Register User.request.yaml', type: 'post' },
  { file: 'Auth/Get Profile.request.yaml', type: 'get' },
  { file: 'Users/Change User Role.request.yaml', type: 'patch' },
  { file: 'Customers/Create Customer.request.yaml', type: 'post' },
  { file: 'Customers/Get All Customers.request.yaml', type: 'get' },
  { file: 'Branches/Create Branch.request.yaml', type: 'post' },
  { file: 'Branches/Get All Branches.request.yaml', type: 'get' },
  { file: 'Devices/Create Device.request.yaml', type: 'post' },
  { file: 'Devices/Get All Devices.request.yaml', type: 'get' },
  { file: 'Dashboard/Super Admin Dashboard.request.yaml', type: 'get' },
  { file: 'Dashboard/Admin Dashboard.request.yaml', type: 'get' },
  { file: 'Dashboard/Engineer Dashboard.request.yaml', type: 'get' },
];

// Add tests to existing files
let updatedCount = 0;
for (const item of filesToAddTests) {
  const filePath = path.join(collectionPath, item.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('scripts:')) {
      const testScript = item.type === 'get' ? getTestScript : postTestScript;
      content = content.trimEnd() + '\n' + testScript;
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${item.file}`);
      updatedCount++;
    } else {
      console.log(`Skipped (already has tests): ${item.file}`);
    }
  } else {
    console.log(`Not found: ${item.file}`);
  }
}

// Create Reports folder and requests
const reportsFolder = path.join(collectionPath, 'Reports');
if (!fs.existsSync(reportsFolder)) {
  fs.mkdirSync(reportsFolder, { recursive: true });
  console.log('Created folder: Reports');
}

// Reports requests to create
const reportsRequests = [
  {
    filename: 'Engineer Performance Report.request.yaml',
    content: `$kind: http-request
name: Engineer Performance Report
method: GET
url: '{{baseUrl}}/reports/engineer-performance'
order: 1000
description: |-
  Get engineer performance report with statistics.
  Returns performance metrics for all engineers.
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      pm.test("Status code is not 500", function () {
          pm.response.to.not.have.status(500);
      });

      pm.test("Response is valid JSON", function () {
          pm.response.to.be.json;
      });

      pm.test("Status code is success", function () {
          pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
      });
`
  },
  {
    filename: 'Device History.request.yaml',
    content: `$kind: http-request
name: Device History
method: GET
url: '{{baseUrl}}/reports/device-history/:id'
order: 2000
description: |-
  Get service call history for a specific device.
  Returns all service calls associated with the device.
pathVariables:
  - key: id
    value: '1'
    description: Device ID
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      pm.test("Status code is not 500", function () {
          pm.response.to.not.have.status(500);
      });

      pm.test("Response is valid JSON", function () {
          pm.response.to.be.json;
      });

      pm.test("Status code is success", function () {
          pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
      });
`
  },
  {
    filename: 'Branch Report.request.yaml',
    content: `$kind: http-request
name: Branch Report
method: GET
url: '{{baseUrl}}/reports/branch-report'
order: 3000
description: |-
  Get branch-level report with statistics.
  Returns aggregated data for all branches.
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      pm.test("Status code is not 500", function () {
          pm.response.to.not.have.status(500);
      });

      pm.test("Response is valid JSON", function () {
          pm.response.to.be.json;
      });

      pm.test("Status code is success", function () {
          pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
      });
`
  },
  {
    filename: 'Export Engineer Excel.request.yaml',
    content: `$kind: http-request
name: Export Engineer Excel
method: GET
url: '{{baseUrl}}/reports/engineer-excel'
order: 4000
description: |-
  Export engineer performance report as Excel file.
  Returns an .xlsx file download.
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      pm.test("Status code is not 500", function () {
          pm.response.to.not.have.status(500);
      });

      pm.test("Status code is success", function () {
          pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
      });
`
  }
];

let createdCount = 0;
for (const req of reportsRequests) {
  const filePath = path.join(reportsFolder, req.filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, req.content);
    console.log(`Created: Reports/${req.filename}`);
    createdCount++;
  } else {
    console.log(`Skipped (already exists): Reports/${req.filename}`);
  }
}

// Remove duplicate folders
const duplicateFolders = [
  'Service-calls',
  'Woek-updates'
];

let removedCount = 0;
for (const folder of duplicateFolders) {
  const folderPath = path.join(collectionPath, folder);
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true });
    console.log(`Removed duplicate folder: ${folder}`);
    removedCount++;
  }
}

console.log('\n=== Summary ===');
console.log(`Updated with tests: ${updatedCount} files`);
console.log(`Created new requests: ${createdCount} files`);
console.log(`Removed duplicate folders: ${removedCount}`);
