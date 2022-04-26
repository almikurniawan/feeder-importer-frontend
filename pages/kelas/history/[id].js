import { Box, Toolbar, Typography, CssBaseline, FormControl, TextField, Card, Chip, InputLabel, Select, MenuItem, Button , CardContent, Grid, Icon, LinearProgress, Menu, Modal} from '@mui/material';
import Header from '../../../components/header';
import MenuFeeder from '../../../components/menu';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { blue } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';
import MenuIcon from '@mui/icons-material/Menu';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { set } from 'date-fns';

const columns = [
    { field: 'semester', headerName: 'Semester', width: 70 },
    { field: 'kode_mk', headerName: 'Kode MK', width: 100 },
    { field: 'nama_mk', headerName: 'Nama MK', width: 130 },
    { field: 'sks', headerName: 'SKS', width: 100 },
    { field: 'nama_kelas', headerName: 'Nama Kelas', width: 130 },
    { field: 'tgl_mulai_koas', headerName: 'Tgl Mulai', width: 100 },
    { field: 'tgl_selesai_koas', headerName: 'Tgl Selesai', width: 100 },
    { field: 'bahasan_case', headerName: 'BAHASAN', width: 150 },
    { field: 'lingkup_nama', headerName: 'Lingkup', width: 100 },
    { field: 'mode_nama', headerName: 'Mode', width: 100 },
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

const refLingkup = [
    {
        'id': 1,
        'value': 'Internal'
    },
    {
        'id': 2,
        'value': 'Eksternal'
    },
    {
        'id': 3,
        'value': 'Campuran'
    }
];

const refMode = [
    {
        'id': 'O',
        'value': 'Online'
    },
    {
        'id': 'F',
        'value': 'Offline'
    },
    {
        'id': 'M',
        'value': 'Campuran'
    }
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
    const [openModalTanggal, setOpenModalTanggal] = useState(false);
    const [tanggalMulai, setTanggalMulai] = useState(new Date());
    const [tanggalSelesai, setTanggalSelesai] = useState(new Date());
    const [openModalBahasan, setOpenModalBahasan] = useState(false);
    const [bahasan, setBahasan] = useState('');
    const [openModalLingkup, setOpenModalLingkup] = useState(false);
    const [lingkup, setLingkup] = useState(0);
    const [openModalMode, setOpenModalMode] = useState(false);
    const [mode, setMode] = useState('');
    const [openModalNamaKelas, setOpenModalNamaKelas] = useState(false);
    const [namaKelas, setNamaKelas] = useState('');
    const [openModalKodeMatkul, setOpenModalKodeMatkul] = useState(false);
    const [kodeMatkul, setKodeMatkul] = useState('');

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
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/kelas/' + id + '?page=' + (page + 1), {
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
                console.log('Unauthorized access');
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }

    const saveNamaKelas = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/updateNama/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'nama_kelas': namaKelas
            })
        });

        const res = await result.json();
        if (res.status) {
            setOpenModalNamaKelas(false);
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

    const saveTanggal = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/updateTanggal/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'tanggal_mulai': tanggalMulai.toISOString().slice(0, 10),
                'tanggal_selesai': tanggalSelesai.toISOString().slice(0, 10)
            })
        });

        const res = await result.json();
        if (res.status) {
            setOpenModalTanggal(false);
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

    const saveBahasan = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/updateBahasan/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'bahasan': bahasan,
            })
        });

        const res = await result.json();
        if (res.status) {
            setOpenModalBahasan(false);
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

    const saveLingkup = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/updateLingkup/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            'id': rowSelected,
            'lingkup': lingkup,
        })
    });

        const res = await result.json();
        if (res.status) {
            setOpenModalLingkup(false);
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

    const saveMode = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/updateMode/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'mode': mode,
            })
        });
        const res = await result.json();
        if (res.status) {
            setOpenModalMode(false);
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

    const saveKodeMatkul = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/updateKode/' + id , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'kode_matkul': kodeMatkul,
            })
        });
        const res = await result.json();
        if (res.status) {
            setOpenModalKodeMatkul(false);
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

    const pushNeoFeeder = async (data) => {
        setBussy(true);
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/push/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const res = await result.json();
        if (res.status) {
            getProgress();
        } else {
            setBussy(false);
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }

    const getProgress = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/progress/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const res = await result.json();
        if (res.data.kelas_head_eksekusi_total == null) {
            setTimeout(() => {
                getProgress();
            }, 10000);
        } else {
            setProses(res.data.kelas_head_eksekusi);
            setTotalProses(res.data.kelas_head_eksekusi_total);
            if (parseInt(res.data.kelas_head_eksekusi) < parseInt(res.data.kelas_head_eksekusi_total)) {
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
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/kelas/delete', {
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex' }}>
            <Modal
                open={openModalKodeMatkul}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit Kode Matkul
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
                                    <TextField id="kode_matkul" label="Kode Matkul" variant="outlined" fullWidth value={kodeMatkul} onChange={(e) => setKodeMatkul(e.target.value)} />
                                </Grid>
                                <Grid item md={12}>
                                    <Button variant="contained"
                                        onClick={() => {
                                            saveKodeMatkul();
                                        }}
                                    > Simpan</Button>
                                    <Button variant="contained" color='warning' style={{marginLeft : '10px'}}
                                        onClick={() => {
                                            setOpenModalKodeMatkul(false);
                                        }}
                                    > Close</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Typography>
                </Box>
            </Modal>
            <Modal
                    open={openModalNamaKelas}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Nama Kelas
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
                                    <TextField style={{ width: '100%' }} label="Nama Kelas" variant="outlined" value={namaKelas}
                                            onChange={(e) => setNamaKelas(e.target.value)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveNamaKelas();
                                            }}
                                        > Simpan</Button>
                                        <Button variant="contained" color='warning' style={{marginLeft : '10px'}}
                                            onClick={() => {
                                                setOpenModalNamaKelas(false);
                                            }}
                                        > Close</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>

                <Modal
                    open={openModalTanggal}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Tanggal
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
                                        <DatePicker
                                            fullWidth
                                            label="Tanggal Mulai"
                                            value={tanggalMulai}
                                            onChange={(newValue) => {
                                                setTanggalMulai(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <DatePicker
                                            fullWidth
                                            label="Tanggal Selesai"
                                            value={tanggalSelesai}
                                            onChange={(newValue) => {
                                                setTanggalSelesai(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveTanggal();
                                            }}
                                        > Simpan</Button>
                                        <Button variant="contained" color='warning' style={{marginLeft : '10px'}}
                                            onClick={() => {
                                                setOpenModalTanggal(false);
                                            }}
                                        > Close</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>

                <Modal
                    open={openModalBahasan}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Bahasan
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

                                        <TextField style={{ width: '100%' }} label="Bahasan" variant="outlined" value={bahasan}
                                            onChange={(e) => setBahasan(e.target.value)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveBahasan();
                                            }}
                                        > Simpan</Button>
                                        <Button variant="contained" color='warning' style={{marginLeft : '10px'}}
                                            onClick={() => {
                                                setOpenModalBahasan(false);
                                            }}
                                        > Close</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>

                <Modal
                    open={openModalLingkup}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Lingkup
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

                                        <FormControl style={{ width: '100%' }} variant="outlined">
                                            <InputLabel id="label-semester">Lingkup</InputLabel>
                                            <Select
                                                labelId='label-semester'
                                                id="label-semester"
                                                value={lingkup}
                                                label="Lingkup"
                                                onChange={(e) => setLingkup(e.target.value)}
                                            >
                                                {
                                                    refLingkup.map((item, index) => {
                                                        return (
                                                            <MenuItem value={item.id} key={index}>{item.value}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveLingkup();
                                            }}
                                        > Simpan</Button>
                                        <Button variant="contained" color='warning' style={{marginLeft : '10px'}}
                                            onClick={() => {
                                                setOpenModalLingkup(false);
                                            }}
                                        > Close</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>

                <Modal
                    open={openModalMode}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Mode
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

                                        <FormControl style={{ width: '100%' }} variant="outlined">
                                            <InputLabel id="label-semester">Mode</InputLabel>
                                            <Select
                                                labelId='label-semester'
                                                id="label-semester"
                                                value={mode}
                                                label="Mode"
                                                onChange={(e) => setMode(e.target.value)}
                                            >
                                                {
                                                    refMode.map((item, index) => {
                                                        return (
                                                            <MenuItem value={item.id} key={index}>{item.value}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveMode();
                                            }}
                                        > Simpan</Button>
                                        <Button variant="contained" color='warning' style={{marginLeft : '10px'}}
                                            onClick={() => {
                                                setOpenModalMode(false);
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
                                        setOpenModalKodeMatkul(true);
                                    }}>Kode Matkul</MenuItem>
                                    <MenuItem id='menu-1' onClick={(e) => {
                                        setOpenModalNamaKelas(true);
                                    }}>Nama Kelas</MenuItem>
                                    <MenuItem id='menu-1' onClick={(e) => {
                                        setOpenModalTanggal(true);
                                    }}>Tanggal Mulai & Selesai</MenuItem>
                                    <MenuItem id='menu-2' onClick={(e) => {
                                        setOpenModalBahasan(true);
                                    }}>Bahasan</MenuItem>
                                    <MenuItem id='menu-3' onClick={(e) => {
                                        setOpenModalLingkup(true);
                                    }}>Lingkup</MenuItem>
                                    <MenuItem id='menu-4' onClick={(e) => {
                                        setOpenModalMode(true);
                                    }}>Mode</MenuItem>
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
                                        console.log(e);
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
        </LocalizationProvider>
    )
}