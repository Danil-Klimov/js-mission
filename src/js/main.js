'use strict';
window.addEventListener("load", init, false);

let leftPos;
let topPos;
let currentElem  = null;
let table        = document.getElementById("table");
let tableRows    = document.getElementsByClassName("table__row");
let buttons      = document.getElementById("buttons");
let delButtons   = document.getElementById("del-btn");
let delRowButton = document.getElementById("del-row");
let delColButton = document.getElementById("del-col");
let addRowButton = document.getElementById("add-row");
let addColButton = document.getElementById("add-col");

function init() {
    buttons.addEventListener("mouseover", function () {
        lastDisplay();
        delButtons.style.display = "flex";
    }, false);
    buttons.addEventListener("mouseout", function () {
        delButtons.style.display = "none";
    }, false);
    table.addEventListener("mouseover", mouseOver, false);
    table.addEventListener("mouseover", showDelButtons, false);
    table.addEventListener("mouseout", mouseOut, false);
    table.addEventListener("mouseout", hideDelButtons, false);
    addRowButton.addEventListener("click", addRow, false);
    addColButton.addEventListener("click", addCol, false);
    delRowButton.addEventListener("click", delRow, false);
    delColButton.addEventListener("click", delCol, false);
}
function addRow() {
    let cloneRow = table.lastChild.cloneNode(true);
    let newRow   = table.appendChild(cloneRow);
    let attr     = newRow.getAttribute("data-row");
    newRow.setAttribute("data-row", +attr+1);
}
function addCol() {
    for(let i=0; tableRows[i] !== undefined; i++) {
        let cloneCell = tableRows[i].lastChild.cloneNode(true);
        let newCell   = tableRows[i].appendChild(cloneCell);
        let attr      = newCell.getAttribute("data-col");
        newCell.setAttribute("data-col", +attr+1);
    }
}
function delRow() {
    let thisAttr = this.getAttribute("data-row");
    for (let i = 0; i < tableRows.length; i++) {
        if (tableRows[i].getAttribute("data-row") === thisAttr) {
            let removeRow = tableRows[i];
            if(removeRow === tableRows.item(+tableRows.length-1)) {
                delRowButton.style.top = (topPos - 50) + "px";
            }
            removeRow.remove();
        }
    }
    delButtons.style.display = "none";
}
function delCol() {
    let thisAttr = this.getAttribute("data-col");
    for(let i=0; tableRows[i] !== undefined; i++) {
        for(let j=0; tableRows[i].childNodes[j] !== undefined; j++) {
            let currentCol = tableRows[i].childNodes[j];
            if (currentCol.getAttribute("data-col") === thisAttr) {
                if(currentCol === tableRows[i].childNodes.item(tableRows[i].childNodes.length-1)) {
                    delColButton.style.left = (leftPos - 50) + "px";
                }
                currentCol.remove();
            }
        }
    }
    delButtons.style.display = "none";
}

function mouseOver(e) {
    if (currentElem) return;
    let target = e.target;
    while (target !== this) {
        if (target.className === "table__cell") break;
        target = target.parentNode;
    }
    if (target === this) return;
    currentElem = target;
}
function mouseOut(e) {
    if (!currentElem) return;
    let relatedTarget = e.relatedTarget;
    if (relatedTarget) {
        while (relatedTarget) {
            if (relatedTarget === currentElem) return;
            relatedTarget = relatedTarget.parentNode;
        }
    }
    currentElem = null;
}

function showDelButtons() {
    lastDisplay();
    delButtons.style.display = "flex";
    if(currentElem !== null) {
        let targetCord   = currentElem.getBoundingClientRect();
        let targetParent = currentElem.parentNode;
        leftPos = targetCord.left;
        topPos = targetCord.top;
        delColButton.style.left = leftPos + "px";
        delRowButton.style.top = topPos + "px";
        delRowButton.setAttribute("data-row", targetParent.getAttribute("data-row"));
        delColButton.setAttribute("data-col", currentElem.getAttribute("data-col"));
    }
}
function hideDelButtons() {
    delButtons.style.display = "none";
    delButtons.style.display = "none";
}
function lastDisplay() {
    if(tableRows.length === 1) {
        delRowButton.style.display = "none";
    } else {
        delRowButton.style.display = "";
    }
    if(tableRows[0].childNodes.length === 1) {
        delColButton.style.display = "none";
    } else {
        delColButton.style.display = "";
    }
}