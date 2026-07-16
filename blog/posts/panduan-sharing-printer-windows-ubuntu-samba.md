---
title: "Panduan Lengkap Sharing Printer dari Windows ke Ubuntu Menggunakan Samba"
description: "Cara mudah membagikan printer dari komputer Windows (Host) ke komputer klien Ubuntu Linux melalui protokol Samba dan antarmuka web CUPS."
image: "/assets/images/printer-sharing-samba.png"
author: "Diona Katzlein"
date: "2026-07-16"
category: "Tutorial"
tags: ["windows", "ubuntu", "samba", "cups", "printer"]
slug: "panduan-sharing-printer-windows-ubuntu-samba"
---

# Panduan Lengkap Sharing Printer dari Windows ke Ubuntu Menggunakan Samba

Dalam lingkungan kantor atau rumah yang memiliki sistem operasi hibrida (campuran Windows dan Linux), berbagi perangkat keras (*resource sharing*) seperti printer adalah hal yang sangat umum. Menghubungkan printer yang terpasang di komputer Windows (sebagai Host) agar bisa digunakan oleh komputer klien Ubuntu Linux dapat diselesaikan dengan mudah menggunakan protokol **Samba** dan manajer pencetakan **CUPS** di Ubuntu.

Berikut adalah panduan lengkap dan teruji langkah demi langkah untuk melakukan konfigurasi dari sisi Windows Server hingga penyambungan di Ubuntu, lengkap dengan penanganan masalah (*troubleshooting*) jika Anda menemui kendala.

---

## Bagian 1: Konfigurasi di Windows (Host/Server)

Langkah awal ini wajib dilakukan agar sistem operasi Windows mengizinkan komputer lain di jaringan lokal (termasuk klien Linux) untuk mengakses dan mengirimkan perintah cetak ke printer Anda.

### 1. Aktifkan Network & Printer Sharing
1. Buka **Control Panel** -> **Network and Internet** -> **Network and Sharing Center** -> **Advanced sharing settings**.
2. Pada bagian profil jaringan yang aktif (biasanya **Private**), aktifkan opsi berikut:
   * **Turn on network discovery**
   * **Turn on file and printer sharing**
3. Di bagian **All Networks**:
   * Jika Anda ingin Ubuntu masuk tanpa memasukkan kredensial Windows, pilih **Turn off password protected sharing**.
   * Jika ingin koneksi tetap aman, pilih **Turn on password protected sharing** (Anda harus mencatat *Username* dan *Password* akun Windows Anda untuk dimasukkan di Ubuntu nanti).

### 2. Bagikan (Share) Printer & Atur Hak Akses
1. Buka **Control Panel** -> **Devices and Printers** (atau melalui menu *Printers & scanners* di Settings Windows).
2. Klik kanan pada printer Anda (misalnya: *Epson L3210*) dan pilih **Printer properties**.
3. Buka tab **Sharing**, lalu centang pilihan **Share this printer**.
4. Berikan **Share Name** yang sederhana, singkat, dan tanpa spasi (Contoh: `PrinterRuanganIT`).
5. Pindah ke tab **Security**, klik pada grup/user **Everyone** (atau *Guest*), lalu pastikan opsi **Print** berada pada status **Allow** (diizinkan).
6. Klik **Apply** lalu **OK**.

### 3. Catat IP Address Windows
Buka Command Prompt (cmd) di Windows, jalankan perintah `ipconfig`, lalu catat alamat **IPv4 Address** Anda (Contoh: `192.168.100.10`).

---

## Bagian 2: Menyambungkan ke PC Ubuntu via CUPS

Meskipun Ubuntu memiliki antarmuka grafis (GUI) bawaan untuk menambah printer, GUI bawaan terkadang mengalami kendala autentikasi protokol SMB. Penggunaan **CUPS Web Interface** (Common UNIX Printing System) jauh lebih stabil dan sangat direkomendasikan.

### 1. Install Paket Pendukung & Aktifkan CUPS Web
Buka terminal di Ubuntu (Ctrl + Alt + T), lalu jalankan perintah berikut secara berurutan:
```bash
sudo apt update
sudo apt install cups smbclient python3-smbc -y
sudo cupsctl WebInterface=yes
```

