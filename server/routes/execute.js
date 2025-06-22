const express = require('express');
const { body } = require('express-validator');
const executionController = require('../controllers/executionController');
const router = express.Router();

const { dockerConfig } = require('../util/dockerRunner');
const SUPPORTED_LANGUAGES = Object.keys(dockerConfig);

const executionValidationRules = [
    body('language').isIn(SUPPORTED_LANGUAGES).withMessage('Invalid or unsupported language.'),
    body('source_code').not().isEmpty().trim().withMessage('Source code cannot be empty.')
];

router.post('/', executionValidationRules, executionController.handleExecution);

module.exports = router;