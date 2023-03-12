/* eslint-disable @typescript-eslint/no-var-requires */
const { DataSource } = require('typeorm');
const { options } = require('./dist/src/common/modules/database.module');
exports.AppDataSource = new DataSource(options);
