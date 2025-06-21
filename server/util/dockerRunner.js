const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const tempDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const config = {
    cpp: {
      ext: 'cpp',
      image: 'gcc',
      command: (file) => `g++ ${file} -o ${file}.out && ./$(basename ${file}).out`
    },
    python: {
      ext: 'py',
      image: 'python:3.10',
      command: (file) => `python ${file}`
    }
  };

function runCodeInDocker(language, code) {
  console.log("Inside runCodeInDocker()");
  console.log("Language:", language);
  console.log("Code snippet:", code.slice(0, 100));
  return new Promise((resolve, reject) => {
    const lang = config[language];
    if (!lang) return reject(new Error('Unsupported language'));

    const id = uuidv4();
    const filename = `${id}.${lang.ext}`;
    const filepath = path.join(tempDir, filename);

    fs.writeFileSync(filepath, code);

    const cmd = `docker run --rm -v ${filepath}:/app/${filename} -w /app ${lang.image} bash -c "${lang.command(filename)}"`;

    console.log("Docker Command:", cmd);

    exec(cmd, (err, stdout, stderr) => {
      console.log("stdout:", stdout);
      console.log("stderr:", stderr);
      fs.unlinkSync(filepath);
    
      if (err) {
        console.error("Execution error:", err.message);
        return reject(new Error(stderr || err.message));
      }
      const lang = config[language];
      if (!lang) {
        console.log("Unsupported language:", language);
        return reject(new Error("Unsupported language: " + language));
      }
      resolve(stdout);
    });
  });
}

module.exports = { runCodeInDocker };