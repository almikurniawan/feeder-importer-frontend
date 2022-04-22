import { CardContent, Chip } from '@mui/material';
import { Button, Grid, Box, Toolbar, Typography, CssBaseline, Container, Card, Paper } from '@mui/material';
import Header from '../../components/header';
import MenuFeeder from '../../components/menu';
import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const columns = [
  { field: 'nim', headerName: 'NIM', width: 70 },
  { field: 'nama', headerName: 'Nama', width: 130 },
  { field: 'kode_mk', headerName: 'Kode MK', width: 100 },
  { field: 'nama_mk', headerName: 'Nama MK', width: 130 },
  { field: 'nama_kelas', headerName: 'Nama Kelas', width: 130 },
  { field: 'nilai_huruf', headerName: 'Nilai Huruf', width: 70 },
  { field: 'nilai_indek', headerName: 'Nilai Indek', width: 70 },
  { field: 'nilai_angka', headerName: 'Nilai Angka', width: 70 },
  {
    field: 'status_error', headerName: 'Status', width: 150, renderCell: (params) => {
      return (
        <div>
          {
            (params.row.status_error == 0) ? <Chip label="Belum Dieksekusi" variant="filled" /> : (params.row.status_error == 1) ? <Chip label="Sukses" variant="outlined" color='success' /> : <div><Chip label="Error" variant="outlined" color='error' /> <br/>{params.row.keterangan}</div>
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

  const getData = async () =>{
    const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilai?page=' + (page+1), {
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
      setData(res.data.nilai);
      setTotalData(res.data.pager.total);
    } else {
      if(res.message=='Unauthorized access'){
        localStorage.removeItem('token');
        router.push('/login');
      }else{
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
              Nilai Transfer
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Link href="/nilai_trf/import">
                  <Button style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                  }}>Import From Oasis</Button>
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Link href="/nilai_trf/history/list">
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
                pageSize={100}
                rowsPerPageOptions={[100]}
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
