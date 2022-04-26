import { Box, Toolbar, Typography, CssBaseline, FormControl, TextField, Card, Chip, InputLabel, Select, MenuItem, Button, CardContent, Grid, Icon, LinearProgress, Menu, Modal } from '@mui/material';
import Header from '../../../components/header';
import MenuFeeder from '../../../components/menu';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { blue } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';
import MenuIcon from '@mui/icons-material/Menu';
        
const columns = [
    { field: 'nim', headerName: 'NIM', width: 70 },
    { field: 'kode_matkul_asal', headerName: 'Kode Matkul Asal', width: 70 },
    { field: 'nama_mata_kuliah_asal', headerName: 'Nama Matkul Asal', width: 130 },
    { field: 'sks_mata_kuliah_asal', headerName: 'SKS Matkul Asal', width: 70 },
    { field: 'nilai_huruf_asal', headerName: 'Nilai Huruf Asal', width: 70 },
    { field: 'kode_matkul_diakui', headerName: 'Kode Matkul Diakui', width: 70 },
    { field: 'nama_matkul_diakui', headerName: 'Nama Matkul Diakui', width: 130 },
    { field: 'sks_mata_kuliah_diakui', headerName: 'SKS Matkul Diakui', width: 70 },
    { field: 'nilai_angka_diakui', headerName: 'Nilai Angka Diakui', width: 70 },
    { field: 'nilai_huruf_diakui', headerName: 'Nilai Huruf Diakui', width: 70 },
    { field: 'nama_pt_asal', headerName: 'PT Asal', width: 150 },
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

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
    const [openModalPt, setOpenModalPt] = useState(false);
    const [namaPT, setNamaPT] = useState('');

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getData();
    }, [page, filter]);

    const getData = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilaiTransfer/nilai/' + id + '?page=' + (page + 1), {
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

    const pushNeoFeeder = async (data) => {
        setBussy(true);
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilaiTransfer/push/' + id, {
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
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilaiTransfer/progress/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const res = await result.json();
        if (res.data.trf_head_eksekusi_total == null) {
            setTimeout(() => {
                getProgress();
            }, 10000);
        } else {
            setProses(res.data.trf_head_eksekusi);
            setTotalProses(res.data.trf_head_eksekusi_total);
            if (parseInt(res.data.trf_head_eksekusi) < parseInt(res.data.trf_head_eksekusi_total)) {
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

    const savePT = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilaiTransfer/updateNama/' + id + '?page=' + page, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'nama_pt': namaPT
            })
        });

        const res = await result.json();
        if (res.status) {
            setOpenModalPt(false);
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

    const deleteData = async () => {
        setBussyDelete(true);
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilaiTransfer/delete', {
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
            <Modal
                    open={openModalPt}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit PT Asal
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Box
                                component="form"
                                noValidate
                                autoComplete="off"
                                sx={{
                                    width: 500,
                                    maxWidth: '100%',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item md={12}>
                                    <TextField style={{ width: '100%' }} label="Kode PT" variant="outlined" value={namaPT}
                                            onChange={(e) => setNamaPT(e.target.value)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                savePT();
                                            }}
                                        > Simpan</Button>
                                        <Button variant="contained" color='warning' style={{marginLeft : '10px'}}
                                            onClick={() => {
                                                setOpenModalPt(false);
                                            }}
                                        > Close</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>
            <CssBaseline />
            <Header />
            <MenuFeeder />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }} color>
                <Toolbar />
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" gutterBottom align='left'>
                            List Nilai Transfer
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
                        <div
                            style={{ float: 'right', marginRight: '10px' }}
                        >

                            <Button variant="contained"
                                disabled={isBussyDelete}
                                color="warning"
                                onClick={(event) => {
                                    setAnchorEl(event.currentTarget);
                                }}
                                id="demo-positioned-button"
                                aria-controls={open ? 'demo-positioned-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            > <MenuIcon /> Edit</Button>
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuItem id='menu-1' onClick={(e) => {
                                    setOpenModalPt(true);
                                }}>Perguruan Tinggi Asal</MenuItem>
                            </Menu>
                        </div>
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
                                pageSize={100}
                                rowsPerPageOptions={[100]}
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