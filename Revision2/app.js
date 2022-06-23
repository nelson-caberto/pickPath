const sectionModal = document.getElementById('sectionModal');
sectionModal.addEventListener('show.bs.modal', event => {
    const floor = event.relatedTarget.getAttribute('floor');
    document.getElementById('sectionModalLabel').innerHTML = `Create Section on Floor <em id="emfloor">${floor}</em>`;
});

const sectionSelect = 0;
const pickPathSelect = 1;
const moveU = -1;
const moveD = 1;
let direction = false;
let svg_l = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
</svg>`;
let svg_r = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
</svg>`;
let svg_u = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
</svg>`;
let svg_d = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
</svg>`;
let svg_plus = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
</svg>`;
let svg_dash = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
</svg>`;
let svg_x = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
</svg>`;

document.getElementById('ZZDIR').setAttribute('id', `${genIsleBinID('Z', 'Z')}DIR`);
document.getElementById('shelfPatternAddButton').innerHTML = svg_plus;

let isleStart = document.getElementById('isleStart');
let isleEnd = document.getElementById('isleEnd');
let isleDir = document.getElementById(`${genIsleBinID('Z', 'Z')}DIR`);
let islePair = document.getElementById('islePair');
let binStart = document.getElementById('binStart');
let binOffset = document.getElementById('binOffset');
let binCount = document.getElementById('binCount');
let binSegment = document.getElementById('binSegment');

let downloadButton = document.getElementById('downloadButton');
let downloadSelect = document.getElementById('downloadSelect');
let accordionPanel = document.getElementById('accordionPanel');

let sectionLayout = document.getElementById('sectionLayout');
let pickPath = document.getElementById('pickPath');

isleDir.setAttribute('dir', direction);
isleDir.innerHTML = direction ? svg_l : svg_r;


disableDownload();

let data = {};
let validation = {
    addFloorButton: {
        floorInput: false
    },
    sectionAddButton: {
        isleStart: false,
        isleEnd: false,
        binStart: false,
        binOffset: false,
        binSegment: false,
        binCount: false
    }
};
let shelfs = [
    {
        "Default Isle Pair": {
            groundup_labels: ['A','B','C','D','E'],
            batch_size: 8,
            pattern: "gridlist",
            pair:0
        }
    },
    {
        "Default Signle Isle": {
            groundup_labels: ['A','B','C','D','E'],
            batch_size: 8,
            pattern: "gridlist",
            pair:1
        }
    }
];

function loadpaths() {
    let pickPathfile = document.getElementById('pickPathfile');
    let reader = new FileReader();
    let file = pickPathfile.files[0];
    if (file == undefined) return;
    reader.onload = ()=>{
        data = JSON.parse(reader.result);
        renderFloor();
        enableDownload();
    };
    reader.readAsText(file);
}

function download() {
    let option = downloadSelect.selectedOptions[0].value;
    let a = document.createElement('a');
    const csvContent = "still gotta make";
    switch (option) {
        case 'f':
            a.setAttribute('href','data:text/plain;charset=utf-8, '+encodeURIComponent(csvContent));
            a.setAttribute('download',`Floor.csv`);
            break;
        case 's':
            a.setAttribute('href','data:text/plain;charset=utf-8, '+encodeURIComponent(csvContent));
            a.setAttribute('download',`Section.csv`);
            break;
        case 'p':
            a.setAttribute('href',"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)));
            a.setAttribute('download',`PickPath.json`);
            break;
        default:
            console.log('should never see this');
            break;
    }
    a.click();
}

function enableDownload() {
    downloadButton.disabled = false;
    downloadSelect.disabled = false;
}

function disableDownload() {
    downloadButton.disabled = true;
    downloadSelect.disabled = true;
}

function updateDirection(isle,bin) {
    const id = genIsleBinID(isle, bin);
    let arrow = document.getElementById(`${id}DIR`);
    let newdir = arrow.getAttribute("dir") !== 'true';
    if (isle != 'Z' && bin != 'Z') {
        const floor = sectionLayout.getAttribute('floor');
        const sectionIndex = sectionLayout.getAttribute('sectionIndex');
        let modsDir = data[floor][sectionIndex]['mods']['direction'];
        modsDir[id] = newdir;
    }
    renderLayoutDirection(id,newdir);
}

function renderLayoutDirection(id,newdir) {
    let arrow = document.getElementById(`${id}DIR`);
    arrow.innerHTML = newdir ? svg_l : svg_r;
    arrow.setAttribute("dir", newdir);
}

function renderLayoutDirections() {
    const floor = sectionLayout.getAttribute('floor');
    const sectionIndex = sectionLayout.getAttribute('sectionIndex');
    let modsDir = data[floor][sectionIndex]['mods']['direction'];
    for (id in modsDir) {
        renderLayoutDirection(id,modsDir[id]);
    }
}

function addFloor() {
    let floorName = document.getElementById('addFloorInput').value;
    // if foorName is in data, do nothing. TODO: should have confirmation popup
    if (floorName === '' || floorName in data) return;
    data[floorName] = [];
    appendFloorView(floorName);
    if (accordionPanel.childElementCount > 0) enableDownload();
}

function removeFloor(floor) {
    delete data[floor];
    renderFloor();
    if (accordionPanel.childElementCount == 0) disableDownload();
}

function renderFloorItem(floor) {
    return `
    <div class="accordion-item">
        <h2 class="accordion-header" id="${floor}AccordianHeading">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${floor}AccordianCollapse" aria-expanded="false" aria-controls="${floor}AccordianCollapse">
                ${floor}
            </button>
        </h2>
        <div id="${floor}AccordianCollapse" class="accordion-collapse collapse" aria-labelledby="${floor}AccordianHeading" data-bs-parent="#accordionPanel">
            <div class="accordion-body">
                <select id="${floor}SectionBody" class="form-select" multiple aria-label="${floor}SectionBody" onclick="renderLayout(this);"></select>
                <div class="btn-group" role="group" aria-label="${floor}SectionButtons">
                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#sectionModal" floor="${floor}">${svg_plus}</button>
                    <button type="button" class="btn btn-secondary" onclick="removeSection('${floor}');">${svg_dash}</button>
                </div>
                <div class="btn-group" role="group" aria-label="${floor}SectionButtons">
                    <button type="button" class="btn btn-secondary" onclick="moveSelected(this.parentElement.parentElement.childNodes[1],moveU,renderSection,${sectionSelect});">${svg_u}</button>
                    <button type="button" class="btn btn-secondary" onclick="moveSelected(this.parentElement.parentElement.childNodes[1],moveD,renderSection,${sectionSelect});">${svg_d}</button>
                </div>
            </div>
        </div>
    </div>`;
}

function setShelfModalReturn(r) {
    let shelfReturn = document.getElementById("shelfModalReturn");
    switch(r) {
        case 'sectionModal':
            const floor = document.getElementById('emfloor').innerText;
            shelfReturn.innerHTML = `<button class="btn btn-secondary" data-bs-target="#sectionModal" data-bs-toggle="modal" floor="${floor}">Close</button>`;
            break;
        case 'edit':
            shelfReturn.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
        default:
            break;
    }
}

function addSection() {
    const floor = document.getElementById('emfloor').innerText;
    const isleStartV = parseInt(isleStart.value);
    const isleEndV = parseInt(isleEnd.value);
    const isleDirV = isleDir.getAttribute('dir') === 'true';
    const islePairV = document.getElementById('islePair').checked;
    const binStartV = parseInt(binStart.value);
    const binOffsetV = parseInt(binOffset.value);
    const binSegmentV = parseInt(binSegment.value);
    const binCountV = parseInt(binCount.value);

    data[floor].push({
        isleStart: isleStartV,
        isleEnd: isleStartV % 2 == isleEndV % 2 ? isleEndV + 1 : isleEndV,
        isleDirection: isleDirV,
        islePair: islePairV,
        binStart: binStartV,
        binOffset: binOffsetV,
        binSegment: binSegmentV,
        binCount: binCountV,
        pickPath: [],
        mods: {
            direction: {},
            exclude: {},
        }
    });

    renderSection(floor);
}

function renderSection(floor) {
    // to reference a Section internally use sectionIndex
    // dont use the display name
    let sectionE = document.getElementById(`${floor}SectionBody`);
    let floorSection = data[floor];
    sectionE.innerHTML = '';
    for (sectionIndex in floorSection) {
        let section = floorSection[sectionIndex];
        sectionE.innerHTML += `<option floor="${floor}" sectionIndex="${sectionIndex}">${section.isleStart}-${section.isleEnd}</option>`
    }
}

function removeSection(floor) {
    const layout = document.getElementById('sectionLayout');
    const layoutFloor = layout.getAttribute('floor');
    const layoutSection = layout.getAttribute('sectionIndex');
    let sectionE = document.getElementById(`${floor}SectionBody`);
    if (sectionE.options.length == 0) return removeFloor(floor);
    if (sectionE.selectedOptions.length == 0) return;
    let removes = [];
    for (selection of sectionE.selectedOptions) {
        removes.push(parseInt(selection.getAttribute('sectionIndex')));
    }
    removes.reverse();
    if (floor === layoutFloor) {
        for (selection of removes) {
            data[floor].splice(selection, 1);
            if (selection == layoutSection) {
                clearLayout();
                clearPickPath();
            }
        }
    } else {
        for (selection of removes) {
            data[floor].splice(selection, 1);
        }
    }
    renderSection(floor);
}

function removePick(event) {
    const floor = sectionLayout.getAttribute('floor');
    const sectionIndex = sectionLayout.getAttribute('sectionIndex');
    let pickPath = data[floor][sectionIndex].pickPath;
    let options = event.parentElement.previousElementSibling.previousElementSibling.selectedOptions;
    let removes = [];
    for (option of options) {
        removes.push(parseInt(option.getAttribute('sectionIndex')));
    }
    removes.reverse()
    for (index of removes) {
        pickPath.splice(index,1);
    }
    renderPickPath();
}

function resetPick() {
    const floor = sectionLayout.getAttribute('floor');
    const sectionIndex = sectionLayout.getAttribute('sectionIndex');

    section = data[floor][sectionIndex];
    section.pickPath = [];
    section.mods = {
        direction: {},
        exclude: {},
    };

    renderLayout(document.getElementById(`${floor}SectionBody`));
}

function renderFloor() {
    accordionPanel.innerHTML = '';
    for (floor in data) {
        accordionPanel.innerHTML += renderFloorItem(floor);
        renderSection(floor);
    }
    clearLayout();
    clearPickPath();
}

function appendFloorView(floor) {
    accordionPanel.innerHTML += renderFloorItem(floor);
}

function validate(event, condition, buttonID, validator) {
    let button = document.getElementById(buttonID);
    if (condition) {
        validation[buttonID][validator] = false;
        event.classList.remove('is-invalid');
        if (Object.values(validation[buttonID]).filter(r => r).length == 0) {
            button.disabled = false;
        }
    } else {
        validation[buttonID][validator] = true;
        event.classList.add('is-invalid');
        button.disabled = true;
    }
}

function validateFloorInput(event) {
    validate(event, event.validity.valid, 'addFloorButton', 'floorInput');
}

function validateSectionAdd() {
    validate(isleStart, isleStart.value > 0, 'sectionAddButton', 'isleStart');
    validate(isleEnd, parseInt(isleEnd.value) > parseInt(isleStart.value), 'sectionAddButton', 'isleEnd');
    validate(binStart, parseInt(binStart.value) > 0, 'sectionAddButton', 'binStart');
    validate(binOffset, parseInt(binOffset.value) > parseInt(binCount.value), 'sectionAddButton', 'binOffset');
    validate(binSegment, parseInt(binSegment.value) > 0, 'sectionAddButton', 'binSegment');
    validate(binCount, parseInt(binOffset.value) > parseInt(binCount.value), 'sectionAddButton', 'binCount');
}

function renderLayoutCol(isle, bin, binCount, direction, directionHTML, step) {
    const id = genIsleBinID(isle, bin);
    let col =
        `
    <div class="col border">
        <div class="container">
            <div class="row mb-1">
                <div class="col">
                </div>
                <div class="col border-bottom" align="center">
                    <span class="align-middle">${bin}-${bin + binCount}</span>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col-5">
                    <div class="container">
                        <div class="row">
                            <div class="col border rounded" align="center">
                                <span class="align-middle">${isle}</span>
                            </div>
                        </div>`

    if (step == 2) {
        col += `<div class="row mb-2">
                            <div class="col border rounded" align="center">
                                <span class="align-middle">${isle + 1}</span>
                            </div>
                        </div>`
    }

    col += `</div>
                </div>
                <div class="col">
                    <div class="input-group mb-3" align="center">
                        <button type="button" class="btn btn-secondary" onclick="updateDirection(${isle},${bin});"><div id="${id}DIR" dir="${direction}" binOffset="${binOffset}">${directionHTML}</div></button>
                        <button class="btn btn-outline-secondary" type="button" onclick="togglePath(${isle},${bin});" id="${id}"> X </button>
                    </div>
                </div>
            </div>
        </div>                            
    </div>
    `
    return col;
}

function renderLayoutRow(isle, direction, directionHTML, layout, step) {
    const binStart = layout.binStart;
    const binOffset = layout.binOffset;
    const binSegment = layout.binSegment;
    const binCount = layout.binCount;
    const binMax = binStart + binOffset * binSegment;
    let secLayout = `<div class="row">`
    for (let i = binStart; i < binMax; i += binOffset) {
        secLayout += renderLayoutCol(isle, i, binCount, direction, directionHTML, step);
    }
    sectionLayout.innerHTML += secLayout;
}

function clearLayout() {
    sectionLayout.innerHTML = '';
}

function renderLayout(event) {
    const section = event.selectedIndex;
    if (section == -1) return;
    const floor = event.options[section].getAttribute('floor');
    const layout = data[floor][section];
    const start = layout.isleStart;
    const end = layout.isleEnd;
    const step = layout.islePair?2:1;
    let direction = layout.direction;
    sectionLayout.innerHTML = '';
    for (let i = start; i < end; i += step) {
        renderLayoutRow(i, direction, direction ? svg_l : svg_r, layout, step);
        direction = !direction;
    }
    sectionLayout.setAttribute('floor', floor);
    sectionLayout.setAttribute('sectionIndex', section);
    renderPickPath();
    renderLayoutPickPath();
    renderLayoutDirections();
}

function genIsleBinID(isle, bin) {
    return `${isle}-${bin}`;
}

function togglePath(isle, bin) {
    const floor = sectionLayout.getAttribute('floor');
    const section = sectionLayout.getAttribute('sectionIndex');
    let fsPickPath = data[floor][section].pickPath;
    let id = genIsleBinID(isle, bin);
    if (fsPickPath.includes(id)) {
        fsPickPath.splice(fsPickPath.indexOf(id), 1);
        document.getElementById(id).innerText = " X ";
    } else {
        fsPickPath.push(id);
        document.getElementById(id).innerText = fsPickPath.length;
    }
    renderPickPath();
    renderLayoutPickPath();
}

function renderPickPath() {
    const floor = sectionLayout.getAttribute('floor');
    const sectionIndex = sectionLayout.getAttribute('sectionIndex');
    const section = data[floor][sectionIndex];
    const fsPickPath = section.pickPath;
    const startI = section.isleStart;
    const endI = section.isleEnd;
    const startB = section.binStart;
    const endB = section.binStart * section.binSegment;
    let isleOrder = `
    <h6 align="center">Pick Path <em>${startI}-${endI},${startB}-${endB}</em></h6>
        <select class="form-select" multiple aria-label="isleOrder" size="${fsPickPath.length}">`;
    for (subSec in fsPickPath) {
        isleOrder += `<option value="${fsPickPath[subSec]}" sectionIndex="${subSec}">${fsPickPath[subSec]}</option>`;
    }
    isleOrder += `
        </select>
        <div class="btn-group" role="group" aria-label="pickPathMoveButtons">
            <button type="button" class="btn btn-secondary" onclick="moveSelected(this.parentElement.previousSibling.previousElementSibling,moveU,renderPickPath,${pickPathSelect});">${svg_u}</button>
            <button type="button" class="btn btn-secondary" onclick="moveSelected(this.parentElement.previousSibling.previousElementSibling,moveD,renderPickPath,${pickPathSelect});">${svg_d}</button>
        </div>
        <div class="btn-group" role="group" aria-label="pickPathRemoveButton">
            <button type="button" class="btn btn-secondary" onclick="removePick(this);">${svg_x}</button>
        </div>
        <div class="btn-group" role="group" aria-label="pickPathResetButton">
            <button type="button" class="btn btn-secondary" onclick="resetPick();">Reset</button>
        </div>`;
    pickPath.innerHTML = isleOrder;
}

function clearPickPath() {
    pickPath.innerHTML = '';
}

function renderLayoutPickPath() {
    const floor = sectionLayout.getAttribute('floor');
    const section = sectionLayout.getAttribute('sectionIndex');
    let fsPickPath = data[floor][section].pickPath;
    for (element in fsPickPath) {
        let id = fsPickPath[element];
        document.getElementById(id).innerText = parseInt(element) + 1;
    }
}

// function moveSelected(event,moveDir) {
//     let floor = event.parentElement.getAttribute('aria-label');
//     floor = floor.slice(0,floor.length-14);
//     let sectionIndices = [];
//     for (option of document.getElementById(`${floor}SectionBody`).selectedOptions) {
//         sectionIndices.push(parseInt(option.getAttribute('sectionIndex')));
//     }
//     sectionIndices.reverse();
//     let temp;
//     for (sectionIndex of sectionIndices) {
//         if ((sectionIndex == -1) ||
//             (sectionIndex == 0 && moveDir == moveU) ||
//             (sectionIndex == data[floor].length-1 && moveDir == moveD)) continue;
//         temp = data[floor][sectionIndex+moveDir];
//         data[floor][sectionIndex+moveDir] = data[floor][sectionIndex];
//         data[floor][sectionIndex] = temp;
//     }
//     renderSection(floor);
// }

function moveSelected(event,moveDir,render,whichSelect) {
    let floor = document.getElementsByClassName('accordion-button');
    for (item of floor) {
        if (item.getAttribute('aria-expanded')==='true') {
            floor = item.getAttribute('aria-controls');
        }
    }
    floor = floor.slice(0,floor.length-17);
    let indices = [];
    for (option of event.selectedOptions) {
        indices.push(parseInt(option.getAttribute('sectionIndex')));
    }
    indices.reverse();
    let temp, select;
    const section = sectionLayout.getAttribute('sectionIndex');
    switch (whichSelect) {
        case sectionSelect:
            select = data[floor];
            break;
        case pickPathSelect:
            select = data[floor][section].pickPath;
        default:
            break;
    }
    for (index of indices) {
        if ((index == -1) ||
            (index == 0 && moveDir == moveU) ||
            (index == data[floor].length-1 && moveDir == moveD)) continue;
        temp = select[index+moveDir];
        select[index+moveDir] = select[index];
        select[index] = temp;
    }
    render(floor);
}

//for troubleshooting when needing to compare changes in same object
function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}