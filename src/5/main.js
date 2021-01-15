var selected_fileHandle = null;
window.addEventListener('load', (event) => {
    const VERSION = 1;
    const db = new Dexie("FileSystemAccessApiDb");
    /*
    db.version(VERSION).stores({
        handles: "handle"  // key, index
    });
    */
    db.version(VERSION).stores({
        handles: "id"  // key, index
    });
    // 前回終了時のファイルを読み込む
    db.handles.get(0)
        .then(async(record)=>{
            await initialize(record);
        })
        .catch((error)=>{
            console.error(error);
        })
        .finally(()=>{
        });

    async function initialize(record) {
        if (record) {
            console.log('get()', record);
            if (null == record) { return; }
            if (null == record.handle) { return; }
            selected_fileHandle = record.handle;
            console.log('Exist Db:', selected_fileHandle);

            const file = await selected_fileHandle.getFile();
            const fileContents = await file.text();
            console.log(file);
            console.log(fileContents);
            document.querySelector('#file_name').textContent = file.name;
            document.querySelector('#editor').value = fileContents;
        }
    }
    // ファイルを開く
    document.querySelector('#btn_load').addEventListener('click', async() => {
        [fileHandle] = await window.showOpenFilePicker();
        selected_fileHandle = fileHandle;
//        selected_fileHandle = db.handles.get(fileHandle) || fileHandle;
        /*
        db.handles.get(0)
            .then((record)=>{
                if (record !== undefined) {
                    console.log('get()', record);
                    fileHandle = record.handle;
                    selected_fileHandle = record.handle;
                    console.log('Exist Db:', selected_fileHandle);
                }
            })
            .catch((error)=>{
                console.error(error);
                selected_fileHandle = fileHandle;
                console.log('Load', selected_fileHandle);
            })
            .finally(()=>{
            });
        */
        const file = await fileHandle.getFile();
        const fileContents = await file.text();
        console.log(file);
        console.log(fileContents);
        document.querySelector('#file_name').textContent = file.name;
        document.querySelector('#editor').value = fileContents;
        /*
//        await verifyPermission(selected_fileHandle);
        const file = await fileHandle.getFile();
        const fileContents = await file.text();
        console.log(file);
        console.log(fileContents);
        document.querySelector('#file_name').textContent = file.name;
        document.querySelector('#editor').value = fileContents;
        selected_fileHandle = fileHandle;
        console.log('Load', selected_fileHandle);
        */
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
            console.log('Save', selected_fileHandle);
            const writable = await selected_fileHandle.createWritable();
            await writable.write(document.querySelector('#editor').value);
            await writable.close();
//            db.handles.put({id: 0, handle: selected_fileHandle}).catch((error)=>{console.error(error);});
//            db.handles.put({handle: selected_fileHandle}).catch((error)=>{console.error(error);});
//            db.handles.put({handle: fileHandle});
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
//        db.handles.put({handle: selected_fileHandle});
//        db.handles.put({id: 0, handle: selected_fileHandle}).catch((error)=>{console.error(error);});
//        db.handles.put({handle: selected_fileHandle}).catch((error)=>{console.error(error);});
    });
    // 閉じるときに保存する。ファイルハンドラを。これにより上書き保存時の確認ダイアログを非表示にできる。パーミッションごと保存してあるため。
    window.addEventListener('beforeunload', (event) => {
        db.handles.put({id: 0, handle: selected_fileHandle}).catch((error)=>{console.error(error);});
    });
});
