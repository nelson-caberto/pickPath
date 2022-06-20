const sectionModal = document.getElementById('sectionModal');
sectionModal.addEventListener('show.bs.modal', event => {
    const floor = event.relatedTarget.getAttribute('floor');
    document.getElementById('sectionModalLabel').innerHTML = `Create Section on Floor <em id="emfloor">${floor}</em>`;
});

let direction = false;
let l = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
</svg>`;
let r = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
</svg>`;
let u = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
</svg>`;
let d = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
</svg>`;
let plus = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
</svg>`;
let dash = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
</svg>`;

let initDIR = document.getElementById('ZZDIR');
initDIR.setAttribute('dir',direction);
initDIR.innerHTML = direction?l:r;

disableDownload();

let data = {};

function loadpaths() {
    document.getElementById('pickPathfile').click();
}

function savepaths() {
    alert('TODO: write me');
}

function enableDownload() {
    document.getElementById('downloadButton').disabled = false;
    document.getElementById('downloadSelect').disabled = false;
}

function disableDownload() {
    document.getElementById('downloadButton').disabled = true;
    document.getElementById('downloadSelect').disabled = true;
}

function revDir(isle,bin) {
    const id = genIsleBinID(isle,bin);
    let arrow = document.getElementById(`${id}DIR`);
    let newdir = arrow.getAttribute("dir") !== 'true';
    arrow.innerHTML = newdir?l:r;
    arrow.setAttribute("dir",newdir);
}

function addFloor() {
    let floorName = document.getElementById('addFloorInput').value;
    // if foorName is in data, do nothing. TODO: should have confirmation popup
    if (floorName === '' || floorName in data) return;
    data[floorName] = [];
    appendFloorView(floorName);
    if (document.getElementById('accordionPanel').childElementCount > 0) enableDownload();
}

