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
    { field: 'nama', headerName: 'Nama', width: 230 },
    { field: 'semester', headerName: 'Semester', width: 100 },
    { field: 'ips', headerName: 'IPS', width: 100 },
    { field: 'ipk', headerName: 'IPK', width: 100 },
    { field: 'sks_smt', headerName: 'SKS', width: 100 },
    { field: 'sks_total', headerName: 'SKS Total', width: 100 },
    { field: 'status_kuliah', headerName: 'Status Kuliah', width: 100 },
    { field: 'biaya_smt', headerName: 'UKT', width: 100 },
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
    const [openModalIpk, setOpenModalIpk] = useState(false);
    const [openModalSks, setOpenModalSks] = useState(false);
    const [openModalStatus, setOpenModalStatus] = useState(false);
    const [openModalUkt, setOpenModalUkt] = useState(false);
    const [ipk, setIpk] = useState(0);
    const [sks, setSks] = useState(0);
    const [status, setStatus] = useState(0);
    const [ukt, setUkt] = useState(0);

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
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/akm/akm/' + id + '?page=' + (page + 1), {
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
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/akm/push/' + id, {
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
        setBussy(true);
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/akm/progress/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const res = await result.json();
        if (res.data.akm_head_eksekusi_total == null) {
            setTimeout(() => {
                getProgress();
            }, 10000);
        } else {
            setProses(res.data.akm_head_eksekusi);
            setTotalProses(res.data.akm_head_eksekusi_total);
            if (parseInt(res.data.akm_head_eksekusi) < parseInt(res.data.akm_head_eksekusi_total)) {
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

    const saveIpk = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/akm/updateIpk/' + id + '?page=' + page, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'ipk': ipk
            })
        });

        const res = await result.json();
        if (res.status) {
            setOpenModalIpk(false);
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

    const saveSks = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/akm/updateSks/' + id + '?page=' + page, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'sks': sks
            })
        });

        const res = await result.json();
        if (res.status) {
            setOpenModalSks(false);
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

    const saveStatus = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/akm/updateStatus/' + id + '?page=' + page, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'status': status
            })
        });

        const res = await result.json();
        if (res.status) {
            setOpenModalStatus(false);
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

    const saveUkt = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/akm/updateUkt/' + id + '?page=' + page, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'ukt': ukt
            })
        });

        const res = await result.json();
        if (res.status) {
            setOpenModalUkt(false);
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
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/akm/delete', {
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
                    open={openModalIpk}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit IPK
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
                                    <TextField style={{ width: '100%' }} label="IPK" variant="outlined" value={ipk}
                                            onChange={(e) => setIpk(e.target.value)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveIpk();
                                            }}
                                        > Simpan</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>
                <Modal
                    open={openModalSks}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit SKS
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
                                    <TextField style={{ width: '100%' }} label="SKS" variant="outlined" value={sks}
                                            onChange={(e) => setSks(e.target.value)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveSks();
                                            }}
                                        > Simpan</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>
                <Modal
                    open={openModalStatus}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Status
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
                                    <TextField style={{ width: '100%' }} label="Status" variant="outlined" value={status}
                                            onChange={(e) => setStatus(e.target.value)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveStatus();
                                            }}
                                        > Simpan</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>
                <Modal
                    open={openModalUkt}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit UKT
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
                                    <TextField style={{ width: '100%' }} label="UKT" variant="outlined" value={ukt}
                                            onChange={(e) => setUkt(e.target.value)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveUkt();
                                            }}
                                        > Simpan</Button>
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
                            List AKM
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
                                    setOpenModalIpk(true);
                                }}>IPK</MenuItem>
                                <MenuItem id='menu-1' onClick={(e) => {
                                    setOpenModalSks(true);
                                }}>SKS Total</MenuItem>
                                <MenuItem id='menu-1' onClick={(e) => {
                                    setOpenModalStatus(true);
                                }}>Status Kuliah</MenuItem>
                                <MenuItem id='menu-1' onClick={(e) => {
                                    setOpenModalUkt(true);
                                }}>UKT</MenuItem>
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