window.addEventListener('load', (event) => {
    console.log('loaded !!');
    console.log(event);
    console.log(document.querySelector('#btn_load'));

    /*
    const btn_load = document.querySelector('#btn_load');
    btn_load.addEventListener('click', async() => {
        [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        const fileContents = await file.text();
        console.log(file);
        console.log(fileContents);
        document.querySelector('#file_name').textContent = file.name;
        document.querySelector('#editor').value = fileContents;

    });
    */
    document.querySelector('#btn_load').addEventListener('click', async() => {
        [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        const fileContents = await file.text();
        console.log(file);
        console.log(fileContents);
        document.querySelector('#file_name').textContent = file.name;
        document.querySelector('#editor').value = fileContents;
    });
    document.querySelector('#btn_save').addEventListener('click', async() => {
        async function writeFile(fileHandle, contents) {
          const writable = await fileHandle.createWritable();
          await writable.write(contents);
          await writable.close();
        }
        const saveFileOptions = {
          types: [
            {
              description: "Text Files",
              accept: {
                "text/plain": [".txt"],
              },
            },
          ],
        };
        const textContent = document.querySelector('#editor').value;
        const handle = await window.showSaveFilePicker(saveFileOptions);
        await writeFile(handle, textContent);
        console.log('書込完了');
    });
});