### 2. Tambahkan Printer melalui Browser
1. Buka browser favorit Anda (Firefox/Chrome), lalu akses alamat manajemen CUPS: 
   👉 **`http://localhost:631`**
2. Klik tab **Administration** di bagian atas, lalu klik tombol **Add Printer**.
   *(Catatan: Jika browser memunculkan pop-up permintaan Username dan Password, masukkan nama akun dan password login OS Ubuntu Anda).*
3. Di bawah menu *Other Network Printers*, pilih opsi **Windows Printer via SAMBA**, lalu klik **Continue**.
4. Pada kolom **Connection**, masukkan URL tujuan printer dengan format spesifik berikut:
   * **Opsi A: Jika Windows menggunakan password (Direkomendasikan)**:
     ```plaintext
     smb://username_windows:password_windows@IP_Windows/Nama_Share_Printer
     ```
     *Contoh nyata*: `smb://mypc:passwordkuatanda@192.168.100.10/PrinterRuanganIT`
   * **Opsi B: Jika Windows tanpa password (Turn off password protected)**:
     ```plaintext
     smb://IP_Windows/Nama_Share_Printer
     ```
     *Contoh nyata*: `smb://192.168.100.10/PrinterRuanganIT`
5. Klik **Continue**.
6. Berikan **Name** untuk printer Anda di Ubuntu (bebas, tanpa spasi, misal: `Printer_Epson_Server`), lalu klik **Continue**.
7. Pada pilihan **Make / Vendor**, pilih merk printer Anda (misal: *Epson*), klik **Continue**.
8. **Pilih Driver**: Pilih model driver yang sesuai dengan tipe printer fisik Anda (misal: *Epson L3210 Series - IPP Everywhere*).
9. Klik **Add Printer** untuk menyelesaikan proses.

> [!IMPORTANT]
> **Kewajiban Driver Printer**:
> Untuk memastikan printer dapat berfungsi dengan baik, **Anda wajib mengunduh dan menginstal file driver (PPD) yang sesuai dengan tipe printer fisik Anda**. Jika model printer tidak terdaftar di CUPS, Anda harus mengunduh driver Linux resmi (.deb atau .ppd) dari situs web produsen printer (Epson, Canon, HP, dll.) dan memilihnya secara manual saat proses penambahan printer.

---

## Bagian 3: Panduan Troubleshooting (Penanganan Masalah)

### ❌ Masalah 1: Error `NT_STATUS_IO_TIMEOUT` atau Status "Processing..." Tanpa Berhenti
* **Penyebab**: Windows Firewall memblokir paket data masuk dari komputer Ubuntu pada port Samba (Port 445/139).
* **Solusi di Windows**:
  1. Buka *Windows Defender Firewall* -> klik **Allow an app or feature through Windows Defender Firewall**.
  2. Klik **Change settings**, cari opsi **File and Printer Sharing**.
  3. Pastikan kolom **Private** dan **Public** sudah dicentang. Klik **OK**.

### ❌ Masalah 2: Error `NT_STATUS_ACCESS_DENIED` atau Print Share Inaccessible
* **Penyebab**: Kesalahan nama user/password akun Windows, atau Windows menolak akses anonim.
* **Solusi 1**: Jika Anda menggunakan **PIN** (angka) untuk login ke Windows, jangan masukkan PIN tersebut di CUPS. Anda harus memasukkan **Password utama/kata sandi** dari akun Microsoft/lokal Windows Anda.
* **Solusi 2**: Periksa kembali tab *Security* pada *Printer Properties* di Windows, pastikan user *Everyone* sudah diberi hak akses *Print*.

### ❌ Masalah 3: Printer Terkoneksi Normal Tetapi Hasil Cetak Kosong (Blank) atau Karakter Acak
* **Penyebab**: Driver printer yang dipilih di CUPS tidak cocok dengan tipe printer fisik.
* **Solusi**: Buka kembali `http://localhost:631`, masuk ke menu **Printers**, pilih printer Anda, lalu pada menu drop-down *Administration* pilih **Modify Printer**. Lanjutkan hingga pemilihan driver, dan coba ganti ke driver alternatif seperti tipe *Generic PCL* atau cari berkas `.ppd` resmi untuk Linux dari situs web produsen printer Anda.
