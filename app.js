const fs = require("node:fs")
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {}

// contoh script pembuatan folder
 app.makeFolder = () => {
    rl.question("Masukan Nama Folder : ",(folderName) => {
        fs.mkdir(__dirname + `/${folderName}`,() => {
            console.log("success created new folder");
            
        })
        rl.close()
    })
} 

// To Do : lanjutkan pembuatan logic disini 
// make file
app.makeFile=() => {
    rl.question("Masukan Nama Folder : ",(folder) => {
        rl.question("Masukan Nama File : ",(file) => {
            rl.question("Masukan Nama extension : ",(ext) => {
                console.log(folder,file,ext);
                fs.writeFileSync(`${folder}/${file}.${ext}`, '');
                rl.close();
             });
        });
    });
};

//ext-sorter
app.extSorter = () => {

    const res = fs.readdirSync('unorganize_folder');
    const rename = (folderName, element) => {
        fs.mkdir(__dirname + `/${folderName}`, () => {
            fs.rename(
                __dirname + `/unorganize_folder/` + element,
                __dirname + `/${folderName}/` + element,
                (err) => {}
            );
        });
    };

    for (let index = 0; index < res.length; index++) {
        const element = res[index];
        const ext = element.split('.')[element.split('.').length - 1];
        if (['txt', 'pdf', 'md'].includes(ext)) {
            rename('text', element);

        }
    }
       
    rl.close();
    return;
};

//read-folder
app.readFolder = () => {
    function getJenisFile(extensi) {
        switch (extensi.toLowerCase()) {
            case 'txt':
                return 'Teks';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'Gambar';
            case 'mp4':
            case 'mkv':
                return 'Video';
            case 'mp3':
            case 'wav':
                return 'Audio';
            case 'pdf':
                return 'Dokumen';
            case 'zip':
            case 'rar':
                
                return 'Kode Sumber';
            default:
                return 'Tidak Diketahui';
        }
    }
    function formatUkuranFile(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    }

    rl.question("Masukan Nama Folder : ", (folderName) => {
        const res = fs.readdirSync(folderName);
        const output = [];
        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            try {
                const stat = fs.statSync(__dirname + `/${folderName}/` + element);

                
                const extensi = element.split('.').pop();

                
                const jenisFile = getJenisFile(extensi);
                const ukuranFile = formatUkuranFile(stat.size);

                output.push({
                    namaFile: element,
                    extensi: extensi,
                    jenisFile: jenisFile,
                    tanggalDibuat: stat.birthtime,
                    ukuranFile: ukuranFile,
                });
            } catch (error) {
                console.log("Gagal baca file", folderName, element);
            }
        }
        console.log(output);
        rl.close();
    });
};

//read-file
app.readFile = () => {
    rl.question("Masukan Nama Folder : ", (folderName) => {
        rl.question("Masukan Nama File (termasuk ekstensi, misalnya 'cerpen.txt'): ", (fileName) => {
            try {
                const filePath = __dirname + `/${folderName}/${fileName}`;
                
                const isiFile = fs.readFileSync(filePath, 'utf8');
                
                console.log(`Isi dari file ${fileName}:\n${isiFile}`);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`File ${fileName} tidak ditemukan di folder ${folderName}. Pastikan nama dan ekstensi file benar.`);
                } else {
                    console.log("Gagal membaca file:", fileName);
                    console.error(error.message);
                }
            }
            rl.close();
        });
    });
};

module.exports = app