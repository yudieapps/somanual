 document.getElementById('searchButton').addEventListener('click', function() {
            const spinner = document.getElementById('spinner');
            const category = document.getElementById('categoryDropdown').value;
            
            if (!category) {
                alert("Silakan pilih kategori terlebih dahulu!");
                return;
            }

            const url = `https://script.google.com/macros/s/AKfycbweh0fwFrEplA_IGnKWzRJMZx3VONzYxmxQ_UGnZgbdh6m8UtQ630keSGjaMIgIl4dc/exec?value=${category}`;

            spinner.style.display = 'inline-block';
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    spinner.style.display = 'none';
                    localStorage.setItem('fetchedData', JSON.stringify(data));
                    populateTable(data);
                    document.getElementById('nextPageButton').style.display = 'block';
                })
                .catch(error => {
                    spinner.style.display = 'none';
                    console.error('Error:', error);
                });
        });

        // Di dalam fungsi populateTable, ubah bagian button edit:
function populateTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = `<tr>
            <td>${item.plu}</td>
            <td>${item.description}</td>
            <td>${item.qty}</td>
            <td>
                <button class="btn btn-sm btn-warning btn-edit" 
                        data-item='${JSON.stringify(item)}'>
                    <i class="bi bi-pencil"></i> Edit
                </button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

document.getElementById('tableBody').addEventListener('click', function(e) {
    if(e.target.closest('.btn-edit')) {
        const button = e.target.closest('.btn-edit');
        const itemData = JSON.parse(button.dataset.item);
        
        // Isi semua field di modal
        document.getElementById('editRak').value = itemData.rak;
        document.getElementById('editPlu').value = itemData.plu;
        document.getElementById('editBarcode').value = itemData.barcode;
        document.getElementById('editDesc').value = itemData.description;
        document.getElementById('editQty').value = itemData.qty;
        document.getElementById('editRapj').value = itemData.rapj;
        document.getElementById('editTotal').value = itemData.total;
        
        new bootstrap.Modal(document.getElementById('editModal')).show();
        currentEditItem = itemData;
    }
});

function updateOnHand() {
  const qty = parseInt(document.getElementById('editQty').value) || 0;
  const rapj = parseInt(document.getElementById('editRapj').value) || 0;
  document.getElementById('editTotal').value = qty + rapj;
}

// Event listeners untuk update On Hand
document.getElementById('editQty').addEventListener('input', updateOnHand);
document.getElementById('editRapj').addEventListener('input', updateOnHand);

// Apply Add Qty
document.getElementById('applyAddQty').addEventListener('click', function() {
  const addQty = parseInt(document.getElementById('addQty').value) || 0;
  const currentQty = parseInt(document.getElementById('editQty').value) || 0;
  document.getElementById('editQty').value = currentQty + addQty;
  document.getElementById('addQty').value = '';
  updateOnHand();
});

// Reset Qty
document.getElementById('resetQty').addEventListener('click', function() {
  document.getElementById('editQty').value = 0;
  document.getElementById('addQty').value = '';
  updateOnHand();
});

// Saat modal ditampilkan
document.getElementById('editModal').addEventListener('shown.bs.modal', function() {
  updateOnHand();
});

// Fungsi simpan data
document.getElementById('applyAddQty').addEventListener('click', function() {
  const updatedItem = {
    rak: document.getElementById('editRak').value,
    plu: document.getElementById('editPlu').value,
    barcode: document.getElementById('editBarcode').value,
    description: document.getElementById('editDesc').value,
    qty: parseInt(document.getElementById('editQty').value) || 0,
    rapj: parseInt(document.getElementById('editRapj').value) || 0,
    onhand: parseInt(document.getElementById('editTotal').value)
  };

  const storedData = JSON.parse(localStorage.getItem('fetchedData'));
  const updatedData = storedData.map(item => {
    return item.plu === currentEditItem.plu ? updatedItem : item;
  });
  
  localStorage.setItem('fetchedData', JSON.stringify(updatedData));
  populateTable(updatedData);
  bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
});
  

        // Fungsi Pencarian Tabel
        document.getElementById('tableSearchInput').addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();
            const rows = document.querySelectorAll('#tableBody tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                let matches = false;
                
                cells.forEach(cell => {
                    if (cell.textContent.toLowerCase().includes(searchValue)) {
                        matches = true;
                    }
                });
                
                row.style.display = matches ? '' : 'none';
            });
        });

        document.getElementById('nextPageButton').addEventListener('click', function() {
            window.location.href = 'halaman-berikutnya.html';
        });
