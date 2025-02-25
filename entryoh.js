// Fungsi untuk menampilkan data ke tabel
function populateTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = `
            <tr>
                <td>${item.plu}</td>
                <td>${item.description}</td>
                <td>
                    <input type="number" 
                           class="form-control oh-input" 
                           value="${item.oh || 0}" 
                           data-plu="${item.plu}"
                           style="width: 100px">
                </td>
            </tr>`;
        tbody.innerHTML += row;
    });

    // Tambahkan event listener untuk input OH
    document.querySelectorAll('.oh-input').forEach(input => {
        input.addEventListener('change', function() {
            const plu = this.dataset.plu;
            const newOh = parseInt(this.value) || 0; // Nilai baru dari input OH
            
            // Update data di Local Storage
            const storedData = JSON.parse(localStorage.getItem('fetchedData'));
            const updatedData = storedData.map(item => {
                if (item.plu === plu) {
                    return {
                        ...item,
                        oh: newOh, // Perbarui nilai OH
                        selisih: item.total - newOh // Hitung nilai selisih
                    };
                }
                return item;
            });

            // Simpan data yang diperbarui ke Local Storage
            localStorage.setItem('fetchedData', JSON.stringify(updatedData));
        });
    });
}

// Memuat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    const storedData = JSON.parse(localStorage.getItem('fetchedData'));
    if (storedData) {
        // Proses data untuk memastikan ada properti total dan selisih
        const processedData = storedData.map(item => ({
            ...item,
            total: item.total || (item.qty + (item.rapj || 0)), // Hitung total jika belum ada
            oh: item.oh || 0, // Pastikan nilai OH ada
            selisih: item.selisih || (item.total - (item.oh || 0)) // Hitung selisih
        }));
        
        localStorage.setItem('fetchedData', JSON.stringify(processedData));
        populateTable(processedData);
    }
});

// Navigasi ke halaman berikutnya
document.getElementById('nextPageButton').addEventListener('click', function() {
    window.location.href = 'cetakselisih.html';
});