function removeFloor(floor) {
    delete data[floor];
    renderFloor();
    if (document.getElementById('accordionPanel').childElementCount == 0) disableDownload();
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
                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#sectionModal" floor="${floor}">${plus}</button>
                    <button type="button" class="btn btn-secondary" onclick="removeSection('${floor}');">${dash}</button>
                </div>
                <div class="btn-group" role="group" aria-label="${floor}SectionButtons">
                    <button type="button" class="btn btn-secondary" onclick="alert('TODO: write me');">${u}</button>
                    <button type="button" class="btn btn-secondary" onclick="alert('TODO: write me');">${d}</button>
                </div>
            </div>
        </div>
    </div>`;
}

function addSection() {
    const floor = document.getElementById('emfloor').innerText;
    const isleStart = parseInt(document.getElementById('isleStart').value);
    const isleEnd = parseInt(document.getElementById('isleEnd').value);
    const isleDirection = document.getElementById('ZZDIR').getAttribute('dir') === 'true';
    const islePair = document.getElementById('islePair').value;
    const binStart = parseInt(document.getElementById('binStart').value);
    const binOffset = parseInt(document.getElementById('binOffset').value);
    const binSegment = parseInt(document.getElementById('binSegment').value);
    const binCount = parseInt(document.getElementById('binCount').value);

    data[floor].push({
        isleStart:isleStart,
        isleEnd:isleStart%2==isleEnd%2?isleEnd+1:isleEnd,
        isleDirection:isleDirection,
        islePair:islePair,
        binStart:binStart,
        binOffset:binOffset,
        binSegment:binSegment,
        binCount:binCount,
        pickPath:[],
        mods:{
            direction:{}
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
            data[floor].splice(selection,1);
            if (selection == layoutSection) {
                clearLayout();
                clearPickPath();
            }
        }
    } else {
        for (selection of removes) {
            data[floor].splice(selection,1);
        }    
    }
    renderSection(floor);
}

function renderFloor() {
    let sectionLayout = document.getElementById('accordionPanel');
    sectionLayout.innerHTML = '';
    for (floor in data) {
        sectionLayout.innerHTML += renderFloorItem(floor);
        renderSection(floor);
    }
    clearLayout();
    clearPickPath();
}

function appendFloorView(floor) {
    document.getElementById('accordionPanel').innerHTML += renderFloorItem(floor);
}

function validate(event, condition, button) {
    if (condition) {
        button.disabled = false;
        event.classList.remove('is-invalid');
    } else {
        button.disabled = true;
        event.classList.add('is-invalid');
    }    
}

function validateFloorInput(event) {
    let floorButton = document.getElementById('addFloorButton');
    validate(event,event.validity.valid,floorButton);
}

function validateIsleStart(event) {
    // must be a positive non zero number
    let addButton = document.getElementById('sectionAddButton');
    validate(event,event.value > 0,addButton);
}

function validateIsleEnd(event) {
    // cannot be less than isleStart
    let addButton = document.getElementById('sectionAddButton');
    const isleStart = parseInt(document.getElementById('isleStart').value);
    validate(event,event.value > isleStart,addButton);
}

function validateBinStart(event) {}
function validateBinOffset(event) {}
function validateBinSegment(event) {}
function validateBinCount(event) {}

function renderLayoutCol(isle,bin,binCount,direction,directionHTML) {
    const id = genIsleBinID(isle,bin);
    let col = 
    `
    <div class="col border">
        <div class="container">
            <div class="row mb-1">
                <div class="col">
                </div>
                <div class="col border-bottom" align="center">
                    <span class="align-middle">${bin}-${bin+binCount}</span>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col-5">
                    <div class="container">
                        <div class="row">
                            <div class="col border rounded" align="center">
                                <span class="align-middle">${isle}</span>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col border rounded" align="center">
                                <span class="align-middle">${isle+1}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3" align="center">
                        <button type="button" class="btn btn-secondary" onclick="revDir(${isle},${bin});"><div id="${id}DIR" dir="${direction}" binOffset="${binOffset}">${directionHTML}</div></button>
                        <button class="btn btn-outline-secondary" type="button" onclick="togglePath(${isle},${bin});" id="${id}"> X </button>
                    </div>
                </div>
            </div>
        </div>                            
    </div>
    `
    return col;
}

function renderLayoutRow(isle,direction,directionHTML,layout) {
    const binStart = layout.binStart;
    const binOffset = layout.binOffset;
    const binSegment = layout.binSegment;
    const binCount = layout.binCount;
    const binMax = binStart + binOffset * binSegment;
    let secLayout = `<div class="row">`
    for (let i = binStart; i < binMax; i+=binOffset) {
        secLayout += renderLayoutCol(isle,i,binCount,direction,directionHTML);
    }
    document.getElementById('sectionLayout').innerHTML += secLayout;
}

function clearLayout() {
    document.getElementById('sectionLayout').innerHTML = '';
}

function renderLayout(event) {
    const section = event.selectedIndex;
    if (section == -1) return;
    const floor = event.options[section].getAttribute('floor');
    const layout = data[floor][section];
    const isleStart = layout.isleStart;
    const isleEnd = layout.isleEnd;
    let direction = layout.direction;
    let sectionLayout = document.getElementById('sectionLayout');
    sectionLayout.innerHTML = '';
    for (let i = isleStart; i < isleEnd; i+=2) {
        renderLayoutRow(i,direction,direction?l:r,layout);
        direction = !direction;
    }
    sectionLayout.setAttribute('floor',floor);
    sectionLayout.setAttribute('sectionIndex',section);
    renderPickPath();
    renderLayoutPickPath();
}

function genIsleBinID(isle,bin) {
    return `${isle}-${bin}`;
}

function togglePath(isle,bin) {
    const layout = document.getElementById('sectionLayout');
    const floor = layout.getAttribute('floor');
    const section = layout.getAttribute('sectionIndex');
    let pickPath = data[floor][section].pickPath;
    let id = genIsleBinID(isle,bin);
    if (pickPath.includes(id)) {
        pickPath.splice(pickPath.indexOf(id),1);
        document.getElementById(id).innerText = " X ";
    } else {
        pickPath.push(id);
        document.getElementById(id).innerText = pickPath.length;
    }
    renderPickPath();
    renderLayoutPickPath();
}

function renderPickPath() {
    const layout = document.getElementById('sectionLayout');
    const floor = layout.getAttribute('floor');
    const section = layout.getAttribute('sectionIndex');
    let pickPath = data[floor][section].pickPath;
    let isleOrder = `
    <h6>Pick Path</h6>
        <select class="form-select mb-3" multiple aria-label="isleOrder" size="${pickPath.length}">`;
    for (subSec of pickPath) {
        isleOrder += `<option value="${subSec}">${subSec}</option>`;
    }
    isleOrder += `</select>`;
    document.getElementById('pickPath').innerHTML = isleOrder;
}

function clearPickPath() {
    document.getElementById('pickPath').innerHTML = '';
}

function renderLayoutPickPath() {
    const layout = document.getElementById('sectionLayout');
    const floor = layout.getAttribute('floor');
    const section = layout.getAttribute('sectionIndex');
    let pickPath = data[floor][section].pickPath;
    for (element in pickPath) {
        let id = pickPath[element];
        document.getElementById(id).innerText = parseInt(element) + 1;
    }
}