"use strict";
class Table {
    constructor(container, rows = 4, cols = 4) {
        this.rows = rows;
        this.cols = cols;
        if(this.rows < 1 || this.cols < 1) {
            return console.log("rows and cols must be >= 1")
        }
        this.container = document.querySelector(container);
        this.tableContainer = document.createElement("div");
        this.table = document.createElement("table");
        this._createButtons();
    }
    createTable() {
        this.tableContainer.classList.add("table-container");
        this.container.appendChild(this.tableContainer);
        this.tableContainer.appendChild(this.table);
        this.table.classList.add("table");
        this.addRow();
        this._listener();
    }
    addRow() {
        if(this.table.querySelectorAll("tr").length === 0) {
            this.table.innerHTML = Array(this.rows).fill(document.createElement("tr").outerHTML).join('');
            this.addCol('init')
        } else {
            let newRow = this.table.insertRow();
            this.table.querySelector("tr").childNodes.forEach(() => {
                newRow.appendChild(document.createElement("td"))
            });
        }
    };
    addCol(init) {
        if(init !== undefined) {
            this.table.querySelectorAll("tr").forEach((item) => {
                item.innerHTML = Array(this.cols).fill(document.createElement("td").outerHTML).join('');
            });
        } else {
            this.table.querySelectorAll("tr").forEach((item) => {
                item.appendChild(document.createElement("td"))
            });
        }
    };
    _delRow() {
        const delRowButton = this.tableContainer.querySelector(".table__button_del-row");
        this.table.deleteRow(+delRowButton.getAttribute("data-row"));
    };
    _delCol() {
        const delColButton = this.tableContainer.querySelector(".table__button_del-col");
        Array.from(this.table.rows).forEach((item) => item.deleteCell(+delColButton.getAttribute("data-col")));
    };
    _createButtons() {
        const btnClass = [
            {mainClass: "table__button_add", actionClass: "table__button_add-row", text: "&#43;"},
            {mainClass: "table__button_add", actionClass: "table__button_add-col", text: "&#43;"},
            {mainClass: "table__button_del", actionClass: "table__button_del-row", text: "&ndash;"},
            {mainClass: "table__button_del", actionClass: "table__button_del-col", text: "&ndash;"}
        ];
        btnClass.forEach((item) => {
            let newButton = document.createElement("button");
            newButton.innerHTML = item.text;
            this.tableContainer.appendChild(newButton).classList.add("table__button", item.mainClass, item.actionClass);
        });
    };
    _listener() {
        const delColButton = this.tableContainer.querySelector(".table__button_del-col");
        const delRowButton = this.tableContainer.querySelector(".table__button_del-row");
        const hideDelButtons = () => {
            this.tableContainer.querySelectorAll(".table__button_del").forEach((item) => {
                item.classList.remove("show");
            });
        };
        this.tableContainer.addEventListener("click", ({target}) => {
            if(target.classList.contains("table__button_add-row")) {
                this.addRow();
            }
            if(target.classList.contains("table__button_add-col")) {
                this.addCol();
            }
            if(target.classList.contains("table__button_del-row")) {
                this._delRow();
                hideDelButtons();
            }
            if(target.classList.contains("table__button_del-col")) {
                this._delCol();
                hideDelButtons();
            }
        });
        this.table.addEventListener("mouseover", ({target}) => {
            if(target.tagName === "TD") {
                this._move(target, delColButton, delRowButton);
            }
        }, );
        this.table.addEventListener("mouseenter", () => {
            const rowsLength = this.tableContainer.querySelector("tbody").rows.length;
            const colsLength = this.tableContainer.querySelector("tr").cells.length;
            this.tableContainer.querySelectorAll(".table__button_del").forEach((item) => {
                item.classList.add("show")
            });
            if (rowsLength === 1) {
                delRowButton.classList.remove("show")
            }
            if (colsLength === 1) {
                delColButton.classList.remove("show")
            }
        });
        this.table.addEventListener("mouseleave", () => {
            let timer;
            function timeout() {
                timer = setTimeout(() => {
                    hideDelButtons();
                },100)
            }
            timeout();
            this.tableContainer.addEventListener("mouseover", () => {
                clearTimeout(timer);
            });
            this.tableContainer.addEventListener("mouseout", () => {
                timeout();
            })
        });
    };
    _move(target, delColButton, delRowButton) {
        const targetLeftPosition = target.getBoundingClientRect().left;
        const targetTopPosition = target.getBoundingClientRect().top;
        delColButton.style.left = `${targetLeftPosition - this.tableContainer.offsetLeft + window.pageXOffset}px`;
        delColButton.setAttribute("data-col", target.cellIndex);
        delRowButton.style.top = `${targetTopPosition - this.tableContainer.offsetTop + window.pageYOffset}px`;
        delRowButton.setAttribute("data-row", target.closest("tr").rowIndex);
    };
}

let table = new Table("#root");
table.createTable();