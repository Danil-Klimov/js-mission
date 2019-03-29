"use strict";
class Table {
    constructor(rows = 4, cols = 4) {
        this.rows = rows;
        this.cols = cols;
    }
    createTable(container) {
        const tableContainer = document.createElement("div");
        const table = document.createElement("table");
        tableContainer.classList.add("table__container");
        document.getElementById(container).appendChild(tableContainer);
        table.innerHTML = Array(this.rows).fill(`<tr>${Array(this.cols).fill("<td></td>").join('')}</tr>`).join('');
        tableContainer.appendChild(table).classList.add("table");
        this.constructor.createButtons(tableContainer);
        const delRowButton = tableContainer.querySelector(".del_row");
        const delColButton = tableContainer.querySelector(".del_col");
        const delButtons = [...tableContainer.querySelectorAll(".del")];
        const tableContainerLeftPosition = tableContainer.getBoundingClientRect().left;
        const tableContainerTopPosition = tableContainer.getBoundingClientRect().top;
        tableContainer.addEventListener("click", (e) => {
            const {target} = e;
            const rows = [...tableContainer.querySelectorAll("tr")];
            this.constructor.addRow(target, table, tableContainer);
            this.constructor.addCol(target, rows);
            this.constructor.delRow(target, table, delRowButton);
            this.constructor.delCol(target, rows, delColButton);
        });
        tableContainer.addEventListener("mouseover", (e) => {
            const {target, currentTarget} = e;
            const rowsLength = tableContainer.querySelector("tbody").rows.length;
            const colsLength = tableContainer.querySelector("tr").cells.length;
            if(target !== currentTarget && !target.classList.contains('add')) {
                delButtons.forEach((item) => item.classList.add("show"))
            }
            if (target.tagName === "TD") {
                this.constructor.moveH(target, tableContainerLeftPosition, delColButton);
                this.constructor.moveV(target, tableContainerTopPosition, delRowButton);
            }
            if (rowsLength === 1) {
                delRowButton.classList.remove("show")
            }
            if (colsLength === 1) {
                delColButton.classList.remove("show")
            }
        });
        tableContainer.addEventListener("mouseout", (e) => {
            let {relatedTarget} = e;
            if(relatedTarget === null || !relatedTarget.classList.contains("add")) {
                delButtons.forEach((item) => item.classList.remove("show"))
            }
        });
    }
    static createButtons(tableContainer) {
        const btnClass = [
            ["add", "add_row", "&#43;"],
            ["add", "add_col", "&#43;"],
            ["del", "del_row", "&ndash;"],
            ["del", "del_col", "&ndash;"]
        ];
        let newButton;
        btnClass.forEach((item) => {
            newButton = document.createElement("button");
            newButton.innerHTML = item[2];
            tableContainer.appendChild(newButton).classList.add("button", item[0], item[1]);
        });
    }
    static addRow(target, table, tableContainer) {
        const cells = [...tableContainer.querySelector("tr").cells];
        const frag = document.createDocumentFragment();
        if(target.classList.contains("add_row")) {
            cells.forEach(() => frag.appendChild(document.createElement("td")));
            table.insertRow().appendChild(frag);
        }
    }
    static addCol(target, rows) {
        if( target.classList.contains("add_col")) {
            rows.forEach((item) => item.insertCell());
        }
    }
    static delRow(target, table, delRowButton) {
        if(target.classList.contains("del_row")) {
            table.deleteRow(delRowButton.getAttribute("data-row"));
            delRowButton.classList.remove("show");
        }
    }
    static delCol(target, rows, delColButton) {
        if( target.classList.contains("del_col")) {
            rows.forEach((item) => item.deleteCell(+delColButton.getAttribute("data-col")));
            delColButton.classList.remove("show");
        }
    }
    static moveH(target, tableContainerLeftPosition, delColButton) {
        const targetPosition = target.getBoundingClientRect().left;
        delColButton.style.left = `${targetPosition - tableContainerLeftPosition}px`;
        delColButton.setAttribute("data-col", target.cellIndex);
    }
    static moveV(target, tableContainerTopPosition, delRowButton) {
        const targetPosition = target.getBoundingClientRect().top;
        delRowButton.style.top = `${targetPosition - tableContainerTopPosition}px`;
        delRowButton.setAttribute("data-row", target.closest("tr").rowIndex);
    }
}

let table = new Table();
table.createTable("root");