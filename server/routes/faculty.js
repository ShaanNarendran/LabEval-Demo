const express = require("express");
const router = express.Router();
const { body, param } = require('express-validator');
const multer = require("multer");
const facultyController = require('../controllers/facultyController');

const upload = multer({ storage: multer.memoryStorage() });

const questionValidationRules = [
  body('title').not().isEmpty().withMessage('Title is required.').trim().escape(),
  body('description').not().isEmpty().withMessage('Description is required.').trim().escape(),
  body('functionSignature').optional().trim().escape(),
  body('precode').optional().trim().escape(),
  body('languages').isArray({ min: 1 }).withMessage('At least one language must be specified.'),
  body('testCases').isArray({ min: 1 }).withMessage('At least one test case is required.'),
  body('testCases.*.input').exists({ checkFalsy: false }).withMessage('Test case input is required.').trim().escape(),
  body('testCases.*.expected').exists({ checkFalsy: false }).withMessage('Test case output is required.').trim().escape()
];

const mongoIdValidationRule = [
  param('id').isMongoId().withMessage('Invalid question ID format.')
];

// Defines routes for faculty actions
router.get("/questions", facultyController.getAllQuestions);
router.post("/questions", questionValidationRules, facultyController.createQuestion);
router.post("/bulk", upload.single("file"), facultyController.bulkUploadQuestions);
router.delete("/questions/:id", mongoIdValidationRule, facultyController.deleteQuestion);

module.exports = router;