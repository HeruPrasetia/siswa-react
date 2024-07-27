import * as XLSX from 'xlsx';

export let host = window.location.hostname === "localhost" ? "http://localhost/siswaapi/" : "https://siswaapi.naylatools.com/";

export const Token = localStorage.getItem("TokenUser");

export const TampilBulan = function (date) {
    let bulan = date.substring(5);
    let tahun = date.substring(0, 4);
    let BulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agust", "Sept", "Okt", "Nov", "Des"];
    let hasil = `${BulanIndo[bulan - 1]} ${tahun}`;
    return hasil;
}

export const saiki = function (first = null) {
    var today = new Date();
    var dd = first == null ? today.getDate() : first;
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

export const isJson = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const YYMMDD = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth()),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export const tanggalIndo = function (data) {
    var d = new Date(data),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    let hasil = [year, month, day].join('-');

    if (hasil == "0000-00-00" || hasil == null) {
        return (hasil);
    } else {
        let BulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agust", "Sept", "Okt", "Nov", "Des"];

        let tahun = hasil.substring(2, 4);
        let bulan = hasil.substring(5, 7);
        let tgl = hasil.substring(8, 10);

        let result = `${tgl} ${BulanIndo[bulan - 1]} ${tahun}`;
        return result;
    }
}

export const randomRgb = () => {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}

export const getDayOfMonth = function (month, year) {
    var date = new Date(Date.UTC(year, month, 1));
    var days = [];
    // let bln = month < 10 ? month.substring(1) : month;
    while (date.getUTCMonth() === month) {
        days.push(YYMMDD(new Date(date)));
        date.setUTCDate(date.getUTCDate() + 1);
    }
    return days;
}

export const getLastDay = (y, m) => {
    var d = new Date(y, m, 0);
    return `${y}-${m}-${d.getDate()}`;
}

export const getAllDay = function (date) {
    var month = date.substring(5, 7);
    var year = date.substring(0, 4);
    var d = new Date(year, month, 0).getDate();
    let day = [];
    for (let i = 1; i <= d; i++)  day.push(`${year}-${month}-${i}`);
    return day;
}

export const numberFormat = function (ini) {
    var formatter = new Intl.NumberFormat("en-GB", { style: "decimal" });
    var nmr = 0;
    if (isNaN(ini)) {
        nmr = 0;
    } else {
        nmr = ini;
    }
    return formatter.format(nmr.toString().replace(/,/g, ""));
}

export const execFunction = function (functionName, context = window) {
    let args = Array.prototype.slice.call(arguments, 2);
    let namespaces = functionName.split(".");
    let func = namespaces.pop();
    for (let i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

export function pesan(pesan) {
    var toast = document.getElementById('toast');
    toast.classList.add('toast-active');
    toast.innerText = pesan;
    setTimeout(function () {
        toast.classList.remove('toast-active');
    }, 3000);
}

export function openModal(id) {
    let modal = new window.bootstrap.Modal(document.getElementById(id), {});
    modal.show("#" + id);
}


export function submitForm(e, opt) {
    e.preventDefault();
    e.stopPropagation();
    let Form = e.target;
    let btn = Form.querySelector('button[type="submit"]');
    btn.disabled = true;
    let i = btn.querySelector('i');
    let oldCls = i.className;
    i.className = "spinner-border spinner-border-sm text-light";
    let btnClose = opt.close ? document.getElementById(opt.close) : Form.querySelector('button[data-bs-dismiss="modal"]');
    if (Form.checkValidity()) {
        let data = new FormData(Form);
        data.append("Token", Token);
        fetch(host + opt.crud, {
            method: 'POST',
            body: data,
        }).then(response => response.text()).then(hasil => {
            if (window.location.hostname == "localhost" && opt.debug == true) console.log(hasil);
            if (isJson(hasil)) {
                let sql = JSON.parse(hasil);
                if (sql.status === "sukses") {
                    pesan(sql.pesan);
                    opt.fn.bind(Form)();
                    btn.disabled = false;
                    i.className = oldCls;
                    if (btnClose) btnClose.click();
                } else {
                    pesan(sql.pesan);
                    btn.disabled = false;
                    i.className = oldCls;
                }
            } else {
                pesan("Terjadi kesalahan");
                btn.disabled = false;
                i.className = oldCls;
            }
        }).catch((error) => {
            console.log("Error: " + error);
            btn.disabled = false;
            i.className = oldCls;
        }).finally(() => {
            btn.disabled = false;
            i.className = oldCls;
        });
    } else {
        Form.classList.add('was-validated');
        btn.disabled = false;
        i.className = oldCls;
    }
}

export const api = function (url, data, debug = false) {
    try {
        return new Promise((resolve, reject) => {
            fetch(encodeURI(host + url), {
                method: 'POST',
                body: jsonToForm(data),
            }).then(response => response.text()).then(hasil => {
                if (window.location.hostname === "localhost" && debug === true) console.log(hasil);
                if (isJson(hasil)) {
                    resolve(JSON.parse(hasil));
                } else {
                    resolve({ status: "gagal", pesan: "Terjadi Kesalahan" });
                }
            }).catch((error) => {
                reject(error)
            });
        });
    } catch (e) {
        pesan("Terjadi Kesalahan", "Mohon maaf terjadi kesalahan saat load data" + e, "danger");
        console.log(e);
    }
}

function jsonToForm(data) {
    const formData = new FormData();
    for (let dt in data) formData.append(dt, data[dt]);
    formData.append("Token", Token);
    return formData;
}
export function convertToBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // img.crossOrigin = 'Anonymous'; // Set crossOrigin agar bisa mengakses gambar dari domain lain
        img.src = url;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, img.width, img.height);

            try {
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = error => {
            reject(error);
        };
    });
}

