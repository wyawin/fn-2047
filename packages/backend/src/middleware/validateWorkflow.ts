import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const tableColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['string', 'number', 'boolean']),
  description: z.string().optional(),
});

const variableSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    type: z.enum(['string', 'number', 'boolean']),
    value: z.any().optional(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    type: z.literal('calculated'),
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    sourceVariables: z.tuple([
      z.object({
        type: z.enum(['variable', 'manual']),
        value: z.string(),
      }),
      z.object({
        type: z.enum(['variable', 'manual']),
        value: z.string(),
      }),
    ]),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    type: z.literal('table'),
    columns: z.array(tableColumnSchema),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    type: z.literal('table-operation'),
    tableVariableId: z.string(),
    columnId: z.string(),
    operation: z.enum(['sum', 'average', 'min', 'max', 'median']),
  }),
]);

const nodeDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  config: z.record(z.any()),
  variables: z.array(variableSchema).optional(),
});

const nodeSchema = z.object({
  id: z.string(),
  type: z.enum(['trigger', 'condition', 'action', 'credit-score', 'credit-score-check']),
  position: positionSchema,
  data: nodeDataSchema,
});

const connectionSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.enum(['default', 'true', 'false']),
});

const workflowSchema = z.object({
  name: z.string().min(1),
  nodes: z.array(nodeSchema),
  connections: z.array(connectionSchema),
});

export const validateWorkflow = (req: Request, res: Response, next: NextFunction) => {
  try {
    workflowSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation Error',
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
};