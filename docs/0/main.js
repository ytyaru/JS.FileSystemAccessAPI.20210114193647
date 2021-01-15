window.addEventListener('load', (event) => {
    window.addEventListener('click', async() => {
        [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        const fileContents = await file.text();
        console.log(file);
        console.log(fileContents);
    });
});

