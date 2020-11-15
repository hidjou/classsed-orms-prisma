import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response } from 'express'

import { body, validationResult } from 'express-validator'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

const userValidationRules = [
  body('email')
    .isLength({ min: 1 })
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('name').isLength({ min: 1 }).withMessage('Name must not be empty'),
  body('role')
    .isIn(['ADMIN', 'USER', 'SUPERADMIN', undefined])
    .withMessage(`Role must be one of 'ADMIN', 'USER', 'SUPERADMIN'`),
]

const simpleVadationResult = validationResult.withDefaults({
  formatter: (err) => err.msg,
})

const checkForErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = simpleVadationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped())
  }
  next()
}

// Create
app.post('/users', userValidationRules, checkForErrors, async (req: Request, res: Response) => {
  const { name, email, role } = req.body
  try {
    const existingUser = await prisma.user.findOne({ where: { email } })
    if (existingUser) throw { email: 'Email already exists' }
    const user = await prisma.user.create({
      data: { name, email, role },
    })

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
})
// Read
app.get('/users', async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        uuid: true,
        name: true,
        role: true,
        posts: {
          select: {
            body: true,
            title: true,
          },
        },
      },
    })

    return res.json(users)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})
// Update
app.put(
  '/users/:uuid',
  userValidationRules,
  checkForErrors,
  async (req: Request, res: Response) => {
    const { name, email, role } = req.body
    const uuid = req.params.uuid
    try {
      let user = await prisma.user.findOne({ where: { uuid } })
      console.log(user)
      if (!user) throw { user: 'User not found' }

      user = await prisma.user.update({
        where: { uuid },
        data: { name, email, role },
      })

      return res.json(user)
    } catch (err) {
      console.log(err)
      return res.status(404).json(err)
    }
  }
)
// Delete
app.delete('/users/:uuid', async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { uuid: req.params.uuid } })

    return res.json({ message: 'User deleted' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})
// Find
app.get('/users/:uuid', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findOne({ where: { uuid: req.params.uuid } })

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ user: 'User not found' })
  }
})

const postValidationRules = [
  body('title').isLength({ min: 1 }).withMessage('Title must not be empty'),
]

// Create a post
app.post('/posts', postValidationRules, checkForErrors, async (req: Request, res: Response) => {
  const { title, body, userUuid } = req.body
  try {
    const post = await prisma.post.create({
      data: { title, body, user: { connect: { uuid: userUuid } } },
    })

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})
// Read all posts
app.get('/posts', async (_: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    })

    return res.json(posts)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.listen(5000, () => console.log('Server running at http://localhost:5000'))
