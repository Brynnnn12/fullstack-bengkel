import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Bengkel Management System API',
    version: '1.0.0',
    description: 'Complete API for Bengkel Management System - managing customers, vehicles, service logs, inventory, and authentication.',
    contact: {
      name: 'API Support',
      email: 'support@bengkel.com'
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication endpoints'
    },
    {
      name: 'Customers',
      description: 'Customer management'
    },
    {
      name: 'Vehicles',
      description: 'Vehicle management'
    },
    {
      name: 'Service Logs',
      description: 'Service log management'
    },
    {
      name: 'Service Items',
      description: 'Service item management'
    },
    {
      name: 'Inventory',
      description: 'Inventory management'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Customer: {
        type: 'object',
        required: ['name', 'phoneNumber'],
        properties: {
          id: {
            type: 'string',
            example: 'clh1x8z9w0000abcdefghijk'
          },
          name: {
            type: 'string',
            example: 'Ahmad Surya'
          },
          phoneNumber: {
            type: 'string',
            example: '081234567890'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Vehicle: {
        type: 'object',
        required: ['registrationPlate', 'make', 'model', 'customerId'],
        properties: {
          id: {
            type: 'string'
          },
          registrationPlate: {
            type: 'string',
            example: 'B 4321 XYZ'
          },
          make: {
            type: 'string',
            example: 'Honda'
          },
          model: {
            type: 'string',
            example: 'Civic'
          },
          customerId: {
            type: 'string'
          },
          customer: {
            $ref: '#/components/schemas/Customer'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      InventoryItem: {
        type: 'object',
        required: ['name', 'sku', 'stock', 'sellingPrice'],
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string',
            example: 'Spark Plug Set'
          },
          sku: {
            type: 'string',
            example: 'SP-SET-4'
          },
          stock: {
            type: 'integer',
            example: 25
          },
          sellingPrice: {
            type: 'number',
            example: 120000
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      ServiceItem: {
        type: 'object',
        required: ['description', 'quantity', 'price', 'inventoryItemId'],
        properties: {
          id: {
            type: 'string'
          },
          description: {
            type: 'string',
            example: 'Engine Oil Change'
          },
          quantity: {
            type: 'integer',
            example: 1
          },
          price: {
            type: 'number',
            example: 150000
          },
          inventoryItemId: {
            type: 'string'
          },
          inventoryItem: {
            $ref: '#/components/schemas/InventoryItem'
          },
          serviceLogId: {
            type: 'string'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      ServiceLog: {
        type: 'object',
        required: ['date', 'totalCost', 'vehicleId'],
        properties: {
          id: {
            type: 'string'
          },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-22T10:00:00Z'
          },
          totalCost: {
            type: 'number',
            example: 250000
          },
          notes: {
            type: 'string',
            example: 'Full service maintenance'
          },
          vehicleId: {
            type: 'string'
          },
          vehicle: {
            $ref: '#/components/schemas/Vehicle'
          },
          serviceItems: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ServiceItem'
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            example: 1
          },
          limit: {
            type: 'integer',
            example: 10
          },
          total: {
            type: 'integer',
            example: 100
          },
          totalPages: {
            type: 'integer',
            example: 10
          }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          message: {
            type: 'string'
          },
          data: {
            type: 'object'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Swagger options
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/app/controllers/*.ts'], // Paths to files containing OpenAPI definitions
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;