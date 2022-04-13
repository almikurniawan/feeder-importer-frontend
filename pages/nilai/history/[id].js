import { CardContent, Grid, LinearProgress } from '@mui/material';
import { Box, Toolbar, Typography, CssBaseline, FormControl, TextField, Card, Chip, InputLabel, Select, MenuItem, Button } from '@mui/material';
import Header from '../../../components/header';
import MenuFeeder from '../../../components/menu';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { blue } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';

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
                        (params.row.status_error == 0) ? <Chip label="Belum Dieksekusi" variant="filled" /> : (params.row.status_error == 1) ? <Chip label="Sukses" variant="outlined" color='success' /> : <div><Chip label="Error" variant="outlined" color='error' /> <br /> {params.row.keterangan}</div>
                    }
                </div>
            )
        },
        sortComparator: (v1, v2) => v1.name.localeCompare(v2.name)
    },
];

export default function Home() {
    const [isBussy, setBussy] = useState(false);
    const [isBussyDelete, setBussyDelete] = useState(false);
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [rowSelected, setRowSelected] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [proses, setProses] = useState(0);
    const [totalProses, setTotalProses] = useState(0);
    const [filter, setFilter] = useState([]);

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getData();
    }, [page, filter]);

    const getData = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilai/nilai/' + id + '?page=' + (page + 1), {
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
        setBussy(false);
        if (res.status) {
            setData(res.data.nilai);
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

    const pushNeoFeeder = async (data) => {
        setBussy(true);
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilai/push/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });

        const res = await result.json();
        if (res.status) {
            getProgress();
        } else {
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }

    const getProgress = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilai/progress/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const res = await result.json();
        if (res.data.nil_head_eksekusi_total == null) {
            setTimeout(() => {
                getProgress();
            }, 10000);
        } else {
            setProses(res.data.nil_head_eksekusi);
            setTotalProses(res.data.nil_head_eksekusi_total);
            if (parseInt(res.data.nil_head_eksekusi) < parseInt(res.data.nil_head_eksekusi_total)) {
                setTimeout(() => {
                    getProgress();
                }, 10000);
            }
            else {
                setBussy(false);
                getData();
            }
        }
    }

    const deleteData = async () => {
        setBussyDelete(true);
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilai/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                id: rowSelected
            })
        });

        const res = await result.json();
        setBussyDelete(false);
        if (res.status) {
            getData();
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
                            List Nilai Perkuliahan
                        </Typography>
                        <Button variant="contained"
                            disabled={isBussy}
                            color="secondary"
                            onClick={() => {
                                setBussy(true);
                                pushNeoFeeder();
                            }}
                        > {
                                (isBussy) ? <ClipLoader size={24} color={blue[500]} css={{ marginRight: '5px' }} /> : <></>
                            } Push ke Neo Feeder</Button>

                        <Button variant="contained"
                            disabled={isBussyDelete}
                            color="error"
                            onClick={() => {
                                setBussyDelete(true);
                                deleteData();
                            }}
                            style={{ float: 'right' }}
                        > {
                                (isBussyDelete) ? <ClipLoader size={24} color={blue[500]} css={{ marginRight: '5px' }} /> : <></>
                            } Hapus Data</Button>

                        {
                            (isBussy) ?
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <LinearProgress variant="determinate" value={(proses / totalProses * 100)} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom align='left'>
                                            Proses import data ke {proses} dari {totalProses} data
                                        </Typography>
                                    </Grid>
                                </Grid> : <></>
                        }
                        <div style={{ height: '100vh', width: '100%', marginTop: '15px' }}>
                            <DataGrid
                                rows={data}
                                columns={columns}
                                pageSize={20}
                                rowsPerPageOptions={[20]}
                                rowCount={totalData}
                                page={page}
                                checkboxSelection
                                onSelectionModelChange={(ids) => {
                                    setRowSelected(ids);
                                }}
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