export function extensionBase64(base64String) {
    const binaryData = atob(base64String.split(',')[1]);
    const header = binaryData.slice(0, 4);
    let extension = null;
    switch (header) {
        case '\x89PNG':
            extension = 'png';
            break;
        case 'GIF8':
            extension = 'gif';
            break;
        case '\xFF\xD8\xFF':
            extension = 'jpg';
            break;
        default:
            extension = 'dat';
            break;
    }
    return extension;
}

export function sizeBase64(base64String) {
    const base64WithoutMetadata = base64String.split(',')[1];
    const blob = atob(base64WithoutMetadata);
    const arrayBuffer = new ArrayBuffer(blob.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < blob.length; i++) {
        uint8Array[i] = blob.charCodeAt(i);
    }

    const blobData = new Blob([uint8Array]);
    const fileSizeBytes = blobData.size;
    const fileSizeKB = fileSizeBytes / 1024;

    return {
        sizeBytes: fileSizeBytes,
        sizeKB: Math.round(fileSizeKB)
    };
}

export function compressImageBase64(inputBase64, outputFormat, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = inputBase64;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const compressedBase64 = canvas.toDataURL(`image/${outputFormat}`, quality);
            resolve(compressedBase64);
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}

export function resizeImageBase64(inputBase64, targetWidth, targetHeight, ext = "jpeg") {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = inputBase64;

        img.onload = () => {
            const aspectRatio = img.width / img.height;
            let newWidth, newHeight;
            if (targetWidth / targetHeight > aspectRatio) {
                newWidth = targetHeight * aspectRatio;
                newHeight = targetHeight;
            } else {
                newWidth = targetWidth;
                newHeight = targetWidth / aspectRatio;
            }

            const canvas = document.createElement('canvas');

            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            const resizedBase64 = canvas.toDataURL('image/' + ext);

            resolve(resizedBase64);
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}

export async function exportData(data, title, columns) {
    try {
        let arr = [columns.map((col) => col.text)];

        data.forEach((item) => {
            let innerRowData = columns.map((col) => item[col.field]);
            arr.push(innerRowData);
        });

        var filename = `${title}.xlsx`;
        var ws_name = "Data";
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(arr);

        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        XLSX.writeFile(wb, filename);
    } catch (error) {
        console.error('Error exporting data:', error);
    }
}

export function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };

        reader.readAsArrayBuffer(file);
    });
}
export function openFile(e, compress = false) {
    return new Promise((resolve, reject) => {
        let files = e.target.files;
        let promises = [];

        for (let i = 0; i < files.length; i++) {
            promises.push(processFile(files[i], compress));
        }

        Promise.all(promises)
            .then((hasil) => {
                resolve(hasil);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function processFile(file, compress) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let fileExtension = file.name.split('.').pop().toLowerCase();
        let fileSizeKB = Math.round(file.size / 1024);

        reader.onload = async () => {
            try {
                let baru = fileSizeKB > 600 && compress == true ? await compressImageBase64(reader.result, fileExtension, 0.8) : reader.result;
                let img = new Image();
                img.src = baru;

                img.onload = async () => {
                    let width = fileSizeKB > 600 && compress ? img.width / 5 : img.width;
                    let height = fileSizeKB > 600 && compress ? img.height / 5 : img.height;
                    let newRes = fileSizeKB > 600 && compress == true ? await resizeImageBase64(baru, height, width, fileExtension) : baru;
                    resolve({ img: newRes, width: width, height: height, size: fileSizeKB, ext: fileExtension });
                };
            } catch (error) {
                console.error('Error compressing image:', error.message);
                reject(error);
            }
        };

        reader.readAsDataURL(file);
    });
}

export function detailGambar(gambar) {
    let detail = {};
    let img = new Image();
    img.src = gambar;
    img.onload = async () => {
        let size = sizeBase64(gambar).sizeKB;
        let ext = extensionBase64(gambar);
        let width = img.width;
        let height = img.height;
        detail = { size: size, width: width, height: height, ext: ext };
    };
    return detail;
}