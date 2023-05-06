const express = require('express');
const router = express.Router();
const dbUsers = require('../controllers/users');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/', dbUsers.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', dbUsers.getUserById);
router.post('/', dbUsers.createUser);
router.put('/:id', dbUsers.updateUser);
router.delete('/:id', dbUsers.deleteUser);


module.exports = router;
