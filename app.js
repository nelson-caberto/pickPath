let direction = false;
let l = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
</svg>`;
let r = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
</svg>`;

let initDIR = document.getElementById('ZZDIR');
initDIR.setAttribute('dir',direction);
initDIR.innerHTML = direction?l:r;

let pickPath = [];

function revDir(isle,binCol) {
    let arrow = document.getElementById(`${isle}${binCol}DIR`);
    let newdir = arrow.getAttribute("dir") !== 'true';
    arrow.innerHTML = newdir?l:r;
    arrow.setAttribute("dir",newdir);
}

function togglePath(isle,binCol) {
    let id = `${isle}${binCol}`;
    if (pickPath.includes(id)) {
        pickPath.splice(pickPath.indexOf(id),1);
        document.getElementById(id).innerText = " X ";
    } else {
        pickPath.push(id);
        document.getElementById(id).innerText = pickPath.length;
    }
    updateIsleOrder();
    updateLayoutOrder();
}

function updateLayoutOrder() {
    for (element in pickPath) {
        let id = pickPath[element];
        document.getElementById(id).innerText = parseInt(element) + 1;
    }
}

function addcol(isle,binCol,direction,directionHTML) {
    let col = 
    `
    <div class="col border">
        <div class="container">
            <div class="row mb-1">
                <div class="col">
                </div>
                <div class="col border-bottom" align="center">
                    <span class="align-middle">${binCol}-${binCol+77}</span>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col">
                    <div class="container">
                        <div class="row">
                            <div class="col border rounded" align="center">
                                <span class="align-middle">${isle}</span>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col border rounded" align="center">
                                <span class="align-middle">${isle+1}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3" align="center">
                        <button type="button" class="btn btn-secondary" onclick="revDir(${isle},${binCol});"><div id="${isle}${binCol}DIR" dir="${direction}">${directionHTML}</div></button>
                        <button class="btn btn-outline-secondary" type="button" onclick="togglePath(${isle},${binCol})" id="${isle}${binCol}"> X </button>
                    </div>
                </div>
            </div>
        </div>                            
    </div>
    `
    return col;
}

function addrow(isle,direction,directionHTML) {
    let layout = `<div class="row">`
    layout += addcol(isle,100,direction,directionHTML);
    layout += addcol(isle,200,direction,directionHTML);
    layout += addcol(isle,300,direction,directionHTML);
    document.getElementById('layout').innerHTML += layout;
}

function updateIsleOrder() {
    let isleOrder = `<select class="form-select mb-3" multiple aria-label="isleOrder" size="${pickPath.length}">`;
    for (subSec of pickPath) {
        isleOrder += `<option value="${subSec}">${subSec}</option>`;
    }
    isleOrder += `</select>`;
    document.getElementById('isleOrder').innerHTML = isleOrder;
}

function generateLayout() {
    document.getElementById('layout').innerHTML = '';
    let startIsle = parseInt(document.getElementById('startIsle').value);
    let endIsle = parseInt(document.getElementById('endIsle').value);
    direction = initDIR.getAttribute('dir') === 'true';
    for (let i = startIsle; i < endIsle; i+=2) {
        addrow(i,direction,direction?l:r);
        direction = !direction;
    }
    pickPath = [];
    updateIsleOrder();
}

function download() {
    let results = [];
    for (element in pickPath) {
        let id = pickPath[element];
        let isle = parseInt(id.substr(0,3));
        let binCol = parseInt(id.substr(3,3));
        let direction = document.getElementById(id+"DIR") === 'true';
        let floor = document.getElementById('floor').getAttribute('value');
        results = results.concat(genSubSect(isle, binCol, direction, floor));
    }
    let csvContent = "";
    results.forEach(result=>csvContent+=result+"\n");

    let a = document.createElement('a');
    a.setAttribute('href','data:text/plain;charset=utf-8, '+encodeURIComponent(csvContent));
    a.setAttribute('download',`PickPath.csv`);
    a.click();
}

function genSubSect(isleStart, binColStart, direction, floor) {
    let binU = ['A','B','C','D','E'];
    let binD = ['E','D','C','B','A'];
    let binColEnd = binColStart+78;
    isleEnd = isleStart+1;
    binCols = range(binColStart,binColEnd);
    isles = [isleStart, isleEnd];

    if (!direction) {
        binCols.reverse();
    }

    let binColsGroups = [];
    while (binCols.length) {
        binColsGroups.push(binCols.splice(0,4));
    }

    let results = [];
    for (binCols in range(0,binColsGroups.length)) {
        for (binRow of binCols % 2 == 0 ? binU : binD) {
            for (isle of isles) {
                for (binCol of binColsGroups[binCols]) {
                    if (['A','B','E'].includes(binRow) && binCol % 2 != 0) continue;
                    results.push(`${floor}${isle}${binRow}${binCol}`);
                }
            }
            isles.reverse();
        }
    }

    return results;
}

// https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
const range = (start, end) => {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
}

