window.addEventListener('load', (event) => {
    window.addEventListener('click', async() => {
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
        const textContent = "書き込みたい内容";
        const handle = await window.showSaveFilePicker(saveFileOptions);
        await writeFile(handle, textContent);
        console.log('書込完了');
    });

});

