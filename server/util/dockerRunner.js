const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const tempDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const config = {
    c: {
      ext: 'c',
      image: 'gcc',
      command: (file) => `gcc ${file} -o ${file}.out && ./${file}.out`
    },
    cpp: {
      ext: 'cpp',
      image: 'gcc',
      command: (file) => `g++ ${file} -o ${file}.out && ./${file}.out`
    },
    python: {
      ext: 'py',
      image: 'python:3.10',
      command: (file) => `python ${file}`
    },
    java: {
      ext: 'java',
      image: 'openjdk:17-slim',
      command: (file) => `javac ${file} && java Main`
    }
};

function runCodeInDocker(language, code) {
  return new Promise((resolve, reject) => {
    const lang = config[language];
    if (!lang) {
      return reject(new Error('Unsupported language'));
    }
    const id = uuidv4();
    const filename = language === 'java' ? 'Main.java' : `${id}.${lang.ext}`;
    const filepath = path.join(tempDir, filename);
    fs.writeFileSync(filepath, code);
    const workDir = '/app';
    const dockerCommand = [
        'docker', 'run', '--rm',
        '--network', 'none',
        '--memory=256m',
        '--cpus=0.5',
        `-v`, `${filepath}:${workDir}/${filename}:ro`,
        '-w', workDir,
        lang.image,
        'bash', '-c', `"${lang.command(filename)}"`
    ].join(' ');

    exec(dockerCommand, { timeout: 10000 }, (err, stdout, stderr) => {
      fs.unlinkSync(filepath);
      if (err) {
        const executionError = new Error(stderr || 'Code execution failed or timed out.');
        executionError.isExecutionError = true;
        return reject(executionError);
      }
      resolve(stdout);
    });
  });
}

// This line is updated to export the config object
module.exports = { runCodeInDocker, dockerConfig: config };