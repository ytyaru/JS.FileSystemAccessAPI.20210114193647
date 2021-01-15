var root_dir = null;
var selected_fileHandle = null;
window.addEventListener('load', (event) => {
    document.querySelector('#btn_select_dir').addEventListener('click', async() => {
        const dirHandle = await window.showDirectoryPicker();
        root_dir = dirHandle;
        console.log(dirHandle);
        for await (const entry of dirHandle.values()) {
            console.log(entry.kind, entry.name, entry);
            const path = await dirHandle.resolve(entry);
            console.log(path);
        }

    });
    document.querySelector('#btn_select_file').addEventListener('click', async() => {
        [fileHandle] = await window.showOpenFilePicker();
        await readFile(fileHandle);
        if (root_dir) {
            const path = await root_dir.resolve(fileHandle);
            path.unshift(root_dir.name);
            console.log(path);
            document.querySelector('#file_path').textContent = path.join('/');
        }
    });    
    // ファイルを読み込む
    async function readFile(fileHandle) {
        selected_fileHandle = fileHandle;
        const file = await selected_fileHandle.getFile();
        const fileContents = await file.text();
        console.log(file);
        console.log(fileContents);
        document.querySelector('#file_path').textContent = file.name;
        document.querySelector('#editor').value = fileContents;
//        document.querySelector('#btn_save').disabled = false;
    }
    /*
    // DBを開く
    const VERSION = 1;
    const db = new Dexie("FileSystemAccessApiDb");
    db.version(VERSION).stores({
        handles: "id"  // key, index
    });
    // 前回終了時のファイルを読み込む
    db.handles.get(0)
        .then(async(record)=>{
            console.log('get()', record);
            if (!record) { return; }
            if (!record.handle) { return; }
            console.log('Exist Db:', selected_fileHandle);
            await readFile(record.handle);
        })
        .catch((error)=>{
            console.error(error);
        })
        .finally(()=>{
        });
    // ファイルを書き込む
    async function writeFile(fileHandle=null, contents=null) {
        const handle = fileHandle || selected_fileHandle;
        const content = contents || document.querySelector('#editor').value;
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
    }
    // ファイルを開く
    document.querySelector('#btn_load').addEventListener('click', async() => {
        [fileHandle] = await window.showOpenFilePicker();
        await readFile(fileHandle);
    });
    // 上書き保存
    document.querySelector('#btn_save').addEventListener('click', async() => {
        await writeFile();
    });
    // 別名で保存
    document.querySelector('#btn_save_as').addEventListener('click', async() => {
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
        await writeFile(handle);
        await readFile(handle);
        console.log('SaveAs', handle);
    });
    // 閉じるときに保存する。ファイルハンドラを。これにより上書き保存時の確認ダイアログを非表示にできる。パーミッションごと保存してあるため。
    window.addEventListener('beforeunload', (event) => {
        db.handles.put({id: 0, handle: selected_fileHandle}).catch((error)=>{console.error(error);});
    });
    */
});
