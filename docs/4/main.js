var selected_fileHandle = null;
window.addEventListener('load', (event) => {
    // ファイルを開く
    document.querySelector('#btn_load').addEventListener('click', async() => {
        [fileHandle] = await window.showOpenFilePicker();
        selected_fileHandle = fileHandle;
//        await verifyPermission(selected_fileHandle);
        const file = await fileHandle.getFile();
        const fileContents = await file.text();
        console.log(file);
        console.log(fileContents);
        document.querySelector('#file_name').textContent = file.name;
        document.querySelector('#editor').value = fileContents;
        console.log('Load', selected_fileHandle);

        // パーミッションを与える
        async function verifyPermission(fileHandle, readWrite=true) {
            const options = {};
            if (readWrite) {
                options.mode = 'readwrite';
            }
            if ((await fileHandle.queryPermission(options)) === 'granted') {
                console.log('fileHandle.queryPermission', options);
                return true;
            }
            // パーミッションの要求。読込時ですでに確認ダイアログが出てしまう……省略したいのに
            if ((await fileHandle.requestPermission(options)) === 'granted') {
                console.log('fileHandle.requestPermission', options);
                return true;
            }
            return false;
        }

    });
    // 上書き保存
    document.querySelector('#btn_save').addEventListener('click', async() => {
//        await verifyPermission(selected_fileHandle);
        if (selected_fileHandle) {
//            await verifyPermission(selected_fileHandle);
            const writable = await selected_fileHandle.createWritable();
            await writable.write(document.querySelector('#editor').value);
            await writable.close();
            console.log('Save', selected_fileHandle);
        }
        // パーミッションを与える
        async function verifyPermission(fileHandle, readWrite=true) {
            const options = {};
            if (readWrite) {
                options.mode = 'readwrite';
            }
            if ((await fileHandle.queryPermission(options)) === 'granted') {
                console.log('fileHandle.queryPermission', options);
                return true;
            }
            // パーミッションの要求。結局、確認ダイアログが出る……省略したいのに
            if ((await fileHandle.requestPermission(options)) === 'granted') {
                console.log('fileHandle.requestPermission', options);
                return true;
            }
            return false;
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
        selected_fileHandle = handle;
        console.log(handle);
//        const file = handle.getFile();
        document.querySelector('#file_name').textContent = handle.name;
        console.log(`handle.name=${handle.name}`);
        console.log('SaveAs');
    });
});
