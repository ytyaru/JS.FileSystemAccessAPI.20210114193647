var selected_fileHandle = null;
window.addEventListener('load', (event) => {
    console.log('loaded !!');
    console.log(event);
    console.log(document.querySelector('#btn_load'));
    // ファイルを開く
    document.querySelector('#btn_load').addEventListener('click', async() => {
        [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        const fileContents = await file.text();
        console.log(file);
        console.log(fileContents);
        document.querySelector('#file_name').textContent = file.name;
        document.querySelector('#editor').value = fileContents;
        selected_fileHandle = fileHandle;
    });
    // 上書き保存
    document.querySelector('#btn_save').addEventListener('click', async() => {
        if (selected_fileHandle) {
            console.log('selected_fileHandle', selected_fileHandle);
            const writable = await selected_fileHandle.createWritable();
            await writable.write(document.querySelector('#editor').value);
            await writable.close();
        }
    });
    // 別名で保存
    document.querySelector('#btn_save_as').addEventListener('click', async() => {
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
