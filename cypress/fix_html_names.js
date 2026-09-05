const fs = require('fs');

function addNames(file) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/formControlName="([a-zA-Z0-9_]+)"/g, 'formControlName="$1" name="$1"');
  fs.writeFileSync(file, c);
  console.log('Updated ' + file);
}

addNames('src/app/public/prueba-gratis/prueba-gratis.component.html');
addNames('src/app/public/free-trial/free-trial.component.html');
addNames('src/app/admin/company/admin-company-settings-page.html');
addNames('src/app/admin/branches/admin-branches-page.html');
addNames('src/app/admin/repairs/admin-repair-form-page.html');
