import type { Express } from 'express';
import type { OpenAPIV3 } from 'openapi-types';
import { apiReference } from '@scalar/express-api-reference';

import swaggerJSDoc from 'swagger-jsdoc';
import { baseOpenapiSpec } from './openApiSpec.js';

const setupScalar = (app: Express) => {
  const openapiSpec: OpenAPIV3.Document = swaggerJSDoc(baseOpenapiSpec) as OpenAPIV3.Document;

  app.get('/docs.json', (_req, res) => res.json(openapiSpec));

  app.use(
    '/docs',
    apiReference({
      content: openapiSpec,
      layout: 'classic',
      theme: 'deepSpace',
    })
  );
};

export default setupScalar;
