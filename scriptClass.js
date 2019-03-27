"use strict";
class Table {
    constructor(row = 4, col = 4) {
        this.row = row;
        this.col = col;
    }
    createTable(container) {
        let mainContainer = document.getElementById(container);
        let tableContainer = document.createElement("div");
        let table = document.createElement("table");
        tableContainer.classList.add("table__container");
        mainContainer.appendChild(tableContainer);
        for (let i = 0; i < this.row; i++) {
            table.insertRow();
            for (let j = 0; j < this.col; j++) {
                let tbody = table.querySelector("tbody");
                tbody.rows[i].insertCell();
            }
        }
        tableContainer.appendChild(table).classList.add("table");
        this.constructor.createButtons(tableContainer);
        tableContainer.onclick = (e) => {
            let target = e.target;
            let tbody = tableContainer.querySelector("tbody");
            this.constructor.addRow(target, tbody, tableContainer);
            this.constructor.addCol(target, tableContainer);
            this.constructor.delRow(target, tbody, tableContainer);
            this.constructor.delCol(target, tableContainer);
        };
        tableContainer.onmouseover = (e) => {
            let target = e.target;
            let rowsLength = tableContainer.querySelector("tbody").rows.length;
            let colsLength = tableContainer.querySelector("tr").cells.length;
            let delRowButton = tableContainer.querySelector(".del_row");
            let delColButton = tableContainer.querySelector(".del_col");
            if(!target.classList.contains('add')) {
                let delButtons = [...tableContainer.querySelectorAll(".del")];
                delButtons.forEach((index) => {
                    index.classList.add("show");
                })
            }
            if (target.tagName === "TD") {
                this.constructor.moveH(target, tableContainer);
                this.constructor.moveV(target, tableContainer);
            }
            if (rowsLength === 1) {
                delRowButton.classList.remove("show")
            }
            if (colsLength === 1) {
                delColButton.classList.remove("show")
            }
        };
        tableContainer.onmouseout = (e) => {
            let target = e.relatedTarget;
            if(!target.classList.contains("add")) {
                let delButtons = [...tableContainer.querySelectorAll(".del")];
                delButtons.forEach((index) => {
                    index.classList.remove("show");
                })
            }
        }
    }
    static createButtons(container) {
        let btnClass = [["add", "add_row"], ["add", "add_col"], ["del", "del_row"], ["del", "del_col"]];
        btnClass.forEach((index) => {
            let newButton = document.createElement("button");
            index.forEach((item) => {
                switch (item) {
                    case "add":
                        newButton.innerHTML = "&#43;";
                        break;
                    case "del":
                        newButton.innerHTML = "&ndash;";
                        break;
                }
                container.appendChild(newButton).classList.add("button", item);
            })
        });
    }
    static addRow(target, tbody, tableContainer) {
        if(target.classList.contains("add_row")) {
            let frag = document.createDocumentFragment();
            let cells = [...tableContainer.querySelector("tr").cells];
            cells.forEach(() => {
                let td =  document.createElement("td");
                frag.appendChild(td);
            });
            tbody.insertRow().appendChild(frag);
        }
    }
    static addCol(target, tableContainer) {
        if( target.classList.contains("add_col")) {
            let rows = [...tableContainer.querySelectorAll("tr")];
            rows.forEach((index) => {
                index.insertCell();
            });
        }
    }
    static delRow(target, tbody, tableContainer) {
        if(target.classList.contains("del_row")) {
            let delRow = tableContainer.querySelector(".del_row");
            let attr = delRow.getAttribute("data-row");
            tbody.deleteRow(attr);
            delRow.classList.remove("show");
        }
    }
    static delCol(target, tableContainer) {
        if( target.classList.contains("del_col")) {
            let delCol = tableContainer.querySelector(".del_col");
            let attr = delCol.getAttribute("data-col");
            let rows = [...tableContainer.querySelectorAll("tr")];
            rows.forEach((index) => {
                index.deleteCell(+attr);
            });
            delCol.classList.remove("show");
        }
    }
    static moveH(target, tableContainer) {
        let leftPosition = tableContainer.querySelector("td").getBoundingClientRect().left;
        let button = tableContainer.querySelector(".del_col");
        let targetPosition = target.getBoundingClientRect().left;
        button.style.left = targetPosition  - leftPosition + "px";
        button.setAttribute("data-col", target.cellIndex);
    }
    static moveV(target, tableContainer) {
        let topPosition = tableContainer.querySelector("td").getBoundingClientRect().top;
        let button = tableContainer.querySelector(".del_row");
        let targetPosition = target.getBoundingClientRect().top;
        button.style.top = targetPosition - topPosition + "px";
        button.setAttribute("data-row", target.closest("tr").rowIndex);
    }
}

let table = new Table();
table.createTable("root");