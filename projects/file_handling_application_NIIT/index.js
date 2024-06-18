const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const chokidar = require('chokidar');
const { error } = require('console');
const os = require('os');

const chunkSize = 10 * 1024 * 1024;
const input_folder = './input_folder';
const output_folder = './output_folder';

if(!fs.existsSync(output_folder)){
    console.error('Error: NO folder exists');
    return;
}

const fileSet = new Set();

// As the code is developed in windows os, due to that it gives error of "'split' is not recognized as an internal or external command"
// but it works correctly in linux 
const splitFile = (fileDir) => {
    return new Promise((resolve, reject) => {
        const isLinux = os.platform ===  "linux";
        const fileName = path.basename(fileDir);
        const fileNameInOutDir = path.join(output_folder, `${fileName}.part`);
// also the path module join folder with "\" but linux command uses "/" so that we use replace method.
//As mentioned in the requirement that "stored in an output folder using Linux commands", according to that 
// corrections are made
        if(isLinux){
            const correctedFileDir = fileDir.replace(/\\/g, '/');
            const correctedOutputDir = fileNameInOutDir.replace(/\\/g, '/');
            exec(`split -b ${chunkSize} "${correctedFileDir}" "${correctedOutputDir}"`, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        }else{
            console.log("Please use linux OS to run this split command..");
        }
    });

}

const processedChunckData = async (fileName) => {
try {
        const fileNameInOutDir = path.join(output_folder, `${fileName}.part`);
        const outputFilePath = path.join(output_folder, `${fileName}.updated`);
        //made this correction for cat command exicution
        const correctedFileNameInOutDir= fileNameInOutDir.replace(/\\/g , '/');
        const correctedOutputFilePath = outputFilePath.replace(/\\/g, '/');

        const chunkData = await exec(`cat ${correctedFileNameInOutDir} > "${correctedOutputFilePath}"`);
        console.log("Processed chunk data successfully.");

        return outputFilePath;
    } catch (error) {
        throw new Error(`Error processing chunk data: ${error.message}`);
    }
}

compareFiles = async (orignslFileDir , allChunkDataFileDir) => {
  try{
    const originalFileData = await fs.readFile(orignslFileDir);
    const chunkFileData = await fs.readFile(allChunkDataFileDir);
 
    if(!originalFileData.equals(chunkFileData)) {
        throw new Error("Data mismatch between original file and chunk file");
    }

    return true;
  } catch(err) {
    throw new Error("Their is an error during comaprison" , err.message);
  }
}

const fileProcessing = async (fileDir) => {
    try{
        if(fileSet.has(fileDir)){
            console.log(`The file ${fileDir} already processed..`);
            return;
        }else{
            console.log(`Processing the file..${fileDir}`);
            await splitFile(fileDir);

            const fileName = path.basename(fileDir);
            const chunkDataCombineFileDir = await processedChunckData(fileName);

            const isSame = await compareFiles(fileDir , chunkDataCombineFileDir);

            if(isSame){
                console.log(`File processing done Successfully ... ${fileDir}`);
                fileSet.add(fileDir);
            }else {
                console.log(`Unable to process all data bcz of data mismatch... ${fileDir}`);
            }
            fs.remove(chunkDataCombineFileDir);
        }
    }catch(err){
        console.log(`Their is an error during processing data : ${fileDir}` , err.message);
    }
}
const watcher = chokidar.watch(`${__dirname}/input_folder`, {
    persistent: true,
    usePolling: true,
    interval: 1 * 60 * 1000
});

watcher.on('add' , fileProcessing);
console.log("waiting for new files..");