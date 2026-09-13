const fs = require('fs');
const logContent = fs.readFileSync('C:/Users/ezequ/.gemini/antigravity-ide/brain/75e51973-1c7c-435a-9058-d6cb364c781f/.system_generated/tasks/task-1478.log', 'utf-8');
const lines = logContent.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('CypressError:') || line.includes('AssertionError:')) {
    console.log('------------------');
    // print 3 lines before and 2 after
    for(let j = -3; j <= 2; j++) {
      if(lines[i+j]) console.log(lines[i+j]);
    }
  }
}
