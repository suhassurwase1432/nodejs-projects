const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const chokidar = require('chokidar');

const chunkSize = 10 * 1024 * 1024;
const input_folder = './input_folder';
const output_folder = './output_folder';

if(!fs.existsSync(output_folder)){
    console.error('Error: NO folder exists');
    return;
}

const fileSet = new Set();

const splitFile = (fileDir) => {
    return new Promise((resolve, reject) => {
        const fileName = path.basename(fileDir);
        const fileNameInOutDir = path.join(output_folder, `${fileName}.part`);
        const correctedFileDir = fileDir.replace(/\\/g, '/');
        const correctedOutputDir = fileNameInOutDir.replace(/\\/g, '/');
        exec(`split -b ${chunkSize} "${correctedFileDir}" "${correctedOutputDir}"`, (error) => {
            if (error) {
                return reject(error);
            }
            resolve(`${fileNameInOutDir}aa`);
        });
    });

}

compareFiles = async (orignslFileDir , chunkFileDir) => {
  try{
    const originalFileData = await fs.readFile(orignslFileDir , 'utf-8'); 
    const chunkFileData = await fs.readFile(chunkFileDir , 'utf-8');
    
    return originalFileData === chunkFileData;
  } catch(err) {
    throw new Error("Their is an error during comaprison" , err.stack);
  }
}

const fileProcessing = async (fileDir) => {
    try{
        if(fileSet.has(fileDir)){
            console.log(`The file ${fileDir} already processed..`);
            return;
        }else{
            console.log(`Processing the file..${fileDir}`);
            const chunkFileDir = await splitFile(fileDir);
            const isSame = await compareFiles(fileDir , chunkFileDir);

            if(isSame){
                console.log(`File processing done Successfully ... ${fileDir}`);
                fileSet.add(fileDir);
            }else {
                console.log(`Unable to process all data bcz of data mismatch... ${fileDir}`);
            }
        }
    }catch(err){
        console.log(`Their is an error during processing data : ${fileDir}` , err.message);
    }
}
const watcher = chokidar.watch(`${__dirname}/input_folder`, {
    persistent: true,
    interval: 10 * 60 * 1000
});

watcher.on('add' , fileProcessing);
console.log("waiting for new files..");