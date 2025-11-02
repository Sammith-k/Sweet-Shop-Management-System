import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../middleware/error';

const router = Router();

// Helpers to treat empty strings as "no value"
const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

// Create sweet (ADMIN)
const sweetCreateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative()
});

router.post(
  '/',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = sweetCreateSchema.parse(req.body);
    const created = await prisma.sweet.create({ data });
    res.status(201).json(created);
  })
);

// List sweets
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const sweets = await prisma.sweet.findMany({ orderBy: { name: 'asc' } });
    res.json(sweets);
  })
);

// Search sweets (name/category contains; optional min/max price)
router.get(
  '/search',
  asyncHandler(async (req, res) => {
    const q = z
      .object({
        name: z.preprocess(emptyToUndefined, z.string().optional()),
        category: z.preprocess(emptyToUndefined, z.string().optional()),
        minPrice: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
        maxPrice: z.preprocess(emptyToUndefined, z.coerce.number().optional())
      })
      .parse(req.query);

    const where: any = {};
    if (q.name) where.name = { contains: q.name };
    if (q.category) where.category = { contains: q.category };
    if (q.minPrice != null || q.maxPrice != null) {
      where.price = {};
      if (q.minPrice != null) where.price.gte = q.minPrice;
      if (q.maxPrice != null) where.price.lte = q.maxPrice;
    }

    const sweets = await prisma.sweet.findMany({ where, orderBy: { name: 'asc' } });
    res.json(sweets);
  })
);

// Update sweet (ADMIN)
const sweetUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().nonnegative().optional()
});

router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const data = sweetUpdateSchema.parse(req.body);

    const updated = await prisma.sweet.update({
      where: { id },
      data
    });

    res.json(updated);
  })
);

// Delete sweet (ADMIN)
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    await prisma.sweet.delete({ where: { id } });
    res.status(204).send();
  })
);

// Purchase (any authenticated user) – atomic decrement
router.post(
  '/:id/purchase',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const { quantity } = z
      .object({ quantity: z.number().int().positive() })
      .parse(req.body);

    const result = await prisma.sweet.updateMany({
      where: { id, quantity: { gte: quantity } },
      data: { quantity: { decrement: quantity } }
    });

    if (result.count === 0) {
      throw new ApiError(400, 'Insufficient stock or sweet not found');
    }

    const sweet = await prisma.sweet.findUnique({ where: { id } });
    res.json({ message: 'Purchase successful', sweet });
  })
);

// Restock (ADMIN)
router.post(
  '/:id/restock',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const { quantity } = z
      .object({ quantity: z.number().int().positive() })
      .parse(req.body);

    const sweet = await prisma.sweet.update({
      where: { id },
      data: { quantity: { increment: quantity } }
    });

    res.json({ message: 'Restocked', sweet });
  })
);

export const sweetsRouter = router;