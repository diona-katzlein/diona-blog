---
title: "Cara Setting WireGuard di MikroTik untuk Akses Server Lokal dari Mana Saja"
description: "Panduan WireGuard di MikroTik RouterOS v7: buat interface, tukar kunci peer, atur firewall, dan akses server lokal dari HP atau laptop di mana saja dengan aman."
author: "Duscha Olya Arta Anas"
date: "2026-11-15"
category: "Tutorial"
tags: ["mikrotik", "wireguard", "vpn", "routeros", "jaringan"]
slug: "cara-setting-wireguard-mikrotik-akses-server-lokal"
---

# Cara Setting WireGuard di MikroTik untuk Akses Server Lokal dari Mana Saja

Punya server di jaringan lokal — Nextcloud, SIMRS, atau sekadar file sharing — tapi sering butuh diakses dari luar? Membuka port manajemen ke internet adalah undangan untuk bot brute force. Cara yang jauh lebih aman: VPN WireGuard di MikroTik. Setelah tersambung, perangkat Anda seolah berada di jaringan lokal yang sama, tanpa satu pun port layanan yang terekspos ke publik.

Panduan ini memakai RouterOS v7 (WireGuard sudah bawaan sejak v7) dan alamat contoh dari rentang dokumentasi — ganti dengan alamat jaringan Anda sendiri. Jangan pernah menaruh IP publik asli Anda di tutorial publik.

## Konsep Singkat: Bagaimana WireGuard Bekerja

WireGuard adalah VPN berbasis kunci publik: tiap ujung (server dan klien) punya pasangan kunci privat/publik. Server hanya menerima paket dari peer yang kunci publiknya sudah didaftarkan, dan hanya untuk alamat IP yang diizinkan (`AllowedIPs`). Tidak ada handshake username/password — kalau kuncinya tidak cocok, paket dibuang diam-diam. Itu sebabnya port WireGuard yang di-scan dari internet tampak "mati": tidak merespons sama sekali.

## Langkah 1: Buat Interface WireGuard di MikroTik

Masuk ke terminal MikroTik (Winbox → New Terminal, atau SSH) dan jalankan:

```
/interface wireguard
add name=wg1 listen-port=13231
print
```

Saat interface dibuat, RouterOS otomatis membuat pasangan kunci. Lihat kunci publik router dengan:

```
/interface wireguard print detail
```

Catat `public-key` router — ini yang akan dimasukkan ke konfigurasi klien. **Private key router jangan pernah dibagikan.**

## Langkah 2: Beri Alamat IP untuk Interface

```
/ip address
add address=10.8.0.1/24 interface=wg1
```

Jaringan `10.8.0.0/24` adalah jaringan VPN kita: router di `10.8.0.1`, klien pertama di `10.8.0.2`, dan seterusnya. Pastikan rentang ini tidak bentrok dengan jaringan LAN Anda.

## Langkah 3: Daftarkan Peer (Klien)

Buat kunci untuk klien dulu. Di HP atau laptop, buka aplikasi WireGuard dan buat tunnel baru — aplikasi akan menampilkan pasangan kunci. Ambil `public-key` klien, lalu daftarkan di router:

```
/interface wireguard peers
add interface=wg1 public-key="PUBLIC-KEY-KLIEN-DI-SINI" allowed-address=10.8.0.2/32
```

`allowed-address` adalah alamat VPN klien tersebut. Satu peer, satu alamat — jangan memberi alamat yang sama ke dua peer.

## Langkah 4: Buka Port WireGuard di Firewall

WireGuard butuh satu port UDP terbuka di firewall:

```
/ip firewall filter
add chain=input protocol=udp dst-port=13231 action=accept comment="WireGuard VPN"
```

Tempatkan aturan ini **di atas** aturan drop di chain input. Kalau aturan drop ada di atasnya, paket VPN tidak akan pernah sampai ke interface.

Untuk keamanan ekstra, batasi juga akses manajemen: jangan biarkan Winbox/WebFig bisa diakses dari sembarang alamat lewat VPN tanpa filter. Aturan yang baik: izinkan akses manajemen hanya dari jaringan VPN (`src-address=10.8.0.0/24`) dan dari LAN, tolak sisanya.

## Langkah 5: Konfigurasi Klien

Contoh konfigurasi di aplikasi WireGuard (HP/laptop). Ganti `203.0.113.10` dengan IP publik atau domain router Anda:

```ini
[Interface]
PrivateKey = <private-key-klien>
Address = 10.8.0.2/32
DNS = 10.8.0.1

[Peer]
PublicKey = <public-key-router>
Endpoint = 203.0.113.10:13231
AllowedIPs = 10.8.0.0/24
PersistentKeepalive = 25
```

`AllowedIPs = 10.8.0.0/24` artinya hanya trafik menuju jaringan VPN yang lewat tunnel — internet klien tetap lewat koneksi biasa (split tunnel). Kalau Anda ingin **semua** trafik lewat VPN, isi `AllowedIPs = 0.0.0.0/0`. `PersistentKeepalive = 25` menjaga tunnel tetap hidup di balik NAT.

## Langkah 6: Uji Koneksi

Aktifkan tunnel di klien, lalu:

- Ping router: `ping 10.8.0.1` — harus membalas.
- Coba akses layanan lokal, misal buka `http://10.8.0.1` (WebFig) atau alamat server lokal Anda.
- Di router, periksa `/interface wireguard peers print` — kolom `last-handshake` harus menunjukkan waktu baru.

Kalau handshake tidak pernah terjadi, periksa tiga hal: port UDP 13231 sudah terbuka dan diteruskan dengan benar (kalau router di belakang ISP NAT, pastikan port forwarding-nya), kunci publik tidak tertukar antara router dan klien, dan jam di kedua perangkat tidak selisih jauh.

## Tips Keamanan

1. **Satu peer, satu kunci.** Jangan memakai kunci yang sama di banyak perangkat — kalau satu perangkat hilang, Anda tinggal menghapus peer itu saja.
2. **Jangan buka port manajemen ke internet.** Winbox, SSH, dan WebFig sebaiknya hanya bisa diakses dari LAN dan jaringan VPN.
3. **Perbarui RouterOS.** WireGuard terus diperbaiki; jalankan versi long-term terbaru yang stabil untuk perangkat Anda.
4. **Catat semua peer.** Simpan daftar peer dan alamatnya di dokumentasi, supaya saat ada perangkat hilang Anda tahu persis peer mana yang harus dicabut.

Dengan WireGuard, server lokal Anda tetap lokal — tidak ada port layanan yang menghadap internet — tapi tetap bisa dijangkau dari mana saja, seaman berada di ruangan yang sama. Kombinasikan dengan [hardening SSH](/blog/cara-hardening-ssh-server-linux-kunci-ed25519.html) di servernya, dan akses jarak jauh Anda sudah berlapis dua.
