import * as fs from 'fs';
const setEnv = () => {
    const writeFile = fs.writeFile;
    // Configure Angular `environment.ts` file path
    const targetPath = 'src/environments/environment.ts';
    // `environment.ts` file structure
    console.log(process.env)
    const envConfigFile = `export const environment = {
    googleApiKey: '${process.env['GOOGLE_SHEETS_API_KEY']}',
    production: true,
  };
  `;
    writeFile(targetPath, envConfigFile, (err: any) => {
      if (err) {
        console.error(err);
        throw err;
      } else {
        console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
      }
    });
  };
  
  setEnv();