var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IOHelper } from '@src/io/IOHelper';
/**
 * @partial
 */
export class TestPlatform {
    /**
     * @target web
     * @partial
     */
    static saveFile(name, data) {
        return new Promise((resolve, reject) => {
            let x = new XMLHttpRequest();
            x.open('POST', 'http://localhost:8090/save-file/', true);
            x.onload = () => {
                resolve();
            };
            x.onerror = () => {
                reject();
            };
            const form = new FormData();
            form.append('file', new Blob([data]), name);
            x.send(form);
        });
    }
    /**
     * @target web
     * @partial
     */
    static loadFile(path) {
        return new Promise((resolve, reject) => {
            let x = new XMLHttpRequest();
            x.open('GET', '/base/' + path, true, null, null);
            x.responseType = 'arraybuffer';
            x.onreadystatechange = () => {
                if (x.readyState === XMLHttpRequest.DONE) {
                    if (x.status === 200) {
                        let ab = x.response;
                        let data = new Uint8Array(ab);
                        resolve(data);
                    }
                    else {
                        let response = x.response;
                        reject('Could not find file: ' + path + ', received:' + response);
                    }
                }
            };
            x.send();
        });
    }
    /**
     * @target web
     * @partial
     */
    static listDirectory(path) {
        return new Promise((resolve, reject) => {
            let x = new XMLHttpRequest();
            x.open('GET', 'http://localhost:8090/list-files?dir=' + path, true, null, null);
            x.responseType = 'text';
            x.onreadystatechange = () => {
                if (x.readyState === XMLHttpRequest.DONE) {
                    if (x.status === 200) {
                        resolve(JSON.parse(x.responseText));
                    }
                    else {
                        reject('Could not find path: ' + path + ', received:' + x.responseText);
                    }
                }
            };
            x.send();
        });
    }
    static loadFileAsString(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield TestPlatform.loadFile(path);
            return IOHelper.toString(data, 'UTF-8');
        });
    }
    static changeExtension(file, extension) {
        let lastDot = file.lastIndexOf('.');
        if (lastDot === -1) {
            return file + extension;
        }
        else {
            return file.substr(0, lastDot) + extension;
        }
    }
}
//# sourceMappingURL=TestPlatform.js.map