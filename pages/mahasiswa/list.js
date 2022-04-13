import { CardContent, Chip } from '@mui/material';
import { Button, Grid, Box, Toolbar, Typography, CssBaseline, Container, Card, Paper } from '@mui/material';
import Header from '../../components/header';
import MenuFeeder from '../../components/menu';
import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const columns = [
  { field: 'nama_mahasiswa', headerName: 'nama_mahasiswa', width: 150 },
  { field: 'jenis_kelamin', headerName: 'jenis_kelamin', width: 100 },
  { field: 'tempat_lahir', headerName: 'tempat_lahir', width: 100 },
  { field: 'tanggal_lahir', headerName: 'tanggal_lahir', width: 100 },
  { field: 'id_agama', headerName: 'id_agama', width: 100 },
  { field: 'nik', headerName: 'nik', width: 100 },
  { field: 'nisn', headerName: 'nisn', width: 100 },
  { field: 'kewarganegaraan', headerName: 'kewarganegaraan', width: 100 },
  { field: 'jalan', headerName: 'jalan', width: 100 },
  { field: 'dusun', headerName: 'dusun', width: 100 },
  { field: 'rt', headerName: 'rt', width: 100 },
  { field: 'rw', headerName: 'rw', width: 100 },
  { field: 'kelurahan', headerName: 'kelurahan', width: 100 },
  { field: 'kode_pos', headerName: 'kode_pos', width: 100 },
  { field: 'id_wilayah', headerName: 'id_wilayah', width: 100 },
  { field: 'id_jenis_tinggal', headerName: 'id_jenis_tinggal', width: 100 },
  { field: 'id_alat_transportasi', headerName: 'id_alat_transportasi', width: 100 },
  { field: 'telepon', headerName: 'telepon', width: 100 },
  { field: 'handphone', headerName: 'handphone', width: 100 },
  { field: 'email', headerName: 'email', width: 100 },
  { field: 'penerima_kps', headerName: 'penerima_kps', width: 100 },
  { field: 'nomor_kps', headerName: 'nomor_kps', width: 100 },
  { field: 'nik_ayah', headerName: 'nik_ayah', width: 100 },
  { field: 'nama_ayah', headerName: 'nama_ayah', width: 100 },
  { field: 'tanggal_lahir_ayah', headerName: 'tanggal_lahir_ayah', width: 100 },
  { field: 'id_pendidikan_ayah', headerName: 'id_pendidikan_ayah', width: 100 },
  { field: 'id_pekerjaan_ayah', headerName: 'id_pekerjaan_ayah', width: 100 },
  { field: 'id_penghasilan_ayah', headerName: 'id_penghasilan_ayah', width: 100 },
  { field: 'nik_ibu', headerName: 'nik_ibu', width: 100 },
  { field: 'nama_ibu_kandung', headerName: 'nama_ibu_kandung', width: 100 },
  { field: 'tanggal_lahir_ibu', headerName: 'tanggal_lahir_ibu', width: 100 },
  { field: 'id_pendidikan_ibu', headerName: 'id_pendidikan_ibu', width: 100 },
  { field: 'id_pekerjaan_ibu', headerName: 'id_pekerjaan_ibu', width: 100 },
  { field: 'id_penghasilan_ibu', headerName: 'id_penghasilan_ibu', width: 100 },
  { field: 'npwp', headerName: 'npwp', width: 100 },
  { field: 'nama_wali', headerName: 'nama_wali', width: 100 },
  { field: 'tanggal_lahir_wali', headerName: 'tanggal_lahir_wali', width: 100 },
  { field: 'id_pendidikan_wali', headerName: 'id_pendidikan_wali', width: 100 },
  { field: 'id_pekerjaan_wali', headerName: 'id_pekerjaan_wali', width: 100 },
  { field: 'id_penghasilan_wali', headerName: 'id_penghasilan_wali', width: 100 },
  { field: 'id_kebutuhan_khusus_mahasiswa', headerName: 'id_kebutuhan_khusus_mahasiswa', width: 100 },
  { field: 'id_kebutuhan_khusus_ayah', headerName: 'id_kebutuhan_khusus_ayah', width: 100 },
  { field: 'id_kebutuhan_khusus_ibu', headerName: 'id_kebutuhan_khusus_ibu', width: 100 },
  { field: 'nim', headerName: 'nim', width: 100 },
  { field: 'daftar_nama', headerName: 'daftar_nama', width: 100 },
  { field: 'id_periode_masuk', headerName: 'id_periode_masuk', width: 100 },
  { field: 'kode_jurusan', headerName: 'kode_jurusan', width: 100 },
  { field: 'id_bidang_minat', headerName: 'id_bidang_minat', width: 100 },
  { field: 'id_perguruan_tinggi_asal', headerName: 'id_perguruan_tinggi_asal', width: 100 },
  { field: 'nama_perguruan_tinggi_asal', headerName: 'nama_perguruan_tinggi_asal', width: 100 },
  { field: 'nama_prodi_asal', headerName: 'nama_prodi_asal', width: 100 },
  { field: 'sks_diakui', headerName: 'sks_diakui', width: 100 },
  { field: 'biaya_nama', headerName: 'biaya_nama', width: 100 },
  {
    field: 'biaya_masuk', headerName: 'biaya_masuk', width: 100, renderCell: (params) => {
      return (
        <div>
          {
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(params.row.biaya_masuk)
          }
        </div>
      )
    },
    sortComparator: (v1, v2) => v1.name.localeCompare(v2.name)
  },
  { field: 'tanggal_daftar', headerName: 'tanggal_daftar', width: 100 },
  { field: 'masuk_nama', headerName: 'masuk_nama', width: 100 },
  {
    field: 'status_error', headerName: 'Status', width: 150, renderCell: (params) => {
      return (
        <div>
          {
            (params.row.status_error == 0) ? <Chip label="Belum Dieksekusi" variant="filled" /> : (params.row.status_error == 1) ? <Chip label="Sukses" variant="outlined" color='success' /> : <div><Chip label="Error" variant="outlined" color='error' /> <br /> {params.row.keterangan}</div>
          }
        </div>
      )
    },
    sortComparator: (v1, v2) => v1.name.localeCompare(v2.name)
  },
];

export default function Home(props) {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState([]);
  const router = useRouter();
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [page, filter]);

  const getData = async () => {
    const result = await fetch('http://192.168.0.35/feeder-backend/public/api/mahasiswa?page=' + (page + 1), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        'filter': filter
      })
    });

    const res = await result.json();
    if (res.status) {
      setData(res.data.rows);
      setTotalData(res.data.pager.total);
    } else {
      if (res.message == 'Unauthorized access') {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        alert('Terjadi Kesalahan ' + res.message);
      }
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <MenuFeeder />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }} color>
        <Toolbar />
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom align='left'>
              Biodata Mahasiswa
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Link href="/mahasiswa/import">
                  <Button style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                  }}>Import From Oasis</Button>
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Link href="/mahasiswa/history/list">
                  <Button
                    color='secondary'
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      float: 'right',
                    }}>History Import</Button>
                </Link>
              </Grid>
            </Grid>
            <div style={{ height: '100vh', width: '100%' }}>
              <DataGrid
                rows={data}
                columns={columns}
                pageSize={20}
                rowsPerPageOptions={[20]}
                rowCount={totalData}
                page={page}
                paginationMode="server"
                onPageChange={(e) => {
                  setPage(e);
                }}
                onSortModelChange={(model, detail) => {

                }}
                onFilterModelChange={
                  (model, details) => {
                    setFilter(model.items);
                  }
                }
              />
            </div>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
