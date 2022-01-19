const api = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : `http://${window.location.hostname}/api`;

document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector('#data-table tbody');

    // Populates the table initially from the database
    fetch(`${api}/items`)
    .then(resp => resp.json())
    .then(data => {
        fillTable(data);
    });

    // Event handlers for buttons 
    document.querySelector('#export-csv').addEventListener('click', () => {
        window.location.href = '/api/csv';
    });

    document.querySelector('#goto-api').addEventListener('click', () => {
        window.location.href = '/api/items';
    });

    // Event handlers for forms [create, update, filter, reset-filter]
    document.querySelector('#create-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#name').value;
        const desc = document.querySelector('#desc').value;
        const unit_price = document.querySelector('#unit_price').value;
        const qty = document.querySelector('#qty').value;
        
        postData(`${api}/item/add`, {name: name, desc: desc, unit_price: unit_price, qty: qty})
        .then(data => {
            console.log(data);
            window.location.reload();
        })
        .catch(err => console.log(err));
    });

    document.querySelector('#update-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.querySelector('#entry_id').textContent;
        const name = document.querySelector('#name_update').value;
        const desc = document.querySelector('#desc_update').value;
        const unit_price = document.querySelector('#unit_price_update').value;
        const qty = document.querySelector('#qty_update').value;
        
        updateData(`${api}/item/update/${id}`, {name: name, desc: desc, unit_price: unit_price, qty: qty})
        .then(data => {
            console.log(data);
            window.location.reload();
        })
        .catch(err => console.log(err));
    });

    document.querySelector('#filter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name_contains = document.querySelector('#name_contains_field').value;

        getData(`${api}/item/name/${name_contains}`)
        .then(data => {
            table.innerHTML = "";
            fillTable(data);
        })
        .catch(err => console.log(err));
    });

    document.querySelector('#reset-form').addEventListener('submit', (e) => {
        e.preventDefault();

        getData(`${api}/items`)
        .then(data => {
            table.innerHTML = "";
            fillTable(data);
        })
        .catch(err => console.log(err));
    });

    /* fillTable(data)
     *
     * This is a helper function that simply creates new table entries given a JSON data variable.
     * It creates the data entry and the event handlers for the update / delete buttons.
     * 
     */
    const fillTable = data => {
        data.data.forEach(entry => {
            createEntry(entry);

            document.querySelector(`#delete-btn-${entry.id}`).addEventListener('click', (e) => {
                deleteData(`${api}/item/delete/${e.target.dataset.id}`)
                .then(data => {
                    console.log(data);
                    window.location.reload();
                })
                .catch(err => console.log(err));
            });

            document.querySelector(`#update-btn-${entry.id}`).addEventListener('click', (e) => {
                const item_id = document.querySelector('#entry_id');
                item_id.style.backgroundColor = 'lightgrey';
                item_id.textContent = `${e.target.dataset.id}`;

                getData(`${api}/item/${e.target.dataset.id}`)
                .then(data => {
                    document.querySelector('#name_update').value = data.entry.name;
                    document.querySelector('#desc_update').value = data.entry.desc;
                    document.querySelector('#unit_price_update').value = data.entry.unit_price;
                    document.querySelector('#qty_update').value = data.entry.qty;
                })
                .catch(err => console.log(err));
            });
        });
    }

    /* createEntry(entry)
     *
     * This is a helper function that creates a new data table entry 
     * from the given data of the 'entry' object.
     * 
     */
    const createEntry = entry => {
        const tr = document.createElement('tr');
        tr.setAttribute('id', `tr-${entry.id}`);
    
        // Table data cell elements
        const th_id = document.createElement('th');
        th_id.setAttribute('scope', 'row');
        th_id.textContent = entry.id;
    
        const name = document.createElement('td');
        name.textContent = entry.name;
    
        const desc = document.createElement('td');
        desc.textContent = entry.desc;
    
        const unit_price = document.createElement('td');
        unit_price.textContent = `$${entry.unit_price}`;
    
        const qty = document.createElement('td');
        qty.textContent = entry.qty;

        // Update button
        const updateBtn = document.createElement('button');
        updateBtn.setAttribute('type', 'button');
        updateBtn.setAttribute('data-bs-toggle', 'modal');
        updateBtn.setAttribute('data-bs-target', '#update-modal');
        updateBtn.setAttribute('class', 'btn btn-outline-warning btn-sm');
        updateBtn.setAttribute('id', `update-btn-${entry.id}`);
        updateBtn.style.marginRight = '5px';
        updateBtn.dataset.id = entry.id;
        updateBtn.textContent = 'Update';

         // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('type', 'button');
        deleteBtn.setAttribute('class', 'btn btn-outline-danger btn-sm');
        deleteBtn.setAttribute('id', `delete-btn-${entry.id}`);
        deleteBtn.dataset.id = entry.id;
        deleteBtn.textContent = 'Delete';

        // Table data cell element for buttons
        const BtnContainer = document.createElement('td');
        BtnContainer.style.display = 'flex';
        BtnContainer.style.justifyContent = 'flex-end'
        BtnContainer.appendChild(updateBtn);
        BtnContainer.appendChild(deleteBtn);

        tr.appendChild(th_id);
        tr.appendChild(name);
        tr.appendChild(desc);
        tr.appendChild(unit_price);
        tr.appendChild(qty);
        tr.appendChild(BtnContainer);
        
        table.appendChild(tr);
    };
});

